<template>
  <div class="commit_page">
    <div class="totalMoney_box">欠费统计：{{ totalMoney }}元</div>
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">车牌号</div>
        <el-input v-model="listQuery.vehicle" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title2">欠费金额</div>
        <el-input
          v-model="listQuery.startArrears"
          placeholder="请输入"
          style="width:150px"
        ></el-input>
        <span style="line-height:36px;padding:0 5px">-</span>
        <el-input
          v-model="listQuery.endArrears"
          placeholder="请输入"
          style="width:150px"
        >
        </el-input>
      </span>
      <span class="search_content" v-if="pageType == 1">
        <div class="search_content_title2">欠费次数</div>
        <el-input
          v-model="listQuery.startNumber"
          placeholder="请输入"
          style="width:150px"
        >
        </el-input>
        <span style="line-height:36px;padding:0 5px">-</span>
        <el-input
          v-model="listQuery.endNumber"
          placeholder="请输入"
          style="width:150px"
        >
        </el-input>
      </span>
      <span class="search_content2" v-if="pageType == 2">
        <div class="search_content_title">出场时间</div>
        <el-date-picker
          style="width: 72%"
          v-model="time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="请选择时间"
          end-placeholder
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </span>
      <span class="search_content" v-if="pageType == 2">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content" v-if="pageType == 2">
        <div class="search_content_title">状态</div>
        <el-select
          v-model="listQuery.payment"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in statusList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>

      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>
    <div class="btn_box">
      <el-radio-group
        v-model="pageType"
        @input="chengePageType"
        style="margin-right:10px"
      >
        <el-radio-button :label="1">按车牌统计</el-radio-button>
        <el-radio-button :label="2">按时间统计</el-radio-button>
      </el-radio-group>

      <el-button type="info" icon="el-icon-upload2" @click="toExport"
        >导出</el-button
      >
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 320px)"
        @selection-change="handleSelectionChange"
        align="left"
      >
        <el-table-column type="selection" width="34"></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          :key="1"
          align="center"
        ></el-table-column>

        <el-table-column
          label="停车场名称"
          align="center"
          :key="2"
          show-overflow-tooltip
          v-if="pageType == 2"
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车牌号"
          :key="3"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicle }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车牌颜色"
          :key="4"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.color }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车辆类型"
          :key="5"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="入场时间"
          align="center"
          :key="6"
          show-overflow-tooltip
          v-if="pageType == 2"
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.admissionTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="出场时间"
          align="center"
          :key="7"
          show-overflow-tooltip
          v-if="pageType == 2"
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.exitTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="欠费金额(元)"
          align="center"
          :key="8"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.arrears }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="欠费次数"
          align="center"
          :key="9"
          min-width="140px"
          show-overflow-tooltip
          v-if="pageType == 1"
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.arrearsNumber }}</span></template
          >
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          :key="10"
          show-overflow-tooltip
          v-if="pageType == 2"
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.payment == 1 ? "已补缴" : "待补缴"
            }}</span></template
          >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          :key="11"
          show-overflow-tooltip
          v-if="pageType == 1"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              @click="toDetial(scope.row)"
            >
              查看明细
            </span>
            <!-- v-has="{ red: 'editBox', type: 1 }" -->
          </template>
          >
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="listQuery.pageNum"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="listQuery.pageSize"
        :total="listQuery.total"
        style="float: right;;margin: 10px"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <Dialog ref="dialog" @getList="getList" @openLoading="openLoading"></Dialog>
  </div>
</template>

<script>
import {
  arrearsRecordPageList, //欠费记录分页
  arrearsRecordExport, // 欠费记录导出
  arrearsRecordPageListByTime, //欠费记录分页按时间
  arrearsRecordExportByTime // 欠费记录导出按时间
} from "@/api/reconciliationCenter";
import { fieldTable } from "@/api/common";
import Dialog from "./components/dialog";

