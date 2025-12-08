<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      关联商户
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <div class="base_dialog_main_content">
        <el-transfer
          style="text-align: left; display: inline-block;"
          v-model="selectedMerchantIds"
          filterable
          :data="transferData"
          :props="transferProps"
          :titles="['待选择', '已关联商户列表']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :filter-method="filterMethod"
          filter-placeholder="输入搜索关键词"
        >
          <span slot-scope="{ option }" class="merchant_option">
            <span class="merchant_name">{{ option.merchantName }}</span>
            <span v-if="isInRight(option)" class="status_wrap">
              <span
                class="status_dot"
                :class="option.state === true ? 'enabled' : 'disabled'"
              ></span>
              <span
                class="status_tag"
                :class="option.state === true ? 'enabled' : 'disabled'"
              >
                {{ option.state === true ? '启用' : '停用' }}
              </span>
            </span>
          </span>
        </el-transfer>
        <div v-if="hasEnabledMerchants" class="transfer_footer_tips">
          * 已启用或有余额的商户，不可取消关联
        </div>
      </div>
      <div class="base_dialog_main_btnBox">
        <el-button type="info" @click="toSave">保存</el-button>
        <el-button type="danger" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMerchantsByRuleId,
  saveMerchantRuleRelation
} from "@/api/merchantManagement";

export default {
  data() {
    return {
      isShow: false,
      ruleId: null,
      transferData: [],
      selectedMerchantIds: [],
      transferProps: {
        key: "merchantId",
        label: "merchantName",
        disabled: "disabled"
      }
    };
  },
  computed: {
    rightMerchants() {
      return this.transferData.filter(item =>
        this.selectedMerchantIds.includes(item.merchantId)
      );
    },
    hasEnabledMerchants() {
      return this.rightMerchants.some(item => !this.isRemovable(item));
    }
  },
  methods: {
    showDialog(ruleId) {
      this.isShow = true;
      this.ruleId = ruleId;
      this.selectedMerchantIds = [];
      this.transferData = [];
      this.loadMerchants();
    },
    loadMerchants() {
      const para = { merchantDeductionRuleId: this.ruleId };
      getMerchantsByRuleId(para).then(res => {
        const data = res.data || {};
        const unlinked = data.unlinkedMerchants || [];
        const linked = data.linkedMerchants || [];
        const transferData = [];

        unlinked.forEach(m => {
          const item = {
            merchantId: m.merchant_id,
            merchantName: m.merchant_name,
            state: m.state,
            timesBalance: m.timesBalance,
            disabled: false,
            ...m
          };
          transferData.push(item);
        });

        linked.forEach(m => {
          const base = {
            merchantId: m.merchant_id,
            merchantName: m.merchant_name,
            state: m.state,
            timesBalance: m.timesBalance,
            ...m
          };
          transferData.push({
            ...base,
            disabled: !this.isRemovable(base)
          });
        });

        this.transferData = transferData;
        this.selectedMerchantIds = linked.map(m => m.merchant_id);
      });
    },
    isInRight(option) {
      return this.selectedMerchantIds.includes(option.merchantId);
    },
    isRemovable(merchant) {
      const timesBalance = merchant.timesBalance;
      const hasBalance =
        timesBalance !== null &&
        timesBalance !== undefined &&
        timesBalance !== 0;
      return merchant.state !== true && !hasBalance;
    },
    filterMethod(query, item) {
      if (!query) {
        return true;
      }
      const name = item.merchantName || item.merchant_name || "";
      return name.indexOf(query) > -1;
    },
    toSave() {
      this.$confirm("确认保存关联商户吗?", "提示", {
        type: "warning"
      }).then(() => {
        const merchantIds = this.selectedMerchantIds;
        const para = {
          merchantDeductionRuleId: this.ruleId,
          merchantIds: merchantIds
        };
        saveMerchantRuleRelation(para).then(response => {
          if (response.code == "200" || response.code === 200) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.closeDialog();
          }
        });
      });
    },
    closeDialog() {
      this.isShow = false;
      this.$emit("getList", {});
    }
  }
};
</script>

<style lang="scss" scoped>
.merchant_option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.merchant_name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status_wrap {
  display: inline-flex;
  align-items: center;
  min-width: 80px;
  justify-content: flex-end;
}

.status_dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.status_tag {
  font-size: 12px;
  padding: 0;
  border-radius: 0;
  margin-left: 0;
}

.status_tag.enabled {
  color: #67c23a;
  background-color: transparent;
  border: none;
}

.status_tag.disabled {
  color: #909399;
  background-color: transparent;
  border: none;
}

.status_dot.enabled {
  background-color: #67c23a;
}

.status_dot.disabled {
  background-color: #909399;
}

.transfer_footer_tips {
  margin-top: 10px;
  color: #e6a23c;
  font-size: 12px;
}

.base_dialog_main_btnBox {
  text-align: center;
  padding-top: 10px;
}

/* 仅作用于当前弹窗的 el-transfer，保证复选框与文字垂直居中 */
::v-deep .el-transfer-panel__item .el-checkbox {
  display: flex;
  align-items: center;
}

/* 仅右侧面板列表的表头：商户名称 / 规则状态 */
::v-deep .el-transfer-panel:last-child .el-transfer-panel__list {
  position: relative;
  padding-top: 26px;
}

::v-deep .el-transfer-panel:last-child .el-transfer-panel__list::before {
  content: "商户名称";
  position: absolute;
  top: 6px;
  left: 40px;
  font-size: 12px;
  color: #303133;
}

::v-deep .el-transfer-panel:last-child .el-transfer-panel__list::after {
  content: "规则状态";
  position: absolute;
  top: 6px;
  right: 20px;
  font-size: 12px;
  color: #303133;
}
</style>
