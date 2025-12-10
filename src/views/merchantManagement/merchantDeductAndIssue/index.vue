<template>
  <div class="merchantDeductAndIssue">
    <div class="tab_top">
      <div
        :class="activeTab == 1 ? 'tab_top_btn' : 'tab_top_btn2'"
        @click="changeTab(1)"
      >
        人工发放
      </div>
      <div
        :class="activeTab == 2 ? 'tab_top_btn' : 'tab_top_btn2'"
        @click="changeTab(2)"
      >
        二维码发放
      </div>
    </div>
    <div class="tab_content">
      <ManualIssue v-if="activeTab == 1" />
      <QrcodeIssue v-if="activeTab == 2" />
    </div>
  </div>
</template>

<script>
import ManualIssue from "./components/manualIssue";
import QrcodeIssue from "./components/qrcodeIssue";

export default {
  name: "merchantDeductAndIssue",
  components: { ManualIssue, QrcodeIssue },

  data() {
    return {
      activeTab: 1
    };
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
    }
  }
};
</script>

<style lang="scss" scoped>
.merchantDeductAndIssue {
  .tab_top {
    height: 40px;
    padding: 5px 10px;
    display: flex;
  }
  .tab_top_btn {
    height: 30px;
    line-height: 30px;
    width: 100px;
    color: #037659;
    text-align: center;
    margin: 0 10px;
    border-bottom: 2px solid #037659;
    cursor: pointer;
  }
  .tab_top_btn2 {
    height: 30px;
    line-height: 30px;
    width: 100px;
    color: #303133;
    text-align: center;
    margin: 0 10px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }
  .tab_content {
    padding: 10px;
  }
}
</style>
