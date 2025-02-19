/** * 视频播放窗口 */

<template>
  <div class="video-window">
    <!-- <div class="video-top">
      <div class="camera_name">{{cameraName}}</div>
      <div class="camera_speed">{{sppeed}}kb/s</div>
    </div>-->
    <!-- id="videoElem" -->
    <video
      :id="bindId"
      ref="videoPlayer"
      class="centeredVideo"
      autoplay
      @dblclick="fullSizeSwitch(bindId, arguments)"
    ></video>
  </div>
</template>

<script>
import flvjs from "flv.js";
import Vue from "vue";

export default {
  props: {
    bindId: {
      type: String,
      default: ""
    },
    cameraName: {
      type: String,
      default: ""
    },
    src: {
      type: String,
      default: ""
    }
  },
  name: "video-window",
  watch: {},

  data() {
    return {
      dataChanellPingInterval: null,
      suuid: "H264_PCMALAW",
      myVideo: {}
    };
  },
  async created() {},
  mounted: function() {
    this.myVideo = document.getElementById(this.bindId);
    this.getList();
  },
  methods: {
    //获取视频数据
    getList() {
      let vid = this.myVideo;
      let stream = new MediaStream();
      let suuid = "H264_PCMALAW";
      let config = {
        iceServers: [
          {
            urls: ["stun:stun.l.google.com:19302"]
          }
        ]
      };

      const pc = new RTCPeerConnection(config);
      pc.onnegotiationneeded = handleNegotiationNeededEvent;

      pc.ontrack = function(event) {
        stream.addTrack(event.track);
        vid.srcObject = stream;
      };

      async function handleNegotiationNeededEvent() {
        let offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        getRemoteSdp();
      }

      $(document).ready(function() {
        getCodecInfo();
      });

      function getCodecInfo() {
        $.get("http://192.168.0.98:8183/stream/codec/" + suuid, function(data) {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.log(e);
          } finally {
            $.each(data, function(index, value) {
              pc.addTransceiver(value.Type, {
                direction: "sendrecv"
              });
            });
            //send ping becouse PION not handle RTCSessionDescription.close()
            sendChannel = pc.createDataChannel("foo");
            sendChannel.onclose = () => {
              if (this.dataChanellPingInterval != null) {
                clearInterval(this.dataChanellPingInterval);
                this.dataChanellPingInterval = null;
              }
              console.log("sendChannel has closed");
            };
            sendChannel.onopen = () => {
              console.log("sendChannel has opened");
              sendChannel.send("ping");
              this.dataChanellPingInterval = setInterval(() => {
                sendChannel.send("ping");
              }, 1000);
            };
          }
        });
      }

      let sendChannel = null;

      function getRemoteSdp() {
        $.post(
          "http://192.168.0.98:8183/stream/receiver/" + suuid,
          {
            suuid: suuid,
            data: btoa(pc.localDescription.sdp)
          },
          function(data) {
            try {
              pc.setRemoteDescription(
                new RTCSessionDescription({
                  type: "answer",
                  sdp: atob(data)
                })
              );
            } catch (e) {
              console.warn(e);
            }
          }
        );
      }
    },
    //停止播放
    stop() {
      clearInterval(this.dataChanellPingInterval);
      this.dataChanellPingInterval = null;
    },
    fullSizeSwitch(vId, data) {
      this.$emit("fullSizeSwitch", vId);
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.video-top {
  height: 16px;
  line-height: 16px;
  display: flex;
  justify-content: space-between;
  .camera_name {
    position: absolute;
    top: -14px;
    left: 5px;
    height: 14px;
    line-height: 14px;
    color: #6ca6e8;
  }
  .camera_speed {
    position: absolute;
    top: -14px;
    right: 5px;
    height: 14px;
    line-height: 14px;
    color: #333;
  }
}
.centeredVideo {
  height: 100%;
  width: 100%;
}
</style>
