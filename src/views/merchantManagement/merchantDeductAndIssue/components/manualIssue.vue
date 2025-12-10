<template>
  <div>
    <div class="merchantDeductAndIssue_main ">
      <el-form :model="newList" :rules="rules" ref="licensePlateForm">
        <div class="base_dialog_main_content">
          <div class="base_dialog_main_left" style="padding:100px">
            <span class="base_dialog_condit">
              <el-form-item label="输入方式">
                <el-radio-group v-model="keyboardType">
                  <el-radio label="1">键盘</el-radio>
                  <el-radio label="2">软键盘</el-radio>
                </el-radio-group>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="车牌号" prop="licensePlate">
                <el-input
                  v-model="newList.licensePlate"
                  placeholder="输入车牌号"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
                <div
                  class="inputBox"
                  @click="clickInput"
                  v-show="keyboardType == 2"
                >
                  <span v-if="newList.licensePlate">{{
                    newList.licensePlate
                  }}</span>
                  <span v-else style="color:#ccc;font-size: 13px;"
                    >输入车牌号</span
                  >
                </div>
              </el-form-item>
            </span>
            、
          </div>
        </div>
      </el-form>
    </div>
    <Dialog ref="dialog" @setNo="setNo"></Dialog>
  </div>
</template>

<script>
import Dialog from "./dialog";

export default {
  name: "manualIssue",
  components: { Dialog },

  data() {
    return {
      newList: {
        licensePlate: ""
      },
      keyboardType: "1",
      rules: {
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    clickInput() {
      let licensePlate = this.newList.licensePlate;
      this.$refs.dialog.openDialog(licensePlate);
    },
    setNo(licensePlate) {
      this.newList.licensePlate = licensePlate;
      this.$refs["licensePlateForm"].validateField("licensePlate");
    },
    confirm() {
      if (this.licensePlateUnit.length >= 7) {
        console.log("车牌是：" + this.licensePlateUnit.join(""));
        this.licensePlateDoor = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.merchantDeductAndIssue_main {
  margin: 0 auto;
  width: 800px;
  .base_dialog_condit {
    position: relative;
    .inputBox {
      position: absolute;
      top: 4px;
      left: 101px;
      display: inline-block;
      width: 71%;
      height: 28px;
      line-height: 30px;
      padding: 0 15px;
      font-size: 13px;
      // border: 1px solid #dcdfe6;
      color: #606266;
      background: #fff;
      border-radius: 5px;
    }
  }
}
</style>
