<template>
  <!-- 识别量  -->
  <section class="chart-container">
    <div id="chartLine" style="width:100%; height:calc(50vh - 220px);"></div>
  </section>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      chartLine: null,
      resizeTimer: null,
      dateList: [],
      snapList: [] //抓拍
    };
  },
  mounted: function() {
    //控制图标随窗口变化
    let that = this;
    window.addEventListener("resize", function() {
      if (that.resizeTimer) clearTimeout(that.resizeTimer);
      that.resizeTimer = setTimeout(function() {
        that.chartLine.resize();
      }, 100);
    });
  },

  methods: {
    drawLineChart() {
      this.chartLine = echarts.init(document.getElementById("chartLine"));
      this.chartLine.setOption({
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          x: "right", // 'center' | 'left' | {number},
          y: "top", // 'center' | 'bottom' | {number
          data: ["抓拍数"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.dateList
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "抓拍数",
            type: "line",
            data: this.snapList,
            symbolSize: 8, //设定实心点的大小
            itemStyle: {
              normal: {
                color: "#6C84CE", //改变折线点的颜色
                lineStyle: {
                  color: "#6C84CE" //改变折线颜色
                }
              }
            }
          }
        ]
      });
    },
    //获取数据
    getSnapshot(data) {
      let arr = data;
      this.dateList = [];
      this.snapList = []; //抓拍

      if (arr.length > 0) {
        arr.forEach(el => {
          this.dateList.push(el.date);
          this.snapList.push(el.count);
        });
      }
      this.drawCharts();
    },
    //绘制
    drawCharts() {
      this.drawLineChart();
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
