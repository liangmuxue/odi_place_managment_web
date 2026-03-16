/**
 *  视频播放窗口
 */

<template>
  <div class="video-window">
    <video
      :id="bindId"
      ref="videoPlayer"
      class="centeredVideo"
      muted="muted"
      mode="no-cors"
      autoplay
      @dblclick="fullSizeSwitch(bindId, arguments)"
    ></video>
  </div>
</template>


<script>
import flvjs from "flv.js";

export default {
  props: {
    bindId: {
      type: String,
      default: "",
    },
    src: {
      type: String,
      default: "",
    },
  },
  name: "video-window",
  data() {
    return {
      videoObj: null,
    };
  },
  mounted: function () {
    if (flvjs.isSupported()) {
      const videoElement = this.$refs.videoPlayer;
      this.videoObj = flvjs.createPlayer({
        type: "flv",
        url: this.src,
      });
      this.videoObj.attachMediaElement(videoElement);
      this.videoObj.load();
      //加载后直接播放
      this.videoObj.play();
      // this.videoObj.currentTime = 100;
      this.videoObj.on(flvjs.Events.ERROR, (errType, errDetail) => {
        console.log("网络波动,正在尝试连接中...");
        console.log(111111, this.videoObj);
        // if (this.videoObj) {
        //   this.reloadVideo(this.videoObj);
        // }
        // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
        // errType是 MediaError时，对应errDetail是MediaMSEError   或MEDIA_SOURCE_ENDED
      });
      this.videoObj.on(flvjs.Events.STATISTICS_INFO, (res) => {
        // console.log("请求数据信息", res);
      });
    }
  },

  created() {},
  destroyed() {
    this.stop()
  },

  methods: {
    //播放视频
    toPlay() {},
    //停止播放
    stop() {
      this.videoObj.pause();
      this.videoObj.destroy();
    },
    fullSizeSwitch(vId, data) {
      console.log("fullSizeSwitch in");
      this.$emit("fullSizeSwitch", vId);
    },
  },
  watch: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.video-window {
  position: relative;
  background: rgba($color: #000, $alpha: 0.8);
  width: 100%;
  height: calc(100vh - 336px);
  .centeredVideo {
    position: absolute;
    height: calc(100vh - 336px);
    width: 100%;
    z-index: 1001;
  }
}
</style>