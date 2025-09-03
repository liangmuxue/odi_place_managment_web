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
          <div class="base_dialog_main_left" style="padding: 20px 100px">
            <!-- <div
              v-if="pageType == 1"
              class="base_dialog_main_prompt
"
            >
              新增设备，需由技术人员配合，调试相关硬件参数！
            </div> -->
            <span class="base_dialog_condit">
              <el-form-item label="停车场" prop="parkId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.parkName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.parkId"
                  placeholder="选择停车场"
                  clearable
                  @change="parkChange"
                  class="filter-item"
                  style="width: 72%"
                  size="small"
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
              <el-form-item label="设备名称" prop="deviceName">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.deviceName }}</span
                >
                <el-input
                  v-else
                  v-model="newList.deviceName"
                  placeholder="输入设备名称"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="设备厂家" prop="deviceBrand">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ getDeviceBrandName(newList.deviceBrand) }}</span
                >
                <el-select
                  v-else
                  v-model="newList.deviceBrand"
                  placeholder="选择设备厂家"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in equipmentManufacturerList"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="IP地址" prop="ip">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.ip }}</span
                >
                <el-input
                  v-else
                  v-model="newList.ip"
                  placeholder="输入IP地址"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="用户名" prop="loginName">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.loginName }}</span
                >
                <el-input
                  v-else
                  v-model="newList.loginName"
                  placeholder="输入用户名"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="网关ID" prop="gatewayId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ getGatewae(newList.gatewayId) }}</span
                >
                <el-select
                  v-else
                  v-model="newList.gatewayId"
                  placeholder="选择网关ID"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in gatewayList"
                    :key="item.id"
                    :label="item.ip"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="主码流地址" prop="mainStream">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.mainStream }}</span
                >
                <el-input
                  v-else
                  v-model="newList.mainStream"
                  placeholder="输入主码流地址"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="设备坐标" prop="coordinate">
                <el-input
                  v-show="false"
                  v-model="newList.coordinate"
                  placeholder="输入"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
                <div v-if="!curMap" class="base_dialog_condit_noMap">
                  <img
                    src="../../../../assets/images/homePage/noMap.png"
                    alt=""
                    class="base_dialog_condit_noMap-img"
                  />
                  <div class="base_dialog_condit_noMap-text">
                    暂无地图
                  </div>
                </div>

                <openlayersMapEquipment
                  v-else
                  ref="openlayersMapEquipment"
                  class="base_dialog_condit_noMap"
                  :curMap="curMap"
                  :baseWidth="baseWidth"
                  :baseHeight="baseHeight"
                  :coordinates="coordinates"
                  :pageType="pageType"
                  @addPoint="addPoint"
                  :key="newList.parkId + curMap"
                />
              </el-form-item>
            </span>
          </div>
          <div class="base_dialog_main_right" style="padding:60px 100px">
            <span class="base_dialog_condit">
              <el-form-item label="是否道闸像机" prop="isGate">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.isGate == 1 ? "是" : "否" }}</span
                >
                <el-select
                  v-else
                  v-model="newList.isGate"
                  placeholder="选择是否设备像机"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in gateList"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="设备编号" prop="deviceId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.deviceId }}</span
                >
                <el-input
                  v-else
                  v-model="newList.deviceId"
                  placeholder="输入设备编号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="设备类型" prop="deviceType">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ getType(newList.deviceType) }}</span
                >
                <el-select
                  v-else
                  v-model="newList.deviceType"
                  placeholder="选择设备类型"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="端口号" prop="port">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.port }}</span
                >
                <el-input
                  v-else
                  v-model="newList.port"
                  placeholder="输入端口号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="密码" prop="password">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.password }}</span
                >
                <el-input
                  v-else
                  v-model="newList.password"
                  placeholder="输入密码"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="协议类型" prop="protocols">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ getprotocolName(newList.protocols) }}</span
                >
                <el-select
                  v-else
                  v-model="newList.protocols"
                  placeholder="选择协议类型"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in protocolTypes"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="子码流地址" prop="subStream">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.subStream }}</span
                >
                <el-input
                  v-else
                  v-model="newList.subStream"
                  placeholder="输入子码流地址"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType < 3">
        <el-button type="info" @click="toSave">保存</el-button
        ><el-button type="danger" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";
