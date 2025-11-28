<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" :rules="rules" ref="parkingForm">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left3" style="padding:100px;">
            <span class="base_dialog_condit_flex">
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="停车场名称" prop="parkingType">
                  <span
                    class="base_dialog_condit_text"
                    :title="newList.parkingLotName"
                  >
                    {{ newList.parkingLotName }}
                  </span>
                </el-form-item>
              </span>
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="车牌号" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{ newList.licensePlate }}</span
                  >
                </el-form-item>
              </span>
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="车辆类型" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{ newList.vehicleTypeName }}</span
                  >
                </el-form-item>
              </span>
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="车牌颜色" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{ newList.vehicleColorName }}</span
                  >
                </el-form-item>
              </span>
            </span>
            <span class="base_dialog_condit_flex">
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="入场时间" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{
                      newList.entryTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                    }}</span
                  >
                </el-form-item>
              </span>
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="入场设备" prop="parkingType">
                  <span
                    class="base_dialog_condit_text"
                    :title="newList.barrierName"
                  >
                    {{ newList.barrierName }}</span
                  >
                </el-form-item>
              </span>
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="入场图片" prop="parkingType">
                  <el-popover placement="top-start" width="500" trigger="click">
                    <img
                      :src="
                        newList.entryImg ? newList.entryImg : newList.entryImg
                      "
                      width="100%"
                    />
                    <img
                      v-if="
                        newList.entryImg !== '' && newList.entryImg !== null
                      "
                      slot="reference"
                      :src="newList.entryImg"
                      width="48"
                      height="36"
                    />
                    <!-- :src="
                        newList.entryImg +
                          '?x-oss-process=image/resize,h_36,w_48'
                      " -->
                    <span v-else>
                      <div min-width="48" height="36"></div>
                    </span>
                  </el-popover>
                </el-form-item>
              </span>
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="是否出场" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{ newList.isLeave == 1 ? "是" : "否" }}</span
                  >
                </el-form-item>
              </span>
            </span>
            <span class="base_dialog_condit">
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="缴费状态" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    <span v-if="newList.payStatus == 0" class="falseBox">
                      {{ newList.payStatusName }}</span
                    >
                    <span v-else class="trueBox">
                      {{ newList.payStatusName }}</span
                    ></span
                  >
                </el-form-item>
              </span>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="出场设备" prop="leaveBarrierNumber">
                <el-select
                  v-model="newList.leaveBarrierNumber"
                  placeholder="选择出场设备"
                  clearable
                  @change="barrierChange"
                  class="filter-item"
                  style="width: 500px"
                  size="small"
                >
                  <el-option
                    v-for="item in equipmentList"
                    :key="item.barrierNumber"
                    :label="item.name"
                    :value="item.barrierNumber"
                  />
                </el-select>
              </el-form-item>
            </span>

            <!-- <span class="base_dialog_condit">
              <el-form-item label="出场时间" prop="leaveTime">
                <el-date-picker
                  style="width: 500px"
                  v-model="newList.leaveTime"
                  type="datetime"
                  :picker-options="pickerOptions"
                  @change="selTime"
                  value-format="timestamp"
                  placeholder="请选择时间"
                  size="small"
                ></el-date-picker>
              </el-form-item>
            </span> -->
            <!-- <div
              class="wenzi"
              style="font-size: 12px;padding-left: 100px;color:#ccc;height:20px;ling-height:20px"
            >
              *最多支持上传1张，上格式jpg/jpeg/png/bmp
            </div> -->

            <!-- <span class="base_dialog_condit">
              <el-form-item label="出场图片" prop="leaveImg">
                <el-input
                  v-show="false"
                  v-model="newList.leaveImg"
                  placeholder="图片"
                  class="filter-item"
                  size="mini"
                />
                <div class="uploaddiv">
                  <ImgPortrait3
                    v-if="newList.leaveImg"
                    :PicSrc="newList.leaveImg"
                    type="3"
                    class="photos_p"
                  ></ImgPortrait3>
                  <el-upload
                    class="avatar-uploader photos_div"
                    action="String"
                    accept="image/jpeg, image/jpg, image/png, image/bmp"
                    :http-request="uploadPic"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    v-else
                    element-loading-text="图像校验中"
                  >
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </el-form-item>
            </span> -->
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType !== 3">
        <el-button type="info" @click="toSave">确认出场</el-button
        ><el-button type="danger" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  vehicleEntryDetail, //出入记录详情
  tranceFrom, //出场
  getGateByParkId //获取出入闸机
} from "@/api/operationManagement";
import { UploadImage } from "@/api/common";

