<template>
  <div class="content">
    <canvas ref="markCanvas"></canvas>
  </div>
</template>

<script>
export default {
  name: "marks",
  data() {
    return {
      markList: [], // 标记内容数组
    };
  },
  mounted() {
    // this.initCanvas(); // 画布初始化
  },
  methods: {
    /* 画布初始化 */
    initCanvas(markList, colorList) {
      this.markList = markList;
      this.$nextTick(() => {
        // 初始化canvas宽高
        let cav = this.$refs.markCanvas;
        //为了更好显示出划线区域，划线区域比视频区域每边各大5px
        cav.width = "962";
        cav.height = "542";
        let ctx = cav.getContext("2d");
        // if (selColor) {
        //   ctx.strokeStyle = selColor;
        // } else {
        //   ctx.strokeStyle = "#0f0";
        // }

        // cav.style.cursor = "crosshair";

        // 计算使用变量
        let list = [...this.markList]; // 画框数据集合, 用于服务端返回的数据显示和绘制的矩形保存
        // 若服务端保存的为百分比则此处需计算实际座标, 直接使用实际座标可省略
        list.forEach(function (value, index) {
          let newValue = {
            //+5是为了将坐标点位正好移到视频上方
            x: value.x / 2 + 1,
            y: value.y / 2 + 1,
            w: value.w / 2,
            h: value.h / 2,
          };
          list.splice(index, 1, newValue);
        });

        // 若list长度不为0, 则显示已标记框
        if (list.length !== 0) {
          list.forEach(function (value, i) {
            // console.log("颜色", colorList[i]);
            ctx.beginPath();
            ctx.strokeStyle = colorList[i];
            ctx.lineWidth = 2;
            // 遍历绘制所有标记框
            ctx.rect(value.x, value.y, value.w, value.h);
            ctx.stroke();
            ctx.closePath();
          });
        }
        // 备注: js中对象操作指向的是对象的物理地址, 获取绘制完矩形的结果数组直接取用或处理this.markList即可
      });
    },
    //获取当前绘制点
    getmark() {
      let marks = this.markList[0];
      return marks;
    },
    clearALl() {
      this.initCanvas([]);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  width: 960px;
  height: 540px;

  img {
    position: absolut;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
  }

  canvas {
    position: absolut;
    top: 0;
    left: 0;
    z-index: 10;
  }
}
</style>