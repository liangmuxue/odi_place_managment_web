<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">手机</div>
        <el-input v-model="listQuery.purePhoneNumber" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content2">
        <div class="search_content_title">注册时间</div>
        <!-- value-format="yyyy-MM-dd HH:mm:ss" -->
        <el-date-picker
          style="width: 72%"
          v-model="time"
          type="datetimerange"
          range-separator="-"
          start-placeholder="请选择时间"
          end-placeholder
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </span>
      <span class="search_content">
        <div class="search_content_title">开通钱包</div>
        <el-select
          v-model="listQuery.hasPurse"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in statusList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title">免密支付签约</div>
        <el-select
          v-model="listQuery.noPasswordPay"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in statusList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        ref="eTable"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 320px)"
        align="left"
        @sort-change="tableSort"
      >
        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户ID"
          align="center"
          width="60px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.purePhoneNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昵称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像" min-width="90px" align="center">
          <template slot-scope="scope">
            <div class="content">
              <el-popover placement="top-start" width="500" trigger="click">
                <img
                  :src="scope.row.avatar ? scope.row.avatar : scope.row.avatar"
                  width="100%"
                />
                <img
                  v-if="scope.row.avatar !== '' && scope.row.avatar !== null"
                  slot="reference"
                  :src="
                    scope.row.avatar + '?x-oss-process=image/resize,h_36,w_48'
                  "
                  width="48"
                  height="36"
                />
                <span v-else>
                  <div min-width="48" height="36"></div>
                </span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="注册时间"
          sortable="custom"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.createTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最后登录时间"
          align="center"
          prop="lastLoginTime"
          sortable="custom"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.lastLoginTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="绑定车辆数"
          align="center"
          prop="bindVehicleNum"
          sortable="custom"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.bindVehicleNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="已绑认证车数"
          align="center"
          prop="authVehicleNum"
          sortable="custom"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.authVehicleNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开通钱包" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.hasPurse == 1 ? "是" : "否"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="签约免密支付"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.noPasswordPay == 1 ? "是" : "否"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="钱包余额(元)"
          align="center"
          prop="balance"
          sortable="custom"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              @click="toDetial(scope.row)"
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
  wxUserList //小程序用户列表
} from "@/api/operationManagement";
import Dialog from "./components/dialog";

export default {
  name: "WeChatUsers",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        orderField: null, //排序字段// 1-注册时间2-最后登录时间3-钱包余额4-绑定车辆数量5-授权车辆数量
        orderType: null, //排序类型1 (升序)，2 (降序)
        purePhoneNumber: "", //手机号码
        hasPurse: null, //开通钱包'0-没有钱包 1-开通钱包'
        noPasswordPay: null, //免密支付'0-未开通免密支付 1-开通免密支付',
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      statusList: [
        { enumName: "否", enumValue: 0 },
        { enumName: "是", enumValue: 1 }
      ],
      time: [],
      listLoading: false, //加载
      list: [] //信息
    };
  },
  watch: {
    time(value) {
      if (value === null) {
        this.time = ["", ""];
      }
      this.changeTime();
    }
  },

  created() {
    this.toSearchList();
    // this.getFieldTable();
  },
  methods: {
    //排序
    tableSort(e) {
      let order = e.order;
      let prop = e.prop;
      console.log(111, e);
      if (prop == "createTime") {
        this.listQuery.orderField = 1;
      } else if (prop == "lastLoginTime") {
        this.listQuery.orderField = 2;
      } else if (prop == "balance") {
        this.listQuery.orderField = 3;
      } else if (prop == "bindVehicleNum") {
        this.listQuery.orderField = 4;
      } else if (prop == "authVehicleNum") {
        this.listQuery.orderField = 5;
      }
      if (order == "ascending") {
        this.listQuery.orderType = 1;
      } else {
        this.listQuery.orderType = 2;
      }
      this.openLoading();
      this.getList();
    },
    changeTime() {
      if (this.time[0]) {
        this.listQuery.startTime = this.time[0].getTime();
        this.listQuery.endTime = this.time[1].getTime();
      } else {
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
    },

    //查询用户列表
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
        orderField: null, //排序字段// 1-注册时间2-最后登录时间3-钱包余额4-绑定车辆数量5-授权车辆数量
        orderType: null, //排序类型1 (升序)，2 (降序)
        purePhoneNumber: "", //手机号码
        hasPurse: null, //开通钱包'0-没有钱包 1-开通钱包'
        noPasswordPay: null, //免密支付'0-未开通免密支付 1-开通免密支付',
        startTime: "", //开始时间
        endTime: "" //结束时间
      };
      this.time = [];
      this.openLoading();
      this.$refs.eTable.clearSort();
      this.getList();
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

    //获取用户列表
    getList() {
      let para = this.listQuery;
      wxUserList(para)
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

    //打开用户详情
    toDetial(e) {
      let id = e.id;
      this.$refs.dialog.showDialog(id);
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
