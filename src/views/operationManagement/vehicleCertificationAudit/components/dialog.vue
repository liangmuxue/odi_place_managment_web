<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList">
        <div
          class="base_dialog_main_content"
          style="height: calc(100vh - 240px);"
        >
          <div class="base_dialog_main_left" style="padding:50px">
            <span class="base_dialog_condit">
              <el-form-item label="车牌号：" prop="vehicle">
                <span class="base_dialog_condit_text">
                  {{ newList.vehicle }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车辆类型：" prop="vehicleType">
                <span class="base_dialog_condit_text">
                  {{ newList.vehicleType }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车主手机号：" prop="phone">
                <span class="base_dialog_condit_text">
                  {{ newList.phone }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车主姓名：" prop="name">
                <span class="base_dialog_condit_text">
                  {{ newList.name }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车主身份证：" prop="idcard">
                <span class="base_dialog_condit_text">
                  {{ newList.idcard }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="身份证：" prop="idcardPhoto">
                <el-popover
                  placement="top-start"
                  width="500"
                  trigger="click"
                  :key="newList.id"
                >
                  <img
                    :src="
                      newList.idcardPhoto
                        ? newList.idcardPhoto
                        : newList.idcardPhoto
                    "
                    width="100%"
                  />
                  <img
                    v-if="
                      newList.idcardPhoto !== '' && newList.idcardPhoto !== null
                    "
                    slot="reference"
                    :src="newList.idcardPhoto"
                    width="48"
                    height="36"
                  />
                  <!-- :src="
                      newList.idcardPhoto +
                        '?x-oss-process=image/resize,h_36,w_48'
                    " -->
                  <span v-else>
                    <div min-width="48" height="36"></div>
                  </span>
                </el-popover>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="行驶证：" prop="drivingLicense">
                <el-popover
                  placement="top-start"
                  width="500"
                  trigger="click"
                  :key="newList.id"
                >
                  <img
                    :src="
                      newList.drivingLicense
                        ? newList.drivingLicense
                        : newList.drivingLicense
                    "
                    width="100%"
                  />
                  <img
                    v-if="
                      newList.drivingLicense !== '' &&
                        newList.drivingLicense !== null
                    "
                    slot="reference"
                    :src="newList.drivingLicense"
                    width="48"
                    height="36"
                  />
                  <!-- :src="
                      newList.drivingLicense +
                        '?x-oss-process=image/resize,h_36,w_48'
                    " -->
                  <span v-else>
                    <div min-width="48" height="36"></div>
                  </span>
                </el-popover>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="审核类型：" prop="auditType">
                <span class="base_dialog_condit_text">
                  {{ newList.auditType == 1 ? "车辆认证" : "车辆申诉" }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="pageType != 2">
              <el-form-item label="状态：" prop="auditType">
                <span class="base_dialog_condit_text">
                  {{ getStatusName(newList.status) }}
                </span>
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType == 2">
        <el-button type="info" @click="toPass">通过</el-button
        ><el-button type="danger" @click="tonoPass">不通过</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="700px"
      title="不通过原因"
      center
      class="dialog_vehicle"
      append-to-body
    >
      <div class="base_dialog_content">
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
          ><el-button type="danger" @click="closeDialog2">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listByVehicle, //申诉时查是否有认证的
  certificationGetInfo, //车辆认证详情
  certificationAudit, //车辆人证审批
  getPhoneByVehicle //通过车牌号查原绑定手机号
} from "@/api/operationManagement";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      title: "详情",
      isShow: false,
      hasExamine: false, //是否含有审核数据
      phone: null, //车辆绑定手机号
      newList: {
        vehicle: "", //车牌号：
        vehicleType: "", //车辆类型：
        phone: "", //车主手机号：
        name: "", //车主姓名：
        idcard: "", //车主身份证：
        drivingLicense: "", //行驶证：
        auditType: null //审核类型：
      }, //详情
      dialogFormVisible: false, //不同意弹窗
      rules: {
        reason: [
          { required: true, message: "请输入不通过原因描述", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    //打开弹窗
    showDialog(id, type) {
      this.isShow = true;
      this.pageType = type;
      if (type == 1) {
        this.title = "详情";
      } else {
        this.title = "审核";
      }
      this.getDetials(id);
    },

    //通过
    toPass() {
      if (this.newList.auditType == 1) {
        //1车辆认证
        this.passNext();
      } else {
        if (this.hasExamine) {
          this.$message({
            message: "该车辆有待审核车辆认证，请优先处理！",
            type: "warning"
          });
        } else {
          //2车辆申诉
          this.$confirm(
            "申诉通过后，" +
              this.newList.vehicle +
              " 该车辆与原 " +
              this.phone +
              " 用户自动解绑，并绑定至申诉用户 " +
              this.newList.phone +
              "  名下。是否确认通过该申诉？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            }
          )
            .then(() => {
              this.passNext();
            })
            .catch(() => {});
        }
      }
    },
    //获取状态名称
    getStatusName(e) {
      let name;
      if (e == 0) {
        name = "待审核";
      } else if (e == 1) {
        name = "审核通过";
      } else {
        name = "不通过";
      }
      return name;
    },

    //通过
    passNext() {
      let arr = [];
      arr.push(this.newList.id);
      let para = {
        ids: arr,
        status: 1,
        reason: ""
      };
      let text = "确认审核通过该申请吗?";
      this.$confirm(text, "提示", {
        type: "warning"
      }).then(() => {
        this.isShow = false;

        certificationAudit(para).then(response => {
          if (response.code == "200") {
            this.$message({
              type: "success",
              message: "审核成功"
            });
            this.$emit("openLoading", {});
            this.$emit("getList", {});
          } else {
            // this.$message({
            //   type: "error",
            //   message: "审核失败"
            // });
          }
        });
      });
    },
    //开启不通过弹窗
    tonoPass() {
      this.dialogFormVisible = true;
    },
    //不通过
    noPass() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          let arr = [];
          arr.push(this.newList.id);

          let para = {
            ids: arr,
            status: -1,
            reason: this.newList.reason
          };
          let text = "确认审核不通过该申请吗?";
          this.$confirm(text, "提示", {
            type: "warning"
          }).then(() => {
            certificationAudit(para)
              .then(response => {
                if (response.code == "200") {
                  this.dialogFormVisible = false;
                  this.isShow = false;
                  this.$emit("openLoading", {});
                  this.$emit("getList", {});
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

    //关闭弹窗
    closeDialog() {
      this.isShow = false;
    },
    //关闭新增/编辑设备弹窗
    closeDialog2() {
      this.dialogFormVisible = false;
      this.openLoading();
      this.getList();
    },

    //获取详情
    getDetials(id) {
      let para = { id: id };
      certificationGetInfo(para).then(response => {
        this.newList = response.data;
        this.getPhone(response.data.vehicle);
        this.getExamine();
      });
    },
    //获取是否有审核数据
    getExamine() {
      let para = {
        vehicle: this.newList.vehicle //车牌号
      };
      listByVehicle(para).then(response => {
        if (response.data && response.data.length > 0) {
          this.hasExamine = true;
        } else {
          this.hasExamine = false;
        }
      });
    },
    //车辆手机号
    getPhone(vehicle) {
      let para = { vehicle: vehicle };
      getPhoneByVehicle(para).then(response => {
        this.phone = response.msg;
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
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
  .el-form-item__error {
    margin-left: 120px;
  }
}
</style>
