PiechartAge<template>
  <!-- 报警统计  -->
  <section class="chart-container">
    <div id="chartPiePersonType" style="width:100%; height:calc(50vh - 220px);"></div>
  </section>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      resizeTimer: null,
      chartPiePersonType: null,
      alarmSum: null
    };
  },
  mounted: function() {
    //控制图标随窗口变化
    let that = this;
    window.addEventListener("resize", function() {
      if (that.resizeTimer) clearTimeout(that.resizeTimer);
      that.resizeTimer = setTimeout(function() {
        that.chartPiePersonType.resize();
      }, 100);
    });
  },

  methods: {
    drawPieChart() {
      let that = this;
      this.chartPiePersonType = echarts.init(
        document.getElementById("chartPiePersonType")
      );
      this.chartPiePersonType.setOption({
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
                value: that.alarmSum.owner,
                name: "业主",
                itemStyle: { color: "#5470C6" }
              },
              {
                value: that.alarmSum.tenant,
                name: "租户",
                itemStyle: { color: "#91CC75" }
              },
              {
                value: that.alarmSum.employees,
                name: "公司员工",
                itemStyle: { color: "#FAC858" }
              },
              {
                value: that.alarmSum.property,
                name: "物业",
                itemStyle: { color: "#EE6666" }
              },
              {
                value: that.alarmSum.cleaning,
                name: "保洁",
                itemStyle: { color: "#73C0DE" }
              },
              {
                value: that.alarmSum.securityGuard,
                name: "保安",
                itemStyle: { color: "#3BA272" }
              },
              {
                value: that.alarmSum.courier,
                name: "快递",
                itemStyle: { color: "#FC8452" }
              },
              {
                value: that.alarmSum.takeaway,
                name: "外卖",
                itemStyle: { color: "#9A60B4" }
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
