<template>
  <div class="commit_page">
    <div class="totalMoney_box">临停实收统计：{{ totalMoney }}元</div>
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">订单号</div>
        <el-input v-model="listQuery.orderNum" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">车牌号</div>
        <el-input v-model="listQuery.vehicle" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">是否开票</div>
        <el-select
          v-model="listQuery.invoice"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in invoiceList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content2">
        <div class="search_content_title">支付时间</div>
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
        <!-- :default-time="['00:00:00', '23:59:59']" -->
      </span>
      <span class="search_content">
        <div class="search_content_title">支付方式</div>
        <el-select
          v-model="listQuery.payType"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in typeList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
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
        v-has="{ red: 'parkingPaymentExport', type: 1 }"
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
        <el-table-column label="订单号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户手机" align="center" show-overflow-tooltip>
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
            <span class="content">{{ scope.row.parkName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计费开始时间"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.admissionTime }}</span></template
          >
        </el-table-column>
        <el-table-column
          label="计费截止时间"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.exitTime }}</span></template
          >
        </el-table-column>
        <el-table-column
          label="支付时间"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.payTime }}</span></template
          >
        </el-table-column>

        <el-table-column
          label="订单金额(元)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.orderMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="优惠" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content" v-if="scope.row.discountType == 0">{{
              scope.row.discountMoney + "折" || "无"
            }}</span>
            <span class="content" v-if="scope.row.discountType == 1">{{
              scope.row.discountMoney + "元" || "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="实收金额(元)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.payMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.payType == 1 ? "微信" : "钱包余额"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否开票" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.invoice == 1 ? "是" : "否"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              v-if="scope.row.status == 2"
              @click="openRefund(scope.row.id)"
              v-has="{ red: 'parkingPaymentRefund', type: 1 }"
            >
              退款
            </span>
            <span
              class="operation_button update_btn2"
              v-if="scope.row.status == -1"
            >
              已退款
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
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="700px"
      title="退款原因"
      center
      class="dialog_vehicle"
    >
      <div class="base_dialog_main_content">
        <el-form :model="newList" :rules="rules" ref="userForm">
          <div class="base_dialog_main_content">
            <div class="base_dialog_main_left" style="padding:20px 80px">
              <span class="base_dialog_condit">
                <el-form-item label="退款原因" prop="refundReason">
                  <el-input
                    v-model="newList.refundReason"
                    placeholder="请输入"
                    type="textarea"
                    :rows="3"
                    style="width: 72%"
                    class="filter-item"
                    maxlength="200"
                    show-word-limit
                    size="small"
                  />
                </el-form-item>
              </span>
            </div>
          </div>
        </el-form>
        <div class="base_dialog_main_btnBox" style="padding:0px 240px 30px">
          <el-button type="info" @click="toRefund">保存</el-button
          ><el-button type="danger" @click="closeDialog">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  orderPageList, //停车缴费分页
  orderExport, // 停车缴费导出
  orderRefund // 停车缴费退款
} from "@/api/reconciliationCenter";
import { fieldTable } from "@/api/common";

export default {
  name: "userRecharge",
  components: {},
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        orderNum: "", //订单号
        parkName: "", //停车场
        vehicle: "", //车牌号
        startTime: "", //开始时间
        endTime: "", //结束时间
        invoice: null, //是否开票
        payType: null, //支付方式
        orderType: 1 //临停传1  长租传2
      },
      newList: { id: null, refundReason: "" },
      rules: {
        refundReason: [
          { required: true, message: "请输入退款原因", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      totalMoney: null, //收款统计
      typeList: [
        { enumName: "微信", enumValue: 1 },
        { enumName: "钱包余额", enumValue: 2 }
      ],
      invoiceList: [
        { enumName: "是", enumValue: 1 },
        { enumName: "否", enumValue: 0 }
      ],
      selGateway: null,
      time: [],
      Dictionaries: {
        enumTypes: "STATUS"
      },
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

    //查询道闸日志列表
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
        parkName: "", //停车场
        vehicle: "", //车牌号
        startTime: "", //开始时间
        endTime: "", //结束时间
        invoice: null, //是否开票
        payType: null, //支付方式
        orderType: 1 //临停传1  长租传2
      };
      this.time = [];
      this.openLoading();
      this.getList();
    },
    //选择区域地址
    selectAddress(data) {
      this.listQuery.address = data;
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
      orderPageList(para)
        .then(response => {
          this.list = response.data.list;
          this.totalMoney = response.data.totalMoney;
          if (response.data.total > 0) {
            this.listQuery.total = response.data.total; // 数据总条数
          } else {
            this.listQuery.pageSize = 10; //每页数量
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
        orderNum: this.listQuery.orderNum,
        parkName: this.listQuery.parkName,
        vehicle: this.listQuery.vehicle,
        startTime: this.listQuery.startTime,
        endTime: this.listQuery.endTime,
        invoice: this.listQuery.invoice,
        payType: this.listQuery.payType,
        orderType: 1
      };
      orderExport(para).then(res => {
        var content = res.data;
        var elink = document.createElement("a");
        elink.download = "停车缴费" + new Date().getTime() + ".xls";
        elink.style.display = "none";

        var blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);

        document.body.appendChild(elink);
        elink.click();

        document.body.removeChild(elink);
      });
    },
    //开启退款弹窗
    openRefund(id) {
      this.dialogFormVisible = true;
      this.newList.id = id;
    },
    //退款
    toRefund() {
      this.$confirm("是否确认退款", "提示", {
        type: "warning",
        center: true
      })
        .then(() => {
          let para = this.newList;
          orderRefund(para).then(response => {
            if (response.code == "200") {
              this.$message({
                type: "success",
                message: "退款成功"
              });
              this.dialogFormVisible = false;
              this.openLoading();
              this.getList();
            } else {
              // this.$message({
              //   type: "error",
              //   message: "退款失败"
              // });
            }
          });
        })
        .catch(() => {});
    },
    closeDialog() {
      this.dialogFormVisible = false;
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
.update_btn2 {
  color: #999;
}
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
