<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">角色名称</div>
        <el-input v-model="listQuery.roleName" placeholder="请输入"> </el-input>
      </span>
      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>
    <div class="btn_box">
      <el-button
        type="info"
        icon="el-icon-circle-plus-outline"
        @click="toAdd"
        v-has="{ red: 'rolesAdd', type: 1 }"
        >新增</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        @click="toDel"
        v-has="{ red: 'rolesDelete', type: 1 }"
        >删除</el-button
      >
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 320px)"
        @selection-change="handleSelectionChange"
        align="left"
      >
        <el-table-column
          type="selection"
          width="34"
          :selectable="selectable"
        ></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          align="center"
          min-width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="角色类型"
          align="center"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">
              {{
                scope.row.rightType === 2
                  ? "商户角色"
                  : scope.row.rightType === 1
                  ? "普通角色"
                  : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.status == 1 ? "禁用" : "正常"
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="描述"
          align="center"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="权限菜单" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ getNames(scope.row.resourceList) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="创建时间"
          align="center"
          min-width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          min-width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              v-if="!scope.row.admin"
              class="operation_button update_btn"
              @click="toEdit(scope.row)"
              v-has="{ red: 'rolesEdit', type: 1 }"
            >
              编辑
            </span>
            <span
              class="operation_button update_btn"
              @click="toDetails(scope.row)"
              v-has="{ red: 'rolesDetails', type: 1 }"
            >
              详情
            </span>
            <!-- v-has="{ red: 'editBox', type: 1 }" -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="listQuery.pageNum"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="listQuery.pageSize"
        :total="listQuery.total"
        style="float: right;;margin: 10px"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <Dialog ref="dialog" @getList="getList" @openLoading="openLoading"></Dialog>
  </div>
</template>

<script>
import {
  roleList, //角色分页查询
  roleDeleteRole //删除用户
} from "@/api/systemset";
import Dialog from "./components/dialog";

export default {
  name: "RolesManagement",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        roleName: "" //角色名
      },
      selGateway: null,
      statusList: [
        { enumName: "正常", enumValue: 0 },
        { enumName: "停用", enumValue: 1 }
      ],
      Dictionaries: {
        enumTypes: "STATUS"
      },
      enumsData: {}, //字典表返回数据
      listLoading: false, //加载
      list: [] //信息
    };
  },
  created() {
    this.toSearchList();
  },
  methods: {
    //判断超级管理员不可选
    selectable(e) {
      return !e.admin;
    },
    //查询角色列表
    toSearchList() {
      this.listQuery.pageNum = 1;
      this.openLoading();
      this.getList();
    },
    //重置查询条件
    resetList() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        roleName: "" //角色名
      };
      this.openLoading();
      this.getList();
    },
    openLoading() {
      let claeeName;
      if (this.$store.getters.sidebar.opened) {
        claeeName = "hasSidebar";
      } else {
        claeeName = "noSidebar";
      }
      this.listLoading = this.$loading({
        lock: true,
        text: "数据加载中...",
        customClass: claeeName, // *这里设置他的class名称,这里最重要
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    //获取菜单权限列表
    getNames(list) {
      let arr = list.map(r => r.resCanme);
      return arr.toString();
    },
    //获取角色列表
    getList() {
      let para = this.listQuery;
      roleList(para)
        .then(response => {
          this.list = response.rows;
          if (response.total > 0) {
            this.listQuery.total = response.total; // 数据总条数
          } else {
            this.listQuery.pageSize = 40; //每页数量
            this.listQuery.total = 0; // 数据总条数
            this.listQuery.pageNum = 1; // 当前页
          }
          this.total = response.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        })
        .catch(() => {
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        });
    },

    //打开添加角色
    toAdd() {
      let id = null;
      let pageType = 1;
      this.$refs.dialog.showDialog(id, pageType);
    },

    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },

    //批量删除
    toDel() {
      if (this.selGateway.length > 0) {
        let arr = [];
        this.selGateway.forEach(el => {
          arr.push(el.roleId);
        });
        let text = "确认批量删除角色吗?";
        if (this.selGateway.length == 1) {
          text = "确认删除该角色吗?";
        }

        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          let para = {
            roleId: arr.toString()
          };
          roleDeleteRole(para).then(response => {
            if (response.code == "200") {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.openLoading();
              this.getList();
            } else {
              // this.$message({
              //   type: "error",
              //   message: "删除失败"
              // });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择删除角色"
        });
      }
    },

    //打开编辑角色
    toEdit(e) {
      let pageType = 2;
      this.$refs.dialog.showDialog(e, pageType);
    },
    //打开角色详情
    toDetails(e) {
      let pageType = 3;
      this.$refs.dialog.showDialog(e, pageType);
    },
    // 切换页码方法
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.openLoading();
      this.getList();
    },
    // 切换每页显示的方法
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.openLoading();
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.commit_page {
  position: relative;
}
.content_box {
  .content_row {
    position: relative;
    height: 32px;
    line-height: 32px;
    .content_boxId {
      color: #8c8787;
      font-size: 14px;
      font-weight: bold;
    }
    .content_num {
      color: #8c8787;
      font-size: 12px;
      font-weight: bold;
    }
    .content_title {
      color: rgba($color: #828484, $alpha: 0.5);
      font-size: 14px;
      padding-right: 5px;
    }
  }
}

.operation_button {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin: 0 5px;
  cursor: pointer;
  text-align: center;
  i {
    margin-right: 2px;
  }
  .circle {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 9px;
    border: 1px solid #6ca6e8;
    font-size: 12px;
  }
}
</style>
