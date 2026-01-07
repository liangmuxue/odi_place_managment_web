<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">订单号</div>
        <el-input v-model="listQuery.orderNum" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title2">车牌号</div>
        <el-input v-model="listQuery.vehicleNumber" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content search_content_wide">
        <div class="search_content_title2">商户名称</div>
        <el-input v-model="listQuery.merchantName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content search_content_wide">
        <div class="search_content_title2">抵扣券名称</div>
        <el-input v-model="listQuery.deductionName" placeholder="请输入">
        </el-input>
      </span>
    </div>
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">抵扣类型</div>
        <el-select
          v-model="listQuery.deductionType"
          placeholder="选择抵扣类型"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in deductionTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
      <span class="search_content2">
        <div class="search_content_title">抵扣时间</div>
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
        v-has="{ red: 'merchantDeductionRecordExport', type: 1 }"
        >导出</el-button
      >
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 360px)"
        align="left"
      >
        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column label="订单号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.orderNum) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.orderType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.phone) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.vehicleNumber) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="停车场名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.parkName) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.merchantName) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="抵扣券名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.deductionName) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="抵扣类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.deductionType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="抵扣数量(单位)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.deductionQuantity) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="抵扣金额(元)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.deductionMoney | getMoney }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="抵扣时间"
          min-width="130px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.deductionTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
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
  merchantDeductionRecordList,
  merchantDeductionRecordExport
} from "@/api/merchantManagement";
import { formatEmptyValue } from "../util/amountUtil";

export default {
  name: "merchantDeductionRecord",
  components: {},
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        orderNum: "",
        vehicleNumber: "",
        parkName: "",
        merchantName: "",
        deductionName: "",
        deductionType: "",
        beginTime: "",
        endTime: ""
      },
      deductionTypeOptions: [
        { label: "固定时长", value: "固定时长" },
        { label: "固定金额", value: "固定金额" },
        { label: "固定折扣", value: "固定折扣" },
        { label: "全免抵扣", value: "全免抵扣" }
      ],
      time: [],
      listLoading: null,
      list: []
    };
  },
  watch: {
    time(value) {
      if (!value || value.length === 0) {
        this.listQuery.beginTime = "";
        this.listQuery.endTime = "";
        return;
      }
      this.changeTime();
    }
  },

  created() {
    this.toSearchList();
  },
  methods: {
    formatEmptyValue,
    changeTime() {
      if (this.time[0] && this.time[1]) {
        this.listQuery.beginTime = this.time[0];
        this.listQuery.endTime = this.time[1];
      } else {
        this.listQuery.beginTime = "";
        this.listQuery.endTime = "";
      }
    },

    //查询泊位列表
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
        orderNum: "",
        vehicleNumber: "",
        parkName: "",
        merchantName: "",
        deductionName: "",
        deductionType: "",
        beginTime: "",
        endTime: ""
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
      if (this.listLoading && this.listLoading.close) {
        this.listLoading.close();
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
      const para = { ...this.listQuery };
      merchantDeductionRecordList(para)
        .then(response => {
          this.list = response.rows || [];
          if (response.total > 0) {
            this.listQuery.total = response.total;
          } else {
            this.listQuery.total = 0;
            this.listQuery.pageNum = 1;
          }
        })
        .finally(() => {
          setTimeout(() => {
            if (this.listLoading && this.listLoading.close) {
              this.listLoading.close();
            }
            this.listLoading = null;
          }, 300);
        });
    },

    //导出
    toExport() {
      const para = {
        orderNum: this.listQuery.orderNum,
        vehicleNumber: this.listQuery.vehicleNumber,
        parkName: this.listQuery.parkName,
        merchantName: this.listQuery.merchantName,
        deductionName: this.listQuery.deductionName,
        deductionType: this.listQuery.deductionType,
        beginTime: this.listQuery.beginTime,
        endTime: this.listQuery.endTime
      };
      merchantDeductionRecordExport(para).then(res => {
        const content = res.data;
        const elink = document.createElement("a");
        elink.download = "抵扣记录" + new Date().getTime() + ".xls";
        elink.style.display = "none";

        const blob = new Blob([content]);
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

.operation_button {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  width: 45px;
  margin: 0 2px;
  cursor: pointer;
  text-align: center;
  i {
    margin-right: 2px;
  }
  .circle {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 9px;
    border: 1px solid #6ca6e8;
    font-size: 12px;
  }
}

.search_content_wide {
  max-width: 360px;

  ::v-deep(.el-input) {
    flex: 1;
    width: 100%;
  }
}
</style>
