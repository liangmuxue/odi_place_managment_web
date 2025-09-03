<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">车牌号码</div>
        <el-input v-model="listQuery.vehicle" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">开闸员</div>
        <el-input v-model="listQuery.gateOperator" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content2">
        <div class="search_content_title">开闸时间</div>
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
        v-has="{ red: 'manualSwitchRecordExport', type: 1 }"
        @click="toExport"
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
          label="停车场名称"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进出类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.gateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开闸来源" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.openType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="抓拍图片" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="content" :key="scope.row.id">
              <el-popover placement="top-start" width="500" trigger="click">
                <img
                  :src="
                    scope.row.capturePhotos
                      ? scope.row.capturePhotos
                      : scope.row.capturePhotos
                  "
                  width="100%"
                />
                <img
                  v-if="
                    scope.row.capturePhotos !== '' &&
                      scope.row.capturePhotos !== null
                  "
                  slot="reference"
                  :src="scope.row.capturePhotos"
                  width="48"
                  height="36"
                />
                <!-- :src="
                    scope.row.capturePhotos +
                      '?x-oss-process=image/resize,h_36,w_48'
                  " -->
                <span v-else>
                  <div min-width="48" height="36"></div>
                </span>
              </el-popover>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="开闸员" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.gateOperator }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="开闸时间"
          align="center"
          min-width="140px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.openTime }}</span></template
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
  manualSwitchRecordList, //手动开闸分页
  manualSwitchRecordExport // 手动开闸导出
} from "@/api/operationManagement";

export default {
  name: "manualSwitchRecord",
  components: {},
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkName: "", //停车场
        vehicle: "", //车牌号
        gateOperator: "", //开闸员
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      totalMoneyList: null, //收款金额数据
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
        parkName: "", //停车场
        vehicle: "", //车牌号
        gateOperator: "", //开闸员
        startTime: "", //开始时间
        endTime: "" //结束时间
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
      manualSwitchRecordList(para)
        .then(response => {
          this.list = response.rows;
          if (response.total > 0) {
            this.listQuery.total = response.total; // 数据总条数
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
      manualSwitchRecordExport(para).then(res => {
        var content = res.data;
        var elink = document.createElement("a");
        elink.download = "手动开关闸记录" + new Date().getTime() + ".xls";
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