import { fieldTable } from "@/api/common";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      title: "抬杆放行",
      isShow: false,
      newList: {
        id: null,
        parkingLotId: null, //车场id
        parkingLotName: null, //车场名称
        licensePlate: "", //车牌号
        phoneNumber: "", //手机号
        vehicleType: null, //车辆类型
        vehicleColor: null, //车牌颜色
        entryTime: null, //入场时间
        barrierName: "", //入场闸名
        barrierNumber: "", //入场闸编号
        barrierType: "", //入场闸类型
        type: 1, //1.有牌 2.无牌
        entryImg: "", //入场图片
        leaveTime: null, //出场时间
        leaveBarrierNumber: null, //出场闸编号
        leaveBarrierName: "", //出场闸名
        leaveBarrierType: "", //出场闸类型
        leaveImg: "" //出场图片
      }, //出入记录
      pickerOptions: {
        // disabledDate(time) {
        //   console.log(345, this.getTime2());
        //   let res = false;
        //   if (time.getTime() > new Date().getTime()) {
        //     res = true;
        //   } else if (time.getTime() < this.newList.entryTime) {
        //     res = true;
        //   }
        //   return res; // 当前时间之后的日期不可选
        // },
        maxDate: new Date() // 直接设置最大日期为当前日期
      },

      rules: {
        leaveBarrierNumber: [
          {
            required: true,
            message: "请选择出场设备",
            trigger: "change"
          }
        ]
        // leaveTime: [
        //   {
        //     required: true,
        //     message: "请选择出场时间",
        //     trigger: "change"
        //   }
        // ]
      },
      time: [],
      equipmentList: [],
      Dictionaries: {
        enumTypes:
          "BUY_UNIT,RULE_VEHICLE_TYPE,PREFERENTIAL_PARKING_TYPE,RULE_PARKING_DIRECTION"
      },
      enumsData: {} //字典表返回数据
    };
  },
  watch: {},

  created() {
    this.getFieldTable();
  },

  methods: {
    getTime2() {
      let entryTime = new Date(this.newList.entryTime);
      let date = entryTime.setHours(0, 0, 0, 0);

      this.pickerOptions = {
        disabledDate(time) {
          let res = false;
          if (time.getTime() > new Date().getTime()) {
            res = true;
          } else if (time.getTime() < date) {
            res = true;
          }
          return res; // 当前时间之后的日期不可选
        },
        maxDate: new Date() // 直接设置最大日期为当前日期
      };
    },
    //出场图片验证
    beforeAvatarUpload(file) {
      const isLt100M = file.size / 1024 < 10000;
      if (!isLt100M) {
        this.$message.error("上传图片大小不能超过10M!");
      }
      return isLt100M;
    },

    //上传出场图片
    uploadPic(item) {
      let formData = new FormData();
      formData.append("file", item.file);

      UploadImage(formData).then(response => {
        this.newList.leaveImg = response.url;
      });
    },
    //选择出场设备
    barrierChange(e) {
      this.equipmentList.forEach(el => {
        if (e == el.barrierNumber) {
          this.newList.leaveBarrierName = el.name;
          this.newList.leaveBarrierType = el.type;
        }
      });
    },

    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
        this.enumsData.BUY_UNIT.unshift({
          enumName: "不限",
          enumValue: null
        });
      });
    },
    //选择入场时间
    selTime(e) {
      let now = new Date().getTime();
      if (e > now) {
        this.newList.leaveTime = null;
        this.$message({
          type: "warning",
          message: "出场时间不得晚于当前时间"
        });
      } else if (this.newList.entryTime > e) {
        this.newList.leaveTime = null;
        this.$message({
          type: "warning",
          message: "出场时间不得早于入场时间"
        });
      }
    },

    //打开注册、编辑弹窗
    showDialog(id, pageType) {
      this.pageType = pageType;
      this.getDetials(id);
    },
    //获取详情
    getDetials(id) {
      let para = { id: id };
      vehicleEntryDetail(para).then(response => {
        this.newList = response.data;
        this.getTime2();
        this.isShow = true;
        this.$nextTick(() => {
          if (this.$refs.parkingForm) {
            this.$refs.parkingForm.resetFields();
            this.$refs.parkingForm.clearValidate();
          }
        });
        let para = {
          parkId: this.newList.parkingLotId,
          type: 2
        };
        getGateByParkId(para).then(response => {
          let arr = response.data;
          let newArr = [];
          if (this.newList.barrierType == 1) {
            newArr = arr.filter(a => a.type == 3);
          }
          if (this.newList.barrierType == 2) {
            newArr = arr.filter(a => a.type == 4);
          }
          this.equipmentList = newArr;
        });
      });
    },
    //关闭新增/编辑弹窗
    closeDialog() {
      this.isShow = false;
      this.$emit("openLoading", {});
      this.$emit("getList", {});
    },
    //点击出场按钮
    toSave() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交出场吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.$emit("openLoading", {});
            let para = {
              id: this.newList.id,
              leaveBarrierNumber: this.newList.leaveBarrierNumber,
              path: "/hiCar/system/vehicleEntry/leave"
            };
            tranceFrom(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                  // this.getDetials(response.id);
                } else {
                  // this.$message({
                  //   type: "error",
                  //   message: "提交失败"
                  // });
                }
                setTimeout(() => {
                  this.isShow = false;
                  this.$emit("getList", {});
                }, 300);
              })
              .catch(() => {
                // this.$message({
                //   type: "error",
                //   message: "提交失败"
                // });
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.base_dialog_condit_text {
  display: inline-block;
  width: 180px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.a {
  padding-left: 160px;
}
.discountRulesDialogText {
  padding-left: 32px;
}
.photos_p {
  width: 110px;
  height: 110px;
}

.uploaddiv >>> .avatar-uploader .el-upload {
  width: 110px;
  height: 110px;
  line-height: 110px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploaddiv >>> .avatar-uploader {
  height: 110px;
}
.uploaddiv >>> .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.uploaddiv >>> .avatar-uploader-icon {
  font-size: 24px;
  font-weight: bold;
  color: #999;
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
}
.uploaddiv >>> .avatar-uploader .avatar {
  width: 110px;
  height: 110px;
}
</style>
