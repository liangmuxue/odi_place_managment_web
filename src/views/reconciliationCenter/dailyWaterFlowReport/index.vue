<template>
  <div class="commit_page">
    <div class="search_box">
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
      <!-- <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 370px)"
        :span-method="spanMethod"
        align="left"
      >
        <el-table-column
          label="日期"
          type="index"
          fixed
          min-width="60px"
          align="center"
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.date }}</span></template
          ></el-table-column
        >
        <el-table-column label="平台" align="center">
          <el-table-column label="充值" align="center">
            <el-table-column label="充值" align="center"> </el-table-column>
            <el-table-column label="提现" align="center"> </el-table-column>
            <el-table-column label="实收" align="center"> </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in list"
          :key="index"
          :label="item.parkName"
          :prop="item.parkName + 'cz'"
          width="200"
          align="center"
        >
          <el-table-column label="临停" align="center">
            <el-table-column label="收款" align="center"
              ><template slot-scope="scope">
                <span class="content">{{
                  scope.row.temporaryStopAmount
                }}</span></template
              >
            </el-table-column>
            <el-table-column label="退款" align="center"> </el-table-column>
            <el-table-column label="实收" align="center"> </el-table-column>
          </el-table-column>
          <el-table-column label="长租" align="center">
            <el-table-column label="收款" align="center"> </el-table-column>
            <el-table-column label="退款" align="center"> </el-table-column>
            <el-table-column label="实收" align="center"> </el-table-column>
          </el-table-column>
          <el-table-column label="小计" align="center">
            <el-table-column label="收款" align="center"> </el-table-column>
            <el-table-column label="退款" align="center"> </el-table-column>
            <el-table-column label="实收" align="center"> </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table> -->
      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 300px)"
        align="left"
      >
        <!-- :span-method="spanMethod" -->
        <el-table-column label="" align="center">
          <el-table-column label="" align="center" width="30">
            <template slot-scope="scope">
              <div>{{ scope.row.parkName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="" align="center">
            <template slot-scope="scope">
              <div>临停</div>
              <div>长租</div>
            </template>
          </el-table-column>
          <el-table-column label="" align="center">
            <template slot-scope="scope">
              <div>收款</div>
              <div>退款</div>
              <div>实收</div>
              <div>收款</div>
              <div>退款</div>
              <div>实收</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in list"
          :key="index"
          :label="item.date"
          :prop="item.date + 'cz'"
          width="200"
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  collectionStatisticsPageList, //收款统计分页
  collectionStatisticsExport // 收款统计导出
} from "@/api/reconciliationCenter";
const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 如果当前列不是组织机构列，则返回 { rowspan: 1, colspan: 1 }，表示该单元格不需要合并
  // if (columnIndex !== 0 && columnIndex !== 1&& columnIndex !== 2  &&columnIndex!==9&&columnIndex!==10) {
  //   return { rowspan: 1, colspan: 1 };
  // }
  if (columnIndex !== 0 && columnIndex !== 1) {
    return { rowspan: 1, colspan: 1 };
  }

  // 如果当前行是该组织机构的第一行，则计算该组织机构的行数，并返回 { rowspan, colspan: 1 }，表示需要合并的行数为 rowspan
  if (
    rowIndex === 0 ||
    row.casename !== this.list.value[rowIndex - 1].casename
  ) {
    const rowCount = this.list.value.filter(i => i.casename === row.casename)
      .length;
    return { rowspan: rowCount, colspan: 1 };
  }
  // 否则返回 { rowspan: 0, colspan: 0 }，表示该单元格已被上方单元格合并
  return { rowspan: 0, colspan: 0 };
};
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
      tableList: [{ id: 1 }],
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
