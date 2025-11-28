<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">车牌号</div>
        <el-input v-model="listQuery.vehicle" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content2">
        <div class="search_content_title">申请时间</div>
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
      <span class="search_content2">
        <div class="search_content_title">审核时间</div>
        <el-date-picker
          style="width: 72%"
          v-model="time2"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="请选择时间"
          end-placeholder
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </span>
    </div>
    <div class="search_box">
      <span class="search_content2">
        <div class="search_content_title">退款操作时间</div>
        <el-date-picker
          style="width: 72%"
          v-model="time3"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="请选择时间"
          end-placeholder
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </span>
      <span class="search_content">
        <div class="search_content_title">订单号</div>
        <el-input v-model="listQuery.orderNum" placeholder="请输入"> </el-input>
      </span>

      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>
    <div class="btn_box">
      <el-radio-group
        v-model="listQuery.auditStatus"
        @input="chengeStatus"
        style="margin-right:10px"
      >
        <el-radio-button :label="0">待审核</el-radio-button>
        <el-radio-button :label="1">审核通过待退款</el-radio-button>
        <el-radio-button :label="2">已退款</el-radio-button>
        <el-radio-button :label="-1">不通过</el-radio-button>
      </el-radio-group>

      <el-button
        type="primary"
        icon="el-icon-s-check"
        @click="toAudits"
        v-if="listQuery.auditStatus == 0"
        v-has="{ red: 'monthlyRentalAudit', type: 1 }"
        >批量审核</el-button
      >

      <!-- v-has="{ red: 'deleteBox', type: 1 }" -->
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        :key="listQuery.auditStatus"
        height="calc(100vh - 350px)"
        @selection-change="handleSelectionChange"
        align="left"
      >
        <el-table-column
          type="selection"
          width="34"
          :key="0"
          :selectable="selectable"
        ></el-table-column>

        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
          :key="1"
        ></el-table-column>
        <el-table-column
          label="订单号"
          align="center"
          :key="2"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="停车场名称"
          align="center"
          :key="3"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="车牌号"
          align="center"
          :key="4"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicle }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计费开始时间"
          align="center"
          :key="5"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.admissionTime }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="计费截止时间"
          align="center"
          :key="6"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content"> {{ scope.row.payTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="实收金额(元)"
          align="center"
          :key="7"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.payMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="退款原因"
          align="center"
          :key="8"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.refundReason }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="图片"
          align="center"
          :key="9"
          min-width="110px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="content" :key="scope.row.id">
              <el-image
                v-if="scope.row.imageUrls && scope.row.imageUrls.length > 0"
                style="width: 48px; height: 36px"
                :src="scope.row.imageUrls[0]"
                :preview-src-list="scope.row.imageUrls"
              >
              </el-image>
              <!-- <el-popover placement="top-start" width="500" trigger="click">
                <img
                  :src="
                    scope.row.imageUrls[0]
                      ? scope.row.imageUrls[0]
                      : scope.row.imageUrls[0]
                  "
                  width="100%"
                />
                <img
                  v-if="
                    scope.row.imageUrls[0] !== '' &&
                      scope.row.imageUrls[0] !== null
                  "
                  slot="reference"
                  :src="scope.row.imageUrls[0]"
                  width="48"
                  height="36"
                />
                <span v-else>
                  <div min-width="48" height="36"></div>
                </span>
              </el-popover> -->
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="联系方式"
          align="center"
          :key="10"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.contactInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          align="center"
          :key="11"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.applyTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="审核时间"
          align="center"
          :key="12"
          min-width="120px"
          v-if="listQuery.auditStatus != 0"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.auditTime }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="退款操作时间"
          align="center"
          :key="13"
          min-width="120px"
          v-if="listQuery.auditStatus == 2"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.refundTime }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="不通过原因"
          align="center"
          :key="14"
          min-width="110px"
          v-if="listQuery.auditStatus == -1"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.rejectReason }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          align="center"
          :key="15"
          min-width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">
              <span v-show="listQuery.auditStatus == 0" class="offLine">
                待审核</span
              >
              <span v-show="listQuery.auditStatus == -1" class="offLine">
                不通过</span
              >
              <span v-show="listQuery.auditStatus == 1" class="offLine">
                审核通过待退款</span
              >
              <span v-show="listQuery.auditStatus == 2" class="offLine">
                已退款</span
              >
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          :key="16"
          header-align="center"
          min-width="110px"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              @click="toDetial(scope.row)"
              v-has="{ red: 'refundApplicationReviewDetails', type: 1 }"
            >
              详情
            </span>
            <span
              class="operation_button update_btn"
              @click="toAudit(scope.row)"
              v-if="listQuery.auditStatus == 0"
              v-has="{ red: 'refundApplicationReviewAudit', type: 1 }"
            >
              审核
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
    <Dialog ref="dialog" @getList="getList" @openLoading="openLoading"></Dialog>
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="700px"
      title="不通过原因"
      center
      class="dialog_vehicle"
    >
      <div class="base_dialog_main_content">
        <el-form :model="newList" :rules="rules" ref="userForm">
          <div class="base_dialog_main_content">
            <div class="base_dialog_main_left" style="padding:20px 80px">
              <span class="base_dialog_condit">
                <el-form-item label="不通过原因描述" prop="rejectReason">
                  <el-input
                    v-model="newList.rejectReason"
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
          <el-button type="info" @click="noPass">保存</el-button
          ><el-button type="danger" @click="closeDialog">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryRefundApplicationList, //退款申请审核list条件查询
  auditRefundApplication //退款申请批量审核
} from "@/api/operationManagement";
import Dialog from "./components/dialog";

