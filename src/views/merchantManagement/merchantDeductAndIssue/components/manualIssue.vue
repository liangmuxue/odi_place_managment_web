<template>
  <div>
    <div class="merchantDeductAndIssue_main ">
      <el-form :model="newList" :rules="rules" ref="licensePlateForm" label-width="140px">
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
                  v-show="keyboardType == 1"
                />
                <div
                  class="inputBox"
                  @click="clickInput"
                  v-show="keyboardType == 2"
                >
                  <span v-if="newList.licensePlate">{{
                    newList.licensePlate
                  }}</span>
                  <span v-else class="inputBox-placeholder">输入车牌号</span>
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
                  size="small"
                  style="width: 150px"
                  @change="onQuantityChange"
                />
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
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="备注" prop="memo">
                <el-input
                  v-model="newList.memo"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注"
                  style="width: 72%"
                  class="filter-item"
                  maxlength="200"
                  show-word-limit
                  size="small"
                />
              </el-form-item>
            </span>
            <div class="base_dialog_main_btnBox btn_condit">
              <el-button type="info" @click="submitForm" v-has="{ red: 'merchantDeductAndIssueManualSubmit', type: 1 }">确认发券</el-button>
            </div>
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
          return callback(new Error(`发放次数超过剩余次数，无法发放`));
        }
      }
      if (this.selectedDeduction && this.selectedDeduction.deductionMode === "预充") {
        if (value > 999) {
          return callback(new Error("预充方式，发放数量不能超过999"));
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
          { required: true, validator: validateQuantity, trigger: ["blur", "change"] }
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
      // 移除自动限制机制，改为验证提示
      return 9999;
    },
    quantityBalance() {
      if (this.selectedDeduction && this.selectedDeduction.deductionMode === "次数" && this.selectedDeduction.quantityBalance !== undefined) {
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
      const para = {};
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
    onQuantityChange() {
      // 当数量改变时手动触发验证
      this.$nextTick(() => {
        if (this.$refs.licensePlateForm) {
          this.$refs.licensePlateForm.validateField("quantity");
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
        if (this.selectedDeduction && this.selectedDeduction.deductionMode === "预充") {
          const overdraftAllowed =
            this.selectedDeduction.allowOverdraft === true ||
            this.selectedDeduction.allowOverdraft === 1;
          if (!overdraftAllowed) {
            const balance = this.selectedDeduction.amountBalance || 0;
            if (balance <= 0) {
              this.$message.warning("余额不足，无法发放");
              return;
            }
          }
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
      if (this.$refs.licensePlateForm) {
        this.$refs.licensePlateForm.resetFields();
      }
      this.selectedDeduction = null;
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
    .el-form-item__content {
      position: relative;
      .inputBox {
        display: inline-block;
        width: 72%;
        height: 32px;
        line-height: 32px;
        padding: 0 15px;
        font-size: 13px;
        color: #606266;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .inputBox-placeholder {
        color: #c0c4cc;
      }
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
    padding-left: 140px;
    margin-top: 20px;
  }
}
</style>
