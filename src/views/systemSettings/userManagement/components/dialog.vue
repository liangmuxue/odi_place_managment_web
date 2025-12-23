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
                  @change="onRoleChange"
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

            <span
              class="base_dialog_condit"
              v-if="isMerchantRole"
            >
              <el-form-item label="数据权限" prop="merchantId">
                <span style="display: inline-block;width: 72%">
                  <el-input
                    v-model="merchantFilterText"
                    placeholder="请输入商户名称"
                    class="filter-item"
                    size="small"
                  />
                  <div class="reloBox">
                    <el-table
                      :data="
                        merchantList.filter(
                          data =>
                            !merchantFilterText ||
                            (data.merchantName || '')
                              .toLowerCase()
                              .includes(merchantFilterText.toLowerCase())
                        )
                      "
                      size="mini"
                      height="278px"
                      class="parkingTable"
                      ref="merchantTable"
                      row-key="merchantId"
                      @selection-change="handleMerchantSelectionChange"
                      style="width: 100%"
                    >
                      <el-table-column
                        type="selection"
                        :reserve-selection="true"
                        width="55"
                      >
                      </el-table-column>
                      <el-table-column
                        label="商户名称"
                        prop="merchantName"
                      >
                      </el-table-column>
                      <el-table-column
                        label="商户编号"
                        prop="merchantId"
                      >
                      </el-table-column>
                    </el-table>
                  </div>
                </span>
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
import { merchantList } from "@/api/merchantManagement";

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
        nickName: "", //真实姓名
        merchantId: null // 商户ID（数据权限）
      }, //详情
      roleList: [],
      merchantList: [],
      merchantFilterText: "",
      isMerchantRole: false,
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9_-]{4,16}$/,
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
        merchantId: [
          {
            required: true,
            message: "请选择数据权限",
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!this.isMerchantRole) {
                callback();
              } else if (value) {
                callback();
              } else {
                callback(new Error("请选择数据权限"));
              }
            }
          }
        ],
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
    onRoleChange(val) {
      const role = this.roleList.find(item => item.roleId === val);
      const rightType = role && role.rightType != null ? Number(role.rightType) : 1;
      this.isMerchantRole = rightType === 2;
      if (this.isMerchantRole) {
        this.loadMerchantList();
      } else {
        this.newList.merchantId = null;
      }
    },
    loadMerchantList() {
      if (this.merchantList && this.merchantList.length) {
        this.$nextTick(() => {
          this.restoreMerchantSelection();
        });
        return;
      }
      const para = {
        pageNum: 1,
        pageSize: 1000
      };
      merchantList(para)
        .then(response => {
          this.merchantList = response.rows || [];
          this.$nextTick(() => {
            this.restoreMerchantSelection();
          });
        })
        .catch(() => {});
    },
    handleMerchantSelectionChange(selection) {
      if (!selection || !selection.length) {
        // 不在这里清空 merchantId，避免由于表格重绘等间接原因导致用户已选择的数据权限被意外清空
        return;
      }
      if (selection.length === 1) {
        // 正常单选场景，直接记录当前选中行
        this.newList.merchantId = selection[0].merchantId;
        return;
      }
      // 多选时，只保留最后一次选中的一行，实现单选效果
      const latest = selection[selection.length - 1];
      this.newList.merchantId = latest.merchantId;
      if (!this.$refs.merchantTable) return;
      this.$nextTick(() => {
        if (!this.$refs.merchantTable) return;
        this.$refs.merchantTable.clearSelection();
        this.$refs.merchantTable.toggleRowSelection(latest, true);
      });
    },
    restoreMerchantSelection() {
      if (!this.$refs.merchantTable || !this.newList.merchantId) {
        return;
      }
      const row = this.merchantList.find(
        item => item.merchantId === this.newList.merchantId
      );
      if (row) {
        this.$nextTick(() => {
          if (!this.$refs.merchantTable) return;
          this.$refs.merchantTable.clearSelection();
          this.$refs.merchantTable.toggleRowSelection(row, true);
        });
      }
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
          nickName: "", //真实姓名
          merchantId: null // 商户ID（数据权限）
        };
        this.isMerchantRole = false;
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
      this.newList.merchantId = e.merchantId || null;
      this.editUserName = e.userName;
      this.$nextTick(() => {
        this.onRoleChange(this.newList.roleId);
      });
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
.reloBox {
  margin-top: 5px;
  height: 300px;
  border: 1px solid #dcdfe6;
  padding: 10px;
  overflow: auto;
}
</style>
