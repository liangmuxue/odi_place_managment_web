<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">车主手机</div>
        <el-input v-model="listQuery.phone" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">车主姓名</div>
        <el-input v-model="listQuery.name" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">车牌号</div>
        <el-input v-model="listQuery.vehicle" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">审核类型</div>
        <el-select
          v-model="listQuery.auditType"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in auditTypeList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>

      <span class="search_content2">
        <div class="search_content_title">申请时间</div>
        <!-- value-format="yyyy-MM-dd HH:mm:ss" -->
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
        v-model="listQuery.status"
        @input="toSearchList"
        style="margin-right:10px"
      >
        <el-radio-button :label="0">待审批</el-radio-button>
        <el-radio-button :label="1">审核通过</el-radio-button>
        <el-radio-button :label="-1">不通过</el-radio-button>
      </el-radio-group>

      <el-button
        type="primary"
        icon="el-icon-s-check"
        @click="toAudits"
        v-if="listQuery.status == 0"
        v-has="{ red: 'certificationAudit', type: 1 }"
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
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.idcard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证" min-width="90px" align="center">
          <template slot-scope="scope">
            <div class="content" :key="scope.row.id">
              <el-image
                v-if="scope.row.idcardPhoto"
                style="width: 48px; height: 36px"
                :src="scope.row.idcardPhoto"
                :preview-src-list="getPhotoList2(scope.row.idcardPhoto)"
              >
              </el-image>

              <!-- <el-popover placement="top-start" width="500" trigger="click">
                <img
                  :src="
                    scope.row.idcardPhoto
                      ? scope.row.idcardPhoto
                      : scope.row.idcardPhoto
                  "
                  width="100%"
                />
                <img
                  v-if="
                    scope.row.idcardPhoto !== '' &&
                      scope.row.idcardPhoto !== null
                  "
                  slot="reference"
                  :src="scope.row.idcardPhoto"
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

        <el-table-column label="车辆行驶证" min-width="90px" align="center">
          <template slot-scope="scope">
            <div class="content" :key="scope.row.id">
              <el-image
                v-if="scope.row.drivingLicense"
                style="width: 48px; height: 36px"
                :src="scope.row.drivingLicense"
                :preview-src-list="getPhotoList2(scope.row.drivingLicense)"
              >
              </el-image>

              <!-- <el-popover placement="top-start" width="500" trigger="click">
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
                  :src="scope.row.drivingLicense"
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
        <el-table-column label="状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ getStatusName(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.auditType == 1 ? "车辆认证" : "车辆申诉"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申请时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="不通过原因"
          align="center"
          show-overflow-tooltip
          v-if="listQuery.status === -1"
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.reason }}</span>
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
              @click="toDetial(scope.row)"
              v-has="{ red: 'vehicleCertificationAuditDetails', type: 1 }"
            >
              详情
            </span>
            <span
              class="operation_button update_btn"
              @click="toAudit(scope.row)"
              v-if="listQuery.status == 0"
              v-has="{ red: 'certificationAudit', type: 1 }"
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
          <el-button type="info" @click="noPass">保存</el-button
          ><el-button type="danger" @click="closeDialog">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  certificationList, //车辆认证分页查询
  certificationAudit //车辆人证审批
} from "@/api/operationManagement";
import Dialog from "./components/dialog";

export default {
  name: "VehicleCertificationAudit",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        phone: "", //车主手机
        name: "", //车主姓名
        vehicle: "", //车牌号
        status: 0, //审批类型；0未审批 1通过 -1不通过',
        auditType: null, //审核类型 1车辆认证 2车辆申诉
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      ids: null,
      dialogFormVisible: false, //不同意弹窗
      newList: { ids: [], status: null, reason: "" },
      rules: {
        reason: [
          { required: true, message: "请输入不通过原因描述", trigger: "blur" }
        ]
      },

      statusList: [
        { enumName: "未审批", enumValue: 0 },
        { enumName: "审核通过", enumValue: 1 },
        { enumName: "不通过", enumValue: -1 }
      ],
      auditTypeList: [
        { enumName: "车辆认证", enumValue: 1 },
        { enumName: "车辆申诉", enumValue: 2 }
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
    getPhotoList2(url) {
      let arr = [];
      arr.push(url);
      return arr;
    },

    //判断车辆申诉不可选
    selectable(e) {
      if (e.auditType == 1 && e.status == 0) {
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
      let status = e.status;
      let used = e.used;
      let name;
      if (status == null && used == 1) {
        name = "审核通过";
      } else if (status == 0) {
        name = "待审核";
      } else if (status == 1) {
        name = "审核通过";
      } else {
        name = "不通过";
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
      let status = this.listQuery.status;
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        phone: "", //车主手机
        name: "", //车主姓名
        vehicle: "", //车牌号
        status: status, //审批类型；0未审批 1通过 -1不通过',
        auditType: null, //审核类型 1车辆认证 2申诉
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
      certificationList(para)
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
          distinguishCancelAndClose: true,
          type: "warning",
          center: true
        })
          .then(() => {
            this.toPass(arr);
          })
          .catch(action => {
            if (action === "cancel") {
              this.dialogFormVisible = true;
              this.ids = arr;
            }
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
        status: 1,
        reason: ""
      };
      let text = "确认批量审核通过吗?";
      this.$confirm(text, "提示", {
        type: "warning"
      }).then(() => {
        certificationAudit(para).then(response => {
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
            status: -1,
            reason: this.newList.reason
          };
          let text = "确认批量审核不通过吗?";
          this.$confirm(text, "提示", {
            type: "warning"
          }).then(() => {
            certificationAudit(para)
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
<style lang="scss">
.dialog_vehicle {
  .el-dialog__headerbtn {
    margin-top: -10px;
    margin-right: -10px;
  }
  .el-form-item__label {
    width: 120px;
    text-align: left;
  }
}
</style>
