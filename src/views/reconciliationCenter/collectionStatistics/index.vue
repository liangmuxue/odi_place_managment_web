<template>
  <div class="commit_page">
    <div class="totalMoney_box">
      <span>实收总额统计：{{ totalMoneyList.totalAmount | getMoney }}元 </span>
      <span class="totalMoney_box_small">（实收总额=长租实收+临停实收） </span>
      <span
        >长租实收统计：{{ totalMoneyList.termRentalAmount | getMoney }}元</span
      >
      <span class="totalMoney_box_small"></span>
      <span
        >临停实收统计：{{
          totalMoneyList.temporaryStopAmount | getMoney
        }}元</span
      ><span class="totalMoney_box_small">（临停实收=临停收款-临停退款）</span>
      <!-- <span class="totalMoney_box_small"
        >(长租实收：{{ totalMoneyList.termRentalAmount }}元、临停实收：{{
          totalMoneyList.temporaryStopAmount
        }}元)
      </span> -->
      <!-- <span class="totalMoney_box_small"
        >(长租分成：{{ totalMoneyList.termRentalSharing }}元、临停分成：{{
          totalMoneyList.temporaryStopSharing
        }}元)
      </span> -->
      <!-- <span class="totalMoney_box_small"
        >(长租分成：{{ totalMoneyList.termRentalSharingTwo }}元、临停分成：{{
          totalMoneyList.temporaryStopSharingTwo
        }}元)
      </span> -->
    </div>
    <div class="totalMoney_box">
      <!-- <div class="totalMoney_com_box">
        <div class="totalMoney_com_box_text">建设发展（元）</div>
        <div class="totalMoney_com_box_text">
          {{ (totalMoneyList.totalShare * 100000) | getMoney }}
        </div>
      </div> -->
      <span
        >建设发展分成统计：{{ totalMoneyList.totalShare | getMoney }}元</span
      >
      <!-- <span class="totalMoney_box_small"
        >(长租分成：{{ totalMoneyList.termRentalSharing }}元、临停分成：{{
          totalMoneyList.temporaryStopSharing
        }}元)
      </span> -->
      <span class="totalMoney_box_small"></span>
      <span
        >海创物业分成统计：{{ totalMoneyList.totalShareTwo | getMoney }}元</span
      >
      <!-- <span class="totalMoney_box_small"
        >(长租分成：{{ totalMoneyList.termRentalSharingTwo }}元、临停分成：{{
          totalMoneyList.temporaryStopSharingTwo
        }}元)
      </span> -->
    </div>
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content2">
        <div class="search_content_title">日期</div>
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
        <!-- :default-time="['00:00:00', '23:59:59']" -->
      </span>

      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>
    <div class="btn_box">
      <el-button
        type="info"
        icon="el-icon-upload2"
        @click="toExport"
        v-has="{ red: 'collectionStatisticsExport', type: 1 }"
        >导出</el-button
      >
      <span class="btn_box_text">* 临停退款以退款操作时间计入报表 </span>
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 370px)"
        @selection-change="handleSelectionChange"
        align="left"
      >
        <el-table-column type="selection" width="34"></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          fixed
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="停车场名称"
          align="center"
          fixed
          min-width="170px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          align="center"
          fixed
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.date }}</span></template
          >
        </el-table-column>
        <el-table-column
          label="实收总额（元）"
          align="center"
          fixed
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.totalAmount | getMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="长租实收（元）"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.termRentalAmount | getMoney
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="长租分成（元）建设发展公司"
          min-width="120px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.termRentalSharing }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="长租分成（元）海创物业公司"
          min-width="120px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.termRentalSharingTwo }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="临停实收（元）"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopAmountReal | getMoney
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="临停收款（元）"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopAmount | getMoney
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="临停退款（元）"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopRefund | getMoney
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="海创物业分成（元）"
          min-width="170px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopSharingTwo | getMoney
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="建设发展分成（元）"
          min-width="170px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopSharing | getMoney
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="联通分成（元）"
          min-width="170px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopSharing | getMoney
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="豪之英分成（元）"
          min-width="170px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopSharingTwo | getMoney
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="锦辉分成（元）"
          min-width="170px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopSharing | getMoney
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="科创交流中心分成（元）"
          min-width="170px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopSharingTwo | getMoney
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商业广场分成（元）"
          min-width="170px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.temporaryStopSharingTwo | getMoney
            }}</span>
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          label="临停分成（元）建设发展公司"
          min-width="120px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.temporaryStopSharing }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="临停分成（元）海创物业公司"
          min-width="120px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.temporaryStopSharingTwo }}</span>
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          label="欠款总额（元）"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.arrearsAmount }}</span>
          </template>
        </el-table-column> -->
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
  </div>
</template>

<script>
import {
  collectionStatisticsPageList, //收款统计分页
  collectionStatisticsExport // 收款统计导出
} from "@/api/reconciliationCenter";

export default {
  name: "collectionStatistics",
  components: {},
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        startTime: "", //开始时间
        endTime: "", //结束时间
        parkName: "" //停车场
      },
      totalMoneyList: {
        totalAmount: 0,
        termRentalAmount: 0,
        temporaryStopAmount: 0,
        totalShare: 0,
        totalShareTwo: 0
      }, //收款金额数据
      selGateway: null,
      time: [],
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
      this.listQuery.startTime = this.time[0];
      this.listQuery.endTime = this.time[1];
    },

    //查询列表
    toSearchList() {
      this.listQuery.pageNum = 1;
      this.openLoading();
      this.getList();
    },
    //重置查询条件
    resetList() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        startTime: "", //开始时间
        endTime: "", //结束时间
        parkName: "" //停车场
      };

      this.time = [];
      this.openLoading();
      this.getList();
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
      collectionStatisticsPageList(para)
        .then(response => {
          this.list = response.data.list;
          this.totalMoneyList = response.data;
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
      let para = {
        parkName: this.listQuery.parkName,
        startTime: this.listQuery.startTime,
        endTime: this.listQuery.endTime
      };
      collectionStatisticsExport(para).then(res => {
        var content = res.data;
        var elink = document.createElement("a");
        elink.download = "收款统计" + new Date().getTime() + ".xls";
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
.btn_box_text {
  padding: 15px;
  font-size: 12px;
  color: #aaa;
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
