<template>
  <el-dialog
    :visible.sync="isShow"
    width="45%"
    title="商户充值"
    center
    :append-to-body="true"
    :close-on-click-modal="true"
    class="dialog_navber"
  >
    <div class="base_dialog_main_content">
      <el-form :model="form" :rules="rules" ref="rechargeForm" label-width="140px">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:20px 80px">
            <el-form-item label="应收金额（元）" prop="receivableAmount">
              <el-input
                v-model="form.receivableAmount"
                placeholder="请输入"
                style="width: 72%"
                class="filter-item"
                size="small"
                @input="handleReceivableInput"
              />
            </el-form-item>
            <el-form-item label="实收金额（元）" prop="actualAmount">
              <el-input
                v-model="form.actualAmount"
                placeholder="请输入"
                style="width: 72%"
                class="filter-item"
                size="small"
                @input="handleActualInput"
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
import { merchantRecharge } from "@/api/merchantManagement";

export default {
  name: "MerchantRechargeDialog",
  data() {
    const validateReceivable = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入应收金额"));
      } else {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
          callback(new Error("应收金额请输入大于0的数值"));
        } else {
          callback();
        }
      }
    };

    const validateActual = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入实收金额"));
      } else {
        const num = parseFloat(value);
        const receivable = parseFloat(this.form.receivableAmount);
        if (isNaN(num) || num <= 0) {
          callback(new Error("实收金额请输入大于0的数值"));
        } else if (!isNaN(receivable) && num > receivable) {
          callback(new Error("实收金额需小于等于应收金额"));
        } else {
          callback();
        }
      }
    };

    return {
      isShow: false,
      merchantId: null,
      form: {
        receivableAmount: "",
        actualAmount: "",
        remark: ""
      },
      rules: {
        receivableAmount: [
          { required: true, validator: validateReceivable, trigger: "blur" }
        ],
        actualAmount: [
          { required: true, validator: validateActual, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    showDialog(merchantId) {
      this.isShow = true;
      this.merchantId = merchantId;
      this.form = {
        receivableAmount: "",
        actualAmount: "",
        remark: ""
      };
      if (this.$refs["rechargeForm"]) {
        this.$nextTick(() => {
          this.$refs["rechargeForm"].clearValidate();
        });
      }
    },
    handleReceivableInput(value) {
      this.form.receivableAmount = value.replace(/[^\d.]/g, "");
      if (this.form.receivableAmount) {
        const parts = this.form.receivableAmount.split(".");
        if (parts.length > 2) {
          this.form.receivableAmount = parts[0] + "." + parts.slice(1).join("");
        }
        if (parts[1] && parts[1].length > 2) {
          this.form.receivableAmount = parts[0] + "." + parts[1].substring(0, 2);
        }
      }
      if (this.$refs["rechargeForm"] && this.form.actualAmount) {
        this.$refs["rechargeForm"].validateField("actualAmount");
      }
    },
    handleActualInput(value) {
      this.form.actualAmount = value.replace(/[^\d.]/g, "");
      if (this.form.actualAmount) {
        const parts = this.form.actualAmount.split(".");
        if (parts.length > 2) {
          this.form.actualAmount = parts[0] + "." + parts.slice(1).join("");
        }
        if (parts[1] && parts[1].length > 2) {
          this.form.actualAmount = parts[0] + "." + parts[1].substring(0, 2);
        }
      }
    },
    closeDialog() {
      this.isShow = false;
    },
    toSave() {
      this.$refs["rechargeForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交充值吗?", "提示", {
            type: "warning"
          }).then(() => {
            const params = {
              merchantId: this.merchantId,
              amountDue: parseFloat(this.form.receivableAmount),
              amountActuality: parseFloat(this.form.actualAmount),
              memo: this.form.remark
            };
            merchantRecharge(params)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "充值成功"
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
