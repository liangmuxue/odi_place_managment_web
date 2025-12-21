<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">抵扣券名称</div>
        <el-input v-model="listQuery.deductionName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">抵扣类型</div>
        <el-select
          v-model="listQuery.deductionType"
          placeholder="选择抵扣类型"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in deductionTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title">抵扣次数</div>
        <el-select
          v-model="listQuery.deductionTimesType"
          placeholder="选择抵扣次数"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in deductionTimesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
    <div class="btn_box">
      <el-button
        type="info"
        icon="el-icon-circle-plus-outline"
        @click="toAdd"
        v-has="{ red: 'merchantDeductionRulesAdd', type: 1 }"
        >新增</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        @click="toDel"
        v-has="{ red: 'merchantDeductionRulesDelete', type: 1 }"
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
          label="抵扣券名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.deductionName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="抵扣类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.deductionType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="扣款方式" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.deductionMode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="抵扣数量(单位)"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">
              {{
                scope.row.deductionValue == null
                  ? '全免'
                  : formatDeductionValue(scope.row)
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="领取后有效期(天)"
          min-width="130px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.deductionValidDays }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用门槛" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">
              {{
                !scope.row.deductionThreshold || scope.row.deductionThreshold == 0
                  ? '无门槛'
                  : scope.row.deductionType === '固定时长'
                    ? '满' + scope.row.deductionThreshold + '分钟可用'
                    : '满' + scope.row.deductionThreshold + '元可用'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="抵扣次数" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">
              {{ scope.row.deductionTimes == 1 ? '单次' : '有效期内重复使用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          min-width="130px"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.operateTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          min-width="140px"
          header-align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              @click="toEdit(scope.row)"
              v-has="{ red: 'merchantDeductionRulesEdit', type: 1 }"
            >
              编辑
            </span>
            <span
              class="operation_button update_btn"
              @click="toDetails(scope.row)"
              v-has="{ red: 'merchantDeductionRulesDetails', type: 1 }"
            >
              详情
            </span>
            <span
              class="operation_button update_btn"
              style="width:100px"
              @click="toMerchantLink(scope.row)"
              v-has="{ red: 'merchantDeductionRulesLink', type: 1 }"
            >
              关联商户
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
    <MerchantLinkDialog ref="merchantLinkDialog" @getList="getList"></MerchantLinkDialog>
  </div>
</template>

<script>
import { merchantDeductionRuleList, merchantDeductionRuleBatchDelete } from "@/api/merchantManagement";
import Dialog from "./components/ruleDialog";
import MerchantLinkDialog from "./components/merchantLinkDialog";

export default {
  name: "MerchantDeductionRules",
  components: { Dialog, MerchantLinkDialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        deductionName: "",
        deductionType: "",
        deductionTimesType: null
      },
      selGateway: [],
      deductionTypeOptions: [
        { label: "固定时长", value: "固定时长" },
        { label: "固定金额", value: "固定金额" },
        { label: "固定折扣", value: "固定折扣" },
        { label: "全免抵扣", value: "全免抵扣" }
      ],
      deductionTimesOptions: [
        { label: "单次", value: 1 },
        { label: "有效期内重复使用", value: -1 }
      ],
      listLoading: false, //加载
      list: [] //信息
    };
  },
  watch: {},

  created() {
    this.toSearchList();
  },
  methods: {
    // 查询规则列表
    toSearchList() {
      this.listQuery.pageNum = 1;
      this.openLoading();
      this.getList();
    },
    // 重置查询条件
    resetList() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        deductionName: "",
        deductionType: "",
        deductionTimesType: null
      };
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

    // 获取数据列表
    getList() {
      let para = this.listQuery;
      merchantDeductionRuleList(para)
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

    formatDeductionValue(row) {
      const quantity = row.deductionValue;
      if (
        row.deductionType === "固定折扣" &&
        quantity !== null &&
        quantity !== undefined
      ) {
        const numeric = Number(quantity);
        if (!isNaN(numeric)) {
          const displayQuantity = Number((numeric * 10).toFixed(1));
          return displayQuantity + (row.deductionUnit || "");
        }
      }
      return quantity + (row.deductionUnit || "");
    },

    // 打开新增规则
    toAdd() {
      let id = null;
      let pageType = 1;
      this.$refs.dialog.showDialog(id, pageType);
    },

    // 选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },

    // 批量删除
    toDel() {
      if (this.selGateway.length > 0) {
        let arr = [];
        this.selGateway.forEach(el => {
          arr.push(el.merchantDeductionRuleId);
        });
        let text = "确认批量删除抵扣规则吗?";
        if (this.selGateway.length == 1) {
          text = "确认删除该抵扣规则吗?";
        }

        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          let para = {
            ids: arr.toString()
          };
          merchantDeductionRuleBatchDelete(para).then(response => {
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
          message: "请选择要删除的抵扣规则"
        });
      }
    },

    // 打开编辑规则
    toEdit(e) {
      let id = e.merchantDeductionRuleId;
      let pageType = 2;
      this.$refs.dialog.showDialog(id, pageType);
    },
    // 打开规则详情
    toDetails(e) {
      let id = e.merchantDeductionRuleId;
      let pageType = 3;
      this.$refs.dialog.showDialog(id, pageType);
    },
    // 打开关联商户
    toMerchantLink(e) {
      let id = e.merchantDeductionRuleId;
      this.$refs.merchantLinkDialog.showDialog(id);
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
.search_content_title {
  padding: 0 4px;
  white-space: nowrap;
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
