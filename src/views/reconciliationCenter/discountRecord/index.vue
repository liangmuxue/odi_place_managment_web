<template>
  <div class="commit_page">
    <div class="totalMoney_box">优惠统计：{{ totalMoney }}元</div>
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">订单号</div>
        <el-input v-model="listQuery.orderNum" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">订单类型</div>
        <el-select
          v-model="listQuery.orderType"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in orderTypeList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title">车牌号</div>
        <el-input v-model="listQuery.vehicle" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">用户手机</div>
        <el-input v-model="listQuery.phone" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content2">
        <div class="search_content_title">优惠时间</div>
        <el-date-picker
          style="width: 72%"
          v-model="time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="请选择时间"
          end-placeholder
        ></el-date-picker>
        <!-- :default-time="['00:00:00', '23:59:59']" -->
      </span>
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入"> </el-input>
      </span>

      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>
    <div class="btn_box">
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
          align="center"
        ></el-table-column>
        <el-table-column
          label="订单号"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.orderType == 1 ? "临停" : "长租"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicle }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="停车场名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.park }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="优惠活动名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.discountName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="优惠券类型"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.discountType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="优惠金额(元)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.discountMoney }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="优惠时间"
          align="center"
          min-width="140px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.payTime }}</span></template
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
  </div>
</template>

<script>
import {
  discountRecordList, //优惠记录分页
  discountRecordExport // 优惠记录导出
} from "@/api/reconciliationCenter";
import { fieldTable } from "@/api/common";

export default {
  name: "discountRecord",
  components: {},
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        orderNum: "", //订单号
        refundNum: "", //退款编号
        vehicle: "", //车牌号
        phone: "", //车主手机
        startTime: "", //开始时间
        endTime: "", //结束时间
        parkName: "" //停车场
      },
      totalMoney: null, //收款统计
      selGateway: null,
      time: [],
      Dictionaries: {
        enumTypes: "ORDERTYPE"
      },
      orderTypeList: [
        { enumName: "临停", enumValue: 1 },
        { enumName: "长租", enumValue: 2 }
      ],

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
        orderNum: "", //订单号
        refundNum: "", //退款编号
        vehicle: "", //车牌号
        phone: "", //车主手机
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
      discountRecordList(para)
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
      let para = {
        name: this.listQuery.name,
        parkName: this.listQuery.parkName,
        startTime: this.listQuery.startTime,
        endTime: this.listQuery.endTime,
        type: this.listQuery.type
      };
      discountRecordExport(para).then(res => {
        var content = res.data;
        var elink = document.createElement("a");
        elink.download = "优惠记录" + new Date().getTime() + ".xls";
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
