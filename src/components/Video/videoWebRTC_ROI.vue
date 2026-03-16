/**
 *  视频播放窗口
 */

<template>
  <div
    class="video-window"
    @mouseover="onMouseOver()"
    @mouseleave="onMouseLeave()"
  >
    <!-- <div class="video-top">
      <div class="camera_name">{{cameraName}}</div>
      <div class="camera_speed">{{sppeed}}kb/s</div>
    </div>-->
    <!-- id="videoElem" -->
    <video
      id="ROIVideo"
      ref="videoPlayer"
      class="centeredVideo"
      muted="“muted”"
      autoplay
      @dblclick="fullSizeSwitch('ROIVideo', arguments)"
    ></video>
    <div class="video_loading" v-if="timeOut > 0">
      获取视频中，请稍等({{ timeOut }}s)...
    </div>
    <div class="video_loading" v-else>获取视频失败...</div>

    <!-- <transition name="plus-icon">
      <div class="small_window_button" v-if="buttonShow">
        <i
          class="el-icon-zoom-in"
          @click="bigSizeSwitch('ROIVideo', arguments)"
        ></i>
      </div>
    </transition> -->
  </div>
</template>

<script>
export default {
  props: {
    cameraName: {
      type: String,
      default: "",
    },
    ip: {
      type: String,
      default: "",
    },
    port: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    videoPath: {
      type: String,
      default: "",
    },
    src: {
      type: String,
      default: "",
    },
  },
  name: "video-window",
  watch: {
    ip: function (newVal) {
      //不能用箭头函数
      this.form.ip = newVal;
    },
    port: function (newVal) {
      //不能用箭头函数
      this.form.port = newVal;
    },
    name: function (newVal) {
      //不能用箭头函数
      this.form.name = newVal;
    },
    videoPath: function (newVal) {
      //不能用箭头函数
      this.form.videoPath = newVal;
    },
  },

  data() {
    return {
      dataChanellPingInterval: null,
      suuid: "H264_PCMALAW",
      buttonShow: false, //大屏按钮显示隐藏
      timeOut: 30, //倒计时
      waiting: false,
      form: {
        ip: "",
        port: "",
        name: "",
        videoPath: "",
      },
      myVideo: {},
    };
  },
  async created() {},
  mounted: function () {
    this.waiting = true;
    this.myVideo = document.getElementById("ROIVideo");
    this.getList();
  },
  methods: {
    setTime() {
      if (this.timeOut > 0) {
        this.timeOut -= 1;
        setTimeout(() => {
          this.setTime();
        }, 1000);
      }
    },
    //获取视频数据
    getList() {
      this.timeOut = 30;
      setTimeout(() => {
        this.setTime();
      }, 1000);

      let vid = this.myVideo;
      let stream = new MediaStream();
      let ip = this.ip;
      let port = this.port;
      let name = this.name;
      let videoPath = this.videoPath;
      let config = {
        iceServers: [
          {
            urls: ["stun:stun.l.google.com:19302"],
          },
        ],
      };

      const pc = new RTCPeerConnection(config);
      pc.onnegotiationneeded = handleNegotiationNeededEvent;

      pc.ontrack = function (event) {
        stream.addTrack(event.track);
        vid.srcObject = stream;
      };

      async function handleNegotiationNeededEvent() {
        let offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        getRemoteSdp();
      }

      $(document).ready(function () {
        getCodecInfo();
      });

      let sendChannel = null;

      function getCodecInfo() {
        // $.get("http://" + ip + ":" + port + "/stream/codec/" + name, function (
        //   data
        // ) {
        //   try {
        //     data = JSON.parse(data);
        //   } catch (e) {
        //     // console.log(e);
        //   } finally {
        //     $.each(data, function (index, value) {
        pc.addTransceiver("video", {
          direction: "sendrecv",
        });

        //     });
        //send ping becouse PION not handle RTCSessionDescription.close()
        sendChannel = pc.createDataChannel("foo");
        sendChannel.onclose = () => {
          this.waiting = false;
          if (this.dataChanellPingInterval != null) {
            clearInterval(this.dataChanellPingInterval);
            this.dataChanellPingInterval = null;
          }
          console.log("sendChannel has closed");
        };
        sendChannel.onopen = () => {
          this.waiting = false;
          console.log("sendChannel has opened");
          sendChannel.send("ping");
          this.dataChanellPingInterval = setInterval(() => {
            sendChannel.send("ping");
          }, 1000);
        };
        sendChannel.onmessage = (e) => console.log(e.data);
        //   }
        // });
      }

      function getRemoteSdp() {
        let ip;
        if (window.location.hostname == "localhost") {
          ip = "http://192.168.0.19";
        } else {
          ip = "http://" + window.location.hostname;
        }
        let path = ip + videoPath;
        $.post(
          // "http://" + ip + ":" + port + "/stream/receiver/" + name,
          // "http://192.168.0.17:8083/stream/a837d332-0667-4f89-b780-43ff52a99321/channel/0/webrtc?uuid=a837d332-0667-4f89-b780-43ff52a99321&channel=0",
          path,
          {
            // suuid: 'a837d332-0667-4f89-b780-43ff52a99321',
            data: btoa(pc.localDescription.sdp),
            // channel:0
          },
          function (data) {
            try {
              pc.setRemoteDescription(
                new RTCSessionDescription({
                  type: "answer",
                  sdp: atob(data),
                })
              );
            } catch (e) {
              console.warn(e);
            }
          }
        );
      }
    },
    //鼠标移上
    onMouseOver() {
      this.buttonShow = true;
    },
    //鼠标移出
    onMouseLeave() {
      this.buttonShow = false;
    },
    //停止播放
    stop() {
      clearInterval(this.dataChanellPingInterval);
      this.dataChanellPingInterval = null;
    },
    //全屏
    fullSizeSwitch(vId, data) {
      this.$emit("fullSizeSwitch", vId);
    },
    //大窗
    bigSizeSwitch(vId, data) {
      this.$emit("bigSizeSwitch", vId, true);
      this.buttonShow = false;
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.video-window {
  position: relative;
  width: 960px;
  height: 540px;
  background: rgba($color: #000, $alpha: 0.8);
  .centeredVideo {
    width: 960px;
    height: 540px;
    position: absolute;
    z-index: 1001;
  }
  .video_loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    height: 540px;
    line-height: 540px;
    width: 100%;
    text-align: center;
    color: #ccc;
  }

  .small_window_button {
    z-index: 1002;
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    background: rgba($color: #000000, $alpha: 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(0);
    /* 移回也需要0.4s时间过渡 */
    transition: transform 0.5s;
    i {
      width: 20px;
      height: 20px;
      font-size: 20px;
      color: #fff;
      cursor: pointer;
    }
  }
  .plus-icon-enter-active {
    transition: opacity 0.5s;
  }
  .plus-icon-enter {
    opacity: 0;
  }
  .plus-icon-leave-active {
    transition: opacity 0.5s;
  }
  .plus-icon-leave-to {
    opacity: 0;
  }
}
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
    color: #314ba0;
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