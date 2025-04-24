<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkingLotName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">车牌号</div>
        <el-input v-model="listQuery.licensePlate" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">缴费状态</div>
        <el-select
          v-model="listQuery.payStatus"
          placeholder="选择缴费状态"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in enumsData.PAY_STATUS"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content3">
        <div class="search_content_switchBox">
          48h未出场
          <el-switch
            v-model="listQuery.longTimeNoLeave"
            :active-value="1"
            :inactive-value="null"
          >
          </el-switch>
        </div>
      </span>
      <span class="search_content3">
        <div class="search_content_switchBox">
          无入场记录
          <el-switch
            v-model="listQuery.noEntryRecording"
            :active-value="1"
            :inactive-value="null"
          >
          </el-switch>
        </div>
      </span>
      <span class="search_content3">
        <div class="search_content_switchBox">
          无出场记录
          <el-switch
            v-model="listQuery.noLeaveRecording"
            :active-value="1"
            :inactive-value="null"
          >
          </el-switch>
        </div>
      </span>
      <span class="search_content">
        <div class="search_content_title">是否出场</div>
        <el-select
          v-model="listQuery.isLeave"
          placeholder="选择是否出场"
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
    </div>
    <div class="search_box">
      <span class="search_content2">
        <div class="search_content_title">入场时间</div>
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
      <span class="search_content2">
        <div class="search_content_title">出场时间</div>
        <el-date-picker
          style="width: 72%"
          v-model="time2"
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
        height="calc(100vh - 360px)"
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
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkingLotName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.licensePlate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌颜色" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleColorName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="入场时间"
          align="center"
          min-width="140px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content"
              >{{ scope.row.entryTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="入场设备" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.barrierName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="入场图片"
          align="center"
          min-width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="content">
              <el-popover placement="top-start" width="500" trigger="click">
                <img
                  :src="
                    scope.row.entryImg ? scope.row.entryImg : scope.row.entryImg
                  "
                  width="100%"
                />
                <img
                  v-if="
                    scope.row.entryImg !== '' && scope.row.entryImg !== null
                  "
                  slot="reference"
                  :src="
                    scope.row.entryImg + '?x-oss-process=image/resize,h_36,w_48'
                  "
                  width="48"
                  height="36"
                />
                <span v-else>
                  <div min-width="48" height="36"></div>
                </span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否出场" min-width="100px" align="center">
          <template slot-scope="scope">
            <div class="content">
              {{ scope.row.isLeave == 1 ? "是" : "否" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="出场设备" min-width="100px" align="center">
          <template slot-scope="scope">
            <div class="content">
              {{ scope.row.leaveBarrierName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="缴费状态"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">
              <span v-if="scope.row.payStatus == 0" class="falseBox">
                {{ scope.row.payStatusName }}</span
              >
              <span v-else class="trueBox"> {{ scope.row.payStatusName }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="出场时间"
          align="center"
          min-width="140px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content"
              >{{ scope.row.leaveTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出场图片" min-width="100px" align="center">
          <template slot-scope="scope">
            <div class="content">
              <el-popover placement="top-start" width="500" trigger="click">
                <img
                  :src="
                    scope.row.leaveImg ? scope.row.leaveImg : scope.row.leaveImg
                  "
                  width="100%"
                />
                <img
                  v-if="
                    scope.row.leaveImg !== '' && scope.row.leaveImg !== null
                  "
                  slot="reference"
                  :src="
                    scope.row.leaveImg + '?x-oss-process=image/resize,h_36,w_48'
                  "
                  width="48"
                  height="36"
                />
                <span v-else>
                  <div min-width="48" height="36"></div>
                </span>
              </el-popover>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="170px"
          header-align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button"
              style="width:90px"
              @click="toEdit(scope.row)"
            >
              修改车牌
            </span>
            <span
              class="operation_button"
              style="width:50px"
              v-if="!scope.row.leaveTime"
              @click="toDel(scope.row)"
            >
              删除
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
  vehicleEntryList, //出入记录分页
  vehicleEntryExport, //出入记录导出
  vehicleEntryDelete //删除出入记录
} from "@/api/operationManagement";
import Dialog from "./components/dialog";
import { fieldTable } from "@/api/common";

export default {
  name: "vehicleEntryAndExitRecords",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkingLotName: "", //停车场
        licensePlate: "", //车牌号码
        parkingType: null, //缴费状态
        longTimeNoLeave: null, //48小时未出场
        noEntryRecording: null, //无入场记录
        noLeaveRecording: null, //无出场记录
        isLeave: null, //是否出场
        entryStartTime: "", //入场开始时间
        entryEndTime: "", //入场结束时间
        leaveStartTime: "", //出车开始时间
        leaveEndTime: "" //出场结束时间
      },
      statusList: [
        { enumName: "未出场", enumValue: 0 },
        { enumName: "已出场", enumValue: 1 }
      ],
      selGateway: null,
      Dictionaries: {
        enumTypes: "PAY_STATUS"
      },
      enumsData: {}, //字典表返回数据
      time: [],
      time2: [],
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
    },
    time2(value) {
      if (value === null) {
        this.time2 = ["", ""];
      }
      this.changeTime2();
    }
  },

  created() {
    this.toSearchList();
    this.getFieldTable();
  },
  methods: {
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
      });
    },
    changeTime() {
      this.listQuery.entryStartTime = this.time[0].getTime();
      this.listQuery.entryEndTime = this.time[1].getTime();
    },
    changeTime2() {
      this.listQuery.leaveStartTime = this.time2[0].getTime();
      this.listQuery.leaveEndTime = this.time2[1].getTime();
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
        parkingLotName: "", //停车场
        licensePlate: "", //车牌号码
        parkingType: null, //缴费状态
        longTimeNoLeave: null, //48小时未出场
        noEntryRecording: null, //无入场记录
        noLeaveRecording: null, //无出场记录
        isLeave: null, //是否出场
        entryStartTime: "", //入场开始时间
        entryEndTime: "", //入场结束时间
        leaveStartTime: "", //出车开始时间
        leaveEndTime: "" //出场结束时间
      };
      this.time = [];
      this.time2 = [];
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
      vehicleEntryList(para)
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

    //导出
    toExport() {
      let para = {
        name: this.listQuery.name,
        parkName: this.listQuery.parkName,
        startTime: this.listQuery.startTime,
        endTime: this.listQuery.endTime,
        type: this.listQuery.type
      };
      vehicleEntryExport(para).then(res => {
        var content = res.data;
        var elink = document.createElement("a");
        elink.download = "车辆出入记录" + new Date().getTime() + ".xls";
        elink.style.display = "none";

        var blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);

        document.body.appendChild(elink);
        elink.click();

        document.body.removeChild(elink);
      });
    },
    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },

    //打开修改车牌
    toEdit(e) {
      let id = e.id;
      let pageType = 2;
      this.$refs.dialog.showDialog(id, pageType);
    },
    //删除
    toDel(e) {
      let id = e.id;
      let text = "确认删除该车辆出入记录吗?";

      this.$confirm(text, "提示", {
        type: "warning"
      }).then(() => {
        let para = {
          id: id
        };
        vehicleEntryDelete(para).then(response => {
          if (response.code == "200") {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.openLoading();
            this.getList();
          } else {
            this.$message({
              type: "warning",
              message: "删除失败"
            });
          }
        });
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
