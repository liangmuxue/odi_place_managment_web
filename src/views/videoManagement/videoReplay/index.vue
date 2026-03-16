<template>
  <div class="videoPlayback">
    <div
      class="loading_box"
      v-show="shotLoading"
      v-loading="shotLoading"
      element-loading-text="截图中,请稍后..."
      element-loading-spinner="el-icon-loading"
    ></div>
    <div class="download_box">
      <div class="download_state" v-if="downloadShow">
        <span class="download_icon"></span>
        {{ downloadNo }}个任务正在下载中，请稍后...
        <div class="close_btn" @click="closeDownload">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="zip_state" v-if="zipShow">
        <span class="zip_icon"></span>
        {{ zipNo }}个任务正在打包中，请稍后...
        <div class="close_btn" @click="closeZip">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="success_state" v-if="successInfo">
        <span class="success_icon"></span>
        {{ successInfo }}
        <span class="success_name">下载完成</span>
        <div class="close_btn" @click="closeSuccess">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="failed_state" v-if="failedInfo">
        <span class="failed_icon"></span>
        {{ failedInfo }}
        <span class="failed_name">下载失败</span>
        <div class="close_btn" @click="closeFailed">
          <i class="el-icon-close"></i>
        </div>
      </div>
    </div>
    <div id="full-size-area" class="full-size-area" style="display: none"></div>
    <div class="videoPlayback_left">
      <span class="videoPlayback_left_content">
        <div class="videoPlayback_left_content_title">停车场</div>
        <el-select
          v-model="curPark"
          placeholder="请选择停车场"
          clearable
          @change="parkChange"
          class="filter-item"
          style="width: 200px"
        >
          <el-option
            v-for="item in parkingList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </span>
      <div class="equipment_box">
        <div class="left_box">
          <el-input
            placeholder="请输入要查询的设备名称"
            prefix-icon="el-icon-search"
            v-model="cameraName"
          >
          </el-input>
          <div class="equipment_list_title">
            <img
              src="../../../assets/images/equipmentList/equipment.png"
              alt=""
              class="equipment_list_title-img"
            />
            <span>设备列表</span>
          </div>
          <div class="equipment_list">
            <!-- <DistrictTree
            ref="videoTree"
            placeholder="请选择"
            :treeData="treeData"
            class="device-area-top-title-text"
            style="width: 200px"
            @treeItemSelect="treeItemSelect"
          ></DistrictTree> -->
            <div class="equipment_list-title">道闸设备</div>
            <el-checkbox-group
              v-model="checkList"
              v-if="fareGateSearchList.length"
            >
              <el-checkbox
                v-for="(e, i) in fareGateSearchList"
                :key="i"
                :label="e.deviceId"
                :disabled="e.state != 1"
                v-show="getShow(e)"
                @change="checkCamera(e)"
                class="equipment_check"
              >
                <div
                  :class="e.state == 1 ? 'equipment_type' : 'equipment_type2'"
                >
                  <div class="equipment_ball"></div>
                  <svg-icon icon-class="camera" class="equipment_icon" />
                  <div class="equipment_name">{{ e.deviceName }}</div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            <div v-else class="equipment_list_none">暂无数据</div>
            <div class="equipment_list-title">监控设备</div>
            <el-checkbox-group
              v-model="checkList"
              v-if="monitorSearchList.length"
            >
              <el-checkbox
                v-for="(e, i) in monitorSearchList"
                :key="i"
                :label="e.deviceId"
                :disabled="e.state != 1"
                v-show="getShow(e)"
                @change="checkCamera(e)"
                class="equipment_check"
              >
                <div
                  :class="e.state == 1 ? 'equipment_type' : 'equipment_type2'"
                >
                  <div class="equipment_ball"></div>
                  <svg-icon icon-class="camera" class="equipment_icon" />
                  <div class="equipment_name">{{ e.deviceName }}</div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            <div v-else class="equipment_list_none">暂无数据</div>
          </div>
          <div class="Num_box">
            <span class="online">在线 {{ onlineNum }} / </span>
            <span class="offline">离线 {{ offlineNum }} / </span>
            <span class="all">总数 {{ allNum }}</span>
          </div>
        </div>
      </div>

      <!-- <el-scrollbar class="scroll-area-back">
        <DistrictTree
          ref="treedate"
          v-model="treeData"
          placeholder="请选择"
          class="vue-treeselect__input"
          @treeItemSelect="treeItemSelect"
        ></DistrictTree>
      </el-scrollbar>
      <div class="logo_box">
        <div class="logo_on"></div>
        <span>在线</span>
        <div class="logo_off"></div>
        <span>离线</span>
        <div class="logo_all"></div>
        <span>总数</span>
      </div> -->
    </div>
    <div class="videoPlayback_right">
      <div class="video_box">
        <div id="video_box" ref="video_box" @click="clearVideoBtn">
          <div v-if="!curCamera" class="no-device-icon"></div>
          <div v-if="!curCamera" class="no-device-text">未选择设备</div>
          <div class="video_loading" v-if="curCamera && !curVideo">
            暂无视频
          </div>
          <div class="video_loading" v-else-if="curVideo && !videoError">
            视频加载中···
          </div>
          <div class="video_loading" v-else-if="curVideo && videoError">
            视频加载失败
          </div>

          <!-- <BackVideo
          ref="historyVideo"
          id="historyVideo"
          bindId="historyVideo"
          v-if="curVideo"
          :src="curVideo"
        ></BackVideo> -->
          <BackVideoMp4
            ref="historyVideo"
            id="historyVideo"
            bindId="historyVideo"
            v-if="curVideo"
            :speedState="speedState"
            :voiceState="voiceState"
            :playState="playState"
            @closeVideo="closeVideo"
            @videoTimeChange="videoTimeChange"
            @videoErr="videoErr"
            @back30="back30"
            @toShotWithVideo="toShotWithVideo"
          ></BackVideoMp4>
          <!-- <video src="http://218.60.95.37:30000/20211213-1640855988357.mp4" autoplay></video> -->

          <div class="video_btn_box" v-if="curCamera">
            <div class="video_btns">
              <div class="speed_btn" @click.stop="openSpeed">
                {{ speedState }}x
                <div class="speed_menu" v-if="speedOpen">
                  <div
                    :class="speedState == 8 ? 'selSpeed' : ''"
                    @click="changeSpeed(8)"
                  >
                    8x
                  </div>
                  <div
                    :class="speedState == 4 ? 'selSpeed' : ''"
                    @click="changeSpeed(4)"
                  >
                    4x
                  </div>
                  <div
                    :class="speedState == 2 ? 'selSpeed' : ''"
                    @click="changeSpeed(2)"
                  >
                    2x
                  </div>
                  <div
                    :class="speedState == 1 ? 'selSpeed' : ''"
                    @click="changeSpeed(1)"
                  >
                    1x
                  </div>
                </div>
              </div>
              <div class="back_btn" @click.stop="back30">30</div>
              <div
                class="play_btn"
                v-if="!playState"
                @click.stop="startPlay"
              ></div>
              <div class="stop_btn" v-if="playState" @click.stop="toStop"></div>
              <div class="time_strip">
                {{ curTime | parseTime("{y}-{m}-{d}") }}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {{ curTime | parseTime(" {h}:{i}:{s}") }}
              </div>
              <div
                :class="!voiceState ? 'noVoice' : ''"
                class="voice_btn"
                @click.stop="openVBar"
              >
                <div class="voice_bar" v-if="vBarOpen" @click.stop>
                  <el-slider
                    v-model="voiceState"
                    vertical
                    height="100px"
                    @change="voiceChange"
                  >
                  </el-slider>
                </div>
              </div>
              <div class="shot_btn" @click.stop="toScreenshot">截图</div>
              <div class="full_btn" v-if="!isFull" @click.stop="toFull"></div>
              <div class="noFull_btn" v-if="isFull" @click.stop="reFull"></div>
              <div
                class="fullWidth_btn"
                v-if="!isFullWidth"
                @click.stop="toFullWidth"
              ></div>
              <div
                class="reWidth_btn"
                v-if="isFullWidth"
                @click.stop="toReWidth"
              ></div>
            </div>
          </div>
        </div>
        <!-- <canvas
          id="Vcanvas"
          ref="Vcanvas"
          :width="canvasWidth"
          :height="canvasHeight"
        ></canvas> -->

        <!-- @fullSizeSwitch="fullSizeSwitch" -->
      </div>
      <div class="time_picker" id="time_picker">
        <el-date-picker
          v-model="dateTime"
          type="date"
          placeholder="选择日期"
          style="width: 200px"
          @change="changeDate"
          value-format="timestamp"
          :clearable="false"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <el-time-picker
          v-model="selTime"
          placeholder="任意时间点"
          style="width: 200px"
          :clearable="false"
          @change="changeDateTime"
          value-format="timestamp"
        ></el-time-picker>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="searchTime"
        ></el-button>
        <div class="timeButton-box">
          <div
            :class="timeButtonType === 1 ? 'timeButtonSelect' : 'timeButton'"
            @click="changeTime(1)"
          >
            5分钟
          </div>
          <div
            :class="timeButtonType === 2 ? 'timeButtonSelect' : 'timeButton'"
            @click="changeTime(2)"
          >
            1小时
          </div>
          <div
            :class="timeButtonType === 3 ? 'timeButtonSelect' : 'timeButton'"
            @click="changeTime(3)"
          >
            24小时
          </div>
          <div class="downloadButton" id="loadBox" @click="toDownload">
            <i class="el-icon-download"></i> 录像下载
          </div>
        </div>
        <div class="timeBar-box" v-if="timeButtonType === 1">
          <timeBar
            :key="getTimeBarKey()"
            :dateTime="curDate"
            @clickHistoryTime="clickHistoryTime"
            ref="timeBar"
          ></timeBar>
        </div>
        <div class="timeBar-box" v-if="timeButtonType === 2">
          <timeBar2
            :key="getTimeBarKey()"
            :dateTime="curDate"
            @clickHistoryTime="clickHistoryTime"
            ref="timeBar2"
          ></timeBar2>
        </div>
        <div class="timeBar-box" v-if="timeButtonType === 3">
          <timeBar3
            :key="getTimeBarKey()"
            :dateTime="curDate"
            @clickHistoryTime="clickHistoryTime"
            ref="timeBar3"
          ></timeBar3>
        </div>
      </div>
    </div>
    <Dialog ref="dialog"></Dialog>
  </div>
