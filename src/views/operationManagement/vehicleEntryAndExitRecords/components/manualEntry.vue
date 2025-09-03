<template>
  <div class="base_dialog" v-show="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" :rules="rules" ref="parkingForm">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left2" style="padding:100px;">
            <span class="base_dialog_condit">
              <el-form-item label="停车场名称" prop="parkingLotId">
                <el-select
                  v-model="newList.parkingLotId"
                  placeholder="选择停车场"
                  clearable
                  @change="parkChange"
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in parkingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="入场设备" prop="barrierNumber">
                <el-select
                  v-model="newList.barrierNumber"
                  placeholder="选择入场设备"
                  clearable
                  @change="barrierChange"
                  class="filter-item"
                  style="width: 72%"
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

            <span class="base_dialog_condit" v-if="newList.type == 1">
              <el-form-item label="车牌号" prop="licensePlate">
                <el-input
                  v-model="newList.licensePlate"
                  placeholder="输入车牌号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
                <el-button @click="changeType(2)">无牌</el-button>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="newList.type == 2">
              <el-form-item label="车主手机" prop="phoneNumber">
                <el-input
                  v-model="newList.phoneNumber"
                  placeholder="输入车主手机"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
                <el-button @click="changeType(1)">有牌</el-button>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车辆类型" prop="vehicleType">
                <el-select
                  v-model="newList.vehicleType"
                  placeholder="选择车辆类型"
                  clearable
                  @change="vehicleTypeChange"
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in enumsData.VEHICLE_TYPE"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="车牌颜色" prop="vehicleColor">
                <el-select
                  v-model="newList.vehicleColor"
                  placeholder="选择车牌颜色"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in enumsData.LICENSE_PLATE_COLOR"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="入场时间" prop="entryTime">
                <el-date-picker
                  style="width: 72%"
                  v-model="newList.entryTime"
                  type="datetime"
                  :picker-options="pickerOptions"
                  @change="selTime"
                  value-format="timestamp"
                  placeholder="请选择时间"
                  size="small"
                ></el-date-picker>
              </el-form-item>
            </span>
            <div
              class="wenzi"
              style="font-size: 12px;padding-left: 100px;color:#ccc;height:20px;ling-height:20px"
            >
              *最多支持上传1张，上格式jpg/jpeg/png/bmp
            </div>

            <span class="base_dialog_condit">
              <el-form-item label="入场图片" prop="entryImg">
                <el-input
                  v-show="false"
                  v-model="newList.entryImg"
                  placeholder="图片"
                  class="filter-item"
                  size="mini"
                />
                <div class="uploaddiv">
                  <ImgPortrait3
                    v-if="newList.entryImg"
                    :PicSrc="newList.entryImg"
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
            </span>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType !== 3">
        <el-button type="info" @click="toSave">保存</el-button
        ><el-button type="danger" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  vehicleEntryDetail, //出入记录详情
  vehicleEntryUpdatePlate, //修改车牌
  insertInto, //手动入场
  getGateByParkId //获取出入闸机
} from "@/api/operationManagement";
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";
import { UploadImage } from "@/api/common";

