<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      关联商户
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main" :class="{ 'has-enabled-merchants': hasEnabledMerchants }">
      <div class="base_dialog_main_content">
        <el-transfer
          style="text-align: left; display: inline-block;"
          v-model="selectedMerchantIds"
          filterable
          :data="transferData"
          :props="transferProps"
          :titles="['待选择', '已选择']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :filter-method="filterMethod"
          filter-placeholder="请输入搜索内容"
        >
          <span slot-scope="{ option }" class="merchant_option">
            <span class="merchant_name">{{ option.merchantName }}</span>
            <span class="status_wrap">
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
        <div class="transfer_footer_tips">
          * 已启用该规则或有余额的商户，不可取消关联
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
            quantityBalance: m.quantityBalance,
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
            quantityBalance: m.quantityBalance,
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
      const quantityBalance = merchant.quantityBalance;
      const hasBalance =
        quantityBalance !== null &&
        quantityBalance !== undefined &&
        quantityBalance !== 0;
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
.base_dialog_main_content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.merchant_option {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  /* 确保不被压缩 */
  flex-shrink: 0;
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
  justify-content: flex-start;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 200px;
  z-index: 10 !important;
}

.status_dot {
  width: 10px;
  height: 10px;
  border-radius: 0;
  margin-right: 4px;
}

.status_tag {
  font-size: 14px;
  padding: 0;
  border-radius: 0;
  margin-left: 5px;
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
  margin-top: 5px;
  color: #909399;
  font-size: 12px;
  text-align: left;
  /* 与右侧列表宽度保持一致，视觉上贴在右侧选择框下方 */
  width: 400px;
  margin-left: 700px;
}

/* 有不可取消关联的商户时，禁止右侧面板头部“全选”勾选 */
::v-deep .base_dialog_main.has-enabled-merchants
  .el-transfer-panel:last-child
  .el-transfer-panel__header
  .el-checkbox {
  pointer-events: none;
  cursor: not-allowed;
}

::v-deep .base_dialog_main.has-enabled-merchants
  .el-transfer-panel:last-child
  .el-transfer-panel__header
  .el-checkbox__inner {
  background-color: #f5f7fa;
  border-color: #ebeef5;
}

::v-deep .base_dialog_main.has-enabled-merchants
  .el-transfer-panel:last-child
  .el-transfer-panel__header
  .el-checkbox__label {
  color: #c0c4cc;
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

.base_dialog_main {
  ::v-deep .el-transfer-panel {
    height: 545px !important;
  }
}

::v-deep .el-transfer-panel:first-child .el-transfer-panel__list {
  position: relative;
  padding-top: 26px;
}

::v-deep .el-transfer-panel:first-child .el-transfer-panel__list::before {
  content: "商户名称";
  position: absolute;
  top: 6px;
  left: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  z-index: 0;
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
  left: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  z-index: 0;
}

::v-deep .el-transfer-panel:last-child .el-transfer-panel__list::after {
  content: "规则状态";
  position: absolute;
  top: 6px;
  left: 232px;
  width: 80px;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  z-index: 0;
}

/* 左侧面板隐藏状态列，仅右侧展示 */
::v-deep .el-transfer-panel:first-child .status_wrap {
  display: none;
}

::v-deep .el-transfer-panel__item {
  position: relative;
  z-index: 1; /* 给每一行一个基础层级 */
  overflow: visible !important; /* 防止行内的绝对定位元素被行本身切掉 */
}

/* 右侧面板每一行整体置于表头伪元素之上，避免第一行被遮挡 */
::v-deep .el-transfer-panel:last-child .el-transfer-panel__item {
  position: relative;
  z-index: 1;
}

::v-deep .el-transfer-panel__item .el-checkbox__label {
  overflow: visible !important;
  /* 强制 label 占据剩余空间，而不是包裹文字 */
  display: inline-block;
  width: 100%;
  /* 让 .merchant_option 的 width:100% 生效 */
  box-sizing: border-box;
  vertical-align: middle;
}
</style>
