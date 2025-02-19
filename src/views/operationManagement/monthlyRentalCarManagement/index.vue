<template>
  <div class="parkingManagement_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.park" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">车牌号</div>
        <el-input v-model="listQuery.vehicle" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">车主姓名</div>
        <el-input v-model="listQuery.name" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">状态</div>
        <el-select
          v-model="listQuery.status"
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

      <span class="search_content2">
        <div class="search_content_title">长租时间</div>
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
      <el-dropdown @command="toStartStop">
        <el-button type="primary">
          批量启停<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="1"> 批量启用</el-dropdown-item>
          <el-dropdown-item :command="0">批量禁用</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- v-has="{ red: 'deleteBox', type: 1 }" -->
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
        <el-table-column
          type="selection"
          width="34"
          :selectable="selectable"
        ></el-table-column>

        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车主手机" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车主姓名" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车主身份证"
          align="center"
          min-width="110px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.idcard }}</span>
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
          label="长租时间"
          align="center"
          min-width="220px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content"
              >{{ scope.row.beginTime }} - {{ scope.row.dueTime }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          align="center"
          min-width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">
              <span class="errLine_ball" v-show="scope.row.status == 0"></span>
              <span v-show="scope.row.status == 0" class="errLine">
                已禁用</span
              >
              <span class="offLine_ball" v-show="scope.row.status == -1"></span>
              <span v-show="scope.row.status == -1" class="offLine">
                已过期</span
              >
              <span class="onLine_ball" v-show="scope.row.status == 1"></span>
              <span v-show="scope.row.status == 1" class="onLine"> 使用中</span>
              <span class="offLine_ball" v-show="scope.row.status == 2"></span>
              <span v-show="scope.row.status == 2" class="offLine">
                未开始</span
              >
              <span class="offLine_ball" v-show="scope.row.status == 3"></span>
              <span v-show="scope.row.status == 3" class="offLine">
                未开始</span
              >
              <span v-show="scope.row.status == 3" class="errLine">
                (已禁用)</span
              >
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="支付时间"
          align="center"
          min-width="110px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.payTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          min-width="90px"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              @click="toDetial(scope.row)"
            >
              详情
            </span>
            <span
              class="operation_button update_btn"
              @click="toStartStop2(scope.row.id, 1)"
              v-if="scope.row.status == 0"
            >
              启用
            </span>
            <span
              class="operation_button update_btn"
              @click="toStartStop2(scope.row.id, 0)"
              v-if="scope.row.status > 0"
            >
              禁用
            </span>
            <!-- v-has="{ red: 'editBox', type: 1 }" -->
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
    <Dialog ref="dialog" @getList="getList" @openLoading="openLoading"></Dialog>
  </div>
</template>

<script>
import {
  vehiclesList, //月租车辆列表
  vehiclesUpdate //月租车辆启停/批量启停
} from "@/api/operationManagement";
import Dialog from "./components/dialog";

export default {
  name: "MonthlyRentalCarManagement",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        park: "", //停车场
        vehicle: "", //车牌号
        name: "", //车主姓名
        status: null, //状态 1使用中 0禁用 -1过期  2未开始 3未开始封禁
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      ids: null,
      statusList: [
        { enumName: "使用中", enumValue: 1 },
        { enumName: "已禁用", enumValue: 0 },
        { enumName: "已过期", enumValue: -1 },
        { enumName: "未开始", enumValue: 2 },
        { enumName: "未开始(已禁用)", enumValue: 3 }
      ],
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
    //判断是否可选
    selectable(e) {
      if (e.status >= 0) {
        return true;
      } else {
        return false;
      }
    },

    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },

    //获取状态名称
    getStatusName(e) {
      let name;
      if (e == 0) {
        name = "已禁用";
      } else if (e == 1) {
        name = "使用中";
      } else if (e == -1) {
        name = "已过期";
      } else if (e == 2) {
        name = "未开始";
      } else if (e == 3) {
        name = "未开始(已禁用)";
      }
      return name;
    },
    changeTime() {
      this.listQuery.startTime = this.time[0];
      this.listQuery.endTime = this.time[1];
    },

    //查询用户列表
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
        park: "", //停车场
        vehicle: "", //车牌号
        name: "", //车主姓名
        status: null, //状态 1使用中 0禁用 -1过期  2未开始 3未开始封禁
        startTime: "", //开始时间
        endTime: "" //结束时间
      };
      this.time = [];
      this.openLoading();
      this.getList();
    },
    //显示溢出隐藏
    showTips(obj, row) {
      /*obj为鼠标移入时的事件对象*/
      /*currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除*/
      let TemporaryTag = document.createElement("span");
      TemporaryTag.innerText = row.note;
      TemporaryTag.className = "getTextWidth";
      document.querySelector("body").appendChild(TemporaryTag);
      let currentWidth = document.querySelector(".getTextWidth").offsetWidth;
      document.querySelector(".getTextWidth").remove();

      /*cellWidth为表格容器的宽度*/
      const cellWidth = obj.target.offsetWidth;

      /*当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行*/
      currentWidth <= 2 * cellWidth
        ? (row.showTooltip = false)
        : (row.showTooltip = true);
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

    //获取列表
    getList() {
      let para = this.listQuery;
      vehiclesList(para)
        .then(response => {
          this.list = response.rows;
          if (response.total > 0) {
            this.listQuery.total = response.total; // 数据总条数
          } else {
            this.listQuery.pageSize = 40; //每页数量
            this.listQuery.total = 0; // 数据总条数
            this.listQuery.pageNum = 1; // 当前页
          }
          this.total = response.total;

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
    //批量启停
    toStartStop(e) {
      let name;
      if (e == 1) {
        name = "启用";
      } else {
        name = "禁用";
      }
      let arr = [];
      this.selGateway.forEach(el => {
        arr.push(el.id);
      });
      if (this.selGateway.length > 0) {
        this.$confirm("请选择以上批量" + name, "提示", {
          type: "warning",
          center: true
        })
          .then(() => {
            let para = {
              ids: arr,
              status: e
            };
            vehiclesUpdate(para).then(response => {
              if (response.code == "200") {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
                this.openLoading();
                this.getList();
              } else {
                this.$message({
                  type: "warning",
                  message: "操作失败"
                });
              }
            });
          })
          .catch(() => {});
      } else {
        this.$message({
          type: "warning",
          message: "请选择操作数据"
        });
      }
    },
    //打开用户详情
    toDetial(e) {
      let id = e.id;
      this.$refs.dialog.showDialog(id, 1);
    },
    //
    toStartStop2(id, e) {
      let arr = [];
      arr.push(id);
      let para = {
        ids: arr,
        status: e
      };
      vehiclesUpdate(para).then(response => {
        if (response.code == "200") {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.openLoading();
          this.getList();
        } else {
          this.$message({
            type: "warning",
            message: "操作失败"
          });
        }
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
.parkingManagement_page {
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
