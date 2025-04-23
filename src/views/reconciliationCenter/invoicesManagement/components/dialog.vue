<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main"></div>
  </div>
</template>

<script>
import {
  arrearsRecordGetInfo //小程序用户列表
} from "@/api/reconciliationCenter";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      title: "查看发票",
      isShow: false,
      totalMoney: null,
      newList: [] //欠款明细
    };
  },
  created() {},
  methods: {
    //打开弹窗
    showDialog(vehicle) {
      this.isShow = true;
      this.title = "查看发票";
      this.getDetials(vehicle);
    },
    //关闭弹窗
    closeDialog() {
      this.isShow = false;
    },

    //获取详情
    getDetials(vehicle) {
      let para = { vehicle: vehicle };
      arrearsRecordGetInfo(para).then(response => {
        this.newList = response.data.list;
        this.totalMoney = response.data.totalMoney;
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
