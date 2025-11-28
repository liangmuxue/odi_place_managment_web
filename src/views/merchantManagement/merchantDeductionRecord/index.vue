<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">订单号</div>
        <el-input v-model="listQuery.licensePlate" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title2">车牌号</div>
        <el-input v-model="listQuery.parkingLotName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.licensePlate" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title2">商户名称</div>
        <el-input v-model="listQuery.parkingLotName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title2">抵扣券名称</div>
        <el-input v-model="listQuery.parkingLotName" placeholder="请输入">
        </el-input>
      </span>
    </div>
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">抵扣类型</div>
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
        <div class="search_content_title">抵扣时间</div>
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
        v-has="{ red: 'freeCodeManagementAdd', type: 1 }"
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
        <el-table-column label="订单号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.licensePlate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.masterName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              getNames(scope.row.vehicleWaiverParkingLots)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="停车场名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              getNames(scope.row.vehicleWaiverParkingLots)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.masterName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="抵扣券名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.masterName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="抵扣类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.masterName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="抵扣数据(单位)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.masterName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="抵扣金额换算(元)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.masterName }}</span>
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
              scope.row.createTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
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
  vehicleWaiverList //限免车列表
} from "@/api/specificVehicleManagement";
import {
  discountRecordExport // 优惠记录导出
} from "@/api/reconciliationCenter";

import { fieldTable } from "@/api/common";

export default {
  name: "freeCodeManagement",
  components: {},
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        licensePlate: "", //车牌号
        parkingLotName: "", //停车场名
        expirationStartTime: "", //开始时间
        expirationEndTime: "", //结束时间
        status: null //使用状态
      },
      selGateway: null,
      statusList: [
        { enumName: "到期", enumValue: 1 },
        { enumName: "正常", enumValue: 0 }
      ],
      totalMoney: null, //收款统计
      Dictionaries: {
        enumTypes: "RULE_VEHICLE_TYPE,RULE_PARKING_DIRECTION"
      },
      enumsData: {}, //字典表返回数据
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
    this.toSearchList();
    this.getFieldTable();
  },
  methods: {
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
      });
    },
    getNames(arr) {
      let names = [];
      arr.forEach(el => {
        if (el.parkingLot) {
          names.push(el.parkingLot.name);
        }
      });
      return names.toString();
    },
    changeTime() {
      this.listQuery.expirationStartTime = this.time[0].getTime();
      this.listQuery.expirationEndTime = this.time[1].getTime();
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
        licensePlate: "", //车牌号
        parkingLotName: "", //停车场名
        expirationStartTime: "", //开始时间
        expirationEndTime: "", //结束时间
        status: null //使用状态
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
      vehicleWaiverList(para)
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

    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },
    //导出
    toExport() {
      let para = {
        orderNum: this.listQuery.orderNum,
        refundNum: this.listQuery.refundNum,
        vehicle: this.listQuery.vehicle,
        phone: this.listQuery.refundNum,
        startTime: this.listQuery.phone,
        endTime: this.listQuery.endTime,
        parkName: this.listQuery.parkName
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
