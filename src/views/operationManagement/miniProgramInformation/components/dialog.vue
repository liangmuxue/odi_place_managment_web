<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" ref="minForm" :rules="rules">
        <div
          class="base_dialog_main_content"
          style="height: calc(100vh - 240px);"
        >
          <div class="base_dialog_main_left" style="padding:50px">
            <span class="base_dialog_condit">
              <el-form-item label="资讯分类" prop="consultType">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.consultType }}</span
                >
                <el-select
                  v-else
                  v-model="newList.consultType"
                  placeholder="选择资讯分类"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in consultTypes"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>

            <span class="base_dialog_condit" style="position: relative;">
              <div
                class="update_wenzi"
                style="font-size: 12px;padding-left: 136px;color:#ccc;height:20px;ling-height:20px"
              >
                *上格式jpg/jpeg/png/bmp；建议：350*196像素，最大不超过10M
              </div>
              <el-form-item label="停车场图片" prop="banner">
                <el-input
                  v-show="false"
                  v-model="newList.banner"
                  placeholder="图片"
                  class="filter-item"
                  size="mini"
                />
                <div class="uploaddiv">
                  <div class="photos_div"></div>
                  <el-upload
                    class="avatar-uploader photos_div"
                    action="String"
                    accept="image/jpeg, image/jpg, image/png, image/bmp"
                    :disabled="pageType == 3"
                    :http-request="uploadPic"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    element-loading-text="图像校验中"
                  >
                    <ImgPortrait3
                      v-if="newList.banner"
                      :PicSrc="newList.banner"
                      type="3"
                      class="photos_p"
                    ></ImgPortrait3>
                    <i
                      class="el-icon-plus avatar-uploader-icon"
                      v-if="!newList.banner"
                    ></i>
                  </el-upload>
                </div>
              </el-form-item>
            </span>
            <span class="base_dialog_condit">
              <el-form-item label="链接类型" prop="urlType">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ getTypeName(newList.urlType) }}</span
                >
                <el-select
                  v-else
                  v-model="newList.urlType"
                  placeholder="选择链接类型"
                  clearable
                  @change="changeUrlType"
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in urlTypes"
                    :key="item.enumValue"
                    :label="item.enumName"
                    :value="item.enumValue"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="newList.urlType == 1">
              <el-form-item label="选择页面" prop="url">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ getUrlName(newList.url) }}</span
                >
                <el-select
                  v-else
                  v-model="newList.url"
                  placeholder="选择页面"
                  clearable
                  class="filter-item"
                  style="width: 72%"
                  size="small"
                >
                  <el-option
                    v-for="item in htmlList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.url"
                  />
                </el-select>
              </el-form-item>
            </span>
            <span class="base_dialog_condit" v-if="newList.urlType == 2">
              <el-form-item label="AppID" prop="url">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.url }}</span
                >
                <el-input
                  v-else
                  v-model="newList.url"
                  placeholder="输入AppID"
                  style="width: 72%"
                  class="filter-item"
                  size="small"
                />
              </el-form-item>
            </span>

            <span class="base_dialog_condit" v-if="newList.urlType == 3">
              <el-form-item label="输入网址" prop="url">
                <span class="base_dialog_condit_text" v-if="pageType == 3">
                  {{ newList.url }}</span
                >
                <el-input
                  v-else
                  v-model="newList.url"
                  placeholder="输入AppID"
                  style="width: 72%"
                  class="filter-item"
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
  consultGetInfo, //小程序资讯详情
  consultAdd, //consultAdd
  consultUpdate, //小程序资讯修改
  htmlList //小程序页面列表
} from "@/api/operationManagement";
import { UploadImage } from "@/api/common";

export default {
  components: {},
  data() {
    return {
      pageType: 2,
      title: "回复",
      isShow: false,
      newList: {
        consultType: null, //资讯分类
        banner: "", //轮播图
        urlType: null, //链接类型
        pageUrl: null, //选择页面
        AppId: "", //AppId
        url: "" //链接地址
      }, //详情
      rules: {
        consultType: [
          { required: true, message: "请选择资讯分类", trigger: "change" }
        ],
        banner: [
          { required: true, message: "请上传停车场图片", trigger: "change" }
        ],
        urlType: [
          { required: true, message: "请选择链接类型", trigger: "change" }
        ],
        pageUrl: [{ required: true, message: "请选择页面", trigger: "change" }],
        AppId: [{ required: true, message: "请输入AppId", trigger: "blur" }],
        url: [{ required: true, message: "请输入网址", trigger: "blur" }]
      },
      htmlList: [],
      consultTypes: [
        {
          enumValue: "轮播图",
          enumName: "轮播图"
        }
      ],
      urlTypes: [
        {
          enumValue: 0,
          enumName: "无"
        },
        {
          enumValue: 1,
          enumName: "站内链接"
        },
        {
          enumValue: 2,
          enumName: "站外小程序"
        },
        {
          enumValue: 3,
          enumName: "站外网页"
        }
      ]
    };
  },
  created() {
    this.getHtmlList();
  },
  methods: {
    getHtmlList() {
      let para = {};
      htmlList(para).then(response => {
        this.htmlList = response.data;
      });
    },
    getTypeName(type) {
      let name;
      this.urlTypes.forEach(el => {
        if (type == el.enumValue) {
          name = el.enumName;
        }
      });
      return name;
    },
    getUrlName(url) {
      let name;
      this.htmlList.forEach(el => {
        if (url == el.url) {
          name = el.name;
        }
      });
      return name;
    },
    changeUrlType() {
      this.newList.url = "";
    },
    //打开弹窗
    showDialog(id, pageType) {
      this.isShow = true;
      this.pageType = pageType;
      if (this.$refs["minForm"]) {
        this.$refs["minForm"].resetFields();
      }

      if (pageType == 1) {
        this.title = "新增";
        this.newList = {
          consultType: null, //资讯分类
          banner: "", //轮播图
          urlType: null, //链接类型
          pageUrl: null, //选择页面
          AppId: "", //AppId
          url: "" //链接地址
        }; //车位详情
      } else if (pageType == 2) {
        this.title = "编辑";
        this.getDetials(id);
      } else if (pageType == 3) {
        this.title = "详情";
        this.getDetials(id);
      }
    },
    //关闭弹窗
    closeDialog() {
      this.isShow = false;
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
        this.newList.banner = response.url;
        this.$refs.parkingForm.validateField("banner");
      });
    },

    //获取详情
    getDetials(id) {
      let para = { id: id };
      consultGetInfo(para).then(response => {
        this.newList = response.data;
      });
    },
    //保存
    toSave() {
      if (this.pageType == 1) {
        this.toAdd();
      } else if (this.pageType == 2) {
        this.toUpDate();
      }
    },
    //新增
    toAdd() {
      this.$refs["minForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认新增资讯吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            consultAdd(para)
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
    },
    //编辑
    toUpDate() {
      this.$refs["minForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认编辑资讯吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = JSON.parse(JSON.stringify(this.newList));
            consultUpdate(para)
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

<style lang="scss" scoped>
.update_wenzi {
  position: absolute;
  top: 50px;
  left: 150px;
  width: 500px;
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
.photos_p {
  width: 110px;
  height: 110px;
}
</style>
