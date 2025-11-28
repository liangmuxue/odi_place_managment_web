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
            <span class="base_dialog_condit">
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
      if (value.length) {
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
        status: "0", //状态 0-正常 1-禁用
        resourceList: [], //资源列表
        parkingLots: [], //数据权限
        resourceIdList: "", //资源id列表
        remark: "", //描述
        roleId: "" //角色ID
      }, //车位详情
      selected: [], //选中数据权限存储
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
            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_\-]{1,10}$/,
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
      resourceTree(para)
        .then(response => {
          this.roleList = response.data;
        })
        .catch(() => {});
    },
    //选择数据权限
    handleSelectionChange(list) {
      this.newList.parkingLots = list;
    },
    //默认选择数据权限
    selectChange() {
      let parkingLots = this.newList.parkingLots;
      let list = [];
      parkingLots.forEach(el => {
        list.push(el.id);
      });
      let arr = this.parkingList.filter(e => list.includes(e.id));
      if (arr) {
        arr.forEach(el => {
          this.$refs.reloTable.toggleRowSelection(el);
        });
      } else {
        this.$refs.reloTable.clearSelection();
      }
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
          status: "0", //状态 0-正常 1-禁用
          resourceList: [], //资源列表
          parkingLots: [], //数据权限
          resourceIdList: "", //资源id列表
          remark: "", //描述
          roleId: "" //角色ID
        };
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
    },
    //获取详情
    getDetials(e) {
      let para = { roleId: e.roleId };
      roleDetail(para).then(response => {
        this.newList = response.data;
        this.editroleName = response.data.roleName;
        // this.validateRoleName = response.data.roleId;
        let list = this.getResourceList(response.data.resourceList);
        this.$set(this.newList, "resourceIdList", list.toString());
        this.$refs.tree.setCheckedKeys(list);
        setTimeout(() => {
          this.selectChange();
        }, 300);
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
            let para = this.newList;
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
            let para = this.newList;
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
