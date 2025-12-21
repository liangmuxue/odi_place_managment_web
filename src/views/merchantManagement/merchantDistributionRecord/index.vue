<template>
  <div class="commit_page">
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
        <div class="search_content_title">发放方式</div>
        <el-select
          v-model="listQuery.distrbuteMode"
          placeholder="请选择选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in distrbuteModeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title2">车牌号</div>
        <el-input v-model="listQuery.vehicleNumber" placeholder="请输入">
        </el-input>
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
        v-has="{ red: 'merchantDistributionRecordExport', type: 1 }"
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
        align="left"
      >
        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column label="商户名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.merchantName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="抵扣券名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.deductionName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发放方式" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.distrbuteMode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发放数量(张)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发放时间"
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
        <el-table-column
          label="重复使用开始时间"
          min-width="130px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.validTimeStart | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="重复使用结束时间"
          min-width="130px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.validTimeEnd | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.memo }}</span>
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
  merchantDeductionDistributionList,
  merchantDeductionDistributionExport
} from "@/api/merchantManagement";

export default {
  name: "merchantDistributionRecord",
  components: {},
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        merchantName: "",
        deductionName: "",
        distrbuteMode: "",
        vehicleNumber: ""
      },
      distrbuteModeList: [
        { label: "人工", value: "人工" },
        { label: "二维码", value: "二维码" }
      ],
      listLoading: null,
      list: []
    };
  },
  created() {
    this.toSearchList();
  },
  methods: {
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
        merchantName: "",
        deductionName: "",
        distrbuteMode: "",
        vehicleNumber: ""
      };
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
      merchantDeductionDistributionList(para)
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

    // 导出
    toExport() {
      const para = {
        merchantName: this.listQuery.merchantName,
        deductionName: this.listQuery.deductionName,
        distrbuteMode: this.listQuery.distrbuteMode,
        vehicleNumber: this.listQuery.vehicleNumber
      };
      merchantDeductionDistributionExport(para).then(res => {
        const content = res.data;
        const blob = new Blob([content]);
        const elink = document.createElement("a");
        elink.download = "抵扣券发放明细" + new Date().getTime() + ".xls";
        elink.style.display = "none";
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
</style>
