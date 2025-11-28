<template>
  <div class="homePage">
    <div id="full-size-area" class="full-size-area" style="display: none">
      <div class="full_top_box">
        <div class="full_top">
          <div class="device_name">{{ fullName }}</div>
        </div>
      </div>
      <div class="video_loading">视频加载中···</div>
      <transition name="plus-icon">
        <div class="full_window_button">
          <!-- <div @click="bigSizeSwitch(bigSizeId, false)">
            单屏
          </div> -->
          <div @click="fullSizeSwitch(fullId)">取消全屏</div>
        </div>
      </transition>
    </div>
    <div class="homePage_tab">
      <div class="homePage_tab_top">
        <div
          :class="
            pageType == 1 ? 'homePage_tab_top_btn' : 'homePage_tab_top_btn2'
          "
          v-has="{ red: 'operationalData', type: 1 }"
          @click="changeTab(1)"
        >
          运营数据
        </div>
        <div
          :class="
            pageType == 2 ? 'homePage_tab_top_btn' : 'homePage_tab_top_btn2'
          "
          v-has="{ red: 'monitoringCommand', type: 1 }"
          @click="changeTab(2)"
        >
          监控指挥
        </div>
        <div
          :class="
            pageType == 3 ? 'homePage_tab_top_btn' : 'homePage_tab_top_btn2'
          "
          v-has="{ red: 'securityWarning', type: 1 }"
          @click="changeTab(3)"
        >
          安防预警
        </div>
      </div>
      <!-- <el-tabs v-model="pageType" @tab-click="handleClick">
        <el-tab-pane label="运营数据" name="1"> -->
      <div
        class="operationalData"
        v-if="pageType == 1"
        v-has="{ red: 'operationalData', type: 1 }"
      >
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
                  {{ dataStatisticsVo.todayPayments | getMoney }}
                </div>
                <div class="homePage_top_card_textBox_text">
                  今日收款(元)
                </div>
              </div>
            </div>
            <div class="homePage_top_card">
              <div class="homePage_top_card_ico yesterdayPayments"></div>
              <div class="homePage_top_card_textBox">
                <div class="homePage_top_card_textBox_title">
                  {{ dataStatisticsVo.yesterdayPayments | getMoney }}
                </div>
                <div class="homePage_top_card_textBox_text">
                  昨日收款(元)
                </div>
              </div>
            </div>
            <div class="homePage_top_card">
              <div class="homePage_top_card_ico monthPayments"></div>
              <div class="homePage_top_card_textBox">
                <div class="homePage_top_card_textBox_title">
                  {{ dataStatisticsVo.monthPayments | getMoney }}
                </div>
                <div class="homePage_top_card_textBox_text">
                  本月收款(元)
                </div>
              </div>
            </div>
            <div class="homePage_top_card">
              <div class="homePage_top_card_ico yearPayments"></div>
              <div class="homePage_top_card_textBox">
                <div class="homePage_top_card_textBox_title">
                  {{ dataStatisticsVo.yearPayments | getMoney }}
                </div>
                <div class="homePage_top_card_textBox_text">
                  今年收款(元)
                </div>
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
              <VehicleFlowChart
                height="100%"
                width="100%"
                v-if="pageType == '1'"
                ref="vehicleFlowChart"
              />
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
                v-if="pageType == '1'"
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
                  header-align="center"
                  align="left"
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
                    <span class="content">{{
                      scope.row.totalPayMoney | getMoney
                    }}</span>
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
                  header-align="center"
                  align="left"
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
      <!-- </el-tab-pane>
        <el-tab-pane label="监控指挥" name="2"> -->
      <div class="monitoringCommand" v-if="pageType == 2">
        <div class="monitoringCommand-top">
          <div class="search_box" style="margin:0">
            <span class="search_content">
              <div class="search_content_title">停车场</div>
              <el-select
                v-model="curPark"
                placeholder="请选择"
                clearable
                @change="parkChange"
                class="filter-item"
                style="width: 72%"
              >
                <el-option
                  v-for="item in parkingList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </span>
            <!-- <span class="search_content">
                  <DistrictTree
                    ref="treedate"
                    placeholder="请选择"
                    v-bind:ParentComponentParam="openCameraList"
                    class="vue-treeselect__input"
                    @treeItemSelect="treeItemSelect"
                  ></DistrictTree>
                </span> -->

            <!-- <span class="search_content">
                  <div class="search_content_title">设备列表</div>
                  <el-select
                    v-model="listQuery.cameraId"
                    placeholder="请选择"
                    clearable
                    class="filter-item"
                    style="width: 72%"
                  >
                    <el-option
                      v-for="item in cameraList"
                      :key="item.enumValue"
                      :label="item.enumName"
                      :value="item.enumValue"
                    />
                  </el-select>
                </span> -->
          </div>
        </div>
        <div class="monitoringCommand-main">
          <div class="monitoringCommand-main-left">
            <div
              id="big-size-area"
              class="big-size-area"
              v-show="bigShow"
              @mouseover="onMouseOver()"
              @mouseleave="onMouseLeave()"
            >
              <div class="device_name">{{ bigName }}</div>
              <!-- <div class="device-text">
                本时段到访
                <span class="device-text-num">{{afterTotal}}</span>
                人
              </div>-->
              <div class="video_loading">视频加载中···</div>
              <transition name="plus-icon">
                <div class="big_window_button" v-if="buttonShow">
                  <div @click="bigSizeSwitch(bigSizeId, false)">
                    取消单屏
                  </div>
                  <div @click="fullSizeSwitch(bigSizeId)">全屏</div>
                </div>
              </transition>
            </div>

            <el-col
              :span="12"
              v-for="(videoItem, index) in videoItems"
              :key="index"
              class="device-area"
            >
              <div class="device-area-top">
                <div class="device-area-top-title">
                  <img
                    src="../../assets/images/homePage/title_c.png"
                    alt=""
                    class="device-area-top-title-img"
                  />
                  <DistrictTree
                    :ref="videoItem.treeId"
                    placeholder="请选择"
                    :treeData="treeData"
                    :treeNo="index"
                    class="device-area-top-title-text"
                    style="width: 200px"
                    @treeItemSelect="treeItemSelect"
                  ></DistrictTree>
                </div>
                <!-- <img
                      src="../../assets/images/homePage/title_b.png"
                      alt=""
                      class="device-area-top-img"
                    /> -->
              </div>
              <div class="device-area-video">
                <!-- <div v-if="!videoItem.status" class="no-device-icon"></div> -->

                <div v-if="!videoItem.status" class="no-device-text-box">
                  <img
                    src="../../assets/images/homePage/noCamera.png"
                    alt=""
                    class="no-device-img"
                  />
                  <div class="no-device-text">
                    未选择设备
                  </div>
                </div>
                <videoWindow
                  :ref="videoItem.refId"
                  :id="videoItem.pwId"
                  v-if="videoItem.status"
                  :bindId="videoItem.refId"
                  :src="videoItem.src"
                  @bigSizeSwitch="bigSizeSwitch"
                  @fullSizeSwitch="fullSizeSwitch"
                ></videoWindow>
                <!-- <videoWebRTCNew
                      :ref="videoItem.refId"
                      :id="videoItem.pwId"
                      :bindId="videoItem.refId"
                      :cameraName="videoItem.cameraName"
                      v-if="videoItem.status && videoType === '本地'"
                      :src="videoItem.src"
                      :ip="videoItem.ip"
                      :port="videoItem.port"
                      :name="videoItem.name"
                      :videoPath="videoItem.videoPath"
                      @fullSizeSwitch="fullSizeSwitch"
                      @bigSizeSwitch="bigSizeSwitch"
                    ></videoWebRTCNew> -->
              </div>

              <!-- @speed="speed" -->
            </el-col>
          </div>
          <div class="monitoringCommand-main-right" v-if="pageType == 2">
            <div class="monitoringCommand-main-top">
              <div class="monitoringCommand-main-top-title">
                <img
                  src="../../assets/images/homePage/title_p.png"
                  alt=""
                  class="monitoringCommand-main-top-title-img"
                />
                <span class="monitoringCommand-main-top-title-text"
                  >海创停车场平面图</span
                >
                <div class="monitoringCommand-main-top-parking" v-if="curMap">
                  <span
                    class="monitoringCommand-main-top-parking-name parkinColor1"
                    >总车位数：</span
                  >
                  <span
                    class="monitoringCommand-main-top-parking-number parkinColor1"
                    >{{ parkingNumbers.all }}</span
                  >
                  <span
                    class="monitoringCommand-main-top-parking-name parkinColor2"
                    >空闲：</span
                  >
                  <span
                    class="monitoringCommand-main-top-parking-number parkinColor2"
                    >{{ parkingNumbers.idle }}</span
                  >
                  <span
                    class="monitoringCommand-main-top-parking-name parkinColor3"
                    >占用：</span
                  >
                  <span
                    class="monitoringCommand-main-top-parking-number parkinColor3"
                    >{{ parkingNumbers.occupy }}</span
                  >
                  <span
                    class="monitoringCommand-main-top-parking-name parkinColor4"
                    >预约：</span
                  >
                  <span
                    class="monitoringCommand-main-top-parking-number parkinColor4"
                    >{{ parkingNumbers.reservation }}</span
                  >
                  <span
                    class="monitoringCommand-main-top-parking-name parkinColor5"
                    >故障：</span
                  >
                  <span
                    class="monitoringCommand-main-top-parking-number parkinColor5"
                    >{{ parkingNumbers.fault }}</span
                  >
                </div>
              </div>
              <img
                src="../../assets/images/homePage/title_b.png"
                alt=""
                class="monitoringCommand-main-top-img"
              />
            </div>
            <div v-if="!curMap" class="monitoringCommand-main-top-noMap">
              <img
                src="../../assets/images/homePage/noMap.png"
                alt=""
                class="monitoringCommand-main-top-noMap-img"
              />
              <div class="monitoringCommand-main-top-noMap-text">
                暂无地图
              </div>
            </div>
            <OpenlayersMap
              v-else
              ref="openlayersMap"
              :curMap="curMap"
              :baseWidth="baseWidth"
              :baseHeight="baseHeight"
              :key="curPark + curMap"
            />
          </div>
        </div>
      </div>
      <!-- </el-tab-pane>
        <el-tab-pane label="安防预警" name="3"> -->
      <div class="securityWarning" v-if="pageType == 3">
        <div class="securityWarning-top">
          <div class="search_box" style="margin:0">
            <span class="search_content">
              <div class="search_content_title">停车场</div>
              <el-select
                v-model="curPark"
                placeholder="请选择"
                clearable
                @change="parkChange"
                class="filter-item"
                style="width: 72%"
              >
                <el-option
                  v-for="item in parkingList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </span>
          </div>
        </div>
        <div class="securityWarning-main">
          <div class="securityWarning-left" v-if="pageType == 3">
            <div class="securityWarning-left-top">
              <div class="securityWarning-left-top-title">
                <img
                  src="../../assets/images/homePage/title_p.png"
                  alt=""
                  class="securityWarning-left-top-title-img"
                />
                <span class="securityWarning-left-top-title-text"
                  >海创停车场平面图</span
                >
              </div>
              <img
                src="../../assets/images/homePage/title_b.png"
                alt=""
                class="securityWarning-left-top-img"
              />
            </div>
            <div v-if="!curMap" class="securityWarning-left-top-noMap">
              <img
                src="../../assets/images/homePage/noMap.png"
                alt=""
                class="securityWarning-left-top-noMap-img"
              />
              <div class="securityWarning-left-top-noMap-text">
                暂无地图
              </div>
            </div>

            <OpenlayersMapCamera
              v-else
              ref="OpenlayersMapCamera"
              :curMap="curMap"
              :baseWidth="baseWidth"
              :baseHeight="baseHeight"
              :key="curPark + curMap"
            />
          </div>
          <div class="securityWarning-right">
            <div class="securityWarning-right-top">
              <div class="securityWarning-right-top-title">
                <img
                  src="../../assets/images/homePage/title_p.png"
                  alt=""
                  class="securityWarning-right-top-title-img"
                />
                <span class="securityWarning-right-top-title-text"
                  >告警列表</span
                >
              </div>
              <img
                src="../../assets/images/homePage/title_b.png"
                alt=""
                class="securityWarning-right-top-img"
              />
            </div>
            <div class="securityWarning-right-main">
              <div class="securityWarning-right-main-top">
                <el-select
                  v-model="listQuery.dailyTrafficFlowPark"
                  placeholder="请选择停车场"
                  clearable
                  class="filter-item"
                  @change="getStatistics"
                  style="width: 150px;margin-left:10px"
                  size="small"
                >
                  <el-option
                    v-for="item in parkingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="listQuery.dailyTrafficFlowPark"
                  placeholder="请选择停车场"
                  clearable
                  class="filter-item"
                  @change="getStatistics"
                  style="width: 150px;margin-left:10px"
                  size="small"
                >
                  <el-option
                    v-for="item in parkingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="listQuery.dailyTrafficFlowPark"
                  placeholder="请选择停车场"
                  clearable
                  class="filter-item"
                  @change="getStatistics"
                  style="width: 150px;margin-left:10px"
                  size="small"
                >
                  <el-option
                    v-for="item in parkingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <span class="securityWarning-right-main-top-pageBox"
                  >共 {{ cameraListQuery.total }} 条</span
                >
              </div>
              <div class="securityWarning-right-main-content">
                <ul
                  class="list"
                  v-infinite-scroll="load"
                  infinite-scroll-disabled="disabled"
                >
                  <li
                    v-for="(el, index) in alarmList"
                    :key="index"
                    class="list-item"
                  >
                    {{ el }}
                  </li>
                </ul>
                <p v-if="loading">加载中...</p>
                <p v-if="noMore">没有更多了</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </el-tab-pane>
      </el-tabs> -->
    </div>
    <!-- <div class="homePage_btn" @click="addCar">.</div> -->
    <div class="homePage_btn" @click="addCar">.</div>
  </div>
