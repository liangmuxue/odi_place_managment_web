<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" :rules="rules" ref="merchantForm">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:100px">
            <span class="base_dialog_condit">
              <el-form-item label="商户名称" prop="merchantName">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.merchantName }}</span
                >
                <el-input
                  v-else
                  v-model="newList.merchantName"
                  placeholder="输入商户名称"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="联系人" prop="contact">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.contact }}</span
                >
                <el-input
                  v-else
                  v-model="newList.contact"
                  placeholder="输入联系人"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="联系电话" prop="tel">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.tel }}</span
                >
                <el-input
                  v-else
                  v-model="newList.tel"
                  placeholder="输入联系电话"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit bdc">
              <el-form-item label="停车场名称" prop="parkingLotId">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  <span>{{ newList.parkingLotName }}</span>
                </span>
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
              <el-form-item label="备注" prop="memo">
                <el-input
                  v-model="newList.memo"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注"
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
  merchantDetail, // 商户详情
  merchantInsert, // 商户新增
  merchantUpdate, // 商户修改
  checkMerchantNameUnique // 商户名称唯一性校验
} from "@/api/merchantManagement";
import {
  lotSelect //获取车场下拉框
} from "@/api/yardManagement";

export default {
  components: {},
  data() {
    const validateMerchantNameUnique = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      const checkParam = {
        merchantId: this.newList.id,
        merchantName: value
      };
      checkMerchantNameUnique(checkParam)
        .then(res => {
          const flag = res && (res.msg !== undefined ? res.msg : res);
          if (flag === "1" || flag === 1) {
            callback(new Error("商户名称已存在"));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback();
        });
    };
    return {
      pageType: 1,
      title: "新增",
      isShow: false,
      newList: {
        id: null,
        merchantName: "",
        contact: "",
        tel: "",
        parkingLotId: null,
        parkingLotName: "",
        memo: ""
      },
      parkingList: [],
      rules: {
        merchantName: [
          { required: true, message: "请输入商户名称", trigger: "blur" },
          { validator: validateMerchantNameUnique, trigger: "blur" }
        ],
        contact: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确手机号码",
            trigger: "blur"
          }
        ],
        parkingLotId: [
          { required: true, message: "请选择停车场", trigger: "blur" }
        ]
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
      if (this.$refs["merchantForm"]) {
        this.$refs["merchantForm"].resetFields();
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
          id: null,
          merchantName: "",
          contact: "",
          tel: "",
          parkingLotId: null,
          parkingLotName: "",
          memo: ""
        };
        if (this.$refs["merchantForm"]) {
          this.$nextTick(() => {
            this.$refs["merchantForm"].clearValidate();
          });
        }
      }
    },
    //获取详情
    getDetials(id) {
      let para = { merchantId: id };
      merchantDetail(para).then(response => {
        const data = response.data || {};
        this.newList.id = data.merchantId;
        this.newList.merchantName = data.merchantName;
        this.newList.contact = data.contact;
        this.newList.tel = data.tel;
        this.$set(this.newList, "parkingLotId", data.parkingLotId);
        this.newList.parkingLotName = data.parkingLotName;
        this.newList.memo = data.memo;
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
    // 添加商户
    toAdd() {
      this.$refs["merchantForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交保存商户吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            const para = {
              merchantName: this.newList.merchantName,
              contact: this.newList.contact,
              tel: this.newList.tel,
              parkingLotId: this.newList.parkingLotId,
              memo: this.newList.memo
            };

            merchantInsert(para)
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
    // 编辑商户
    toEidt() {
      this.$refs["merchantForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的商户吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            const para = {
              merchantId: this.newList.id,
              merchantName: this.newList.merchantName,
              contact: this.newList.contact,
              tel: this.newList.tel,
              parkingLotId: this.newList.parkingLotId,
              memo: this.newList.memo
            };

            merchantUpdate(para)
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
