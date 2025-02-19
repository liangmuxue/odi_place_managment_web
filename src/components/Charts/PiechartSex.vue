PiechartAge<template>
  <!-- 性别分布  -->
  <section class="chart-container">
    <div id="chartPieSex" style="width:100%; height:calc(50vh - 220px);"></div>
  </section>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      resizeTimer: null,
      chartPieSex: null,
      alarmSum: null
    };
  },
  mounted: function() {
    //控制图标随窗口变化
    let that = this;
    window.addEventListener("resize", function() {
      if (that.resizeTimer) clearTimeout(that.resizeTimer);
      that.resizeTimer = setTimeout(function() {
        that.chartPieSex.resize();
      }, 100);
    });
  },

  methods: {
    drawPieChart() {
      let that = this;
      this.chartPieSex = echarts.init(document.getElementById("chartPieSex"));
      this.chartPieSex.setOption({
        title: {
          text: "",
          subtext: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          x: "right", // 'center' | 'left' | {number},
          y: "top", // 'center' | 'bottom' | {number
          orient: "vertical"
        },
        series: [
          {
            name: "报警类型",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              {
                value: that.alarmSum.man,
                name: "男",
                itemStyle: { color: "#5470C6" }
              },
              {
                value: that.alarmSum.woman,
                name: "女",
                itemStyle: { color: "#91CC75" }
              },
              {
                value: that.alarmSum.unknown,
                name: "未知",
                itemStyle: { color: "#FAC858" }
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    //获取数据
    getList(data) {
      this.alarmSum = data;
      this.drawCharts();
    },
    //绘制
    drawCharts() {
      this.drawPieChart();
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
}

.el-col {
  padding: 30px 20px;
}
</style>
