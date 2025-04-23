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
            <span class="base_dialog_condit">
              <el-form-item label="泊位号" prop="parkingSpaceId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.parkingSpaceId }}</span
                >
                <el-input
                  v-else
                  v-model="newList.parkingSpaceId"
                  placeholder="输入停泊位号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="停车场" prop="parkingLotId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.parkingLotName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.parkingLotId"
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
              <el-form-item label="地磁编号" prop="geomagnetismId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.geomagnetismId }}</span
                >
                <el-input
                  v-else
                  v-model="newList.geomagnetismId"
                  placeholder="输入停泊位号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车位类型" prop="parkingDirection">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.parkingDirectionName }}</span
                >
                <el-select
                  v-else
                  v-model="newList.parkingDirection"
                  placeholder="选择车位类型"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in parkingDirectionList"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车位状态" prop="status">
                <el-radio-group
                  v-model="newList.status"
                  :disabled="pageType == 3"
                >
                  <el-radio :label="1">空闲</el-radio>
                  <el-radio :label="2">占用</el-radio>
                  <el-radio :label="0">离线</el-radio>
                </el-radio-group>
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-show="pageType < 3">
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
  parkingSpaceCheckId, //检查地磁ID和车位ID
  parkingList, //车场分页查询
  lotSelect, //获取车场下拉框
  parkingSpaceDetail, //获取单个车位信息
  parkingSpaceInsert, //新增车位
  parkingSpaceUpdate //编辑车位
} from "@/api/yardManagement";

export default {
  components: {},
  data() {
    const validateEditParkingSpaceId = (rule, value, callback) => {
      if (this.editParkingSpaceId !== value) {
        let para = {
          parkingSpaceId: value
        };
        parkingSpaceCheckId(para).then(response => {
          if (response.msg === "车位id重复") {
            callback(new Error("泊位号称重复不可用"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    const validateEditGeomagnetismId = (rule, value, callback) => {
      if (this.editGeomagnetismId !== value) {
        let para = {
          geomagnetismId: value
        };
        parkingSpaceCheckId(para).then(response => {
          if (response.msg === "地磁id重复") {
            callback(new Error("地磁编号重复不可用"));
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
      editParkingSpaceId: null, //编辑泊位号
      editGeomagnetismId: null, //编辑地磁编号
      newList: {
        parkingDirection: null, //车位方向 0-上行 1-下行 2-左行 3-右行
        parkingLotId: "", //停车场id
        status: 1, //状态 0-离线 1-空闲  2-占用
        parkingSpaceId: "", //车位ID 泊位号
        geomagnetismId: "" //地磁ID
      }, //车位详情
      parkingDirectionList: [
        { enumValue: 0, enumName: "地上" },
        { enumValue: 1, enumName: "地下" }
      ],
      parkingList: [],
      rules: {
        parkingSpaceId: [
          { required: true, message: "请输入泊位号", trigger: "blur" },
          {
            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_\-]{1,10}$/,
            message: "请输入10以内字符，且不含特殊字符",
            trigger: "blur"
          },
          {
            required: true,
            message: "泊位号已存在",
            trigger: "blur",
            validator: validateEditParkingSpaceId
          }
        ],
        geomagnetismId: [
          {
            pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_\-]{1,20}$/,
            message: "请输入20以内字符，且不含特殊字符",
            trigger: "blur"
          },
          {
            message: "地磁编号已存在",
            trigger: "blur",
            validator: validateEditGeomagnetismId
          }
        ],
        parkingLotId: [
          { required: true, message: "请选择停车场", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择车位状态", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getparking();
  },
  methods: {
    getparking() {
      lotSelect().then(response => {
        this.parkingList = response.data;
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
          parkingDirection: null, //车位方向 0-上行 1-下行 2-左行 3-右行
          parkingLotId: "", //停车场id
          status: 1, //状态 0-离线 1-空闲  2-占用
          parkingSpaceId: "", //车位ID 泊位号
          geomagnetismId: "" //地磁ID
        };
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
      parkingSpaceDetail(para).then(response => {
        this.newList = response.data;
        this.newList.parkingLotName = response.data.parkingLot.name;
        this.editParkingSpaceId = response.data.parkingSpaceId;
        this.editGeomagnetismId = response.data.geomagnetismId;
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
    //添加车位
    toAdd() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存泊位信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            parkingSpaceInsert(para)
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
    //编辑车位
    toEidt() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的泊位信息吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = this.newList;
            parkingSpaceUpdate(para)
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

<style lang="scss" scoped></style>
