<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" ref="feedbackForm">
        <div
          class="base_dialog_main_content"
          style="height: calc(100vh - 240px);"
        >
          <div class="base_dialog_main_left" style="padding:50px">
            <span class="base_dialog_condit">
              <el-form-item label="反馈内容：" prop="nickname">
                <span class="base_dialog_condit_text">
                  {{ newList.information }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="头像：" prop="avatar">
                <el-popover
                  placement="top-start"
                  width="500"
                  trigger="click"
                  v-for="item in newList.imgUrls"
                  :key="item"
                >
                  <img
                    :src="item ? item : item"
                    width="100%"
                    style="margin-right:5px"
                  />
                  <img
                    v-if="item !== '' && item !== null"
                    slot="reference"
                    :src="item"
                    width="80"
                    style="margin-right:5px"
                  />
                  <span v-else>
                    <div min-width="48" height="36"></div>
                  </span>
                </el-popover>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="反馈人联系方式：" prop="lastLoginTime">
                <span class="base_dialog_condit_text">
                  {{ newList.contact }}
                </span>
              </el-form-item>
            </span>

            <span class="base_dialog_condit">
              <el-form-item label="反馈时间：" prop="createTime">
                <span class="base_dialog_condit_text">
                  {{ newList.creatTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
                </span>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="回复：" prop="balance">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.back }}
                </span>
                <el-input
                  v-else
                  v-model="newList.back"
                  placeholder="请输入"
                  type="textarea"
                  :rows="3"
                  style="width: 72%"
                  class="filter-item"
                  maxlength="1000"
                  show-word-limit
                  size="small"
                />
              </el-form-item>
            </span>
          </div>
        </div>
      </el-form>
      <div class="base_dialog_main_btnBox" v-if="pageType !== 3">
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
  feedbcakDetail, //意见反馈详情
  feedbcakReply //意见反馈回复
} from "@/api/operationManagement";

export default {
  components: {},
  data() {
    return {
      pageType: 2,
      title: "回复",
      isShow: false,
      newList: {
        userId: null, //反馈人用户主键
        phone: "", //反馈人手机号
        contact: "", //反馈人联系方式
        information: "", //反馈内容
        creatTime: "", //创建时间
        imgUrls: [], //图片列表
        back: "" //回复
      } //车位详情
    };
  },
  created() {},
  methods: {
    //打开弹窗
    showDialog(id, pageType) {
      this.isShow = true;
      this.getDetials(id);
      this.pageType = pageType;
      if (pageType == 2) {
        this.title = "回复";
      } else if (pageType == 3) {
        this.title = "查看回复";
      }
    },
    //关闭弹窗
    closeDialog() {
      this.isShow = false;
    },
    //获取详情
    getDetials(id) {
      let para = { id: id };
      feedbcakDetail(para).then(response => {
        this.newList = response.data;
      });
    },
    //保存
    toSave() {
      this.$refs["feedbackForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交回复吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            feedbcakReply(para)
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