</template>

<script>
// import {
//   videoReplay2,
//   streamVideoSelTime,
//   VideoList,
// } from "@/api/realTimeMonitoring";
import timeBar from "@/components/Video/timeBar";
import timeBar2 from "@/components/Video/timeBar2";
import timeBar3 from "@/components/Video/timeBar3";
import DistrictTree from "./components/districtTree";
// import BackVideo from "./components/backVideo";
import BackVideoMp4 from "./components/backVideoMp4";
import html2canvas from "html2canvas";
import Dialog from "./components/dialog";
import {
  deviceListTree //设备树形列表
} from "@/api/homePage";
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";
import {
  deviceStreamList //设备列表
} from "@/api/equipmentManagement";

export default {
  name: "VideoPlayback",
  components: {
    DistrictTree,
    timeBar,
    timeBar2,
    timeBar3,
    // BackVideo,
    BackVideoMp4,
    Dialog
  },
  data() {
    return {
      timeListInterval: null,
      downloadInterval: null, //下载心跳
      userId: "",
      tenantId: "",
      equipment: null,
      curCamera: null, //当前选中设备
      curVideo: "", //当前播放视频流
      treeData: [{ children: [] }, { children: [] }],
      fareGateList: [],
      // fareGateSearchList: [],
      monitorList: [],
      // monitorSearchList: [],
      parkingList: [],
      curPark: null,
      cameralist: [], //设备列表
      checkList: [], //选中设备列表
      cameraName: "", //设备名称
      onlineNum: 0,
      offlineNum: 0,
      allNum: 0,
      videoError: false, //视频播放失败
      videoTimeOut: null, //伪视频播放循环
      dateTime: new Date(new Date().toLocaleDateString()).getTime(),
      curDate: new Date(new Date().toLocaleDateString()).getTime(),
      curTime: new Date(new Date().toLocaleDateString()).getTime(),
      selTime: new Date(new Date().toLocaleDateString()).getTime(),
      timeButtonType: 3, //时间按钮状态
      historyTimeList: [], //历史视频列表
      pickerOptions: {
        disabledDate(time) {
          if (time.getTime() > Date.now()) {
            return true;
          } else {
            return false;
          }
        }
      },
      shotLoading: false, //截图中loading
      canvasWidth: 0, //绘制区域宽
      canvasHeight: 0, //绘制区域高
      playState: 1, //播放状态（1：播放，2：暂停）
      isFull: false, //是否全屏
      isFullWidth: false, //是否平铺
      speedOpen: false, //倍速列表是否展开
      vBarOpen: false, //声音条是否显示
      speedState: 1, //播放速度
      voiceState: 0, //声音大小
      fullState: 0, //全屏事件(0:小屏，1:全屏)
      //下载状态相关
      downloadShow: false,
      downloadNo: 0,
      zipShow: false,
      zipNo: 0,
      successInfo: "",
      failedInfo: ""
    };
  },
  mounted() {
    this.timeListInterval = setInterval(() => {
      if (
        this.curDate == new Date(new Date().toLocaleDateString()).getTime() &&
        this.curCamera
      ) {
        this.getHistoryVideos();
      }
    }, 300000);
    this.downloadInterval = setInterval(() => {
      if (this.downloadShow != this.GLOBAL.downloadShow) {
        this.downloadShow = this.GLOBAL.downloadShow;
      }
      if (this.downloadNo != this.GLOBAL.downloadNo) {
        this.downloadNo = this.GLOBAL.downloadNo;
      }
      if (this.zipShow != this.GLOBAL.zipShow) {
        this.zipShow = this.GLOBAL.zipShow;
      }
      if (this.zipNo != this.GLOBAL.zipNo) {
        this.zipNo = this.GLOBAL.zipNo;
      }
      if (this.successInfo != this.GLOBAL.successInfo) {
        this.successInfo = this.GLOBAL.successInfo;
      }
      if (this.failedInfo != this.GLOBAL.failedInfo) {
        this.failedInfo = this.GLOBAL.failedInfo;
      }
    }, 1000);
  },
  created() {
    this.getparking();
    this.getList();
  },
  computed: {
    fareGateSearchList() {
      if (!this.cameraName) {
        return this.fareGateList;
      } else {
        return this.fareGateList.filter(item =>
          item.deviceName.includes(this.cameraName)
        );
      }
    },
    monitorSearchList() {
      if (!this.cameraName) {
        return this.monitorList;
      } else {
        return this.monitorList.filter(item =>
          item.deviceName.includes(this.cameraName)
        );
      }
    }
  },
  destroyed() {
    clearTimeout(this.videoTimeOut);
    clearInterval(this.timeListInterval);
    clearInterval(this.downloadInterval);
  },
  methods: {
    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
      });
    },
    parkChange() {
      this.getDeviceListTree();
      this.checkList = [];
    },
    //获取设备列表
    getList() {
      let para = {};
      deviceStreamList(para).then(response => {
        this.cameralist = response.data;
        this.allNum = this.cameralist.length;
        this.onlineNum = this.cameralist.filter(
          value => value.localStreamState == 2
        ).length;
        this.offlineNum = this.allNum - this.onlineNum;
      });
    },
    //获取摄像头是否显示
    getShow(e) {
      if (!this.cameraName) return true;
      return e.deviceName.indexOf(this.cameraName) !== -1;
    },

    getDeviceListTree() {
      let para = { parkId: this.curPark };
      deviceListTree(para).then(response => {
        this.fareGateList = response.data[0].children;
        // this.fareGateList = [
        //   { id: 1, deviceId: 1, deviceName: "测试闸机", state: 1 }
        // ];
        this.monitorList = response.data[1].children;
      });
    },
    checkCamera(e) {
      let arr = [...this.checkList];
      if (this.checkList.length > 1) {
        arr.shift();
      }
      if (arr.length > 0) {
        this.treeItemSelect(e, true);
      } else {
        this.treeItemSelect(e, false);
      }
      this.checkList = arr;
    },
    //关闭下载提示条
    closeDownload() {
      this.GLOBAL.downloadShow = false;
    },
    //关闭打包提示条
    closeZip() {
      this.GLOBAL.zipShow = false;
    },
    //关闭成功提示条
    closeSuccess() {
      this.GLOBAL.successInfo = "";
    },
    //关闭失败提示条
    closeFailed() {
      this.GLOBAL.failedInfo = "";
    },

    //播放拉取的视频
    toPlay() {
      this.$nextTick(() => {
        this.$refs.historyVideo.toPlay(this.curVideo, this.curTime);
      });
    },
    //切换时间按钮
    changeTime(data) {
      this.timeButtonType = data;
      if (this.timeButtonType === 1) {
        this.$nextTick(() => {
          this.$refs.timeBar.getBar();
        });
      } else if (this.timeButtonType === 2) {
        this.$nextTick(() => {
          this.$refs.timeBar2.getBar();
        });
      } else if (this.timeButtonType === 3) {
        this.$nextTick(() => {
          this.$refs.timeBar3.getBar();
        });
      }

      if (this.historyTimeList) {
        let list = this.historyTimeList;
        let list2 = list.map(el => {
          return { startTime: el.startTime, endTime: el.endTime };
        });
        if (this.timeButtonType === 1) {
          this.$nextTick(() => {
            this.getZeroPposition();
            this.getPosition(list2);
          });
        } else if (this.timeButtonType === 2) {
          this.$nextTick(() => {
            this.getZeroPposition();
            this.getPosition(list2);
          });
        } else if (this.timeButtonType === 3) {
          this.$nextTick(() => {
            this.getZeroPposition();
            this.getPosition(list2);
          });
        }
      }
    },
    //打开下载弹窗
    toDownload() {
      this.$refs.dialog.showDialog(this.historyTimeList);
    },
    //选择日期
    changeDate() {
      this.selTime = this.dateTime;
      // if (this.curCamera) {
      //   this.getHistoryVideos();
      // }
    },
    //选择日期时间
    changeDateTime() {
      // this.getCurVideo();
    },
    searchTime() {
      // let curTimeDate = this.curDate;
      // let date = this.dateTime;
      this.curTime = this.selTime;
      // if (curTimeDate == date) {
      //   this.getCurVideo();
      // } else {
      this.curDate = this.dateTime;
      if (this.curCamera) {
        this.getHistoryVideos();
      }
      // }
    },
    //获取选择的历史视频
    clickHistoryTime(time) {
      this.videoError = false;
      this.curTime = time;
      this.getCurVideo();
    },
    //设置0点位置
    getZeroPposition() {
      let zeroTime = new Date(
        new Date(this.curDate).toLocaleDateString()
      ).getTime();
      if (this.timeButtonType === 1) {
        this.$nextTick(() => {
          this.$refs.timeBar.getTimeAndPosition(zeroTime);
        });
      } else if (this.timeButtonType === 2) {
        this.$nextTick(() => {
          this.$refs.timeBar2.getTimeAndPosition(zeroTime);
        });
      } else if (this.timeButtonType === 3) {
        this.$nextTick(() => {
          this.$refs.timeBar3.getTimeAndPosition(zeroTime);
        });
      }
    },
    //计算时间位置信息
    getPosition() {
      let list = this.historyTimeList;
      if (this.timeButtonType === 1) {
        this.$nextTick(() => {
          this.$refs.timeBar.getVehiclePosition(list);
        });
      } else if (this.timeButtonType === 2) {
        this.$nextTick(() => {
          this.$refs.timeBar2.getVehiclePosition(list);
        });
      } else if (this.timeButtonType === 3) {
        this.$nextTick(() => {
          this.$refs.timeBar3.getVehiclePosition(list);
        });
      }
    },
    //获取时间条key
    getTimeBarKey() {
      if (this.curCamera) {
        return this.curDate + this.curCamera.deviceId;
      } else {
        return this.curDate;
      }
    },
    //设备选择事件触发
    treeItemSelect(data, checked) {
      if (checked) {
        // console.log("勾选设备", data);
        if (this.curCamera && this.curCamera.deviceId !== data.deviceId) {
          this.curVideo = "";
        }
        this.curCamera = data;
        //获取当然历史视频流
        this.getHistoryVideos();
        this.curTime = this.curDate;
      } else {
        // 如果关闭当前视频流，则清除选中设备，当前播放视频，历史视频列表，恢复播放时间，清空时间自走事件
        if (this.curCamera.deviceId == data.deviceId) {
          this.curCamera = null;
          this.curVideo = "";
          this.historyTimeList = [];
          this.playState = 1; //播放状态（1：播放，2：暂停）
          this.isFull = false; //是否全屏
          this.isFullWidth = false; //是否平铺
          this.speedOpen = false; //倍速列表是否展开
          this.speedState = 1;
          this.curTime = this.curDate;
          clearTimeout(this.videoTimeOut);
        }
      }
    },
    //获取历史视频时间列表
    getHistoryVideos() {
      let para = {
        // createTime: this.curDate,
        time: this.curDate,
        productCode: this.curCamera.deviceId
      };
      // VideoList(para).then((response) => {
      //   // console.log("视频数据", response.data);
      //   let list = response.data;
      //   this.historyTimeList = list.map((v) => {
      //     return { ...v, createTime: v.startTime };
      //   });
      //   //设置0点位置
      //   this.getZeroPposition();
      //   //计算时间位置信息
      //   this.getPosition();
      //   this.$nextTick(() => {
      //     //获取当前播放视频
      //     this.getCurVideo();
      //   });
      // });
    },
    //获取当前播放视频
    getCurVideo() {
      if (this.historyTimeList.length > 0 && !this.curVideo) {
        //如果当前查询到当天有视频文件但是没有正在播放的视频
        // let para = {
        //   productCode: this.curCamera.deviceId,
        //   createTime: this.curTime,
        // };
        // videoReplay2(para).then((response) => {
        //   // console.log("视频文件", response.data);
        //   this.curVideo = response.data;
        //   //开始走视频播放判断
        //   this.videoPlay();
        // });

        this.historyTimeList.forEach(el => {
          // console.log(101, this.curTime);
          if (this.curTime >= el.startTime && this.curTime < el.endTime) {
            this.curVideo = el;
            //开始走视频播放判断
            this.videoPlay();
          }
        });
      } else if (this.curVideo) {
        // this.historyTimeList.forEach((el) => {
        //   // console.log(101, this.curTime);
        //   if (this.curTime >= el.startTime && this.curTime < el.endTime) {
        //     this.curVideo = el;
        //     //开始走视频播放判断
        //     this.videoPlay();
        //   }
        // });

        let a = this.historyTimeList.find(
          item => this.curTime >= item.startTime && this.curTime < item.endTime
        );
        if (a) {
          // this.curVideo = a;
          // //开始走视频播放判断
          // this.videoPlay();
          if (a.startTime === this.curVideo.startTime) {
            // console.log("视频内时间跳转");
            this.$refs.historyVideo.changeTime(this.curVideo, this.curTime);
            this.timeBarChange();
          } else if (a.startTime !== this.curVideo.startTime) {
            // console.log("加载新视频播放");
            this.curVideo = "";
            setTimeout(() => {
              this.curVideo = a;
              this.videoPlay();
            }, 100);
          }
        } else {
          // console.log("暂无视频");
          this.curVideo = "";
          this.videoPlay();
        }
        // //如果有正在播放的视频
        // let para = {
        //   productCode: this.curCamera.deviceId,
        //   createTime: this.curTime,
        // };
        // videoReplay2(para).then((response) => {
        //   // console.log("视频文件", response.data);
        //   if (response.code !== "00000000") {
        //     this.videoErr();
        //   } else if (!response.data) {
        //     // console.log("暂无视频");
        //     this.curVideo = "";
        //     this.videoPlay();
        //   } else if (this.curVideo.videoName != response.data.videoName) {
        //     // console.log("加载新视频播放");
        //     this.curVideo = "";
        //     setTimeout(() => {
        //       this.curVideo = response.data;
        //       this.videoPlay();
        //     }, 100);
        //   } else if (this.curVideo.videoName == response.data.videoName) {
        //     // console.log("视频内时间跳转");
        //     this.$refs.historyVideo.changeTime(this.curVideo, this.curTime);
        //     this.timeBarChange();
        //   }
        // });
      } else {
        //当天无可播放视频
        this.curVideo = "";
        this.$message({
          type: "error",
          message: "该日暂无可回放视频"
        });
        clearTimeout(this.videoTimeOut);
      }
    },
    //进行视频播放
    videoPlay() {
      // console.log("开始判断视频播放状态");
      let hasVideo = this.hasVideo();
      clearTimeout(this.videoTimeOut);

      if (hasVideo && !this.videoError) {
        //根据时间轴判断当前时间点有视频
        // console.log("播放视频", this.curVideo);
        if (this.curVideo) {
          //有视频则开始播放视频
          this.toPlay();
        } else {
          //没有视频则重新获取视频
          this.getCurVideo();
        }
      } else {
        //没有视频则开始控制时间轴伪播放
        this.videoTimeOut = setTimeout(() => {
          this.curTime += 1000 * this.speedState;
          this.videoPlay();
          this.timeBarChange();
        }, 1000);
      }
      this.timeBarChange();
    },
    //时间点
    timeBarChange() {
      if (this.timeButtonType === 1) {
        this.$nextTick(() => {
          this.$refs.timeBar.currentTimeSet(this.curTime);
        });
      } else if (this.timeButtonType === 2) {
        this.$nextTick(() => {
          this.$refs.timeBar2.currentTimeSet(this.curTime);
        });
      } else if (this.timeButtonType === 3) {
        this.$nextTick(() => {
          this.$refs.timeBar3.currentTimeSet(this.curTime);
        });
      }
    },
    //判断当前时间点是否有视频
    hasVideo() {
      let ishas = false;
      this.historyTimeList.forEach(el => {
        if (el.createTime <= this.curTime && this.curTime <= el.endTime) {
          ishas = true;
        }
      });
      return ishas;
    },
    //视频播放结束
    closeVideo() {
      this.curVideo = null;
      this.curTime += 1000;
      this.getCurVideo();
      this.timeBarChange();
      this.videoError = false;
    },
    //视频播放中
    videoTimeChange() {
      this.curTime += 1000;
      this.timeBarChange();
    },
    //视频报错
    videoErr() {
      this.videoError = true;
      this.videoPlay();
    },
    //打开倍速列表
    openSpeed() {
      this.speedOpen = !this.speedOpen;
    },
    //倍速事件
    changeSpeed(data) {
      this.speedState = data * 1;
      if (this.curVideo) {
        this.$refs.historyVideo.changeSpeed(data);
      }
    },
    //播放
    startPlay() {
      this.playState = !this.playState;
      this.videoPlay();
      if (this.curVideo) {
        this.$refs.historyVideo.startPlay();
      }
    },
    //暂停
    toStop() {
      this.playState = !this.playState;
      clearTimeout(this.videoTimeOut);
      if (this.curVideo) {
        this.$refs.historyVideo.toStop();
      }
    },

    //回退30s
    back30() {
      if (this.curTime - this.curDate > 30000) {
        this.curTime -= 30000;
      } else {
        this.curTime = this.curDate;
      }
      this.getCurVideo();
    },
    //声音调节条是否展示
    openVBar() {
      this.vBarOpen = !this.vBarOpen;
    },
    //声音调节
    voiceChange(data) {
      if (this.curVideo) {
        this.$refs.historyVideo.voiceChange(data);
      }
    },
    //全屏播放
    toFull() {
      this.isFull = true;
      const body = document.getElementsByTagName("body")[0];
      const videoWindow = document.getElementById("video_box");
      document.getElementById("full-size-area").style.display = "block";
      body.style.overflow = "hidden";
      //移动video组件到全局窗口区域
      document.getElementById("full-size-area").appendChild(videoWindow);
    },
    //取消全屏播放
    reFull() {
      this.isFull = false;
      const body = document.getElementsByTagName("body")[0];
      const videoWindow = document.getElementById("video_box");
      document.getElementById("full-size-area").style.display = "none";
      body.style.overflow = "scroll";
      //移动回原区域
      document.getElementsByClassName("video_box")[0].appendChild(videoWindow);
    },
    //平铺视频
    toFullWidth() {
      this.isFullWidth = true;
      this.$refs.historyVideo.toFullWidth();
    },
    //还原视频
    toReWidth() {
      this.isFullWidth = false;
      this.$refs.historyVideo.toReWidth();
    },
    //清除倍速及声音展开事件
    clearVideoBtn() {
      this.speedOpen = false;
      this.vBarOpen = false;
    },
    //截图
    toScreenshot() {
      this.$nextTick(() => {
        this.shotLoading = true;
        //需要使用nextTick 不然DOM渲染过快导致初次无法进行渲染-或者使用SetTomeOut(()=>{},200)
        if (this.curVideo) {
          this.$refs.historyVideo.toScreenshot();
        } else {
          this.toImage();
        }
      });
    },
    toShotWithVideo() {
      this.$nextTick(() => {
        this.toImage();
        setTimeout(() => {
          this.$refs.historyVideo.clearShot();
        }, 1000);
      });
    },
    // 页面元素转图片
    toImage() {
      // 手动创建一个 canvas 标签
      const canvas = document.createElement("canvas");
      // 获取父标签，意思是这个标签内的 DOM 元素生成图片
      // imageTofile是给截图范围内的父级元素自定义的ref名称
      let canvasBox = this.$refs.video_box;
      // 获取父级的宽高
      const width = parseInt(window.getComputedStyle(canvasBox).width);
      const height = parseInt(window.getComputedStyle(canvasBox).height);
      // 宽高 * 2 并放大 2 倍 是为了防止图片模糊
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      const context = canvas.getContext("2d");
      context.scale(2, 2);
      const options = {
        backgroundColor: null,
        canvas: canvas,
        useCORS: true
      };
      html2canvas(canvasBox, options).then(canvas => {
        // toDataURL 图片格式转成 base64
        let dataURL = canvas.toDataURL("image/png");
        this.downloadImage(dataURL);
        this.shotLoading = false;
      });
    },
    //下载图片
    downloadImage(url) {
      // 如果是在网页中可以直接创建一个 a 标签直接下载
      let fileName = new Date().getTime();
      var aLink = document.createElement("a");
      var blob = this.base64ToBlob(url); //new Blob([url]);
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);
      // aLink.dispatchEvent(evt);
      aLink.click();
    },

    base64ToBlob(code) {
      var parts = code.split(";base64,");
      var contentType = parts[0].split(":")[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;

      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    }
  }
};
</script>