export default {
  name: "RefundApplicationReview",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkName: "", //停车场
        vehicle: "", //车牌号
        name: "", //车主姓名
        auditStatus: 0, //审核状态：0-待审核；1-审核通过待退款；-1-审核不通过；2-已退款
        orderNum: "", //订单号
        applyTimeStart: "", //申请时间 开始时间
        applyTimeEnd: "", //申请时间 截止时间
        auditTimeStart: "", //审核时间 开始时间
        auditTimeEnd: "", //审核时间 截止时间
        refundTimeStart: "", //退款时间 开始时间
        refundTimeEnd: "" //退款时间 截至时间
      },
      dialogFormVisible: false, //不同意弹窗
      rules: {
        rejectReason: [
          { required: true, message: "请输入不通过原因描述", trigger: "blur" }
        ]
      },
      newList: { ids: [], auditStatus: null, rejectReason: "" },
      ids: null,
      statusList: [
        { enumName: "待审核", enumValue: 0 },
        { enumName: "审核通过待退款", enumValue: 1 },
        { enumName: "审核不通过", enumValue: -1 },
        { enumName: "已退款", enumValue: 2 }
      ],
      time: [],
      time2: [],
      time3: [],
      listLoading: false, //加载
      list: [] //信息
    };
  },
  watch: {
    time(value) {
      if (value === null) {
        this.time = ["", ""];
      } else {
        this.listQuery.applyTimeStart = value[0];
        this.listQuery.applyTimeEnd = value[1];
      }
    },
    time2(value) {
      if (value === null) {
        this.time2 = ["", ""];
      } else {
        this.listQuery.auditTimeStart = value[0];
        this.listQuery.auditTimeEnd = value[1];
      }
    },
    time3(value) {
      if (value === null) {
        this.time3 = ["", ""];
      } else {
        this.listQuery.refundTimeStart = value[0];
        this.listQuery.refundTimeEnd = value[1];
      }
    }
  },

  created() {
    this.toSearchList();
    // this.getFieldTable();
  },
  methods: {
    //判断是否可选
    selectable(e) {
      if (e.auditStatus >= 0) {
        return true;
      } else {
        return false;
      }
    },

    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },
    //切换页面
    chengeStatus() {
      this.listQuery.pageNum = 1;
      this.toSearchList();
    },

    //批量审核
    toAudits() {
      let arr = [];
      this.selGateway.forEach(el => {
        arr.push(el.id);
      });
      if (this.selGateway.length > 0) {
        this.$confirm("请选择以上批量审核操作", "提示", {
          confirmButtonText: "批量通过",
          cancelButtonText: "批量不通过",
          type: "warning",
          center: true
        })
          .then(() => {
            this.toPass(arr);
          })
          .catch(() => {
            this.dialogFormVisible = true;
            this.ids = arr;
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择审核数据"
        });
      }
    },
    //关闭新增/编辑设备弹窗
    closeDialog() {
      this.dialogFormVisible = false;
      this.openLoading();
      this.getList();
    },

    //通过
    toPass(arr) {
      let para = {
        ids: arr,
        rejectReason: ""
      };
      let text = "确认批量审核通过吗?";
      this.$confirm(text, "提示", {
        type: "warning"
      }).then(() => {
        auditRefundApplication(para).then(response => {
          if (response.code == "200") {
            this.$message({
              type: "success",
              message: "审核成功"
            });
            this.openLoading();
            this.getList();
          } else {
            // this.$message({
            //   type: "error",
            //   message: "审核失败"
            // });
          }
        });
      });
    },
    //不通过
    noPass() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          let para = {
            ids: this.ids,
            rejectReason: this.newList.rejectReason
          };
          let text = "确认批量审核不通过吗?";
          this.$confirm(text, "提示", {
            type: "warning"
          }).then(() => {
            auditRefundApplication(para)
              .then(response => {
                if (response.code == "200") {
                  this.dialogFormVisible = false;
                  this.openLoading();
                  this.getList();
                  this.$message({
                    type: "success",
                    message: "审核成功"
                  });
                } else {
                  // this.$message({
                  //   type: "error",
                  //   message: "审核失败"
                  // });
                }
              })
              .catch(() => {
                // this.$message({
                //   type: "error",
                //   message: "审核失败"
                // });
              });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //获取状态名称
    getStatusName(e) {
      let name;
      if (e == 0) {
        name = "已禁用";
      } else if (e == 1) {
        name = "使用中";
      } else if (e == -1) {
        name = "已到期";
      } else if (e == 2) {
        name = "未开始";
      } else if (e == 3) {
        name = "未开始(已禁用)";
      } else if (e == 4) {
        name = "待支付";
      } else if (e == -2) {
        name = "未支付";
      }
      return name;
    },

    //查询用户列表
    toSearchList() {
      this.listQuery.pageNum = 1;
      this.openLoading();
      this.getList();
    },
    //重置查询条件
    resetList() {
      let val = this.listQuery.auditStatus;
      let status = this.listQuery.auditStatus;
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkName: "", //停车场
        vehicle: "", //车牌号
        name: "", //车主姓名
        auditStatus: status, //审核状态：0-待审核；1-审核通过待退款；-1-审核不通过；2-已退款
        orderNum: "", //订单号
        applyTimeStart: "", //申请时间 开始时间
        applyTimeEnd: "", //申请时间 截止时间
        auditTimeStart: "", //审核时间 开始时间
        refundTimeEnd: "", //审核时间 截止时间
        refundTimeStart: "", //退款时间 开始时间
        endTime: "" //退款时间 截至时间
      };
      this.time = [];
      this.time2 = [];
      this.time3 = [];
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
      queryRefundApplicationList(para)
        .then(response => {
          this.list = response.data.rows;
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
    //打开用户详情
    toDetial(e) {
      this.$refs.dialog.showDialog(e, 1);
    },
    //审核
    toAudit(e) {
      let id = e.id;
      this.$refs.dialog.showDialog(e, 2);
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
