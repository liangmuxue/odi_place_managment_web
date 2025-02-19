<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" :rules="rules" ref="parkingForm">
        <div class="feelRules_content">
          <div class="feelRules_content_title">基础设置</div>
          <div class="feelRules_content_box">
            <div class="feelRules_content_box_left">
              <span class="base_dialog_condit">
                <el-form-item label="规则名称" prop="ruleName">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.ruleName }}</span
                  >
                  <el-input
                    v-else
                    v-model="newList.ruleName"
                    placeholder="输入规则名称"
                    style="width: 60%"
                    class="filter-item"
                    size="small"
                  />
                </el-form-item>
              </span>
              <span class="base_dialog_condit">
                <el-form-item label="是否区分白天夜间计费" prop="isDayNight">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.isDayNight == 1 ? "是" : "否" }}</span
                  >
                  <el-select
                    v-else
                    v-model="newList.isDayNight"
                    placeholder="请选择"
                    class="filter-item"
                    style="width: 60%"
                    @change="getTollsList"
                    size="small"
                  >
                    <el-option
                      v-for="item in isList"
                      :key="item.enumValue"
                      :label="item.enumName"
                      :value="item.enumValue"
                    />
                  </el-select>
                </el-form-item>
              </span>
              <span class="base_dialog_condit">
                <el-form-item label="是否区分地上地下计费" prop="isGround">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.isGround == 1 ? "是" : "否" }}</span
                  >
                  <el-select
                    v-else
                    v-model="newList.isGround"
                    placeholder="请选择"
                    class="filter-item"
                    style="width: 60%"
                    @change="getTollsList"
                    size="small"
                  >
                    <el-option
                      v-for="item in isList"
                      :key="item.enumValue"
                      :label="item.enumName"
                      :value="item.enumValue"
                    />
                  </el-select>
                </el-form-item>
              </span>
            </div>
            <div class="feelRules_content_box_right">
              <span class="base_dialog_condit">
                <el-form-item
                  label="是否区分大中小型车计费"
                  prop="isVehicleType"
                >
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.isVehicleType == 1 ? "是" : "否" }}</span
                  >
                  <el-select
                    v-else
                    v-model="newList.isVehicleType"
                    placeholder="请选择"
                    class="filter-item"
                    style="width: 60%"
                    @change="getTollsList"
                    size="small"
                  >
                    <el-option
                      v-for="item in isList"
                      :key="item.enumValue"
                      :label="item.enumName"
                      :value="item.enumValue"
                    />
                  </el-select>
                </el-form-item>
              </span>
              <span class="base_dialog_condit">
                <el-form-item label="是否区分(非)工作日计费" prop="isHoliday">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.isHoliday == 1 ? "是" : "否" }}</span
                  >
                  <el-select
                    v-else
                    v-model="newList.isHoliday"
                    placeholder="请选择"
                    class="filter-item"
                    style="width: 60%"
                    @change="getTollsList"
                    size="small"
                  >
                    <el-option
                      v-for="item in isList"
                      :key="item.enumValue"
                      :label="item.enumName"
                      :value="item.enumValue"
                    />
                  </el-select>
                </el-form-item>
              </span>
              <span class="base_dialog_condit">
                <el-form-item label="规则描述" prop="remark">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.remark }}</span
                  >
                  <el-input
                    v-else
                    v-model="newList.remark"
                    placeholder="请输入"
                    type="textarea"
                    :rows="2"
                    style="width: 60%"
                    class="filter-item"
                    maxlength="200"
                    show-word-limit
                    size="small"
                  />
                </el-form-item>
              </span>
            </div>
          </div>
          <div class="feelRules_content_title">时段设置</div>
          <div class="feelRules_content_box">
            <div class="feelRules_content_box_left">
              <span class="base_dialog_condit base_dialog_condit_hasprompt">
                <el-form-item label="免费时长(分钟)" prop="freeTime">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.freeTime }}</span
                  >
                  <el-input
                    v-else
                    v-model="newList.freeTime"
                    placeholder="请输入"
                    style="width: 60%"
                    class="filter-item"
                    size="small"
                  />
                </el-form-item>
                <span class="feelRules_content_prompt">(每次进场都可用)</span>
              </span>
              <span class="base_dialog_condit base_dialog_condit_hasprompt">
                <el-form-item label="每日最高收费限额" prop="smallCarMaxCharge">
                  <span v-if="newList.isVehicleType == 1">小型车</span>
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.smallCarMaxCharge }}</span
                  >
                  <el-input
                    v-else
                    v-model="newList.smallCarMaxCharge"
                    placeholder="请输入"
                    style="width: 10%"
                    class="filter-item"
                    size="small"
                  />
                  <span v-if="newList.isVehicleType == 1">
                    元，中型车
                    <span
                      class="base_dialog_condit_text"
                      v-if="pageType == 3 && newList.isVehicleType == 1"
                    >
                      {{ newList.midCarMaxCharge }}</span
                    >
                    <el-input
                      v-else
                      v-model="newList.midCarMaxCharge"
                      placeholder="请输入"
                      style="width: 10%"
                      class="filter-item"
                      size="small"
                    />
                  </span>

                  <span v-if="newList.isVehicleType == 1">
                    元，大型车
                    <span class="base_dialog_condit_text" v-if="pageType == 3">
                      {{ newList.bigCarMaxCharge }}</span
                    >
                    <el-input
                      v-else
                      v-model="newList.bigCarMaxCharge"
                      placeholder="请输入"
                      style="width: 10%"
                      class="filter-item"
                      size="small"
                    />
                  </span>
                  元
                </el-form-item>
                <span class="feelRules_content_prompt"
                  >(停车24小时最高收费金额)</span
                >
              </span>
              <span class="base_dialog_condit" v-if="newList.isDayNight == 1">
                <el-form-item label="白天开始计时时间" prop="dayBegin">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.dayBegin }}</span
                  >
                  <el-time-picker
                    v-model="newList.dayBegin"
                    :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59'
                    }"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择时间"
                    style="width: 60%"
                    size="small"
                  >
                  </el-time-picker>
                </el-form-item>
              </span>
            </div>
            <div class="feelRules_content_box_right">
              <span class="base_dialog_condit base_dialog_condit_hasprompt">
                <el-form-item label="场内支付滞留时间(分钟)" prop="stayTimePay">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.stayTimePay }}</span
                  >
                  <el-input
                    v-else
                    v-model="newList.stayTimePay"
                    placeholder="请输入"
                    style="width: 60%"
                    class="filter-item"
                    size="small"
                  />
                </el-form-item>
                <span class="feelRules_content_prompt"
                  >(场内支付后，在该时长内离场不会产生费用)</span
                >
              </span>
              <span class="base_dialog_condit base_dialog_condit_hasprompt">
                <el-form-item
                  label="充电赠免费停车时长(分钟)"
                  prop="afterChargeFreeTime"
                >
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.afterChargeFreeTime }}</span
                  >
                  <el-input
                    v-else
                    v-model="newList.afterChargeFreeTime"
                    placeholder="请输入"
                    style="width: 60%"
                    class="filter-item"
                    size="small"
                  />
                </el-form-item>
                <span class="feelRules_content_prompt"
                  >(本车场内充电赠送免费停车时长，不可叠加使用)</span
                >
              </span>
              <span class="base_dialog_condit" v-if="newList.isDayNight == 1">
                <el-form-item label="夜间开始计时时间" prop="nightBegin">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.nightBegin }}</span
                  >
                  <el-time-picker
                    v-model="newList.nightBegin"
                    :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59'
                    }"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择时间"
                    style="width: 60%"
                    size="small"
                  >
                  </el-time-picker>
                </el-form-item>
              </span>
            </div>
          </div>
          <div class="feelRules_content_title" style="margin:0">
            按停车场时长收费设置
            <span class="feelRules_content_title_prompt"
              >(不足耽误时长部分，按单位时长计费)</span
            >
          </div>
          <div class="feelRules_content_ground" v-if="newList.isGround == 1">
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_text">地上停放</div>
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_line"></div>
          </div>
          <div class="feelRules_content_ground_box">
            <div class="feelRules_content_ground_titlebox">
              <div class="feelRules_content_ground_box_holiday">
                <div class="feelRules_content_ground_box_holiday_title">
                  <span v-if="newList.isHoliday == 1">工作日</span>
                </div>
                <div>
                  <div class="feelRules_content_ground_box_dayNight">
                    <div
                      class="feelRules_content_ground_box_dayNight_title"
                      v-if="newList.isDayNight == 1"
                    >
                      白天
                    </div>
                  </div>
                  <div
                    class="feelRules_content_ground_box_dayNight"
                    v-if="newList.isDayNight == 1"
                  >
                    <div class="feelRules_content_ground_box_dayNight_title">
                      夜间
                    </div>
                  </div>
                </div>
              </div>
              <div class="feelRules_content_ground_box_holiday">
                <div class="feelRules_content_ground_box_holiday_title">
                  <span v-if="newList.isHoliday == 1">节假日</span>
                </div>
                <div v-if="newList.isHoliday == 1">
                  <div class="feelRules_content_ground_box_dayNight">
                    <div
                      class="feelRules_content_ground_box_dayNight_title"
                      v-if="newList.isDayNight == 1"
                    >
                      白天
                    </div>
                  </div>
                  <div
                    class="feelRules_content_ground_box_dayNight"
                    v-if="newList.isDayNight == 1"
                  >
                    <div class="feelRules_content_ground_box_dayNight_title">
                      夜间
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="feelRules_content_ground_box_dayNight_box">
              <span v-for="(item, index) in newList.tolls" :key="index">
                <span
                  v-if="item.isGround < 2"
                  class="feelRules_content_ground_box_dayNight_box_item"
                >
                  <!-- {{ item.isGround == 1 ? "地上" : "地下" }}：{{
                    item.isHoliday == 1 ? "工作日" : "节假日"
                  }}：{{ item.isDayNight == 1 ? "白天" : "夜间" }} -->
                  <el-form-item
                    label="免费时长后停放"
                    :rules="rules['tolls']"
                    :prop="'tolls.' + index"
                  >
                    <div>
                      0-
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.afterFreeTime }}</span
                      >
                      <el-input
                        v-model="item.afterFreeTime"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span>
                        分钟 | 单位时长
                      </span>
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.unitTime }}</span
                      >
                      <el-select
                        v-else
                        v-model="item.unitTime"
                        placeholder="请选择"
                        class="filter-item"
                        style="width: 90px"
                        size="small"
                      >
                        <el-option
                          v-for="item in unitTimeList"
                          :key="item.enumValue"
                          :label="item.enumName"
                          :value="item.enumValue"
                        />
                      </el-select>
                      <span>分钟 | 单位金额</span>
                      <span v-if="newList.isVehicleType == 1"> 小型车</span>
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.smallCarPay }}</span
                      >
                      <el-input
                        v-else
                        v-model="item.smallCarPay"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text"
                          v-if="pageType == 3"
                        >
                          {{ item.midCarPay }}</span
                        >
                        <el-input
                          v-else
                          v-model="item.midCarPay"
                          placeholder="请输入"
                          style="width: 90px"
                          class="filter-item"
                          size="small"
                        />
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text"
                          v-if="pageType == 3"
                        >
                          {{ item.bigCarPay }}</span
                        >
                        <el-input
                          v-else
                          v-model="item.bigCarPay"
                          placeholder="请输入"
                          style="width: 90px"
                          class="filter-item"
                          size="small"
                        />
                      </span>
                      <span>元</span>
                    </div>
                    <div class="lineTwo">
                      <span>
                        超出后 | 单位时长
                      </span>
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.beyondUnitTime }}</span
                      >
                      <el-select
                        v-else
                        v-model="item.beyondUnitTime"
                        placeholder="请选择"
                        class="filter-item"
                        style="width: 90px"
                        size="small"
                      >
                        <el-option
                          v-for="item in unitTimeList"
                          :key="item.enumValue"
                          :label="item.enumName"
                          :value="item.enumValue"
                        />
                      </el-select>
                      <span>分钟 | 单位金额</span>
                      <span v-if="newList.isVehicleType == 1"> 小型车</span>
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.beyondSmallCarPay }}</span
                      >
                      <el-input
                        v-else
                        v-model="item.beyondSmallCarPay"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text"
                          v-if="pageType == 3"
                        >
                          {{ item.beyondMidCarPay }}</span
                        >
                        <el-input
                          v-else
                          v-model="item.beyondMidCarPay"
                          placeholder="请输入"
                          style="width: 90px"
                          class="filter-item"
                          size="small"
                        />
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text"
                          v-if="pageType == 3"
                        >
                          {{ item.beyondBigCarPay }}</span
                        >
                        <el-input
                          v-else
                          v-model="item.beyondBigCarPay"
                          placeholder="请输入"
                          style="width: 90px"
                          class="filter-item"
                          size="small"
                        />
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
              </span>
            </div>
          </div>
          <div class="feelRules_content_ground" v-if="newList.isGround == 1">
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_text">地下停放</div>
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_line"></div>
            <div class="feelRules_content_ground_line"></div>
          </div>
          <div
            class="feelRules_content_ground_box"
            v-if="newList.isGround == 1"
          >
            <div class="feelRules_content_ground_titlebox">
              <div class="feelRules_content_ground_box_holiday">
                <div class="feelRules_content_ground_box_holiday_title">
                  <span v-if="newList.isHoliday == 1">工作日</span>
                </div>
                <div>
                  <div class="feelRules_content_ground_box_dayNight">
                    <div
                      class="feelRules_content_ground_box_dayNight_title"
                      v-if="newList.isDayNight == 1"
                    >
                      白天
                    </div>
                  </div>
                  <div
                    class="feelRules_content_ground_box_dayNight"
                    v-if="newList.isDayNight == 1"
                  >
                    <div class="feelRules_content_ground_box_dayNight_title">
                      夜间
                    </div>
                  </div>
                </div>
              </div>
              <div class="feelRules_content_ground_box_holiday">
                <div class="feelRules_content_ground_box_holiday_title">
                  <span v-if="newList.isHoliday == 1">节假日</span>
                </div>
                <div>
                  <div class="feelRules_content_ground_box_dayNight">
                    <div
                      class="feelRules_content_ground_box_dayNight_title"
                      v-if="newList.isDayNight == 1"
                    >
                      白天
                    </div>
                  </div>
                  <div
                    class="feelRules_content_ground_box_dayNight"
                    v-if="newList.isDayNight == 1"
                  >
                    <div class="feelRules_content_ground_box_dayNight_title">
                      夜间
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="feelRules_content_ground_box_dayNight_box">
              <span v-for="(item, index) in newList.tolls" :key="index">
                <span
                  v-if="item.isGround == 2"
                  class="feelRules_content_ground_box_dayNight_box_item"
                >
                  <!-- {{ item.isGround == 1 ? "地上" : "地下" }}：{{
                    item.isHoliday == 1 ? "工作日" : "节假日"
                  }}：{{ item.isDayNight == 1 ? "白天" : "夜间" }} -->
                  <el-form-item
                    label="免费时长后停放"
                    :rules="rules['tolls']"
                    :prop="'tolls.' + index"
                  >
                    <div>
                      0-
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.afterFreeTime }}</span
                      >
                      <el-input
                        v-model="item.afterFreeTime"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span>
                        分钟 | 单位时长
                      </span>
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.unitTime }}</span
                      >
                      <el-select
                        v-else
                        v-model="item.unitTime"
                        placeholder="请选择"
                        class="filter-item"
                        style="width: 90px"
                        size="small"
                      >
                        <el-option
                          v-for="item in unitTimeList"
                          :key="item.enumValue"
                          :label="item.enumName"
                          :value="item.enumValue"
                        />
                      </el-select>
                      <span>分钟 | 单位金额</span>
                      <span v-if="newList.isVehicleType == 1"> 小型车</span>
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.smallCarPay }}</span
                      >
                      <el-input
                        v-else
                        v-model="item.smallCarPay"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text"
                          v-if="pageType == 3"
                        >
                          {{ item.midCarPay }}</span
                        >
                        <el-input
                          v-else
                          v-model="item.midCarPay"
                          placeholder="请输入"
                          style="width: 90px"
                          class="filter-item"
                          size="small"
                        />
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text"
                          v-if="pageType == 3"
                        >
                          {{ item.bigCarPay }}</span
                        >
                        <el-input
                          v-else
                          v-model="item.bigCarPay"
                          placeholder="请输入"
                          style="width: 90px"
                          class="filter-item"
                          size="small"
                        />
                      </span>
                      <span>元</span>
                    </div>
                    <div class="lineTwo">
                      <span>
                        超出后 | 单位时长
                      </span>
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.beyondUnitTime }}</span
                      >
                      <el-select
                        v-else
                        v-model="item.beyondUnitTime"
                        placeholder="请选择"
                        class="filter-item"
                        style="width: 90px"
                        size="small"
                      >
                        <el-option
                          v-for="item in unitTimeList"
                          :key="item.enumValue"
                          :label="item.enumName"
                          :value="item.enumValue"
                        />
                      </el-select>
                      <span>分钟 | 单位金额</span>
                      <span v-if="newList.isVehicleType == 1"> 小型车</span>
                      <span
                        class="base_dialog_condit_text"
                        v-if="pageType == 3"
                      >
                        {{ item.beyondSmallCarPay }}</span
                      >
                      <el-input
                        v-else
                        v-model="item.beyondSmallCarPay"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text"
                          v-if="pageType == 3"
                        >
                          {{ item.beyondMidCarPay }}</span
                        >
                        <el-input
                          v-else
                          v-model="item.beyondMidCarPay"
                          placeholder="请输入"
                          style="width: 90px"
                          class="filter-item"
                          size="small"
                        />
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text"
                          v-if="pageType == 3"
                        >
                          {{ item.beyondBigCarPay }}</span
                        >
                        <el-input
                          v-else
                          v-model="item.beyondBigCarPay"
                          placeholder="请输入"
                          style="width: 90px"
                          class="filter-item"
                          size="small"
                        />
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
              </span>
            </div>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType !== 3">
        <el-button type="info" icon="el-icon-circle-plus" @click="toSave"
          >保存</el-button
        ><el-button type="danger" icon="el-icon-error" @click="closeDialog"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  ruleTemporaryParkingCheckName, //临停规则检查规则名是否存在
  ruleTemporaryParkingDetail, //临停规则详情
  ruleTemporaryParkingInsert, //临停规则新增
  ruleTemporaryParkingUpdate //临停规则编辑
} from "@/api/operationManagement";
import { fieldTable } from "@/api/common";

