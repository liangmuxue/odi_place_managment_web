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
          <div class="base_dialog_main_left" style="padding:100px">
            <span class="user_condit_text" v-if="pageType == 1">
              默认初始密码为123456，可自行修改
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="用户名" prop="userName">
                <span class="base_dialog_condit_text" v-if="pageType == 2">
                  {{ newList.userName }}
                </span>
                <el-input
                  v-else
                  v-model="newList.userName"
                  placeholder="输入用户名"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="真实姓名" prop="nickName">
                <el-input
                  v-model="newList.nickName"
                  placeholder="输入真实姓名"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="角色" prop="roleId">
                <el-select
                  v-model="newList.roleId"
                  placeholder="选择角色"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="备注" prop="remark">
                <el-input
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
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="newList.status">
                  <el-radio label="0">启用</el-radio>
                  <el-radio label="1">停用</el-radio>
                </el-radio-group>
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
  roleGetAll, //查询所有角色
  userCheckLoginName, //检查用户名存在
  userInsert, //新增用户
  userUpdate //编辑用户
} from "@/api/systemset";

export default {
  components: {},
  data() {
    const validateEditUserName = (rule, value, callback) => {
      if (this.editUserName !== value) {
        let para = {
          userName: value
        };
        userCheckLoginName(para).then(response => {
          if (response.data === 1) {
            callback(new Error("用户名已存在"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      editUserName: null, //编辑泊位号
      editGeomagnetismId: null, //编辑地磁编号
      newList: {
        userName: null, //用户名
        roleIds: [], //角色ID
        roleId: "", //角色ID
        status: "0", //状态 0-正常 1-停用
        remark: "", //备注
        nickName: "" //真实姓名
      }, //详情
      roleList: [],
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9_\-]{4,16}$/,
            message:
              "用户名只能为英文字母、数字、下划线或者短横线组成并且长度为4-16",
            trigger: "blur"
          },
          {
            required: true,
            message: "用户名已存在",
            trigger: "blur",
            validator: validateEditUserName
          }
        ],
        nickName: [
          { required: true, message: "请选择真实姓名", trigger: "blur" }
        ],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getFieldTable();
  },
  methods: {
    getFieldTable() {
      let para = { isConditionQuery: 0 };
      roleGetAll(para)
        .then(response => {
          this.roleList = response.data;
        })
        .catch(() => {});
    },
    //打开注册、编辑用户弹窗
    showDialog(e, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      if (this.$refs["userForm"]) {
        this.$refs["userForm"].resetFields();
      }

      if (pageType == 2) {
        this.title = "编辑";
        this.getDetials(e);
      } else {
        this.title = "新增";
        this.newList = {
          userName: null, //用户名
          roleIds: [], //角色ID
          roleId: "", //角色ID
          status: "0", //状态 0-正常 1-停用
          remark: "", //备注
          nickName: "" //真实姓名
        };
        this.editUserName = null;
        if (this.$refs["userForm"]) {
          this.$nextTick(() => {
            this.$refs["userForm"].clearValidate();
          });
        }
      }
    },
    //获取详情
    getDetials(e) {
      this.newList = e;
      this.newList.roleId = e.roles[0].roleId;
      this.editUserName = e.userName;
    },
    //关闭新增/编辑用户弹窗
    closeDialog() {
      this.isShow = false;
      this.$emit("openLoading", {});
      this.$emit("getList", {});
    },
    //点击保存按钮
    toSave() {
      if (!this.newList.userId) {
        this.toAdd();
      } else {
        this.toEidt();
      }
    },
    //添加用户
    toAdd() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存用户信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            para.roleIds = [para.roleId];
            userInsert(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                  // this.getDetials(response.id);
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
        }
      });
    },
    //编辑用户
    toEidt() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的用户信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            para.roleIds = [para.roleId];
            userUpdate(para)
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
</style>
