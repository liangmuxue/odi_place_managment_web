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
              <el-form-item label="用户ID：" prop="id">
                <span class="base_dialog_condit_text">
                  {{ newList.id }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="手机：" prop="purePhoneNumber">
                <span class="base_dialog_condit_text">
                  {{ newList.purePhoneNumber }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="昵称：" prop="nickname">
                <span class="base_dialog_condit_text">
                  {{ newList.nickname }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="头像：" prop="avatar">
                <el-popover placement="top-start" width="500" trigger="click">
                  <img
                    :src="newList.avatar ? newList.avatar : newList.avatar"
                    width="100%"
                  />
                  <img
                    v-if="newList.avatar !== '' && newList.avatar !== null"
                    slot="reference"
                    :src="
                      newList.avatar + '?x-oss-process=image/resize,h_36,w_48'
                    "
                    width="48"
                    height="36"
                  />
                  <span v-else>
                    <div min-width="48" height="36"></div>
                  </span>
                </el-popover>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="注册时间：" prop="createTime">
                <span class="base_dialog_condit_text">
                  {{
                    newList.createTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                  }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="最后登录时间：" prop="lastLoginTime">
                <span class="base_dialog_condit_text">
                  {{
                    newList.lastLoginTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                  }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="绑定车辆数：" prop="bindVehicleNum">
                <span class="base_dialog_condit_text">
                  {{ newList.bindVehicleNum }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="已绑认证车数：" prop="authVehicleNum">
                <span class="base_dialog_condit_text">
                  {{ newList.authVehicleNum }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="开通钱包：" prop="hasPurse">
                <span class="base_dialog_condit_text">
                  {{ newList.hasPurse == 1 ? "是" : "否" }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="签约免密支付：" prop="noPasswordPay">
                <span class="base_dialog_condit_text">
                  {{ newList.noPasswordPay == 1 ? "是" : "否" }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="钱包余额(元)：" prop="balance">
                <span class="base_dialog_condit_text">
                  {{ newList.balance }}
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
  wxUserDetail //小程序用户列表
} from "@/api/operationManagement";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      newList: {
        parkingDirection: null, //车位方向 0-上行 1-下行 2-左行 3-右行
        parkingLotId: "", //停车场id
        status: 1, //状态 0-离线 1-空闲  2-占用
        parkingSpaceId: "", //车位ID 泊位号
        geomagnetismId: "" //地磁ID
      } //车位详情
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
      wxUserDetail(para).then(response => {
        this.newList = response.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
