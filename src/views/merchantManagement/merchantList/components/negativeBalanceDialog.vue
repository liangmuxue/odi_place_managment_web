<template>
  <el-dialog
    :visible.sync="isShow"
    width="50%"
    :show-close="false"
    :append-to-body="true"
    :close-on-click-modal="true"
    class="negative-balance-dialog"
  >
    <div slot="title" class="dialog-header">
      <div class="header-left">
        <i class="el-icon-warning warning-icon"></i>
        <span class="title-text">提示</span>
      </div>
      <div class="header-right">
        <span class="no-remind-text" @click="handleNoRemind">当天不再提示</span>
        <i class="el-icon-close close-icon" @click="closeDialog"></i>
      </div>
    </div>
    <div class="base_dialog_main_content">
      <el-table :data="list" border style="width: 100%" max-height="400">
        <el-table-column prop="merchantName" label="商户名称" align="center"></el-table-column>
        <el-table-column prop="amountBalance" label="账户余额" align="center"></el-table-column>
        <el-table-column prop="parkingLotName" label="停车场名称" align="center"></el-table-column>
      </el-table>
      
      <div class="footer-tip">
        <span>以上商户账户已透支，请您关注！</span>
        <span class="date-text">{{ currentDate }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { toggleTodayOnOff } from "@/api/merchantManagement";

export default {
  name: "NegativeBalanceDialog",
  data() {
    return {
      isShow: false,
      list: [],
      currentDate: ""
    };
  },
  methods: {
    showDialog(list) {
      this.isShow = true;
      this.list = list;
      this.currentDate = this.formatDate(new Date());
    },
    closeDialog() {
      this.isShow = false;
    },
    handleNoRemind() {
      toggleTodayOnOff().then(() => {
        this.closeDialog();
      });
    },
    formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const i = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${y}${m}${d} ${h}:${i}:${s}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.negative-balance-dialog {
  ::v-deep .el-dialog__header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
  }
  
  ::v-deep .el-dialog__body {
    padding: 20px;
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .warning-icon {
      color: #E6A23C;
      font-size: 20px;
      margin-right: 8px;
    }
    
    .title-text {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    
    .no-remind-text {
      color: #666;
      font-size: 14px;
      cursor: pointer;
      margin-right: 15px;
      
      &:hover {
        color: #409EFF;
      }
    }
    
    .close-icon {
      font-size: 18px;
      color: #999;
      cursor: pointer;
      
      &:hover {
        color: #409EFF;
      }
    }
  }
}

.footer-tip {
  margin-top: 20px;
  text-align: left;
  font-size: 16px;
  
  .date-text {
    margin-left: 20px;
    color: #999;
  }
}
</style>
