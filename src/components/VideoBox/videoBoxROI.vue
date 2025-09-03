/**
 *  视频播放窗口
 */

<template>
  <div class="video-box">
    <div class="video_sel">
      <el-select v-model="videoId" placeholder="请选择视频格式" size="mini">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="video_text">视频加载中...</div>
    <!-- <div>{{ videoData.flvStream }}</div>
    <div>{{ videoData.hlsFmp4Stream }}</div>
    <div>{{ videoData.hlsMpegtsStream }}</div>
    <div>{{ videoData.httpFmp4Stream }}</div>
    <div>1{{ videoData.httpTsStream }}</div>
    <div>2{{ videoData.mainStream }}</div>
    <div>{{ videoData.rtmpStream }}</div>
    <div>{{ videoData.rtspStream }}</div>
    <div>{{ videoData.subStream }}</div>
    <div>{{ videoData.wsFmp4Stream }}</div>
    <div>{{ videoData.wsTsStream }}</div>
    <div>{{ videoData.webrtcStream }}</div> -->
    <videoWebRTC
      v-if="videoData.status && videoId == 1"
      :ref="videoData.refId"
      :id="videoData.pwId"
      :bindId="videoData.refId"
      :src="videoData.webrtcStream"
    ></videoWebRTC>
    <videoWindow
      v-if="videoData.status && videoId == 2"
      :ref="videoData.refId"
      :id="videoData.pwId"
      :bindId="videoData.refId"
      :src="videoData.flvStream"
    ></videoWindow>
    <videoHls
      v-if="videoData.status && videoId == 3"
      :ref="videoData.refId"
      :id="videoData.pwId"
      :bindId="videoData.refId"
      :src="videoData.hlsMpegtsStream"
    ></videoHls>
    <!-- <videoTs
      v-if="videoData.status && videoId == 4"
      :ref="videoData.refId"
      :id="videoData.pwId"
      :bindId="videoData.refId"
      :src="videoData.mainStream"
    ></videoTs> -->
  </div>
</template>

<script>
import videoWindow from "@/components/Video/videoWindowNew";
import videoWebRTC from "@/components/Video/videoWebRTCNew";
import videoHls from "@/components/Video/videoHlsNew";
import videoTs from "@/components/Video/videoTs";

export default {
  props: {
    bindId: {
      type: String,
      default: "",
    },
  },
  name: "video-box",
  watch: {},
  components: {
    videoWindow, //flv视频流播放
    videoWebRTC, //webrtc视频流播放
    videoHls, //hls视频流播放
    videoTs
  },
  data() {
    return {
      videoData: {}, //设备信息
      videoId: 2, //当前播放视频流格式
      options: [
        {
          value: 1,
          label: "webrtc",
        },
        {
          value: 2,
          label: "flv",
        },
        {
          value: 3,
          label: "hls",
        },
        // {
        //   value: 4,
        //   label: "h264",
        // },
      ],
    };
  },
  async created() {},
  mounted: function () {},
  methods: {
    toPlay(data) {
      this.videoData = data;
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.video-box {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .video_sel {
    position: absolute;
    z-index: 2;
    bottom: -33px;
    right: 320px;
    width: 120px;
  }
  .video_text {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #fff;
  }
}
</style>
<style lang="scss">
.video_sel .el-input__inner{
  background: rgba($color: #000000, $alpha: .3);
  color: #fff;
}
</style>