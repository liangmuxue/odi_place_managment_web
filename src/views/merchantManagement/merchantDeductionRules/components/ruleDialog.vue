<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="140px">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:20px 20px 0px 20px;">
            <span class="base_dialog_condit">
              <el-form-item label="抵扣券名称" prop="deductionName">
                <span class="base_dialog_condit_text" v-if="pageType === 3 || (pageType === 2 && hasLinkedMerchants)">
                  {{ form.deductionName }}
                </span>
                <el-input
                  v-else
                  v-model="form.deductionName"
                  placeholder="请输入抵扣券名称"
                  style="width: 90%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="抵扣类型" prop="deductionType">
                <span class="base_dialog_condit_text" v-if="pageType === 3 || (pageType === 2 && hasLinkedMerchants)">
                  {{ form.deductionType }}
                </span>
                <el-select
                  v-else
                  v-model="form.deductionType"
                  placeholder="请选择抵扣类型"
                  clearable
                  class="filter-item"
                  style="width: 90%"
                  size="small"
                  @change="onTypeChange"
                >
                  <el-option
                    v-for="item in deductionTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="扣款方式">
                <span class="base_dialog_condit_text">
                  {{ form.deductionMode }}
                </span>
              </el-form-item>
            </span>

            <span class="base_dialog_condit" v-if="showUnit">
              <el-form-item label="抵扣单位" prop="deductionUnit">
                <span class="base_dialog_condit_text" v-if="pageType === 3">
                  {{ form.deductionUnit }}
                </span>
                <el-radio-group
                  v-else
                  v-model="form.deductionUnit"
                  size="small"
                >
                  <el-radio
                    v-for="item in deductionUnitOptions"
                    :key="item"
                    :label="item"
                  >{{ item }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </span>

            <span class="base_dialog_condit" v-if="showQuantity">
              <el-form-item label="抵扣数量" prop="deductionValue">
                <span class="base_dialog_condit_text" v-if="pageType === 3">
                  {{ form.deductionValue }}
                </span>
                <el-input
                  v-else
                  v-model="form.deductionValue"
                  :placeholder="quantityPlaceholder"
                  style="width: 90%"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit" v-if="showTopAmount">
              <el-form-item label="封顶优惠金额(元)" prop="deductionTopAmount">
                <span class="base_dialog_condit_text" v-if="pageType === 3">
                  {{ form.deductionTopAmount }}
                </span>
                <el-input
                  v-else
                  v-model="form.deductionTopAmount"
                  :placeholder="topAmountPlaceholder"
                  style="width: 90%"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit" v-if="showSalePrice">
              <el-form-item label="售价(元)" prop="deductionSalePrice">
                <span class="base_dialog_condit_text" v-if="pageType === 3">
                  {{ form.deductionSalePrice }}
                </span>
                <el-input
                  v-else
                  v-model="form.deductionSalePrice"
                  placeholder="请输入大于等于0的数值，最多保留一位小数"
                  style="width: 90%"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="领取后有效期(天)" prop="deductionValidDays">
                <span class="base_dialog_condit_text" v-if="pageType === 3">
                  {{ form.deductionValidDays }}
                </span>
                <el-input
                  v-else
                  v-model.number="form.deductionValidDays"
                  placeholder="请输入1-365的整数，包含1和365"
                  style="width: 90%"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="使用门槛" prop="deductionThreshold">
                <span class="base_dialog_condit_text" v-if="pageType === 3">
                  {{ thresholdText }}
                </span>
                <div v-else class="threshold_row">
                  <el-radio-group
                    v-model="thresholdMode"
                    size="small"
                    @change="onThresholdModeChange"
                  >
                    <el-radio
                      label="none"
                      @mousedown.native="onThresholdNoneMouseDown"
                    >无门槛</el-radio>
                    <el-radio label="full">满</el-radio>
                  </el-radio-group>
                  <el-input
                    ref="thresholdInput"
                    v-model="form.deductionThreshold"
                    :placeholder="thresholdPlaceholder"
                    size="small"
                    style="width: 300px; margin: 0 8px;"
                    :disabled="thresholdMode !== 'full'"
                  />
                  <span v-if="thresholdSuffix" class="threshold_suffix">{{ thresholdSuffix }}</span>
                </div>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="抵扣次数" prop="deductionTimes">
                <span class="base_dialog_condit_text" v-if="pageType === 3">
                  {{ timesText }}
                </span>
                <el-radio-group
                  v-else
                  v-model="radioTimes"
                  size="small"
                  @change="onTimesModeChange"
                >
                  <el-radio label="single">单次</el-radio>
                  <el-radio
                    v-if="form.deductionType === '全免抵扣'"
                    label="repeat"
                  >有效期内重复使用</el-radio>
                </el-radio-group>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="叠加使用" prop="deductionAllowOverlay">
                <span class="base_dialog_condit_text" v-if="pageType === 3">
                  不允许
                </span>
                <el-radio v-else v-model="radioOverlay" label="no">不允许</el-radio>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="备注" prop="memo">
                <el-input
                  v-model="form.memo"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注，最多200字"
                  style="width: 90%"
                  class="filter-item"
                  maxlength="200"
                  show-word-limit
                  size="small"
                  :disabled="pageType === 3"
                />
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType !== 3">
        <el-button type="info" @click="toSave">保存</el-button>
        <el-button type="danger" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  merchantDeductionRuleDetail,
  merchantDeductionRuleInsert,
  merchantDeductionRuleUpdate,
  checkDeductionNameUnique
} from "@/api/merchantManagement";

