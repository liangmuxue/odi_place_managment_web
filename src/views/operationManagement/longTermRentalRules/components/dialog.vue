<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <div class="longTermRentalRules_content">
        <el-form :model="newList" :rules="rules" ref="parkingForm">
          <div class="longTermRentalRules_content_title">基础设置</div>
          <div class="longTermRentalRules_content_box">
            <div class="longTermRentalRules_content_box_left">
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
                    @change="resetTolls"
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
                <el-form-item label="收费单位" prop="buyUnit">
                  <el-input
                    v-show="false"
                    v-model="newList.buyUnit"
                    placeholder="输入"
                    style="width: 60%"
                    class="filter-item"
                    size="small"
                  />

                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ buyUnitName }}</span
                  >
                  <el-select
                    v-else
                    v-model="buyUnits"
                    placeholder="选择收费单位"
                    clearable
                    multiple
                    @change="selBuyUnit"
                    class="filter-item"
                    style="width: 60%"
                    size="small"
                  >
                    <el-option
                      v-for="item in enumsData.LONG_UNIT"
                      :key="item.enumValue"
                      :label="item.enumName"
                      :value="item.enumValue"
                    />
                  </el-select>
                </el-form-item>
              </span>
              <span class="base_dialog_condit" v-if="pageType == 3">
                <el-form-item label="在用车场" prop="buyUnit">
                  <span class="base_dialog_condit_text">
                    {{ parkingLots }}</span
                  >
                </el-form-item>
              </span>
            </div>
            <div class="longTermRentalRules_content_box_right">
              <span class="base_dialog_condit">
                <el-form-item
                  label="是否区分(非)入驻企业员工计费"
                  prop="isWorker"
                >
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.isWorker == 1 ? "是" : "否" }}</span
                  >
                  <el-select
                    v-else
                    v-model="newList.isWorker"
                    placeholder="请选择"
                    class="filter-item"
                    style="width: 60%"
                    @change="resetTolls"
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
                    @change="resetTolls"
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
                <el-form-item label="长租截止时间" prop="leaseEndTime">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{
                      newList.leaseEndTime
                        | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                    }}</span
                  >
                  <el-date-picker
                    v-else
                    style="width: 60%"
                    v-model="newList.leaseEndTime"
                    type="date"
                    value-format="timestamp"
                    default-time="23:59:59"
                    placeholder="选择日期时间"
                    size="small"
                  ></el-date-picker>
                </el-form-item>
              </span>
            </div>
          </div>
          <div class="longTermRentalRules_content_title" style="margin:0">
            单位收费金额（普通用户）
          </div>
          <div class="longTermRentalRules_content_worker_box">
            <div class="longTermRentalRules_content_worker_box_ground">
              <div class="longTermRentalRules_content_worker_box_ground_title">
                <span v-if="newList.isGround == 1">地上长租</span>
              </div>
              <div class="longTermRentalRules_content_worker_box_ground_box">
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 1 ||
                      newList.buyUnit == 3 ||
                      newList.buyUnit == 5 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 9 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item label="月度" prop="groundMonthSmallRegular">
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.groundMonthSmallRegular }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.groundMonthSmallRegular"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundMonthMidRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundMonthMidRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundMonthMidRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundMonthBigRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundMonthBigRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundMonthBigRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 2 ||
                      newList.buyUnit == 3 ||
                      newList.buyUnit == 6 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 10 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item label="季度" prop="groundQuarterSmallRegular">
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.groundQuarterSmallRegular }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.groundQuarterSmallRegular"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundQuarterMidRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundQuarterMidRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundQuarterMidRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundQuarterBigRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundQuarterBigRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundQuarterBigRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 4 ||
                      newList.buyUnit == 5 ||
                      newList.buyUnit == 6 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 12 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item label="半年度" prop="groundHalfSmallRegular">
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.groundHalfSmallRegular }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.groundHalfSmallRegular"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundHalfMidRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundHalfMidRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundHalfMidRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundHalfBigRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundHalfBigRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundHalfBigRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 8 ||
                      newList.buyUnit == 9 ||
                      newList.buyUnit == 10 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 12 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item label="年度" prop="groundYearSmallRegular">
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.groundYearSmallRegular }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.groundYearSmallRegular"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundYearMidRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundYearMidRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundYearMidRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundYearBigRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundYearBigRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundYearBigRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
              </div>
            </div>
            <div class="longTermRentalRules_content_worker_box_ground">
              <div class="longTermRentalRules_content_worker_box_ground_title">
                <span v-if="newList.isGround == 1">地下长租</span>
              </div>
              <div
                class="longTermRentalRules_content_worker_box_ground_box"
                v-if="newList.isGround == 1"
              >
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 1 ||
                      newList.buyUnit == 3 ||
                      newList.buyUnit == 5 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 9 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item
                    label="月度"
                    prop="undergroundMonthSmallRegular"
                  >
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.undergroundMonthSmallRegular }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.undergroundMonthSmallRegular"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundMonthMidRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundMonthMidRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundMonthMidRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundMonthBigRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundMonthBigRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundMonthBigRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 2 ||
                      newList.buyUnit == 3 ||
                      newList.buyUnit == 6 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 10 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item
                    label="季度"
                    prop="undergroundQuarterSmallRegular"
                  >
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.undergroundQuarterSmallRegular }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.undergroundQuarterSmallRegular"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundQuarterMidRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundQuarterMidRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundQuarterMidRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundQuarterBigRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundQuarterBigRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundQuarterBigRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 4 ||
                      newList.buyUnit == 5 ||
                      newList.buyUnit == 6 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 12 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item
                    label="半年度"
                    prop="undergroundHalfSmallRegular"
                  >
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.undergroundHalfSmallRegular }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.undergroundHalfSmallRegular"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundHalfMidRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundHalfMidRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundHalfMidRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundHalfBigRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundHalfBigRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundHalfBigRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 8 ||
                      newList.buyUnit == 9 ||
                      newList.buyUnit == 10 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 12 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item label="年度" prop="undergroundYearSmallRegular">
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.undergroundYearSmallRegular }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.undergroundYearSmallRegular"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundYearMidRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundYearMidRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundYearMidRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundYearBigRegular }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundYearBigRegular"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundYearBigRegular"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
              </div>
            </div>
          </div>
          <div
            class="longTermRentalRules_content_title"
            style="margin:0"
            v-if="newList.isWorker == 1"
          >
            单位收费金额（入驻企业员工用户）
          </div>
          <div
            class="longTermRentalRules_content_worker_box"
            v-if="newList.isWorker == 1"
          >
            <div class="longTermRentalRules_content_worker_box_ground">
              <div class="longTermRentalRules_content_worker_box_ground_title">
                <span v-if="newList.isGround == 1">地上长租</span>
              </div>
              <div class="longTermRentalRules_content_worker_box_ground_box">
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 1 ||
                      newList.buyUnit == 3 ||
                      newList.buyUnit == 5 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 9 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item label="月度" prop="groundMonthSmallEmployee">
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.groundMonthSmallEmployee }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.groundMonthSmallEmployee"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundMonthMidEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundMonthMidEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundMonthMidEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundMonthBigEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundMonthBigEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundMonthBigEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 2 ||
                      newList.buyUnit == 3 ||
                      newList.buyUnit == 6 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 10 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item label="季度" prop="groundQuarterSmallEmployee">
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.groundQuarterSmallEmployee }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.groundQuarterSmallEmployee"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundQuarterMidEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundQuarterMidEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundQuarterMidEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundQuarterBigEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundQuarterBigEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundQuarterBigEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 4 ||
                      newList.buyUnit == 5 ||
                      newList.buyUnit == 6 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 12 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item label="半年度" prop="groundHalfSmallEmployee">
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.groundHalfSmallEmployee }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.groundHalfSmallEmployee"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundHalfMidEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundHalfMidEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundHalfMidEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundHalfBigEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundHalfBigEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundHalfBigEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 8 ||
                      newList.buyUnit == 9 ||
                      newList.buyUnit == 10 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 12 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item label="年度" prop="groundYearSmallEmployee">
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.groundYearSmallEmployee }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.groundYearSmallEmployee"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundYearMidEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundYearMidEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundYearMidEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.groundYearBigEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="groundYearBigEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.groundYearBigEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
              </div>
            </div>
            <div class="longTermRentalRules_content_worker_box_ground">
              <div class="longTermRentalRules_content_worker_box_ground_title">
                <span v-if="newList.isGround == 1">地下长租</span>
              </div>
              <div
                class="longTermRentalRules_content_worker_box_ground_box"
                v-if="newList.isGround == 1"
              >
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 1 ||
                      newList.buyUnit == 3 ||
                      newList.buyUnit == 5 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 9 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item
                    label="月度"
                    prop="undergroundMonthSmallEmployee"
                  >
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.undergroundMonthSmallEmployee }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.undergroundMonthSmallEmployee"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundMonthMidEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundMonthMidEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundMonthMidEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundMonthBigEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundMonthBigEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundMonthBigEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 2 ||
                      newList.buyUnit == 3 ||
                      newList.buyUnit == 6 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 10 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item
                    label="季度"
                    prop="undergroundQuarterSmallEmployee"
                  >
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.undergroundQuarterSmallEmployee }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.undergroundQuarterSmallEmployee"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundQuarterMidEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundQuarterMidEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundQuarterMidEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundQuarterBigEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundQuarterBigEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundQuarterBigEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 4 ||
                      newList.buyUnit == 5 ||
                      newList.buyUnit == 6 ||
                      newList.buyUnit == 7 ||
                      newList.buyUnit == 12 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item
                    label="半年度"
                    prop="undergroundHalfSmallEmployee"
                  >
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.undergroundHalfSmallEmployee }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.undergroundHalfSmallEmployee"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundHalfMidEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundHalfMidEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundHalfMidEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundHalfBigEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundHalfBigEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundHalfBigEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
                <span
                  class="longTermRentalRules_content_worker_box_ground_box_item"
                  v-if="
                    newList.buyUnit == 8 ||
                      newList.buyUnit == 9 ||
                      newList.buyUnit == 10 ||
                      newList.buyUnit == 11 ||
                      newList.buyUnit == 12 ||
                      newList.buyUnit == 13 ||
                      newList.buyUnit == 14 ||
                      newList.buyUnit == 15
                  "
                >
                  <el-form-item
                    label="年度"
                    prop="undergroundYearSmallEmployee"
                  >
                    <div>
                      <span
                        class="base_dialog_condit_text small_text"
                        v-if="pageType == 3"
                      >
                        {{ newList.undergroundYearSmallEmployee }}</span
                      >
                      <el-input
                        v-else
                        v-model="newList.undergroundYearSmallEmployee"
                        placeholder="请输入"
                        style="width: 90px"
                        class="filter-item"
                        size="small"
                      />
                      <span v-if="newList.isVehicleType == 1"
                        >元，中型车
                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundYearMidEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundYearMidEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundYearMidEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span v-if="newList.isVehicleType == 1">
                        元，大型车

                        <span
                          class="base_dialog_condit_text small_text"
                          v-if="pageType == 3"
                        >
                          {{ newList.undergroundYearBigEmployee }}</span
                        >
                        <el-form-item
                          v-else
                          prop="undergroundYearBigEmployee"
                          class="inItem"
                        >
                          <el-input
                            v-model="newList.undergroundYearBigEmployee"
                            placeholder="请输入"
                            style="width: 90px"
                            class="filter-item"
                            size="small"
                          />
                        </el-form-item>
                      </span>
                      <span>元</span>
                    </div>
                  </el-form-item>
                </span>
              </div>
            </div>
          </div>
        </el-form>
      </div>
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
  ruleParkingLeasesCheckName, //长租规则检查规则名是否存在
  ruleParkingLeasesDetail, //长租规则详情
  ruleParkingLeasesInsert, //长租规则新增
  ruleParkingLeasesUpdate //长租规则编辑
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
        ruleParkingLeasesCheckName(para).then(response => {
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
    const validateNo = (rule, value, callback) => {
      const regex = /^\d+(\.\d{1})?$/;
      const isValid = regex.test(value);
      if (isValid) {
        callback();
      } else {
        callback(new Error("请输入不小于0的数字，最多保留一位小数"));
      }
    };
    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      editRuleName: null, //编辑规则名
      parkingLots: "", //使用中的停车场
      newList: {
        ruleName: "", //规则名称
        buyUnit: 15, //'收费单位 1-月度 2-季度 4-半年 8-年度'
        isWorker: 1, //'是否区分入驻企业员工  1-是 0-否',
        isVehicleType: 0, //'是否车辆类型 1-是 0-否',
        isGround: 0, //'是否地下  1-是 0-否'
        leaseEndTime: null, //长租结束时间
        createTime: null, //创建时间
        status: 1, //使用状态 0-未使用 1-使用中',
        deleteFlag: null, //
        id: null,
        ruleParkingLeasesId: null, //规则id
        groundMonthSmallRegular: null, //地上普通用户小车月度费用
        groundMonthMidRegular: null, //地上普通用户中车月度费用
        groundMonthBigRegular: null, //地上普通用户大车月度费用
        groundQuarterSmallRegular: null, //地上普通用户小车季度费用
        groundQuarterMidRegular: null, //地上普通用户中车季度费用
        groundQuarterBigRegular: null, //地上普通用户大车季度费用
        groundHalfSmallRegular: null, //地上普通用户小车半年度费用
        groundHalfMidRegular: null, //地上普通用户中车半年度费用
        groundHalfBigRegular: null, //地上普通用户大车半年度费用
        groundYearSmallRegular: null, //地上普通用户小车年度费用
        groundYearMidRegular: null, //地上普通用户中车年度费用
        groundYearBigRegular: null, //地上普通用户大车年度费用
        undergroundMonthSmallRegular: null, //地下普通用户小车月度费用
        undergroundMonthMidRegular: null, //地下普通用户中车月度费用
        undergroundMonthBigRegular: null, //地下普通用户大车月度费用
        undergroundQuarterSmallRegular: null, //地下普通用户小车季度费用
        undergroundQuarterMidRegular: null, //地下普通用户中车季度费用
        undergroundQuarterBigRegular: null, //地下普通用户大车季度费用
        undergroundHalfSmallRegular: null, //地下普通用户小车半年度费用
        undergroundHalfMidRegular: null, //地下普通用户中车半年度费用
        undergroundHalfBigRegular: null, //地下普通用户大车半年度费用
        undergroundYearSmallRegular: null, //地下普通用户小车年度费用
        undergroundYearMidRegular: null, //地下普通用户中车年度费用
        undergroundYearBigRegular: null, //地下普通用户大车年度费用
        groundMonthSmallEmployee: null, //地上员工小车月度费用
        groundMonthMidEmployee: null, //地上员工中车月度费用
        groundMonthBigEmployee: null, //地上员工大车月度费用
        groundQuarterSmallEmployee: null, //地上员工用户小车季度费用
        groundQuarterMidEmployee: null, //地上员工用户中车季度费用
        groundQuarterBigEmployee: null, //地上员工用户大车季度费用
        groundHalfSmallEmployee: null, //地上员工用户小车半年度费用
        groundHalfMidEmployee: null, //地上员工用户中车半年度费用
        groundHalfBigEmployee: null, //地上员工用户大车半年度费用
        groundYearSmallEmployee: null, //地上员工用户小车年度费用
        groundYearMidEmployee: null, //地上员工用户中车年度费用
        groundYearBigEmployee: null, //地上员工用户大车年度费用
        undergroundMonthSmallEmployee: null, //地下员工用户小车月度费用
        undergroundMonthMidEmployee: null, //地下员工用户中车月度费用
        undergroundMonthBigEmployee: null, //地下员工用户大车月度费用
        undergroundQuarterSmallEmployee: null, //地下员工用户小车季度费用
        undergroundQuarterMidEmployee: null, //地下员工用户中车季度费用
        undergroundQuarterBigEmployee: null, //地下员工用户大车季度费用
        undergroundHalfSmallEmployee: null, //地下员工用户小车半年度费用
        undergroundHalfMidEmployee: null, //地下员工用户中车半年度费用
        undergroundHalfBigEmployee: null, //地下员工用户大车半年度费用
        undergroundYearSmallEmployee: null, //地下员工用户小车年度费用
        undergroundYearMidEmployee: null, //地下员工用户中车年度费用
        undergroundYearBigEmployee: null, //地下员工用户大车年度费用
        parkingLots: [] //车场信息
      }, //车位详情
      buyUnits: [1, 2, 4, 8],
      buyUnitName: null,
      isList: [
        { enumName: "是", enumValue: 1 },
        { enumName: "否", enumValue: 0 }
      ],
      unitTimeList: [
        { enumName: 30, enumValue: 30 },
        { enumName: 60, enumValue: 60 }
      ],
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名", trigger: "blur" },
          {
            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_\-]{1,20}$/,
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
        isWorker: [
          {
            required: true,
            message: "请选择是否区分入驻企业员工",
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
        buyUnit: [
          { required: true, message: "请选择收费单位", trigger: "blur" }
        ],
        leaseEndTime: [
          { required: true, message: "请输入夜间开始计时时间", trigger: "blur" }
        ],
        groundMonthSmallRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundMonthMidRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundMonthBigRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundQuarterSmallRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundQuarterMidRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundQuarterBigRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundHalfSmallRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundHalfMidRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundHalfBigRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundYearSmallRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundYearMidRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundYearBigRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundMonthSmallRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundMonthMidRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundMonthBigRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundQuarterSmallRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundQuarterMidRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundQuarterBigRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundHalfSmallRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundHalfMidRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundHalfBigRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundYearSmallRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundYearMidRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundYearBigRegular: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundMonthSmallEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundMonthMidEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundMonthBigEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundQuarterSmallEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundQuarterMidEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundQuarterBigEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundHalfSmallEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundHalfMidEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundHalfBigEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundYearSmallEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundYearMidEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        groundYearBigEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundMonthSmallEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundMonthMidEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundMonthBigEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundQuarterSmallEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundQuarterMidEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundQuarterBigEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundHalfSmallEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundHalfMidEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundHalfBigEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundYearSmallEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundYearMidEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ],
        undergroundYearBigEmployee: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validateNo
          }
        ]
      },
      Dictionaries: {
        enumTypes: "LONG_UNIT,RULE_VEHICLE_TYPE,RULE_PARKING_DIRECTION"
      },
      enumsData: {} //字典表返回数据
    };
  },
  created() {
    this.getFieldTable();
  },
  watch: {
    "newList.leaseEndTime"(val) {
      if (val) {
        let date = new Date(val);
        // 确保日期被选中后再设置时间。
        this.newList.leaseEndTime = date.setHours(23, 59, 59); // 强制设置为23:59。
      }
    }
  },

  computed: {},
  methods: {
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
      });
    },
    resetTolls() {
      const obj = {
        groundMonthSmallRegular: null, //地上普通用户小车月度费用
        groundMonthMidRegular: null, //地上普通用户中车月度费用
        groundMonthBigRegular: null, //地上普通用户大车月度费用
        groundQuarterSmallRegular: null, //地上普通用户小车季度费用
        groundQuarterMidRegular: null, //地上普通用户中车季度费用
        groundQuarterBigRegular: null, //地上普通用户大车季度费用
        groundHalfSmallRegular: null, //地上普通用户小车半年度费用
        groundHalfMidRegular: null, //地上普通用户中车半年度费用
        groundHalfBigRegular: null, //地上普通用户大车半年度费用
        groundYearSmallRegular: null, //地上普通用户小车年度费用
        groundYearMidRegular: null, //地上普通用户中车年度费用
        groundYearBigRegular: null, //地上普通用户大车年度费用
        undergroundMonthSmallRegular: null, //地下普通用户小车月度费用
        undergroundMonthMidRegular: null, //地下普通用户中车月度费用
        undergroundMonthBigRegular: null, //地下普通用户大车月度费用
        undergroundQuarterSmallRegular: null, //地下普通用户小车季度费用
        undergroundQuarterMidRegular: null, //地下普通用户中车季度费用
        undergroundQuarterBigRegular: null, //地下普通用户大车季度费用
        undergroundHalfSmallRegular: null, //地下普通用户小车半年度费用
        undergroundHalfMidRegular: null, //地下普通用户中车半年度费用
        undergroundHalfBigRegular: null, //地下普通用户大车半年度费用
        undergroundYearSmallRegular: null, //地下普通用户小车年度费用
        undergroundYearMidRegular: null, //地下普通用户中车年度费用
        undergroundYearBigRegular: null, //地下普通用户大车年度费用
        groundMonthSmallEmployee: null, //地上员工小车月度费用
        groundMonthMidEmployee: null, //地上员工中车月度费用
        groundMonthBigEmployee: null, //地上员工大车月度费用
        groundQuarterSmallEmployee: null, //地上员工用户小车季度费用
        groundQuarterMidEmployee: null, //地上员工用户中车季度费用
        groundQuarterBigEmployee: null, //地上员工用户大车季度费用
        groundHalfSmallEmployee: null, //地上员工用户小车半年度费用
        groundHalfMidEmployee: null, //地上员工用户中车半年度费用
        groundHalfBigEmployee: null, //地上员工用户大车半年度费用
        groundYearSmallEmployee: null, //地上员工用户小车年度费用
        groundYearMidEmployee: null, //地上员工用户中车年度费用
        groundYearBigEmployee: null, //地上员工用户大车年度费用
        undergroundMonthSmallEmployee: null, //地下员工用户小车月度费用
        undergroundMonthMidEmployee: null, //地下员工用户中车月度费用
        undergroundMonthBigEmployee: null, //地下员工用户大车月度费用
        undergroundQuarterSmallEmployee: null, //地下员工用户小车季度费用
        undergroundQuarterMidEmployee: null, //地下员工用户中车季度费用
        undergroundQuarterBigEmployee: null, //地下员工用户大车季度费用
        undergroundHalfSmallEmployee: null, //地下员工用户小车半年度费用
        undergroundHalfMidEmployee: null, //地下员工用户中车半年度费用
        undergroundHalfBigEmployee: null, //地下员工用户大车半年度费用
        undergroundYearSmallEmployee: null, //地下员工用户小车年度费用
        undergroundYearMidEmployee: null, //地下员工用户中车年度费用
        undergroundYearBigEmployee: null //地下员工用户大车年度费用
      };
      const obj2 = JSON.parse(JSON.stringify(this.newList));
      const newOnj = { ...obj2, ...obj };
      this.newList = newOnj;
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
          buyUnit: 15, //'收费单位 1-月度 2-季度 4-半年 8-年度'
          isWorker: 1, //'是否区分入驻企业员工  1-是 0-否',
          isVehicleType: 0, //'是否车辆类型 1-是 0-否',
          isGround: 0, //'是否地下  1-是 0-否'
          leaseEndTime: null, //长租结束时间
          createTime: null, //创建时间
          status: 1, //使用状态 0-未使用 1-使用中',
          deleteFlag: null, //
          id: null,
          ruleParkingLeasesId: null, //规则id
          groundMonthSmallRegular: null, //地上普通用户小车月度费用
          groundMonthMidRegular: null, //地上普通用户中车月度费用
          groundMonthBigRegular: null, //地上普通用户大车月度费用
          groundQuarterSmallRegular: null, //地上普通用户小车季度费用
          groundQuarterMidRegular: null, //地上普通用户中车季度费用
          groundQuarterBigRegular: null, //地上普通用户大车季度费用
          groundHalfSmallRegular: null, //地上普通用户小车半年度费用
          groundHalfMidRegular: null, //地上普通用户中车半年度费用
          groundHalfBigRegular: null, //地上普通用户大车半年度费用
          groundYearSmallRegular: null, //地上普通用户小车年度费用
          groundYearMidRegular: null, //地上普通用户中车年度费用
          groundYearBigRegular: null, //地上普通用户大车年度费用
          undergroundMonthSmallRegular: null, //地下普通用户小车月度费用
          undergroundMonthMidRegular: null, //地下普通用户中车月度费用
          undergroundMonthBigRegular: null, //地下普通用户大车月度费用
          undergroundQuarterSmallRegular: null, //地下普通用户小车季度费用
          undergroundQuarterMidRegular: null, //地下普通用户中车季度费用
          undergroundQuarterBigRegular: null, //地下普通用户大车季度费用
          undergroundHalfSmallRegular: null, //地下普通用户小车半年度费用
          undergroundHalfMidRegular: null, //地下普通用户中车半年度费用
          undergroundHalfBigRegular: null, //地下普通用户大车半年度费用
          undergroundYearSmallRegular: null, //地下普通用户小车年度费用
          undergroundYearMidRegular: null, //地下普通用户中车年度费用
          undergroundYearBigRegular: null, //地下普通用户大车年度费用
          groundMonthSmallEmployee: null, //地上员工小车月度费用
          groundMonthMidEmployee: null, //地上员工中车月度费用
          groundMonthBigEmployee: null, //地上员工大车月度费用
          groundQuarterSmallEmployee: null, //地上员工用户小车季度费用
          groundQuarterMidEmployee: null, //地上员工用户中车季度费用
          groundQuarterBigEmployee: null, //地上员工用户大车季度费用
          groundHalfSmallEmployee: null, //地上员工用户小车半年度费用
          groundHalfMidEmployee: null, //地上员工用户中车半年度费用
          groundHalfBigEmployee: null, //地上员工用户大车半年度费用
          groundYearSmallEmployee: null, //地上员工用户小车年度费用
          groundYearMidEmployee: null, //地上员工用户中车年度费用
          groundYearBigEmployee: null, //地上员工用户大车年度费用
          undergroundMonthSmallEmployee: null, //地下员工用户小车月度费用
          undergroundMonthMidEmployee: null, //地下员工用户中车月度费用
          undergroundMonthBigEmployee: null, //地下员工用户大车月度费用
          undergroundQuarterSmallEmployee: null, //地下员工用户小车季度费用
          undergroundQuarterMidEmployee: null, //地下员工用户中车季度费用
          undergroundQuarterBigEmployee: null, //地下员工用户大车季度费用
          undergroundHalfSmallEmployee: null, //地下员工用户小车半年度费用
          undergroundHalfMidEmployee: null, //地下员工用户中车半年度费用
          undergroundHalfBigEmployee: null, //地下员工用户大车半年度费用
          undergroundYearSmallEmployee: null, //地下员工用户小车年度费用
          undergroundYearMidEmployee: null, //地下员工用户中车年度费用
          undergroundYearBigEmployee: null, //地下员工用户大车年度费用
          parkingLots: [] //车场信息
          //收费信息
        };
        this.resetTolls();
        this.buyUnits = [1, 2, 4, 8];
        this.editRuleName = null;
        if (this.$refs["parkingForm"]) {
          this.$nextTick(() => {
            this.$refs["parkingForm"].clearValidate();
          });
        }
      }
    },
    selBuyUnit(e) {
      //计算求和
      let number = e.reduce((acc, val) => acc + val, 0);
      this.newList.buyUnit = number;
      this.resetTolls();
    },
    //获取详情
    getDetials(id) {
      let para = { id: id };
      ruleParkingLeasesDetail(para).then(response => {
        let ojb1 = response.data.rule;
        let ojb2 = response.data.rule.tolls[0];
        this.newList = { ...ojb1, ...ojb2 };
        this.getBuyUnits();
        this.editRuleName = response.data.rule.ruleName;
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
    getBuyUnits() {
      if (this.newList.buyUnit == 1) {
        this.buyUnits = [1];
        this.buyUnitName = "月度";
      } else if (this.newList.buyUnit == 2) {
        this.buyUnits = [2];
        this.buyUnitName = "季度";
      } else if (this.newList.buyUnit == 3) {
        this.buyUnits = [1, 2];
        this.buyUnitName = "月度，季度";
      } else if (this.newList.buyUnit == 4) {
        this.buyUnits = [4];
        this.buyUnitName = "半年度";
      } else if (this.newList.buyUnit == 5) {
        this.buyUnits = [1, 4];
        this.buyUnitName = "月度，半年度";
      } else if (this.newList.buyUnit == 6) {
        this.buyUnits = [2, 4];
        this.buyUnitName = "季度，半年度";
      } else if (this.newList.buyUnit == 7) {
        this.buyUnits = [1, 2, 4];
        this.buyUnitName = "月度，季度，半年度";
      } else if (this.newList.buyUnit == 8) {
        this.buyUnits = [8];
        this.buyUnitName = "年度";
      } else if (this.newList.buyUnit == 9) {
        this.buyUnits = [1, 8];
        this.buyUnitName = "月度，年度";
      } else if (this.newList.buyUnit == 10) {
        this.buyUnits = [2, 8];
        this.buyUnitName = "季度，年度";
      } else if (this.newList.buyUnit == 11) {
        this.buyUnits = [1, 2, 8];
        this.buyUnitName = "月度，季度，年度";
      } else if (this.newList.buyUnit == 12) {
        this.buyUnits = [4, 8];
        this.buyUnitName = "半年度，年度";
      } else if (this.newList.buyUnit == 13) {
        this.buyUnits = [1, 4, 8];
        this.buyUnitName = "月度，半年度，年度";
      } else if (this.newList.buyUnit == 14) {
        this.buyUnits = [2, 4, 8];
        this.buyUnitName = "季度，半年度，年度";
      } else if (this.newList.buyUnit == 15) {
        this.buyUnits = [1, 2, 4, 8];
        this.buyUnitName = "月度，季度，半年度，年度";
      }
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
    //添加长租规则
    toAdd() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存长租规则吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.getPara();
            ruleParkingLeasesInsert(para)
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

    //编辑长租规则
    toEidt() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的长租规则吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.getPara();
            ruleParkingLeasesUpdate(para)
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
    },
    getPara() {
      let {
        ruleName,
        buyUnit,
        isWorker,
        isVehicleType,
        isGround,
        leaseEndTime,
        id,
        ruleParkingLeasesId,
        groundMonthSmallRegular,
        groundMonthMidRegular,
        groundMonthBigRegular,
        groundQuarterSmallRegular,
        groundQuarterMidRegular,
        groundQuarterBigRegular,
        groundHalfSmallRegular,
        groundHalfMidRegular,
        groundHalfBigRegular,
        groundYearSmallRegular,
        groundYearMidRegular,
        groundYearBigRegular,
        undergroundMonthSmallRegular,
        undergroundMonthMidRegular,
        undergroundMonthBigRegular,
        undergroundQuarterSmallRegular,
        undergroundQuarterMidRegular,
        undergroundQuarterBigRegular,
        undergroundHalfSmallRegular,
        undergroundHalfMidRegular,
        undergroundHalfBigRegular,
        undergroundYearSmallRegular,
        undergroundYearMidRegular,
        undergroundYearBigRegular,
        groundMonthSmallEmployee,
        groundMonthMidEmployee,
        groundMonthBigEmployee,
        groundQuarterSmallEmployee,
        groundQuarterMidEmployee,
        groundQuarterBigEmployee,
        groundHalfSmallEmployee,
        groundHalfMidEmployee,
        groundHalfBigEmployee,
        groundYearSmallEmployee,
        groundYearMidEmployee,
        groundYearBigEmployee,
        undergroundMonthSmallEmployee,
        undergroundMonthMidEmployee,
        undergroundMonthBigEmployee,
        undergroundQuarterSmallEmployee,
        undergroundQuarterMidEmployee,
        undergroundQuarterBigEmployee,
        undergroundHalfSmallEmployee,
        undergroundHalfMidEmployee,
        undergroundHalfBigEmployee,
        undergroundYearSmallEmployee,
        undergroundYearMidEmployee,
        undergroundYearBigEmployee
      } = this.newList;
      let tolls = {
        ruleParkingLeasesId,
        groundMonthSmallRegular,
        groundMonthMidRegular,
        groundMonthBigRegular,
        groundQuarterSmallRegular,
        groundQuarterMidRegular,
        groundQuarterBigRegular,
        groundHalfSmallRegular,
        groundHalfMidRegular,
        groundHalfBigRegular,
        groundYearSmallRegular,
        groundYearMidRegular,
        groundYearBigRegular,
        undergroundMonthSmallRegular,
        undergroundMonthMidRegular,
        undergroundMonthBigRegular,
        undergroundQuarterSmallRegular,
        undergroundQuarterMidRegular,
        undergroundQuarterBigRegular,
        undergroundHalfSmallRegular,
        undergroundHalfMidRegular,
        undergroundHalfBigRegular,
        undergroundYearSmallRegular,
        undergroundYearMidRegular,
        undergroundYearBigRegular,
        groundMonthSmallEmployee,
        groundMonthMidEmployee,
        groundMonthBigEmployee,
        groundQuarterSmallEmployee,
        groundQuarterMidEmployee,
        groundQuarterBigEmployee,
        groundHalfSmallEmployee,
        groundHalfMidEmployee,
        groundHalfBigEmployee,
        groundYearSmallEmployee,
        groundYearMidEmployee,
        groundYearBigEmployee,
        undergroundMonthSmallEmployee,
        undergroundMonthMidEmployee,
        undergroundMonthBigEmployee,
        undergroundQuarterSmallEmployee,
        undergroundQuarterMidEmployee,
        undergroundQuarterBigEmployee,
        undergroundHalfSmallEmployee,
        undergroundHalfMidEmployee,
        undergroundHalfBigEmployee,
        undergroundYearSmallEmployee,
        undergroundYearMidEmployee,
        undergroundYearBigEmployee
      };
      let para = {
        ruleName,
        buyUnit,
        isWorker,
        isVehicleType,
        isGround,
        leaseEndTime,
        id: ruleParkingLeasesId,
        tolls: [tolls]
      };
      return para;
    }
  }
};
</script>

<style lang="scss" scoped>
.longTermRentalRules_content {
  height: calc(100vh - 250px);
  width: 100%;
  overflow: auto;

  .longTermRentalRules_content_title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #e7f4f2;
    color: #037659;
    font-size: 18px;
    text-align: center;
    margin-bottom: 30px;
    .longTermRentalRules_content_title_prompt {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: #333;
    }
  }
  .longTermRentalRules_content_worker {
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
    .longTermRentalRules_content_worker_line {
      height: 20px;
      width: 4px;
      margin: 10px 2px;
      background: #02c5a7;
    }
    .longTermRentalRules_content_worker_text {
      width: 100px;
    }
  }
  .longTermRentalRules_content_worker_box {
    width: 100%;
    background: #f5fdfc;
    display: flex;
    padding-bottom: 10px;
    .longTermRentalRules_content_worker_box_ground {
      flex: 1;
      display: flex;
    }
    .longTermRentalRules_content_worker_box_ground_title {
      width: 120px;
      text-align: center;
      color: #037659;
      font-size: 16px;
      font-weight: bold;
      min-height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .longTermRentalRules_content_worker_box_ground_box {
      flex: 1;
      padding-top: 20px;
    }
  }
  .longTermRentalRules_content_worker_box_dayNight_box {
    flex: 1;
    .longTermRentalRules_content_worker_box_dayNight_box_item {
      display: inline-block;
      width: calc(100vw - 500px);
      height: 100px;
      padding: 10px 0;
    }
    .lineTwo {
      margin-left: 236px;
    }
  }
  .longTermRentalRules_content_box {
    display: flex;
    padding: 0 20px;
    .longTermRentalRules_content_box_left {
      flex: 1;
    }
    .longTermRentalRules_content_box_right {
      flex: 1;
    }
  }
  .base_dialog_condit_hasprompt {
    position: relative;
    margin-bottom: 40px;
    .longTermRentalRules_content_prompt {
      position: absolute;
      width: 300px;
      top: 40px;
      left: 180px;
      font-size: 12px;
    }
  }
  .small_text {
    width: 90px !important;
    text-align: center;
  }
  .small_text2 {
    width: 10%;
    text-align: center;
  }
}
</style>
