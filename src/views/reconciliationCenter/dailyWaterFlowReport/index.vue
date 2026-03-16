<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入"> </el-input>
      </span>

      <span class="search_content2">
        <div class="search_content_title">日期</div>
        <el-date-picker
          style="width: 72%"
          v-model="time"
          value-format="yyyy-MM-dd"
          type="daterange"
          :clearable="false"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </span>

      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>
    <div class="btn_box">
      <el-button
        type="info"
        icon="el-icon-upload2"
        @click="toExport"
        v-has="{ red: 'dailyWaterFlowReportExport', type: 1 }"
        >导出</el-button
      >
      <span class="btn_box_text"
        >*
        以下数据仅包含微信支付现金流水，不含钱包支付数据，退款以操作时间计入报表
      </span>
    </div>

    <div class="content_box">
      <el-table
        :data="exportList"
        highlight-current-row
        v-show="false"
        size="mini"
        ref="tableExport"
        id="tableExport"
        stripe
        height="calc(100vh - 300px)"
        :span-method="objectSpanMethod"
        class="teble-noPadding export_table"
        align="left"
      >
        <el-table-column label="" align="center" width="43" fixed="left">
          <template slot-scope="scope">
            {{ scope.row.title1 }}
          </template>
        </el-table-column>
        <el-table-column label="" align="center" width="43" fixed="left">
          <template slot-scope="scope">
            {{ scope.row.title2 }}
          </template>
        </el-table-column>
        <el-table-column label="" align="center" width="43" fixed="left">
          <template slot-scope="scope">
            {{ scope.row.title3 }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in platformDataList"
          :key="index"
          :label="item.date ? item.date : '合计'"
          :prop="item.date + 'cz'"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.title2 == '充值'">
              <div v-if="scope.row.title3 == '充值'">
                {{ scope.row.dateList[index].recharge.rechargeAmount }}
              </div>
              <div v-if="scope.row.title3 == '提现'">
                {{ scope.row.dateList[index].recharge.withdrawAmount }}
              </div>
              <div v-if="scope.row.title3 == '实收'">
                {{ scope.row.dateList[index].recharge.realAmount }}
              </div>
            </div>
            <div v-if="scope.row.title2 == '优惠购买'">
              <div v-if="scope.row.title3 == '收款'">
                {{
                  scope.row.dateList[index].preferentialPurchase
                    .collectionAmount
                }}
              </div>
              <div v-if="scope.row.title3 == '退款'">
                {{
                  scope.row.dateList[index].preferentialPurchase.refundAmount
                }}
              </div>
              <div v-if="scope.row.title3 == '实收'">
                {{ scope.row.dateList[index].preferentialPurchase.realAmount }}
              </div>
            </div>
            <div v-else-if="scope.row.title2 == '临停'">
              <div v-if="scope.row.title3 == '收款'">
                {{
                  scope.row.dateList[index].temporaryStopInfo.collectionAmount
                }}
              </div>
              <div v-if="scope.row.title3 == '退款'">
                {{ scope.row.dateList[index].temporaryStopInfo.refundAmount }}
              </div>
              <div v-if="scope.row.title3 == '实收'">
                {{ scope.row.dateList[index].temporaryStopInfo.realAmount }}
              </div>
            </div>
            <div v-else-if="scope.row.title2 == '长租'">
              <div v-if="scope.row.title3 == '收款'">
                {{
                  scope.row.dateList[index].longTermRentalInfo.collectionAmount
                }}
              </div>
              <div v-if="scope.row.title3 == '退款'">
                {{ scope.row.dateList[index].longTermRentalInfo.refundAmount }}
              </div>
              <div v-if="scope.row.title3 == '实收'">
                {{ scope.row.dateList[index].longTermRentalInfo.realAmount }}
              </div>
            </div>
            <div v-else-if="scope.row.title2 == '小计'">
              <div v-if="scope.row.title3 == '收款'">
                {{ scope.row.dateList[index].subtotalInfo.collectionAmount }}
              </div>
              <div v-if="scope.row.title3 == '退款'">
                {{ scope.row.dateList[index].subtotalInfo.refundAmount }}
              </div>
              <div v-if="scope.row.title3 == '实收'">
                {{ scope.row.dateList[index].subtotalInfo.realAmount }}
              </div>
            </div>
            <div v-else-if="scope.row.title2 == '合计'">
              <div v-if="scope.row.title3 == '收款'">
                {{ scope.row.dateList[index].collectionAmount }}
              </div>
              <div v-if="scope.row.title3 == '退款'">
                {{ scope.row.dateList[index].refundAmount }}
              </div>
              <div v-if="scope.row.title3 == '实收'">
                {{ scope.row.dateList[index].realAmount }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        :key="list"
        height="calc(100vh - 300px)"
        class="teble-noPadding"
        align="left"
      >
        <el-table-column label="" align="center" width="43" fixed="left">
          <template slot-scope="scope">
            <div
              class="teble-noPadding-hasPaddingTr"
              v-if="scope.row.parkName == '合计'"
            ></div>
            <div
              class="teble-noPadding-hasPaddingTr2"
              v-else-if="scope.row.parkName == '平台'"
            >
              平台
            </div>
            <div class="teble-noPadding-hasPaddingTr3" v-else>
              {{ scope.row.parkName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" fixed="left" width="60">
          <template slot-scope="scope">
            <div v-if="scope.row.parkName == '合计'">
              <div class="teble_title" style="font-weight: bold;">合计</div>
            </div>
            <div v-else-if="scope.row.parkName == '平台'">
              <div class="teble_title">充值</div>
              <div class="teble_title">
                <div class="teble_title3"></div>
                <div class="teble_title3">优惠</div>
                <div class="teble_title3">购买</div>
                <div class="teble_title3"></div>
              </div>
            </div>
            <div v-else>
              <div class="teble_title">临停</div>
              <div class="teble_title">长租</div>
              <div class="teble_title">小计</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" fixed="left" width="60">
          <template slot-scope="scope">
            <div v-if="scope.row.parkName == '合计'">
              <div class="teble_title2">收款</div>
              <div class="teble_title2">退款</div>
              <div class="teble_title2">实收</div>
            </div>
            <div v-else-if="scope.row.parkName == '平台'">
              <div class="teble_title2">充值</div>
              <div class="teble_title2">提现</div>
              <div class="teble_title2">实收</div>
              <div class="teble_title2">收款</div>
              <div class="teble_title2">退款</div>
              <div class="teble_title2">实收</div>
            </div>
            <div v-else>
              <div class="teble_title2">收款</div>
              <div class="teble_title2">退款</div>
              <div class="teble_title2">实收</div>
              <div class="teble_title2">收款</div>
              <div class="teble_title2">退款</div>
              <div class="teble_title2">实收</div>
              <div class="teble_title2">收款</div>
              <div class="teble_title2">退款</div>
              <div class="teble_title2">实收</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in platformDataList"
          :key="index"
          :label="item.date ? item.date : '合计'"
          :prop="item.date + 'cz'"
          align="center"
          width="100"
        >
          <!-- :fixed="item.date ? '' : 'right'" -->
          <template slot-scope="scope">
            <div v-if="scope.row.parkName == '合计'">
              <div class="teble_title2">
                {{ scope.row.parkingLotDataList[index].collectionAmount }}
              </div>
              <div class="teble_title2">
                {{ scope.row.parkingLotDataList[index].refundAmount }}
              </div>
              <div class="teble_title2">
                {{ scope.row.parkingLotDataList[index].realAmount }}
              </div>
            </div>
            <div v-else-if="scope.row.parkName == '平台'">
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].recharge.rechargeAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].recharge.withdrawAmount
                }}
              </div>
              <div class="teble_title2">
                {{ scope.row.parkingLotDataList[index].recharge.realAmount }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].preferentialPurchase
                    .collectionAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].preferentialPurchase
                    .refundAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].preferentialPurchase
                    .realAmount
                }}
              </div>
            </div>
            <div v-else>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].temporaryStopInfo
                    .collectionAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].temporaryStopInfo
                    .refundAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].temporaryStopInfo
                    .realAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].longTermRentalInfo
                    .collectionAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].longTermRentalInfo
                    .refundAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].longTermRentalInfo
                    .realAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].subtotalInfo
                    .collectionAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].subtotalInfo.refundAmount
                }}
              </div>
              <div class="teble_title2">
                {{
                  scope.row.parkingLotDataList[index].subtotalInfo.realAmount
                }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  capitalFlowDailyReportList, //流水日报
  collectionStatisticsExport // 收款统计导出
} from "@/api/reconciliationCenter";
import XLSX from "xlsx";

