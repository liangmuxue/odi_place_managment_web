<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">活动名称</div>
        <el-input v-model="listQuery.ruleName" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">适用车场</div>
        <el-input v-model="listQuery.parkingLotName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">优惠券类型</div>
        <el-select
          v-model="listQuery.offerType"
          placeholder="选择优惠券类型"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in enumsData.OFFER_TYPE"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title">状态</div>
        <el-select
          v-model="listQuery.status"
          placeholder="选择状态"
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

      <span class="search_content2">
        <div class="search_content_title">活动时间</div>
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
        v-has="{ red: 'discountRulesAdd', type: 1 }"
        >新增</el-button
      >
      <!-- v-has="{ red: 'addBox', type: 1 }" -->
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        @click="toDel"
        v-has="{ red: 'discountRulesDelete', type: 1 }"
        >删除</el-button
      >
      <!-- v-has="{ red: 'deleteBox', type: 1 }" -->
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
        <el-table-column label="活动名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.ruleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="适用类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkingTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="适用购买单位"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.buyUnitName || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="优惠券类型"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.offerTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="折扣数值(折)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              Math.round(scope.row.discount * 10) / 10 || "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="封顶优惠金额(元)"
          align="center"
          min-width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.maxAmount || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="优惠面值(元)"
          align="center"
          min-width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.denomination || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="领取后有效期(天)"
          min-width="100px"
          align="center"
        >
          <template slot-scope="scope">
            <div class="content">
              {{ scope.row.expirationDay }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="活动时间"
          align="center"
          min-width="240px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content"
              >{{
                scope.row.activityStartTime
                  | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
              }}
              -
              {{
                scope.row.activityEndTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="总数/剩余(个)"
          align="center"
          min-width="90px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              getRulePreferentialCount(scope.row)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          min-width="90px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">
              <!-- <span class="errLine_ball" v-show="scope.row.status == 0"></span>
              <span v-show="scope.row.status == 0" class="errLine">
                已禁用</span
              > -->
              <span class="offLine_ball" v-show="scope.row.status == 1"></span>
              <span v-show="scope.row.status == 1" class="offLine">
                已结束</span
              >
              <span class="onLine_ball" v-show="scope.row.status == 0"></span>
              <span v-show="scope.row.status == 0" class="onLine"> 正常</span>
              <!-- <span class="offLine_ball" v-show="scope.row.status == 2"></span>
              <span v-show="scope.row.status == 2" class="offLine">
                未开始</span
              >
              <span class="offLine_ball" v-show="scope.row.status == 3"></span>
              <span v-show="scope.row.status == 3" class="offLine">
                未开始</span
              >
              <span v-show="scope.row.status == 3" class="errLine">
                (已禁用)</span
              > -->
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="170"
          header-align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              @click="toEdit(scope.row)"
              v-if="scope.row.status > -1"
              v-has="{ red: 'discountRulesEdit', type: 1 }"
            >
              编辑
            </span>
            <span
              class="operation_button update_btn"
              @click="toDetails(scope.row)"
              v-has="{ red: 'discountRulesDetails', type: 1 }"
            >
              详情
            </span>
            <!-- <span
              class="operation_button update_btn"
              @click="toStartStop2(scope.row.id, 0)"
              v-if="scope.row.status == 0"
            >
              启用
            </span>
            <span
              class="operation_button update_btn"
              @click="toStartStop2(scope.row.id, 1)"
              v-if="scope.row.status > 0"
            >
              禁用
            </span> -->

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
  rulePreferentialPage, //优惠规则分页查询
  rulePreferentialdeleteBatch, //优惠规则批量删除
  rulePreferentialSwitchBan //优惠规则切换禁用状态
} from "@/api/operationManagement";
import Dialog from "./components/dialog";
import { fieldTable } from "@/api/common";

export default {
  name: "discountRules",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkingLotName: "", //停车场名称
        ruleName: "", //规则名
        offerType: null, //优惠券类型
        activityStartTime: "", //开始时间
        activityEndTime: "", //结束时间
        status: null //状态
      },
      selGateway: null,
      statusList: [
        { enumName: "已结束", enumValue: 1 },
        { enumName: "正常", enumValue: 0 }
      ],
      Dictionaries: {
        enumTypes: "OFFER_TYPE,RULE_PARKING_DIRECTION"
      },
      enumsData: {}, //字典表返回数据
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
    this.getFieldTable();
  },
  methods: {
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
      });
    },
    changeTime() {
      this.listQuery.activityStartTime = this.time[0].getTime();
      this.listQuery.activityEndTime = this.time[1].getTime();
    },
    getRulePreferentialCount(e) {
      let res;
      if (e.totalType == 0) {
        res = "不限";
      } else {
        res =
          e.rulePreferentialCount.total +
          "/" +
          e.rulePreferentialCount.remaining;
      }
      return res;
    },
    //查询泊位列表
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
        parkingLotName: "", //停车场名称
        ruleName: "", //规则名
        offerType: null, //优惠券类型
        activityStartTime: "", //开始时间
        activityEndTime: "", //结束时间
        status: null //使用状态
      };
      this.time = [];
      this.openLoading();
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

    //获取数据列表
    getList() {
      let para = this.listQuery;
      rulePreferentialPage(para)
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

    //打开添加长租规则
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
        let text = "确认批量删除优惠活动吗?";
        if (this.selGateway.length == 1) {
          text = "确认删除该优惠活动吗?";
        }
        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          let para = {
            ids: arr.toString()
          };
          rulePreferentialdeleteBatch(para).then(response => {
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
          message: "请选择删除的优惠活动"
        });
      }
    },

    //打开编辑长租规则
    toEdit(e) {
      let id = e.id;
      let pageType = 2;
      this.$refs.dialog.showDialog(id, pageType);
    },
    //打开长租规则详情
    toDetails(e) {
      let id = e.id;
      let pageType = 3;
      this.$refs.dialog.showDialog(id, pageType);
    },
    toStartStop2(id, e) {
      let arr = [];
      arr.push(id);
      let para = {
        id: id,
        hasBan: e
      };
      rulePreferentialSwitchBan(para).then(response => {
        if (response.code == "200") {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.openLoading();
          this.getList();
        } else {
          // this.$message({
          //   type: "error",
          //   message: "操作失败"
          // });
        }
      });
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
