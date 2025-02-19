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
              <el-form-item label="车主身份证：" prop="idcard">
                <span class="base_dialog_condit_text">
                  {{ newList.idcard }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="停车场名称：" prop="idcard">
                <span class="base_dialog_condit_text">
                  {{ newList.park }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="长租时间：" prop="idcard">
                <span class="base_dialog_condit_text">
                  {{ newList.beginTime }} - {{ newList.dueTime }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="状态：" prop="auditType">
                <span class="content">
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
                  <span class="onLine_ball" v-show="newList.status == 1"></span>
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
                    v-show="newList.status == 3"
                  ></span>
                  <span v-show="newList.status == 3" class="offLine">
                    未开始</span
                  >
                  <span v-show="newList.status == 3" class="errLine">
                    (已禁用)</span
                  >
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="支付时间：" prop="idcard">
                <span class="base_dialog_condit_text">
                  {{ newList.payTime }}
                </span>
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  vehiclesGetInfo //月租车辆详情
} from "@/api/operationManagement";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      title: "详情",
      isShow: false,
      newList: {
        vehicle: "", //车牌号：
        vehicleType: "", //车辆类型：
        phone: "", //车主手机号：
        name: "", //车主姓名：
        idcard: "", //车主身份证：
        park: "", //停车场
        status: null, //状态 1使用中 0禁用 -1过期  2未开始 3未开始封禁
        payTime: "", //支付时间
        beginTime: "", //长租开始时间
        dueTime: "" //长租结束时间
      } //详情
    };
  },
  created() {},
  methods: {
    //打开弹窗
    showDialog(id, type) {
      this.isShow = true;
      this.pageType = type;
      this.getDetials(id);
    },

    //关闭弹窗
    closeDialog() {
      this.isShow = false;
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
}
</style>
