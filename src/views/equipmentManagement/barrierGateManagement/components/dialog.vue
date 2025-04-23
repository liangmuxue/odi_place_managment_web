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
          <div class="base_dialog_main_left" style="padding:100px">
            <div
              v-if="pageType == 1"
              class="base_dialog_main_prompt
"
            >
              新增设备，需由技术人员配合，调试相关硬件参数！
            </div>
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
              <el-form-item label="道闸名称" prop="name">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.name }}</span
                >
                <el-input
                  v-else
                  v-model="newList.name"
                  placeholder="输入道闸名称"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="设备序列号" prop="equipmentNumber">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.equipmentNumber }}</span
                >
                <el-input
                  v-else
                  v-model="newList.equipmentNumber"
                  :disabled="pageType == 2"
                  placeholder="输入设备序列号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="道闸类型" prop="type">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ getType(newList.type) }}</span
                >
                <el-select
                  v-else
                  v-model="newList.type"
                  placeholder="选择道闸类型"
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
              <el-form-item label="道闸IP" prop="ip">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.ip }}
                  <span
                    class="offLine_ball"
                    style="margin-left:50px"
                    v-show="newList.online == 0"
                  ></span>
                  <span v-show="newList.online == 0" class="offLine">
                    离线</span
                  >
                  <span
                    class="onLine_ball"
                    style="margin-left:50px"
                    v-show="newList.online == 1"
                  ></span>
                  <span v-show="newList.online == 1" class="onLine">
                    在线
                  </span>
                </span>
                <el-input
                  v-else
                  v-model="newList.ip"
                  :disabled="pageType == 2"
                  placeholder="输入道闸IP"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="辅助相机序列号" prop="cameraNumber">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.cameraNumber }}</span
                >
                <el-input
                  v-else
                  v-model="newList.cameraNumber"
                  :disabled="pageType == 2"
                  placeholder="输入辅助相机序列号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="辅助相机IP" prop="cameraIp">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.cameraIp }}
                  <span
                    class="offLine_ball"
                    style="margin-left:50px"
                    v-show="newList.cameraOnline == 0"
                  ></span>
                  <span v-show="newList.cameraOnline == 0" class="offLine">
                    离线</span
                  >
                  <span
                    class="onLine_ball"
                    style="margin-left:50px"
                    v-show="newList.cameraOnline == 1"
                  ></span>
                  <span v-show="newList.cameraOnline == 1" class="onLine">
                    在线
                  </span>
                </span>
                <el-input
                  v-else
                  v-model="newList.cameraIp"
                  :disabled="pageType == 2"
                  placeholder="输入辅助相机IP"
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
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";
import {
  gateGetInfo, //获取单个道闸信息
  gateAdd, //新增道闸
  gateUpdate, //编辑道闸
  gateCheckFive //字段重复校验
} from "@/api/equipmentManagement";

