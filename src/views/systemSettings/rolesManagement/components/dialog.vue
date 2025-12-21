<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" :rules="rules" ref="roleForm">
        <div
          class="base_dialog_main_content"
          style="height:calc(100vh - 200px)"
        >
          <div
            class="base_dialog_main_left"
            style="max-width: 80%;padding:28px "
          >
            <span class="base_dialog_condit">
              <el-form-item label="角色名称" prop="roleName">
                <span
                  class="base_dialog_condit_text"
                  v-if="pageType == 2 || pageType == 3"
                >
                  {{ newList.roleName }}
                </span>
                <el-input
                  v-else
                  v-model="newList.roleName"
                  placeholder="输入角色名"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="角色类型" prop="rightType">
                <el-radio-group
                  v-model="newList.rightType"
                  :disabled="pageType == 3"
                  @change="onRightTypeChange"
                >
                  <el-radio :label="1">普通角色</el-radio>
                  <el-radio :label="2">商户角色</el-radio>
                </el-radio-group>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="功能权限" prop="resourceIdList">
                <span style="display: inline-block;width: 72%">
                  <el-input
                    v-show="false"
                    v-model="newList.resourceIdList"
                    placeholder="请输入"
                    class="filter-item"
                    size="small"
                  />
                  <el-input
                    v-model="filterText"
                    placeholder="请输入"
                    class="filter-item"
                    size="small"
                  />
                  <div class="reloBox">
                    <el-tree
                      class="filter-tree rloe-tree"
                      :data="roleList"
                      :props="defaultProps"
                      node-key="resourceId"
                      label="resCanme"
                      show-checkbox
                      @check="checkTree"
                      default-expand-all
                      :filter-node-method="filterNode"
                      ref="tree"
                    >
                    </el-tree>
                  </div>
                </span>
              </el-form-item>
            </span>
            <span
              class="base_dialog_condit"
              v-show="newList.rightType !== 2"
            >
              <el-form-item label="数据权限" prop="parkingLots">
                <span style="display: inline-block;width: 72%">
                  <el-input
                    v-model="filterText2"
                    placeholder="请输入"
                    class="filter-item"
                    size="small"
                  />
                  <div class="reloBox">
                    <el-table
                      :data="
                        parkingList.filter(
                          data =>
                            !filterText2 ||
                            data.name
                              .toLowerCase()
                              .includes(filterText2.toLowerCase())
                        )
                      "
                      size="mini"
                      height="278px"
                      class="parkingTable"
                      ref="reloTable"
                      row-key="id"
                      @selection-change="handleSelectionChange"
                      style="width: 100%"
                      :header-cell-class-name="setClassName"
                      ><el-table-column
                        type="selection"
                        :selectable="checkSelectable"
                        :reserve-selection="true"
                        width="55"
                      >
                      </el-table-column>
                      <el-table-column label="停车场名称" prop="name">
                      </el-table-column>
                      <el-table-column label="停车场编号" prop="id">
                      </el-table-column>
                    </el-table>
                  </div>
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="状态" prop="status">
                <el-radio-group
                  v-model="newList.status"
                  :disabled="pageType == 3"
                >
                  <el-radio label="0">正常</el-radio>
                  <el-radio label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="描述" prop="remark">
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
            <div class="base_dialog_main_btnBox" v-if="pageType < 3">
              <el-button type="info" @click="toSave">保存</el-button
              ><el-button type="danger" @click="closeDialog">取消</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  roleCheckName, //检查角色名是否存在
  roleDetail, //角色详情
  roleInsert, //新增角色
  roleUpdate, //修改角色
  resourceTree //全部菜单树
} from "@/api/systemset";
import {
  lotSelectAll //获取车场下拉框
} from "@/api/yardManagement";

