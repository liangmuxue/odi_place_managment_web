<template>
  <div class="homePage">
    <div class="homePage_top homePge_box">
      <div class="homePge_box_title">
        <div class="homePge_box_title_ico"></div>
        <div>实时统计</div>
      </div>
      <div class="homePage_top_box">
        <div class="homePage_top_card">
          <div class="homePage_top_card_ico parkCount"></div>
          <div class="homePage_top_card_textBox">
            <div class="homePage_top_card_textBox_title">
              {{ dataStatisticsVo.parkCount }}
            </div>
            <div class="homePage_top_card_textBox_text">停车场数量</div>
          </div>
        </div>
        <div class="homePage_top_card">
          <div class="homePage_top_card_ico todayTraffic"></div>
          <div class="homePage_top_card_textBox">
            <div class="homePage_top_card_textBox_title">
              {{ dataStatisticsVo.todayTraffic }}
            </div>
            <div class="homePage_top_card_textBox_text">今日车流</div>
          </div>
        </div>
        <div class="homePage_top_card">
          <div class="homePage_top_card_ico termCarCount"></div>
          <div class="homePage_top_card_textBox">
            <div class="homePage_top_card_textBox_title">
              {{ dataStatisticsVo.termCarCount }}
            </div>
            <div class="homePage_top_card_textBox_text">长租车数量</div>
          </div>
        </div>
        <div class="homePage_top_card">
          <div class="homePage_top_card_ico todayPayments"></div>
          <div class="homePage_top_card_textBox">
            <div class="homePage_top_card_textBox_title">
              {{ dataStatisticsVo.todayPayments }}
            </div>
            <div class="homePage_top_card_textBox_text">今日收款(元)</div>
          </div>
        </div>
        <div class="homePage_top_card">
          <div class="homePage_top_card_ico yesterdayPayments"></div>
          <div class="homePage_top_card_textBox">
            <div class="homePage_top_card_textBox_title">
              {{ dataStatisticsVo.yesterdayPayments }}
            </div>
            <div class="homePage_top_card_textBox_text">昨日收款(元)</div>
          </div>
        </div>
        <div class="homePage_top_card">
          <div class="homePage_top_card_ico monthPayments"></div>
          <div class="homePage_top_card_textBox">
            <div class="homePage_top_card_textBox_title">
              {{ dataStatisticsVo.monthPayments }}
            </div>
            <div class="homePage_top_card_textBox_text">本月收款(元)</div>
          </div>
        </div>
        <div class="homePage_top_card">
          <div class="homePage_top_card_ico yearPayments"></div>
          <div class="homePage_top_card_textBox">
            <div class="homePage_top_card_textBox_title">
              {{ dataStatisticsVo.yearPayments }}
            </div>
            <div class="homePage_top_card_textBox_text">今年收款(元)</div>
          </div>
        </div>
      </div>
    </div>
    <div class="homePage_main">
      <div class="homePage_main_left">
        <div
          class="homePage_main_charts homePge_box"
          style="margin-bottom:20px"
        >
          <div class="homePge_box_title">
            <div class="homePge_box_title_ico"></div>
            <div>当日车流实时趋势</div>
            <el-select
              v-model="listQuery.dailyTrafficFlowPark"
              placeholder="请选择停车场"
              clearable
              class="filter-item"
              @change="getStatistics"
              style="width: 200px;margin-left:10px"
              size="small"
            >
              <el-option
                v-for="item in parkingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <VehicleFlowChart height="100%" width="100%" ref="vehicleFlowChart" />
        </div>
        <div class="homePage_main_charts homePge_box">
          <div class="homePge_box_title">
            <div class="homePge_box_title_ico"></div>
            <div>当月收款统计</div>
            <el-select
              v-model="listQuery.monthlyCollectionStatisticsPark"
              placeholder="请选择停车场"
              clearable
              class="filter-item"
              @change="getStatistics"
              style="width: 200px;margin-left:10px"
              size="small"
            >
              <el-option
                v-for="item in parkingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <MonthlyCollection
            height="100%"
            width="100%"
            ref="monthlyCollection"
          />
        </div>
      </div>
      <div class="homePage_main_right">
        <div class="homePage_main_table homePge_box">
          <div class="homePge_box_title">
            <div class="homePge_box_title_ico"></div>
            <div>当日实时停车费统计</div>
          </div>
          <el-table
            :data="parkingFeeStatistics"
            highlight-current-row
            size="mini"
            height="calc(100vh - 380px)"
            align="cneter"
            style="margin:10px 20px;width:340px"
          >
            <el-table-column
              label="排行"
              type="index"
              width="100"
              class-name="greenText"
              align="center"
            ></el-table-column>
            <el-table-column
              label="停车场"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span class="content">{{ scope.row.park }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="金额(元)"
              align="center"
              class-name="greenText"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span class="content">{{ scope.row.totalPayMoney }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="homePage_main_table homePge_box">
          <div class="homePge_box_title">
            <div class="homePge_box_title_ico"></div>
            <div>当日实时收费率</div>
          </div>
          <el-table
            :data="feeRate"
            highlight-current-row
            size="mini"
            height="calc(100vh - 380px)"
            align="cneter"
            style="margin:10px 20px;width:340px"
          >
            <el-table-column
              label="排行"
              type="index"
              width="100"
              class-name="greenText"
              align="center"
            ></el-table-column>
            <el-table-column
              label="停车场"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span class="content">{{ scope.row.park }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="收费率"
              class-name="greenText"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span class="content">{{
                  getFeeRate(scope.row.totalPayMoney)
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  homepageStatistics //首页数据统计
} from "@/api/homePage";
import VehicleFlowChart from "@/components/Charts/vehicleFlowChart"; //当日车流实时趋势1
import MonthlyCollection from "@/components/Charts/monthlyCollection"; //当日车流实时趋势1
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";

export default {
  name: "HomePage",
  components: { VehicleFlowChart, MonthlyCollection },
  data() {
    return {
      listQuery: {
        monthlyCollectionStatisticsPark: null, //当月收款筛选停车场id
        dailyTrafficFlowPark: null //车流筛选停车场id
      },
      parkingList: [],
      dataStatisticsVo: {
        parkCount: null, //停车场数量
        todayTraffic: null, //今日车流
        termCarCount: null, //长租车数量
        todayPayments: null, //今日收款
        yesterdayPayments: null, //昨日收款
        monthPayments: null, // 本月收款
        yearPayments: null //今年收款
      },
      monthlyCollectionStatistics: [], //当月收款统计
      incomingTrafficFlow: [], //当日车流 入车
      vehicleFlow: [], //当日车辆 出车
      parkingFeeStatistics: [], //当日实时停车费统计
      feeRate: [] //当日实时收费率
    };
  },
  created() {
    this.getStatistics();
    this.getparking();
  },
  methods: {
    getFeeRate(e) {
      var result = Math.ceil(e * 10000) / 100;
      return result + "%";
    },
    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
      });
    },

    getStatistics() {
      let para = this.listQuery;
      homepageStatistics(para).then(response => {
        this.dataStatisticsVo = response.data.dataStatisticsVo;
        this.monthlyCollectionStatistics =
          response.data.monthlyCollectionStatistics;
        this.incomingTrafficFlow = response.data.incomingTrafficFlow;
        this.vehicleFlow = response.data.vehicleFlow;
        this.parkingFeeStatistics = response.data.parkingFeeStatistics;
        this.feeRate = response.data.feeRate;
        setTimeout(() => {
          this.$refs.vehicleFlowChart.getList(
            this.incomingTrafficFlow,
            this.vehicleFlow
          );
          this.$refs.monthlyCollection.getList(
            this.monthlyCollectionStatistics
          );
        }, 500);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.homePage {
  padding: 0 20px;
  .homePge_box {
    background: #f3f9f7;
    border: 1px solid #b4d5cc;
    border-radius: 5px;
    box-shadow: 0px 5px 5px 0px rgba($color: #037659, $alpha: 0.16);
  }
  .homePge_box_title {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    color: #037659;
    font-weight: bold;
    display: flex;
    margin-top: 5px;
    .homePge_box_title_ico {
      width: 35px;
      height: 16px;
      margin: 7px 5px;
      background-image: url("../../assets/images/homePage/homePge_box_title_ico.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .homePage_top {
    height: 130px;
    .homePage_top_box {
      margin-top: 8px;
      height: 74px;
      display: flex;
      justify-content: space-around;
      .homePage_top_card {
        width: 200px;
        height: 74px;
        background-image: url("../../assets/images/homePage/homePage_top_card.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 7px;
        display: flex;
        .homePage_top_card_ico {
          width: 60px;
          height: 60px;
        }
        .parkCount {
          background-image: url("../../assets/images/homePage/parkCount.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .todayTraffic {
          background-image: url("../../assets/images/homePage/todayTraffic.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .termCarCount {
          background-image: url("../../assets/images/homePage/termCarCount.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .todayPayments {
          background-image: url("../../assets/images/homePage/todayPayments.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .yesterdayPayments {
          background-image: url("../../assets/images/homePage/yesterdayPayments.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .monthPayments {
          background-image: url("../../assets/images/homePage/monthPayments.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .yearPayments {
          background-image: url("../../assets/images/homePage/yearPayments.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .homePage_top_card_textBox {
          padding-left: 10px;
          .homePage_top_card_textBox_title {
            height: 32px;
            line-height: 36px;
            font-size: 24px;
            color: #037659;
            font-weight: bold;
          }
          .homePage_top_card_textBox_text {
            height: 24px;
            line-height: 24px;
            font-size: 14px;
            // font-weight: bold;
          }
        }
      }
    }
  }
  .homePage_main {
    height: calc(100vh - 320px);
    margin-top: 20px;
    display: flex;
    .homePage_main_left {
      flex: 1;
      height: calc(100vh - 320px);
      .homePage_main_charts {
        height: calc(50vh - 170px);
      }
    }
    .homePage_main_right {
      width: 800px;
      display: flex;
      .homePage_main_table {
        width: 380px;
        height: calc(100vh - 320px);
        margin-left: 20px;
      }
    }
  }
}
</style>
