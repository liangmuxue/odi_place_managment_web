<template>
  <!-- 当月收款统计  -->
  <section class="chart-container">
    <div
      id="monthlyCollection"
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
      monthlyCollection: null,
      timeList: [],
      monthlyCollectionStatistics: [],
      vehicleFlow: []
    };
  },
  mounted: function() {
    //控制图标随窗口变化
    let that = this;
    window.addEventListener("resize", function() {
      if (that.resizeTimer) clearTimeout(that.resizeTimer);
      that.resizeTimer = setTimeout(function() {
        that.monthlyCollection.resize();
      }, 100);
    });
  },

  methods: {
    drawPieChart() {
      let that = this;
      this.monthlyCollection = echarts.init(
        document.getElementById("monthlyCollection")
      );
      this.monthlyCollection.setOption({
        legend: {
          right: "10%",
          data: ["收费"]
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
            name: "收费",
            type: "line",
            stack: "Total",
            data: that.monthlyCollectionStatistics,
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
                ],
                global: false // 缺省为 false
              }
            },
            itemStyle: {
              color: "#037659" //
            }
          }
        ]
      });
    },
    //获取数据
    getList(monthlyCollectionStatistics) {
      let timeList = [];
      let inList = [];
      monthlyCollectionStatistics.forEach(el => {
        let index = el.day.lastIndexOf("-"); // 找到‘-’的索引
        let result;
        if (index !== -1) {
          // 如果找到了‘-’
          result = el.day.substring(index + 1); // 获取‘-’之后的字符串
        }
        timeList.push(result);
        inList.push(el.dailyPayments);
      });
      timeList;
      this.timeList = timeList;
      this.monthlyCollectionStatistics = inList;
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
