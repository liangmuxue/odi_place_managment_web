/** * 视频播放窗口 */

<template>
  <div class="video-back">
    <div id="videoPlayer_box">
      <video
        id="videoPlayer"
        ref="videoPlayer"
        crossOrigin="anonymous"
        :class="isFullWidth ? 'fullWidth' : ''"
        class="backVideo"
        :src="src"
      ></video>
    </div>
    <canvas
      :width="canvasWith"
      :height="canvasHeight"
      id="myCanvas"
      v-show="canvasShow"
    ></canvas>
    <div class="maskBox" v-if="showMask">网速过慢，可能会造成视频卡顿...</div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  props: {
    playState: {
      type: Number,
      default: 1
    },
    speedState: {
      type: Number,
      default: 1
    },
    voiceState: {
      type: Number,
      default: 0
    }
  },

  name: "video-back",
  data() {
    return {
      lastTime: null, //上一秒
      // src: "http://zkrh-dc.oss-cn-qingdao.aliyuncs.com/video/20211215-1640836011917.mp4", //视频路径
      src: "", //视频路径
      canvasShow: false,
      canvasWith: 0, //画布宽
      canvasHeight: 0, //画布高
      isFullWidth: false, //是否平铺画面
      showMask: false //网络加载失败
    };
  },
  mounted() {
    // this.toPlay();
  },

  created() {},
  destroyed() {
    // this.stop();
  },

  methods: {
    //播放视频
    //data(视频信息)
    //time(当前播放时间)
    toPlay(data, time) {
      let that = this;
      let first = true;
      if (document.getElementById("videoPlayer")) {
        that.lastTime = parseInt((time - data.createTime) / 1000);
        // that.src = data.videoUrl;
        that.src = data.videoPath;
        // that.src = 'http://zkrh-dc.oss-cn-qingdao.aliyuncs.com/video/20211215-1640692791945.mp4'
        let videoPlayer = document.getElementById("videoPlayer");
        this.$nextTick(() => {
          if (that.playState == 1) {
            videoPlayer.play();
          } else {
            videoPlayer.pause();
          }
          videoPlayer.playbackRate = that.speedState;
          videoPlayer.volume = that.voiceState / 100;
          videoPlayer.currentTime = parseInt((time - data.createTime) / 1000);
        });
        // videoPlayer.onerror  = function () {
        //   console.log(" 数据加载期间发生错误时触发");
        // };
        // videoPlayer.onabort   = function () {
        //   console.log(" 终止加载时触发");
        // };
        videoPlayer.onwaiting = function() {
          console.log(" 事件在视频由于要播放下一帧而需要缓冲时触发");
          if (!first) {
            that.showMask = true;
          }
          // console.log(111, that.showMask);
        };
        videoPlayer.addEventListener(
          "timeupdate",
          function() {
            let curTime = parseInt(videoPlayer.currentTime);
            if (curTime - that.lastTime >= 1) {
              // console.log("当前的时间点是", curTime);
              // console.log("上一秒时间", that.lastTime);
              that.lastTime = curTime;
              that.showMask = false;
              first = false;
              that.$emit("videoTimeChange");
            }
            // console.log("视频长度是",videoPlayer.duration);
          },
          false
        );
        videoPlayer.addEventListener(
          "ended",
          function() {
            console.log("播放结束");
            that.$emit("closeVideo");
            that.$emit("videoTimeChange");
          },
          false
        );
        videoPlayer.addEventListener(
          "error",
          function() {
            console.log("播放失败");
            that.$emit("videoErr");
            // that.$emit("videoTimeChange");
          },
          false
        );
      }
    },
    //时间跳转
    changeTime(data, time) {
      console.log(1110, time);
      let videoPlayer = document.getElementById("videoPlayer");
      videoPlayer.currentTime = parseInt((time - data.createTime) / 1000);
      this.lastTime = parseInt((time - data.createTime) / 1000);
    },
    //停止播放
    stop() {
      let videoPlayer = document.getElementById("videoPlayer");
      videoPlayer.pause();
      videoPlayer.destroy();
    },
    //倍速事件
    changeSpeed(data) {
      let videoPlayer = document.getElementById("videoPlayer");
      videoPlayer.playbackRate = data;
    },
    //播放
    startPlay() {
      let videoPlayer = document.getElementById("videoPlayer");
      videoPlayer.play();
      videoPlayer.playbackRate = this.speedState;
      videoPlayer.volume = this.voiceState / 100;
    },
    //暂停
    toStop() {
      let videoPlayer = document.getElementById("videoPlayer");
      videoPlayer.pause();
    },
    //声音调节
    voiceChange(data) {
      let videoPlayer = document.getElementById("videoPlayer");
      videoPlayer.volume = data / 100;
    },
    //截图
    toScreenshot() {
      // let that = this;
      var video = document.getElementById("videoPlayer");
      this.canvasWith = document.getElementById("videoPlayer").offsetWidth;
      this.canvasHeight = document.getElementById("videoPlayer").offsetHeight;
      let canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      this.$nextTick(() => {
        ctx.drawImage(video, 0, 0, this.canvasWith, this.canvasHeight);
        canvas.toDataURL("image/png");
        // var oGrayImg = canvas.toDataURL("image/png");
        // console.log(123, oGrayImg);
        this.canvasShow = true;
        this.$nextTick(() => {
          this.$emit("toShotWithVideo");
          this.canvasShow = false;
        });
      });
    },
    clearShot() {
      this.canvasShow = false;
    },
    //平铺视频
    toFullWidth() {
      this.isFullWidth = true;
    },
    //还原视频
    toReWidth() {
      this.isFullWidth = false;
    }
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.video-back {
  position: relative;
  background: rgba($color: #000, $alpha: 0.8);
  width: 100%;
  height: calc(100vh - 336px);
  .backVideo {
    position: absolute;
    height: calc(100vh - 336px);
    width: 100%;
    z-index: 1001;
  }
  .fullWidth {
    object-fit: fill;
  }
  .maskBox {
    position: absolute;
    height: calc(100vh - 336px);
    line-height: calc(100vh - 336px);
    text-align: center;
    width: 100%;
    background: rgba($color: #000, $alpha: 0.3);
    color: #fff;
    z-index: 1005;
  }
}
.full-size-area {
  .video-back {
    height: 100vh;
  }
  .backVideo {
    height: 100vh;
  }
  .fullWidth {
    object-fit: fill;
  }
  .maskBox {
    height: calc(100vh);
    line-height: calc(100vh);
  }
}
#myCanvas {
  position: absolute;
  z-index: 1001;
}
</style>
