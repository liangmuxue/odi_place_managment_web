<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <div style="padding:15px">欠费总额：{{ totalMoney }}元</div>
      <el-table
        :data="newList"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 260px)"
        align="left"
        style="margin:5px 25px;width:calc(100vw - 270px)"
      >
        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="停车场名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌颜色" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.color }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入场时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.admissionTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出场时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.exitTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="欠费金额(元)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.arrears }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.payment == 1 ? "已补缴" : "待补缴"
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      title: "欠款明细",
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
      this.title = vehicle + "欠费明细";
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
