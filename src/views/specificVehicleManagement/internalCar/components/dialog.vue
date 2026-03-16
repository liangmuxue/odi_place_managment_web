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
              <el-form-item label="车牌颜色" prop="licenseColor">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.licenseColorName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.licenseColor"
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
              <el-form-item label="车主手机" prop="phoneNumber">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.phoneNumber }}</span
                >
                <el-input
                  v-else
                  v-model="newList.phoneNumber"
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
              <el-form-item label="适用车场" prop="parkingLotId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.parkingLotName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.parkingLotId"
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
            <span class="base_dialog_condit">
              <el-form-item label="备注" prop="remark">
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
  internalCarCheck, //内部临停车牌重复校验
  internalCarDetails, //内部临停车详情
  internalCarAdd, //内部临停车新增
  internalCarEdit //内部临停车修改
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
        internalCarCheck(para).then(response => {
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
        licenseColor: null, //车牌颜色
        vehicleType: null, //车辆类型
        phoneNumber: "", //车主手机
        masterName: "", //车主姓名
        remark: "", //备注
        parkingLotId: [], //适用车场
        parkingLots: [] //适用车场
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
        phoneNumber: [
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确手机号码",
            trigger: "blur"
          }
        ],
        // licenseColor: [
        //   { required: true, message: "请选择车牌颜色", trigger: "blur" }
        // ],
        // vehicleType: [
        //   { required: true, message: "请选择车辆类型", trigger: "blur" }
        // ],

        parkingLotId: [
          { required: true, message: "请选择停车场", trigger: "blur" }
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
     * 适用车场 全选
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
          licenseColor: 4, //车牌颜色
          vehicleType: 3, //车辆类型
          phoneNumber: "", //车主手机
          masterName: "", //车主姓名
          remark: "", //备注
          parkingLotId: [], //适用车场
          parkingLots: [] //适用车场
        };
        this.editLicensePlate = null;

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
      internalCarDetails(para).then(response => {
        this.newList = response.data;

        let lots = this.newList.parkingLots;
        let list = [...this.parkingList];
        let newLots = [];
        lots.map(item => {
          // 在arr1中查找与arr2当前项id相匹配的项
          const found = list.find(obj => obj.id === item.id);
          if (found) {
            newLots.push(found);
          }
        });
        list.shift();

        //判断两个数组某字段是否一致
        function compareArraysByField(arr1, arr2, field) {
          if (arr1.length !== arr2.length) {
            return false;
          }
          return arr1.every((obj, index) => obj[field] === arr2[index][field]);
        }
        let ids = [];
        let names = [];
        newLots.forEach(el => {
          ids.push(el.id);
          names.push(el.name);
        });
        let isSame = compareArraysByField(list, newLots, id);
        console.log(113, isSame);
        //如果
        if (isSame) {
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
    //添加内部临停车
    toAdd() {
      this.$refs["vehicleWaiverForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存内部临停车吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            para.parkingLotIds = para.parkingLotId.map(n => n);
            delete para.parkingLotId;
            delete para.parkingLotName;
            internalCarAdd(para)
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
    //编辑内部临停车
    toEidt() {
      this.$refs["vehicleWaiverForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的内部临停车吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            para.parkingLotIds = para.parkingLotId.map(n => n);

            delete para.parkingLotId;
            delete para.parkingLotName;

            internalCarEdit(para)
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
