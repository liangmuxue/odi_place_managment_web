<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" :rules="rules" ref="vehicleWaiverForm">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:100px">
            <span class="base_dialog_condit">
              <el-form-item label="车牌号" prop="licensePlate">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.licensePlate }}</span
                >
                <el-input
                  v-else
                  v-model="newList.licensePlate"
                  placeholder="输入车牌号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车牌颜色" prop="plateColor">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.plateColorName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.plateColor"
                  placeholder="选择车牌颜色"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in enumsData.LICENSE_PLATE_COLOR"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车辆类型" prop="vehicleType">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.vehicleTypeName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.vehicleType"
                  placeholder="选择车辆类型"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in enumsData.VEHICLE_TYPE"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="车主手机" prop="phone">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.phone }}</span
                >
                <el-input
                  v-else
                  v-model="newList.phone"
                  placeholder="输入车主手机"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车主姓名" prop="masterName">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.masterName }}</span
                >
                <el-input
                  v-else
                  v-model="newList.masterName"
                  placeholder="输入车主姓名"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="黑名单范围" prop="parkingLotId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.parkingLotName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.parkingLotId"
                  placeholder="选择黑名单范围"
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
            <span class="base_dialog_condit">
              <el-form-item label="黑名单备注" prop="remark">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.remark }}</span
                >
                <el-input
                  v-else
                  v-model="newList.remark"
                  placeholder="请输入"
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
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType !== 3">
        <el-button type="info" @click="toSave">保存</el-button
        ><el-button type="danger" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  vehicleBlacklistCheckPlate, //黑名单牌重复校验
  vehicleBlacklistDetail, //黑名单详情
  vehicleBlacklistInsert, //黑名单新增
  vehicleBlacklistUpdate //黑名单修改
} from "@/api/specificVehicleManagement";
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";

import { fieldTable } from "@/api/common";

export default {
  components: {},
  data() {
    const validateEditLicensePlate = (rule, value, callback) => {
      if (this.editLicensePlate !== value) {
        let para = {
          licensePlate: value
        };
        vehicleBlacklistCheckPlate(para).then(response => {
          if (response.data === 1) {
            callback(new Error("车牌号重复不可用"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };

    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      editLicensePlate: null, //编辑车牌号
      parkingLots: "", //使用中的停车场
      newList: {
        licensePlate: "", //车牌号
        plateColor: null, //车牌颜色
        vehicleType: null, //车辆类型
        phoneNumber: "", //车主手机
        masterName: "", //车主姓名
        remark: "", //备注
        type: 0,
        parkingLotId: [], //黑名单范围
        parkingLots: [] //黑名单范围
      }, //车位详情
      parkingList: [],
      oldOptions: [], //
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
          {
            pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
            message: "请输入正确车牌号",
            trigger: "blur"
          },
          {
            required: true,
            message: "车牌号已存在",
            trigger: "blur",
            validator: validateEditLicensePlate
          }
        ],
        phone: [
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确手机号码",
            trigger: "blur"
          }
        ],
        // plateColor: [
        //   { required: true, message: "请选择车牌颜色", trigger: "change" }
        // ],
        // vehicleType: [
        //   { required: true, message: "请选择车辆类型", trigger: "change" }
        // ],

        parkingLotId: [
          { required: true, message: "请选择停车场", trigger: "change" }
        ]
      },
      Dictionaries: {
        enumTypes: "LICENSE_PLATE_COLOR,VEHICLE_TYPE"
      },
      enumsData: {} //字典表返回数据
    };
  },
  watch: {},

  created() {
    this.getparking();
    this.getFieldTable();
  },
  methods: {
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
        let list = response.data.VEHICLE_TYPE;
        [list[0], list[1]] = [list[1], list[0]];
        this.enumsData.VEHICLE_TYPE = list;
      });
    },

    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
        this.parkingList.unshift({ id: 0, name: "全部" });
      });
    },
    /**
     * 黑名单 全选
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
        this.newList.parkingLotId = allValues;
      }

      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.some(item => {
        return item == 0;
      });

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal && !tem) this.newList.parkingLotId = [];

      if (oldVal && tem) {
        const index = val.indexOf(0);
        val.splice(index, 1); // 排除全选选项
        this.newList.parkingLotId = val;
      }

      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal && !tem) {
        if (val.length === allValues.length - 1)
          this.newList.parkingLotId = [0].concat(val);
      }
      this.oldOptions = this.newList.parkingLotId;
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
    //打开注册、编辑弹窗
    showDialog(id, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      if (this.$refs["vehicleWaiverForm"]) {
        this.$refs["vehicleWaiverForm"].resetFields();
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
          licensePlate: "", //车牌号
          plateColor: 4, //车牌颜色
          vehicleType: 3, //车辆类型
          phoneNumber: "", //车主手机
          masterName: "", //车主姓名
          remark: "", //备注
          type: 0,
          parkingLotId: [], //黑名单范围
          parkingLots: [] //黑名单范围
        };
        this.editLicensePlate = "";
        if (this.$refs["vehicleWaiverForm"]) {
          this.$nextTick(() => {
            this.$refs["vehicleWaiverForm"].clearValidate();
          });
        }
      }
    },
    //获取详情
    getDetials(id) {
      let para = { id: id };
      vehicleBlacklistDetail(para).then(response => {
        this.newList = response.data;

        let lots = this.newList.parkingLots;
        let list = [...this.parkingList];
        list.shift();
        if (this.newList.type == 1) {
          lots = list;
        }
        let ids = [];
        let names = [];
        lots.forEach(el => {
          ids.push(el.id);
          names.push(el.name);
        });
        if (this.newList.type == 1) {
          ids.unshift(0);
        }
        this.$set(this.newList, "parkingLotId", ids);
        this.newList.parkingLotName = names.toString();
        this.editLicensePlate = response.data.licensePlate;
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
    //添加黑名单
    toAdd() {
      this.$refs["vehicleWaiverForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存黑名单吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            if (para.parkingLotId.length == this.parkingList.length) {
              para.type = 1;
              para.parkingLots = null;
            } else {
              para.type = 0;
              para.parkingLots = para.parkingLotId.map(n => ({
                id: n
              }));
            }
            delete para.parkingLotId;
            delete para.parkingLotName;
            vehicleBlacklistInsert(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                  // this.getDetials(response.id);
                } else {
                  // this.$message({
                  //   type: "error",
                  //   message: "提交失败"
                  // });
                }
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              })
              .catch(() => {
                // this.$message({
                //   type: "error",
                //   message: "提交失败"
                // });
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              });
          });
        }
      });
    },
    //编辑黑名单
    toEidt() {
      this.$refs["vehicleWaiverForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的黑名单吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            if (para.parkingLotId.length > this.parkingList.length) {
              para.type = 1;
              para.parkingLots = null;
              para.parkingLotId = null;
            } else {
              para.type = 0;
              para.parkingLots = para.parkingLotId.map(n => ({
                id: n
              }));
            }
            delete para.parkingLotId;
            delete para.parkingLotName;

            vehicleBlacklistUpdate(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                } else {
                  // this.$message({
                  //   type: "error",
                  //   message: "提交失败"
                  // });
                }
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              })
              .catch(() => {
                // this.$message({
                //   type: "error",
                //   message: "提交失败"
                // });
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
</style>
