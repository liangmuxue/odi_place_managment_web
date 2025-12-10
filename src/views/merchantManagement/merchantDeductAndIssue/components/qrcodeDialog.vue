<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      生成二维码
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <div class="qrcode-content">
        <!-- 白色标题栏 -->
        <div class="qrcode-title-bar">
          <img :src="headerIcon" class="header-icon" />
          <span>扫一扫领取停车抵扣</span>
        </div>
        <!-- 蓝色背景区域 -->
        <div class="qrcode-blue-bg">
          <div class="qrcode-wrapper">
            <img v-if="qrcodeUrl" :src="qrcodeUrl" class="qrcode-img" ref="qrcodeImg" />
            <div v-else class="qrcode-loading">
              <i class="el-icon-loading"></i>
            </div>
          </div>
        </div>
        <!-- 底部操作栏 -->
        <div class="qrcode-footer">
          <el-button type="info" @click="handleAction">{{ actionText }}</el-button>
          <span class="tip-text" v-if="isDynamic">
            <span class="countdown-num">{{ countdown }}</span> 秒后自动刷新
          </span>
          <span class="tip-text static-tip" v-else>
            请注意静态二维码图片保存，勿让他人拍照冒领，以免给您带来损失
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getQrcode } from "@/api/merchantManagement";

export default {
  name: "QrcodeDialog",
  data() {
    return {
      isShow: false,
      qrcodeId: null,
      isDynamic: true,
      qrcodeUrl: "",
      countdown: 60,
      timer: null
    };
  },
  computed: {
    headerIcon() {
      return this.isDynamic ? "/dynamicCode.png" : "/staticCode.png";
    },
    actionText() {
      return this.isDynamic ? "刷新" : "下载";
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    openDialog(qrcodeId, isDynamic) {
      this.isShow = true;
      this.qrcodeId = qrcodeId;
      this.isDynamic = isDynamic;
      this.qrcodeUrl = "";
      this.countdown = 60;
      this.clearTimer();
      this.fetchQrcode();
      if (this.isDynamic) {
        this.startCountdown();
      }
    },
    closeDialog() {
      this.isShow = false;
      this.clearTimer();
    },
    fetchQrcode() {
      if (!this.qrcodeId) return;
      getQrcode(this.qrcodeId).then(res => {
        if (res.code === 200 || res.code === "200") {
          const base64 = res.data || res.msg;
          if (base64) {
            this.qrcodeUrl = `data:image/png;base64,${base64}`;
          }
        }
      });
    },
    startCountdown() {
      this.clearTimer();
      this.countdown = 60;
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.refreshQrcode();
        }
      }, 1000);
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    refreshQrcode() {
      this.countdown = 60;
      this.fetchQrcode();
    },
    handleAction() {
      if (this.isDynamic) {
        this.refreshQrcode();
      } else {
        this.downloadQrcode();
      }
    },
    downloadQrcode() {
      if (!this.qrcodeUrl) return;
      const link = document.createElement("a");
      link.href = this.qrcodeUrl;
      link.download = `qrcode_${this.qrcodeId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style lang="scss" scoped>
.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 40px;
  margin-top: 20px;
}
.qrcode-title-bar {
  width: 400px;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 15px 20px;
  border: 1px solid #eee;
  border-bottom: none;
  box-sizing: border-box;
  .header-icon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
  span {
    font-size: 16px;
    color: #333;
  }
}
.qrcode-blue-bg {
  width: 400px;
  height: 400px;
  background: #5b9bd5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.qrcode-wrapper {
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 10px;
}
.qrcode-img {
  max-width: 260px;
  max-height: 260px;
}
.qrcode-loading {
  font-size: 40px;
  color: #409eff;
}
.qrcode-footer {
  display: flex;
  align-items: center;
  padding: 20px 0;
  width: 400px;
  justify-content: center;
  .tip-text {
    margin-left: 15px;
    color: #333;
    font-size: 14px;
    .countdown-num {
      color: #f56c6c;
      font-weight: bold;
    }
    &.static-tip {
      color: #333;
      max-width: 400px;
    }
  }
}
</style>