</template>

<script>
import {
  homepageStatistics, //首页数据统计
  monitoringCommandPage, //监控指挥分页
  monitoringCommand, //车场车位平面图数据
  vehicleInformationOnRoad, //路上的车辆信息
  vehicleRetention, //车辆驻留
  deviceListTree //设备树形列表
} from "@/api/homePage";
import {
  getInfo //设备树形列表
} from "@/api/user";

import VehicleFlowChart from "@/components/Charts/vehicleFlowChart"; //当日车流实时趋势1
import MonthlyCollection from "@/components/Charts/monthlyCollection"; //当日车流实时趋势1
import OpenlayersMap from "@/components/Map/openlayersMap"; //当日车流实时趋势1
import OpenlayersMapCamera from "@/components/Map/openlayersMapCamera"; //当日车流实时趋势1
import DistrictTree from "./components/districtTree";
import videoWindow from "@/components/Video/videoWindow";
import user from "@/store/modules/user"; // has directive

import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";

export default {
  name: "HomePage",
  components: {
    VehicleFlowChart,
    MonthlyCollection,
    videoWindow, //flv视频流播放
    OpenlayersMap,
    OpenlayersMapCamera,
    DistrictTree
  },

  data() {
    const videoItems = [];
    for (var i = 1; i <= 4; i++) {
      const videoItem = {
        id: i, //编号
        refId: "video-w" + i,
        pwId: "p-video-w" + i, //外层div的id
        mwId: "videoM" + i, //外层div的id
        treeId: "tree" + i,
        src: "", //视频连接
        deviceId: null, //对应的相机设备编号
        status: 0, //状态： 0-未启动 1-播放中
        isFull: false, //是否全屏模式
        ip: "", //ip
        port: "", //端口
        name: "", //视频名
        cameraName: "" //像机名称
      };
      videoItems.push(videoItem);
    }

    return {
      listQuery: {
        monthlyCollectionStatisticsPark: null, //当月收款筛选停车场id
        dailyTrafficFlowPark: null //车流筛选停车场id
      },
      pageType: "1", //1.运营数据 2.监控指挥 3.安防预警
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
      feeRate: [], //当日实时收费率
      /************* 监控指挥 *************/
      parkingNumbers: {
        all: 0, //全部
        idle: 0, //空闲
        occupy: 0, //占用
        reservation: 0, //预约
        fault: 0 //故障
      },
      isFull: false,
      bigShow: false,
      bigName: "", //大屏设备名称
      fullName: "", //全屏设备名称
      fullId: "", //全屏设备名称
      isFullCamera: "",
      bigSizeId: null, //大窗id
      fullSizeId: null, //全屏id
      buttonShow: false, //大屏按钮显示隐藏
      reconnectNo: 0, //重连次数
      curPark: null,
      firstRendering: true, //首次渲染
      curMap: "", //当前地图
      curMapId: null, //当前地图id
      baseWidth: 1080,
      baseHeight: 758,
      videoItems: videoItems,
      treeData: [],
      openCameraList: [],
      cameraLightList: [],
      getInfoInterval: null,
      /************* 监控指挥 *************/
      websocketInterval: null,
      /************* 安防预警 *************/
      cameraListQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        type: null,
        state: null,
        startTime: "", //开始时间
        endTime: "" //结束时间
      },
      alarmList: [],
      loading: false,
      noMore: false
      /************* 安防预警 *************/
    };
  },
  created() {
    // const permission = user.state.Permission;
    // console.log(123, permission);
    // if (this.pageType == "1") {
    //   this.getStatistics();
    // }
    this.getparking();
    this.getInfo();
    this.initWebSocket();
  },
  beforeDestroy() {
    if (this.getInfoInterval) {
      clearInterval(this.getInfoInterval);
      this.getInfoInterval = null;
    }
    if (this.websocketInterval) {
      clearInterval(this.websocketInterval);
      this.websocketInterval = null;
    }
  },

  methods: {
    //获取当前首页权限
    getInfo() {
      let para = {};
      getInfo(para).then(res => {
        console.log(123, res);
        let list = res.data.resourceList;
        const hasRes1 = list.some(item => item.resourceId == 911101);
        const hasRes2 = list.some(item => item.resourceId == 911102);
        const hasRes3 = list.some(item => item.resourceId == 911201);
        console.log(1, hasRes1);
        console.log(2, hasRes2);
        console.log(3, hasRes3);
        if (hasRes1) {
          this.changeTab(1);
        } else if (hasRes2) {
          this.changeTab(2);
        } else if (hasRes3) {
          this.changeTab(3);
        }
      });
    },
    initWebSocket() {
      // 初始化weosocket
      // console.log("websocket", this.GLOBAL.ws.onopen);
      // const wsuri = this.GLOBAL.getBaseWs();
      // this.websock = this.GLOBAL.ws;
      let wsuri = "ws://218.60.119.172:6379/hiCar/websocket/vehicle";
      // let wsuri = "ws://218.60.95.37:8081/deviceClient";
      // https://jizhi-pay.ss-cas.com:4433/hiCar/websocket/endpoint
      this.websock = new WebSocket(wsuri);
      // this.webType = this.GLOBAL.wsType;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      // //连接建立之后执行send方法发送数据
      // let ip = this.GLOBAL.ip;
      // let str = this.userId + "_" + ip + "_1";
      // let org = { type: "register", userId: str };
      // let a = Cookies.get("websocket") + 1;
      // Cookies.set(("websocket", a));
      console.log("连接成功");
      this.websocketInterval = setInterval(() => {
        let org = { type: "register" };
        this.websocketsend(JSON.stringify(org));
      }, 270000);
    },
    websocketSelect(code, checked) {
      //选择设备之后执行send方法发送数据
      // let ip = this.GLOBAL.ip;
      // let str = this.userId + "_" + ip + "_1";
      // let arr = [];
      // this.cameraLightList.forEach(el => {
      //   arr.push(el.regionCode);
      // });
      // if (checked) {
      //   let org = {
      //     type: "addSelectedDevice",
      //     userId: str,
      //     deviceIds: code
      //   };
      //   this.websocketsend(JSON.stringify(org));
      //   let para = { productCode: code, flag: 1, vid: this.GLOBAL.ip };
      //   cameraDealStream(para).then(response => {});
      // } else {
      //   let org = {
      //     type: "delSelectedDevice",
      //     userId: str,
      //     deviceIds: code
      //   };
      //   this.websocketsend(JSON.stringify(org));
      // }
    },
    websocketonerror() {
      //连接建立失败重连
      console.log("重连次数", this.reconnectNo);
      if (this.reconnectNo < 10) {
        setTimeout(() => {
          this.initWebSocket();
          this.reconnectNo = this.reconnectNo + 1;
        }, 10000);
      }
    },
    websocketonmessage(e) {
      //数据接收
      console.log("接收信息", e);

      if (e.data) {
        const redata = JSON.parse(e.data.replace(/[\r\n]/g, ""));
        console.log("接收信息", redata);
      }
    },
    websocketsend(Data) {
      // console.log("发送消息2", Data);
      // console.log("发送消息2", this.websock);
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
      // this.initWebSocket();
      // this.websocketonerror()
    },

    handleClick() {
      console.log(123, this.pageType);
      if (this.pageType == "1") {
        this.getStatistics();
      } else {
        this.getparking();
        this.curPark = null;
        this.curMap = null;
        this.curMapId = null;
        this.firstRendering = true;
      }
    },
    changeTab(e) {
      this.pageType = e;
      if (e == "1") {
        this.getStatistics();
      } else {
        this.getparking();
        this.curPark = null;
        this.curMap = null;
        this.curMapId = null;
        this.firstRendering = true;
      }
    },
    load() {},
    /************* 监控指挥 *************/
    //演示用来添加一个车辆轨迹
    addCar() {
      this.$refs.openlayersMap.newCar();
    },
    //演示用来添加一个驻留车辆
    retentionCar() {
      this.$refs.openlayersMap.retentionCar();
    },

    parkChange(e) {
      if (this.getInfoInterval) {
        clearInterval(this.getInfoInterval);
        this.getInfoInterval = null;
      }
      if (e) {
        this.getMonitoringCommandPage();
        this.firstRendering = true;
        if (this.pageType == "2") {
          this.getDeviceListTree();
        }
      } else {
        this.curMapId = null;
        this.curMap = "";
      }
      this.bigSizeId = null;
      this.bigShow = false;

      this.resetPage();
    },
    resetPage() {
      let videoItems = [];
      for (var i = 1; i <= 4; i++) {
        let videoItem = {
          id: i, //编号
          refId: "video-w" + i,
          pwId: "p-video-w" + i, //外层div的id
          mwId: "videoM" + i, //外层div的id
          treeId: "tree" + i,
          src: "", //视频连接
          deviceId: null, //对应的相机设备编号
          status: 0, //状态： 0-未启动 1-播放中
          isFull: false, //是否全屏模式
          ip: "", //ip
          port: "", //端口
          name: "", //视频名
          cameraName: "" //像机名称
        };
        videoItems.push(videoItem);
      }
      this.videoItems = videoItems;
      this.$refs.tree1[0].handleClear();
      this.$refs.tree2[0].handleClear();
      this.$refs.tree3[0].handleClear();
      this.$refs.tree4[0].handleClear();
    },
    //鼠标移上
    onMouseOver() {
      this.buttonShow = true;
    },
    //鼠标移出
    onMouseLeave() {
      this.buttonShow = false;
    },

    getMonitoringCommandPage() {
      let para = { pageNum: 1, pageSize: 1000, parkingLotId: this.curPark };
      monitoringCommandPage(para).then(response => {
        if (response.rows.length > 0) {
          this.curMapId = response.rows[0].id;
          this.curMap = response.rows[0].img;
          this.baseWidth = response.rows[0].width;
          this.baseHeight = response.rows[0].height;
          this.getInfoInterval = setInterval(() => {
            if (this.pageType == "2") {
              this.getMonitoringCommand();
              this.getVehicleRetention();
            } else if (this.pageType == "3") {
              this.getCameraMap();
            }

            // this.getVehicleInformationOnRoad();
          }, 2000);
        } else {
          this.curMapId = null;
          this.curMap = null;
        }
      });
    },
    //获取安防预警地图信息
    getCameraMap() {
      let para = { parkId: this.curPark, mapId: this.curMapId };
      vehicleInformationOnRoad(para).then(response => {
        let cars = response.data;
        if (this.curMap) {
          this.$refs.OpenlayersMapCamera.getCarLoation(cars);
        }
      });
    },
    //车场车位平面图数据
    getMonitoringCommand() {
      let para = { id: this.curMapId };
      let parkingNumbers = {
        all: 0, //全部
        idle: 0, //空闲
        occupy: 0, //占用
        reservation: 0, //预约
        fault: 0 //故障
      };

      monitoringCommand(para).then(response => {
        let berths = response.data.parkingSpaceList;
        parkingNumbers.all = berths.length;
        berths.forEach(el => {
          if (el.status == 1) {
            //空闲
            parkingNumbers.idle += 1;
          } else if (el.status == 3) {
            //预约
            parkingNumbers.reservation += 1;
          } else if (el.status == 2) {
            //占用
            parkingNumbers.occupy += 1;
          } else if (el.status == 0) {
            //故障
            parkingNumbers.fault += 1;
          }
        });
        this.parkingNumbers = parkingNumbers;
        if (this.curMap) {
          if (this.firstRendering) {
            this.$refs.openlayersMap.generateSampleData(berths);
            this.firstRendering = false;
          } else {
            this.$refs.openlayersMap.typeChange(berths);
          }
        }
      });
    },
    //路上的车辆信息
    getVehicleInformationOnRoad() {
      let para = { parkId: this.curPark, mapId: this.curMapId };
      vehicleInformationOnRoad(para).then(response => {
        let cars = response.data;
        if (this.curMap) {
          // if (this.firstRendering) {
          //   this.$refs.openlayersMap.getCarLoation(cars);
          //   this.firstRendering = false;
          // } else {
          this.$refs.openlayersMap.getCarLoation(cars);
          // }
        }
      });
    },
    //滞留车辆
    async getVehicleRetention() {
      let para = { mapId: this.curMapId };
      vehicleRetention(para).then(response => {
        let cars = response.data;
        if (this.curMap) {
          // if (this.firstRendering) {
          //   this.$refs.openlayersMap.getCarLoation(cars);
          //   this.firstRendering = false;
          // } else {
          this.$refs.openlayersMap.retentionCar(cars);

          // }
          this.getVehicleInformationOnRoad();
        }
      });
    },
    getDeviceListTree() {
      let para = { parkId: this.curPark };
      deviceListTree(para).then(response => {
        this.treeData = response.data;
      });
    },
    //选择设备
    treeItemSelect(data, index) {
      if (data) {
        this.playByDeviceId(data, index);
      } else {
        const videoItem = this.videoItems[index];
        Object.assign(videoItem, { status: 0 });
        Object.assign(videoItem, { deviceId: null });
        Object.assign(videoItem, { cameraName: "" });
        Object.assign(videoItem, { src: null });
      }
    },
    //停止视频
    stopByDeviceId(deviceId) {
      const videoItem = this.getVideoItemByDevice(deviceId);
      //首先取得视频播放窗口对象，调用停止播放的方法
      if (videoItem) {
        // const videoWindow = this.$refs[videoItem.refId][0];
        // videoWindow.stop();
        //通过设置状态销毁组件
        videoItem.status = 0;
        videoItem.deviceId = null;
      }
    },
    playByDeviceId(data, index) {
      //首先获取一个空闲的播放窗口对象
      const videoItem = this.videoItems[index];
      if (!videoItem) {
        return;
      }
      videoItem.status = 0;
      videoItem.deviceId = null;
      videoItem.cameraName = "";
      Object.assign(videoItem, { src: null });

      setTimeout(() => {
        videoItem.deviceId = data.deviceId;
        videoItem.cameraName = data.deviceName;
        // videoItem.ip = data.streamIp;
        // videoItem.videoPath = data.videoPath;
        // if (data.streamPort) {
        //   videoItem.port = data.streamPort.toString();
        // }
        // videoItem.name = data.streamName;
        //注意这里不能直接用等号进行引用赋值，需要进行拷贝
        // Object.assign(videoItem, { src: "ws://" + src });
        Object.assign(videoItem, { src: data.fullStreamPath });
        //设置状态为播放中,后续播放行为由组件自行完成
        videoItem.status = 1;
      }, 300);
    },
    //根据视频对象编号取得视频对象
    getVideoItemById(vId) {
      let videoItem = null;
      this.videoItems.some(item => {
        if (item.refId === vId) {
          videoItem = item;
          return true;
        }
      });
      return videoItem;
    },

    //大窗口显示切换
    bigSizeSwitch(vId, data) {
      this.bigShow = data;
      this.videoItems.forEach(el => {
        if (el.refId == vId) {
          this.bigName = el.cameraName;
        }
      });
      const videoItem = this.getVideoItemById(vId);
      //设置单个播放对象全屏状态
      const videoWindow = document.getElementById(vId);
      const body = document.getElementsByTagName("body")[0];
      if (data) {
        //大窗口态设置
        // document.getElementById("big-size-area").style.display = "block";
        this.bigSizeId = vId;
        // body.style.overflow = "hidden";
        //移动video组件到大窗口区域
        document.getElementById("big-size-area").style.display = "block";

        document.getElementById("big-size-area").appendChild(videoWindow);
      } else {
        //大窗口状态设置
        // document.getElementById("big-size-area").style.display = "none";
        this.bigSizeId = null;
        // body.style.overflow = "scroll";
        //移动回原区域
        document.getElementById(videoItem.pwId).appendChild(videoWindow);
      }
    },
    //全屏显示切换
    fullSizeSwitch(vId) {
      this.fullSizeId = vId;
      this.videoItems.forEach(el => {
        if (el.refId == vId) {
          this.fullName = el.cameraName;
          this.fullId = vId;
        }
      });

      const videoItem = this.getVideoItemById(vId);

      //设置单个播放对象全屏状态
      videoItem.isFull = !videoItem.isFull;
      const videoWindow = document.getElementById(vId);
      // const body = document.getElementsByTagName("body")[0];

      //将大屏关闭（即使是大屏切到全屏，回来也是小窗口）
      this.bigSizeId = null;
      //大窗口状态设置
      // document.getElementById("big-size-area").style.display = "none";
      // body.style.overflow = "scroll";
      //移动回原区域
      document.getElementById(videoItem.pwId).appendChild(videoWindow);
      this.bigShow = false;
      if (videoItem.isFull) {
        //全局全屏状态设置
        this.isFull = true;
        this.isFullCamera = videoItem.cameraName;
        document.getElementById("full-size-area").style.display = "block";
        this.fullSizeId = vId;

        // body.style.overflow = "hidden";
        //移动video组件到全局窗口区域
        document.getElementById("full-size-area").appendChild(videoWindow);
      } else {
        this.isFull = false;
        this.isFullCamera = "";
        //全局全屏状态设置
        document.getElementById("full-size-area").style.display = "none";
        this.fullSizeId = null;

        // body.style.overflow = "scroll";
        //移动回原区域
        document.getElementById(videoItem.pwId).appendChild(videoWindow);
      }
    },

    //设备选择事件触发

    /************* 监控指挥 *************/

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

<style lang="scss">
.homePage {
  padding: 0 20px;
  position: relative;
  .homePage_tab {
    position: absolute;
    background: #e8f2f1;
    top: -34px;
    left: 0;
    padding-left: 20px;
    width: calc(100vw - 20px);
  }
  .homePage_tab_top {
    height: 40px;
    padding: 5px 10px;
    display: flex;
  }
  .homePage_tab_top_btn {
    height: 30px;
    line-height: 30px;
    width: 100px;
    color: #037659;
    text-align: center;
    margin: 0 10px;
    border-bottom: 2px solid #037659;
    cursor: pointer;
  }
  .homePage_tab_top_btn2 {
    height: 30px;
    line-height: 30px;
    width: 100px;
    color: #303133;
    text-align: center;
    margin: 0 10px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }
  .homePage_btn {
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 10px;
    height: 10px;
    cursor: pointer;
  }
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
            font-size: 20px;
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
.video-window {
  height: 100%;
  width: 100%;
}
.video-window video {
  height: 100%;
  width: 100%;
  object-fit: fill;
}
.full-size-area {
  position: fixed !important;
  z-index: 10002;
  left: 0px !important;
  top: 0px !important;
  height: calc(100vh) !important;
  width: calc(100vw) !important;
  background: rgba($color: #000, $alpha: 0.8);
  .full_top_box {
    position: absolute;
    z-index: 1009;
    top: 0;
    left: 0;
    height: 30px;
    width: 100%;
  }
  .full_top {
    height: 40px;
    width: 100%;
    background: rgba($color: #000, $alpha: 0.6);
  }
  .markCanvasFull {
    position: absolute;
    z-index: 1006;
    height: 100vh;
    width: 100vw;
    top: 0px;
    left: 0px;
  }

  .mark {
    position: absolute;
    z-index: 1007;
    height: 100%;
    width: 100%;
    top: 0px;
    left: 0px;
  }
  .device_name {
    color: #2eb8e9;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    padding-left: 10px;
  }
  .device_switch {
    position: absolute;
    color: #fff;
    top: 3px;
    right: 0px;
    width: 90px;
    height: 30px;
    line-height: 24px;
    cursor: pointer;
  }

  // .centeredVideo {
  //   z-index: 100;
  //   height: calc(100vh) !important;
  //   width: calc(100vw) !important;
  // }
  video {
    height: 100%;
    width: 100%;
    object-fit: fill;
  }
  .full_window_button {
    z-index: 1008;
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    background: rgba($color: #000000, $alpha: 0.4);
    display: flex;
    align-items: right;
    justify-content: right;
    transform: translateY(0);
    /* 移回也需要0.4s时间过渡 */
    transition: transform 0.5s;
    div {
      width: 100px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
    }
  }
}
.big-size-area {
  position: absolute !important;
  z-index: 1003;
  left: 0px !important;
  top: 0px !important;
  width: calc(100vw - 900px);
  height: calc(100vh - 260px);
  // width: calc(100vw - 840px);
  background: rgba($color: #000, $alpha: 1);
  .markCanvas {
    position: absolute;
    z-index: 1006;
    height: calc(100vh - 260px);
    width: 100%;
    top: 23px;
    left: 0px;
  }
  .mark {
    z-index: 1007;
    position: absolute;
    height: calc(100vh - 260px);
    width: 100%;
    top: 23px;
    left: -1px;
  }

  .device_name {
    // background: rgba($color: #000, $alpha: 0.8);
    color: #2eb8e9;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
  }
  .big_window_button {
    z-index: 1008;
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    background: rgba($color: #000000, $alpha: 0.4);
    display: flex;
    align-items: right;
    justify-content: right;
    transform: translateY(0);
    /* 移回也需要0.4s时间过渡 */
    transition: transform 0.5s;
    div {
      width: 100px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
    }
  }
  .plus-icon-enter-active {
    transition: opacity 0.5s;
  }
  .plus-icon-enter {
    opacity: 0;
  }
  .plus-icon-leave-active {
    transition: opacity 0.5s;
  }
  .plus-icon-leave-to {
    opacity: 0;
  }

  video {
    position: absolute;
    z-index: 1005;
    width: calc(100vw - 900px) !important;
    height: calc(100vh - 360px) !important;
    object-fit: fill;
  }
  .video_loading {
    position: absolute;
    z-index: 1004;
    height: calc(100vh - 260px);
    line-height: calc(100vh - 260px);
    width: 100%;
    font-size: 24px;
    text-align: center;
    color: #ccc;
  }
}

.monitoringCommand {
  .monitoringCommand-top {
    height: 40px;
  }
  .monitoringCommand-main {
    margin-top: 15px;
    background: #f3f9f7;
    padding: 10px;
    box-shadow: 0px 2px 9px 0px rgba(3, 118, 89, 0.16);
    border-radius: 10px;
    border: 1px solid #b4d5cc;
    display: flex;
    .monitoringCommand-main-left {
      position: relative;
      width: calc(100vw - 900px);
      height: calc(100vh - 260px);

      .device-area {
        height: calc(50vh - 130px);
        padding: 0 5px;
        .device-area-top {
          height: 40px;
          position: relative;
          padding: 5px 0;
          .device-area-top-title {
            height: 20px;
            display: flex;
            align-items: center;
            margin: 0;
            .device-area-top-title-img {
              height: 18px;
            }
            .device-area-top-title-text {
              margin-left: 10px;
            }
          }
          .device-area-top-img {
            position: absolute;
            width: 440px;
            height: 3px;
            top: 23px;
          }
        }
        .device-area-video {
          height: calc(50vh - 180px);
          background: #000;
          color: #fff;
        }
        .no-device-icon {
        }
        .no-device-text-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: calc(50vh - 160px);
          .no-device-img {
            width: 60px;
            height: 48px;
          }
          .no-device-text {
            width: 100px;
            height: 48px;
            line-height: 48px;
            text-align: center;
          }
        }
      }
    }
    .monitoringCommand-main-right {
      width: 820px;
      height: calc(100vh - 260px);
      margin-left: 30px;
      #map {
        height: calc(100vh - 300px);
      }
      .monitoringCommand-main-top {
        height: 35px;
        position: relative;
        .monitoringCommand-main-top-title {
          height: 20px;
          display: flex;
          align-items: center;
          margin: 0;
          .monitoringCommand-main-top-title-img {
            height: 18px;
          }
          .monitoringCommand-main-top-title-text {
            width: 230px;
            margin-left: 10px;
          }
          .monitoringCommand-main-top-parking {
            width: 550px;
            margin-top: 5px;
            font-weight: bold;
            text-align: right;
            .monitoringCommand-main-top-parking-name {
              margin-left: 10px;
            }
            .parkinColor1 {
              color: #499efb;
            }
            .parkinColor2 {
              color: #33cc33;
            }
            .parkinColor3 {
              color: #f50a0a;
            }
            .parkinColor4 {
              color: #ffa409;
            }
            .parkinColor5 {
              color: #666666;
            }
          }
        }
        .monitoringCommand-main-top-img {
          position: absolute;
          width: 440px;
          height: 3px;
          top: 23px;
        }
      }
      .monitoringCommand-main-top-noMap {
        width: 820px;
        height: calc(100vh - 300px);
        // background: #ccc;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #999;
        border-radius: 5px;
        .monitoringCommand-main-top-noMap-img {
          width: 234px;
          height: 172px;
        }
        .monitoringCommand-main-top-noMap-text {
          width: 100px;
          height: 80px;
          line-height: 80px;
          font-size: 24px;
          color: #485451;
        }
      }
    }
  }
}
.securityWarning {
  .securityWarning-main {
    margin-top: 15px;
    background: #f3f9f7;
    padding: 10px;
    box-shadow: 0px 2px 9px 0px rgba(3, 118, 89, 0.16);
    border-radius: 10px;
    border: 1px solid #b4d5cc;
    display: flex;
    .securityWarning-left {
      position: relative;
      width: calc(100vw - 750px);
      height: calc(100vh - 260px);
    }
    .securityWarning-left {
      position: relative;
      width: calc(100vw - 750px);
      height: calc(100vh - 260px);
      margin-left: 10px;
      .securityWarning-left-top {
        height: 35px;
        position: relative;

        .securityWarning-left-top-title {
          height: 20px;
          display: flex;
          align-items: center;
          margin: 0;
          .securityWarning-left-top-title-img {
            height: 18px;
          }
          .securityWarning-left-top-title-text {
            width: 230px;
            margin-left: 10px;
          }
        }
        .securityWarning-left-top-img {
          position: absolute;
          width: 440px;
          height: 3px;
          top: 23px;
        }
      }
      .securityWarning-left-top-noMap {
        width: calc(100vw - 750px);
        height: calc(100vh - 300px);
        // background: #ccc;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #999;
        border-radius: 5px;
        .securityWarning-left-top-noMap-img {
          width: 234px;
          height: 172px;
        }
        .securityWarning-left-top-noMap-text {
          width: 100px;
          height: 80px;
          line-height: 80px;
          font-size: 24px;
          color: #485451;
        }
      }
    }
    .securityWarning-right {
      width: 670px;
      height: calc(100vh - 260px);
      margin-left: 20px;
      .securityWarning-right-top {
        height: 35px;
        position: relative;

        .securityWarning-right-top-title {
          height: 20px;
          display: flex;
          align-items: center;
          margin: 0;
          .securityWarning-right-top-title-img {
            height: 18px;
          }
          .securityWarning-right-top-title-text {
            width: 230px;
            margin-left: 10px;
          }
        }
        .securityWarning-right-top-img {
          position: absolute;
          width: 440px;
          height: 3px;
          top: 23px;
        }
      }
      .securityWarning-right-main {
        width: 650px;
        height: calc(100vh - 300px);
        border: 1px solid #999;
        border-radius: 5px;
        .securityWarning-right-main-top {
          height: 50px;
          padding-top: 10px;
          .securityWarning-right-main-top-pageBox {
            display: inline-block;
            width: 120px;
            height: 32px;
            line-height: 32px;
            text-align: right;
          }
        }
        .securityWarning-right-main-content {
          margin-top: 5px;
          height: calc(100vh - 360px);
          overflow-y: auto;
        }
      }
    }
  }
}
</style>