export default {
  components: {},
  data() {
    const validateEditRuleName = (rule, value, callback) => {
      if (this.editRuleName !== value) {
        let para = {
          ruleName: value
        };
        ruleTemporaryParkingCheckName(para).then(response => {
          if (response.data === 1) {
            callback(new Error("规则名称重复不可用"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    const validateSmallCarMaxCharge = (rule, value, callback) => {
      if (this.newList.isGround == 1) {
        if (
          this.newList.smallCarMaxCharge &&
          this.newList.midCarMaxCharge &&
          this.newList.bigCarMaxCharge
        ) {
          const regex = /^(?!0)\d+(\.\d{1})?$/;
          const isValids = regex.test(this.newList.smallCarMaxCharge);
          const isValidm = regex.test(this.newList.midCarMaxCharge);
          const isValidb = regex.test(this.newList.bigCarMaxCharge);
          if (isValids && isValidm && isValidb) {
            callback();
          } else {
            callback(new Error("请输入大于0的数字，最多保留一位小数"));
          }
        } else {
          callback(new Error("请输入每日最高收费限额"));
        }
      } else {
        if (this.newList.smallCarMaxCharge) {
          const regex = /^(?!0)\d+(\.\d{1})?$/;
          const isValid = regex.test(this.newList.smallCarMaxCharge);
          if (isValid) {
            callback();
          } else {
            callback(new Error("请输入大于0的数字，最多保留一位小数"));
          }
        } else {
          callback(new Error("请输入每日最高收费限额"));
        }
      }
    };
    const validateNo30 = (rule, value, callback) => {
      const regex = /^[1-9]$|^[12]\d$|30$/;
      const isValid = regex.test(value);
      if (isValid) {
        callback();
      } else {
        callback(new Error("请输入0-30的整数"));
      }
    };
    const validateNo1440 = (rule, value, callback) => {
      const regex = /^(0|[1-9]\d{0,2}|1[0-3]\d{2}|14[0-3][0-9]|1440)$/;
      const isValid = regex.test(value);
      if (!value) {
        callback();
      } else {
        if (isValid) {
          callback();
        } else {
          callback(new Error("请输入0-1440的整数"));
        }
      }
    };
    const validateTolls = (rule, value, callback) => {
      console.log(2, value);
      const regex1440 = /^(0|[1-9]\d{0,2}|1[0-3]\d{2}|14[0-3][0-9]|1440)$/;
      const regexNo = /^(?!0)\d+(\.\d{1})?$/;
      if (!value.afterFreeTime) {
        callback(new Error("请输入免费时长后停放时间"));
      } else {
        const isValid = regex1440.test(value.afterFreeTime);
        if (!isValid) {
          callback(new Error("免费时长后停放时间请输入0-1440的整数"));
        }
      }
      if (!value.unitTime) {
        callback(new Error("请选择单位时长"));
      }
      if (this.newList.isGround == 1) {
        if (
          !value.smallCarPay ||
          !value.midCarPay ||
          !value.bigCarPay ||
          !value.beyondSmallCarPay ||
          !value.beyondMidCarPay ||
          !value.beyondBigCarPay
        ) {
          callback(new Error("请输入单位金额"));
        } else {
          const isValids = regexNo.test(value.smallCarPay);
          const isValidm = regexNo.test(value.midCarPay);
          const isValidb = regexNo.test(value.bigCarPay);
          const isValidbs = regexNo.test(value.beyondSmallCarPay);
          const isValidbm = regexNo.test(value.beyondMidCarPay);
          const isValidbb = regexNo.test(value.beyondBigCarPay);
          if (
            !isValids ||
            !isValidm ||
            !isValidb ||
            !isValidbs ||
            !isValidbm ||
            !isValidbb
          ) {
            callback(new Error("单位金额请输入大于0的数字，最多保留一位小数"));
          }
        }
      } else {
        if (!value.smallCarPay || !value.beyondSmallCarPay) {
          callback(new Error("请输入单位金额"));
        } else {
          const isValids = regexNo.test(value.smallCarPay);
          const isValidbs = regexNo.test(value.beyondSmallCarPay);
          if (!isValids || !isValidbs) {
            callback(new Error("单位金额请输入大于0的数字，最多保留一位小数"));
          }
        }
      }
      callback();
    };

    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      editRuleName: null, //编辑规则名
      parkingLots: "", //使用中的停车场
      newList: {
        ruleName: "", //规则名称
        isVehicleType: 1, //'是否车辆类型 1-是 2-否',
        isGround: 2, //'是否地下  1-是 2-否'
        isDayNight: 2, //'是否昼夜  1-是 2-否',
        isHoliday: 2, //是否假日 1-是 2-否',
        remark: "", //描述
        freeTime: null, //免费时长
        stayTimePay: 15, //场内支付滞留时间
        smallCarMaxCharge: null, //每日最高收取额度小型车
        midCarMaxCharge: null, //每日最高收取额度中型车
        bigCarMaxCharge: null, //每日最高收取额度大型车
        dayBegin: null, //白天开始时间
        nightBegin: null, //夜晚开始时间
        createTime: null, //创建时间
        status: 1, //使用状态 0-未使用 1-使用中',
        afterChargeFreeTime: null, //充电后免费时长
        tolls: [
          {
            isGround: 0,
            isHoliday: 0,
            isDayNight: 0,
            afterFreeTime: null,
            unitTime: null,
            smallCarPay: null,
            midCarPay: null,
            bigCarPay: null,
            beyondUnitTime: null,
            beyondSmallCarPay: null,
            beyondMidCarPay: null,
            beyondBigCarPay: null
          }
        ], //收费信息
        parkingLots: [] //车场信息
      }, //车位详情
      tollsList: [], //收费信息
      isList: [
        { enumName: "是", enumValue: 1 },
        { enumName: "否", enumValue: 2 }
      ],
      unitTimeList: [
        { enumName: 30, enumValue: 30 },
        { enumName: 60, enumValue: 60 }
      ],
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名", trigger: "blur" },
          {
            pattern: /[\u4E00-\u9FA5a-zA-Z0-9_\-]{1,20}$/,
            message: "请输入20以内字符，且不含特殊字符",
            trigger: "blur"
          },
          {
            required: true,
            message: "规则名已存在",
            trigger: "blur",
            validator: validateEditRuleName
          }
        ],
        isDayNight: [
          {
            required: true,
            message: "请选择是否区分白天夜间计费",
            trigger: "blur"
          }
        ],
        isGround: [
          {
            required: true,
            message: "请选择是否区分地上地下计费",
            trigger: "blur"
          }
        ],
        isVehicleType: [
          {
            required: true,
            message: "请选择是否区分大中小型车计费",
            trigger: "blur"
          }
        ],
        isHoliday: [
          {
            required: true,
            message: "请选择是否区分(非)工作日计费",
            trigger: "blur"
          }
        ],
        freeTime: [
          { required: true, message: "请输入免费时长", trigger: "blur" },
          {
            required: true,
            message: "请输入0-1440的整数",
            trigger: "blur",
            validator: validateNo1440
          }
        ],
        afterChargeFreeTime: [
          {
            required: false,
            message: "请输入0-1440的整数",
            trigger: "blur",
            validator: validateNo1440
          }
        ],
        stayTimePay: [
          {
            required: true,
            message: "请输入场内支付滞留时间",
            trigger: "blur"
          },
          {
            required: true,
            message: "请输入0-30的整数",
            trigger: "blur",
            validator: validateNo30
          }
        ],

        smallCarMaxCharge: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateSmallCarMaxCharge
          }
        ],
        dayBegin: [
          { required: true, message: "请输入白天开始计时时间", trigger: "blur" }
        ],
        nightBegin: [
          { required: true, message: "请输入夜间开始计时时间", trigger: "blur" }
        ],
        tolls: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateTolls
          }
        ]
      },
      Dictionaries: {
        enumTypes: "BUY_UNIT,RULE_VEHICLE_TYPE,RULE_PARKING_DIRECTION"
      },
      enumsData: {} //字典表返回数据
    };
  },
  created() {
    this.getFieldTable();
  },
  computed: {},
  methods: {
    //获取单位名
    getTollsList() {
      if (
        this.newList.isGround == 1 &&
        this.newList.isHoliday == 1 &&
        this.newList.isDayNight == 1
      ) {
        let tollsList = [];
        tollsList.push(this.getObj(1, 1, 1));
        tollsList.push(this.getObj(1, 1, 2));
        tollsList.push(this.getObj(1, 2, 1));
        tollsList.push(this.getObj(1, 2, 2));
        tollsList.push(this.getObj(2, 1, 1));
        tollsList.push(this.getObj(2, 1, 2));
        tollsList.push(this.getObj(2, 2, 1));
        tollsList.push(this.getObj(2, 2, 2));
        this.newList.tolls = tollsList;
      } else if (
        this.newList.isGround == 2 &&
        this.newList.isHoliday == 1 &&
        this.newList.isDayNight == 1
      ) {
        let tollsList = [];
        tollsList.push(this.getObj(0, 1, 1));
        tollsList.push(this.getObj(0, 1, 2));
        tollsList.push(this.getObj(0, 2, 1));
        tollsList.push(this.getObj(0, 2, 2));
        this.newList.tolls = tollsList;
      } else if (
        this.newList.isGround == 1 &&
        this.newList.isHoliday == 2 &&
        this.newList.isDayNight == 1
      ) {
        let tollsList = [];
        tollsList.push(this.getObj(1, 0, 1));
        tollsList.push(this.getObj(2, 0, 1));
        tollsList.push(this.getObj(1, 0, 2));
        tollsList.push(this.getObj(2, 0, 2));
        this.tollsList = tollsList;
      } else if (
        this.newList.isGround == 1 &&
        this.newList.isHoliday == 1 &&
        this.newList.isDayNight == 2
      ) {
        let tollsList = [];
        tollsList.push(this.getObj(1, 1, 0));
        tollsList.push(this.getObj(2, 1, 0));
        tollsList.push(this.getObj(1, 2, 0));
        tollsList.push(this.getObj(2, 2, 0));
        this.newList.tolls = tollsList;
      } else if (
        this.newList.isGround == 1 &&
        this.newList.isHoliday == 2 &&
        this.newList.isDayNight == 2
      ) {
        let tollsList = [];
        tollsList.push(this.getObj(1, 0, 0));
        tollsList.push(this.getObj(2, 0, 0));
        this.newList.tolls = tollsList;
      } else if (
        this.newList.isGround == 2 &&
        this.newList.isHoliday == 1 &&
        this.newList.isDayNight == 2
      ) {
        let tollsList = [];
        tollsList.push(this.getObj(0, 1, 0));
        tollsList.push(this.getObj(0, 2, 0));
        this.newList.tolls = tollsList;
      } else if (
        this.newList.isGround == 2 &&
        this.newList.isHoliday == 2 &&
        this.newList.isDayNight == 1
      ) {
        let tollsList = [];
        tollsList.push(this.getObj(0, 0, 1));
        tollsList.push(this.getObj(0, 0, 2));
        this.newList.tolls = tollsList;
      } else if (
        this.newList.isGround == 2 &&
        this.newList.isHoliday == 2 &&
        this.newList.isDayNight == 2
      ) {
        let tollsList = [];
        tollsList.push(this.getObj(0, 0, 0));
        this.newList.tolls = tollsList;
      }
    },
    getObj(isGround, isHoliday, cisDayNight) {
      let obj = {
        isGround: isGround,
        isHoliday: isHoliday,
        isDayNight: cisDayNight,
        afterFreeTime: null,
        unitTime: 30,
        smallCarPay: null,
        midCarPay: null,
        bigCarPay: null,
        beyondUnitTime: 30,
        beyondSmallCarPay: null,
        beyondMidCarPay: null,
        beyondBigCarPay: null
      };
      return obj;
    },
    handleInput1(value) {
      // 限制输入为0到999之间的整数
      this.newList.maxBuy = value.toString().replace(/[^0-9]/g, "");
      if (this.newList.maxBuy > 999) {
        this.newList.maxBuy = 999; // 如果超过999，设置为999
      } else if (this.newList.maxBuy < 0) {
        this.newList.maxBuy = 0; // 如果小于0，设置为0
      }
    },
    handleInput2(value) {
      // 限制输入为大于等于0
      this.newList.unitPrice = value.toString().replace(/[^0-9]/g, "");
      if (this.newList.unitPrice < 0) {
        this.newList.unitPrice = 0; // 如果小于0，设置为0
      }
    },
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
      });
    },
    //打开注册、编辑弹窗
    showDialog(id, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      if (this.$refs["parkingForm"]) {
        this.$refs["parkingForm"].resetFields();
      }

      if (pageType == 2) {
        this.title = "编辑";
        this.getDetials(id);
      } else if (pageType == 3) {
        this.title = "详情";
        this.getDetials(id);
      } else {
        this.title = "新增";
        this.newList = {
          ruleName: "", //规则名称
          isVehicleType: 1, //'是否车辆类型 1-是 2-否',
          isGround: 2, //'是否地下  1-是 2-否'
          isDayNight: 2, //'是否昼夜  1-是 2-否',
          isHoliday: 2, //是否假日 1-是 2-否',
          remark: "", //描述
          freeTime: null, //免费时长
          stayTimePay: 15, //场内支付滞留时间
          smallCarMaxCharge: null, //每日最高收取额度小型车
          midCarMaxCharge: null, //每日最高收取额度中型车
          bigCarMaxCharge: null, //每日最高收取额度大型车
          dayBegin: null, //白天开始时间
          nightBegin: null, //夜晚开始时间
          createTime: null, //创建时间
          status: 1, //使用状态 0-未使用 1-使用中',
          afterChargeFreeTime: null, //充电后免费时长
          tolls: [
            {
              isGround: 0,
              isHoliday: 0,
              isDayNight: 0,
              afterFreeTime: null,
              unitTime: null,
              smallCarPay: null,
              midCarPay: null,
              bigCarPay: null,
              beyondUnitTime: null,
              beyondSmallCarPay: null,
              beyondMidCarPay: null,
              beyondBigCarPay: null
            }
          ], //收费信息
          parkingLots: [] //车场信息
        };
        if (this.$refs["parkingForm"]) {
          this.$nextTick(() => {
            this.$refs["parkingForm"].clearValidate();
          });
        }
      }
    },
    //获取详情
    getDetials(id) {
      let para = { id: id };
      ruleTemporaryParkingDetail(para).then(response => {
        this.newList = response.data;
        this.newList.tolls.sort(this.getSort);
        console.log(111, this.newList.tolls);
        // this.tollsList = response.data.tolls;
        this.editRuleName = response.data.ruleName;
        let arr = [];
        let list = response.data.parkingLots;
        if (response.data.parkingLots && response.data.parkingLots.length) {
          list.forEach(el => {
            arr.push(el.name);
          });
        }
        this.parkingLots = arr.toString();
      });
    },
    getSort(a, b) {
      if (a.isGround !== b.isGround) return a.isGround < b.isGround ? -1 : 1;
      else if (a.isHoliday !== b.isHoliday)
        return a.isHoliday < b.isHoliday ? -1 : 1;
      else if (a.isDayNight !== b.isDayNight)
        return a.isDayNight < b.isDayNight ? -1 : 1;
    },
    //关闭新增/编辑弹窗
    closeDialog() {
      this.isShow = false;
      this.$emit("openLoading", {});
      this.$emit("getList", {});
    },
    //点击保存按钮
    toSave() {
      if (!this.newList.id) {
        this.toAdd();
      } else {
        this.toEidt();
      }
    },
    //添加临停规则
    toAdd() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存临停规则吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            ruleTemporaryParkingInsert(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                  // this.getDetials(response.id);
                } else {
                  this.$message({
                    type: "warning",
                    message: "提交失败"
                  });
                }
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              })
              .catch(() => {
                this.$message({
                  type: "warning",
                  message: "提交失败"
                });
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              });
          });
        }
      });
    },
    //编辑临停规则
    toEidt() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的临停规则吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            ruleTemporaryParkingUpdate(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                } else {
                  this.$message({
                    type: "warning",
                    message: "提交失败"
                  });
                }
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              })
              .catch(() => {
                this.$message({
                  type: "warning",
                  message: "提交失败"
                });
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.feelRules_content {
  height: calc(100vh - 250px);
  width: 100%;
  overflow: auto;

  .feelRules_content_title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #e7f4f2;
    color: #037659;
    font-size: 18px;
    text-align: center;
    margin-bottom: 30px;
    .feelRules_content_title_prompt {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: #333;
    }
  }
  .feelRules_content_ground {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin: 0 auto;
    text-align: center;
    color: #333;
    font-weight: bold;
    justify-content: center; /* 主轴上的居中对齐 */
    align-items: center; /* 交叉轴上的居中对齐 */
    .feelRules_content_ground_line {
      height: 20px;
      width: 4px;
      margin: 10px 2px;
      background: #02c5a7;
    }
    .feelRules_content_ground_text {
      width: 100px;
    }
  }
  .feelRules_content_ground_box {
    width: 100%;
    background: #f5fdfc;
    display: flex;
    padding-bottom: 10px;
    .feelRules_content_ground_box_holiday {
      display: flex;
    }
    .feelRules_content_ground_box_holiday_title {
      width: 120px;
      text-align: center;
      color: #037659;
      font-size: 16px;
      font-weight: bold;
      line-height: 60px;
      min-height: 100px;
    }
    .feelRules_content_ground_box_dayNight {
      flex: 1;
      display: flex;
      .feelRules_content_ground_box_dayNight_title {
        width: 120px;
        text-align: center;
        color: #037659;
        font-size: 16px;
        height: 100px;
        line-height: 60px;
      }
    }
  }
  .feelRules_content_ground_box_dayNight_box {
    flex: 1;
    .feelRules_content_ground_box_dayNight_box_item {
      display: inline-block;
      width: calc(100vw - 500px);
      height: 100px;
      padding: 10px 0;
    }
    .lineTwo {
      margin-left: 236px;
    }
  }
  .feelRules_content_box {
    display: flex;
    padding: 0 20px;
    .feelRules_content_box_left {
      flex: 1;
    }
    .feelRules_content_box_right {
      flex: 1;
    }
  }
  .base_dialog_condit_hasprompt {
    position: relative;
    margin-bottom: 40px;
    .feelRules_content_prompt {
      position: absolute;
      width: 300px;
      top: 40px;
      left: 180px;
      font-size: 12px;
    }
  }
}
</style>
