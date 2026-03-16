<template>
  <el-dialog
    :visible.sync="isShow"
    width="45%"
    title="商户退费"
    center
    :append-to-body="true"
    :close-on-click-modal="true"
    class="dialog_navber"
  >
    <div class="base_dialog_main_content">
      <el-form :model="form" :rules="rules" ref="refundTimesForm" label-width="140px">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:20px 80px">
            <el-form-item label="退款数量（次）" prop="quantity">
              <el-input
                v-model="form.quantity"
                placeholder="请输入"
                style="width: 72%"
                class="filter-item"
                size="small"
                @input="handleQuantityInput"
              />
            </el-form-item>
            <el-form-item label="退款金额（元）" prop="refundAmount">
              <span>{{ refundAmount }}</span>
            </el-form-item>
            <el-form-item label="实退金额（元）" prop="actualRefundAmount">
              <el-input
                v-model="form.actualRefundAmount"
                placeholder="请输入"
                style="width: 72%"
                class="filter-item"
                size="small"
                @input="handleActualRefundInput"
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="form.remark"
                placeholder="输入内容不超过200字符"
                :rows="2"
                maxlength="200"
                show-word-limit
                style="width: 72%"
                class="filter-item"
                size="small"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" style="padding-bottom:30px;text-align:center">
        <el-button type="info" style="padding:10px 20px" @click="toSave">提交</el-button>
        <el-button type="danger" style="padding:10px 20px" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { deductionRefundTimes } from "@/api/merchantManagement";

export default {
  name: "DeductionRefundTimesDialog",
  data() {
    const validateQuantity = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入退款数量"));
      } else {
        const num = parseInt(value);
        if (isNaN(num) || num < 1 || !Number.isInteger(parseFloat(value))) {
          callback(new Error("退款数量需为大于0的整数"));
        } else if (num > this.remainingBalance) {
          callback(new Error("退款数量需小于等于充值剩余"));
        } else {
          callback();
        }
      }
    };

    const validateActualRefund = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入实退金额"));
      } else {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
          callback(new Error("实退金额请输入大于等于0的数值"));
        } else if (this.refundAmount && num > parseFloat(this.refundAmount)) {
          callback(new Error("实退金额需小于等于退款金额"));
        } else {
          callback();
        }
      }
    };

    return {
      isShow: false,
      mapId: null,
      unitPrice: 0,
      remainingBalance: 0,
      form: {
        quantity: "",
        actualRefundAmount: "",
        remark: ""
      },
      rules: {
        quantity: [
          { required: true, validator: validateQuantity, trigger: "blur" }
        ],
        actualRefundAmount: [
          { required: true, validator: validateActualRefund, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    refundAmount() {
      const qty = parseInt(this.form.quantity);
      if (isNaN(qty) || qty < 1) {
        return "";
      }
      const amount = qty * this.unitPrice;
      return amount.toFixed(2);
    }
  },
  methods: {
    showDialog(mapId, unitPrice, remainingBalance) {
      this.isShow = true;
      this.mapId = mapId;
      this.unitPrice = parseFloat(unitPrice) || 0;
      this.remainingBalance = parseInt(remainingBalance) || 0;
      this.form = {
        quantity: "",
        actualRefundAmount: "",
        remark: ""
      };
      if (this.$refs["refundTimesForm"]) {
        this.$nextTick(() => {
          this.$refs["refundTimesForm"].clearValidate();
        });
      }
    },
    handleQuantityInput(value) {
      this.form.quantity = value.replace(/[^\d]/g, "");
    },
    handleActualRefundInput(value) {
      this.form.actualRefundAmount = value.replace(/[^\d.]/g, "");
      if (this.form.actualRefundAmount) {
        const parts = this.form.actualRefundAmount.split(".");
        if (parts.length > 2) {
          this.form.actualRefundAmount = parts[0] + "." + parts.slice(1).join("");
        }
        if (parts[1] && parts[1].length > 2) {
          this.form.actualRefundAmount = parts[0] + "." + parts[1].substring(0, 2);
        }
      }
    },
    closeDialog() {
      this.isShow = false;
    },
    toSave() {
      this.$refs["refundTimesForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交退费吗?", "提示", {
            type: "warning"
          }).then(() => {
            const params = {
              id: this.mapId,
              quantity: parseInt(this.form.quantity),
              amountActuality: parseFloat(this.form.actualRefundAmount),
              memo: this.form.remark
            };
            deductionRefundTimes(params)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "退费成功"
                  });
                  this.closeDialog();
                  this.$emit("success");
                }
              })
              .catch(() => {
                // 错误已在拦截器处理
              });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
