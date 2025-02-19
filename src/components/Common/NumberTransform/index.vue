<template>
  <!-- 
      /**
      * 滚动数字组件
      * @desc 当数据变化时,通过toOrderNum方法设置数字滚动变化
      * @author Yangyi Lee
      * @date 2021-4-19
      * @methods [toOrderNum] -通过toOrderNum方法传入替换后的数字
    */
  -->
  <div class="number-box">
    <li
      :class="{ 'number-item': !isNaN(item), 'mark-item': isNaN(item) }"
      v-for="(item, index) in numArr"
      :key="index"
    >
      <span v-if="!isNaN(item)">
        <i ref="numberItem">0123456789</i>
      </span>
      <span class="comma" v-else>{{ item }}</span>
    </li>
  </div>
</template>

<script>
export default {
  name: "numberTransform",
  data() {
    return {
      numArr: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 今日报警总数
    };
  },
  mounted() {
    this.valueId = this.value; // 初始值
    // this.initHandle()
  },
  methods: {
    /**
     * 设置文字滚动
     **/
    setTransform() {
      const numberItems = this.$refs.numberItem; // 拿到数字的ref，计算元素数量
      const numberArr = this.numArr.filter(item => !isNaN(item));
      // 结合CSS 对数字字符进行滚动,显示订单数量
      for (let index = 0; index < numberItems.length; index++) {
        const elem2 = numberItems[index];
        elem2.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`;
      }
    },
    /**
     * 数字处理
     * param {Number} [num] - 传入数字
     * param {Number} [bits] - 传入最大位数,不传情况下默认为10
     **/ 
    toOrderNum(num, bits) {
      if (!bits) {
        bits = 10;//最大位数、不传情况下默认为10
      }
      num = num.toString();
      // 把数变成字符串
      if (num.length < bits) {
        num = "0" + num; // 如未满最大位数，添加"0"补位
        this.toOrderNum(num); // 递归添加"0"补位
      } else if (num.length === bits) {
        // 数字中加入逗号
        this.numArr = num.split(""); // 将其便变成数据，渲染至滚动数组
      } else {
        // 数字超过最大位数显示异常
        this.$message.warning("数字位数过大");
      }
      this.setTransform(bits);
    }
  }
};
</script>
<style scoped lang="scss">
.number-box {
  position: relative;
  height: 30px;
  margin: 11px 0;
  list-style: none;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
  writing-mode: vertical-lr;
  text-orientation: upright;
  /*文字禁止编辑*/
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  /* overflow: hidden; */
}
/* 默认逗号设置 */
.mark-item {
  width: 5px;
  height: 100px;
  margin-right: 5px;
  line-height: 10px;
  font-size: 48px;
  position: relative;
  & > span {
    position: absolute;
    width: 100%;
    bottom: 0;
    writing-mode: vertical-rl;
    text-orientation: upright;
  }
}
/*滚动数字设置*/
.number-item {
  width: 18px;
  height: 30px;
  line-height: 30px;
  list-style: none;
  & > span {
    position: relative;
    display: inline-block;
    margin-right: 2px;
    width: 100%;
    height: 100%;
    writing-mode: vertical-rl;
    text-orientation: upright;
    overflow: hidden;
    & > i {
      font-style: normal;
      position: absolute;
      top: 5px;
      left: 50%;
      transform: translate(-50%, 0);
      transition: transform 1s ease-in-out;
      letter-spacing: 10px;
    }
  }
}
.number-item:last-child {
  margin-right: 0;
}
</style>