// import { export_table_to_excel } from "@/vendor/Export2Excel";
const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 如果当前列不是组织机构列，则返回 { rowspan: 1, colspan: 1 }，表示该单元格不需要合并
  // if (columnIndex !== 0 && columnIndex !== 1&& columnIndex !== 2  &&columnIndex!==9&&columnIndex!==10) {
  //   return { rowspan: 1, colspan: 1 };
  // }
  if (columnIndex !== 0 && columnIndex !== 1) {
    return { rowspan: 1, colspan: 1 };
  }

  // 如果当前行是该组织机构的第一行，则计算该组织机构的行数，并返回 { rowspan, colspan: 1 }，表示需要合并的行数为 rowspan
  if (
    rowIndex === 0 ||
    row.casename !== this.list.value[rowIndex - 1].casename
  ) {
    const rowCount = this.list.value.filter(i => i.casename === row.casename)
      .length;
    return { rowspan: rowCount, colspan: 1 };
  }
  // 否则返回 { rowspan: 0, colspan: 0 }，表示该单元格已被上方单元格合并
  return { rowspan: 0, colspan: 0 };
};
export default {
  name: "collectionStatistics",
  components: {},
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        startDate: "", //开始时间
        endDate: "", //结束时间
        parkName: "" //停车场
      },
      totalMoneyList: {
        totalAmount: 0,
        termRentalAmount: 0,
        temporaryStopAmount: 0,
        totalShare: 0,
        totalShareTwo: 0
      }, //收款金额数据
      selGateway: null,
      time: [],
      listLoading: false, //加载
      list: [], //信息
      exportList: [], //信息
      platformDataList: [
        {
          date: "2026-10-01",
          recharge: {
            rechargeAmount: 1200.5, // 充值金额
            withdrawAmount: 300.0, // 提现金额
            realAmount: 900.5 // 实收金额
          },
          preferentialPurchase: {
            // 优惠购买对象
            collectionAmount: 80.0, // 收款金额
            refundAmount: 10.0, // 退款金额
            realAmount: 70.0 // 实收金额
          }
        },
        {
          date: "",
          recharge: {
            rechargeAmount: 1200.5, // 充值金额
            withdrawAmount: 300.0, // 提现金额
            realAmount: 900.5 // 实收金额
          },
          preferentialPurchase: {
            // 优惠购买对象
            collectionAmount: 80.0, // 收款金额
            refundAmount: 10.0, // 退款金额
            realAmount: 70.0 // 实收金额
          }
        }
      ], //平台数据
      parkingLotDataList: [
        {
          parkId: 1001, // 车场id
          parkName: "海创停车场", // 车场名称
          parkingLotDataList: [
            // 车场数据集合（每项含：时间、临停信息、长租信息、小计信息）
            {
              date: "2026-10-01", // 时间
              temporaryStopInfo: {
                // 临停信息
                date: "2026-10-01",
                collectionAmount: 500.0, // 收款金额
                refundAmount: 20.0, // 退款金额
                realAmount: 480.0 // 实收金额
              },
              longTermRentalInfo: {
                // 长租信息
                date: "2026-10-01",
                collectionAmount: 800.0,
                refundAmount: 0.0,
                realAmount: 800.0
              },
              subtotalInfo: {
                // 小计信息
                date: "2026-10-01",
                collectionAmount: 1300.0,
                refundAmount: 20.0,
                realAmount: 1280.0
              }
            },
            {
              date: "", // 时间
              temporaryStopInfo: {
                // 临停信息
                date: "2026-10-01",
                collectionAmount: 500.0, // 收款金额
                refundAmount: 20.0, // 退款金额
                realAmount: 480.0 // 实收金额
              },
              longTermRentalInfo: {
                // 长租信息
                date: "2026-10-01",
                collectionAmount: 800.0,
                refundAmount: 0.0,
                realAmount: 800.0
              },
              subtotalInfo: {
                // 小计信息
                date: "2026-10-01",
                collectionAmount: 1300.0,
                refundAmount: 20.0,
                realAmount: 1280.0
              }
            }
          ]
        }
      ],
      totalDataList: [
        {
          date: "2026-10-01", // 时间
          collectionAmount: 1300.0, // 收款金额
          refundAmount: 20.0, // 退款金额
          realAmount: 1280.0 // 实收金额
        },
        {
          date: "",
          collectionAmount: 1300.0, // 收款金额
          refundAmount: 20.0, // 退款金额
          realAmount: 1280.0 // 实收金额
        }
      ]
    };
  },
  watch: {
    time(value) {
      if (value === null) {
        this.time = ["", ""];
      }
      this.changeTime();
    }
  },

  created() {
    this.getDefaultTime();
    this.toSearchList();
    // this.getFieldTable();
  },
  methods: {
    getDefaultTime() {
      const today = new Date();
      const yesterday = new Date(today);
      const sevenday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      sevenday.setDate(today.getDate() - 7);
      let endDate = yesterday.toISOString().slice(0, 10);
      let startDate = sevenday.toISOString().slice(0, 10);
      this.listQuery.startDate = startDate;
      this.listQuery.endDate = endDate;
      this.time = [startDate, endDate];
    },
    changeTime() {
      this.listQuery.startDate = this.time[0];
      this.listQuery.endDate = this.time[1];
    },

    //查询列表
    toSearchList() {
      this.listQuery.pageNum = 1;
      this.openLoading();
      this.getList();
      // this.getNewList();
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (!row.title1) {
          if (rowIndex % 3 === 0) {
            return {
              rowspan: 3,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        } else if (row.title1 == "平台") {
          if (rowIndex % 6 === 0) {
            return {
              rowspan: 6,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        } else {
          if (rowIndex % 9 === 6) {
            return {
              rowspan: 9,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      } else if (columnIndex === 1) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    //获取数据转换
    getNewList(data) {
      this.platformDataList = data.platformDataList;
      this.getExportList(data);
      let platformData = {
        parkName: "平台", // 车场名称
        parkingLotDataList: data.platformDataList
      };
      let totalData = {
        parkName: "合计", // 车场名称
        parkingLotDataList: data.totalDataList
      };
      let newList = [];
      newList.push(platformData);
      data.parkingLotDataList.forEach(el => {
        newList.push(el);
      });
      newList.push(totalData);
      this.list = newList;
    },
    getExportList(data) {
      let list = [];
      let platformDataList = data.platformDataList;
      let parkingLotDataList = data.parkingLotDataList;
      let totalDataList = data.totalDataList;
      let newPlatformDataList = this.getNewPlatformDataList(platformDataList);
      let newParkingLotDataList = this.getNewParkingLotDataList(
        parkingLotDataList
      );
      let newTotalDataList = this.getNewTotalDataList(totalDataList);
      // console.log(111, newPlatformDataList);
      // console.log(222, newParkingLotDataList);
      // console.log(333, newTotalDataList);
      list = [
        ...newPlatformDataList,
        ...newParkingLotDataList,
        ...newTotalDataList
      ];
      // console.log(123, list);
      this.exportList = list;
    },
    //整理平台数据
    getNewPlatformDataList(platformDataList) {
      let numList = [1, 2, 3, 4, 5, 6];
      let newPlatformDataList = [];
      numList.forEach(el => {
        let newData = {
          title1: "平台",
          title2: "充值",
          title3: "充值",
          dateList: platformDataList
        };
        if (el > 3) {
          newData.title2 = "优惠购买";
        }
        if (el == 2) {
          newData.title3 = "提现";
        }
        if (el == 3 || el == 6) {
          newData.title3 = "实收";
        }
        if (el == 4) {
          newData.title3 = "收款";
        }
        if (el == 5) {
          newData.title3 = "退款";
        }
        newPlatformDataList.push(newData);
      });
      return newPlatformDataList;
    },
    //整理车场数据
    getNewParkingLotDataList(parkingLotDataList) {
      let numList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let newParkingLotDataList = [];
      for (let i = 0; i < parkingLotDataList.length; i++) {
        const parking = parkingLotDataList[i];
        numList.forEach(el => {
          let newData = {
            title1: parking.parkName,
            title2: "临停",
            title3: "收款",
            dateList: parking.parkingLotDataList
          };
          if (el > 3) {
            newData.title2 = "长租";
          } else if (el > 6) {
            newData.title2 = "小计";
          }
          if (el == 2 || el == 5 || el == 8) {
            newData.title3 = "退款";
          }
          if (el == 3 || el == 6 || el == 9) {
            newData.title3 = "实收";
          }
          newParkingLotDataList.push(newData);
        });
      }
      return newParkingLotDataList;
    },
    //整理合计数据
    getNewTotalDataList(totalDataList) {
      let numList = [1, 2, 3];
      let newTotalDataList = [];
      numList.forEach(el => {
        let newData = {
          title1: "",
          title2: "合计",
          title3: "收款",
          dateList: totalDataList
        };
        if (el == 2) {
          newData.title3 = "退款";
        }
        if (el == 3) {
          newData.title3 = "实收";
        }
        newTotalDataList.push(newData);
      });
      return newTotalDataList;
    },
    //重置查询条件
    resetList() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        startDate: "", //开始时间
        endDate: "", //结束时间
        parkName: "" //停车场
      };
      this.getDefaultTime();
      // this.time = [];
      this.openLoading();
      this.getList();
    },
    openLoading() {
      let claeeName;
      if (this.$store.getters.sidebar.opened) {
        claeeName = "hasSidebar";
      } else {
        claeeName = "noSidebar";
      }
      this.listLoading = this.$loading({
        lock: true,
        text: "数据加载中...",
        customClass: claeeName, // *这里设置他的class名称,这里最重要
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },

    //获取数据列表
    getList() {
      let para = this.listQuery;
      capitalFlowDailyReportList(para)
        .then(response => {
          // this.list = response.data.list;
          // this.totalMoneyList = response.data;
          if (response.data) {
            this.getNewList(response.data);
          } else {
            this.list = [];
          }
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        })
        .catch(() => {
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        });
    },

    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },
    //导出
    toExport() {
      // // 获取 el-table 的引用
      // const table = this.$refs.tableExport;
      // if (!table) {
      //   console.error("表格引用未找到");
      //   return;
      // } else {
      //   console.log(table);
      // }

      // // 获取表格的标题和行数据
      // const header = Array.from(table.querySelectorAll("th")).map(
      //   th => th.textContent
      // );
      // const rows = Array.from(table.querySelectorAll("tr"))
      //   .slice(1)
      //   .map(tr =>
      //     Array.from(tr.querySelectorAll("td")).map(td => td.textContent)
      //   );

      // // 将数据转换为工作表对象
      // const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
      // const workbook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // // 生成 Excel 文件并保存
      // const excelBuffer = XLSX.write(workbook, {
      //   bookType: "xlsx",
      //   type: "array"
      // });
      var xlsxParam = { raw: false }; // 导出的内容只做解析，不进行格式转换
      let tables;
      tables = document.querySelector(".el-table__fixed");
      // tables = document.getElementById("tableExport"); // 获取表格元素
      let table_book = XLSX.utils.table_to_book(tables, xlsxParam);
      const table_write = XLSX.write(table_book, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      const blob = new Blob([table_write], {
        type: "application/octet-stream"
      });
      var elink = document.createElement("a");
      elink.download = "流水日报" + new Date().getTime() + ".xls";
      elink.style.display = "none";

      elink.href = URL.createObjectURL(blob);

      document.body.appendChild(elink);
      elink.click();

      document.body.removeChild(elink);
    },
    // 切换页码方法
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.openLoading();
      this.getList();
    },
    // 切换每页显示的方法
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.openLoading();
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.commit_page {
  position: relative;
}
.btn_box_text {
  padding: 15px;
  font-size: 12px;
  color: #aaa;
}
.content_box {
  .content_row {
    position: relative;
    height: 32px;
    line-height: 32px;
    .content_boxId {
      color: #8c8787;
      font-size: 14px;
      font-weight: bold;
    }
    .content_num {
      color: #8c8787;
      font-size: 12px;
      font-weight: bold;
    }
    .content_title {
      color: rgba($color: #828484, $alpha: 0.5);
      font-size: 14px;
      padding-right: 5px;
    }
  }
}
.teble_title {
  height: 108px;
  line-height: 108px;
  border: 1px solid #ebeef5;
}
.teble_title2 {
  height: 36px;
  line-height: 36px;
  border: 1px solid #ebeef5;
}
.teble_title3 {
  height: 27px;
  line-height: 27px;
}
</style>
