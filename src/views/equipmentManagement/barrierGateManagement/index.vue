<template>
  <div class="parkingManagement_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">道闸类型</div>
        <el-select
          v-model="listQuery.type"
          placeholder="选择道闸类型"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in typeList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title">道闸名称</div>
        <el-input v-model="listQuery.name" placeholder="请输入"> </el-input>
      </span>
      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>
    <div class="btn_box">
      <el-button type="info" icon="el-icon-circle-plus-outline" @click="toAdd"
        >添加</el-button
      >
      <!-- v-has="{ red: 'addBox', type: 1 }" -->
      <el-button type="danger" icon="el-icon-circle-plus-outline" @click="toDel"
        >删除</el-button
      >
      <!-- v-has="{ red: 'deleteBox', type: 1 }" -->
      <el-button type="info" icon="el-icon-unlock" @click="openDoor"
        >远程开闸</el-button
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
          label="停车场名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="道闸编号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="道闸名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="设备序列号"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.equipmentNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="道闸类型" min-width="90px" align="center">
          <template slot-scope="scope">
            <div class="content">
              {{ getType(scope.row.type) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="道闸IP" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在线状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="offLine_ball" v-show="scope.row.online == 0"></span>
            <span v-show="scope.row.online == 0" class="offLine"> 离线</span>
            <span class="onLine_ball" v-show="scope.row.online == 1"></span>
            <span v-show="scope.row.online == 1" class="onLine"> 在线</span>
          </template>
        </el-table-column>
        <el-table-column
          label="辅助相机序列号"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.cameraNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="辅助相机IP"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.cameraIp }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="辅机在线状态"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              class="offLine_ball"
              v-show="scope.row.cameraOnline == 0"
            ></span>
            <span v-show="scope.row.cameraOnline == 0" class="offLine">
              离线</span
            >
            <span
              class="onLine_ball"
              v-show="scope.row.cameraOnline == 1"
            ></span>
            <span v-show="scope.row.cameraOnline == 1" class="onLine">
              在线</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          min-width="160px"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span>
              <el-button
                type="info"
                v-if="scope.row.online == 1"
                icon="el-icon-unlock"
                @click="openDoor"
                size="mini"
                >一键常开</el-button
              >
              <el-button
                type="danger"
                v-else
                icon="el-icon-lock"
                @click="openDoor"
                size="mini"
                >取消常开</el-button
              >
            </span>

            <span
              class="operation_button update_btn"
              @click="toEdit(scope.row)"
            >
              编辑
            </span>
            <!-- v-has="{ red: 'editBox', type: 1 }" -->
            <span
              class="operation_button update_btn"
              @click="toDetails(scope.row)"
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
  gateList, //道闸管理分页查询
  gateDelete //删除道闸
} from "@/api/equipmentManagement";
import Dialog from "./components/dialog";
import { fieldTable } from "@/api/common";

export default {
  name: "BarrierGateManagement",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkName: "", //停车场名称
        name: "", //道闸
        type: null //道闸类型
      },
      selGateway: null,
      typeList: [
        { enumName: "地上入口", enumValue: 1 },
        { enumName: "地下入口", enumValue: 2 },
        { enumName: "地上出口", enumValue: 3 },
        { enumName: "地下出口", enumValue: 4 }
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
    //获取道闸类型
    getType(type) {
      let name;
      if (type == 1) {
        name = "地上入口";
      } else if (type == 2) {
        name = "地下入口";
      } else if (type == 3) {
        name = "地上出口";
      } else if (type == 4) {
        name = "地下出口";
      }
      return name;
    },

    //查询设备列表
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
        parkName: "", //停车场名称
        name: "", //道闸
        type: null //道闸类型
      };
      this.openLoading();
      this.getList();
    },
    //选择区域地址
    selectAddress(data) {
      this.listQuery.address = data;
    },
    //显示溢出隐藏
    showTips(obj, row) {
      /*obj为鼠标移入时的事件对象*/
      /*currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除*/
      let TemporaryTag = document.createElement("span");
      TemporaryTag.innerText = row.note;
      TemporaryTag.className = "getTextWidth";
      document.querySelector("body").appendChild(TemporaryTag);
      let currentWidth = document.querySelector(".getTextWidth").offsetWidth;
      document.querySelector(".getTextWidth").remove();

      /*cellWidth为表格容器的宽度*/
      const cellWidth = obj.target.offsetWidth;

      /*当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行*/
      currentWidth <= 2 * cellWidth
        ? (row.showTooltip = false)
        : (row.showTooltip = true);
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

    //获取设备列表
    getList() {
      let para = this.listQuery;
      gateList(para)
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

    //打开添加设备
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
      let arr = [];
      this.selGateway.forEach(el => {
        arr.push(el.id);
      });
      if (this.selGateway.length > 0) {
        this.$confirm("确认批量删除道闸吗?", "提示", {
          type: "warning"
        }).then(() => {
          gateDelete(arr.toString()).then(response => {
            if (response.code == "200") {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.openLoading();
              this.getList();
            } else {
              this.$message({
                type: "warning",
                message: "删除失败"
              });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择删除的泊位"
        });
      }
    },
    //远程开闸
    openDoor() {},
    //打开编辑道闸
    toEdit(e) {
      let id = e.id;
      let pageType = 2;
      this.$refs.dialog.showDialog(id, pageType);
    },
    //打开道闸详情
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
.parkingManagement_page {
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
