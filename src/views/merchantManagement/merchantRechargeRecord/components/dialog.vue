<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      充值详情
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="detail">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding: 40px 80px">
          <span class="base_dialog_condit">
            <el-form-item label="商户名称：">
              <span class="base_dialog_condit_text">{{ detail.merchantName }}</span>
            </el-form-item>
          </span>
          <span class="base_dialog_condit">
            <el-form-item label="抵扣券名称：">
              <span class="base_dialog_condit_text">{{ detail.deductionName }}</span>
            </el-form-item>
          </span>
          <span class="base_dialog_condit">
            <el-form-item label="充值数量：">
              <span class="base_dialog_condit_text">{{ detail.quantity }}</span>
            </el-form-item>
          </span>
          <span class="base_dialog_condit">
            <el-form-item label="售价(元)：">
              <span class="base_dialog_condit_text">{{ detail.price | getMoney }}</span>
            </el-form-item>
          </span>
          <span class="base_dialog_condit">
            <el-form-item label="应收金额(元)：">
              <span class="base_dialog_condit_text">{{ detail.amountDue | getMoney }}</span>
            </el-form-item>
          </span>
          <span class="base_dialog_condit">
            <el-form-item label="实收金额(元)：">
              <span class="base_dialog_condit_text">{{ detail.amountActuality | getMoney }}</span>
            </el-form-item>
          </span>
          <span class="base_dialog_condit">
            <el-form-item label="充值类型：">
              <span class="base_dialog_condit_text">
                {{ detail.rechargeType }}
              </span>
            </el-form-item>
          </span>
          <span class="base_dialog_condit">
            <el-form-item label="充值时间：">
              <span class="base_dialog_condit_text">
                {{ detail.operateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
              </span>
            </el-form-item>
          </span>
          <span class="base_dialog_condit">
            <el-form-item label="操作人：">
              <span class="base_dialog_condit_text">{{ detail.operator }}</span>
            </el-form-item>
          </span>
          <span class="base_dialog_condit" v-if="detail.memo">
            <el-form-item label="备注：">
              <span class="base_dialog_condit_text">{{ detail.memo }}</span>
            </el-form-item>
          </span>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { merchantRechargeRecordDetail } from "@/api/merchantManagement";

export default {
  data() {
    return {
      isShow: false,
      detail: {}
    };
  },
  methods: {
    showDialog(id) {
      if (!id) {
        return;
      }
      this.isShow = true;
      const para = { merchantRechargeId: id };
      merchantRechargeRecordDetail(para)
        .then(response => {
          const data = response.data || {};
          this.detail = data;
        })
        .catch(() => {
          // 接口异常时，保底展示空对象，避免页面报错
          this.detail = {};
        });
    },
    closeDialog() {
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.a {
  padding-left: 160px;
}
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
.bdc {
  position: relative;
}
.bdcp {
  position: absolute;
  top: 0;
  left: 300px;
  width: 500px;
}
</style>
