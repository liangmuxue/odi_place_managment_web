/** * 视频播放窗口 */

<template>
  <div class="video-window">
    <div class="video_tittle">{{cameraName}}</div>
    <canvas
      :id="bindId"
      ref="videoPlayer"
      class="centeredVideo"
      autoplay
      @dblclick="fullSizeSwitch(bindId, arguments)"
    ></canvas>
  </div>
</template>

<script>
export default {
  props: {
    bindId: {
      type: String,
      default: ""
    },
    src: {
      type: String,
      default: ""
    },
    cameraName: {
      type: String,
      default: ""
    }
  },
  name: "video-window",
  data() {
    return {
      videoObj: null
    };
  },
  created() {},
  mounted: function() {
    const canvas = this.$refs.videoPlayer;
    this.videoObj = new JSMpeg.Player(this.src, { canvas: canvas });
    //加载后直接播放
    this.videoObj.play();
  },
  methods: {
    //停止播放
    stop() {
      this.videoObj.pause();
      this.videoObj.destroy();
    },
    fullSizeSwitch(vId, data) {
      console.log("fullSizeSwitch in");
      this.$emit("fullSizeSwitch", vId);
    }
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.full-size-area {
  .centeredVideo {
  height: calc(100vh - 415px);
  width: calc(100vw - 820px);
  }
}
.video-window {
  position: relative;
  left: 0;
  top: 0;
  .video_tittle {
    position: absolute;
    left: 5px;
    top: -20px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    font-size: 12px;
  }
  .centeredVideo {
    height: 100%;
    width: 100%;
  }
}
</style>
