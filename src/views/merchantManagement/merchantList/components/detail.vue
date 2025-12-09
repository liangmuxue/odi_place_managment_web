<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      详情
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main merchant_detail_main">
      <!-- 商户信息头部 -->
      <div class="merchant_header">
        <div class="merchant_header_left">
          <div class="merchant_avatar">
            <img src="/merchant.png" alt="" />
          </div>
          <div class="merchant_info">
            <div class="merchant_name_row">
              <span class="merchant_name">{{ merchantInfo.merchantName }}</span>
              <span class="switch_item">
                <span class="switch_label">透支功能：</span>
                <span class="switch_status" :class="merchantInfo.overdraftEnabled ? 'status_on' : 'status_off'">
                  {{ merchantInfo.overdraftEnabled ? '已开启' : '已关闭' }}
                </span>
                <el-switch
                  v-model="merchantInfo.overdraftEnabled"
                  active-color="#33ae73"
                  inactive-color="#ccc"
                  @change="handleOverdraftChange"
                ></el-switch>
              </span>
              <span class="switch_item">
                <span class="switch_label">抵扣回收：</span>
                <span class="switch_status" :class="merchantInfo.deductionRecycleEnabled ? 'status_on' : 'status_off'">
                  {{ merchantInfo.deductionRecycleEnabled ? '已开启' : '已关闭' }}
                </span>
                <el-switch
                  v-model="merchantInfo.deductionRecycleEnabled"
                  active-color="#33ae73"
                  inactive-color="#ccc"
                  @change="handleDeductionRecycleChange"
                ></el-switch>
              </span>
            </div>
            <div class="merchant_detail_row">
              <span class="detail_item"><span class="label_text">商户编号：</span>{{ merchantInfo.merchantId }}</span>
              <span class="detail_item"><span class="label_text" style="margin-left: -30px;">联系人：</span>{{ merchantInfo.contact }}</span>
              <span class="detail_item"><span class="label_text" style="margin-left: -40px;">联系电话：</span>{{ formattedTel }}</span>
              <span class="detail_item parking_lot_item"><span class="label_text">停车场名称：</span>{{ merchantInfo.parkingLotName }}</span>
            </div>
          </div>
        </div>
        <div class="header_divider"></div>
        <div class="merchant_header_right">
          <div class="topup_icon">
            <img src="/topup.png" alt="" />
          </div>
          <div class="merchant_balance_area">
            <div class="balance_title">预充值</div>
            <div class="balance_row">
              <span class="balance_label"><span class="label_text">账户余额（元）：</span></span>
              <span class="balance_value" :class="{ negative_balance: isOverdraft }">{{ formattedBalance }}</span>
              <span v-if="isOverdraft" class="overdraft_tag">已透支</span>
              <el-button type="primary" size="mini" @click="handleRecharge">充值</el-button>
              <el-button type="danger" size="mini" @click="handleRefund">退费</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 抵扣规则表格 -->
      <div class="deduction_section">
        <div class="section_title">
          <span class="title_line"></span>
          <span class="title_text">抵扣规则</span>
        </div>
        <div class="deduction_table">
          <el-table
            :data="deductionList"
            highlight-current-row
            size="mini"
            stripe
            height="calc(100vh - 380px)"
            align="left"
          >
            <el-table-column
              label="序号"
              type="index"
              min-width="60px"
              align="center"
            ></el-table-column>
            <el-table-column label="抵扣券名称" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="content">{{ scope.row.deductionName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="扣款方式" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="content">{{ scope.row.deductionMode }}</span>
              </template>
            </el-table-column>
            <el-table-column label="充值剩余" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="content">{{ getBalanceDisplay(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="status_badge" :class="isRuleEnabled(scope.row) ? 'status_enabled' : 'status_disabled'">
                  <span class="status_dot"></span>
                  <span class="status_text">{{ isRuleEnabled(scope.row) ? '启用' : '停用' }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              min-width="150px"
              header-align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <span
                  class="operation_button update_btn"
                  @click="handleToggleState(scope.row)"
                >
                  {{ isRuleEnabled(scope.row) ? '停用' : '启用' }}
                </span>
                <template v-if="scope.row.deductionMode === '次数'">
                  <span
                    class="operation_button update_btn"
                    @click="handleDeductionRecharge(scope.row)"
                  >
                    充值
                  </span>
                  <span
                    class="operation_button update_btn"
                    @click="handleDeductionRefund(scope.row)"
                  >
                    退费
                  </span>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="listQuery.pageNum"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="listQuery.pageSize"
            :total="listQuery.total"
            style="float: right; margin: 10px"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 充值退费弹窗 -->
    <RechargeDialog ref="rechargeDialog" @success="handleDialogSuccess" />
    <RefundDialog ref="refundDialog" :balance="merchantInfo.balance" @success="handleDialogSuccess" />
    <DeductionRechargeDialog ref="deductionRechargeDialog" @success="handleDialogSuccess" />
    <DeductionRefundDialog ref="deductionRefundDialog" @success="handleDialogSuccess" />
  </div>
</template>

<script>
import {
  merchantDetail,
  getDeductionsByMerchantId,
  updateMerchantOverdraftStatus,
  updateMerchantRecycleStatus,
  updateMerchantDeductionState
} from "@/api/merchantManagement";
import RechargeDialog from "./rechargeDialog.vue";
import RefundDialog from "./refundDialog.vue";
import DeductionRechargeDialog from "./deductionRechargeDialog.vue";
import DeductionRefundDialog from "./deductionRefundDialog.vue";

export default {
  name: "MerchantDetail",
  components: {
    RechargeDialog,
    RefundDialog,
    DeductionRechargeDialog,
    DeductionRefundDialog
  },
  data() {
    return {
      isShow: false,
      merchantId: null,
      merchantInfo: {
        merchantId: "",
        merchantName: "",
        contact: "",
        tel: "",
        parkingLotName: "",
        balance: "0.00",
        overdraftEnabled: false,
        deductionRecycleEnabled: false
      },
      deductionList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    isOverdraft() {
      const v = this.merchantInfo.balance;
      const n = typeof v === "number" ? v : parseFloat(v);
      if (isNaN(n)) return false;
      return n < 0;
    },
    formattedBalance() {
      const v = this.merchantInfo.balance;
      const n = typeof v === "number" ? v : parseFloat(v);
      if (isNaN(n)) return "0.00";
      const sign = n < 0 ? "-" : "";
      const abs = Math.abs(n);
      const fixed = abs.toFixed(2);
      const parts = fixed.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return sign + parts.join(".");
    },
    formattedTel() {
      const tel = this.merchantInfo.tel || "";
      const digits = String(tel).replace(/\D/g, "");
      if (digits.length !== 11) {
        return tel;
      }
      const p1 = digits.slice(0, 3);
      const p2 = digits.slice(3, 7);
      const p3 = digits.slice(7);
      return `${p1} ${p2} ${p3}`;
    }
  },
  methods: {
    // 显示详情弹窗
    showDialog(id) {
      this.isShow = true;
      this.merchantId = id;
      this.getMerchantDetail();
      this.getDeductionList();
    },
    // 获取商户详情
    getMerchantDetail() {
      merchantDetail({ merchantId: this.merchantId }).then(response => {
        const data = response.data || {};
        this.merchantInfo = {
          merchantId: data.merchantId,
          merchantName: data.merchantName,
          contact: data.contact,
          tel: data.tel,
          parkingLotName: data.parkingLotName,
          balance: data.amountBalance != null ? data.amountBalance : "0.00",
          overdraftEnabled: data.allowOverdraft === true || data.allowOverdraft === 1,
          deductionRecycleEnabled: data.allowRecycle === true || data.allowRecycle === 1
        };
      });
    },
    // 获取抵扣规则列表
    getDeductionList() {
      const params = {
        merchantId: this.merchantId,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize
      };
      getDeductionsByMerchantId(params).then(response => {
        this.deductionList = response.rows || [];
        this.listQuery.total = response.total || 0;
      });
    },
    // 判断抵扣规则是否启用（兼容 0/1 和 true/false）
    isRuleEnabled(row) {
      const v = row.state;
      if (v === 1 || v === '1') return true;
      if (v === 0 || v === '0') return false;
      return !!v;
    },
    // 获取充值剩余显示
    getBalanceDisplay(row) {
      if (row.deductionMode === "预充") {
        return "-";
      } else if (row.deductionMode === "次数") {
        return (row.quantityBalance || 0) + "次";
      }
      return "-";
    },
    // 关闭弹窗
    closeDialog() {
      this.isShow = false;
      this.$emit("getList");
    },
    // 商户充值
    handleRecharge() {
      this.$refs.rechargeDialog.showDialog(this.merchantId);
    },
    // 商户退费
    handleRefund() {
      this.$refs.refundDialog.showDialog(this.merchantId);
    },
    // 透支功能开关
    handleOverdraftChange(val) {
      const oldVal = !val;
      updateMerchantOverdraftStatus({
        merchantId: this.merchantId,
        allowOverdraft: val
      })
        .then(() => {
          this.$message.success(`透支功能${val ? '开启' : '关闭'}成功`);
        })
        .catch(() => {
          this.merchantInfo.overdraftEnabled = oldVal;
        });
    },
    // 抵扣回收开关
    handleDeductionRecycleChange(val) {
      const oldVal = !val;
      updateMerchantRecycleStatus({
        merchantId: this.merchantId,
        allowRecycle: val
      })
        .then(() => {
          this.$message.success(`抵扣回收${val ? '开启' : '关闭'}成功`);
        })
        .catch(() => {
          this.merchantInfo.deductionRecycleEnabled = oldVal;
        });
    },
    // 启用/停用抵扣规则
    handleToggleState(row) {
      const enabled = this.isRuleEnabled(row);
      const action = enabled ? "停用" : "启用";
      const newState = !enabled;
      this.$confirm(`确认${action}该抵扣规则吗?`, "提示", {
        type: "warning"
      })
        .then(() => {
          updateMerchantDeductionState({
            id: row.id,
            state: newState
          }).then(() => {
            this.$message.success(`${action}成功`);
            this.getDeductionList();
          });
        })
        .catch(() => {});
    },
    // 抵扣规则充值
    handleDeductionRecharge(row) {
      if (row.deductionMode !== "次数") {
        this.$message.warning("仅次数类型的抵扣规则支持充值");
        return;
      }
      this.$refs.deductionRechargeDialog.showDialog(row.id, row.deductionSalePrice);
    },
    // 抵扣规则退费
    handleDeductionRefund(row) {
      if (row.deductionMode !== "次数") {
        this.$message.warning("仅次数类型的抵扣规则支持退费");
        return;
      }
      const balance = row.quantityBalance || 0;
      if (balance <= 0) {
        this.$message.warning("充值剩余为0，无法退费");
        return;
      }
      this.$refs.deductionRefundDialog.showDialog(row.id, row.deductionSalePrice, balance);
    },
    // 切换每页条数
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getDeductionList();
    },
    // 切换页码
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getDeductionList();
    },
    // 弹窗操作成功回调
    handleDialogSuccess() {
      this.getMerchantDetail();
      this.getDeductionList();
    }
  }
};
</script>

<style lang="scss" scoped>
.merchant_detail_main {
  padding: 0 !important;
  overflow: hidden;
}

.merchant_header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;

  .merchant_header_left {
    display: flex;
    align-items: center;
    flex: 1;

    .merchant_avatar {
      width: 80px;
      height: 80px;
      margin-right: 15px;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .merchant_info {
      flex: 1;

      .merchant_name_row {
        display: flex;
        align-items: center;
        margin-bottom: 6px;

        .merchant_name {
          font-size: 16px;
          font-weight: bold;
          color: #33ae73;
          margin-right: auto;
        }

        .switch_item {
          display: flex;
          align-items: center;
          margin-left: 30px;

          .switch_label {
            font-size: 13px;
            color: #33ae73;
            margin-right: 5px;
          }

          .switch_status {
            font-size: 13px;
            margin-right: 8px;
          }

          .status_on {
            color: #33ae73;
          }

          .status_off {
            color: #999;
          }
        }
      }

      .merchant_detail_row {
        display: flex;
        font-size: 13px;
        color: #666;
        margin-top: 16px;

        .label_text {
          color: #33ae73;
        }

        .detail_item {
          flex: 1;
        }

        .parking_lot_item {
          flex: 0 0 300px;
          max-width: 300px;
        }
      }
    }
  }

  .header_divider {
    width: 2px;
    height: 60px;
    background: #33ae73;
    margin-left: 20px;
    margin-right: 20px;
    flex-shrink: 0;
  }

  .merchant_header_right {
    display: flex;
    align-items: center;
    flex: 0 0 auto;

    .topup_icon {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      margin-left: 0;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .merchant_balance_area {
      .balance_title {
        font-size: 16px;
        font-weight: bold;
        color: #33ae73;
        margin-bottom: 8px;
      }

      .balance_row {
        display: flex;
        align-items: center;

        .balance_label {
          font-size: 13px;
          color: #666;

          .label_text {
            color: #33ae73;
          }
        }

        .balance_value {
          display: inline-block;
          min-width: 140px;
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        .negative_balance {
          color: #e74c3c;
        }

        .overdraft_tag {
          display: inline-block;
          margin-left: 8px;
          height: 28px;
          padding: 0 10px;
          font-size: 12px;
          color: #e74c3c;
          border: 1px solid #e74c3c;
          border-radius: 4px;
          background-color: #fff;
          line-height: 26px;
        }

        .el-button {
          margin-left: 8px;
        }

        .el-button--primary {
          background-color: #33ae73;
          border-color: #33ae73;
        }

        .el-button--danger {
          background-color: #e74c3c;
          border-color: #e74c3c;
        }
      }
    }
  }
}

.deduction_section {
  padding: 20px;

  .section_title {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .title_line {
      width: 4px;
      height: 18px;
      background: #4caf50;
      margin-right: 10px;
    }

    .title_text {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }

  .deduction_table {
    background: #fff;
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
}

.status_badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .status_dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .status_text {
    font-size: 13px;
  }

  &.status_enabled {
    .status_dot {
      background-color: #33ae73;
    }

    .status_text {
      color: #33ae73;
    }
  }

  &.status_disabled {
    .status_dot {
      background-color: #ccc;
    }

    .status_text {
      color: #828484;
    }
  }
}
</style>