import {
  SsBaseDeviceGetInfo, //获取单个设备信息
  ssBaseGateway, //获取网关
  addEquipment, //新增设备
  SsBaseDeviceUpdate, //编辑设备
  checkSsBaseDevice //字段重复校验
} from "@/api/equipmentManagement";
import openlayersMapEquipment from "@/components/Map/openlayersMapEquipment"; //当日车流实时趋势1
import {
  monitoringCommandPage //监控指挥分页
} from "@/api/homePage";

export default {
  components: { openlayersMapEquipment },
  data() {
    const validateName = (rule, value, callback) => {
      if (this.editName !== value) {
        let para = {
          deviceName: value
        };
        checkSsBaseDevice(para)
          .then(response => {
            callback();
          })
          .catch(err => {
            if (err == "Error: 检查设备名称是否已存在") {
              callback(new Error("检查设备名称是否已存在"));
            }
          });
      } else {
        callback();
      }
    };
    const validateEquipmentNumber = (rule, value, callback) => {
      if (this.editEquipmentNumber !== value) {
        let para = {
          deviceId: value
        };
        checkSsBaseDevice(para)
          .then(response => {
            callback();
          })
          .catch(err => {
            if (err == "Error: 检查设备序列号是否已存在") {
              callback(new Error("检查设备序列号是否已存在"));
            }
          });
      } else {
        callback();
      }
    };
    const validateCoordinate = (rule, value, callback) => {
      if (this.newList.coordinate) {
        callback();
      } else {
        callback(new Error("请选择设备坐标"));
      }
    };

    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      editName: null, //设备名称
      editEquipmentNumber: null, //设备序列号
      curMap: null,
      baseWidth: 1080,
      baseHeight: 758,
      coordinates: [],
      newList: {
        parkId: null, //停车场id
        isGate: 0, //是否是闸机设备
        deviceName: "", //设备名称
        deviceId: "", //设备编号
        deviceBrand: null, //设备厂商
        deviceType: 2, //设备类型
        ip: "", //设备IP
        port: "", //端口
        loginName: "", //用户名
        password: "", //密码
        gatewayId: "", //网关
        protocols: 1, //协议类型
        mainStream: "", //主码流地址
        subStream: "", //子码流地址
        coordinate: "", //设备坐标
        status: 1, //启用、停用
        streamState: null, //流状态
        state: null //流状态
      }, //设备详情
      typeList: [
        { enumName: "抓拍机", enumValue: 1 },
        { enumName: "摄像机", enumValue: 2 }
      ],
      gateList: [
        { enumName: "是", enumValue: 1 },
        { enumName: "否", enumValue: 0 }
      ],
      equipmentManufacturerList: [
        { enumName: "海康", enumValue: 1 },
        { enumName: "宇视", enumValue: 2 },
        { enumName: "大华", enumValue: 3 }
      ],
      protocolTypes: [
        { enumName: "TCP", enumValue: 1 },
        { enumName: "UDP", enumValue: 2 }
      ],
      gatewayList: [],
      parkingList: [],
      rules: {
        parkId: [
          { required: true, message: "请选择停车场", trigger: "change" }
        ],
        isGate: [
          { required: true, message: "请选择是否道闸像机", trigger: "change" }
        ],
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          {
            required: true,
            message: "检查设备名称是否已存在",
            trigger: "blur",
            validator: validateName
          }
        ],
        deviceId: [
          { required: true, message: "请输入设备编号", trigger: "blur" },
          {
            required: true,
            message: "检查设备编号是否已存在",
            trigger: "blur",
            validator: validateEquipmentNumber
          }
        ],
        deviceBrand: [
          { required: true, message: "请选择设备厂商", trigger: "change" }
        ],
        deviceType: [
          { required: true, message: "请选择设备类型", trigger: "change" }
        ],
        ip: [{ required: true, message: "请输入设备IP", trigger: "blur" }],
        port: [{ required: true, message: "请输入端口号", trigger: "blur" }],
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        protocols: [
          { required: true, message: "请选择协议类型", trigger: "change" }
        ],
        mainStream: [
          { required: true, message: "请输入主码流地址", trigger: "blur" }
        ],
        subStream: [
          { required: true, message: "请输入子码流地址", trigger: "blur" }
        ],
        coordinate: [
          {
            required: true,
            message: "请选择设备坐标",
            trigger: "change",
            validator: validateCoordinate
          }
        ]
      }
    };
  },
  created() {
    this.getparking();
  },
  methods: {
    addPoint(e) {
      this.coordinates = e;
      if (e.length) {
        this.newList.coordinate = JSON.stringify(e);
      } else {
        this.newList.coordinate = "";
      }
    },
    getDeviceBrandName(id) {
      let arr = this.equipmentManufacturerList;
      let name;
      arr.forEach(el => {
        if (el.enumValue == id) {
          name = el.enumName;
        }
      });
      return name;
    },
    getprotocolName(id) {
      let arr = this.protocolTypes;
      let name;
      arr.forEach(el => {
        if (el.enumValue == id) {
          name = el.enumName;
        }
      });
      return name;
    },
    getGatewae(id) {
      let arr = this.gatewayList;
      let name;
      arr.forEach(el => {
        if (el.id == id) {
          name = el.ip;
        }
      });
      return name;
    },
    parkChange(e) {
      if (e) {
        let para = { pageNum: 1, pageSize: 1000, parkingLotId: this.curPark };
        monitoringCommandPage(para).then(response => {
          if (response.rows.length > 0) {
            this.curMapId = response.rows[0].id;
            this.curMap = response.rows[0].img;
            this.baseWidth = response.rows[0].width;
            this.baseHeight = response.rows[0].height;
            setTimeout(() => {
              if (this.coordinates) {
                this.$refs.openlayersMapEquipment.newCar(this.coordinates);
              }
            }, 200);
          } else {
            this.curMapId = null;
            this.curMap = null;
            this.coordinates = [];
          }
        });
      }
    },
    //获取设备类型
    getType(type) {
      let arr = this.typeList;
      arr.forEach(el => {
        if (el.enumValue == type) {
          name = el.enumName;
        }
      });
      let name;
      return name;
    },

    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
      });
    },
    //打开注册、编辑设备弹窗
    showDialog(id, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      let para = {};
      ssBaseGateway(para).then(response => {
        this.gatewayList = response.data;
      });
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
          parkId: null, //停车场id
          isGate: 0, //是否是闸机设备
          deviceName: "", //设备名称
          deviceId: "", //设备编号
          deviceBrand: null, //设备厂商
          deviceType: 2, //设备类型
          ip: "", //设备IP
          port: "", //端口
          loginName: "", //用户名
          password: "", //密码
          gatewayId: "", //网关
          protocols: 1, //协议类型
          mainStream: "", //主码流地址
          subStream: "", //子码流地址
          coordinate: "", //设备坐标
          status: 1, //启用、停用
          streamState: null, //流状态
          state: null //流状态
        };
        this.coordinates = [];
        this.editName = null;
        this.editEquipmentNumber = null;
        this.curMap = null;
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
      SsBaseDeviceGetInfo(para).then(response => {
        this.newList = response.data;
        if (response.data.coordinate) {
          this.coordinates = JSON.parse(response.data.coordinate);
        }
        this.editName = response.data.deviceName;
        this.editEquipmentNumber = response.data.deviceId;
        this.parkChange(response.data.parkId);
      });
    },
    //关闭新增/编辑设备弹窗
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
    //添加设备
    toAdd() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存设备信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            let para = this.newList;
            addEquipment(para)
              .then(response => {
                this.isShow = false;
                this.$emit("openLoading", {});
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
    //编辑设备
    toEidt() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的设备信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            SsBaseDeviceUpdate(para)
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
.base_dialog_main_prompt {
  width: 72%;
  height: 32px;
  line-height: 32px;
  text-align: center;
  margin-left: 136px;
  background: rgba($color: #ffd986, $alpha: 0.3);
  color: #f50e0e;
  margin-bottom: 10px;
}
.base_dialog_condit_noMap {
  width: 72%;
  height: 280px;
  // background: #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  .base_dialog_condit_noMap-img {
    width: 117px;
    height: 86px;
  }
  .base_dialog_condit_noMap-text {
    width: 100px;
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    color: #485451;
  }
}
</style>