export default {
  components: {},
  data() {
    const validateDeductionNameUnique = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      const para = {
        merchantDeductionRuleId: this.form.id,
        deductionName: value
      };
      checkDeductionNameUnique(para)
        .then(res => {
          const flag = res && (res.msg !== undefined ? res.msg : res.data || res);
          if (flag === "1" || flag === 1) {
            callback(new Error("抵扣券名称已存在"));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback();
        });
    };

    const validateDeductionNameNotModified = (rule, value, callback) => {
      // 编辑模式下，如果规则已关联商户，不允许修改抵扣券名称
      if (this.pageType === 2 && this.hasLinkedMerchants && this.originalDeductionName && value !== this.originalDeductionName) {
        return callback(new Error("该规则已关联商户，不允许修改抵扣券名称"));
      }
      callback();
    };

    const validateDeductionTypeNotModified = (rule, value, callback) => {
      // 编辑模式下，如果规则已关联商户，不允许修改抵扣类型
      if (this.pageType === 2 && this.hasLinkedMerchants && this.originalDeductionType && value !== this.originalDeductionType) {
        return callback(new Error("该规则已关联商户，不允许修改抵扣类型"));
      }
      callback();
    };

    const validateThreshold = (rule, value, callback) => {
      // 如果当前正在从“满”切换到“无门槛”，本次校验直接跳过，避免闪烁
      if (this.thresholdSwitchingToNone) {
        return callback();
      }
      // 选择“无门槛”时允许不填数值
      if (this.thresholdMode === "none") {
        return callback();
      }
      // 仅在选择“满”时做必填和数值校验
      if (value === null || value === undefined || value === "") {
        // 按当前抵扣类型给出与 placeholder 一致的提示
        if (this.form.deductionType === "固定时长") {
          return callback(new Error("请输入大于0的整数"));
        }
        if (this.form.deductionType === "全免抵扣") {
          return callback(
            new Error("请输入大于0的整数或小数，最多保留1位小数")
          );
        }
        return callback(new Error("请输入大于0的数值，最多保留1位小数"));
      }

      const num = Number(value);
      const type = this.form.deductionType;

      // 必须为大于0的数值
      if (isNaN(num) || num <= 0) {
        if (type === "固定时长") {
          return callback(new Error("请输入大于0的整数"));
        }
        if (type === "全免抵扣") {
          return callback(
            new Error("请输入大于0的整数或小数，最多保留1位小数")
          );
        }
        return callback(new Error("请输入大于0的数值，最多保留1位小数"));
      }

      // 固定时长：必须为整数
      if (type === "固定时长") {
        if (String(value).indexOf(".") !== -1) {
          return callback(new Error("请输入大于0的整数"));
        }
      } else {
        // 其他类型：最多保留1位小数
        if (this.getScale(num) > 1) {
          if (type === "全免抵扣") {
            return callback(
              new Error("请输入大于0的整数或小数，最多保留1位小数")
            );
          }
          return callback(new Error("请输入大于0的数值，最多保留1位小数"));
        }
      }

      callback();
    };

    const validateDeductionQuantity = (rule, value, callback) => {
      // 仅在需要显示抵扣数量时做非空校验
      if (!this.showQuantity) {
        return callback();
      }
      if (value === null || value === undefined || value === "") {
        return callback(new Error("请输入抵扣数量"));
      }
      const type = this.form.deductionType;
      if (type === "固定时长" || type === "固定金额") {
        // 固定时长、固定金额：大于0的整数
        if (value <= 0 || String(value).indexOf(".") !== -1) {
          return callback(new Error("请输入大于0的整数"));
        }
      } else if (type === "固定折扣") {
        // 固定折扣：0-10之间，不含0和10，最多1位小数
        if (
          value <= 0 ||
          value >= 10 ||
          this.getScale(value) > 1
        ) {
          return callback(
            new Error("请输入0-10间的整数或小数，最多保留1位小数，不含0和10")
          );
        }
      }
      callback();
    };

    const validateValidDays = (rule, value, callback) => {
      if (value === null || value === undefined || value === "") {
        return callback(new Error("请输入领取后有效期"));
      }
      const num = Number(value);
      // 必须是 1-365 的整数（包含1和365）
      if (
        isNaN(num) ||
        String(value).indexOf(".") !== -1 ||
        num < 1 ||
        num > 365
      ) {
        return callback(new Error("请输入1-365的整数，包含1和365"));
      }
      callback();
    };

    const validateSalePrice = (rule, value, callback) => {
      if (!this.showSalePrice) {
        return callback();
      }
      if (value === null || value === undefined || value === "") {
        return callback(new Error("请输入售价"));
      }
      const num = Number(value);
      if (isNaN(num) || num < 0 || this.getScale(num) > 1) {
        return callback(
          new Error("请输入大于等于0的数值，最多保留一位小数")
        );
      }
      callback();
    };

    const validateDeductionUnit = (rule, value, callback) => {
      if (!this.showUnit) {
        return callback();
      }
      if (!value) {
        return callback(new Error("请选择抵扣单位"));
      }
      callback();
    };

    const validateTopAmountField = (rule, value, callback) => {
      if (!this.showTopAmount) {
        return callback();
      }
      if (value === null || value === undefined || value === "") {
        return callback(new Error("请输入大于0的整数或小数，最多保留1位小数"));
      }
      const num = Number(value);
      if (isNaN(num) || num <= 0 || this.getScale(num) > 1) {
        return callback(new Error("请输入大于0的整数或小数，最多保留1位小数"));
      }
      callback();
    };

    const validateDeductionTimes = (rule, value, callback) => {
      const type = this.form.deductionType;
      if (type === "全免抵扣") {
        // 全免抵扣时，以 radioTimes 是否有值作为是否已选择抵扣次数的依据
        if (!this.radioTimes) {
          return callback(new Error("请选择抵扣次数"));
        }
        return callback();
      }
      // 其他类型抵扣次数固定为单次，不需要额外选择
      return callback();
    };

    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      form: {
        id: null,
        deductionName: "",
        deductionType: "",
        deductionMode: "",
        deductionUnit: "",
        deductionValue: null,
        deductionSalePrice: null,
        deductionTopAmount: null,
        deductionValidDays: null,
        deductionThreshold: null,
        deductionTimes: 1,
        deductionAllowOverlay: false,
        memo: ""
      },
      // 使用门槛模式：none=无门槛，full=满X可用
      thresholdMode: "none",
      // 标记：是否正在从“满”切换到“无门槛”，用于抑制本次必填校验
      thresholdSwitchingToNone: false,
      // 展示用单选：抵扣次数固定为单次，叠加使用固定为不允许
      radioTimes: "single",
      radioOverlay: "no",
      // 是否已关联商户
      hasLinkedMerchants: false,
      // 原始的抵扣券名称和抵扣类型（用于编辑时验证）
      originalDeductionName: "",
      originalDeductionType: "",
      deductionTypeOptions: [
        { label: "固定时长", value: "固定时长" },
        { label: "固定金额", value: "固定金额" },
        { label: "固定折扣", value: "固定折扣" },
        { label: "全免抵扣", value: "全免抵扣" }
      ],
      rules: {
        deductionName: [
          { required: true, message: "请输入抵扣券名称", trigger: "blur" },
          { validator: validateDeductionNameUnique, trigger: "blur" },
          { validator: validateDeductionNameNotModified, trigger: "blur" }
        ],
        deductionType: [
          { required: true, message: "请选择抵扣类型", trigger: "change" },
          { validator: validateDeductionTypeNotModified, trigger: "change" }
        ],
        deductionValidDays: [
          {
            required: true,
            validator: validateValidDays,
            trigger: "blur"
          }
        ],
        deductionValue: [
          {
            required: true,
            validator: validateDeductionQuantity,
            trigger: "blur"
          }
        ],
        deductionSalePrice: [
          {
            required: true,
            validator: validateSalePrice,
            trigger: "blur"
          }
        ],
        deductionUnit: [
          {
            required: true,
            validator: validateDeductionUnit,
            trigger: "change"
          }
        ],
        deductionTopAmount: [
          {
            required: true,
            validator: validateTopAmountField,
            trigger: "blur"
          }
        ],
        deductionThreshold: [
          {
            required: true,
            validator: validateThreshold,
            trigger: "blur"
          }
        ],
        deductionTimes: [
          { validator: validateDeductionTimes, trigger: "change" }
        ],
        deductionAllowOverlay: [
          { required: true, message: "请选择叠加使用", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    showUnit() {
      return (
        this.form.deductionType === "固定时长" ||
        this.form.deductionType === "固定金额" ||
        this.form.deductionType === "固定折扣"
      );
    },
    deductionUnitOptions() {
      if (this.form.deductionType === "固定时长") {
        return ["分钟", "小时"];
      }
      if (this.form.deductionType === "固定金额") {
        return ["元"];
      }
      if (this.form.deductionType === "固定折扣") {
        return ["折"];
      }
      return [];
    },
    showQuantity() {
      return (
        this.form.deductionType === "固定时长" ||
        this.form.deductionType === "固定金额" ||
        this.form.deductionType === "固定折扣"
      );
    },
    showTopAmount() {
      return this.form.deductionType === "固定折扣";
    },
    showSalePrice() {
      return (
        this.form.deductionType === "固定时长" ||
        this.form.deductionType === "固定金额"
      );
    },
    quantityPrecision() {
      if (this.form.deductionType === "固定折扣") {
        return 1;
      }
      return 0;
    },
    thresholdPrecision() {
      if (this.form.deductionType === "固定时长") {
        return 0;
      }
      return 1;
    },
    thresholdText() {
      if (!this.form.deductionThreshold || this.form.deductionThreshold === 0) {
        return "无门槛";
      }
      return this.form.deductionThreshold;
    },
    timesText() {
      const type = this.form.deductionType;
      const times = this.form.deductionTimes;
      if (type === "全免抵扣") {
        return times == null || times === 0 ? "有效期内重复使用" : "单次";
      }
      return "单次";
    },
    // 使用门槛后缀，根据抵扣类型展示“分钟可用”或“元可用”
    thresholdSuffix() {
      if (this.form.deductionType === "固定时长") {
        return "分钟可用";
      }
      if (
        this.form.deductionType === "固定金额" ||
        this.form.deductionType === "固定折扣" ||
        this.form.deductionType === "全免抵扣"
      ) {
        return "元可用";
      }
      return "";
    },
    quantityPlaceholder() {
      if (this.form.deductionType === "固定折扣") {
        return "请输入0-10间的整数或小数，最多保留1位小数，不含0和10";
      }
      return "请输入大于0的整数";
    },
    topAmountPlaceholder() {
      return "请输入大于0的整数或小数，最多保留1位小数";
    },
    // 使用门槛placeholder
    thresholdPlaceholder() {
      if (this.form.deductionType === "全免抵扣") {
        return "请输入大于0的整数或小数，最多保留1位小数";
      }
      if (this.form.deductionType === "固定时长") {
        return "请输入大于0的整数";
      }
      // 固定金额、固定折扣等：数值型，最多一位小数
      return "请输入大于0的数值，最多保留1位小数";
    }
  },
  methods: {
    onTypeChange() {
      if (this.form.deductionType === "固定时长") {
        this.form.deductionMode = "次数";
        const options = ["分钟", "小时"]; // 固定时长的合法单位
        // 如果当前单位不在合法选项中（如从其他类型切换而来），则设置默认值“分钟”；
        // 如果是编辑场景且后端已返回“分钟”或“小时”，则保留原值不覆盖。
        if (!options.includes(this.form.deductionUnit)) {
          this.form.deductionUnit = "分钟";
        }
      } else if (this.form.deductionType === "固定金额") {
        this.form.deductionMode = "次数";
        const options = ["元"]; // 固定金额的合法单位
        if (!options.includes(this.form.deductionUnit)) {
          this.form.deductionUnit = "元";
        }
      } else if (this.form.deductionType === "固定折扣") {
        this.form.deductionMode = "预充";
        const options = ["折"]; // 固定折扣的合法单位
        if (!options.includes(this.form.deductionUnit)) {
          this.form.deductionUnit = "折";
        }
      } else if (this.form.deductionType === "全免抵扣") {
        this.form.deductionMode = "预充";
        this.form.deductionUnit = null;
      }
      if (!this.showQuantity) {
        this.form.deductionValue = null;
      }
      if (!this.showSalePrice) {
        this.form.deductionSalePrice = null;
      }
      if (!this.showTopAmount) {
        this.form.deductionTopAmount = null;
      }
      // 抵扣次数固定为单次，叠加使用固定为不允许
      this.form.deductionTimes = 1;
      this.form.deductionAllowOverlay = false;
      // 使用门槛模式根据当前值同步
      this.thresholdMode =
        !this.form.deductionThreshold || this.form.deductionThreshold === 0
          ? "none"
          : "full";
    },
    showDialog(id, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      if (this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].resetFields();
      }
      if (pageType === 2 || pageType === 3) {
        this.title = pageType === 2 ? "编辑" : "详情";
        this.getDetails(id);
      } else {
        this.title = "新增";
        this.form = {
          id: null,
          deductionName: "",
          deductionType: "",
          deductionMode: "",
          deductionUnit: "",
          deductionValue: null,
          deductionSalePrice: null,
          deductionTopAmount: null,
          deductionValidDays: null,
          deductionThreshold: null,
          deductionTimes: 1,
          deductionAllowOverlay: false,
          memo: ""
        };
        this.thresholdMode = "none";
        this.radioTimes = "single";
        if (this.$refs["ruleForm"]) {
          this.$nextTick(() => {
            this.$refs["ruleForm"].clearValidate();
          });
        }
      }
    },
    getDetails(id) {
      const para = { merchantDeductionRuleId: id };
      merchantDeductionRuleDetail(para).then(res => {
        const data = res.data || {};
        this.form.id = data.merchantDeductionRuleId;
        this.form.deductionName = data.deductionName;
        this.form.deductionType = data.deductionType;
        // 保存原始值用于验证
        this.originalDeductionName = data.deductionName;
        this.originalDeductionType = data.deductionType;
        // 检查是否已关联商户
        this.hasLinkedMerchants = data.hasLinkedMerchants || false;
        this.form.deductionMode = data.deductionMode;
        this.form.deductionUnit = data.deductionUnit;
        const quantity = data.deductionValue;
        if (
          data.deductionType === "固定折扣" &&
          quantity !== null &&
          quantity !== undefined
        ) {
          const numericQuantity = Number(quantity);
          if (!isNaN(numericQuantity)) {
            this.form.deductionValue = Number(
              (numericQuantity * 10).toFixed(1)
            );
          } else {
            this.form.deductionValue = quantity;
          }
        } else {
          this.form.deductionValue = quantity;
        }
        this.form.deductionSalePrice = data.deductionSalePrice;
        this.form.deductionTopAmount = data.deductionTopAmount;
        this.form.deductionValidDays = data.deductionValidDays;
        this.form.deductionThreshold = data.deductionThreshold;
        // 前端固定为单次、不允许叠加
        this.form.deductionAllowOverlay = false;
        this.form.memo = data.memo;
        this.thresholdMode =
          !this.form.deductionThreshold || this.form.deductionThreshold === 0
            ? "none"
            : "full";
        // 详情/编辑时，如果为无门槛，不在输入框中显示0
        if (this.thresholdMode === "none") {
          this.form.deductionThreshold = null;
        }
        this.onTypeChange();
        const times = data.deductionTimes;
        this.form.deductionTimes = times;
        if (data.deductionType === "全免抵扣") {
          this.radioTimes = times == null || times === 0 ? "repeat" : "single";
        } else {
          this.radioTimes = "single";
        }
      });
    },
    closeDialog() {
      this.isShow = false;
      this.$emit("openLoading", {});
      this.$emit("getList", {});
    },
    toSave() {
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return;
        }
        try {
          this.validateBusinessRules();
        } catch (e) {
          this.$message.warning(e.message || e);
          return;
        }
        const text = this.form.id
          ? "确认提交编辑的抵扣规则吗?"
          : "确认提交保存抵扣规则吗?";
        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          this.isShow = false;
          this.$emit("openLoading", {});
          const quantity = this.form.deductionValue;
          let serverQuantity = quantity;
          if (
            this.form.deductionType === "固定折扣" &&
            quantity !== null &&
            quantity !== undefined &&
            quantity !== ""
          ) {
            const numericQuantity = Number(quantity);
            if (!isNaN(numericQuantity)) {
              serverQuantity = Number(
                (numericQuantity / 10).toFixed(2)
              );
            }
          }
          let deductionTimes = this.form.deductionTimes;
          if (this.form.deductionType === "全免抵扣") {
            deductionTimes = this.radioTimes === "repeat" ? null : 1;
          } else {
            deductionTimes = 1;
          }
          const para = {
            merchantDeductionRuleId: this.form.id,
            deductionName: this.form.deductionName,
            deductionType: this.form.deductionType,
            deductionMode: this.form.deductionMode,
            deductionUnit: this.form.deductionUnit,
            deductionValue: serverQuantity,
            deductionSalePrice: this.form.deductionSalePrice,
            deductionTopAmount: this.form.deductionTopAmount,
            deductionValidDays: this.form.deductionValidDays,
            deductionThreshold: this.form.deductionThreshold,
            deductionTimes: deductionTimes,
            deductionAllowOverlay: this.form.deductionAllowOverlay,
            memo: this.form.memo
          };
          const req = this.form.id
            ? merchantDeductionRuleUpdate(para)
            : merchantDeductionRuleInsert(para);
          req
            .then(response => {
              if (response.code == "200" || response.code === 200) {
                this.$message({
                  type: "success",
                  message: "提交成功"
                });
              }
              setTimeout(() => {
                this.$emit("getList", {});
              }, 300);
            })
            .catch(() => {
              setTimeout(() => {
                this.$emit("getList", {});
              }, 300);
            });
        });
      });
    },
    // 切换使用门槛单选时联动数值
    onThresholdModeChange(val) {
      if (val === "none") {
        // 无门槛时不保留数值，让输入框显示placeholder
        this.form.deductionThreshold = null;
        // 切换为无门槛时，清除该字段的校验状态
        if (this.$refs["ruleForm"]) {
          this.$refs["ruleForm"].clearValidate("deductionThreshold");
        }
      } else if (val === "full") {
        // 切到“满”时，不自动填值，交给用户录入
        // 仅在原来是无门槛的情况下保持为空
        if (
          this.form.deductionThreshold === null ||
          this.form.deductionThreshold === 0
        ) {
          this.form.deductionThreshold = null;
        }
        // 选中“满”后，自动聚焦到输入框
        this.$nextTick(() => {
          if (this.$refs.thresholdInput && this.$refs.thresholdInput.focus) {
            this.$refs.thresholdInput.focus();
          }
        });
      }
    },
    onThresholdNoneMouseDown() {
      // 提前标记：本次交互是从“满”切换到“无门槛”，用于在校验中抑制一闪而过的必填提示
      this.thresholdSwitchingToNone = true;
      // 在下一帧把标记复位，保证只影响这一笔交互
      setTimeout(() => {
        this.thresholdSwitchingToNone = false;
      }, 100);
    },
    validateBusinessRules() {
      const type = this.form.deductionType;
      const quantity = this.form.deductionValue;
      const salePrice = this.form.deductionSalePrice;
      const topAmount = this.form.deductionTopAmount;
      // 根据使用门槛模式同步 threshold 数值
      if (this.thresholdMode === "none") {
        this.form.deductionThreshold = 0;
      }
      const threshold = this.form.deductionThreshold;
      const validDays = this.form.deductionValidDays;
      const times = this.form.deductionTimes;

      if (!validDays || validDays < 1 || validDays > 365) {
        throw new Error("领取后有效期必须在1到365天之间");
      }

      if (type === "固定时长" || type === "固定金额") {
        if (
          quantity == null ||
          quantity <= 0 ||
          String(quantity).indexOf(".") !== -1
        ) {
          throw new Error("固定时长/固定金额的抵扣数量必须为大于0的整数");
        }
        if (!salePrice || salePrice < 0 || this.getScale(salePrice) > 1) {
          throw new Error("售价必须为大于等于0且最多1位小数");
        }
        if (topAmount != null) {
          throw new Error("封顶优惠金额仅在固定折扣时使用");
        }
      } else if (type === "固定折扣") {
        if (
          quantity == null ||
          quantity <= 0 ||
          quantity >= 10 ||
          this.getScale(quantity) > 1
        ) {
          throw new Error(
            "请输入0-10之间的整数或小数，最多保留1位小数，不含0和10"
          );
        }
        if (topAmount == null || topAmount <= 0 || this.getScale(topAmount) > 1) {
          throw new Error("请输入大于0的整数或小数，最多保留1位小数");
        }
        if (salePrice != null) {
          throw new Error("固定折扣类型不需要售价");
        }
      } else if (type === "全免抵扣") {
        if (quantity != null) {
          throw new Error("全免抵扣不需要抵扣数量");
        }
        if (salePrice != null) {
          throw new Error("全免抵扣不需要售价");
        }
        if (topAmount != null) {
          throw new Error("全免抵扣不需要封顶优惠金额");
        }
      }

      if (threshold != null) {
        // 选择“满”时，必须录入大于0的门槛值
        if (this.thresholdMode === "full" && (!threshold || threshold <= 0)) {
          if (type === "全免抵扣") {
            throw new Error("请输入大于0的整数或小数，最多保留1位小数");
          }
          throw new Error("使用门槛必须为大于0的数值");
        }
        if (threshold < 0) {
          throw new Error("使用门槛不能为负数");
        }
        if (threshold > 0) {
          if (type === "固定时长") {
            if (String(threshold).indexOf(".") !== -1) {
              throw new Error("固定时长的使用门槛必须为整数");
            }
          } else {
            if (this.getScale(threshold) > 1) {
              if (type === "全免抵扣") {
                throw new Error("请输入大于0的整数或小数，最多保留1位小数");
              }
              throw new Error("使用门槛最多保留1位小数");
            }
          }
        }
      }

      // 抵扣次数：全免抵扣允许单次或有效期内重复使用，其它类型固定为单次
      if (type === "全免抵扣") {
        if (times != null && times !== 1) {
          // 前端 radio 只会将 null 或 1 传入，这里只是兜底
          throw new Error("全免抵扣的抵扣次数只能为单次或有效期内重复使用");
        }
      } else {
        if (times == null) {
          this.form.deductionTimes = 1;
        } else if (times !== 1) {
          throw new Error("该类型抵扣规则的抵扣次数必须为单次");
        }
      }

      if (this.form.deductionAllowOverlay) {
        throw new Error("当前抵扣规则不支持叠加使用");
      }

      if (this.form.memo && this.form.memo.length > 200) {
        throw new Error("备注不能多于200字");
      }
    },
    onTimesModeChange() {
      // 抵扣次数变化时的处理（如果需要的话）
      // 目前只是用于触发表单验证
      if (this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].validateField("deductionTimes");
      }
    },
    getScale(num) {
      const s = String(num);
      const idx = s.indexOf(".");
      return idx === -1 ? 0 : s.length - idx - 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.a {
  padding-left: 160px;
}
// .base_dialog .base_dialog_main .base_dialog_main_content {
//   height: 650px;
// }
.base_dialog
  .base_dialog_main
  .base_dialog_main_content
  .base_dialog_main_left
  .el-form-item {
  margin-bottom: 18px;
}
.base_dialog
  .base_dialog_main
  .base_dialog_main_content
  .base_dialog_main_left
  .base_dialog_condit:last-child
  .el-form-item {
  margin-bottom: 8px;
}
.base_dialog .base_dialog_main .base_dialog_main_btnBox {
  margin-top: 10px;
}
.base_dialog_main_prompt {
  width: 72%;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-left: 136px;
  background: rgba(255, 217, 134, 0.3);
  color: #f50e0e;
  margin-top: -24px;
  margin-bottom: 10px;
  font-size: 12px;
}
.bdc {
  position: relative;
}
.bdcp {
  position: absolute;
  top: 0;
  left: 300px;
  width: 500px;
}
</style>
