<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <div style="padding:15px">欠费总额：{{ totalMoney | getMoney }}元</div>
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
            <span class="content">{{ scope.row.arrears | getMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.payment == 1 ? "已补缴" : "待补缴"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          :key="12"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.payment != 1"
              class="operation_button update_btn"
              @click="toDelete(scope.row)"
              v-has="{ red: 'outstandingFeesRecordDelete', type: 1 }"
            >
              删除
            </span>
            <!-- v-has="{ red: 'editBox', type: 1 }" -->
          </template>
          >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  arrearsRecordRemoveById, //删除欠费记录
  arrearsRecordGetInfo //小程序用户列表
} from "@/api/reconciliationCenter";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      curDetials: null,
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
      this.curDetials = vehicle;
      this.getDetials(vehicle);
    },
    //关闭弹窗
    closeDialog() {
      this.isShow = false;
    },
    //删除
    toDelete(e) {
      let id = e.id;
      let text = "确认删除该欠费记录吗?";

      this.$confirm(text, "提示", {
        type: "warning"
      }).then(() => {
        let para = {
          id: id
        };
        arrearsRecordRemoveById(para).then(response => {
          if (response.code == "200") {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            if (this.newList.length > 1) {
              let vehicle = this.curDetials;
              this.getDetials(vehicle);
            } else {
              this.isShow = false;
              this.$emit("openLoading", {});
              setTimeout(() => {
                this.$emit("getList", {});
              }, 300);
            }
          } else {
            // this.$message({
            //   type: "error",
            //   message: "删除失败"
            // });
          }
        });
      });
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
