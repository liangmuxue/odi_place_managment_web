/** * 视频播放窗口 */

<template>
  <div
    class="video-window"
    @mouseover="onMouseOver()"
    @mouseleave="onMouseLeave()"
  >
    <video
      :id="bindId"
      ref="videoPlayer"
      class="centeredVideo"
      muted="muted"
      mode="no-cors"
      autoplay
    ></video>
    <div class="video_loading">视频加载中···</div>

    <transition name="plus-icon">
      <div class="small_window_button" v-if="buttonShow">
        <div @click="bigSizeSwitch(bindId, true)">
          单屏
        </div>
        <div @click="fullSizeSwitch(bindId)">全屏</div>
      </div>
    </transition>
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
    src: {
      type: String,
      default: ""
    }
  },
  name: "video-window",
  data() {
    return {
      videoObj: null,
      buttonShow: false, //大屏按钮显示隐藏
      buffInterval: null, //判断时延的循环
      lastDecodedFrame: 0,
      statisticsNo: 0,
      reSetTime: 0
    };
  },
  created() {},
  mounted: function() {
    this.createVideo();
  },
  beforeDestroy() {
    this.stop();
  },
  methods: {
    //创建视频流
    createVideo() {
      let that = this;
      if (flvjs.isSupported()) {
        const videoElement = that.$refs.videoPlayer;
        that.videoObj = flvjs.createPlayer(
          {
            type: "flv",
            // isLive: true,
            url: that.src,
            // url:
            //   "http://218.61.32.171:2025/live/test.live.flv?vhost=__defaultVhost__&secret=QWxeliqlKyUZpSkQCKZXMjn2wUt6yfez",
            hasAudio: false, //解决问题点
            referrerPolicy: "" //
          }
          // {
          //   enableWorker: false, //不启用分离线程
          //   enableStashBuffer: false, //关闭IO隐藏缓冲区
          //   reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
          //   autoCleanupSourceBuffer: true //自动清除缓存
          // }
        );
        that.videoObj.attachMediaElement(videoElement);
        if (that.url !== "" && that.url !== null) {
          that.videoObj.load();
          //加载后直接播放
          that.videoObj.play();
        }
        //定时方法是为了用户离开页面视频是实时播放的,暂停按钮无用
        setInterval(function() {
          // console.log(videoElement.buffered,"idididid");
          if (videoElement.buffered.length > 0) {
            const end = videoElement.buffered.end(0); // 视频结尾时间
            const current = videoElement.currentTime; //  视频当前时间
            const diff = end - current; // 相差时间
            // console.log(diff);
            const diffCritical = 4; // 这里设定了超过4秒以上就进行跳转
            const diffSpeedUp = 1; // 这里设置了超过1秒以上则进行视频加速播放
            const maxPlaybackRate = 4; // 自定义设置允许的最大播放速度
            let playbackRate = 1.0; // 播放速度
            if (diff > diffCritical) {
              //  that.videoObj.load();
              // console.log("相差超过4秒，进行跳转");
              videoElement.currentTime = end - 1.5;
              playbackRate = Math.max(1, Math.min(diffCritical, 16));
            } else if (diff > diffSpeedUp) {
              // console.log("相差超过1秒，进行加速");
              playbackRate = Math.max(1, Math.min(diff, maxPlaybackRate, 16));
            }
            videoElement.playbackRate = playbackRate;
            if (videoElement.paused) {
              videoElement.play();
            }
          }
          //  if (videoElement.buffered.length) {
          //   let end = that.videoObj.buffered.end(0);//获取当前buffered值
          //   let diff = end - that.videoObj.currentTime;//获取buffered与currentTime的差值
          //   if (diff >= 0.5) {//如果差值大于等于0.5 手动跳帧 这里可根据自身需求来定
          //     that.videoObj.currentTime = that.videoObj.buffered.end(0);//手动跳帧
          //  }
          // }
        }, 10000);
        that.videoObj.on(flvjs.Events.ERROR, (errType, errDetail) => {
          // console.log("网络波动,正在尝试连接中...", errDetail);
          if (this.reSetTime < 6) {
            setTimeout(() => {
              this.reSetTime += 1;
              if (that.videoObj) {
                that.reloadVideo(that.videoObj);
              }
            }, 10000);
          } else if (this.reSetTime < 10) {
            setTimeout(() => {
              this.reSetTime += 1;
              if (that.videoObj) {
                that.reloadVideo(that.videoObj);
              }
            }, 30000);
          }

          // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
          // errType是 MediaError时，对应errDetail是MediaMSEError   或MEDIA_SOURCE_ENDED
        });
        that.videoObj.on("statistics_info", function(res) {
          this.reSetTime = 0;

          // console.log("statistics_info", res.decodedFrames);
          if (that.lastDecodedFrame == 0) {
            that.lastDecodedFrame = res.decodedFrames;
            that.statisticsNo += 1;
            return;
          }
          if (that.lastDecodedFrame != res.decodedFrames) {
            //正常播放，时间持续增加
            that.lastDecodedFrame = res.decodedFrames;
            that.statisticsNo = 0;
          } else {
            //出现卡顿，上一次时间与本次相同，将
            that.lastDecodedFrame = 0;
            if (that.statisticsNo > 10) {
              that.reloadVideo(that.videoObj);
            }
          }
        });
      }
    },
    //停止播放
    stop() {
      this.videoObj.pause();
      this.videoObj.destroy();
    },
    //销毁断流方法
    destoryVideo(videoObj) {
      if (videoObj) {
        videoObj.pause();
        videoObj.unload();
        videoObj.detachMediaElement();
        videoObj.destroy();
        videoObj = null;
      }
    },
    //重连的方法
    reloadVideo(videoObj) {
      console.log("重新连接");

      this.destoryVideo(videoObj);
      this.createVideo();
    },
    //鼠标移上
    onMouseOver() {
      this.buttonShow = true;
    },
    //鼠标移出
    onMouseLeave() {
      this.buttonShow = false;
    },

    //全屏
    fullSizeSwitch(vId) {
      this.$emit("fullSizeSwitch", vId);
    },
    //大窗
    bigSizeSwitch(vId) {
      this.$emit("bigSizeSwitch", vId, true);
      this.buttonShow = false;
    }
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.video-window {
  position: relative;
  background: rgba($color: #000, $alpha: 0.8);
  height: 100%;
  width: 100%;

  .centeredVideo {
    height: 100%;
    width: 100%;
    object-fit: fill;
    position: absolute;
    z-index: 1001;
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
  .small_window_button {
    z-index: 1002;
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    background: rgba($color: #000000, $alpha: 0.4);
    display: flex;
    align-items: right;
    justify-content: right;
    transform: translateY(0);
    /* 移回也需要0.4s时间过渡 */
    transition: transform 0.5s;

    div {
      width: 100px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
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
</style>
