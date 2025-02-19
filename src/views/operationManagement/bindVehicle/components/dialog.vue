<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      详情
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
              <el-form-item label="车牌号：" prop="vehicleNumber">
                <span class="base_dialog_condit_text">
                  {{ newList.vehicleNumber }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="手机：" prop="phone">
                <span class="base_dialog_condit_text">
                  {{ newList.phone }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车辆颜色：" prop="licensePlateColorName">
                <span class="base_dialog_condit_text">
                  {{ newList.licensePlateColorName }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车辆类型：" prop="vehicleTypeName">
                <span class="base_dialog_condit_text">
                  {{ newList.vehicleTypeName }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车辆品牌：" prop="vehicleBrandName">
                <span class="base_dialog_condit_text">
                  {{ newList.vehicleBrandName }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车身颜色：" prop="vehicleColorName">
                <span class="base_dialog_condit_text">
                  {{ newList.vehicleColorName }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="是否认证：" prop="isAuth">
                <span class="base_dialog_condit_text">
                  {{ newList.isAuth == 1 ? "是" : "否" }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="无感停车：" prop="nonParking">
                <span class="base_dialog_condit_text">
                  {{ newList.nonParking == 1 ? "已开通" : "未开通" }}
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
  systemVehicleDetail //绑定车辆详情
} from "@/api/operationManagement";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      isShow: false,
      newList: null //车位详情
    };
  },
  created() {},
  methods: {
    //打开弹窗
    showDialog(id) {
      this.isShow = true;
      this.getDetials(id);
    },
    //关闭弹窗
    closeDialog() {
      this.isShow = false;
    },

    //获取详情
    getDetials(id) {
      let para = { id: id };
      systemVehicleDetail(para).then(response => {
        this.newList = response.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
