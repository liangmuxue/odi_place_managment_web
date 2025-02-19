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
          <div class="base_dialog_main_left" style="padding:100px">
            <span class="base_dialog_condit">
              <el-form-item label="规则名称" prop="ruleName">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.ruleName }}</span
                >
                <el-input
                  v-else
                  v-model="newList.ruleName"
                  placeholder="输入规则名称"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="购买单位" prop="buyUnit">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.buyUnitName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.buyUnit"
                  placeholder="选择购买单位"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in enumsData.BUY_UNIT"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="单位价格(元)" prop="unitPrice">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.unitPrice }}</span
                >
                <el-input
                  v-else
                  v-model="newList.unitPrice"
                  placeholder="输入单位价格"
                  @input="handleInput2"
                  style="width: 64%"
                  class="filter-item"
                  size="small"
                />
                / {{ getName(newList.buyUnit) }}
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="单次购买上限(个)" prop="maxBuy">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.maxBuy }}</span
                >
                <el-input
                  v-else
                  v-model="newList.maxBuy"
                  placeholder="输入单次购买上限"
                  style="width: 72%"
                  @input="handleInput1"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车辆类型" prop="ruleVehicleType">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.ruleVehicleTypeName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.ruleVehicleType"
                  placeholder="选择车辆类型"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in enumsData.RULE_VEHICLE_TYPE"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车位类型" prop="ruleParkingDirection">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.ruleParkingDirectionName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.ruleParkingDirection"
                  placeholder="选择车位类型"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in enumsData.RULE_PARKING_DIRECTION"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span
              class="base_dialog_condit"
              v-if="newList.status == 1 && pageType == 3"
            >
              <el-form-item label="车位类型" prop="parkingLots">
                <span class="base_dialog_condit_text"> {{ parkingLots }}</span>
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType !== 3">
        <el-button type="info" icon="el-icon-circle-plus" @click="toSave"
          >保存</el-button
        ><el-button type="danger" icon="el-icon-error" @click="closeDialog"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  ruleParkingLeasesCheckName, //长租规则检查规则名是否存在
  ruleParkingLeasesDetail, //长租规则详情
  ruleParkingLeasesInsert, //长租规则新增
  ruleParkingLeasesUpdate //长租规则编辑
} from "@/api/operationManagement";
import { fieldTable } from "@/api/common";

export default {
  components: {},
  data() {
    const validateEditRuleName = (rule, value, callback) => {
      if (this.editRuleName !== value) {
        let para = {
          ruleName: value
        };
        ruleParkingLeasesCheckName(para).then(response => {
          if (response.data === 1) {
            callback(new Error("规则名称重复不可用"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };

    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      editRuleName: null, //编辑规则名
      parkingLots: "", //使用中的停车场
      newList: {
        ruleName: "", //规则名
        buyUnit: null, //购买单位
        unitPrice: null, //单位价格
        maxBuy: null, //购买上限
        ruleVehicleType: null, //车辆类型
        ruleParkingDirection: null //车位类型
      }, //车位详情
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名", trigger: "blur" },
          {
            pattern: /[\u4E00-\u9FA5a-zA-Z0-9_\-]{1,20}$/,
            message: "请输入20以内字符，且不含特殊字符",
            trigger: "blur"
          },
          {
            required: true,
            message: "规则名已存在",
            trigger: "blur",
            validator: validateEditRuleName
          }
        ],
        buyUnit: [
          { required: true, message: "请选择购买单位", trigger: "blur" }
        ],
        unitPrice: [
          { required: true, message: "请选择单位价格", trigger: "blur" }
        ],
        ruleVehicleType: [
          { required: true, message: "请选择车辆类型", trigger: "blur" }
        ],
        ruleParkingDirection: [
          { required: true, message: "请选择车位类型", trigger: "blur" }
        ]
      },
      Dictionaries: {
        enumTypes: "BUY_UNIT,RULE_VEHICLE_TYPE,RULE_PARKING_DIRECTION"
      },
      enumsData: {} //字典表返回数据
    };
  },
  created() {
    this.getFieldTable();
  },
  methods: {
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
      this.newList.maxBuy = value.toString().replace(/[^0-9]/g, "");
      if (this.newList.maxBuy > 999) {
        this.newList.maxBuy = 999; // 如果超过999，设置为999
      } else if (this.newList.maxBuy < 0) {
        this.newList.maxBuy = 0; // 如果小于0，设置为0
      }
    },
    handleInput2(value) {
      // 限制输入为大于等于0
      this.newList.unitPrice = value.toString().replace(/[^0-9]/g, "");
      if (this.newList.unitPrice < 0) {
        this.newList.unitPrice = 0; // 如果小于0，设置为0
      }
    },
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
      });
    },
    //打开注册、编辑弹窗
    showDialog(id, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      if (this.$refs["parkingForm"]) {
        this.$refs["parkingForm"].resetFields();
      }

      if (pageType == 2) {
        this.title = "编辑";
        this.getDetials(id);
      } else if (pageType == 3) {
        this.title = "详情";
        this.getDetials(id);
      } else {
        this.title = "新增";
        this.newList = {
          ruleName: "", //规则名
          buyUnit: null, //购买单位
          unitPrice: null, //单位价格
          maxBuy: null, //购买上限
          ruleVehicleType: null, //车辆类型
          ruleParkingDirection: null //车位类型
        };
        if (this.$refs["parkingForm"]) {
          this.$nextTick(() => {
            this.$refs["parkingForm"].clearValidate();
          });
        }
      }
    },
    //获取详情
    getDetials(id) {
      let para = { id: id };
      ruleParkingLeasesDetail(para).then(response => {
        this.newList = response.data.rule;
        this.editRuleName = response.data.ruleName;
        let arr = [];
        let list = response.data.parkingLots;
        if (response.data.parkingLots && response.data.parkingLots.length) {
          list.forEach(el => {
            arr.push(el.name);
          });
        }
        this.parkingLots = arr.toString();
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
      if (!this.newList.id) {
        this.toAdd();
      } else {
        this.toEidt();
      }
    },
    //添加长租规则
    toAdd() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存长租规则吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            ruleParkingLeasesInsert(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                  // this.getDetials(response.id);
                } else {
                  this.$message({
                    type: "warning",
                    message: "提交失败"
                  });
                }
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              })
              .catch(() => {
                this.$message({
                  type: "warning",
                  message: "提交失败"
                });
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              });
          });
        }
      });
    },
    //编辑长租规则
    toEidt() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的长租规则吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            ruleParkingLeasesUpdate(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                } else {
                  this.$message({
                    type: "warning",
                    message: "提交失败"
                  });
                }
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              })
              .catch(() => {
                this.$message({
                  type: "warning",
                  message: "提交失败"
                });
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              });
          });
        } else {
          console.log("error submit!!");
          return false;
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
</style>
