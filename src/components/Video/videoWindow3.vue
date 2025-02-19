/**
 *  视频播放窗口
 */

<template>
  <div class="video-window">
    <video
      ref="videoPlayer"
      class="centeredVideo2"
      autoplay
      @dblclick="fullSizeSwitch(arguments)"
    >
    </video>
  </div>
</template>


<script>
import flvjs from "flv.js";
import Vue from "vue";

export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  name: "video-window",
  data() {
    return {
      videoObj:null,
    };
  },
  created() {
  },
  mounted: function() {
    if (flvjs.isSupported()) {
      const videoElement = this.$refs.videoPlayer;
      this.videoObj = flvjs.createPlayer({
         type: 'flv',
         url: this.src
      });
      this.videoObj.attachMediaElement(videoElement);
      this.videoObj.load();
      //加载后直接播放
      this.videoObj.play();
    }    
  },  
  methods: {
    //停止播放
    stop(){
      this.videoObj.pause();
      this.videoObj.destroy();
    },
    fullSizeSwitch(vId,data){
      console.log("fullSizeSwitch in");
      this.$emit("fullSizeSwitch", vId);
    }
  },
  watch: {
 
  },
  computed: {
  }
};
</script>

<style lang="stylus" scoped></style>