export default {
  name: "outstandingFeesRecord",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkName: "", //停车场
        vehicle: "", //车牌号
        startArrears: null, //欠费金额开始
        endArrears: null, //欠费金额结束
        startNumber: null, //欠费次数开始
        endNumber: null, //欠费次数结束
        startTime: null, //开始时间
        endTime: null, //结束时间
        payment: null //状态
      },
      pageType: 1, //1.按车牌统计 2.按时间统计
      statusList: [
        { enumName: "已补缴", enumValue: 1 },
        { enumName: "待补缴", enumValue: 0 }
      ],

      totalMoney: null, //收款统计
      selGateway: null,
      time: [],
      Dictionaries: {
        enumTypes: "STATUS"
      },
      enumsData: {}, //字典表返回数据
      listLoading: false, //加载
      list: [] //信息
    };
  },
  watch: {
    time(value) {
      if (value === null) {
        this.time = ["", ""];
      }
      this.changeTime();
    }
  },

  created() {
    this.toSearchList();
    // this.getFieldTable();
  },
  methods: {
    changeTime() {
      console.log(111, this.time);
      this.listQuery.startTime = this.time[0];
      this.listQuery.endTime = this.time[1];
    },
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
      });
    },
    //打开用户详情
    toDetial(e) {
      let vehicle = e.vehicle;
      this.$refs.dialog.showDialog(vehicle);
    },
    //切换页面
    chengePageType() {
      this.resetList();
    },
    //查询列表
    toSearchList() {
      this.listQuery.pageNum = 1;
      this.openLoading();
      if (this.pageType == 1) {
        this.getList();
      } else {
        this.getListByTime();
      }
    },
    //重置查询条件
    resetList() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkName: "", //停车场
        vehicle: "", //车牌号
        startArrears: null, //欠费金额开始
        endArrears: null, //欠费金额结束
        startNumber: null, //欠费次数开始
        endNumber: null, //欠费次数结束
        startTime: null, //开始时间
        endTime: null //结束时间
      };
      this.time = [];
      this.openLoading();
      if (this.pageType == 1) {
        this.getList();
      } else {
        this.getListByTime();
      }
    },
    openLoading() {
      let claeeName;
      if (this.$store.getters.sidebar.opened) {
        claeeName = "hasSidebar";
      } else {
        claeeName = "noSidebar";
      }
      this.listLoading = this.$loading({
        lock: true,
        text: "数据加载中...",
        customClass: claeeName, // *这里设置他的class名称,这里最重要
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },

    //获取数据列表
    getList() {
      let para = this.listQuery;
      arrearsRecordPageList(para)
        .then(response => {
          this.list = response.data.list;
          this.totalMoney = response.data.totalMoney;
          if (response.data.total > 0) {
            this.listQuery.total = response.data.total; // 数据总条数
          } else {
            this.listQuery.pageSize = 40; //每页数量
            this.listQuery.total = 0; // 数据总条数
            this.listQuery.pageNum = 1; // 当前页
          }
          this.total = response.data.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        })
        .catch(() => {
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        });
    },
    //获取数据列表按时间
    getListByTime() {
      let para = this.listQuery;
      arrearsRecordPageListByTime(para)
        .then(response => {
          this.list = response.data.list;
          this.totalMoney = response.data.totalMoney;
          if (response.data.total > 0) {
            this.listQuery.total = response.data.total; // 数据总条数
          } else {
            this.listQuery.pageSize = 40; //每页数量
            this.listQuery.total = 0; // 数据总条数
            this.listQuery.pageNum = 1; // 当前页
          }
          this.total = response.data.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        })
        .catch(() => {
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        });
    },

    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },
    //导出
    toExport() {
      if (this.pageType == 1) {
        let para = {
          vehicle: this.listQuery.vehicle,
          startArrears: this.listQuery.startArrears,
          endArrears: this.listQuery.endArrears,
          startNumber: this.listQuery.startNumber,
          endNumber: this.listQuery.endNumber
        };
        arrearsRecordExport(para).then(res => {
          var content = res.data;
          var elink = document.createElement("a");
          elink.download = "欠费记录" + new Date().getTime() + ".xls";
          elink.style.display = "none";

          var blob = new Blob([content]);
          elink.href = URL.createObjectURL(blob);

          document.body.appendChild(elink);
          elink.click();

          document.body.removeChild(elink);
        });
      } else {
        this.toExportByTime();
      }
    },
    //导出
    toExportByTime() {
      let para = {
        parkName: this.listQuery.parkName,
        vehicle: this.listQuery.vehicle,
        startArrears: this.listQuery.startArrears,
        endArrears: this.listQuery.endArrears,
        startTime: this.listQuery.startTime,
        endTime: this.listQuery.endTime,
        payment: this.listQuery.payment
      };
      arrearsRecordExportByTime(para).then(res => {
        var content = res.data;
        var elink = document.createElement("a");
        elink.download = "欠费记录" + new Date().getTime() + ".xls";
        elink.style.display = "none";

        var blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);

        document.body.appendChild(elink);
        elink.click();

        document.body.removeChild(elink);
      });
    },
    // 切换页码方法
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.openLoading();
      this.getList();
    },
    // 切换每页显示的方法
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.openLoading();
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.commit_page {
  position: relative;
}
.content_box {
  .content_row {
    position: relative;
    height: 32px;
    line-height: 32px;
    .content_boxId {
      color: #8c8787;
      font-size: 14px;
      font-weight: bold;
    }
    .content_num {
      color: #8c8787;
      font-size: 12px;
      font-weight: bold;
    }
    .content_title {
      color: rgba($color: #828484, $alpha: 0.5);
      font-size: 14px;
      padding-right: 5px;
    }
  }
}
</style>