export default {
  components: {},
  data() {
    const validateRoleName = (rule, value, callback) => {
      if (this.editroleName !== value) {
        let para = {
          roleName: value
        };
        roleCheckName(para).then(response => {
          if (response.data === 1) {
            callback(new Error("角色名已存在"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    const validatecurParkings = (rule, value, callback) => {
      // 商户角色无数据权限，直接通过校验
      if (this.newList && this.newList.rightType === 2) {
        callback();
        return;
      }
      if (value && value.length) {
        callback();
      } else {
        callback(new Error("请选择数据权限"));
      }
    };

    return {
      pageType: 1,
      filterText: "",
      filterText2: "",
      title: "新增",
      isShow: false,
      editroleName: null, //编辑角色名
      newList: {
        roleName: null, //角色名
        rightType: 1, // 角色类型：1 普通角色，2 商户角色
        status: "0", //状态 0-正常 1-禁用
        resourceList: [], //资源列表
        parkingLots: [], //数据权限
        resourceIdList: "", //资源id列表
        remark: "", //描述
        roleId: "" //角色ID
      }, //车位详情
      selected: [], //选中数据权限存储
      normalParkingLotsBackup: [], // 普通角色下的数据权限备份
      defaultProps: {
        value: "resourceId", // id
        label: "resCanme", // 名
        children: "children" // 子节点字段名
      },
      roleList: [],
      parkingList: [],
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_-]{1,10}$/,
            message: "请输入10以内字符，且不含特殊字符",
            trigger: "blur"
          },
          {
            required: true,
            message: "角色名已存在",
            trigger: "blur",
            validator: validateRoleName
          }
        ],
        rightType: [
          { required: true, message: "请选择角色类型", trigger: "change" }
        ],
        resourceIdList: [
          { required: true, message: "请选择功能权限", trigger: "change" }
        ],
        parkingLots: [
          {
            required: true,
            message: "请选择数据权限",
            trigger: "change",
            validator: validatecurParkings
          }
        ],
        remark: [
          {
            required: true,
            message: "请输入描述，内容不超过200字符",
            trigger: "blur"
          }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getFieldTable();
    this.getparking();
  },
  methods: {
    getparking() {
      lotSelectAll().then(response => {
        this.parkingList = response.data;
      });
    },

    getFieldTable() {
      let para = {};
      if (this.newList && this.newList.rightType != null) {
        para.rightType = this.newList.rightType;
      }
      return resourceTree(para)
        .then(response => {
          this.roleList = response.data;
          // 新增商户角色时，功能权限树默认全部选中
          this.$nextTick(() => {
            if (
              this.$refs.tree &&
              this.pageType === 1 &&
              this.newList &&
              this.newList.rightType === 2 &&
              (!this.newList.resourceIdList || this.newList.resourceIdList.length === 0)
            ) {
              const allKeys = this.getAllResourceIds(this.roleList);
              if (allKeys && allKeys.length) {
                this.$refs.tree.setCheckedKeys(allKeys);
                this.newList.resourceIdList = allKeys.toString();
              }
            }
          });
        })
        .catch(() => {});
    },
    //选择数据权限
    handleSelectionChange(list) {
      this.newList.parkingLots = list;
      // 仅在普通角色下更新备份，便于切换角色类型后恢复
      if (this.newList && this.newList.rightType === 1) {
        this.normalParkingLotsBackup = list.slice();
      }
    },
    //默认选择数据权限
    selectChange() {
      let parkingLots = this.newList.parkingLots || [];
      let list = [];
      parkingLots.forEach(el => {
        list.push(el.id);
      });
      let arr = this.parkingList.filter(e => list.includes(e.id));
      if (!this.$refs.reloTable) return;
      // 先清空原有选择，再按 id 幂等地设置为选中，避免重复调用时把已选行反选掉
      this.$refs.reloTable.clearSelection();
      if (arr && arr.length) {
        arr.forEach(el => {
          this.$refs.reloTable.toggleRowSelection(el, true);
        });
      }
    },
    // 获取整棵功能权限树下的所有资源ID（用于商户角色默认全选）
    getAllResourceIds(nodes) {
      const ids = [];
      const dfs = list => {
        if (!list) return;
        list.forEach(item => {
          if (item.resourceId) {
            ids.push(item.resourceId);
          }
          if (item.children && item.children.length) {
            dfs(item.children);
          }
        });
      };
      dfs(nodes || []);
      return ids;
    },
    // 角色类型变更时处理：重新加载功能权限树；
    // 新增场景下普通角色切换为商户角色时，功能权限树默认全选；
    // 编辑场景下切换为商户角色时，不全选，仅保留已有权限；
    // 从商户切回普通角色时，重新应用已保存的数据权限选择。
    onRightTypeChange() {
      this.getFieldTable().then(() => {
        this.$nextTick(() => {
          // 仅在新增场景下，且尚未选择任何功能权限时，切换为商户角色才默认全选
          if (
            this.pageType === 1 &&
            this.newList &&
            this.newList.rightType === 2 &&
            this.$refs.tree &&
            (!this.newList.resourceIdList || this.newList.resourceIdList.length === 0)
          ) {
            const allKeys = this.getAllResourceIds(this.roleList);
            if (allKeys && allKeys.length) {
              this.$refs.tree.setCheckedKeys(allKeys);
              this.newList.resourceIdList = allKeys.toString();
            }
          }
          // 当从商户切回普通角色（rightType === 1）时，恢复表格中的勾选状态
          if (this.newList && this.newList.rightType === 1 && this.$refs.reloTable) {
            // 使用备份的数据权限恢复 newList.parkingLots，再根据 id 重新勾选
            if (this.normalParkingLotsBackup) {
              this.newList.parkingLots = this.normalParkingLotsBackup.slice();
            }
            this.selectChange();
          }
        });
      });
    },
    checkSelectable() {
      let res = true;
      if (this.pageType == 3) {
        res = false;
      }
      return res;
    },
    setClassName() {
      let res = "";
      if (this.pageType == 3) {
        res = "all-disabled";
      }
      return res;
    },
    //选权限
    checkTree(a, b) {
      let keys = b.checkedKeys.toString();
      this.newList.resourceIdList = keys;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.resCanme.indexOf(value) !== -1;
    },
    //打开注册、编辑角色弹窗
    showDialog(e, pageType) {
      this.isShow = true;
      this.filterText = "";
      this.filterText2 = "";
      this.pageType = pageType;
      if (this.$refs["roleForm"]) {
        this.$refs["roleForm"].resetFields();
      }

      if (pageType == 2) {
        this.title = "编辑";
        this.getDetials(e);
        this.defaultProps = {
          value: "resourceId", // id
          label: "resCanme", // 名
          children: "children", // 子节点字段名
          disabled: () => {
            return false;
          }
        };
      } else if (pageType == 3) {
        this.title = "详情";
        this.getDetials(e);
        this.defaultProps = {
          value: "resourceId", // id
          label: "resCanme", // 名
          children: "children", // 子节点字段名
          disabled: () => {
            return true;
          }
        };
      } else {
        this.title = "新增";
        this.newList = {
          roleName: null, //角色名
          rightType: 1, // 角色类型：1 普通角色，2 商户角色
          status: "0", //状态 0-正常 1-禁用
          resourceList: [], //资源列表
          parkingLots: [], //数据权限
          resourceIdList: "", //资源id列表
          remark: "", //描述
          roleId: "" //角色ID
        };
        this.normalParkingLotsBackup = [];
        this.editroleName = null;
        this.defaultProps = {
          value: "resourceId", // id
          label: "resCanme", // 名
          children: "children", // 子节点字段名
          disabled: () => {
            return false;
          }
        };

        if (this.$refs["roleForm"]) {
          this.$nextTick(() => {
            this.$refs["roleForm"].clearValidate();
          });
        }
      }

      // 每次打开弹窗，根据当前角色类型加载功能权限树
      this.getFieldTable();
    },
    //获取详情
    getDetials(e) {
      let para = { roleId: e.roleId };
      roleDetail(para).then(response => {
        this.newList = response.data;
        // 确保 rightType 为数字类型，方便与 el-radio 的数值 label 匹配
        if (this.newList && this.newList.rightType != null) {
          this.newList.rightType = Number(this.newList.rightType);
        } else {
          // 默认普通角色
          this.newList.rightType = 1;
        }
        // 初始化普通角色数据权限备份
        this.normalParkingLotsBackup = (this.newList.parkingLots || []).slice();
        this.editroleName = response.data.roleName;
        // 根据角色类型重新加载功能权限树，并设置选中项
        this.getFieldTable().then(() => {
          let list = this.getResourceList(response.data.resourceList);
          this.$set(this.newList, "resourceIdList", list.toString());
          this.$refs.tree.setCheckedKeys(list);
          setTimeout(() => {
            this.selectChange();
          }, 300);
        });
      });
    },
    getResourceList(arr) {
      let list = [];
      arr.forEach(el => {
        list = list.filter(item => item !== el.parentId);
        list.push(el.resourceId);
      });
      return list;
    },
    //关闭新增/编辑角色弹窗
    closeDialog() {
      this.isShow = false;
      this.$emit("openLoading", {});
      this.$emit("getList", {});
    },
    //点击保存按钮
    toSave() {
      let arr = this.$refs.tree.getCheckedNodes(false, true);
      this.newList.resourceList = arr;
      if (this.pageType == 1) {
        this.toAdd();
      } else {
        this.toEidt();
      }
    },
    //添加角色
    toAdd() {
      this.$refs["roleForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存角色信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            // 复制一份参数，避免直接修改表单模型
            let para = { ...this.newList };
            // 商户角色不提交数据权限
            if (para.rightType === 2) {
              para.parkingLots = [];
            }
            para.roleIds = [para.roleId];
            roleInsert(para)
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
    //修改角色
    toEidt() {
      this.$refs["roleForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的角色信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            // 复制一份参数，避免直接修改表单模型
            let para = { ...this.newList };
            // 商户角色不提交数据权限
            if (para.rightType === 2) {
              para.parkingLots = [];
            }
            para.roleIds = [para.roleId];
            roleUpdate(para)
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
.reloBox {
  margin-top: 5px;
  height: 300px;
  // width: 800px;
  border: 1px solid #dcdfe6;
  padding: 10px;
  overflow: auto;
}
.user_condit_text {
  height: 40px;
  line-height: 40px;
  color: #ccc;
  padding-left: 120px;
}
</style>
<style lang="scss">
.all-disabled .el-checkbox__input .el-checkbox__inner {
  background-color: #edf2fc !important;
  border-color: #dcdfe6 !important;
  cursor: not-allowed !important;
}
</style>
