<template>
  <div class="content_box">
    <div id="full-size-area" class="full-size-area" style="display: none"></div>
    <div class="content_box_top">
      <div class="content_box_top_left ">
        <span class="content_box_top_left_content">
          <div class="content_box_top_left_content_title">停车场</div>
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
      </div>
      <div class="top_box">
        <el-radio-group v-model="vidoeType" @input="checkRadio">
          <el-radio-button label="1">单屏</el-radio-button>
          <el-radio-button label="2">四分屏</el-radio-button>
          <el-radio-button label="3">九分屏</el-radio-button>
          <el-radio-button label="4">十六分屏</el-radio-button>
        </el-radio-group>
        <!-- <el-radio-group v-model="isFull">
        <el-radio-button :label="true"
          ><i class="el-icon-full-screen"></i
        ></el-radio-button>
      </el-radio-group> -->
        <el-button @click="fullSizeSwitch">
          <i class="el-icon-full-screen"></i>
        </el-button>
      </div>
    </div>
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
              <div :class="e.state == 1 ? 'equipment_type' : 'equipment_type2'">
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
              <div :class="e.state == 1 ? 'equipment_type' : 'equipment_type2'">
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
      <div class="right_box" id="right_box">
        <div
          :class="getClass"
          class="video_box"
          id="video_box"
          @dblclick="dbVidoeBox"
        >
          <div class="item" v-for="(item, i) in vidoeBoxList" :key="i">
            <div v-if="!videoItems[i].status" class="no-device-text">
              未选择设备
            </div>
            <div class="device-area-text" v-show="videoItems[i].status">
              <span class="device-ball"></span>
              {{ videoItems[i].cameraName }}
            </div>
            <VideoBox
              v-if="videoItems[i].status"
              :ref="videoItems[i].refId"
              :id="videoItems[i].pwId"
              :bindId="videoItems[i].refId"
            ></VideoBox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  deviceStreamList //设备列表
} from "@/api/equipmentManagement";
import {} from "@/api/common";
import VideoBox from "./components/videoBox";
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";
import DistrictTree from "./components/districtTree";
import {
  deviceListTree //设备树形列表
} from "@/api/homePage";