import { fieldTable } from "@/api/common";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      title: "手动入场",
      isShow: false,
      newList: {
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
        entryImg: "" //入场图片
      }, //出入记录
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime(); // 当前时间之后的日期不可选
        },
        // onPick: ({ maxDate, minDate }) => {
        //   console.log("maxDate", maxDate);
        //   if (maxDate) {
        //     const selectedDate = new Date(maxDate);
        //     const maxDateObj = new Date(this.maxDateTime);
        //     console.log("selectedDate", selectedDate);
        //     console.log("maxDateObj", maxDateObj);
        //     // 检查选择的日期是否是最大日期的同一天
        //     if (
        //       selectedDate.getFullYear() === maxDateObj.getFullYear() &&
        //       selectedDate.getMonth() === maxDateObj.getMonth() &&
        //       selectedDate.getDate() === maxDateObj.getDate()
        //     ) {
        //       this.$nextTick(() => {
        //         const timeSelect = document.querySelector(".el-time-panel");
        //         if (timeSelect) {
        //           const lis = timeSelect.querySelectorAll("li");
        //           lis.forEach(li => {
        //             const timeValue = li.textContent.trim();
        //             const [hours, minutes] = timeValue.split(":").map(Number);
        //             console.log(111, hours);
        //             console.log(222, minutes);
        //             // 禁用超过最大时间的时间选项
        //             if (
        //               hours > maxDateObj.getHours() ||
        //               (hours === maxDateObj.getHours() &&
        //                 minutes > maxDateObj.getMinutes())
        //             ) {
        //               li.classList.add("disabled");
        //             }
        //           });
        //         }
        //       });
        //     }
        //   }
        // },
        maxDate: new Date() // 直接设置最大日期为当前日期
      },
      parkingList: [],
      equipmentList: [],
      time: [],
      rules: {
        parkingLotId: [
          {
            required: true,
            message: "请选择停车场",
            trigger: "change"
          }
        ],
        barrierNumber: [
          {
            required: true,
            message: "请选择入场设备",
            trigger: "change"
          }
        ],

        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
          {
            pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
            message: "请输入正确车牌号",
            trigger: "blur"
          }
        ],
        phoneNumber: [
          { required: true, message: "请输入车主手机", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确手机号码",
            trigger: "blur"
          }
        ],
        vehicleType: [
          {
            required: true,
            message: "请选择车辆类型",
            trigger: "change"
          }
        ],
        vehicleColor: [
          {
            required: true,
            message: "请选择车牌颜色",
            trigger: "change"
          }
        ],
        entryTime: [
          {
            required: true,
            message: "请选择入场时间",
            trigger: "change"
          }
        ]
      },
      Dictionaries: {
        enumTypes: "LICENSE_PLATE_COLOR,VEHICLE_TYPE"
      },
      enumsData: {} //字典表返回数据
    };
  },
  watch: {},

  created() {
    this.getFieldTable();
    this.getparking();
    this.$nextTick(() => {});
  },

  methods: {
    //入场图片验证
    beforeAvatarUpload(file) {
      const isLt100M = file.size / 1024 < 10000;
      if (!isLt100M) {
        this.$message.error("上传图片大小不能超过10M!");
      }
      return isLt100M;
    },

    //上传入场图片
    uploadPic(item) {
      let formData = new FormData();
      formData.append("file", item.file);

      UploadImage(formData).then(response => {
        this.newList.entryImg = response.url;
      });
    },
    //切换有牌无牌
    changeType(e) {
      this.newList.licensePlate = "";
      this.newList.phoneNumber = "";
      this.newList.type = e;
      this.$refs["parkingForm"].clearValidate(["licensePlate"]);
      this.$refs["parkingForm"].clearValidate(["phoneNumber"]);
    },
    //选择入场设备
    barrierChange(e) {
      this.equipmentList.forEach(el => {
        if (e == el.barrierNumber) {
          this.newList.barrierName = el.name;
          this.newList.barrierType = el.type;
        }
      });
    },

    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
      });
    },
    //选择入场时间
    selTime(e) {
      let now = new Date().getTime();
      if (e > now) {
        this.newList.entryTime = null;
        this.$message({
          type: "warning",
          message: "入场时间不得晚于当前时间"
        });
      }
    },
    parkChange(e) {
      if (e) {
        this.parkingList.forEach(el => {
          if (e == el.id) {
            this.newList.parkingLotName = el.name;
          }
        });
        let para = {
          parkId: this.newList.parkingLotId,
          type: 1
        };
        getGateByParkId(para).then(response => {
          this.equipmentList = response.data;
        });
      } else {
        this.equipmentList = [];
        this.newList.parkingLotId = null;
        this.newList.parkingLotName = "";
      }
      this.newList.barrierName = "";
      this.newList.barrierNumber = "";
      this.newList.barrierType = null;
    },
    vehicleTypeChange(e) {
      if (e == 3) {
        this.newList.vehicleColor = 4;
      } else if (e == 2) {
        this.newList.vehicleColor = 4;
      } else if (e == 4) {
        this.newList.vehicleColor = 5;
      }
    },
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
        let list = response.data.VEHICLE_TYPE;
        [list[0], list[1]] = [list[1], list[0]];
        this.enumsData.VEHICLE_TYPE = list;
      });
    },
    //打开注册、编辑弹窗
    showDialog(id, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      this.$nextTick(() => {
        if (this.$refs["parkingForm"]) {
          this.$refs["parkingForm"].resetFields();
          // this.$refs["parkingForm"].clearValidate();
        }
      });

      // this.getDetials(id);
    },
    //关闭新增/编辑弹窗
    closeDialog() {
      this.isShow = false;
      this.$emit("openLoading", {});
      this.$emit("getList", {});
    },
    //点击保存按钮
    toSave() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交手动入场吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.$emit("openLoading", {});
            let para = this.newList;
            insertInto(para)
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
