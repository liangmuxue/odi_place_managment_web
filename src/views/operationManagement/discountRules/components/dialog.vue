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
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:10px 100px">
            <span class="base_dialog_condit">
              <el-form-item label="活动名称" prop="ruleName">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.ruleName }}</span
                >
                <el-input
                  v-else
                  v-model="newList.ruleName"
                  placeholder="输入活动名称"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="适用类型" prop="parkingType">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.parkingTypeName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.parkingType"
                  placeholder="选择适用类型"
                  clearable
                  class="filter-item"
                  :disabled="pageType == 2"
                  @change="parkingTypeChange"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in enumsData.PREFERENTIAL_PARKING_TYPE"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="newList.parkingType == 1">
              <el-form-item label="适用购买单位" prop="buyUnit">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.buyUnitName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.buyUnit"
                  placeholder="选择适用购买单位"
                  :disabled="pageType == 2"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in enumsData.PREFERENTIAL_BUY_UNIT"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="优惠券类型" prop="offerType">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{
                    newList.offerType == 1 ? "现金优惠券" : "折扣优惠券"
                  }}</span
                >
                <el-select
                  v-else
                  v-model="newList.offerType"
                  placeholder="选择适用购买单位"
                  @change="offerTypeChange"
                  :disabled="pageType == 2"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in offerTypes"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span class="base_dialog_condit" v-if="newList.offerType == 0">
              <el-form-item label="折扣数值(折)" prop="discount">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.discount }}</span
                >
                <el-input
                  v-else
                  v-model="newList.discount"
                  placeholder="输入折扣"
                  :disabled="pageType == 2"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="newList.offerType == 0">
              <el-form-item label="封顶优惠金额(元)" prop="maxAmount">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.maxAmount }}</span
                >
                <el-input
                  v-else
                  v-model="newList.maxAmount"
                  placeholder="输入封顶优惠金额"
                  :disabled="pageType == 2"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="newList.offerType == 1">
              <el-form-item label="优惠面值(元)" prop="denomination">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.denomination }}</span
                >
                <el-input
                  v-else
                  v-model="newList.denomination"
                  placeholder="输入优惠面值"
                  :disabled="pageType == 2"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="使用门槛" prop="doorsillType">
                <el-radio-group
                  v-model="newList.doorsillType"
                  :disabled="pageType == 2 || pageType == 3"
                >
                  <el-radio :label="0">无门槛</el-radio>
                  <el-radio :label="1"
                    ><span v-show="newList.doorsillType !== 1">有门槛</span>
                  </el-radio>
                </el-radio-group>
                <span v-if="newList.doorsillType === 1">
                  满
                  <span v-if="pageType == 3"> {{ newList.doorsill }}</span>
                  <el-input
                    v-else
                    v-model="newList.doorsill"
                    placeholder="输入使用门槛"
                    :disabled="pageType == 2"
                    style="width: 150px"
                    class="filter-item"
                    size="small"
                  />
                  元可用
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="领取后有效期(天)" prop="expirationDay">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.expirationDay }}</span
                >
                <el-input
                  v-else
                  v-model="newList.expirationDay"
                  placeholder="输入领取后有效期"
                  :disabled="pageType == 2"
                  @input="handleInput1"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="活动时间" prop="activityStartTime">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{
                    newList.activityStartTime
                      | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                  }}
                  -
                  {{
                    newList.activityEndTime
                      | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                  }}
                </span>
                <el-date-picker
                  v-else
                  style="width: 72%"
                  v-model="time"
                  type="daterange"
                  :disabled="pageType == 2"
                  range-separator="-"
                  start-placeholder="请选择时间"
                  end-placeholder
                  :default-time="['00:00:00', '23:59:59']"
                  size="small"
                ></el-date-picker>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="优惠券总数(个)" prop="totalType">
                <el-radio-group
                  v-model="newList.totalType"
                  :disabled="pageType == 2 || pageType == 3"
                >
                  <el-radio :label="0">不限</el-radio>
                  <el-radio :label="1">有限</el-radio>
                </el-radio-group>
                <span v-if="newList.totalType === 1">
                  <span
                    class="base_dialog_condit_text"
                    style="width: 300px"
                    v-if="pageType == 3"
                  >
                    {{ rulePreferentialCount }}
                    <span style="margin-left:40px"
                      >剩余优惠券数量(个):{{ remaining }}</span
                    >
                  </span>
                  <el-input
                    v-else
                    v-model="rulePreferentialCount"
                    placeholder="输入优惠券总数"
                    :disabled="pageType == 2"
                    @input="handleInput6"
                    style="width: 150px"
                    class="filter-item"
                    size="small"
                  />
                </span>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="适用车场" prop="parkingLotIds">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.parkingLotNames }}</span
                >
                <el-select
                  v-else
                  v-model="newList.parkingLotIds"
                  placeholder="选择适用车场"
                  clearable
                  multiple
                  collapse-tags
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                  @change="selectAll"
                >
                  <el-option
                    v-for="item in parkingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="pageType == 3">
              <el-form-item label="状态" prop="parkingLotIds">
                <span class="offLine_ball" v-show="newList.status == 1"></span>
                <span v-show="newList.status == 1" class="offLine">
                  已结束</span
                >
                <span class="onLine_ball" v-show="newList.status == 0"></span>
                <span v-show="newList.status == 0" class="onLine"> 正常</span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <div v-if="newList.parkingType === 1">
                注：1. 仅在支付指定购买单位长租订单时，可使用本券享受优惠；
              </div>
              <div v-if="newList.parkingType === 0">
                注：1. 仅在支付单次临停订单时，可使用本券享受优惠；
              </div>
              <div
                class="discountRulesDialogText"
                v-if="newList.parkingType === 1 || newList.parkingType === 0"
              >
                2. 不能与其他优惠券同时使用；
              </div>
              <div
                class="discountRulesDialogText"
                v-if="newList.parkingType === 1 || newList.parkingType === 0"
              >
                3. 优惠券仅限单次使用，不可重复使用；
              </div>
              <div
                class="discountRulesDialogText"
                v-if="newList.parkingType === 1 || newList.parkingType === 0"
              >
                4. 每个活动每个用户ID仅限领取一次；
              </div>
              <div
                class="discountRulesDialogText"
                v-if="newList.parkingType === 1 || newList.parkingType === 0"
              >
                5. 领取后仅限有效期内使用，过期无效。
              </div>
            </span>
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
  rulePreferentialCheckName, //优惠规则检查规则名是否存在
  rulePreferentialDetail, //优惠规则详情
  rulePreferentialInsert, //优惠规则新增
  rulePreferentialUpdate //优惠规则修改
} from "@/api/operationManagement";
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";

