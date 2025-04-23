<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <div class="base_dialog_main_top" v-show="pageType < 3">
        <div :class="step == 1 ? 'step2' : 'step'" @click="toStep(1)">
          > 基础信息
        </div>
        <div :class="step == 2 ? 'step2' : 'step'" @click="toStep(2)">
          > 临停规则
        </div>
        <div :class="step == 3 ? 'step2' : 'step'" @click="toStep(3)">
          > 长租规则
        </div>
      </div>
      <el-form
        :model="newList"
        :rules="rules"
        ref="parkingForm"
        v-show="step == 1"
      >
        <div
          class="base_dialog_main_content"
          :style="pageType == 3 ? 'height: calc(100vh - 240px);' : ''"
        >
          <div class="base_dialog_main_left">
            <span class="base_dialog_condit">
              <el-form-item label="停车场名称" prop="name">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.name }}</span
                >
                <el-input
                  v-else
                  v-model="newList.name"
                  placeholder="输入停车场名称"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="停车场介绍" prop="introduce">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.introduce }}
                </span>

                <el-input
                  v-model="newList.introduce"
                  v-else
                  placeholder="请输入停车场介绍"
                  type="textarea"
                  :rows="2"
                  style="width: 72%"
                  class="filter-item"
                  maxlength="200"
                  show-word-limit
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="营业时间" prop="startTime">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.startTime }} - {{ newList.endTime }}
                </span>

                <el-time-picker
                  v-else
                  is-range
                  v-model="timeList"
                  value-format="HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  style="width: 72%"
                  size="small"
                >
                </el-time-picker>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="收费规则描述" prop="rule">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.rule }}
                </span>
                <el-input
                  v-else
                  v-model="newList.rule"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入收费规则描述"
                  style="width: 72%"
                  class="filter-item"
                  maxlength="200"
                  show-word-limit
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="总车位数" prop="number">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.number }}
                </span>

                <el-input
                  v-else
                  v-model="newList.number"
                  @input="numberInput"
                  placeholder="输入总车位数"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="联系电话" prop="phone">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.phone }}
                </span>

                <el-input
                  v-else
                  v-model="newList.phone"
                  placeholder="输入联系电话"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="运营商网络" prop="operator">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.operator }}
                </span>

                <el-select
                  v-else
                  v-model="newList.operator"
                  placeholder="选择运营商网络"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in operators"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <!-- <span class="base_dialog_condit">
              <el-form-item label="是否支持优惠券" prop="coupon">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.coupon == 1 ? "支持" : "不支持" }}
                </span>

                <el-select
                  v-else
                  v-model="newList.coupon"
                  placeholder="选择是否支持优惠券"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in couponTypes"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span> -->
            <span class="base_dialog_condit">
              <el-form-item label="是否支持充电" prop="charge">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.charge == 1 ? "支持" : "不支持" }}
                </span>

                <el-select
                  v-else
                  v-model="newList.charge"
                  placeholder="选择是否支持优惠券"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in couponTypes"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>

            <div
              class="wenzi"
              style="font-size: 12px;padding-left: 136px;color:#ccc;height:20px;ling-height:20px"
            >
              *最多支持上传4张，上格式jpg/jpeg/png/bmp
            </div>

            <span class="base_dialog_condit">
              <el-form-item label="停车场图片" prop="photos">
                <el-input
                  v-show="false"
                  v-model="newList.photos"
                  placeholder="图片"
                  class="filter-item"
                  size="mini"
                />
                <div class="uploaddiv">
                  <div
                    class="photos_div"
                    v-for="(item, index) in photos"
                    :key="index"
                  >
                    <div
                      class="photos_close"
                      @click="delPic(index)"
                      v-if="pageType < 3"
                    >
                      <i class="el-icon-close"></i>
                    </div>
                    <ImgPortrait3
                      v-if="item"
                      :PicSrc="item"
                      type="3"
                      class="photos_p"
                    ></ImgPortrait3>
                  </div>
                  <el-upload
                    class="avatar-uploader photos_div"
                    action="String"
                    accept="image/jpeg, image/jpg, image/png, image/bmp"
                    :http-request="uploadPic"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    v-if="photos.length < 4 && pageType < 3"
                    element-loading-text="图像校验中"
                  >
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="pageType == 3">
              <el-form-item label="临停规则" prop="feeRules">
                <span class="base_dialog_condit_text">
                  {{ feeRuleNames }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="pageType == 3">
              <el-form-item label="长租规则" prop="feeRules">
                <span class="base_dialog_condit_text">
                  {{
                    newList.ruleParkingLeases.length > 0
                      ? newList.ruleParkingLeases[0].ruleName
                      : ""
                  }}
                </span>
              </el-form-item>
            </span>
          </div>
          <div class="base_dialog_main_right">
            <div
              class="base_dialog_main_right_wenzi"
              style="font-size: 12px;padding-left: 148px;color:#ccc;height:20px;ling-height:20px"
            >
              达到此车位占用率后，仅限长租车可进入，临停车禁止进入
            </div>

            <span class="base_dialog_condit">
              <el-form-item label="长租车位保障临界值" prop="criticalValue">
                <span v-if="pageType == 3"> {{ newList.criticalValue }}</span>
                <el-input
                  v-else
                  v-model.number="newList.criticalValue"
                  @input="handleInput2"
                  placeholder="请输入0-100的数值，最多保留一位小数"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />%
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item
                label="临停收入分成比例"
                prop="temporaryStopSharing"
              >
                <span>建设发展公司</span>
                <span v-if="pageType == 3">
                  {{ newList.temporaryStopSharing || " -- " }}</span
                >
                <el-input
                  v-else
                  v-model.number="newList.temporaryStopSharing"
                  placeholder="输入0-100的数值，最多保留一位小数"
                  style="width: 100px"
                  class="filter-item"
                  size="small"
                />%
                <span>海创物业公司</span>
                <span v-if="pageType == 3">
                  {{ newList.temporaryStopSharingTwo || " -- " }}</span
                >
                <el-input
                  v-else
                  v-model.number="newList.temporaryStopSharingTwo"
                  placeholder="输入0-100的数值，最多保留一位小数"
                  style="width: 100px"
                  class="filter-item"
                  size="small"
                />%
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item
                label="长租收入分成比例"
                prop="longTermRentalSharing"
              >
                <span>建设发展公司</span>
                <span v-if="pageType == 3">
                  {{ newList.longTermRentalSharing || " -- " }}</span
                >
                <el-input
                  v-else
                  v-model.number="newList.longTermRentalSharing"
                  placeholder="输入0-100的数值，最多保留一位小数"
                  style="width: 100px"
                  class="filter-item"
                  size="small"
                />%
                <span>海创物业公司</span>
                <span v-if="pageType == 3">
                  {{ newList.longTermRentalSharingTwo || " -- " }}</span
                >
                <el-input
                  v-else
                  v-model.number="newList.longTermRentalSharingTwo"
                  placeholder="输入0-100的数值，最多保留一位小数"
                  style="width: 100px"
                  class="filter-item"
                  size="small"
                />%
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="放行规则" prop="accessType">
                <el-radio-group
                  v-model="newList.accessType"
                  :disabled="pageType == 2 || pageType == 3"
                >
                  <el-radio :label="0">不限</el-radio>
                  <el-radio :label="1"
                    >仅限白名单、限免车、长租车可进入</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <div
                v-if="pageType < 3"
                class="base_dialog_main_prompt
"
              >
                首次配置后不可修改，如需修改，需由技术人员配合调试相关硬件参数
              </div>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="停车场区域地址" prop="addressId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.address }}
                </span>

                <Cascader
                  v-else
                  ref="treedata"
                  v-model="newList.addressId"
                  style="display: inline-block;width: 72%"
                  @selectAddress="selectAddress"
                ></Cascader>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="地图坐标" prop="coordinate">
                <el-input
                  v-show="false"
                  v-model="newList.coordinate"
                  placeholder="经度"
                  class="filter-item"
                  size="mini"
                />
              </el-form-item>
            </span>
            <div class="map_box">
              <BaiduMap
                v-if="isShow"
                @getLocation="getLocation"
                :pageType="pageType"
                ref="BDMap"
              ></BaiduMap>
            </div>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_content" v-show="step == 2">
        <el-transfer
          style="text-align: left; display: inline-block;"
          v-model="feeRules"
          filterable
          :props="{
            key: 'id',
            label: 'ruleName'
          }"
          :titles="['待选择', '已选择']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @left-check-change="leftRules"
          @change="getRules"
          :data="ruleList"
        >
        </el-transfer>
      </div>
      <div class="base_dialog_main_content" v-show="step == 3">
        <el-transfer
          style="text-align: left; display: inline-block;"
          v-model="newList.ruleParkingLeasesIds"
          filterable
          :props="{
            key: 'id',
            label: 'ruleName'
          }"
          @left-check-change="leftRulesLong"
          :titles="['待选择', '已选择']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @change="getRulesLong"
          :data="ruleListLong"
        >
        </el-transfer>
      </div>
      <div class="base_dialog_main_btnBox" style="" v-show="pageType < 3">
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
  checkName,
  parkingInfo,
  parkingAdd,
  parkingUpadte,
  ruleParkingLeasesListNoPage,
  ruleTemporaryParkingList
} from "@/api/yardManagement";

