<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" :rules="rules" ref="userForm">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:100px 0">
            <span class="password_dialog_condit">
              <el-form-item
                :label="'请输入 ' + newList.userName + ' 的新密码'"
                prop="password"
              >
                <el-input
                  v-model="newList.password"
                  placeholder="请输入6-32个以内的字符，输入字符必须包含大小写、数字、特殊字符等三种以上组合"
                  style="width: 560px"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox">
        <el-button type="info" @click="toSave">保存</el-button
        ><el-button type="danger" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  userResetPwd //重置密码
} from "@/api/systemset";

export default {
  components: {},
  data() {
    return {
      pageType: 1,
      title: "重置密码",
      isShow: false,
      newList: {
        userId: null, //用户id
        password: "" //密码
      },
      rules: {
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()\-+=]{6,32}$/,
            message:
              "请输入6-32个以内的字符，输入字符必须包含大小写、数字、特殊字符等三种以上组合",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    //打开重置密码弹窗
    showDialog(e, pageType) {
      this.isShow = true;
      this.pageType = pageType;

      if (this.$refs["userForm"]) {
        this.$refs["userForm"].resetFields();
      }
      this.getDetials(e);
    },
    //获取详情
    getDetials(e) {
      this.newList = e;
      this.newList.password = "";
      this.newList.roleId = e.roles[0].roleId;
    },
    //关闭新增/编辑弹窗
    closeDialog() {
      this.isShow = false;
    },
    //点击保存按钮
    toSave() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认重置密码吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = {
              userId: this.newList.userId,
              password: this.newList.password
            };
            userResetPwd(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                } else {
                  // this.$message({
                  //   type: "error",
                  //   message: "提交失败"
                  // });
                }
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              })
              .catch(() => {
                // this.$message({
                //   type: "error",
                //   message: "提交失败"
                // });
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user_condit_text {
  height: 40px;
  line-height: 40px;
  color: #ccc;
  padding-left: 120px;
}
.el-form-item__label {
  width: 200px;
}
</style>