<style lang="scss">
.videoPlayback {
  height: calc(100vh - 130px);
  margin: 10px;
  background: #fff;
  display: flex;
  position: relative;
}
.loading_box {
  background: rgba($color: #000, $alpha: 0.4);
  position: fixed;
  z-index: 1100;
  top: 0;
  left: 0;
  width: calc(100vw);
  height: calc(100vh);
}
.download_box {
  position: absolute;
  z-index: 2000;
  right: 0px;
  top: 0px;
  width: 320px;
  padding: 10px 10px 0;
  font-size: 12px;
  .close_btn {
    position: absolute;
    right: 5px;
    top: 10px;
    width: 20px;
    height: 25px;
    line-height: 25px;
    font-size: 14px;
    cursor: pointer;
  }
  .download_state {
    position: relative;
    height: 45px;
    line-height: 45px;
    background: rgba($color: #15477a, $alpha: 0.65);
    border: 1px solid #2eb8e9;
    color: #fff;
    text-align: left;
    border-radius: 8px;
    padding-right: 20px;
    padding-left: 50px;
    margin-bottom: 10px;

    .download_icon {
      position: absolute;
      left: 10px;
      top: 7px;
      width: 30px;
      height: 30px;
      background-image: url("../../../assets/images/icons/download.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .zip_state {
    position: relative;
    height: 45px;
    line-height: 45px;
    background: rgba($color: #0c0a42, $alpha: 0.65);
    border: 1px solid #2eb8e9;
    color: #fff;
    text-align: left;
    border-radius: 8px;
    padding-right: 20px;
    padding-left: 50px;
    margin-bottom: 10px;
    .zip_icon {
      position: absolute;
      left: 10px;
      top: 7px;
      width: 30px;
      height: 30px;
      background-image: url("../../../assets/images/icons/zip.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .success_name {
    color: #67c23a;
  }
  .success_state {
    position: relative;
    height: 45px;
    line-height: 45px;
    background: rgba($color: #033d21, $alpha: 0.65);
    border: 1px solid #2eb8e9;
    color: #fff;
    text-align: left;
    border-radius: 8px;
    padding-right: 20px;
    padding-left: 50px;
    margin-bottom: 10px;
    .success_icon {
      position: absolute;
      left: 10px;
      top: 7px;
      width: 30px;
      height: 30px;
      background-image: url("../../../assets/images/icons/success.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .failed_name {
    color: #f56c6c;
  }
  .failed_state {
    position: relative;
    height: 45px;
    line-height: 45px;
    background: rgba($color: #451414, $alpha: 0.65);
    border: 1px solid #2eb8e9;
    color: #fff;
    text-align: left;
    border-radius: 8px;
    padding-right: 20px;
    padding-left: 50px;
    margin-bottom: 10px;
    .failed_icon {
      position: absolute;
      left: 10px;
      top: 7px;
      width: 30px;
      height: 30px;
      background-image: url("../../../assets/images/icons/failed.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
}
.full-size-area {
  position: fixed !important;
  z-index: 10002;
  left: 0px !important;
  top: 0px !important;
  height: calc(100vh) !important;
  width: calc(100vw) !important;
  background: rgba($color: #000, $alpha: 0.8);
  #video_box {
    height: calc(100vh);
    overflow: hidden;
    position: relative;
    background: #000;
    .video_loading {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 1000;
      height: calc(100vh);
      line-height: calc(100vh);
      width: calc(100vw);
      background: rgba($color: #000, $alpha: 1);
      font-size: 18px;
      text-align: center;
      color: #ccc;
    }
    .video_btn_box {
      position: absolute;
      width: 100%;
      height: 50px;
      bottom: 0;
      z-index: 1006;
      display: flex;
      align-items: center;
      color: #fff;
      line-height: 34px;
      .video_btns {
        margin: 0 auto;
        width: 750px;
        display: flex;
        cursor: pointer;
      }
      .speed_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 1);
        background-image: url("../../../assets/images/icons/speed2.png");
        background-size: 27px 26px;
        background-position: 8px 3px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        text-align: center;
        position: relative;
        .speed_menu {
          width: 43px;
          height: 120px;
          background: rgba($color: #333, $alpha: 0.8);
          position: absolute;
          top: -124px;
          div {
            width: 43px;
            height: 30px;
            line-height: 30px;
          }
          .selSpeed {
            background: rgba($color: #30bee9, $alpha: 0.5);
          }
        }
      }
      .back_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/back.png");
        background-size: 31px 30px;
        background-position: 5px 1px;
        background-repeat: no-repeat;
        font-size: 12px;
        margin-left: 10px;
        border-radius: 6px;
        text-align: center;
        cursor: pointer;
      }
      .play_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/play.png");
        background-size: 25px 22px;
        background-position: 9px 6px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        font-size: 24px;
        text-align: center;
        cursor: pointer;
      }
      .stop_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/stop.png");
        background-size: 25px 22px;
        background-position: 9px 6px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        font-size: 24px;
        text-align: center;
        cursor: pointer;
      }
      .time_strip {
        width: 360px;
        height: 34px;
        line-height: 34px;
        padding-left: 10px;
        background: rgba($color: #333, $alpha: 0.8);
        margin-left: 10px;
        border-radius: 6px;
        font-size: 12px;
        color: #fff;
      }
      .voice_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/voice.png");
        background-size: 25px 22px;
        background-position: 9px 6px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        .voice_bar {
          width: 43px;
          padding: 10px 18px;
          height: 120px;
          background: rgba($color: #333, $alpha: 0.8);
          position: absolute;
          top: -124px;
        }
      }
      .noVoice {
        background-image: url("../../../assets/images/icons/noVoice.png");
      }
      .shot_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        margin-left: 10px;
        border-radius: 6px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
      }
      .full_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/full.png");
        background-size: 29px 26px;
        background-position: 7px 4px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
      }
      .noFull_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/noFull.png");
        background-size: 29px 26px;
        background-position: 7px 4px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
      }
      .fullWidth_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/fullWidth.png");
        background-size: 29px 26px;
        background-position: 7px 4px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
      }
      .reWidth_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/reWidth.png");
        background-size: 29px 26px;
        background-position: 7px 4px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
      }
    }
  }
}

.videoPlayback_left {
  position: relative;
  height: calc(100vh - 140px);
  width: 270px;
  // background-image: url("../../../assets/images/equipmentList/card_left.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 10px;
  margin-left: 10px;
  .videoPlayback_left_content {
    display: flex;
    margin-bottom: 10px;
    .videoPlayback_left_content_title {
      width: 70px;
      text-align: center;
      height: 36px;
      line-height: 36px;
      border: 1px solid #dcdfe6;
    }
  }
  .equipment_box {
    display: flex;
    box-sizing: border-box;
    height: 100%;
    padding: 10px 0;
    .left_box {
      width: 270px;
      padding: 0;
      // margin-right: 10px;
      height: calc(100vh - 240px);
      background: #f5f9f8;
      .equipment_list_title {
        height: 36px;
        line-height: 36px;
        font-size: 18px;
        margin: 0 10px;
        display: flex;
        border-bottom: 1px solid #037659;
        .equipment_list_title-img {
          width: 20px;
          height: 20px;
          margin: 8px;
        }
      }
      .equipment_list {
        height: calc(100vh - 360px);
        margin: 5px;
        padding-left: 10px;
        overflow: auto;
        .equipment_list-title {
          margin: 2px 0;
          height: 24px;
          line-height: 24px;
          border-left: 4px solid #037659;
          padding-left: 5px;
          display: flex;
          justify-content: space-between;
        }
        .equipment_list_none {
          height: 30px;
          line-height: 30px;
          color: #999;
          text-align: center;
        }
        .equipment_check {
          margin: 5px 0;
          height: 16px;
          width: 100%;
          .equipment_type {
            height: 16px;
            margin-right: 10px;
            color: #67c23a;
            display: flex;
            .equipment_ball {
              width: 8px;
              height: 8px;
              background: #67c23a;
              margin: 4px 0;
              border-radius: 4px;
            }
          }
          .equipment_type2 {
            height: 16px;
            margin-right: 10px;
            color: #999;
            display: flex;
            .equipment_ball {
              width: 8px;
              height: 8px;
              background: #999;
              margin: 4px 0;
              border-radius: 4px;
            }
          }
          .equipment_icon {
            margin: 0 5px;
          }
          .equipment_name {
            float: left;
            width: 180px;
            height: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .Num_box {
        text-align: center;
        .online {
          font-size: 14px;
          color: #35bd20;
        }
        .offline {
          font-size: 14px;
          color: #999;
        }
        .all {
          font-size: 14px;
          color: blue;
        }
      }
    }
  }
}
.videoPlayback_right {
  height: calc(100vh - 330px);
  flex: 1;
  .no-device-icon {
    margin: calc(50vh - 200px) auto 16px;
    width: 50px;
    height: 50px;
    // background-image: url("../../../assets/images/equipmentList/no-device.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .device-area-text {
    position: absolute;
    top: -18px;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    padding: 0 2px;
    color: #fff;
  }
  .no-device-text {
    color: #fff;
    text-align: center;
    font-size: 20px;
  }

  .video_box {
    height: calc(100vh - 330px);
    overflow: hidden;
    margin-left: 10px;
    margin-right: 0;
    padding: 3px;
    // background-image: url("../../../assets/images/equipmentList/video_box.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background: #000;
    margin-top: 10px;
    position: relative;
    #video_box {
      height: calc(100vh - 330px);
    }
    .video_loading {
      position: absolute;
      top: 3px;
      left: 3px;
      z-index: 1000;
      height: calc(100vh - 336px);
      line-height: calc(100vh - 336px);
      width: calc(100% - 6px);
      background: rgba($color: #000, $alpha: 1);
      font-size: 18px;
      text-align: center;
      color: #ccc;
    }
    .video_btn_box {
      position: absolute;
      width: 100%;
      height: 50px;
      bottom: 0;
      z-index: 1006;
      display: flex;
      align-items: center;
      color: #fff;
      line-height: 34px;
      .video_btns {
        margin: 0 auto;
        width: 750px;
        display: flex;
        cursor: pointer;
      }
      .speed_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 1);
        background-image: url("../../../assets/images/icons/speed2.png");
        background-size: 27px 26px;
        background-position: 8px 3px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        text-align: center;
        position: relative;
        .speed_menu {
          width: 43px;
          height: 120px;
          background: rgba($color: #333, $alpha: 0.8);
          position: absolute;
          top: -124px;
          div {
            width: 43px;
            height: 30px;
            line-height: 30px;
          }
          .selSpeed {
            background: rgba($color: #30bee9, $alpha: 0.5);
          }
        }
      }
      .back_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/back.png");
        background-size: 31px 30px;
        background-position: 5px 1px;
        background-repeat: no-repeat;
        font-size: 12px;
        margin-left: 10px;
        border-radius: 6px;
        text-align: center;
        cursor: pointer;
      }
      .play_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/play.png");
        background-size: 25px 22px;
        background-position: 9px 6px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        font-size: 24px;
        text-align: center;
        cursor: pointer;
      }
      .stop_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/stop.png");
        background-size: 25px 22px;
        background-position: 9px 6px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        font-size: 24px;
        text-align: center;
        cursor: pointer;
      }
      .time_strip {
        width: 360px;
        height: 34px;
        line-height: 34px;
        padding-left: 10px;
        background: rgba($color: #333, $alpha: 0.8);
        margin-left: 10px;
        border-radius: 6px;
        font-size: 14px;
        color: #fff;
      }
      .voice_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/voice.png");
        background-size: 25px 22px;
        background-position: 9px 6px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        .voice_bar {
          width: 43px;
          padding: 10px 18px;
          height: 120px;
          background: rgba($color: #333, $alpha: 0.8);
          position: absolute;
          top: -124px;
        }
      }
      .noVoice {
        background-image: url("../../../assets/images/icons/noVoice.png");
      }
      .shot_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        margin-left: 10px;
        border-radius: 6px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
      }
      .full_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/full.png");
        background-size: 29px 26px;
        background-position: 7px 4px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
      }
      .noFull_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/noFull.png");
        background-size: 29px 26px;
        background-position: 7px 4px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
      }
      .fullWidth_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/fullWidth.png");
        background-size: 29px 26px;
        background-position: 7px 4px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
      }
      .reWidth_btn {
        width: 43px;
        height: 34px;
        background: rgba($color: #333, $alpha: 0.8);
        background-image: url("../../../assets/images/icons/reWidth.png");
        background-size: 29px 26px;
        background-position: 7px 4px;
        background-repeat: no-repeat;
        margin-left: 10px;
        border-radius: 6px;
        cursor: pointer;
      }
    }
  }
  .time_picker {
    height: 180px;
    overflow: hidden;
    margin-left: 10px;
    padding: 10px;
    margin-right: 0;
    // background-image: url("../../../assets/images/equipmentList/video_box.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-top: 10px;
    position: relative;
    .timeButton-box {
      float: right;
      .timeButton {
        float: left;
        width: 80px;
        border: 1px solid #037659;
        color: #037659;
        height: 34px;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
      }
      .timeButtonSelect {
        float: left;
        width: 76px;
        border: 1px solid #037659;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background: #037659;
        color: #fff;
        cursor: pointer;
      }
      .downloadButton {
        margin-left: 10px;
        float: left;
        width: 100px;
        border: 1px solid #037659;
        color: #037659;
        height: 34px;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
.scroll-area-back {
  width: 270px;
  padding: 0;
  margin-right: 10px;
  margin-top: 10px;
  height: calc(100vh - 260px);
  background: #f5f9f8;
}
.logo_box {
  padding: 8px;
  font-size: 12px;
  color: #ccc;
  border-top: 1px solid #037659;
  text-align: right;
  background: #f5f9f8;
  .logo_on {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 5px;
    background: rgb(85, 204, 85);
  }
  .logo_off {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 5px;
    background: #ccc;
  }
  .logo_all {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 5px;
    background: rgb(90, 195, 214);
  }
}
</style>
