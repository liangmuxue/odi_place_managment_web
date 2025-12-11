<template>
  <div class="qrcodeIssue">
    <div class="merchantDeductAndIssue_main">
      <el-form :model="formData" :rules="rules" ref="qrcodeForm" label-width="140px">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:100px">
            <span class="base_dialog_condit">
              <el-form-item label="抵扣券" prop="merchantDeductionRuleId">
                <el-select
                  v-model="formData.merchantDeductionRuleId"
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
            <span class="base_dialog_condit">
              <el-form-item label="二维码失效时间" prop="qrcodeExpireType">
                <el-radio-group v-model="formData.qrcodeExpireType">
                  <el-radio label="60">60秒</el-radio>
                  <el-radio label="0">不失效</el-radio>
                </el-radio-group>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车辆在场才能领取" prop="vehiclePresent">
                <el-radio-group v-model="formData.vehiclePresent">
                  <el-radio label="0">关闭</el-radio>
                  <el-radio label="1">开启</el-radio>
                </el-radio-group>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="showRepeatTime">
              <el-form-item label="重复使用开始时间" prop="validTimeStart">
                <el-date-picker
                  v-model="formData.validTimeStart"
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
                  v-model="formData.validTimeEnd"
                  type="datetime"
                  placeholder="请选择结束时间"
                  style="width: 72%"
                  size="small"
                />
              </el-form-item>
            </span>
            <div class="base_dialog_main_btnBox btn_condit">
              <el-button type="info" @click="generateQrcode">
                生成二维码
              </el-button>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <QrcodeDialog ref="qrcodeDialog" />
  </div>
</template>

<script>
import { getDeductionsByMerchantIdNoPage, qrcodeSave } from "@/api/merchantManagement";
import QrcodeDialog from "./qrcodeDialog.vue";

export default {
  name: "qrcodeIssue",
  components: { QrcodeDialog },
  data() {
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
      if (this.formData.validTimeStart && value <= this.formData.validTimeStart) {
        return callback(new Error("结束时间必须大于开始时间"));
      }
      callback();
    };

    return {
      formData: {
        merchantDeductionRuleId: null,
        qrcodeExpireType: "60",
        vehiclePresent: "0",
        validTimeStart: null,
        validTimeEnd: null
      },
      deductionList: [],
      selectedDeduction: null,
      rules: {
        merchantDeductionRuleId: [
          { required: true, message: "请选择抵扣券", trigger: "change" }
        ],
        qrcodeExpireType: [
          { required: true, message: "请选择二维码失效时间", trigger: "change" }
        ],
        vehiclePresent: [
          { required: true, message: "请选择车辆在场才能领取", trigger: "change" }
        ],
        validTimeStart: [
          { required: true, validator: validateValidTimeStart, trigger: "blur" }
        ],
        validTimeEnd: [
          { required: true, validator: validateValidTimeEnd, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    showRepeatTime() {
      // deductionTimes为null表示有效期内重复使用
      return this.selectedDeduction && this.selectedDeduction.deductionTimes === null;
    }
  },
  created() {
    this.loadDeductionList();
  },
  methods: {
    loadDeductionList() {
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
        this.formData.validTimeStart = null;
        this.formData.validTimeEnd = null;
      } else {
        this.selectedDeduction = null;
      }
      this.$nextTick(() => {
        if (this.$refs.qrcodeForm) {
          this.$refs.qrcodeForm.clearValidate(["validTimeStart", "validTimeEnd"]);
        }
      });
    },
    generateQrcode() {
      this.$refs["qrcodeForm"].validate(valid => {
        if (!valid) {
          return;
        }
        if (this.selectedDeduction && this.selectedDeduction.deductionMode === "次数") {
          const balance = this.selectedDeduction.quantityBalance || 0;
          if (balance <= 0) {
            this.$message.warning("该抵扣券剩余次数为0，无法生成二维码");
            return;
          }
        }
        const para = {
          merchantId: 1,
          merchantDeductionRuleId: this.formData.merchantDeductionRuleId,
          quantity: 1,
          qrcodeExpireType: this.formData.qrcodeExpireType,
          // 二维码模式：60秒为动态，不失效为静态
          qrcodeMode: this.formData.qrcodeExpireType === "60" ? "动态" : "静态",
          vehiclePresent: this.formData.vehiclePresent,
          validTimeStart: this.showRepeatTime ? this.formData.validTimeStart : null,
          validTimeEnd: this.showRepeatTime ? this.formData.validTimeEnd : null
        };
        qrcodeSave(para).then(res => {
          if (res.code === 200 || res.code === "200") {
            const qrcodeId = res.data;
            const isDynamic = this.formData.qrcodeExpireType === "60";
            this.$refs.qrcodeDialog.openDialog(qrcodeId, isDynamic);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.qrcodeIssue {
  padding: 20px;
}
.merchantDeductAndIssue_main {
  margin: 0 auto;
  width: 800px;
  .base_dialog_condit {
    position: relative;
  }
  .btn_condit {
    padding-left: 140px;
    margin-top: 20px;
  }
}
</style>
