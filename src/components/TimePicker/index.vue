<template>
  <!-- 时间选择器-->

  <div class="time-picker-box" id="picker">
    <div class="time-picker">
      <el-date-picker
        v-model="selTime"
        type="datetimerange"
        value-format="timestamp"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width:100%"
        size="small"
        @change="timeChange"
      ></el-date-picker>
    </div>
    <div class="quick-picker" v-show="quickType == 1">
      <div
        :class="
          buttonType == 1 ? 'quick-picker-button-select' : 'quick-picker-button'
        "
        @click="quickSelect(1)"
        v-show="!quickChange"
      >
        最近一天
      </div>
      <div
        :class="
          buttonType == 2 ? 'quick-picker-button-select' : 'quick-picker-button'
        "
        @click="quickSelect(2)"
        v-show="!quickChange"
      >
        最近三天
      </div>
      <div
        :class="
          buttonType == 3 ? 'quick-picker-button-select' : 'quick-picker-button'
        "
        @click="quickSelect(3)"
      >
        最近一周
      </div>
      <div
        :class="
          buttonType == 4 ? 'quick-picker-button-select' : 'quick-picker-button'
        "
        @click="quickSelect(4)"
      >
        最近一月
      </div>
    </div>
    <div class="quick-picker2" v-show="quickType == 2">
      <div
        :class="
          buttonType == 1 ? 'quick-picker-button-select' : 'quick-picker-button'
        "
        @click="quickSelect(1)"
        v-show="!quickChange"
      >
        最近一天
      </div>
      <div
        :class="
          buttonType == 2 ? 'quick-picker-button-select' : 'quick-picker-button'
        "
        @click="quickSelect(2)"
        v-show="!quickChange"
      >
        最近三天
      </div>
      <div
        :class="
          buttonType == 3 ? 'quick-picker-button-select' : 'quick-picker-button'
        "
        @click="quickSelect(3)"
      >
        最近一周
      </div>
      <div
        :class="
          buttonType == 4 ? 'quick-picker-button-select' : 'quick-picker-button'
        "
        @click="quickSelect(4)"
      >
        最近一月
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {},
  props: {
    time: {
      type: Array
    },
    hasQuick: {
      type: Boolean
    },
    quickChange: {
      type: Boolean
    }
  },
  data() {
    return {
      buttonType: 1,
      quickType: 1,
      selTime: ""
    };
  },
  created() {
    this.selTime = this.time;
    this.$nextTick(() => {
      this.setQuick();
    });
  },
  methods: {
    //获取时间组件大小设置时间快捷键样式
    setQuick() {
      let width = document.querySelector("#picker").clientWidth;
      if (width > 600) {
        this.quickType = 1;
      } else {
        this.quickType = 2;
      }
    },
    //快捷时间选择
    quickSelect(data) {
      if (data === 1) {
        this.buttonType = 1;
        this.selTime = [this.funDateB(0), this.funDateE(0)];
      } else if (data === 2) {
        this.buttonType = 2;
        this.selTime = [this.funDateB(-2), this.funDateE(0)];
      } else if (data === 3) {
        this.buttonType = 3;
        this.selTime = [this.funDateB(-6), this.funDateE(0)];
      } else if (data === 4) {
        this.buttonType = 4;
        this.selTime = [this.funDateB(-29), this.funDateE(0)];
      }
      this.$emit("selectTime", this.selTime);
    },
    funDateB(val) {
      var date1 = new Date(new Date().toLocaleDateString());
      var date2 = date1.setDate(date1.getDate() + val);
      //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
      var time2 = new Date(date2).getTime();
      return time2;
    },
    funDateE(val) {
      var date1 = new Date(new Date().toLocaleDateString());
      var date2 = date1.setDate(date1.getDate() + val);
      //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
      var time2 = new Date(date2 + 24 * 60 * 60 * 1000 - 1).getTime();
      return time2;
    },
    //选择时间
    timeChange() {
      this.$emit("selectTime", this.selTime);
    }
  }
};
</script>

<style lang="scss">
.time-picker-box {
  display: flex;
  .time-picker {
    flex: 1;
    margin-top: 1px;
  }
  .quick-picker {
    width: 240px;
    .quick-picker-button {
      font-size: 12px !important;
      display: inline-block;
      width: 55px;
      height: 32px;
      line-height: 32px;
      color: #333;
      text-align: center;
      cursor: pointer;
    }
    .quick-picker-button-select {
      font-size: 12px !important;
      display: inline-block;
      width: 55px;
      height: 32px;
      line-height: 32px;
      color: #6ca6e8;
      text-align: center;
      cursor: pointer;
    }
  }
  .quick-picker2 {
    width: 120px;
    .quick-picker-button {
      font-size: 12px !important;
      float: left;
      width: 60px;
      height: 18px;
      line-height: 18px;
      color: #333;
      text-align: center;
      cursor: pointer;
    }
    .quick-picker-button-select {
      font-size: 12px !important;
      float: left;
      width: 60px;
      height: 18px;
      line-height: 18px;
      color: #6ca6e8;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
