PiechartAge<template>
  <!-- 年龄分布  -->
  <section class="chart-container">
    <div id="chartPieAge" style="width:100%; height:calc(50vh - 220px);"></div>
  </section>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      resizeTimer: null,
      chartPieAge: null,
      alarmSum: null
    };
  },
  mounted: function() {
    //控制图标随窗口变化
    let that = this;
    window.addEventListener("resize", function() {
      if (that.resizeTimer) clearTimeout(that.resizeTimer);
      that.resizeTimer = setTimeout(function() {
        that.chartPieAge.resize();
      }, 100);
    });
  },

  methods: {
    drawPieChart() {
      let that = this;
      this.chartPieAge = echarts.init(document.getElementById("chartPieAge"));
      this.chartPieAge.setOption({
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
                value: that.alarmSum.children,
                name: "儿童(0-6)",
                itemStyle: { color: "#5470C6" }
              },
              {
                value: that.alarmSum.juvenile,
                name: "少年(7-17)",
                itemStyle: { color: "#91CC75" }
              },
              {
                value: that.alarmSum.youth,
                name: "青年(18-40)",
                itemStyle: { color: "#FAC858" }
              },
              {
                value: that.alarmSum.midlife,
                name: "中年(41-65)",
                itemStyle: { color: "#EE6666" }
              },
              {
                value: that.alarmSum.oldAge,
                name: "老年(66及以上)",
                itemStyle: { color: "#73C0DE" }
              },
              {
                value: that.alarmSum.unknown,
                name: "未知",
                itemStyle: { color: "#3BA272" }
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
