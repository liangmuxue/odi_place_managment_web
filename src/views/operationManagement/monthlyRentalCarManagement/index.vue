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
      <span class="search_content">
        <div class="search_content_title">车主姓名</div>
        <el-input v-model="listQuery.name" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content" v-if="listQuery.verify < 1">
        <div class="search_content_title">用户类型</div>
        <el-select
          v-model="listQuery.userType"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in userTypes"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content" v-if="listQuery.verify > 0">
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
        <div class="search_content_title" v-if="listQuery.verify > 0">
          长租时间
        </div>
        <div class="search_content_title" v-else>申请时间</div>
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
      <el-radio-group
        v-model="listQuery.verify"
        @input="chengeVSerify"
        style="margin-right:10px"
      >
        <el-radio-button :label="0">待审核</el-radio-button>
        <el-radio-button :label="1">审核通过</el-radio-button>
        <el-radio-button :label="-1">不通过</el-radio-button>
      </el-radio-group>

      <el-dropdown @command="toStartStop" v-if="listQuery.verify == 1">
        <el-button type="primary">
          批量启停<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="1"> 批量启用</el-dropdown-item>
          <el-dropdown-item :command="0">批量禁用</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button
        type="primary"
        icon="el-icon-s-check"
        @click="toAudits"
        v-if="listQuery.verify == 0"
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
        height="calc(100vh - 320px)"
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
          label="车牌号"
          align="center"
          :key="2"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicle }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车辆类型"
          align="center"
          :key="3"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车主手机"
          align="center"
          :key="4"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车主姓名"
          align="center"
          :key="5"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="用户类型"
          align="center"
          :key="6"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.userType == 1 ? "普通用户" : "企业员工"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车主身份证"
          align="center"
          :key="7"
          min-width="110px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.idcard }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车辆行驶证"
          align="center"
          :key="8"
          min-width="110px"
          v-if="listQuery.verify < 1"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="content">
              <el-popover placement="top-start" width="500" trigger="click">
                <img
                  :src="
                    scope.row.drivingLicense
                      ? scope.row.drivingLicense
                      : scope.row.drivingLicense
                  "
                  width="100%"
                />
                <img
                  v-if="
                    scope.row.drivingLicense !== '' &&
                      scope.row.drivingLicense !== null
                  "
                  slot="reference"
                  :src="
                    scope.row.drivingLicense +
                      '?x-oss-process=image/resize,h_36,w_48'
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
          label="企业盖章申请"
          align="center"
          :key="9"
          v-if="listQuery.verify < 1"
          min-width="110px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="content">
              <el-popover placement="top-start" width="500" trigger="click">
                <img
                  :src="
                    scope.row.enterpriseSeal
                      ? scope.row.enterpriseSeal
                      : scope.row.enterpriseSeal
                  "
                  width="100%"
                />
                <img
                  v-if="
                    scope.row.enterpriseSeal !== '' &&
                      scope.row.enterpriseSeal !== null
                  "
                  slot="reference"
                  :src="
                    scope.row.enterpriseSeal +
                      '?x-oss-process=image/resize,h_36,w_48'
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
          label="停车场名称"
          align="center"
          :key="10"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="长租时间"
          align="center"
          :key="11"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content"
              >{{ scope.row.beginTime }} - {{ scope.row.dueTime }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          label="审核时间"
          align="center"
          :key="12"
          min-width="120px"
          v-if="listQuery.verify == 1"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.passTime }} </span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          align="center"
          :key="13"
          min-width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">
              <span v-show="listQuery.verify == 0" class="offLine">
                待审核</span
              >
              <span v-show="listQuery.verify == -1" class="offLine">
                不通过</span
              >
              <span v-show="listQuery.verify == 1">
                <span
                  class="errLine_ball"
                  v-show="scope.row.status == 0"
                ></span>
                <span v-show="scope.row.status == 0" class="errLine">
                  已禁用</span
                >
                <span
                  class="offLine_ball"
                  v-show="scope.row.status == -1"
                ></span>
                <span v-show="scope.row.status == -1" class="offLine">
                  已过期</span
                >
                <span class="onLine_ball" v-show="scope.row.status == 1"></span>
                <span v-show="scope.row.status == 1" class="onLine">
                  使用中</span
                >
                <span
                  class="offLine_ball"
                  v-show="scope.row.status == 2"
                ></span>
                <span v-show="scope.row.status == 2" class="offLine">
                  未开始</span
                >
                <span
                  class="offLine_ball"
                  v-show="scope.row.status == -2"
                ></span>
                <span v-show="scope.row.status == -2" class="offLine">
                  未支付</span
                >
                <span
                  class="blueLine_ball"
                  v-show="scope.row.status == 4"
                ></span>
                <span v-show="scope.row.status == 4" class="blueLine">
                  待支付</span
                >
                <span
                  class="offLine_ball"
                  v-show="scope.row.status == 3"
                ></span>
                <span v-show="scope.row.status == 3" class="offLine">
                  未开始</span
                >
                <span v-show="scope.row.status == 3" class="errLine">
                  (已禁用)</span
                >
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          align="center"
          :key="14"
          min-width="110px"
          v-if="listQuery.verify < 1"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="支付时间"
          align="center"
          :key="15"
          min-width="110px"
          v-if="listQuery.verify == 1"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.payTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="不通过原因"
          align="center"
          :key="15"
          min-width="110px"
          v-if="listQuery.verify == -1"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.reason }}</span>
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
            >
              详情
            </span>
            <span
              class="operation_button update_btn"
              @click="toStartStop2(scope.row.id, 1)"
              v-show="listQuery.verify == 1"
              v-if="scope.row.status == 0 || scope.row.status == 3"
            >
              启用
            </span>
            <span
              class="operation_button update_btn"
              @click="toStartStop2(scope.row.id, 0)"
              v-show="listQuery.verify == 1"
              v-if="scope.row.status == 1 || scope.row.status == 2"
            >
              禁用
            </span>
            <span
              class="operation_button update_btn"
              @click="toAudit(scope.row)"
              v-if="listQuery.verify == 0"
            >
              审核
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
                <el-form-item label="不通过原因描述" prop="reason">
                  <el-input
                    v-model="newList.reason"
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
          <el-button type="info" icon="el-icon-circle-plus" @click="noPass"
            >保存</el-button
          ><el-button type="danger" icon="el-icon-error" @click="closeDialog"
            >取消</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  vehiclesList, //月租车辆列表
  vehiclesToExamine, //月租车辆审核/批量审核
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
        parkName: "", //停车场
        vehicle: "", //车牌号
        name: "", //车主姓名
        verify: 0, //0待审核,1审核通过，-1不通过
        status: null, //状态 0禁用 1使用中 -1过期  2未开始/已支付 3未开始封禁  4待支付 -2过期未支付
        userType: null, //用户类型 1普通  2企业
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      dialogFormVisible: false, //不同意弹窗
      rules: {
        reason: [
          { required: true, message: "请输入不通过原因描述", trigger: "blur" }
        ]
      },
      newList: { ids: [], status: null, reason: "" },
      ids: null,
      statusList: [
        { enumName: "使用中", enumValue: 1 },
        { enumName: "已禁用", enumValue: 0 },
        { enumName: "已过期", enumValue: -1 },
        { enumName: "未开始", enumValue: 2 },
        { enumName: "未开始(已禁用)", enumValue: 3 },
        { enumName: "待支付", enumValue: 4 },
        { enumName: "未支付", enumValue: -2 }
      ],
      userTypes: [
        { enumName: "普通用户", enumValue: 1 },
        { enumName: "企业员工", enumValue: 2 }
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
    //切换页面
    chengeVSerify(e) {
      if (e == 1) {
        this.listQuery.userType = null;
      } else {
        this.listQuery.status = null;
      }
      this.listQuery.startTime = "";
      this.listQuery.endTime = "";
      this.time = [];
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
        verify: 1,
        reason: ""
      };
      vehiclesToExamine(para).then(response => {
        if (response.code == "200") {
          this.$message({
            type: "success",
            message: "审核成功"
          });
          this.openLoading();
          this.getList();
        } else {
          this.$message({
            type: "warning",
            message: "审核失败"
          });
        }
      });
    },
    //不通过
    noPass() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          let para = {
            ids: this.ids,
            verify: -1,
            reason: this.newList.reason
          };

          vehiclesToExamine(para)
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
                this.$message({
                  type: "warning",
                  message: "审核失败"
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "审核失败"
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
      let val = this.listQuery.verify;
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkName: "", //停车场
        vehicle: "", //车牌号
        name: "", //车主姓名
        verify: val,
        status: null, //状态 0禁用 1使用中 -1过期  2未开始/已支付 3未开始封禁  4待支付 -2过期未支付
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
    //审核
    toAudit(e) {
      let id = e.id;
      this.$refs.dialog.showDialog(id, 2);
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
