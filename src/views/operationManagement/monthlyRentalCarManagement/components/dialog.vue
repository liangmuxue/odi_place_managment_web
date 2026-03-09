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
              <el-form-item label="车主手机：" prop="phone">
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
              <el-form-item label="用户类型：" prop="name">
                <span class="base_dialog_condit_text">
                  {{ newList.userType == 1 ? "普通用户" : "企业员工" }}
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
              <el-form-item label="身份证：" prop="idcard">
                <span class="base_dialog_condit_text">
                  <el-image
                    style="width: 48px; height: 36px;margin-left:16px"
                    :src="newList.idcardPhoto"
                    :preview-src-list="getPhotoList2(newList.idcardPhoto)"
                  >
                  </el-image>

                  <!-- <el-popover placement="top-start" width="500" trigger="click">
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
                        newList.idcardPhoto !== '' &&
                          newList.idcardPhoto !== null
                      "
                      slot="reference"
                      :src="newList.idcardPhoto"
                      width="48"
                      height="36"
                    />
                    <span v-else>
                      <div min-width="48" height="36"></div>
                    </span>
                  </el-popover> -->
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" style="height:66px">
              <el-form-item label="行驶证：" prop="drivingLicense">
                <span class="base_dialog_condit_text" style=" display: flex;">
                  <span
                    v-for="(item, i) in newList.photos"
                    :key="item.vehicle"
                    class="condit_text_box"
                  >
                    <el-image
                      style="width: 48px; height: 36px;margin-left:16px"
                      :src="item.drivingLicense"
                      :preview-src-list="getPhotoList(newList.photos)"
                    >
                    </el-image>
                    <div class="condit_text_box-t">
                      {{ item.vehicle }}
                    </div>

                    <!-- <el-popover
                      placement="top-start"
                      width="500"
                      trigger="click"
                    >
                      <img
                        :src="
                          item.drivingLicense
                            ? item.drivingLicense
                            : item.drivingLicense
                        "
                        width="100%"
                      />
                      <img
                        v-if="
                          item.drivingLicense !== '' &&
                            item.drivingLicense !== null
                        "
                        slot="reference"
                        :src="item.drivingLicense"
                        width="48"
                        height="36"
                      />
                      <span v-else>
                        <div min-width="48" height="36"></div>
                      </span>
                    </el-popover> -->
                  </span>
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="企业盖章申请：" prop="enterpriseSeal">
                <span class="base_dialog_condit_text">
                  <el-popover placement="top-start" width="500" trigger="click">
                    <img
                      :src="
                        newList.enterpriseSeal
                          ? newList.enterpriseSeal
                          : newList.enterpriseSeal
                      "
                      width="100%"
                    />
                    <img
                      v-if="
                        newList.enterpriseSeal !== '' &&
                          newList.enterpriseSeal !== null
                      "
                      slot="reference"
                      :src="newList.enterpriseSeal"
                      width="48"
                      height="36"
                    />
                    <!-- :src="
                        newList.enterpriseSeal +
                          '?x-oss-process=image/resize,h_36,w_48'
                      " -->
                    <span v-else>
                      <div min-width="48" height="36"></div>
                    </span>
                  </el-popover>
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="停车场名称：" prop="parkName">
                <span class="base_dialog_condit_text">
                  {{ newList.parkName ? newList.parkName : newList.park }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="套餐名称：" prop="title">
                <span class="base_dialog_condit_text" v-if="newList.title">
                  {{ newList.title }}
                </span>
                <span class="base_dialog_condit_text" v-else
                  >长租套餐
                  <span v-if="newList.land == 1">（地上）</span>
                  <span v-if="newList.land == 2">（地下）</span>
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="长租时间：" prop="beginTime">
                <span class="base_dialog_condit_text">
                  {{ newList.beginTime }} - {{ newList.dueTime }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="申请时间：" prop="createTime">
                <span class="base_dialog_condit_text">
                  {{ newList.createTime }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="newList.verify != 0">
              <el-form-item label="审核时间：" prop="passTime">
                <span class="base_dialog_condit_text">
                  {{ newList.passTime }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="newList.verify == 1">
              <el-form-item label="支付时间：" prop="payTime">
                <span class="base_dialog_condit_text">
                  {{ newList.payTime }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="newList.verify == -1">
              <el-form-item label="不通过原因：" prop="reason">
                <span class="base_dialog_condit_text">
                  {{ newList.reason }}
                </span>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="状态：" prop="auditType">
                <span class="content">
                  <span v-show="newList.verify == 0" class="offLine">
                    待审核</span
                  >
                  <span v-show="newList.verify == -1" class="offLine">
                    不通过</span
                  >
                  <span v-show="newList.verify == 1">
                    <span
                      class="errLine_ball"
                      v-show="newList.status == 0"
                    ></span>
                    <span v-show="newList.status == 0" class="errLine">
                      已禁用</span
                    >
                    <span
                      class="offLine_ball"
                      v-show="newList.status == -1"
                    ></span>
                    <span v-show="newList.status == -1" class="offLine">
                      已过期</span
                    >
                    <span
                      class="onLine_ball"
                      v-show="newList.status == 1"
                    ></span>
                    <span v-show="newList.status == 1" class="onLine">
                      使用中</span
                    >
                    <span
                      class="offLine_ball"
                      v-show="newList.status == 2"
                    ></span>
                    <span v-show="newList.status == 2" class="offLine">
                      未开始</span
                    >
                    <span
                      class="offLine_ball"
                      v-show="newList.status == -2"
                    ></span>
                    <span v-show="newList.status == -2" class="offLine">
                      未支付</span
                    >
                    <span
                      class="blueLine_ball"
                      v-show="newList.status == 4"
                    ></span>
                    <span v-show="newList.status == 4" class="blueLine">
                      待支付</span
                    >
                    <span
                      class="offLine_ball"
                      v-show="newList.status == 3"
                    ></span>
                    <span v-show="newList.status == 3" class="offLine">
                      未开始</span
                    >
                    <span v-show="newList.status == 3" class="errLine">
                      (已禁用)</span
                    >
                  </span>
                </span>
              </el-form-item>
            </span>
            <span
              class="base_dialog_condit"
              style="height:80px"
              v-if="newList.verify == 1"
            >
              <el-form-item label="备注：" prop="remark">
                <el-input
                  v-if="pageType == 3"
                  v-model="newList.remark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注"
                  style="width: 72%"
                  class="filter-item"
                  maxlength="200"
                  show-word-limit
                  size="small"
                />
                <span class="base_dialog_condit_text" v-else>
                  {{ newList.remark }}
                </span>
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType == 2">
        <el-button type="info" @click="dialogFormVisible2 = true"
          >通过</el-button
        ><el-button type="danger" @click="tonoPass">不通过</el-button>
      </div>
      <div class="base_dialog_main_btnBox" v-if="pageType == 3">
        <el-button type="info" @click="toSave">保存</el-button
        ><el-button type="danger" @click="closeDialog">取消</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="700px"
      title="不通过原因"
      center
      class="dialog_vehicle"
      :modal="false"
    >
      <div class="base_dialog_main_content">
        <el-form :model="newList" ref="userForm" :rules="rules">
          <div class="base_dialog_main_content">
            <div class="base_dialog_main_left" style="padding:20px 80px">
              <span class="base_dialog_condit2" style="">
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
    <el-dialog
      :visible.sync="dialogFormVisible2"
      width="700px"
      title="审核通过备注"
      center
      class="dialog_vehicle"
      :modal="false"
    >
      <div class="base_dialog_main_content">
        <el-form :model="newList" ref="userForm" :rules="rules">
          <div class="base_dialog_main_content">
            <div class="base_dialog_main_left" style="padding:20px 80px">
              <span class="base_dialog_condit2" style="">
                <el-form-item label="备注描述" prop="remark">
                  <el-input
                    v-model="newList.remark"
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
          <el-button type="info" @click="toPass">保存</el-button
          ><el-button type="danger" @click="dialogFormVisible2 = false"
            >取消</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  vehiclesGetInfo, //月租车辆详情
  vehiclesToExamine, //月租车辆审核/批量审核
  updateRemark //修改备注
} from "@/api/operationManagement";

export default {
  components: {},
  data() {
    return {
      defaultImg: require("../../../../assets/images/imgError2.png"),
      pageType: 1,
      title: "详情",
      isShow: false,
      newList: {
        vehicle: "", //车牌号：
        vehicleType: "", //车辆类型：
        phone: "", //车主手机号：
        name: "", //车主姓名：
        idcard: "", //车主身份证：
        idcardPhoto: "", //身份证照片
        park: "", //停车场
        reason: "", //原因
        remark: "", //备注
        status: null, //状态 1使用中 0禁用 -1过期  2未开始 3未开始封禁
        payTime: "", //支付时间
        beginTime: "", //长租开始时间
        dueTime: "" //长租结束时间
      }, //详情
      rules: {
        reason: [
          { required: true, message: "请输入不通过原因描述", trigger: "blur" }
        ]
      },

      dialogFormVisible: false, //不同意弹窗
      dialogFormVisible2: false //不同意弹窗
    };
  },
  created() {},
  methods: {
    //打开弹窗
    showDialog(id, type) {
      this.isShow = true;
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = false;
      this.pageType = type;
      if (type == 1) {
        this.title = "详情";
      } else if (type == 2) {
        this.title = "审核";
      } else if (type == 3) {
        this.title = "编辑";
      }
      this.getDetials(id);
    },
    getPhotoList2(url) {
      let arr = [];
      arr.push(url);
      return arr;
    },
    getPhotoList(list) {
      let arr = [];
      list.forEach(el => {
        arr.push(el.drivingLicense);
      });
      return arr;
    },

    //通过
    toPass() {
      // if (this.newList.auditType == 1) {
      this.passNext();
      // } else {
      //   this.$confirm(
      //     "申诉通过后，" +
      //       this.newList.vehicle +
      //       " 该车辆与原 " +
      //       this.phone +
      //       " 用户自动解绑，并绑定至申诉用户 " +
      //       this.newList.phone +
      //       "  名下。是否确认通过该申诉？",
      //     "提示",
      //     {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning",
      //       center: true
      //     }
      //   )
      //     .then(() => {
      //       this.passNext();
      //     })
      //     .catch(() => {});
      // }
    },
    //通过
    passNext() {
      let arr = [];
      arr.push(this.newList.id);
      let para = {
        ids: arr,
        verify: 1,
        remark: this.newList.remark
      };
      let text = "确认审核通过该申请吗?";
      this.$confirm(text, "提示", {
        type: "warning"
      }).then(() => {
        vehiclesToExamine(para).then(response => {
          if (response.code == "200") {
            this.dialogFormVisible2 = false;
            this.isShow = false;

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
    //保存
    toSave() {
      let para = {
        id: this.newList.id,
        remark: this.newList.remark
      };
      let text = "确认修改审核备注吗?";
      this.$confirm(text, "提示", {
        type: "warning"
      }).then(() => {
        updateRemark(para)
          .then(response => {
            if (response.code == "200") {
              this.isShow = false;
              this.$emit("openLoading", {});
              this.$emit("getList", {});
              this.$message({
                type: "success",
                message: "修改成功"
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
            verify: -1,
            reason: this.newList.reason
          };
          let text = "确认审核不通过该申请吗?";
          this.$confirm(text, "提示", {
            type: "warning"
          }).then(() => {
            vehiclesToExamine(para)
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
      // this.openLoading();
      // this.getList();
    },

    //获取详情
    getDetials(id) {
      let para = { id: id };
      vehiclesGetInfo(para).then(response => {
        this.newList = response.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.base_dialog_condit {
  display: block;
  height: 40px;
  width: 100%;
  overflow: hidden;
}
.condit_text_box {
  width: 80px;
  height: 66px;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // text-align: center;
  position: relative;
}
.condit_text_box-t {
  position: absolute;
  display: inline-block;
  width: 80px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  left: 0;
  bottom: 0;
  text-align: center;
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
