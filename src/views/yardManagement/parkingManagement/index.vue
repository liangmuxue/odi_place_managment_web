<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.name" placeholder="请输入">
          <!-- <div slot="prepend">停车场</div> -->
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">区域地址</div>
        <Cascader
          ref="treedata"
          v-model="listQuery.address"
          style="width:100%;"
          @selectAddress="selectAddress"
        ></Cascader>

        <!-- <el-input v-model="listQuery.code" placeholder="请输入">
          <div slot="prepend">区域地址</div>
        </el-input> -->
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
        v-has="{ red: 'parkingAdd', type: 1 }"
        >新增</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        @click="toDel"
        v-has="{ red: 'parkingDelete', type: 1 }"
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
        <el-table-column type="selection" width="34"></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="停车场编号"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="停车场名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="区域地址"
          min-width="160px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" min-width="90px" align="center">
          <template slot-scope="scope">
            <div class="content">
              {{ scope.row.phone }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总车位数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="营业时间"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content"
              >{{ scope.row.startTime }}-{{ scope.row.endTime }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          label="是否支持充电"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-show="scope.row.charge == 0"> 不支持</span>
            <span v-show="scope.row.charge == 1"> 支持</span>
          </template>
        </el-table-column>
        <el-table-column
          label="运营商网络"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.operator }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="长租车位保障临界值"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.criticalValue }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
          header-align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              @click="toEdit(scope.row)"
              v-has="{ red: 'parkingEdit', type: 1 }"
            >
              编辑
            </span>
            <span
              class="operation_button delete_btn"
              @click="toDetails(scope.row)"
              v-has="{ red: 'parkingDetails', type: 1 }"
            >
              详情
            </span>
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
import Cascader from "@/components/Cascader/cascader_region.vue";

import {
  parkingList, //车场分页查询
  parkingDelete //删除停车场
} from "@/api/yardManagement";
import Dialog from "./components/dialog";

export default {
  name: "ParkingManagement",
  components: { Dialog, Cascader },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        name: "",
        address: ""
      },
      selGateway: null,
      listLoading: false, //加载
      list: [] //信息
    };
  },
  created() {
    this.toSearchList();
  },
  methods: {
    //查询车场列表
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
        name: "",
        address: ""
      };
      this.$refs.treedata.resetChecked();
      this.openLoading();
      this.getList();
    },
    //选择区域地址
    selectAddress(data) {
      this.listQuery.address = data;
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

    //获取车场列表
    getList() {
      let para = this.listQuery;
      parkingList(para)
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

    //打开添加车场
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
          arr.push(el.id);
        });
        let text = "确认批量删除停车场吗?";
        if (this.selGateway.length == 1) {
          text = "确认删除该停车场吗?";
        }

        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          parkingDelete(arr.toString()).then(response => {
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
          message: "请选择删除的停车场"
        });
      }
    },

    //打开编辑停车场
    toEdit(e) {
      let id = e.id;
      let pageType = 2;
      this.$refs.dialog.showDialog(id, pageType);
    },
    //打开停车场详情
    toDetails(e) {
      let id = e.id;
      let pageType = 3;
      this.$refs.dialog.showDialog(id, pageType);
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
  width: 45px;
  margin: 0 2px;
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