export default {
  components: {},
  data() {
    const validateName = (rule, value, callback) => {
      if (this.editName !== value) {
        let para = {
          name: value
        };
        gateCheckFive(para)
          .then(response => {
            callback();
          })
          .catch(err => {
            if (err == "Error: 检查道闸名称是否已存在") {
              callback(new Error("检查道闸名称是否已存在"));
            }
          });
      } else {
        callback();
      }
    };
    const validateIp = (rule, value, callback) => {
      if (this.editIp !== value) {
        let para = {
          ip: value
        };
        gateCheckFive(para)
          .then(response => {
            callback();
          })
          .catch(err => {
            if (err == "Error: 检查道闸IP是否已存在") {
              callback(new Error("检查道闸IP是否已存在"));
            }
          });
      } else {
        callback();
      }
    };
    const validateEquipmentNumber = (rule, value, callback) => {
      if (this.editEquipmentNumber !== value) {
        let para = {
          equipmentNumber: value
        };
        gateCheckFive(para)
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
    const validateCameraNumber = (rule, value, callback) => {
      if (this.editCameraNumber !== value) {
        let para = {
          cameraNumber: value
        };
        gateCheckFive(para)
          .then(response => {
            callback();
          })
          .catch(err => {
            if (err == "Error: 检查辅助相机序列号是否已存在") {
              callback(new Error("检查辅助相机序列号是否已存在"));
            }
          });
      } else {
        callback();
      }
    };
    const validateCameraIp = (rule, value, callback) => {
      if (this.editCameraIp !== value) {
        let para = {
          cameraIp: value
        };
        gateCheckFive(para)
          .then(response => {
            callback();
          })
          .catch(err => {
            if (err == "Error: 检查辅助相机IP是否已存在") {
              callback(new Error("检查辅助相机IP是否已存在"));
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
      editParkingSpaceId: null, //编辑泊位号
      editGeomagnetismId: null, //编辑地磁编号
      editName: null, //道闸名称
      editEquipmentNumber: null, //设备序列号
      editIp: null, //道闸ip
      editCameraNumber: null, //辅助像机序列号
      editCameraIp: null, //相机IP
      newList: {
        parkId: null, //停车场id
        name: "", //道闸名称
        ip: "", //道闸IP
        equipmentNumber: "", //设备序列号
        type: null, //道闸类型1入2出
        cameraNumber: "", //相机序列号
        cameraIp: "" //相机IP
      }, //道闸详情
      typeList: [
        { enumName: "地上入口", enumValue: 1 },
        { enumName: "地下入口", enumValue: 2 },
        { enumName: "地上出口", enumValue: 3 },
        { enumName: "地下出口", enumValue: 4 }
      ],
      parkingList: [],
      rules: {
        parkId: [
          { required: true, message: "请选择停车场", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入道闸名称", trigger: "blur" },
          {
            required: true,
            message: "检查道闸名称是否已存在",
            trigger: "blur",
            validator: validateName
          }
        ],
        ip: [
          { required: true, message: "请输入道闸IP", trigger: "blur" },
          {
            required: true,
            message: "检查道闸IP是否已存在",
            trigger: "blur",
            validator: validateIp
          }
        ],
        equipmentNumber: [
          { required: true, message: "请输入设备序列号", trigger: "blur" },
          {
            required: true,
            message: "检查设备序列号是否已存在",
            trigger: "blur",
            validator: validateEquipmentNumber
          }
        ],
        type: [
          { required: true, message: "请选择道闸类型", trigger: "change" }
        ],
        cameraNumber: [
          { required: true, message: "请输入辅助相机序列号", trigger: "blur" },
          {
            required: true,
            message: "检查辅助相机序列号是否已存在",
            trigger: "blur",
            validator: validateCameraNumber
          }
        ],
        cameraIp: [
          { required: true, message: "请输入辅助相机IP", trigger: "blur" },
          {
            required: true,
            message: "检查辅助相机IP是否已存在",
            trigger: "blur",
            validator: validateCameraIp
          }
        ]
      }
    };
  },
  created() {
    this.getparking();
  },
  methods: {
    //获取道闸类型
    getType(type) {
      let name;
      if (type == 1) {
        name = "地上入口";
      } else if (type == 2) {
        name = "地下入口";
      } else if (type == 3) {
        name = "地上出口";
      } else if (type == 4) {
        name = "地下出口";
      }
      return name;
    },

    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
      });
    },
    //打开注册、编辑道闸弹窗
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
          parkingDirection: null, //道闸方向 0-上行 1-下行 2-左行 3-右行
          parkingLotId: "", //停车场id
          status: 1, //状态 0-离线 1-空闲  2-占用
          parkingSpaceId: "", //道闸ID 泊位号
          geomagnetismId: "" //地磁ID
        };
        this.editName = null;
        this.editEquipmentNumber = null;
        this.editIp = null;
        this.editCameraNumber = null;
        this.editCameraIp = null;
        this.editParkingSpaceId = null;
        this.editGeomagnetismId = null;

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
      gateGetInfo(para).then(response => {
        this.newList = response.data;
        this.editName = response.data.name;
        this.editEquipmentNumber = response.data.equipmentNumber;
        this.editIp = response.data.ip;
        this.editCameraNumber = response.data.cameraNumber;
        this.editCameraIp = response.data.cameraIp;
        this.editParkingSpaceId = response.data.parkingSpaceId;
        this.editGeomagnetismId = response.data.geomagnetismId;
      });
    },
    //关闭新增/编辑道闸弹窗
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
    //添加道闸
    toAdd() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存道闸信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            let para = this.newList;
            gateAdd(para)
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
                // this.$message({
                //   type: "warning",
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
    //编辑道闸
    toEidt() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的道闸信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            gateUpdate(para)
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
                // this.$message({
                //   type: "warning",
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
</style>
