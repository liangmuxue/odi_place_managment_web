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
      <el-form :model="form" :rules="rules" ref="rechargeTimesForm" label-width="140px">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:20px 80px">
            <el-form-item label="充值数量（次）" prop="quantity">
              <el-input
                v-model="form.quantity"
                placeholder="请输入"
                style="width: 72%"
                class="filter-item"
                size="small"
                @input="handleQuantityInput"
              />
            </el-form-item>
            <div class="base_dialog_main_prompt" v-if="form.quantity && (form.quantity < 1 || form.quantity > 100000)">
              只能输入1-100000的整数
            </div>
            <el-form-item label="应收金额（元）" prop="receivableAmount">
              <span>{{ receivableAmount }}</span>
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
import { deductionRechargeTimes } from "@/api/merchantManagement";

export default {
  name: "DeductionRechargeTimesDialog",
  data() {
    const validateQuantity = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入充值数量"));
      } else {
        const num = parseInt(value);
        if (isNaN(num) || num < 1 || num > 100000 || !Number.isInteger(parseFloat(value))) {
          callback(new Error("充值数量请输入1-100000的整数"));
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
        if (isNaN(num) || num < 0) {
          callback(new Error("实收金额请输入大于等于0的数值"));
        } else if (this.receivableAmount && num > parseFloat(this.receivableAmount)) {
          callback(new Error("实收金额需小于等于应收金额"));
        } else {
          callback();
        }
      }
    };

    return {
      isShow: false,
      mapId: null,
      unitPrice: 0,
      form: {
        quantity: "",
        actualAmount: "",
        remark: ""
      },
      rules: {
        quantity: [
          { required: true, validator: validateQuantity, trigger: "blur" }
        ],
        actualAmount: [
          { required: true, validator: validateActual, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    receivableAmount() {
      const qty = parseInt(this.form.quantity);
      if (isNaN(qty) || qty < 1) {
        return "";
      }
      const amount = qty * this.unitPrice;
      return amount.toFixed(2);
    }
  },
  methods: {
    showDialog(mapId, unitPrice) {
      this.isShow = true;
      this.mapId = mapId;
      this.unitPrice = parseFloat(unitPrice) || 0;
      this.form = {
        quantity: "",
        actualAmount: "",
        remark: ""
      };
      if (this.$refs["rechargeTimesForm"]) {
        this.$nextTick(() => {
          this.$refs["rechargeTimesForm"].clearValidate();
        });
      }
    },
    handleQuantityInput(value) {
      this.form.quantity = value.replace(/[^\d]/g, "");
      if (this.$refs["rechargeTimesForm"] && this.form.actualAmount) {
        this.$refs["rechargeTimesForm"].validateField("actualAmount");
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
      this.$refs["rechargeTimesForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交充值吗?", "提示", {
            type: "warning"
          }).then(() => {
            const params = {
              id: this.mapId,
              quantity: parseInt(this.form.quantity),
              amountActuality: parseFloat(this.form.actualAmount),
              memo: this.form.remark
            };
            deductionRechargeTimes(params)
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
              });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.base_dialog_main_prompt {
  width: 72%;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-left: 136px;
  background: rgba($color: #ffd986, $alpha: 0.3);
  color: #f50e0e;
  margin-top: -24px;
  margin-bottom: 10px;
  font-size: 12px;
}
</style>