import Cascader from "@/components/Cascader/cascader_regionIdAndNames.vue";
import BaiduMap from "@/components/Map/map.vue";
import { UploadImage } from "@/api/common";

export default {
  components: { Cascader, BaiduMap },
  data() {
    const validateId = (rule, value, callback) => {
      if (this.editName !== value) {
        let para = {
          name: value
        };
        checkName(para).then(response => {
          if (response.msg === "车场名称重复不可用") {
            callback(new Error("车场名称重复不可用"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    const validateTemporaryStop = (rule, value, callback) => {
      const inputValue = this.newList.temporaryStopSharing;
      const inputValue2 = this.newList.temporaryStopSharingTwo;
      if (inputValue + inputValue2 > 100) {
        callback(new Error("临停收入分成比例总和不得超过100%"));
      }
      // 使用正则表达式限制输入为0-100之间的数字，最多一位小数
      const regex = /^(([1-9]?\d{0,1}(\.\d{1,2})?)|100|100\.(0){1,2})$/; // 匹配数字和最多一位小数的数字
      if (!inputValue) {
        if (!inputValue2) {
          callback();
        } else if (!regex.test(inputValue2)) {
          callback(new Error("输入0-100的数值，最多保留一位小数"));
        } else {
          callback();
        }
      } else if (!regex.test(inputValue)) {
        // 如果不符合正则，则报错
        callback(new Error("输入0-100的数值，最多保留一位小数"));
      } else {
        if (!inputValue2) {
          callback();
        } else if (!regex.test(inputValue2)) {
          callback(new Error("输入0-100的数值，最多保留一位小数"));
        } else {
          callback();
        }
      }
    };
    const validateLongTermRental = (rule, value, callback) => {
      const inputValue = this.newList.longTermRentalSharing;
      const inputValue2 = this.newList.longTermRentalSharingTwo;
      if (inputValue + inputValue2 > 100) {
        callback(new Error("长租收入分成比例总和不得超过100%"));
      }

      // 使用正则表达式限制输入为0-100之间的数字，最多一位小数
      const regex = /^(([1-9]?\d{0,1}(\.\d{1,2})?)|100|100\.(0){1,2})$/; // 匹配数字和最多一位小数的数字
      if (!inputValue) {
        if (!inputValue2) {
          callback();
        } else if (!regex.test(inputValue2)) {
          callback(new Error("输入0-100的数值，最多保留一位小数"));
        } else {
          callback();
        }
      } else if (!regex.test(inputValue)) {
        // 如果不符合正则，则报错
        callback(new Error("输入0-100的数值，最多保留一位小数"));
      } else {
        if (!inputValue2) {
          callback();
        } else if (!regex.test(inputValue2)) {
          callback(new Error("输入0-100的数值，最多保留一位小数"));
        } else {
          callback();
        }
      }
    };

    return {
      step: 1,
      pageType: 1,
      title: "新增",
      isShow: false,
      editName: null,
      newList: {
        id: null,
        name: "", //停车场名称
        introduce: "", //停车场介绍
        startTime: "00:00:00", //开始时间
        endTime: "23:59:59", //结束时间
        rule: "", //收费规则描述
        number: null, //总车位数
        phone: null, //联系电话
        operator: null, //运营商网络
        charge: null, //是否支持充电
        coupon: null, //是否支持优惠券
        accessType: 0, //是否仅限白名单及限免车
        photos: "", //停车场图片
        criticalValue: 90, //长租车位保障临界值
        ruleParkingLeases: [],
        temporaryStopSharing: null, //临停分成建设发展公司
        temporaryStopSharingTwo: null, //临停分成海创物业公司
        longTermRentalSharing: null, //长租分成建设发展公司
        longTermRentalSharingTwo: null, //长租分成海创物业公司
        address: "", //停车场区域地址
        addressId: "", //停车场区域地址id
        coordinate: "", //地图坐标
        feeRules: null, //临停收费规则
        ruleParkingLeasesIds: [] //长租收费规则
      }, //车场详情
      timeList: ["00:00:00", "23:59:59"], //营业时间
      photos: [], //图片列表
      feeRules: [], //收费规则id

      feeRuleNames: "", //收费规则名称
      ruleList: [],
      ruleListLong: [],
      operators: [
        { enumName: "移动", enumValue: "移动" },
        { enumName: "联通", enumValue: "联通" },
        { enumName: "电信", enumValue: "电信" }
      ],
      couponTypes: [
        { enumName: "支持", enumValue: 1 },
        { enumName: "不支持", enumValue: 0 }
      ],

      rules: {
        name: [
          { required: true, message: "请输入停车场名称", trigger: "blur" },
          {
            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_\-]{1,20}$/,
            message: "请输入20以内字符，且不含特殊字符",
            trigger: "blur"
          },
          {
            required: true,
            message: "停车场名称已存在",
            trigger: "blur",
            validator: validateId
          }
        ],
        introduce: [
          { required: true, message: "请输入停车场介绍", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择营业时间", trigger: "blur" }
        ],
        rule: [
          { required: true, message: "请输入收费规则描述", trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入总车位数", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
          // {
          //   pattern: /^1\d{10}$/,
          //   message: "请输入正确手机号码",
          //   trigger: "blur"
          // }
        ],
        operator: [
          { required: false, message: "请选择运营商网络", trigger: "blur" }
        ],
        coupon: [
          { required: true, message: "请输入是否支持优惠券", trigger: "blur" }
        ],
        photos: [
          { required: true, message: "请上传停车场图片", trigger: "blur" }
        ],
        addressId: [
          { required: true, message: "请选择停车场区域地址", trigger: "blur" }
        ],
        charge: [
          { required: true, message: "请选择是否支持充电", trigger: "blur" }
        ],
        accessType: [
          { required: true, message: "请选择放行规则", trigger: "blur" }
        ],
        criticalValue: [
          {
            required: true,
            message: "请输入长租车位保障临界值",
            trigger: "blur"
          }
        ],
        temporaryStopSharing: [
          {
            required: false,
            message: "",
            trigger: "blur",
            validator: validateTemporaryStop
          }
        ],
        longTermRentalSharing: [
          {
            required: false,
            message: "",
            trigger: "blur",
            validator: validateLongTermRental
          }
        ],

        coordinate: [
          { required: true, message: "请选择地图坐标", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getRulesList();
  },
  methods: {
    getRulesList() {
      //长租规则列表
      ruleParkingLeasesListNoPage().then(response => {
        this.ruleListLong = response.data;
      });
      let para = {};
      //临停规则列表
      ruleTemporaryParkingList(para).then(response => {
        this.ruleList = response.data;
      });
    },

    handleInput2(value) {
      // 限制输入为0到100之间的一位小数
      this.newList.criticalValue = value
        .toString()
        .replace(/[^\d.]/g, "")
        .replace(/\.{2,}/g, ".")
        .replace(/^\./g, "")
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".")
        .replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3");
      if (this.newList.criticalValue > 100) {
        this.newList.criticalValue = 100; // 如果超过100，设置为100
      } else if (this.newList.criticalValue < 0) {
        this.newList.criticalValue = 0; // 如果小于0，设置为0
      }
    },

    toStep(step) {
      if (this.newList.id) {
        this.step = step;
      }
    },
    //选择区域地址
    selectAddress(id, names) {
      this.newList.address = names;
      this.newList.addressId = id;
    },
    numberInput(val) {
      if (isNaN(val) || val <= 0) {
        this.newList.number = "";
      } else {
        this.newList.number = Number(val);
      }
    },
    //停车场图片验证
    beforeAvatarUpload(file) {
      const isLt100M = file.size / 1024 < 10000;
      if (!isLt100M) {
        this.$message.error("上传图片大小不能超过10M!");
      }
      return isLt100M;
    },

    //上传停车场图片
    uploadPic(item) {
      let formData = new FormData();
      formData.append("file", item.file);

      UploadImage(formData).then(response => {
        this.photos.push(response.url);
        this.newList.photos = this.photos.toString();
        this.$refs.parkingForm.validateField("photos");
      });
    },

    //删除照片
    delPic(index) {
      this.photos.splice(index, 1);
      this.$refs.parkingForm.validateField("photos");
    },

    //地图获取地址信息
    getLocation(data) {
      let arr = [data.coordinate.longitude, data.coordinate.latitude];
      this.newList.coordinate = arr.toString();
    },
    leftRules(data) {
      if (data.length > 1) {
        data.splice(0, 1);
      }
    },

    //临停规则选择
    getRules(data) {
      if (data.length > 1) {
        data.splice(0, 1);
      }
      this.newList.feeRules = data.toString();
    },
    leftRulesLong(data) {
      if (data.length > 1) {
        data.splice(0, 1);
      }
    },

    //长租规则选择
    getRulesLong(data) {
      if (data.length > 1) {
        data.splice(0, 1);
      }
    },
    //打开注册、编辑弹窗
    showDialog(id, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      this.step = 1;
      if (this.$refs["parkingForm"]) {
        this.$refs["parkingForm"].resetFields();
      }
      this.$nextTick(() => {
        this.$refs["BDMap"].clearOverlays();
      });

      if (pageType == 2) {
        this.title = "编辑";
        this.getDetials(id);
      } else if (pageType == 3) {
        this.title = "详情";
        this.getDetials(id);
      } else {
        this.title = "新增";
        this.timeList = ["00:00:00", "23:59:59"]; //营业时间
        this.photos = [];
        this.feeRules = [];
        // this.ruleList = [];
        // this.ruleListLong = [];

        this.newList = {
          id: null,
          name: "", //停车场名称
          introduce: "", //停车场介绍
          startTime: "00:00:00", //开始时间
          endTime: "23:59:59", //结束时间
          rule: "", //收费规则描述
          number: null, //总车位数
          phone: null, //联系电话
          operator: null, //运营商网络
          charge: null, //是否支持充电
          coupon: null, //是否支持优惠券
          photos: "", //停车场图片
          accessType: 0, //放行规则
          criticalValue: 90, //长租车位保障临界值
          ruleParkingLeases: [],
          temporaryStopSharing: null, //临停分成建设发展公司
          temporaryStopSharingTwo: null, //临停分成海创物业公司
          longTermRentalSharing: null, //长租分成建设发展公司
          longTermRentalSharingTwo: null, //长租分成海创物业公司
          address: "", //停车场区域地址
          addressId: "", //停车场区域地址id
          coordinate: "", //地图坐标
          feeRules: null, //临停收费规则
          ruleParkingLeasesIds: [] //长租收费规则
        };
        this.editName = null;

        if (this.$refs["parkingForm"]) {
          this.$nextTick(() => {
            this.$refs["parkingForm"].clearValidate();
          });
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs["BDMap"].openDraw();
          }, 300);
        });
      }
    },
    //获取详情
    getDetials(id, isAdd) {
      let para = { id: id };
      parkingInfo(para).then(response => {
        this.newList = response.data;
        if (isAdd) {
          this.toStep(2);
        }
        if (!this.newList.ruleParkingLeasesIds) {
          this.newList.ruleParkingLeasesIds = [];
        }
        if (
          this.newList.ruleParkingLeases &&
          this.newList.ruleParkingLeases.length > 0
        ) {
          this.newList.ruleParkingLeasesIds = [
            this.newList.ruleParkingLeases[0].id
          ];
        } else {
          this.newList.ruleParkingLeasesIds = [];
        }
        this.newList.addressId = this.newList.addressId * 1;
        if (this.pageType == 2) {
          this.$refs.treedata.selectRegion(this.newList.addressId);
        }
        this.editName = this.newList.name;
        if (response.data.photos) {
          this.photos = response.data.photos.split(",");
        } else {
          this.photos = [];
        }
        this.timeList = [response.data.startTime, response.data.endTime];
        if (response.data.feeRules) {
          this.feeRules = this.getFeeRuleNames(
            response.data.feeRules.split(",")
          );
          this.feeRules = response.data.feeRules.split(",").map(Number);
        } else {
          this.feeRules = [];
        }
        let coordinate = response.data.coordinate.split(",");
        this.$nextTick(() => {
          this.$refs["BDMap"].selectToLocation(coordinate[0], coordinate[1]);
          if (this.pageType == 2) {
            setTimeout(() => {
              this.$refs["BDMap"].openDraw();
            }, 300);
          }
        });
      });
    },
    //获取收费规则名称
    getFeeRuleNames(feeRules) {
      let arr = [];
      // if (feeRules.length == 1 && feeRules[0] === "全") {
      //   this.ruleList.forEach(el => {
      //     arr.push(el.name);
      //   });
      // } else {
      feeRules.map(item1 => {
        let item = this.ruleList.find(item2 => item2.id == item1);
        if (item) {
          arr.push(item.ruleName);
        }
      });
      // }

      this.feeRuleNames = arr.toString();
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
    //添加车场
    toAdd() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存停车场信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            let para = this.newList;
            parkingAdd(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                  this.getDetials(response.data.id, true);
                } else {
                  this.$message({
                    type: "warning",
                    message: "提交失败"
                  });
                }
              })
              .catch(() => {
                this.$message({
                  type: "warning",
                  message: "提交失败"
                });
              });
          });
        }
      });
    },
    //编辑车场
    toEidt() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的停车场信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            if (this.step == 2 || this.step == 3) {
              this.isShow = false;
              this.$emit("openLoading", {});
            }
            let para = this.newList;
            parkingUpadte(para)
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
                if (this.step == 3 || this.step == 2) {
                  setTimeout(() => {
                    this.$emit("getList", {});
                  }, 300);
                } else if (this.step == 1) {
                  this.step = 2;
                }
              })
              .catch(() => {
                this.$message({
                  type: "warning",
                  message: "提交失败"
                });

                if (this.step == 2) {
                  setTimeout(() => {
                    this.$emit("getList", {});
                  }, 300);
                }
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
.map_box {
  margin-left: 20px;
  height: 270px;
}
.base_dialog_condit {
  .photos_div {
    float: left;
    margin-right: 10px;
    width: 110px;
    height: 110px;
    border: 1px solid #999;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    .photos_close {
      position: absolute;
      right: 3px;
      top: 3px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      padding-top: 1px;
      background: rgba($color: #000, $alpha: 0.7);
      font-size: 16px;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
    .photos_p {
      width: 110px;
      height: 110px;
    }
  }
  .wenzi {
    position: absolute;
    top: 155px;
    width: 112px;
    height: 12px;
    font-size: 12px;
    text-align: center;
    line-height: 12px;
    color: #fff;
  }
  .uploaddiv >>> .avatar-uploader .el-upload {
    width: 110px;
    height: 110px;
    line-height: 110px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .uploaddiv >>> .avatar-uploader {
    height: 110px;
  }
  .uploaddiv >>> .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .uploaddiv >>> .avatar-uploader-icon {
    font-size: 24px;
    font-weight: bold;
    color: #999;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
  }
  .uploaddiv >>> .avatar-uploader .avatar {
    width: 110px;
    height: 110px;
  }
}
.base_dialog_main_right {
  position: relative;
  .base_dialog_main_right_wenzi {
    position: absolute;
    top: 10px;
  }
}
.base_dialog_main_prompt {
  width: 72%;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-left: 148px;
  background: rgba($color: #ffd986, $alpha: 0.3);
  color: #f50e0e;
  margin-top: -24px;
  margin-bottom: 10px;
  font-size: 12px;
}
</style>

<style>
.el-transfer-panel__list {
  height: 500px !important;
}
</style>
