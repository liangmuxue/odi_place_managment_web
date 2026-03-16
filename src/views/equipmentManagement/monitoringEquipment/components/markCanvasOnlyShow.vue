<template>
  <div class="content">
    <canvas ref="markCanvas" id="canvas"></canvas>
    <canvas ref="canvasSave" id="canvasSave"></canvas>
  </div>
</template>

<script>
import { draw, marksList, clearCtx } from "@/utils/drawsOnlyShow"; // 矩形绘制方法

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
    initCanvas(marks, colorList) {
      this.$nextTick(() => {
        // 初始化canvas宽高
        let cav = this.$refs.markCanvas;
        let canSave = this.$refs.canvasSave;
        //为了更好显示出划线区域，划线区域比视频区域每边各大5px
        cav.width = "962";
        cav.height = "542";
        canSave.width = "962";
        canSave.height = "542";
        let ctx = cav.getContext("2d");
        // if (selColor) {
        //   ctx.strokeStyle = selColor;
        // } else {
        //   ctx.strokeStyle = "#0f0";
        // }
        ctx.lineWidth = 2;

        // cav.style.cursor = "crosshair";

        // 计算使用变量
        let list = marks; // 画框数据集合, 用于服务端返回的数据显示和绘制的矩形保存
        // let list = [{x:10,y:10},{x:1800,y:10},{x:1800,y:1000},{x:10,y:1000},{x:10,y:10}]; // 画框数据集合, 用于服务端返回的数据显示和绘制的矩形保存
        console.log(567,list)
        console.log(566,colorList)
        // 调用封装的绘制方法
        draw(cav, canSave, list, colorList);

        // 备注: js中对象操作指向的是对象的物理地址, 获取绘制完矩形的结果数组直接取用或处理this.markList即可
      });
    },
    //获取当前绘制点
    getmark() {
      return marksList;
      // let mark;
      // if (marksList[0]) {
      //   mark = marksList[0];
      // } else if (this.markList[0]) {
      //   mark = this.markList[0];
      // } else {
      //   mark = null;
      // }
      // return mark;
    },
    clearALl() {
      this.initCanvas(null);
      clearCtx();
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

  #canvas {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }

  #canvasSave {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>