<template>
  <div>
    <div class="merchantDeductAndIssue_main ">
      <el-form :model="newList" :rules="rules" ref="licensePlateForm">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:100px">
            <span class="base_dialog_condit">
              <el-form-item label="输入方式">
                <el-radio-group v-model="keyboardType">
                  <el-radio label="1">键盘</el-radio>
                  <el-radio label="2">软键盘</el-radio>
                </el-radio-group>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车牌号" prop="licensePlate">
                <el-input
                  v-model="newList.licensePlate"
                  placeholder="输入车牌号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
                <div
                  class="inputBox"
                  @click="clickInput"
                  v-show="keyboardType == 2"
                >
                  <span v-if="newList.licensePlate">{{
                    newList.licensePlate
                  }}</span>
                  <span v-else style="color:#ccc;font-size: 13px;"
                    >输入车牌号</span
                  >
                </div>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="抵扣券" prop="merchantDeductionRuleId">
                <el-select
                  v-model="newList.merchantDeductionRuleId"
                  placeholder="请选择抵扣券"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                  @change="onDeductionChange"
                >
                  <el-option
                    v-for="item in deductionList"
                    :key="item.id"
                    :label="item.deductionName"
                    :value="item.merchantDeductionRuleId"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="showQuantity">
              <el-form-item label="发放数量" prop="quantity">
                <el-input-number
                  v-model="newList.quantity"
                  :min="1"
                  :max="maxQuantity"
                  size="small"
                  style="width: 150px"
                />
                <span class="quantity_balance" v-if="selectedDeduction && selectedDeduction.deductionMode === '次数'">
                  {{ quantityBalance }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="showRepeatTime">
              <el-form-item label="重复使用开始时间" prop="validTimeStart">
                <el-date-picker
                  v-model="newList.validTimeStart"
                  type="datetime"
                  placeholder="请选择开始时间"
                  style="width: 72%"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="showRepeatTime">
              <el-form-item label="重复使用结束时间" prop="validTimeEnd">
                <el-date-picker
                  v-model="newList.validTimeEnd"
                  type="datetime"
                  placeholder="请选择结束时间"
                  style="width: 72%"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="备注" prop="memo">
                <div class="memo_wrapper">
                  <el-input
                    v-model="newList.memo"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入备注；输入内容不超过200字符"
                    style="width: 72%"
                    class="filter-item"
                    maxlength="200"
                    size="small"
                  />
                  <span class="memo_count">{{ memoLength }}/200</span>
                </div>
              </el-form-item>
            </span>
            <span class="base_dialog_condit btn_condit">
              <el-button type="success" @click="submitForm">确认发券</el-button>
            </span>
          </div>
        </div>
      </el-form>
    </div>
    <Dialog ref="dialog" @setNo="setNo"></Dialog>
  </div>
</template>

<script>
import Dialog from "./dialog";
import { getDeductionsByMerchantIdNoPage, manualSaveDistribution } from "@/api/merchantManagement";

export default {
  name: "manualIssue",
  components: { Dialog },

  data() {
    const validateQuantity = (rule, value, callback) => {
      if (!this.showQuantity) {
        return callback();
      }
      if (value === null || value === undefined || value === "") {
        return callback(new Error("发放数量必须为大于等于1的整数"));
      }
      if (value < 1) {
        return callback(new Error("发放数量必须为大于等于1的整数"));
      }
      if (this.selectedDeduction && this.selectedDeduction.deductionMode === "次数") {
        const balance = this.selectedDeduction.quantityBalance || 0;
        if (value > balance) {
          return callback(new Error("发放数量需小于等于充值剩余"));
        }
      }
      if (this.selectedDeduction && this.selectedDeduction.deductionMode === "预充") {
        if (value > 999) {
          return callback(new Error("预充方式发放数量需小于等于999"));
        }
      }
      callback();
    };

    const validateValidTimeStart = (rule, value, callback) => {
      if (!this.showRepeatTime) {
        return callback();
      }
      if (!value) {
        return callback(new Error("请选择重复使用开始时间"));
      }
      callback();
    };

    const validateValidTimeEnd = (rule, value, callback) => {
      if (!this.showRepeatTime) {
        return callback();
      }
      if (!value) {
        return callback(new Error("请选择重复使用结束时间"));
      }
      if (this.newList.validTimeStart && value <= this.newList.validTimeStart) {
        return callback(new Error("结束时间必须大于开始时间"));
      }
      callback();
    };

    return {
      newList: {
        licensePlate: "",
        merchantDeductionRuleId: null,
        quantity: 1,
        validTimeStart: null,
        validTimeEnd: null,
        memo: ""
      },
      keyboardType: "1",
      deductionList: [],
      selectedDeduction: null,
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        merchantDeductionRuleId: [
          { required: true, message: "请选择抵扣券", trigger: "change" }
        ],
        quantity: [
          { required: true, validator: validateQuantity, trigger: "blur" }
        ],
        validTimeStart: [
          { required: true, validator: validateValidTimeStart, trigger: "blur" }
        ],
        validTimeEnd: [
          { required: true, validator: validateValidTimeEnd, trigger: "blur" }
        ],
        memo: []
      }
    };
  },
  computed: {
    showQuantity() {
      return this.selectedDeduction !== null;
    },
    showRepeatTime() {
      // deductionTimes为null表示有效期内重复使用
      return this.selectedDeduction && this.selectedDeduction.deductionTimes === null;
    },
    maxQuantity() {
      if (this.selectedDeduction && this.selectedDeduction.deductionMode === "次数") {
        return this.selectedDeduction.quantityBalance || 1;
      }
      if (this.selectedDeduction && this.selectedDeduction.deductionMode === "预充") {
        return 999;
      }
      return 9999;
    },
    quantityBalance() {
      if (this.selectedDeduction && this.selectedDeduction.quantityBalance !== undefined) {
        return this.selectedDeduction.quantityBalance;
      }
      return "";
    },
    memoLength() {
      return (this.newList.memo || "").length;
    }
  },
  created() {
    this.loadDeductionList();
  },
  methods: {
    loadDeductionList() {
      // 调试用，商户ID写死为1
      const para = { merchantId: 1 };
      getDeductionsByMerchantIdNoPage(para).then(res => {
        this.deductionList = res.data || [];
      });
    },
    onDeductionChange(val) {
      if (val) {
        this.selectedDeduction = this.deductionList.find(
          item => item.merchantDeductionRuleId === val
        );
        this.newList.quantity = 1;
        this.newList.validTimeStart = null;
        this.newList.validTimeEnd = null;
      } else {
        this.selectedDeduction = null;
      }
      // 清除相关字段的校验状态
      this.$nextTick(() => {
        if (this.$refs.licensePlateForm) {
          this.$refs.licensePlateForm.clearValidate(["quantity", "validTimeStart", "validTimeEnd"]);
        }
      });
    },
    clickInput() {
      let licensePlate = this.newList.licensePlate;
      this.$refs.dialog.openDialog(licensePlate);
    },
    setNo(licensePlate) {
      this.newList.licensePlate = licensePlate;
      this.$refs["licensePlateForm"].validateField("licensePlate");
    },
    submitForm() {
      this.$refs["licensePlateForm"].validate(valid => {
        if (!valid) {
          return;
        }
        // 备注校验
        if (this.newList.memo && this.newList.memo.length > 200) {
          this.$message.warning("备注不能多于200字");
          return;
        }
        this.$confirm("确认发放抵扣券吗?", "提示", {
          type: "warning"
        }).then(() => {
          const para = {
            merchantId: 1, // 调试用，写死为1
            merchantDeductionRuleId: this.newList.merchantDeductionRuleId,
            vehicleNumber: this.newList.licensePlate,
            quantity: this.newList.quantity,
            validTimeStart: this.showRepeatTime ? this.newList.validTimeStart : null,
            validTimeEnd: this.showRepeatTime ? this.newList.validTimeEnd : null,
            memo: this.newList.memo
          };
          manualSaveDistribution(para).then(res => {
            if (res.code === 200 || res.code === "200") {
              this.$message.success("发放成功");
              this.resetForm();
              this.loadDeductionList();
            }
          });
        });
      });
    },
    resetForm() {
      this.newList = {
        licensePlate: "",
        merchantDeductionRuleId: null,
        quantity: 1,
        validTimeStart: null,
        validTimeEnd: null,
        memo: ""
      };
      this.selectedDeduction = null;
      if (this.$refs.licensePlateForm) {
        this.$refs.licensePlateForm.clearValidate();
      }
    },
    confirm() {
      if (this.licensePlateUnit.length >= 7) {
        console.log("车牌是：" + this.licensePlateUnit.join(""));
        this.licensePlateDoor = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.merchantDeductAndIssue_main {
  margin: 0 auto;
  width: 800px;
  .base_dialog_condit {
    position: relative;
    .inputBox {
      position: absolute;
      top: 4px;
      left: 101px;
      display: inline-block;
      width: 71%;
      height: 28px;
      line-height: 30px;
      padding: 0 15px;
      font-size: 13px;
      color: #606266;
      background: #fff;
      border-radius: 5px;
    }
    .quantity_balance {
      margin-left: 10px;
      color: #e6a23c;
      font-size: 12px;
    }
    .memo_wrapper {
      position: relative;
      display: inline-block;
      width: 72%;
      .memo_count {
        position: absolute;
        right: 10px;
        bottom: 5px;
        font-size: 12px;
        color: #909399;
      }
    }
  }
  .btn_condit {
    padding-left: 100px;
    margin-top: 20px;
  }
}
</style>
