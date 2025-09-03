<template>
  <div class="content">
    <canvas ref="markCanvas"></canvas>
  </div>
</template>

<script>
import { draw, marksList, clearMarksList, markShow } from "@/utils/draw"; // 矩形绘制方法

export default {
  name: "marks",
  data() {
    return {
      markList: [], // 标记内容数组
      markShow: false,
    };
  },
  mounted() {
    // this.initCanvas(); // 画布初始化
  },
  methods: {
    /* 画布初始化 */
    initCanvas(marks, selColor) {
      this.markShow = markShow;

      clearMarksList();
      let mark = {
        x: marks.x / 2 + 1,
        y: marks.y / 2 + 1,
        w: marks.w / 2,
        h: marks.h / 2,
      };

      this.markList = [];
      this.markList.push(mark);
      this.$nextTick(() => {
        // 初始化canvas宽高
        let cav = this.$refs.markCanvas;
        //为了更好显示出划线区域，划线区域比视频区域每边各大5px
        cav.width = "962";
        cav.height = "542";
        let ctx = cav.getContext("2d");
        if (selColor) {
          ctx.strokeStyle = selColor;
        } else {
          ctx.strokeStyle = "#0f0";
        }
        ctx.lineWidth = 2;
        cav.style.cursor = "crosshair";

        // 计算使用变量
        // 若this.markList长度不为0, 则显示已标记框
        if (this.markList.length !== 0) {
          this.markList.forEach(function (value) {
            // 遍历绘制所有标记框
            ctx.rect(value.x, value.y, value.w, value.h);
            ctx.stroke();
          });
        }
        // 调用封装的绘制方法
        draw(cav, this.markList, undefined, selColor);

        // 备注: js中对象操作指向的是对象的物理地址, 获取绘制完矩形的结果数组直接取用或处理this.markList即可
      });
    },
    //获取当前绘制点
    getmark() {
      let marks;
      if (marksList.length > 0) {
        marks = marksList[0];
      } else {
        marks = this.markList[0];
      }
      //-5是为了算出点位相对视频的坐标
      if (marks.x < 1) {
        marks.x = 1;
      }
      if (marks.y < 1) {
        marks.y = 1;
      }
      marks.x = (marks.x - 1) * 2 ;
      marks.y = (marks.y - 1) * 2 ;
      marks.w = marks.w * 2 ;
      marks.h = marks.h * 2 ;

      return marks;
    },
    clearALl(selColor) {
      this.initCanvas([], selColor);
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