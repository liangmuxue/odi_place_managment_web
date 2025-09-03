/**
 *  视频播放窗口
 */

<template>
  <div class="video-box">
    <video
      class="demo-video"
      vtype="mse"
      autoplay
      controls
      muted
      playsinline
      ref="player"
    ></video>
  </div>
</template>
 <script>
import flvjs from "flv.js";

export default {
  props: {
    sourceUrl: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      player: null,
      loading: true,
      videoUrl:
        "ws://192.168.0.19:8083/stream/27aec28e-6181-4753-9acd-0456a75f0289/channel/0/mse?uuid=27aec28e-6181-4753-9acd-0456a75f0289&channel=0",
    };
  },
  mounted() {
    this.loading = true;
    this.playVideo();
  },
  beforeDestroy() {
    this.videoPause();
  },
  methods: {
    playVideo() {
      const time1 = new Date().getTime();
      if (flvjs.isSupported()) {
        let video = this.$refs.player;
        if (video) {
          this.player = flvjs.createPlayer({
            type: "flv",
            // isLive: true,
            url: this.videoUrl,
          });
          this.player.attachMediaElement(video);
          try {
            this.player.load();
            this.player.play().then(() => {
              console.log(new Date().getTime() - time1);
              this.loading = false;
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    // 停止流
    videoPause() {
      if (this.player) {
        this.player.unload();
        this.player.destroy();
        this.player = null;
      }
    },
  },
};
</script>
<style lang="scss" scoped>

.video-box {
  width: 100%;
  height: 100%;
}
video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
video::-webkit-media-controls-play-button {
  display: none;
}
video::-webkit-media-controls-current-time-display {
  display: none;
}
video::-webkit-media-controls-timeline {
  display: none;
}
</style>



