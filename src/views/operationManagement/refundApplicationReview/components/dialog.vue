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
        <div class="refundApplicationReview_dialog">
          <div class="refundApplicationReview_dialog_con">
            <div class="refundApplicationReview_dialog_con_title">
              订单信息
            </div>
            <div class="refundApplicationReview_dialog_con_content">
              <div class="refundApplicationReview_dialog_con_content_box">
                <span class="base_dialog_condit">
                  <el-form-item label="订单号:" prop="orderNum">
                    <span>
                      {{ newList.orderNum }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="计费开始时间:" prop="admissionTime">
                    <span>
                      {{ newList.admissionTime }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="订单金额(元):" prop="orderMoney">
                    <span>
                      {{ newList.orderMoney }}
                    </span>
                  </el-form-item>
                </span>
              </div>
              <div class="refundApplicationReview_dialog_con_content_box">
                <span class="base_dialog_condit">
                  <el-form-item label="用户手机:" prop="phone">
                    <span>
                      {{ newList.phone }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="计费截止时间:" prop="payTime">
                    <span>
                      {{ newList.payTime }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="优惠:" prop="discountType">
                    <span v-if="newList.discountType == 0">
                      {{
                        newList.discountMoney
                          ? newList.discountMoney + "折"
                          : "无"
                      }}
                    </span>
                    <span v-else-if="newList.discountType == 1">
                      {{
                        newList.discountMoney
                          ? newList.discountMoney + "元"
                          : "无"
                      }}
                    </span>
                    <span v-else-if="newList.discountType == 2">
                      {{
                        newList.discountMoney
                          ? newList.discountMoney + "分钟(充电券)"
                          : "无"
                      }}
                    </span>
                    <span v-else-if="newList.discountType == 5">
                      {{
                        newList.discountMoney
                          ? newList.discountMoney + "分钟(生活券)"
                          : "无"
                      }}
                    </span>
                    <span v-else-if="newList.discountType == 6">
                      {{
                        newList.discountMoney
                          ? newList.discountMoney + "小时(商户券)"
                          : "无"
                      }}
                    </span>
                    <span v-else-if="newList.discountType == 7">
                      {{
                        newList.discountMoney
                          ? newList.discountMoney + "元(商户券)"
                          : "无"
                      }}
                    </span>
                    <span v-else-if="newList.discountType == 8">
                      {{
                        newList.discountMoney
                          ? newList.discountMoney * 10 + "折(商户券)"
                          : "无"
                      }}
                    </span>
                    <span v-else-if="newList.discountType == 9">
                      全免抵扣(商户券)
                    </span>
                    <span v-else>
                      无
                    </span>
                  </el-form-item>
                </span>
              </div>
              <div class="refundApplicationReview_dialog_con_content_box">
                <span class="base_dialog_condit">
                  <el-form-item label="车牌号:" prop="vehicle">
                    <span>
                      {{ newList.vehicle }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="支付时间:" prop="payTime">
                    <span>
                      {{ newList.payTime }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="实收金额(元):" prop="payMoney">
                    <span>
                      {{ newList.payMoney }}
                    </span>
                  </el-form-item>
                </span>
              </div>
              <div class="refundApplicationReview_dialog_con_content_box">
                <span class="base_dialog_condit">
                  <el-form-item label="停车场名称:" prop="parkName">
                    <span>
                      {{ newList.parkName ? newList.parkName : newList.park }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="是否已开票:" prop="invoice">
                    <span>
                      {{ newList.invoice == 1 ? "是" : "否" }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="支付方式:" prop="payType">
                    <span>
                      {{ newList.payType == 1 ? "微信" : "钱包余额" }}
                    </span>
                  </el-form-item>
                </span>
              </div>
            </div>
          </div>
          <div class="refundApplicationReview_dialog_con" style="height:280px">
            <div class="refundApplicationReview_dialog_con_title">
              退款申请
            </div>
            <div class="refundApplicationReview_dialog_con_content">
              <div class="refundApplicationReview_dialog_con_content_box">
                <span class="base_dialog_condit">
                  <el-form-item label="退款原因:" prop="refundReason">
                    <span>
                      {{ newList.refundReason }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="图片:" prop="imageUrls">
                    <span
                      v-for="(item, i) in newList.imageUrls"
                      :key="i"
                      style="margin-right:3px"
                    >
                      <el-popover
                        placement="top-start"
                        width="500"
                        trigger="click"
                      >
                        <img :src="item ? item : item" width="100%" />
                        <img
                          v-if="item !== '' && item !== null"
                          slot="reference"
                          :src="item"
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
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="联系方式:" prop="contactInfo">
                    <span>
                      {{ newList.contactInfo }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="申请时间:" prop="applyTime">
                    <span>
                      {{ newList.applyTime }}
                    </span>
                  </el-form-item>
                </span>
                <span
                  class="base_dialog_condit"
                  v-if="newList.auditStatus != 0"
                >
                  <el-form-item label="审核时间:" prop="auditTime">
                    <span>
                      {{ newList.auditTime }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit" v-if="newList.auditStatus > 1">
                  <el-form-item label="退款操作时间:" prop="refundTime">
                    <span>
                      {{ newList.refundTime }}
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="状态:" prop="auditStatus">
                    <span class="content">
                      <span v-show="newList.auditStatus == 0" class="offLine">
                        待审核</span
                      >
                      <span v-show="newList.auditStatus == 1" class="offLine">
                        审核通过待退款</span
                      >
                      <span v-show="newList.auditStatus == -1" class="offLine">
                        审核不通过</span
                      >
                      <span v-show="newList.auditStatus == 2" class="offLine">
                        已退款</span
                      >
                    </span>
                  </el-form-item>
                </span>
                <span class="base_dialog_condit" v-if="newList.auditStatus < 0">
                  <el-form-item label="不通过原因:" prop="rejectReason">
                    <span>
                      {{ newList.rejectReason }}
                    </span>
                  </el-form-item>
                </span>
              </div>
            </div>
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
      :modal="false"
    >
      <div class="base_dialog_main_content">
        <el-form :model="newList" ref="userForm" :rules="rules">
          <div class="base_dialog_main_content">
            <div class="base_dialog_main_left" style="padding:20px 80px">
              <span class="base_dialog_condit2" style="">
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
          ><el-button type="danger" @click="closeDialog2">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryRefundApplicationDetail, //退款申请审核detail单条查询
  auditRefundApplication //退款申请审核/批量审核
} from "@/api/operationManagement";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      title: "详情",
      isShow: false,
      curId: null,
      newList: {
        vehicle: "", //车牌号:
        vehicleType: "", //车辆类型:
        phone: "", //车主手机号:
        name: "", //车主姓名:
        idcard: "", //车主身份证:
        park: "", //停车场
        status: null, //状态 1使用中 0禁用 -1过期  2未开始 3未开始封禁
        payTime: "", //支付时间
        beginTime: "", //长租开始时间
        dueTime: "" //长租结束时间
      }, //详情
      rules: {
        rejectReason: [
          { required: true, message: "请输入不通过原因描述", trigger: "blur" }
        ]
      },

      dialogFormVisible: false //不同意弹窗
    };
  },
  created() {},
  methods: {
    //打开弹窗
    showDialog(item, type) {
      this.isShow = true;
      this.pageType = type;
      if (type == 1) {
        this.title = "详情";
      } else {
        this.title = "审核";
      }
      this.getDetials(item);
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
      arr.push(this.curId);
      let para = {
        ids: arr,
        rejectReason: ""
      };
      let text = "确认审核通过该申请吗?";
      this.$confirm(text, "提示", {
        type: "warning"
      }).then(() => {
        this.isShow = false;
        auditRefundApplication(para).then(response => {
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
          arr.push(this.curId);

          let para = {
            ids: arr,
            rejectReason: this.newList.rejectReason
          };
          let text = "确认审核不通过该申请吗?";
          this.$confirm(text, "提示", {
            type: "warning"
          }).then(() => {
            auditRefundApplication(para)
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
    getDetials(item) {
      this.curId = item.id;
      let para = { id: item.id, orderNum: item.orderNum };
      queryRefundApplicationDetail(para).then(response => {
        this.newList = response.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.refundApplicationReview_dialog {
  padding: 20px;
  .refundApplicationReview_dialog_con {
    height: 200px;
    margin-top: 10px;
    .refundApplicationReview_dialog_con_title {
      height: 25px;
      line-height: 25px;
      border-left: 4px solid #037659;
      padding-left: 15px;
      color: #037659;
    }
    .refundApplicationReview_dialog_con_content {
      min-height: 160px;
      margin: 20px;
      padding: 0 40px;
      border-bottom: 1px solid #e8f2f1;
      display: flex;
      justify-content: space-around;
      .refundApplicationReview_dialog_con_content_box {
        flex: 1;
      }
    }
  }
}
.base_dialog_condit {
  display: block;
  height: 40px;
  width: 100%;
  // overflow: hidden;
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
