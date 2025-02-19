/**
 *  视频播放窗口
 */

<template>
  <div class="video-window">
    <video
      :id="bindId"
      class="centeredVideo"
      ref="video"
      muted="“muted”"
      autoplay
    ></video>
  </div>
</template>
 <script>
let Hls = require("hls.js");
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    bindId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      hls: null,
      loadingVideo: false,
      waiting: false,
      timeOut: 30, //倒计时
    };
  },
  mounted() {
    this.waiting = true;
    this.getStream();
  },
  beforeDestroy() {
    this.videoPause();
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

    getStream() {
      this.timeOut = 30;
      setTimeout(() => {
        this.setTime();
      }, 1000);
      console.log(888,Hls)

      if (Hls.isSupported()) {
        this.hls = new Hls();
        let path = this.src;
        this.hls.loadSource(path);
        this.hls.attachMedia(this.$refs.video);
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("加载成功");
          this.loadingVideo = false;
          this.waiting = false;
          this.$refs.video.play();
        });
        this.hls.on(Hls.Events.ERROR, (event, data) => {
          this.loadingVideo = false;
          this.waiting = false;
          console.log("加载失败");
          this.timeOut = 0;
        });
      } else if (
        this.$refs.video.canPlayType("application/vnd.apple.mpegurl")
      ) {
        this.$refs.video.src = this.src;
        this.$refs.video.addEventListener("loadedmetadata", function () {
          this.$refs.video.play();
        });
      }
    },
    // 停止流
    videoPause() {
      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
        this.$refs.video.pause();
      }
    },
  },
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
}
.centeredVideo {
  height: 100%;
  width: 100%;
}
</style>



