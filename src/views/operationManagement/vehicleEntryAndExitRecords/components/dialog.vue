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
          <div class="base_dialog_main_left2" style="padding:100px;">
            <span class="base_dialog_condit">
              <el-form-item label="车牌号" prop="licensePlate">
                <el-input
                  v-model="newList.licensePlate"
                  placeholder="输入车牌号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit_flex">
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="停车场名称" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{ newList.parkingLotName }}</span
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
                <el-form-item label="出场时间" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{
                      newList.leaveTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                    }}</span
                  >
                </el-form-item>
              </span>
            </span>
            <span class="base_dialog_condit_flex">
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="入场设备" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{ newList.barrierName }}</span
                  >
                </el-form-item>
              </span>
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="出场设备" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{ newList.leaveBarrierName }}</span
                  >
                </el-form-item>
              </span>
            </span>
            <span class="base_dialog_condit_flex">
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
                <el-form-item label="出场图片" prop="parkingType">
                  <el-popover placement="top-start" width="500" trigger="click">
                    <img
                      :src="
                        newList.leaveImg ? newList.leaveImg : newList.leaveImg
                      "
                      width="100%"
                    />
                    <img
                      v-if="
                        newList.leaveImg !== '' && newList.leaveImg !== null
                      "
                      slot="reference"
                      :src="newList.leaveImg"
                      width="48"
                      height="36"
                    />
                    <!-- :src=" newList.leaveImg +
                    '?x-oss-process=image/resize,h_36,w_48' " -->
                    <span v-else>
                      <div min-width="48" height="36"></div>
                    </span>
                  </el-popover>
                </el-form-item>
              </span>
            </span>
            <span class="base_dialog_condit_flex">
              <span class="base_dialog_condit_flexItem">
                <el-form-item label="是否出场" prop="parkingType">
                  <span class="base_dialog_condit_text">
                    {{ newList.isLeave == 1 ? "是" : "否" }}</span
                  >
                </el-form-item>
              </span>
            </span>

            <span class="base_dialog_condit_flex">
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
  vehicleEntryUpdatePlate //修改车牌
} from "@/api/operationManagement";
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";

import { fieldTable } from "@/api/common";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      title: "修改车牌",
      isShow: false,
      newList: {
        licensePlate: "", //车牌
        parkingType: null, //适用类型
        parkingTypeName: "", //适用类型
        buyUnit: null, //适用购买单位
        buyUnitName: "", //适用购买单位
        discount: null, //折扣
        maxAmount: null, //封顶优惠金额
        expirationDay: null, //领取后有效期
        activityStartTime: null, //活动开始时间
        activityEndTime: null, //活动开始时间
        parkingLotIds: [], //适用停车场id
        parkingLotNames: "" //适用停车场name
      }, //出入记录
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
          // {
          //   pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
          //   message: "请输入正确车牌号",
          //   trigger: "blur"
          // }
        ]
      },
      time: [],
      parkingList: [],
      Dictionaries: {
        enumTypes:
          "BUY_UNIT,RULE_VEHICLE_TYPE,PREFERENTIAL_PARKING_TYPE,RULE_PARKING_DIRECTION"
      },
      enumsData: {} //字典表返回数据
    };
  },
  watch: {
    time(value) {
      if (value === null) {
        this.time = ["", ""];
      }
      this.changeTime();
    }
  },

  created() {
    this.getFieldTable();
    this.getparking();
  },

  methods: {
    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
      });
    },
    changeTime() {
      if (this.time[0]) {
        this.newList.activityStartTime = this.time[0].getTime();
      }
      if (this.time[1]) {
        this.newList.activityEndTime = this.time[1].getTime();
      }
    },

    parkingTypeChange(e) {
      console.log(111, e);
      if (e !== 1) {
        this.newList.buyUnit = null;
      }
    },
    //获取单位名
    getName(e) {
      let arr = this.enumsData.BUY_UNIT;
      let name = "";
      arr.forEach(el => {
        if (e == el.enumValue) {
          name = el.enumName;
        }
      });
      return name;
    },
    handleInput1(value) {
      // 限制输入为0到999之间的整数
      this.newList.expirationDay = value.toString().replace(/[^0-9]/g, "");
      if (this.newList.expirationDay > 365) {
        this.newList.expirationDay = 365; // 如果超过999，设置为999
      } else if (this.newList.expirationDay == 0) {
        this.newList.expirationDay = 1; // 如果小于0，设置为0
      }
    },
    handleInput2(value) {
      // 限制输入为大于等于0,保留一位小数
      this.newList.maxAmount = value.toString().replace(/[^0-9\.]/g, "");
      let maxAmount = this.newList.maxAmount.toString();
      let length;
      if (maxAmount.includes(".")) {
        length = maxAmount.split(".")[1].length;
      } else {
        length = 0;
      }
      if (length > 1) {
        let a = this.newList.maxAmount * 1;
        this.newList.maxAmount = a.toFixed(1);
      }
      if (this.newList.maxAmount == 0) {
        this.newList.maxAmount = 0.1;
      }
    },
    handleInput3(value) {
      // 限制输入0-10,保留一位小数
      this.newList.discount = value.toString().replace(/[^0-9\.]/g, "");
      let discount = this.newList.discount.toString();
      let length;
      if (discount.includes(".")) {
        length = discount.split(".")[1].length;
      } else {
        length = 0;
      }
      if (length > 1) {
        let a = this.newList.discount * 1;
        this.newList.discount = a.toFixed(1);
      }
      if (this.newList.discount == 0) {
        this.newList.discount = 0.1;
      }
      if (this.newList.discount >= 10) {
        this.newList.discount = 9.9;
      }
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
    //打开注册、编辑弹窗
    showDialog(id, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      if (this.$refs["parkingForm"]) {
        this.$refs["parkingForm"].resetFields();
      }
      this.getDetials(id);
    },
    //获取详情
    getDetials(id) {
      let para = { id: id };
      vehicleEntryDetail(para).then(response => {
        this.newList = response.data;
        this.time = [
          response.data.activityStartTime,
          response.data.activityEndTime
        ];
      });
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
          this.$confirm("确认提交修改车牌吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = {
              id: this.newList.id,
              licensePlate: this.newList.licensePlate
            };
            vehicleEntryUpdatePlate(para)
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
</style>
