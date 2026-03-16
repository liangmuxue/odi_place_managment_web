<template>
  <div class="commit_page">
    <div class="totalMoney_box">
      商户退费统计：{{ totalMoney | getMoney }}元
    </div>
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">商户名称</div>
        <el-input v-model="listQuery.merchantName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title2">抵扣券名称</div>
        <el-input v-model="listQuery.deductionName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">退款类型</div>
        <el-select
          v-model="listQuery.refundType"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in refundTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
      <span class="search_content2">
        <div class="search_content_title">退款时间</div>
        <el-date-picker
          style="width: 72%"
          v-model="time"
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
        v-has="{ red: 'merchantRefundRecordExport', type: 1 }"
        >导出</el-button
      >
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 340px)"
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
        <el-table-column
          label="退款数量(次)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.quantity) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="售价(元)" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.refundType === '预充' ? '--' : (scope.row.price | getMoney) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="退款金额(元)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.amountDue | getMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="实退金额(元)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.amountActuality | getMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.refundType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="退款时间"
          min-width="130px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.operateTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ formatEmptyValue(scope.row.operator) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          min-width="100px"
          header-align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              @click="toDetails(scope.row)"
              v-has="{ red: 'merchantRefundRecordDetails', type: 1 }"
            >
              详情
            </span>
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
    <Dialog ref="dialog"></Dialog>
  </div>
</template>

<script>
import {
  merchantRefundRecordList,
  merchantRefundRecordExport
} from "@/api/merchantManagement";
import Dialog from "./components/dialog";
import { formatEmptyValue } from "../util/amountUtil";

export default {
  name: "merchantRefundRecord",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        merchantName: "",
        deductionName: "",
        refundType: null,
        beginTime: "",
        endTime: ""
      },
      // 退款类型与后端 deduction_mode 一致：次数 / 预充
      refundTypeList: [
        { label: "次数", value: "次数" },
        { label: "预充", value: "预充" }
      ],
      totalMoney: 0,
      time: [],
      // Loading 实例
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
        const pad = n => (n < 10 ? "0" + n : n);
        const format = d => {
          const y = d.getFullYear();
          const m = pad(d.getMonth() + 1);
          const day = pad(d.getDate());
          const h = pad(d.getHours());
          const mi = pad(d.getMinutes());
          const s = pad(d.getSeconds());
          return `${y}-${m}-${day} ${h}:${mi}:${s}`;
        };
        this.listQuery.beginTime = format(this.time[0]);
        this.listQuery.endTime = format(this.time[1]);
      } else {
        this.listQuery.beginTime = "";
        this.listQuery.endTime = "";
      }
    },

    // 查询列表
    toSearchList() {
      this.listQuery.pageNum = 1;
      this.openLoading();
      this.getList();
    },
    // 重置查询条件
    resetList() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        merchantName: "",
        deductionName: "",
        refundType: null,
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
      // 若已有 loading，先关闭
      if (this.listLoading && this.listLoading.close) {
        this.listLoading.close();
      }
      this.listLoading = this.$loading({
        lock: true,
        text: "数据加载中...",
        customClass: claeeName,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },

    // 获取数据列表
    getList() {
      const para = { ...this.listQuery };
      merchantRefundRecordList(para)
        .then(response => {
          this.list = response.rows || [];
          if (response.total > 0) {
            this.listQuery.total = response.total; // 数据总条数
          } else {
            this.listQuery.total = 0;
            this.listQuery.pageNum = 1;
          }
          // 实退金额统计
          this.totalMoney = (this.list || []).reduce((sum, item) => {
            const val = item.amountActuality || 0;
            return sum + Number(val);
          }, 0);
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

    // 打开详情
    toDetails(row) {
      if (this.$refs.dialog && this.$refs.dialog.showDialog) {
        this.$refs.dialog.showDialog(row.merchantRefundId);
      }
    },

    // 导出
    toExport() {
      const para = {
        merchantName: this.listQuery.merchantName,
        deductionName: this.listQuery.deductionName,
        refundType: this.listQuery.refundType,
        beginTime: this.listQuery.beginTime,
        endTime: this.listQuery.endTime
      };
      merchantRefundRecordExport(para).then(res => {
        const content = res.data;
        const blob = new Blob([content]);
        const elink = document.createElement("a");
        elink.download = "商户退费记录" + new Date().getTime() + ".xls";
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      });
    },

    // 切换每页条数
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.openLoading();
      this.getList();
    },
    // 切换页码
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.openLoading();
      this.getList();
    },

    // 选择复选框（目前未使用，但保留以兼容样式）
    handleSelectionChange(val) {
      this.selGateway = val;
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
</style>
