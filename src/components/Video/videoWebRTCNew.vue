/** * 视频播放窗口 */

<template>
  <div class="video-window">
    <video
      :id="bindId"
      ref="videoPlayer"
      class="centeredVideo"
      muted="“muted”"
      autoplay
    ></video>
    <!-- <div class="video_loading" v-if="timeOut > 0">
      获取视频中，请稍等({{ timeOut }}s)...
    </div>
    <div class="video_loading" v-else>获取视频失败...</div> -->
  </div>
</template>

<script>
import ZLMRTCClient from "./ZLMRTCClient.js";

export default {
  props: {
    bindId: {
      type: String,
      default: ""
    },
    src: {
      type: String,
      default: ""
    }
  },
  name: "video-window",
  watch: {
    src: function(newVal) {
      //不能用箭头函数
      this.form.src = newVal;
    }
  },

  data() {
    return {
      dataTimeout: null,
      timeOut: 30, //倒计时
      waiting: false,
      form: {
        ip: "",
        port: "",
        name: "",
        src:
          "http://192.168.0.98:80/index/api/webrtc?app=live&stream=20211215_84&type=play"
      },
      myVideo: {},
      player: null
    };
  },
  async created() {},
  mounted: function() {
    this.waiting = true;
    this.myVideo = document.getElementById(this.bindId);
    this.getList();
  },
  beforeDestroy() {
    if (this.player) {
      //关闭流
      this.player.pc.close();
      this.player = null;
      clearTimeout(this.dataTimeout);
      this.dataTimeout = null;
    }
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
      let that = this;
      this.timeOut = 30;
      setTimeout(() => {
        this.setTime();
      }, 1000);
      let path = this.src;
      console.log(123, this.src);
      this.player = new ZLMRTCClient.Endpoint({
        element: this.myVideo, // video 标签
        debug: true, // 是否打印日志
        zlmsdpUrl: path, //流地址
        simulcast: true,
        useCamera: true,
        audioEnable: true,
        videoEnable: true,
        recvOnly: true,
        resolution: { w: 1920, h: 1080 },
        usedatachannel: false
      });

      this.player.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR, function(
        e
      ) {
        // ICE 协商出错
        console.log("ICE 协商出错");
      });

      this.player.on(ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS, function(e) {
        //获取到了远端流，可以播放
        console.log("播放成功", e.streams);
        clearTimeout(that.dataTimeout);
        that.dataTimeout = null;

        that.myVideo.addEventListener("canplay", function(e) {
          that.myVideo.play();
        });
      });

      this.player.on(
        ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED,
        function(e) {
          // offer anwser 交换失败
          console.log("offer anwser 交换失败", e);
          stop();
        }
      );

      this.player.on(ZLMRTCClient.Events.WEBRTC_ON_LOCAL_STREAM, function(s) {
        // 获取到了本地流

        document.getElementById("selfVideo").srcObject = s;
        document.getElementById("selfVideo").muted = true;

        //console.log('offer anwser 交换失败',e)
      });

      this.player.on(ZLMRTCClient.Events.CAPTURE_STREAM_FAILED, function(s) {
        // 获取本地流失败

        console.log("获取本地流失败");
      });

      this.player.on(
        ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE,
        function(state) {
          // RTC 状态变化 ,详情参考 https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
          console.log("当前状态==>", state);
          if (state === "failed") {
            that.rePlay();
          }
        }
      );

      this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_OPEN, function(
        event
      ) {
        console.log("rtc datachannel 打开 :", event);
      });

      this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_MSG, function(
        event
      ) {
        console.log("rtc datachannel 消息 :", event.data);
        document.getElementById("msgrecv").value = event.data;
      });
      this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_ERR, function(
        event
      ) {
        console.log("rtc datachannel 错误 :", event);
      });
      this.player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_CLOSE, function(
        event
      ) {
        console.log("rtc datachannel 关闭 :", event);
      });
    },
    //停止播放
    stop() {
      clearTimeout(this.dataTimeout);
      this.dataTimeout = null;
      this.player.pc.close();
      this.player = null;
    },
    //
    rePlay() {
      this.dataTimeout = setTimeout(() => {
        console.log("获取本地流失败");
        this.player.pc.close();
        this.player = null;
        setTimeout(() => {
          this.getList();
        }, 300);
      }, 5000);
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.video-window {
  position: relative;
  height: 100%;
  width: 100%;
  .centeredVideo {
    position: absolute;
    z-index: 1;
  }
  .video_loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    height: calc(50vh - 178px);
    line-height: calc(50vh - 178px);
    width: 100%;
    font-size: 18px;
    text-align: center;
    color: #ccc;
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
