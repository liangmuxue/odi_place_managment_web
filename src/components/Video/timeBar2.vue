/** * 视频回放条 */

<template>
  <div class="time-scale-container" id="canvasBox">
    <div v-show="visible" class="time-scale-tooltip" id="time-scale-tooltip">
      <div class="scale-tooltip-label">
        <div class="scale-tooltip-hour">
          {{ startTime | parseTime("{h}:{i}:{s}") }}
        </div>
      </div>
    </div>
    <div v-show="currentTime" id="time-pointer">
      <!-- <div class="time-pointer">
        <div class="time-pointer">{{ currentTime| parseTime('{h}:{i}:{s}') }}</div>
      </div>-->
    </div>
    <canvas id="vehicleTimeScale2" class="time-scale-canvas"></canvas>
  </div>
</template>

<script>
export default {
  props: {
    // timeButtonType: {
    //   type: Number,
    //   default: ""
    // },
    dateTime: {
      type: Number,
      default: ""
    }
    // historyTimeList: {
    //   type: Array,
    //   default: []
    // }
  },
  name: "time-bar",
  data() {
    return {
      /***标尺有关***/
      canvas: "",
      ctx: "",
      visible: false,
      isClick: false,
      scaleXpointArr: [],
      vehicleStatusCanvas: [],
      startTime: "",
      endTime: "",
      currentTime: ""
      /***标尺有关***/
    };
  },
  created() {},
  mounted: function() {
    // 初始化canvas
    const option = {
      contextType: "2d"
    };
    const canvasBox = document.querySelector(`#canvasBox`);

    const { canvas, ctx } = this.initCanvas("vehicleTimeScale2", option);
    this.canvas = canvas;
    this.ctx = ctx;
    // canvas时间轴加鼠标点击按下事件
    this.canvas.addEventListener("mousedown", this.onMousedown);
    // canvas时间轴加鼠标点击松开事件
    this.canvas.addEventListener("mouseup", this.onMouseup);
    // canvas时间轴加鼠标移动事件
    this.canvas.addEventListener("mousemove", this.handler);
    // canvas鼠标移除事件
    this.canvas.addEventListener("mouseout", () => {
      this.visible = false;
    });

    canvas.onmousedown = function(e) {
      var _x = e.clientX - canvas.offsetLeft;
      document.onmousemove = function(e) {
        var x = e.clientX - _x;
        if (x > 0) {
          x = 0;
        }
        if (x < canvasBox.offsetWidth - canvas.offsetWidth) {
          x = canvasBox.offsetWidth - canvas.offsetWidth;
        }
        canvas.style.left = x + "px";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      return false;
    };

    this.getTimeLineXpoint(this.canvas, this.ctx);
    this.drawTimeLineAText(60);
    this.getTimeAndPosition();
    // this.getVehiclePosition([
    //   { startTime: 1606924800000, endTime: 1606945600000 },
    //   { startTime: 1606946000000, endTime: 1606989600000 },
    //   { startTime: 1606990000000, endTime: 1606999600000 }
    // ]);
    // this.drawVehicleOrderStatus();
  },
  methods: {
    /*********标尺相关*********/
    getBar() {},
    // 初始化canvas
    initCanvas(canvasId, options) {
      var canvas = document.querySelector(`#${canvasId}`);
      if (!canvas) {
        throw new Error(`canvas容器不存在`);
      }

      // 获取canvas画布的宽高，css中已经设置canvas的宽高，则以css为准，如果没设置默认值为 300 * 150
      var clientWidth = canvas.clientWidth;
      var clientHeight = canvas.clientHeight;

      // canvas 宽高 TODO 设置canvas宽高后，canvas不能随浏览器缩放而缩放，暂时注释掉
      // canvas.style.width = canvas.clientWidth + 'px';
      // canvas.style.height = canvas.clientHeight + 'px';

      // <canvas>可能在视网膜屏幕上显得太模糊。
      // 使用window.devicePixelRatio确定应添加多少额外的像素密度以使图像更清晰
      canvas.width = clientWidth * 15;
      canvas.height = clientHeight;

      var ctx = canvas.getContext(options.contextType);

      return {
        canvas,
        ctx
      };
    },

    // 计算每个时间线对应X轴位置
    getTimeLineXpoint(canvas, ctx) {
      // 计算每一个格子的宽度，canvas前后各空两个格，基础参数已经多加一个，所以在加三个
      const perStep = canvas.width / (48 + 2);
      this.perSecondStep = perStep;
      for (let i = 1; i <= 49; i++) {
        this.scaleXpointArr.push(i * perStep);
      }
    },

    // 画时间轴线 和 时间标识
    drawTimeLineAText(height) {
      //绘制时间框
      this.drawFillRect2d(
        this.ctx,
        this.scaleXpointArr[0] - 50,
        -20,
        this.scaleXpointArr[this.scaleXpointArr.length - 2] + 100,
        100,
        { fillStyle: "#ccc" }
      );
      this.drawTimeStrip();
      for (let i = 0; i < this.scaleXpointArr.length; i++) {
        if (i % 2 === 0) {
          //整数刻度
          this.drawLine2d(
            this.ctx,
            this.scaleXpointArr[i],
            height * 0.3,
            this.scaleXpointArr[i],
            height * 0.5,
            {
              strokeStyle: "#333"
            }
          );

          // 时间标识
          let textContent = i / 2 + "";
          if (textContent < 10) {
            textContent = "0" + textContent;
          }

          // 文字测量。获得是字符占据的宽度
          const textWidth = this.ctx.measureText(textContent).width;
          this.drawText2d(
            this.ctx,
            textContent,
            this.scaleXpointArr[i] - textWidth,
            height * 0.8,
            {
              fontSize: 12,
              fillStyle: "#333"
            }
          );

          const textContent1 = ":00";
          this.drawText2d(
            this.ctx,
            textContent1,
            this.scaleXpointArr[i],
            height * 0.8,
            {
              fontSize: 12,
              fillStyle: "#333"
            }
          );
        } else {
          //半数刻度
          this.drawLine2d(
            this.ctx,
            this.scaleXpointArr[i],
            height * 0.3,
            this.scaleXpointArr[i],
            height * 0.4,
            {
              strokeStyle: "#333"
            }
          );
        }
      }
    },
    //绘制历史视频时间条
    drawTimeStrip() {
      this.drawFillRect2d(
        this.ctx,
        this.scaleXpointArr[0] - 1,
        12,
        this.scaleXpointArr[this.scaleXpointArr.length - 2] + 2,
        6,
        { fillStyle: "#e7f4f2" }
      );
    },

    drawText2d(ctx, content, offsetX, offsetY, options) {
      // 设置文本填充颜色
      if (options && options.fillStyle) {
        ctx.fillStyle = options.fillStyle;
      }

      // 设置文本字号 注：时间和字体要一起设置才生效
      if (options && options.fontSize) {
        ctx.font = `${options.fontSize}px PingFangSC-Regular, PingFang SC`;
      }

      // 设置文本字体
      if (options && options.fontFamily) {
        ctx.font += options.fontFamily;
      }

      // 设置文本水平对齐方式
      if (options && options.textAlign) {
        ctx.textAlign = options.textAlign;
      }
      // 设置文本基线对齐方式
      if (options && options.textBaseline) {
        ctx.textBaseline = options.textBaseline;
      }
      // 设置文本显示方向
      if (options && options.direction) {
        ctx.direction = options.direction;
      }

      // 文字填充
      ctx.fillText(content, offsetX, offsetY);
    },
    drawLine2d(ctx, moveToX, moveToY, lineToX, lineToY, options) {
      // 画线
      ctx.beginPath();

      // 设置线条描边颜色
      if (options && options.strokeStyle) {
        ctx.strokeStyle = options.strokeStyle;
      }

      // 设置线条转角的样式
      if (options && options.lineJoin) {
        ctx.lineJoin = options.lineJoin;
      }

      // 设置线条宽度
      if (options && options.lineWidth) {
        ctx.lineWidth = options.lineWidth;
      }

      // 当lineJoin类型是miter时候，miter效果生效的限制值
      if (options && options.miterLimit) {
        ctx.miterLimit = options.miterLimit;
      }
      ctx.moveTo(moveToX, moveToY);
      ctx.lineTo(lineToX, lineToY);
      ctx.stroke();
    },

    drawFillRect2d(ctx, startX, startY, width, height, options) {
      if (options && options.fillStyle) {
        ctx.fillStyle = options.fillStyle;
      }

      ctx.fillRect(startX, startY, width, height);
    },
    // 计算时间轴 0:00对应的位置
    getTimeAndPosition(time) {
      this.scaleTimePosition = {
        time: time,
        positionX: this.scaleXpointArr[0]
      };
    },
    //当前视频位置
    currentTimeSet(time) {
      this.currentTime = time;
      let zeroTime = new Date(
        new Date(this.dateTime).toLocaleDateString()
      ).getTime();
      let todayMs = this.currentTime - zeroTime;
      let length = this.perSecondStep * 48 + 2;
      let offsetX2 =
        (length * todayMs) / (24 * 60 * 60 * 1000) + this.perSecondStep;
      const ele2 = document.getElementById("time-pointer");
      let canvasX2 = window.getComputedStyle(this.canvas).left;
      // console.log(333222, offsetX2);
      ele2.style.left = offsetX2 + Number(canvasX2.replace("px", "")) + "px";
    },

    // 计算状态时间与位置的对应关系
    getVehiclePosition(vehicleOrderStatus) {
      // console.log(101010, vehicleOrderStatus);
      vehicleOrderStatus.forEach(item => {
        const { startX, endX } = this.getXposition(item);
        const startTime = item.createTime;
        const endTime = item.endTime;
        // console.log(1111110, startX);
        // console.log(2222220, endX);
        // console.log(3333330, item.vehicleStatus);
        const height = this.canvas.height;
        const newCanvas = {
          x: startX,
          y: 0,
          width: endX - startX,
          height: height,
          startTime,
          endTime,
          status: item.vehicleStatus
        };
        this.vehicleStatusCanvas.push(newCanvas);
      });
      this.drawVehicleOrderStatus();
    },

    // 计算开始时间结束时间对应的x轴位置
    getXposition(vehicleOrderStatus) {
      if (!this.scaleTimePosition) return { startX: 0, endX: 0 };
      const startTimeDiff =
        vehicleOrderStatus.createTime - this.scaleTimePosition.time;
      const endTimeDiff =
        vehicleOrderStatus.endTime - this.scaleTimePosition.time;
      // console.log("perSecondStep", this.perSecondStep);
      // console.log("scaleTimePosition", this.scaleTimePosition);

      // 开始时间和结束时间如果为0点，则开始位置为0点对应的位置
      const startX = startTimeDiff
        ? (startTimeDiff / 1800000) * this.perSecondStep +
          this.scaleTimePosition.positionX
        : this.scaleTimePosition.positionX;
      const endX = endTimeDiff
        ? (endTimeDiff / 1800000) * this.perSecondStep +
          this.scaleTimePosition.positionX
        : this.scaleTimePosition.positionX;

      // console.log("startTimeDiff", startTimeDiff);
      // console.log("endTimeDiff", endTimeDiff);
      return { startX, endX };
    },

    // 绘制状态图层
    drawVehicleOrderStatus() {
      for (let i = 0; i < this.vehicleStatusCanvas.length; i++) {
        // console.log(111111111, this.vehicleStatusCanvas);
        this.drawFillRect2d(
          this.ctx,
          this.vehicleStatusCanvas[i].x,
          12,
          this.vehicleStatusCanvas[i].width,
          5,
          { fillStyle: "#037659" }
        );
      }
      // this.$emit("toIsHistory",);
    },
    handler(event) {
      this.isClick = false;
      const offsetX = event.offsetX - this.perSecondStep + 1;
      const hoverCanvas = this.getIsExit(offsetX);
      // canvas存在且车辆接单状态不为-1
      const ele = document.getElementById("time-scale-tooltip");
      let canvasX = window.getComputedStyle(this.canvas).left;
      ele.style.left = offsetX + Number(canvasX.replace("px", "")) + "px";
      this.startTime = hoverCanvas;
      this.visible = true;
    },
    //鼠标点击按下事件
    onMousedown() {
      this.isClick = true;
    },
    //鼠标点击松开事件
    onMouseup(event) {
      if (this.isClick) {
        const clicksetX = event.offsetX - this.perSecondStep + 1;
        const clickCanvas = this.getIsExit2(clicksetX);
        // console.log(399, clickCanvas);
        if (clickCanvas) {
          this.$emit("clickHistoryTime", clickCanvas);
        } else if (clicksetX > 0) {
          this.$message({
            message: "该时间段暂无历史视频",
            type: "error"
          });
        }
      }
    },

    // 计算鼠标位置是否在接单状态中
    getIsExit(x) {
      let length = this.perSecondStep * 48 + 2;
      if (x > 0 && x < length) {
        let zeroTime = new Date(
          new Date(this.dateTime).toLocaleDateString()
        ).getTime();
        let ms = zeroTime + parseInt((x * 1000 * 60 * 60 * 24) / length);
        return ms;
      }
      return null;
    },
    //判断点击位置
    getIsExit2(x) {
      // let timeX = x - this.perSecondStep;
      let length = this.perSecondStep * 48 + 2;
      let zeroTime = new Date(
        new Date(this.dateTime).toLocaleDateString()
      ).getTime();
      let ms = zeroTime + parseInt((x * 1000 * 60 * 60 * 24) / length);
      return ms;

      // console.log(22222, x);
      // let length = this.perSecondStep * 48 + 2;

      // if (
      //   Array.isArray(this.vehicleStatusCanvas) &&
      //   this.vehicleStatusCanvas.length > 0
      // ) {
      //   const hoverCanvas = this.vehicleStatusCanvas.filter(obj => {
      //     console.log(333, obj);
      //     return obj.x <= x && x <= obj.x + obj.width;
      //   });
      //   if (hoverCanvas && hoverCanvas.length > 0) {
      //     let zeroTime = new Date(new Date(this.dateTime).toLocaleDateString()).getTime();
      //     let ms = zeroTime + parseInt((x * 1000 * 60 * 60 * 24) / length);
      //     console.log(333333, x);
      //     return ms;
      //   }
      // }
      // return null;
    }
    /*********标尺相关结束*********/
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.time-scale-canvas {
  position: absolute;
  height: 60px;
}
.time-scale-container {
  position: relative;
  margin-top: 10px;
  padding-top: 20px;
  height: 100px;
  overflow: hidden;
}
.time-scale-tooltip {
  position: absolute;
  z-index: 100;
  width: 100px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #333;
}
#time-pointer {
  position: absolute;
  z-index: 100;
  width: 2px;
  top: 0px;
  height: 80px;
  background: red;
}
</style>