export default {
  name: "RealTimeMonitoring",
  components: { VideoBox, DistrictTree },
  data() {
    return {
      vidoeType: "1",
      cameralist: [], //设备列表
      checkList: [], //选中设备列表
      cameraName: "", //设备名称
      parkingList: [],
      curPark: null,
      list: [],
      onlineNum: 0,
      offlineNum: 0,
      allNum: 0,
      vidoeBoxList: [],
      videoItems: [
        {
          id: 1, //编号
          refId: "videoW1",
          pwId: "p-videoW1", //外层div的id
          src: "", //视频连接
          deviceId: null, //对应的相机设备编号
          status: 0, //状态： 0-未启动 1-播放中
          ip: "", //ip
          port: "", //端口
          name: "", //视频名
          cameraName: "" //像机名称
        }
      ],
      fareGateList: [],
      // fareGateSearchList: [],
      monitorList: [],
      // monitorSearchList: [],
      openCameraList: [],
      isFull: false
    };
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
    },
    getClass: function() {
      let type = this.vidoeType;
      let name = "";
      if (type == 1) {
        name = "video_box1";
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.vidoeBoxList = [1];
      } else if (type == 2) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.vidoeBoxList = [1, 2, 3, 4];
        name = "video_box4";
      } else if (type == 3) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.vidoeBoxList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        name = "video_box9";
      } else if (type == 4) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.vidoeBoxList = [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16
        ];
        name = "video_box16";
      }
      return name;
    }
  },
  methods: {
    getDeviceListTree() {
      let para = { parkId: this.curPark };
      deviceListTree(para).then(response => {
        this.fareGateList = response.data[0].children;
        this.monitorList = response.data[1].children;
      });
    },

    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
      });
    },

    checkRadio(e) {
      let vieeoNo;
      this.videoItems = [];
      this.checkList = [];
      if (e == "1") {
        vieeoNo = 1;
      } else if (e == "2") {
        vieeoNo = 4;
      } else if (e == "3") {
        vieeoNo = 9;
      } else if (e == "4") {
        vieeoNo = 16;
      }
      for (var i = 1; i <= vieeoNo; i++) {
        const videoItem = {
          id: i, //编号
          refId: "videoW" + i,
          pwId: "p-videoW" + i, //外层div的id
          src: "", //视频连接
          deviceId: null, //对应的相机设备编号
          status: 0, //状态： 0-未启动 1-播放中
          cameraName: "", //像机名称
          ip: "", //ip
          port: "", //端口
          name: "" //视频名
        };
        this.videoItems.push(videoItem);
      }
    },
    //获取摄像头是否显示
    getShow(e) {
      if (!this.cameraName) return true;
      return e.deviceName.indexOf(this.cameraName) !== -1;
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
    parkChange() {
      this.getDeviceListTree();
      this.checkList = [];
    },
    //选择设备
    treeItemSelect(data, index) {
      // if (data) {
      //   this.playByDeviceId(data, index);
      // } else {
      //   const videoItem = this.videoItems[index];
      //   Object.assign(videoItem, { status: 0 });
      //   Object.assign(videoItem, { deviceId: null });
      //   Object.assign(videoItem, { cameraName: "" });
      //   Object.assign(videoItem, { src: null });
      // }
    },

    //选中设备
    checkCamera(e) {
      if (this.vidoeType == 1) {
        let arr = [...this.checkList];
        if (this.checkList.length > 1) {
          arr.shift();
          this.stopByDeviceId(this.checkList[0]);
          setTimeout(() => {
            this.playOrStop(e);
          }, 300);
        } else {
          this.playOrStop(e);
        }
        this.checkList = arr;
      } else if (this.vidoeType == 2) {
        let arr = [...this.checkList];
        if (this.checkList.length > 4) {
          arr.shift();
          this.stopByDeviceId(this.checkList[0]);
          setTimeout(() => {
            this.playOrStop(e);
          }, 300);
        } else {
          this.playOrStop(e);
        }
        this.checkList = arr;
      } else if (this.vidoeType == 3) {
        let arr = [...this.checkList];
        if (this.checkList.length > 9) {
          arr.shift();
          this.stopByDeviceId(this.checkList[0]);
          setTimeout(() => {
            this.playOrStop(e);
          }, 300);
        } else {
          this.playOrStop(e);
        }
        this.checkList = arr;
      } else if (this.vidoeType == 4) {
        let arr = [...this.checkList];
        if (this.checkList.length > 16) {
          arr.shift();
          this.stopByDeviceId(this.checkList[0]);
          setTimeout(() => {
            this.playOrStop(e);
          }, 300);
        } else {
          this.playOrStop(e);
        }
        this.checkList = arr;
      }
    },
    playOrStop(e) {
      let checked = this.checkList.indexOf(e.deviceId) !== -1;
      if (!checked) {
        this.stopByDeviceId(e.deviceId);
      } else {
        this.playByDeviceId(e);
      }
    },
    // 根据选定设备进行播放
    playByDeviceId(data) {
      //首先获取一个空闲的播放窗口对象
      if (data.deviceId && data.deviceName) {
        const videoItem = this.getBlankVideoItem(data.deviceId);
        if (!videoItem) {
          return;
        }
        videoItem.deviceId = data.deviceId;
        videoItem.cameraName = data.deviceName;
        videoItem.ip = data.streamIp;
        if (data.streamPort) {
          videoItem.port = data.streamPort.toString();
        }
        videoItem.name = data.streamName;
        //注意这里不能直接用等号进行引用赋值，需要进行拷贝
        // Object.assign(videoItem, { src: "ws://" + src });
        Object.assign(videoItem, { src: data.remark });
        //设置状态为播放中,后续播放行为由组件自行完成
        videoItem.status = 1;
        this.$nextTick(() => {
          let ref = eval("this.$refs.videoW" + videoItem.id)[0];
          var obj4 = Object.assign(data, videoItem);
          ref.toPlay(obj4);
        });
      }
    },

    //停止视频
    stopByDeviceId(deviceId) {
      console.log(111);
      const videoItem = this.getVideoItemByDevice(deviceId);
      //首先取得视频播放窗口对象，调用停止播放的方法
      if (videoItem) {
        //通过设置状态销毁组件
        videoItem.status = 0;
      }
    },
    //取得一个空闲的视频对象
    getBlankVideoItem(deviceId) {
      this.openCameraList.push(deviceId);
      // localStorage.setItem("openCameraList", this.openCameraList);
      let videoItem = null;
      this.videoItems.some(item => {
        if (item.status === 0) {
          videoItem = item;
          return true;
        }
      });
      return videoItem;
    },

    //根据设备好取得视频对象
    getVideoItemByDevice(deviceId) {
      for (let i = 0; i < this.openCameraList.length; i++) {
        if (this.openCameraList[i] === deviceId) {
          this.openCameraList.splice(i, 1);
        }
      }
      // localStorage.setItem("openCameraList", this.openCameraList);
      let videoItem = null;
      this.videoItems.some(item => {
        if (item.deviceId === deviceId) {
          videoItem = item;
          return true;
        }
      });
      return videoItem;
    },
    dbVidoeBox() {
      if (this.isFull) {
        this.closeFull();
      } else {
        this.fullSizeSwitch();
      }
    },
    //全屏显示
    fullSizeSwitch() {
      this.isFull = true;
      this.$nextTick(() => {
        const videoWindow = document.getElementById("video_box");
        document.getElementById("full-size-area").style.display = "block";
        document.getElementById("full-size-area").appendChild(videoWindow);
      });
    },
    //关闭全屏显示
    closeFull() {
      this.isFull = false;
      this.$nextTick(() => {
        const videoWindow = document.getElementById("video_box");
        document.getElementById("full-size-area").style.display = "none";
        document.getElementById("right_box").appendChild(videoWindow);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content_box {
  padding-top: 20px;
  height: calc(100vh - 130px);
  background: #fff;
}
.content_box_top {
  display: flex;
  .content_box_top_left {
    width: 270px;
    margin-left: 10px;
    .content_box_top_left_content {
      display: flex;
      .content_box_top_left_content_title {
        width: 70px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        border: 1px solid #dcdfe6;
      }
    }
  }
}
.top_box {
  width: 320px;
  margin: 0px auto 10px;
  display: flex;
}
.equipment_box {
  display: flex;
  box-sizing: border-box;
  height: 100%;
  padding: 10px;
  .left_box {
    width: 270px;
    padding: 0;
    margin-right: 10px;
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
  .right_box {
    flex: 1;
    margin: 0 30px 50px 0;
    height: calc(100vh - 240px);
    background: #000;
  }
}
.video_box {
  display: grid;
  box-sizing: border-box;
  height: 100%;
  padding: 0;
  .item {
    box-sizing: border-box;
    position: relative;
    border: 1px solid #fff;
    position: relative;
    .device-area-text {
      position: absolute;
      z-index: 1013;
      top: 5px;
      left: 10px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      padding: 0 2px;
      color: #35bd20;
      background: rgba($color: #000000, $alpha: 0.3);
      border-radius: 3px;
      .device-ball {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #35bd20;
        border-radius: 4px;
      }
    }
    .no-device-text {
      color: #fff;
      text-align: center;
      width: 200px;
      text-align: center;
      font-size: 20px;
      position: absolute;
      height: 32px;
      line-height: 32px;
      top: 50%;
      /* 相当于父盒子上边界走父盒子高度的50% */
      left: 50%;
      /*相对于父盒子左边界走父盒子宽度的50%*/
      margin-top: -16px;
      /*向上走回自身高度的一半*/
      margin-left: -100px;
      /*向左走回自身宽度的一半*/
    }
  }
}
.video_box1 {
  grid-template-columns: repeat(1, 100%);
  grid-auto-rows: repeat(1, 100%);
}
.video_box4 {
  grid-template-columns: repeat(2, 50%);
  grid-auto-rows: repeat(2, 50%);
}
.video_box9 {
  grid-template-columns: repeat(3, 33.33%);
  grid-auto-rows: repeat(3, 33.33%);
}
.video_box16 {
  grid-template-columns: repeat(4, 25%);
  grid-auto-rows: repeat(4, 25%);
}
.full-size-area {
  position: fixed !important;
  z-index: 1011;
  left: 0px !important;
  top: 0px !important;
  height: calc(100vh) !important;
  width: calc(100vw) !important;
  background: rgba($color: #000, $alpha: 1);
}
</style>
