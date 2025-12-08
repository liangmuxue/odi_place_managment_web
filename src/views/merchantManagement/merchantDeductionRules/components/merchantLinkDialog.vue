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
          filter-placeholder="输入商户关键词"
        >
          <span slot-scope="{ option }" class="merchant_option">
            <span class="merchant_name">{{ option.merchantName }}</span>
            <span
              v-if="option.state === true"
              class="status_tag enabled"
            >
              启用
            </span>
            <span
              v-else
              class="status_tag disabled"
            >
              停用
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

.status_tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 3px;
  margin-left: 8px;
}

.status_tag.enabled {
  color: #67c23a;
  background-color: #f0f9ff;
  border: 1px solid #67c23a;
}

.status_tag.disabled {
  color: #909399;
  background-color: #f4f4f5;
  border: 1px solid #d3d4d6;
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
</style>