import { fieldTable } from "@/api/common";

export default {
  components: {},
  data() {
    const validateEditRuleName = (rule, value, callback) => {
      if (this.editRuleName !== value) {
        let para = {
          ruleName: value
        };
        rulePreferentialCheckName(para).then(response => {
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

    const validateTotalType = (rule, value, callback) => {
      if (value == 0) {
        callback();
      } else if (value > 0 && this.rulePreferentialCount) {
        callback();
      } else {
        callback(new Error("请选择"));
      }
    };
    const validateDoorsillType = (rule, value, callback) => {
      if (value == 0) {
        callback();
      } else if (value == 1) {
        const doorsill = this.newList.doorsill;
        const regex = /^(?:[1-9]\d*|[0-9]*\.\d{1})$/;
        const isValid = regex.test(doorsill);
        if (isValid) {
          callback();
        } else {
          callback(new Error("请输入大于0的数字，最多保留一位小数"));
        }
      } else {
        callback(new Error("请选择"));
      }
    };
    const validateParkingLots = (rule, value, callback) => {
      if (value.length > 0) {
        callback();
      } else {
        callback(new Error("请选择适用停车场"));
      }
    };

    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      editRuleName: null, //编辑规则名
      parkingLots: "", //使用中的停车场
      newList: {
        ruleName: "", //活动名称
        parkingType: null, //适用类型
        parkingTypeName: "", //适用类型
        buyUnit: null, //适用购买单位
        buyUnitName: "", //适用购买单位
        discount: null, //折扣
        maxAmount: null, //封顶优惠金额
        expirationDay: null, //领取后有效期
        activityStartTime: null, //活动开始时间
        activityEndTime: null, //活动开始时间
        parkingLotIds: [], //适用停车场id
        parkingLotNames: "", //适用停车场name
        offerType: null, //优惠类型 0-折扣 1-现金
        totalType: 0, //总数类型 0-无限 1-有限
        denomination: "", //面值
        doorsillType: 0, //门槛
        doorsill: "", //门槛
        rulePreferentialCount: {
          total: null
        },
        parkingLots: [] //适用停车场
      }, //车位详情
      rulePreferentialCount: null,
      remaining: null,
      rules: {
        ruleName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            required: true,
            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_\-]{1,20}$/,
            message: "请输入20以内字符，且不含特殊字符",
            trigger: "blur"
          },
          {
            required: true,
            message: "活动名已存在",
            trigger: "blur",
            validator: validateEditRuleName
          }
        ],
        parkingType: [
          { required: true, message: "请选择适用类型", trigger: "change" }
        ],
        offerType: [
          { required: true, message: "请选择优惠券类型", trigger: "change" }
        ],
        buyUnit: [
          { required: true, message: "请选择适用购买单位", trigger: "blur" }
        ],
        discount: [
          {
            required: true,
            pattern: /^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/,
            message:
              "请输入0-10之间的整数或小数，最多保留1位小数，不含 0 和 10",
            trigger: "blur"
          }
        ],
        maxAmount: [
          {
            required: true,
            pattern: /^(?:[1-9]\d*|[0-9]*\.\d{1})$/,
            message: "请输入大于0的整数或小数，最多保留1位小数",
            trigger: "blur"
          }
        ],
        denomination: [
          {
            required: true,
            pattern: /^(?:[1-9]\d*|[0-9]*\.\d{1})$/,
            message: "请输入大于0的整数或小数，最多保留1位小数",
            trigger: "blur"
          }
        ],
        doorsillType: [
          {
            required: true,
            message: "",
            trigger: "change",
            validator: validateDoorsillType
          }
        ],
        expirationDay: [
          { required: true, message: "请输入领取后有效期", trigger: "blur" }
        ],
        activityStartTime: [
          { required: true, message: "请选择领取后有效期", trigger: "blur" }
        ],
        totalType: [
          {
            required: true,
            message: "请输入",
            trigger: "change",
            validator: validateTotalType
          }
        ],

        parkingLotIds: [
          {
            required: true,
            message: "请选择适用停车场",
            trigger: "change",
            validator: validateParkingLots
          }
        ]
      },
      time: [],
      parkingList: [],
      oldOptions: [], //
      offerTypes: [
        { enumName: "折扣优惠券", enumValue: 0 },
        { enumName: "现金优惠券", enumValue: 1 }
      ],
      Dictionaries: {
        enumTypes:
          "PREFERENTIAL_BUY_UNIT,RULE_VEHICLE_TYPE,PREFERENTIAL_PARKING_TYPE,RULE_PARKING_DIRECTION"
      },
      enumsData: {} //字典表返回数据
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
    this.getFieldTable();
    this.getparking();
  },

  methods: {
    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
        this.parkingList.unshift({ id: 0, name: "全部" });
      });
    },
    /**
     * 白名单 全选
     */
    selectAll(val) {
      // 上一次的选中数据
      let allValues = [];
      //保留所有值
      this.parkingList.forEach(item => {
        allValues.push(item.id);
      });
      // 若是全部选择
      var tem = val.some(item => {
        return item == 0;
      });
      if (tem) {
        this.newList.parkingLotIds = allValues;
      }

      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.some(item => {
        return item == 0;
      });

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal && !tem) this.newList.parkingLotIds = [];

      if (oldVal && tem) {
        const index = val.indexOf(0);
        val.splice(index, 1); // 排除全选选项
        this.newList.parkingLotIds = val;
      }

      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal && !tem) {
        if (val.length === allValues.length - 1)
          this.newList.parkingLotIds = [0].concat(val);
      }
      this.oldOptions = this.newList.parkingLotIds;
    },

    changeTime() {
      if (this.time[0]) {
        this.newList.activityStartTime = /^\d{10}$|^\d{13}$/.test(this.time[0])
          ? this.time[0]
          : this.time[0].getTime();
      }
      if (this.time[1]) {
        this.newList.activityEndTime = /^\d{10}$|^\d{13}$/.test(this.time[1])
          ? this.time[1]
          : this.time[1].getTime();
      }
    },

    parkingTypeChange(e) {
      if (e !== 1) {
        this.newList.buyUnit = null;
      }
    },
    offerTypeChange(e) {
      console.log(111, e);
      if (e === "") {
        this.newList.offerType = null;
      }
      this.newList.discount = null;
      this.newList.maxAmount = null;
      this.newList.denomination = null;
    },
    //获取单位名
    getName(e) {
      let arr = this.enumsData.PREFERENTIAL_BUY_UNIT;
      let name = "";
      arr.forEach(el => {
        if (e == el.enumValue) {
          name = el.enumName;
        }
      });
      return name;
    },
    handleInput1(value) {
      // 限制输入为0到365之间的整数
      this.newList.expirationDay = value.toString().replace(/[^0-9]/g, "");
      if (this.newList.expirationDay > 365) {
        this.newList.expirationDay = 365; // 如果超过365，设置为365
      } else if (this.newList.expirationDay == 0) {
        this.newList.expirationDay = 1; // 如果小于0，设置为0
      }
    },
    handleInput6(value) {
      // 限制输入为大于0间的整数
      this.rulePreferentialCount = value.toString().replace(/[^0-9]/g, "");
      if (this.rulePreferentialCount == 0) {
        this.rulePreferentialCount = 1; // 如果小于0，设置为0
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
          ruleName: "", //活动名称
          parkingType: null, //适用类型
          parkingTypeName: "", //适用类型
          buyUnit: null, //适用购买单位
          buyUnitName: "", //适用购买单位
          discount: null, //折扣
          maxAmount: null, //封顶优惠金额
          expirationDay: null, //领取后有效期
          activityStartTime: null, //活动开始时间
          activityEndTime: null, //活动开始时间
          parkingLotIds: [], //适用停车场id
          parkingLotNames: "", //适用停车场name
          offerType: null, //优惠类型 0-折扣 1-现金
          totalType: 0, //总数类型 0-无限 1-有限
          denomination: "", //面值
          doorsillType: 0, //门槛
          doorsill: "", //门槛
          rulePreferentialCount: {
            total: null
          },
          parkingLots: [] //适用停车场
        };
        this.editRuleName = null;
        this.time = ["", ""];
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
      rulePreferentialDetail(para).then(response => {
        this.newList = response.data;
        if (response.data.doorsill == 0) {
          this.$set(this.newList, "doorsillType", 0);
        } else {
          this.$set(this.newList, "doorsillType", 1);
        }
        this.editRuleName = response.data.ruleName;
        this.time = [
          response.data.activityStartTime,
          response.data.activityEndTime
        ];
        if (response.data.totalType !== 0) {
          this.rulePreferentialCount =
            response.data.rulePreferentialCount.total;
          this.remaining = response.data.rulePreferentialCount.remaining;
        }
        let idArr = [];
        let nameArr = [];
        let list = response.data.parkingLots;
        if (response.data.parkingLots && response.data.parkingLots.length) {
          list.forEach(el => {
            idArr.push(el.id);
            nameArr.push(el.name);
          });
          if (list.length == this.parkingList.length - 1) {
            idArr.unshift(0);
          }
        }
        this.$set(this.newList, "parkingLotIds", idArr);
        this.$set(this.newList, "parkingLotNames", nameArr.toString());
      });
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
    //添加优惠规则
    toAdd() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存优惠规则吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            if (para.totalType == 0) {
              this.$set(para, "rulePreferentialCount", null);
            } else {
              this.$set(para, "rulePreferentialCount", {
                total: this.rulePreferentialCount
              });
            }
            if (para.doorsillType == 0) {
              para.doorsill = 0;
            }
            para.parkingLots = para.parkingLotIds.map(n => ({
              id: n
            }));
            rulePreferentialInsert(para)
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
    //编辑优惠规则
    toEidt() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的优惠规则吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            para.parkingLots = para.parkingLotIds.map(n => ({
              id: n
            }));
            rulePreferentialUpdate(para)
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
.a {
  padding-left: 160px;
}
.discountRulesDialogText {
  padding-left: 32px;
}
</style>
