<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">车牌号</div>
        <el-input v-model="listQuery.licensePlate" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title2">黑名单范围</div>
        <el-select
          v-model="listQuery.parkingLotId"
          placeholder="选择黑名单范围"
          clearable
          @change="parkingLotIdChange"
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in parkingList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title">车主姓名</div>
        <el-input v-model="listQuery.masterName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content2">
        <div class="search_content_title">创建时间</div>
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
        icon="el-icon-circle-plus-outline"
        @click="toAdd"
        v-has="{ red: 'blackListAdd', type: 1 }"
        >新增</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        @click="toDel"
        v-has="{ red: 'blackListDelete', type: 1 }"
        >删除</el-button
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
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.licensePlate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌颜色" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.plateColorName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车主手机" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车主姓名" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.masterName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="黑名单范围"
          min-width="130px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ getNames(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.createrName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          min-width="130px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.createTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="黑名单备注"
          min-width="130px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.remark }}</span>
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
              @click="toEdit(scope.row)"
              v-has="{ red: 'blackListEdit', type: 1 }"
            >
              编辑
            </span>
            <span
              class="operation_button update_btn"
              @click="toDetails(scope.row)"
              v-has="{ red: 'blackListDetails', type: 1 }"
            >
              详情
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
  vehicleBlacklist, //黑名单列表
  vehicleBlacklistBatchDelete //黑名单批量删除
} from "@/api/specificVehicleManagement";
import Dialog from "./components/dialog";
import { fieldTable } from "@/api/common";
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";

export default {
  name: "blackList",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkingLotId: "", //停车场Id
        type: null,
        masterName: "", //车主姓名
        licensePlate: "", //车牌号
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      parkingList: [],
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
      } else if (value.length === 0) {
        this.time = ["", ""];
      }
      this.changeTime();
    }
  },

  created() {
    this.getparking();
    this.toSearchList();
  },
  methods: {
    //选择黑名单范围
    parkingLotIdChange(e) {
      if (e === -1) {
        this.listQuery.type = 1;
      } else {
        this.listQuery.type = null;
      }
    },
    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
        this.parkingList.unshift({ id: -1, name: "全部" });
      });
    },

    getNames(el) {
      let arr = el.parkingLots;
      if (el.type == 1) {
        return "全部";
      } else {
        let names = [];
        arr.forEach(el => {
          names.push(el.name);
        });
        return names.toString();
      }
    },
    changeTime() {
      this.listQuery.startTime = this.time[0].getTime();
      this.listQuery.endTime = this.time[1].getTime();
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
        parkingLotId: "", //停车场Id
        type: null,
        masterName: "", //车主姓名
        licensePlate: "", //车牌号
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

    //获取数据列表
    getList() {
      let para = this.listQuery;
      vehicleBlacklist(para)
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

    //打开添加长租规则
    toAdd() {
      let id = null;
      let pageType = 1;
      this.$refs.dialog.showDialog(id, pageType);
    },

    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },

    //批量删除
    toDel() {
      if (this.selGateway.length > 0) {
        let arr = [];
        this.selGateway.forEach(el => {
          arr.push(el.id);
        });
        let text = "确认批量删除黑名单吗?";
        if (this.selGateway.length == 1) {
          text = "确认删除该黑名单吗?";
        }

        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          let para = {
            ids: arr.toString()
          };
          vehicleBlacklistBatchDelete(para).then(response => {
            if (response.code == "200") {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.openLoading();
              this.getList();
            } else {
              // this.$message({
              //   type: "error",
              //   message: "删除失败"
              // });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择删除黑名单"
        });
      }
    },

    //打开编辑长租规则
    toEdit(e) {
      let id = e.id;
      let pageType = 2;
      this.$refs.dialog.showDialog(id, pageType);
    },
    //打开长租规则详情
    toDetails(e) {
      let id = e.id;
      let pageType = 3;
      this.$refs.dialog.showDialog(id, pageType);
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
