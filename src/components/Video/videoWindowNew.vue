/**
 *  视频播放窗口
 */

<template>
  <div class="video-window">
    <!-- <div class="video-top">
      <div class="camera_name">{{cameraName}}</div>
      <div class="camera_speed">{{sppeed}}kb/s</div>
    </div> -->
    <video
      :id="bindId"
      ref="videoPlayer"
      class="centeredVideo"
      autoplay
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
    cameraName: {
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
      decodedFrames: null,
      sppeed: "",
    };
  },
  created() {},
  mounted: function () {
    this.init();
    this.decodedFrames = 0;
  },
  beforeDestroy() {
    if (this.src) {
      this.stop();
    }
  },
  methods: {
    //开始播放
    init() {
      if (!this.src) {
        this.$message({
          type: "warning",
          message: "暂无视频",
        });
      } else if (flvjs.isSupported()) {
        const videoElement = this.$refs.videoPlayer;
        //   videoElement.addEventListener('play', function(e) {
        //   console.log('提示该视频正在播放中')
        // })
        this.videoNo = videoElement.id;
        this.videoObj = flvjs.createPlayer({
          type: "flv",
          url: this.src,
          autoCleanupSourceBuffer: true,
          enableWorker: true, // 启用分离的线程进行转换
          enableStashBuffer: false, // 关闭IO隐藏缓冲区
          stashInitialSize: 128, // 减少首帧显示等待时长
        });
        this.interval = setInterval(() => {
          if (this.videoObj.speed) {
            this.$emit(
              "speed",
              this.videoNo,
              this.videoObj.statisticsInfo.speed.toFixed(2)
            );
            this.sppeed = this.videoObj.statisticsInfo.speed.toFixed(2);
          }
        }, 1000);

        this.videoObj.attachMediaElement(videoElement);
        this.videoObj.load();
        //加载后直接播放
        this.videoObj.play();

        // 点击播放按钮后，更新视频
        // videoElement.addEventListener("play", () => {
        //   let end = this.videoObj.buffered.end(0) - 1;
        //   this.videoObj.currentTime = end;
        // });
        let lastDecodedFrame = 0;
        this.videoObj.on("statistics_info", (res) => {
          // console.log("处理卡死", res.decodedFrames);
          if (lastDecodedFrame == 0) {
            lastDecodedFrame = res.decodedFrames;
            setTimeout(() => {
              if (this.decodedFrames == 0) {
                this.decodedFrames = 1;
                this.rePlay();
              }
              return;
            }, 3000);
            return;
          }
          if (lastDecodedFrame != res.decodedFrames) {
            lastDecodedFrame = res.decodedFrames;
          } else {
            lastDecodedFrame = 0;
            this.rePlay();
          }
        });

        // this.videoObj.on(flvjs.Events.ERROR, (e) => {
        //   console.log("播放重连");
        //   // destroy
        //   setTimeout(() => {
        // this.videoObj.pause();
        // this.videoObj.unload();
        // this.videoObj.detachMediaElement();
        // this.videoObj.destroy();
        //     this.videoObj = null;
        //     // 进行重建的逻辑，这里不再展开
        //     this.init();
        //   }, 3000);
        // });
      }
    },
    rePlay() {
      this.videoObj.pause();
      this.videoObj.unload();
      this.videoObj.detachMediaElement();
      this.videoObj.destroy();
      this.init();
    },
    //停止播放
    stop() {
      this.videoObj.pause();
      this.videoObj.unload();
      this.videoObj.detachMediaElement();
      this.videoObj.destroy();
    },
  },
  watch: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.video-window {
  position: relative;
  z-index: 1;
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