<template>
  <!-- 当日车流实时趋势  -->
  <section class="chart-container">
    <div
      id="vehicleFlowChart"
      style="width:100%; height:calc(50vh - 220px);"
    ></div>
  </section>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      resizeTimer: null,
      vehicleFlowChart: null,
      timeList: [],
      incomingTrafficFlow: [],
      vehicleFlow: []
    };
  },
  mounted: function() {
    //控制图标随窗口变化
    let that = this;
    window.addEventListener("resize", function() {
      if (that.resizeTimer) clearTimeout(that.resizeTimer);
      that.resizeTimer = setTimeout(function() {
        that.vehicleFlowChart.resize();
      }, 100);
    });
  },

  methods: {
    drawPieChart() {
      let that = this;
      this.vehicleFlowChart = echarts.init(
        document.getElementById("vehicleFlowChart")
      );
      this.vehicleFlowChart.setOption({
        legend: {
          right: "10%",
          data: ["入车", "出车"]
        },
        xAxis: {
          type: "category",
          data: that.timeList
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "入车",
            type: "line",
            data: that.incomingTrafficFlow,
            itemStyle: {
              color: "#037659"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 0.95,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(3, 118, 89, 0.5)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(3, 118, 89, 0.1)" // 100% 处的颜色
                  }
                ]
              }
            }
          },
          {
            name: "出车",
            type: "line",
            data: that.vehicleFlow,
            itemStyle: {
              color: "#fe7831"
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 0.95,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(254, 120, 49, 0.5)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(254, 120, 49, 0.1)" // 100% 处的颜色
                  }
                ]
              }
            }
          }
        ]
      });
    },
    //获取数据
    getList(incomingTrafficFlow, vehicleFlow) {
      let timeList = [];
      let inList = [];
      let outList = [];
      incomingTrafficFlow.forEach(el => {
        timeList.push(el.hour);
        inList.push(el.vehicleCount);
      });
      vehicleFlow.forEach(el => {
        outList.push(el.vehicleCount);
      });
      this.timeList = timeList;
      this.incomingTrafficFlow = inList;
      this.vehicleFlow = outList;
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
