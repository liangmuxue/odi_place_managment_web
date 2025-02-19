<template>
  <!-- 日期选择器-->

  <div class="time-picker-box" id="picker">
    <span v-if="hasQuick">
      <div class="quick-picker">
        <el-radio-group v-model="buttonType" @change="quickSelect()">
          <el-radio-button :label="1">最近1天</el-radio-button>
          <el-radio-button :label="2">最近3天</el-radio-button>
          <el-radio-button :label="3">最近7天</el-radio-button>
          <el-radio-button :label="4">最近30天</el-radio-button>
        </el-radio-group>
      </div>
    </span>

    <div class="time-picker">
      <el-date-picker
        v-model="selTime"
        type="daterange"
        range-separator="-"
        value-format="timestamp"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width:100%"
        :size="size"
        @change="timeChange"
      ></el-date-picker>
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
    },
    size: {
      type: String
    }
  },
  data() {
    return {
      buttonType: null,
      selTime: []
    };
  },
  watch: {
    time() {
      this.selTime = this.time;
    }
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
    },
    //快捷时间选择
    quickSelect() {
      let data = this.buttonType;
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
    clearTime() {
      this.selTime = [];
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
      if (this.selTime) {
        this.selTime[1] = this.selTime[1] + 24 * 60 * 60 * 1000 - 1;
        this.$emit("selectTime", this.selTime);
        if (this.selTime[1] === this.funDateE(0)) {
          if (this.selTime[0] === this.funDateB(0)) {
            this.buttonType = 1;
          } else if (this.selTime[0] === this.funDateB(-2)) {
            this.buttonType = 2;
          } else if (this.selTime[0] === this.funDateB(-6)) {
            this.buttonType = 3;
          } else if (this.selTime[0] === this.funDateB(-29)) {
            this.buttonType = 4;
          } else {
            this.buttonType = 0;
          }
        } else {
          this.buttonType = 0;
        }
      } else {
        this.$emit("selectTime", this.selTime);
      }
    }
  }
};
</script>

<style lang="scss">
.time-picker-box {
  display: flex;
  .time-picker {
    flex: 1;
  }
  .quick-picker {
    width: 270px;
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
}
</style>
