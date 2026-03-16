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
              <el-form-item label="有效期限" prop="expirationStartTime">
                <el-input
                  v-show="false"
                  v-model="newList.expirationStartTime"
                  placeholder="输入"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{
                    newList.expirationStartTime
                      | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                  }}
                  -
                  {{
                    newList.expirationEndTime
                      | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                  }}</span
                >

                <el-date-picker
                  v-else
                  style="width: 72%"
                  size="small"
                  v-model="time"
                  type="datetimerange"
                  :disabled="pageType > 1"
                  range-separator="-"
                  start-placeholder="请选择时间"
                  end-placeholder
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
                <!-- :picker-options="pickerOptions" -->
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="免费通行次数" prop="freeTime">
                <el-radio-group
                  v-model="newList.type"
                  :disabled="pageType > 1"
                  @change="freeTimeTypeChange"
                >
                  <el-radio :label="0">不限</el-radio>
                  <el-radio :label="1">有限</el-radio>
                </el-radio-group>
                <!-- <span
                  class="base_dialog_condit_text"
                  v-if="pageType == 3 && newList.type == 1"
                >
                  {{ newList.freeTime }}</span
                > -->
                <el-input
                  v-if="newList.type == 1"
                  v-model="newList.freeTime"
                  :disabled="pageType > 1"
                  placeholder="输入"
                  @input="handleInput"
                  style="width: 20%;margin-left:10px"
                  class="filter-item"
                  size="small"
                />
                <span
                  v-if="pageType < 3 && newList.type == 1"
                  style="font-size: 12px;"
                >
                  (每个适用车场各有该次数)
                </span>
              </el-form-item>
            </span>

            <span class="base_dialog_condit bdc">
              <el-form-item label="适用车场" prop="parkingLotId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  <div
                    v-for="item in newList.vehicleWaiverParkingLots"
                    :key="item.parkingLotId"
                  >
                    <span>
                      {{ item.parkingLot ? item.parkingLot.name : "" }}
                    </span>
                  </div>
                </span>
                <el-select
                  v-else
                  v-model="newList.parkingLotId"
                  placeholder="选择停车场"
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
              <span
                class="base_dialog_condit bdcp"
                v-if="pageType == 3 && newList.type == 1"
              >
                <el-form-item label="剩余次数" prop="parkingLotId">
                  <span class="base_dialog_condit_text">
                    <div
                      v-for="item in newList.vehicleWaiverParkingLots"
                      :key="item.parkingLotId"
                    >
                      <span v-if="item.parkingLot">
                        {{ item.parkingLot.name }}&nbsp;&nbsp;
                        {{ item.remainderFree }}次
                      </span>
                    </div>
                  </span>
                </el-form-item>
              </span>
            </span>
            <span class="base_dialog_condit" v-if="pageType == 3">
              <el-form-item label="状态" prop="status">
                <span class="offLine_ball" v-show="newList.status == 1"></span>
                <span v-show="newList.status == 1" class="offLine"> 到期</span>
                <span class="onLine_ball" v-show="newList.status == 0"></span>
                <span v-show="newList.status == 0" class="onLine"> 正常</span>
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
  vehicleWaiverCheckPlate, //限免车牌重复校验
  vehicleWaiverDetail, //限免车详情
  vehicleWaiverInsert, //限免车新增
  vehicleWaiverUpdate //限免车修改
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
        vehicleWaiverCheckPlate(para).then(response => {
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
        phone: "", //车主手机
        masterName: "", //车主姓名
        expirationStartTime: "", //开始时间
        expirationEndTime: "", //结束时间
        freeTime: -1, //免费通行次数
        type: 0, //'类型 0-无限次 1-有限次',
        status: 0, //状态 1-已失效 0-未失效
        vehicleWaiverParkingLots: [],
        parkingLots: [] //车场信息
      }, //车位详情
      parkingList: [],
      oldOptions: [], //
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000; // 禁止选择今天之前的日期，86400000 等于 24 * 60 * 60 * 1000，即一天的毫秒数
        },
        minDate: new Date() // 直接设置最大日期为当前日期
      },

      time: [],
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
          {
            pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
            message: "请输入正确车牌号",
            trigger: "blur"
          }
          // {
          //   required: true,
          //   message: "车牌号已存在",
          //   trigger: "blur",
          //   validator: validateEditLicensePlate
          // }
        ],
        expirationStartTime: [
          { required: true, message: "请选择有效期限", trigger: "blur" }
        ],
        phone: [
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确手机号码",
            trigger: "blur"
          }
        ],

        freeTime: [
          { required: true, message: "输入车位状态", trigger: "blur" }
        ],
        parkingLotId: [
          { required: true, message: "请选择停车场", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    time(value) {
      if (value === null) {
        this.time = ["", ""];
      } else if (value.length === 0) {
        this.time = ["", ""];
      }
      this.changeTime();
    }
  },

  created() {
    this.getparking();
  },
  methods: {
    freeTimeTypeChange(e) {
      if (e === 1) {
        this.newList.freeTime = "";
      } else {
        this.newList.freeTime = -1;
      }
    },
    handleInput(value) {
      // 限制输入为大于等于0
      this.newList.freeTime = value.toString().replace(/[^0-9]/g, "");
      if (this.newList.freeTime < 0) {
        this.newList.freeTime = 0; // 如果小于0，设置为0
      } else {
        this.newList.freeTime = this.newList.freeTime * 1;
      }
    },

    changeTime() {
      // let now = new Date().getTime();

      // if (this.time[0] && now > this.time[0].getTime()) {
      //   this.time = [];
      //   this.$message({
      //     type: "warning",
      //     message: "限免车有效期限不得早于当前时间"
      //   });
      // } else
      if (this.time[0].getTime) {
        this.newList.expirationStartTime = this.time[0].getTime();
        this.newList.expirationEndTime = this.time[1].getTime();
      }
    },

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
      console.log(666, val);
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
      const newArr = this.newList.parkingLotId.map(id =>
        this.parkingList.find(item => item.id === id)
      );
      this.newList.vehicleWaiverParkingLots = newArr;
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
          phone: "", //车主手机
          masterName: "", //车主姓名
          expirationStartTime: "", //开始时间
          expirationEndTime: "", //结束时间
          freeTime: -1, //免费通行次数
          type: 0, //'类型 0-无限次 1-有限次',
          status: 0, //状态 1-已失效 0-未失效
          parkingLotId: [],
          vehicleWaiverParkingLots: [],
          parkingLots: [] //车场信息
        };
        this.time = [];
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
      vehicleWaiverDetail(para).then(response => {
        this.newList = response.data;
        // if (response.data.freeTime > 0) {
        //   this.$set(this.newList, "freeTimeType", 1);
        // } else {
        //   this.$set(this.newList, "freeTimeType", 0);
        // }

        let lots = [...this.newList.vehicleWaiverParkingLots];
        lots.forEach(el => {
          el.id = el.parkingLotId;
        });
        if (!lots[0].parkingLot) {
          lots.shift();
        }
        let list = [...this.parkingList];
        list.shift();
        // console.log(111, lots);
        // console.log(112, list);
        // let ids = [];
        // let names = [];
        // lots.forEach(el => {
        //   ids.push(el.parkingLotId);
        //   if (el.parkingLot) {
        //     names.push(el.parkingLot.name);
        //   }
        // });

        // // if (lots.length == this.parkingList.length) {
        // //   ids.unshift(0);
        // // }

        //判断两个数组某字段是否一致
        function compareArraysByField(arr1, arr2, field) {
          if (arr1.length !== arr2.length) {
            return false;
          }
          return arr1.every((obj, index) => obj[field] === arr2[index][field]);
        }
        let ids = [];
        let names = [];
        lots.forEach(el => {
          ids.push(el.id);
          names.push(el.name);
        });
        let isSame = compareArraysByField(list, lots, id);
        // console.log(113, isSame);
        //如果
        if (isSame) {
          ids.unshift(0);
        }

        this.$set(this.newList, "parkingLotId", ids);
        this.newList.parkingLotName = names.toString();
        this.time = [
          this.newList.expirationStartTime,
          this.newList.expirationEndTime
        ];
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
    //添加限免车
    toAdd() {
      this.$refs["vehicleWaiverForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存限免车吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            para.vehicleWaiverParkingLots = para.parkingLotId.map(n => ({
              parkingLotId: n
            }));
            // const newArr = this.newList.parkingLotId.map(id =>
            //   this.parkingList.find(item => item.id === id)
            // );
            // para.vehicleWaiverParkingLots = newArr;

            delete para.parkingLotId;
            delete para.parkingLots;

            vehicleWaiverInsert(para)
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
    //编辑限免车
    toEidt() {
      this.$refs["vehicleWaiverForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的限免车吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            para.vehicleWaiverParkingLots = para.parkingLotId.map(n => ({
              parkingLotId: n
            }));
            // const newArr = this.newList.parkingLotId.map(id =>
            //   this.parkingList.find(item => item.id === id)
            // );
            // para.vehicleWaiverParkingLots = newArr;

            delete para.parkingLotId;
            delete para.parkingLots;

            vehicleWaiverUpdate(para)
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
.base_dialog_main_prompt {
  width: 72%;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-left: 136px;
  background: rgba($color: #ffd986, $alpha: 0.3);
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
