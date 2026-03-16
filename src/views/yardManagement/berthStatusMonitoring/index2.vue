<template>
  <div class="commit_page">
    <div class="search_box">
      <!-- <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.name" placeholder="请输入"> </el-input>
      </span>
      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      > -->
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        row-key="id"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 280px)"
        align="left"
      >
        <!-- @selection-change="handleSelectionChange" -->
        <!-- <el-table-column type="selection" width="34"></el-table-column> -->
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
            <span class="content">{{ scope.row.parkingLot.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="停车场名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkingLot.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="区域地址"
          align="center"
          min-width="160px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkingLot.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="泊位总数" min-width="90px" align="center">
          <template slot-scope="scope">
            <div class="content">
              {{ scope.row.parkingLot.number }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已停车" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content" v-if="!scope.row.usedEdit"
              >{{ scope.row.in_use }}
              <i
                class="el-icon-edit"
                v-if="!scope.row.faulEdit"
                style="color: #037659;margin-left: 5px;cursor: pointer;"
                @click="toEditUsed(scope.row)"
              ></i>
            </span>
            <span class="content" v-else
              ><el-input
                v-model="scope.row.in_use"
                placeholder="请输入"
                type="number"
                min="0"
                @input="useInput(scope.row)"
                :max="scope.row.parkingLot.number - scope.row.in_error"
                step="1"
                style="width:100px"
              >
              </el-input>
              <i
                class="el-icon-circle-check"
                style="color: #037659;margin-left: 5px;cursor: pointer;"
                @click="editUsed(scope.row)"
              ></i>
              <i
                class="el-icon-circle-close"
                style="color: #EA2E1C ;margin-left: 5px;cursor: pointer;"
                @click="closeEditUsed(scope.row)"
              ></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="空闲数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkingLot.freeNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="故障数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content" v-if="!scope.row.faulEdit"
              >{{ scope.row.in_error }}
              <i
                class="el-icon-edit"
                v-if="!scope.row.usedEdit"
                style="color: #037659;margin-left: 5px;cursor: pointer;"
                @click="toEditFaul(scope.row)"
              ></i>
            </span>
            <span class="content" v-else
              ><el-input
                v-model="scope.row.in_error"
                placeholder="请输入"
                type="number"
                @input="errorInput(scope.row)"
                min="0"
                :max="scope.row.parkingLot.number - scope.row.in_use"
                step="1"
                style="width:100px"
              >
              </el-input>
              <i
                class="el-icon-circle-check"
                style="color: #037659;margin-left: 5px;cursor: pointer;"
                @click="editFaul(scope.row)"
              ></i>
              <i
                class="el-icon-circle-close"
                style="color: #EA2E1C ;margin-left: 5px;cursor: pointer;"
                @click="closeEditFaul(scope.row)"
              ></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="泊位占用率%"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.parkingLot.occupancy * 100
            }}</span>
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
  </div>
</template>

<script>
import {
  spaceReamingMonitorSpace, //车位分页查询
  spaceReamingDetail, //车位单条数据详情
  spaceReamingUpdate //修改车位
} from "@/api/yardManagement";
import { fieldTable } from "@/api/common";

export default {
  name: "BerthStatusMonitoring",
  components: {},
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        name: "爱立信停车场" //停车场名称
      },
      Dictionaries: {
        enumTypes: "STATUS"
      },
      enumsData: {}, //字典表返回数据
      listLoading: false, //加载
      curDate: null,
      list: [] //信息
    };
  },
  created() {
    this.toSearchList();
    // this.getFieldTable();
  },
  methods: {
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
      });
    },

    //查询列表
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
        name: "爱立信停车场" //停车场名称
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
    useInput(e) {
      let all = e.in_use * 1 + e.in_error;
      if (all > e.parkingLot.number) {
        e.in_use = e.parkingLot.number - e.in_error;
      }
    },
    errorInput(e) {
      let all = e.in_use + e.in_error * 1;
      if (all > e.parkingLot.number) {
        e.in_error = e.parkingLot.number - e.in_use;
      }
    },
    //获取列表
    getList() {
      let para = this.listQuery;
      spaceReamingMonitorSpace(para)
        .then(response => {
          let list = response.rows;
          list.forEach(el => {
            el.usedEdit = false;
            el.faulEdit = false;
          });
          this.list = list;
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
    //开启修改已停车
    toEditUsed(item) {
      item.usedEdit = true;
      this.curDate = item;
    },
    //修改已停车
    editUsed(item) {
      item.usedEdit = false;
      this.curDate = item;
      this.toEditDetail();
    },
    //关闭修改已停车
    closeEditUsed(item) {
      item.usedEdit = false;
      this.getEditDetail();
    },
    //开启修改故障数
    toEditFaul(item) {
      item.faulEdit = true;
      this.curDate = item;
    },
    //修改故障数
    editFaul(item) {
      item.faulEdit = false;
      this.curDate = item;
      this.toEditDetail();
    },
    //关闭修改故障数
    closeEditFaul(item) {
      item.faulEdit = false;
      this.getEditDetail();
    },
    //修改信息
    toEditDetail() {
      let para = {
        id: this.curDate.id,
        inUse: this.curDate.in_use * 1,
        inError: this.curDate.in_error * 1
      };
      spaceReamingUpdate(para)
        .then(response => {
          this.getEditDetail();
        })
        .catch(() => {});
    },
    //获取修改后信息
    getEditDetail() {
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

      let para = { id: this.curDate.id };
      spaceReamingDetail(para)
        .then(response => {
          this.list.forEach((el, i) => {
            if (el.id == this.curDate.id) {
              console.log(i);
              this.$set(this.list[i], "in_use", response.data.in_use);
              this.$set(this.list[i], "in_error", response.data.in_error);
              this.$set(this.list[i], "parkingLot", response.data.parkingLot);
            }
          });
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

    //获取修改的数据
    getEdit() {},
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
.content_edit {
}
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
