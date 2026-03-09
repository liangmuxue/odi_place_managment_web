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
      <el-form :model="form" :rules="rules" ref="refundForm" label-width="140px">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:20px 80px">
            <el-form-item label="退款金额（元）" prop="refundAmount">
              <el-input
                v-model="form.refundAmount"
                placeholder="请输入"
                style="width: 72%"
                class="filter-item"
                size="small"
                @input="handleRefundInput"
              />
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
import { merchantRefund } from "@/api/merchantManagement";

export default {
  name: "MerchantRefundDialog",
  props: {
    balance: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    const validateRefund = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入退款金额"));
      } else {
        const num = parseFloat(value);
        const bal = parseFloat(this.balance);
        if (isNaN(num) || num < 0) {
          callback(new Error("退款金额请输入大于等于0的数值"));
        } else if (!isNaN(bal) && num > bal) {
          callback(new Error("退款金额需小于等于账户余额"));
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
        const refund = parseFloat(this.form.refundAmount);
        if (isNaN(num) || num < 0) {
          callback(new Error("实退金额请输入大于等于0的数值"));
        } else if (!isNaN(refund) && num > refund) {
          callback(new Error("实退金额需小于等于退款金额"));
        } else {
          callback();
        }
      }
    };

    return {
      isShow: false,
      merchantId: null,
      form: {
        refundAmount: "",
        actualRefundAmount: "",
        remark: ""
      },
      rules: {
        refundAmount: [
          { required: true, validator: validateRefund, trigger: "blur" }
        ],
        actualRefundAmount: [
          { required: true, validator: validateActualRefund, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    showDialog(merchantId) {
      this.isShow = true;
      this.merchantId = merchantId;
      this.form = {
        refundAmount: "",
        actualRefundAmount: "",
        remark: ""
      };
      if (this.$refs["refundForm"]) {
        this.$nextTick(() => {
          this.$refs["refundForm"].clearValidate();
        });
      }
    },
    handleRefundInput(value) {
      this.form.refundAmount = value.replace(/[^\d.]/g, "");
      if (this.form.refundAmount) {
        const parts = this.form.refundAmount.split(".");
        if (parts.length > 2) {
          this.form.refundAmount = parts[0] + "." + parts.slice(1).join("");
        }
        if (parts[1] && parts[1].length > 2) {
          this.form.refundAmount = parts[0] + "." + parts[1].substring(0, 2);
        }
      }
      if (this.$refs["refundForm"] && this.form.actualRefundAmount) {
        this.$refs["refundForm"].validateField("actualRefundAmount");
      }
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
      this.$refs["refundForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交退费吗?", "提示", {
            type: "warning"
          }).then(() => {
            const params = {
              merchantId: this.merchantId,
              amountDue: parseFloat(this.form.refundAmount),
              amountActuality: parseFloat(this.form.actualRefundAmount),
              memo: this.form.remark
            };
            merchantRefund(params)
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
