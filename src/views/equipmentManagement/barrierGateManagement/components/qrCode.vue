<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <div>
        <div class="qrBox" id="qr">
          <div class="qrBox_title">
            <img
              src="../../../../assets/images/equipmentList/parking.png"
              alt=""
              class="qrBox_img"
            />
            <div class="qrBox_title_text">{{ newList.parkName }}</div>
          </div>
          <div class="qrBox_con">
            <div class="qrBox_title2" v-if="newList.type > 2">
              无牌车扫码出场
            </div>
            <div class="qrBox_title2" v-else>无牌车扫码入场</div>
            <div class="qrBox_qr">
              <!-- <canvas
              :width="canvasWith"
              :height="canvasHeight"
              id="myCanvas"
            ></canvas> -->

              <img :src="newList.qrCode" id="qrImg" alt="" class="qr_img" />
            </div>
            <div class="qrBox_text">{{ newList.name }}</div>
          </div>
        </div>
        <div class="qrBtn" @click="download">下载</div>
      </div>
      <div v-if="newList.type > 2">
        <div class="qrBox" id="qr2">
          <div class="qrBox_title">
            <img
              src="../../../../assets/images/equipmentList/parking2.png"
              alt=""
              class="qrBox_img"
            />
            <div class="qrBox_title_text">{{ newList.parkName }}</div>
          </div>
          <div class="qrBox_con qrBox_con_g">
            <div class="qrBox_title2">
              有牌车扫码出场
            </div>
            <div class="qrBox_qr">
              <img :src="newList.qrCodePay" id="qrImg" alt="" class="qr_img" />
            </div>
            <div class="qrBox_text">{{ newList.name }}</div>
          </div>
        </div>
        <div class="qrBtn" @click="download2">下载</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  gateGetInfo //获取单个道闸信息
} from "@/api/equipmentManagement";
import html2canvas from "html2canvas";

export default {
  components: {},
  data() {
    return {
      title: "入场码",
      isShow: false,
      newList: {
        parkId: null, //停车场id
        name: "", //道闸名称
        ip: "", //道闸IP
        equipmentNumber: "", //设备序列号
        type: null, //道闸类型1入2出
        cameraNumber: "", //相机序列号
        cameraIp: "" //相机IP
      }, //道闸详情
      canvasShow: false,
      canvasWith: 0, //画布宽
      canvasHeight: 0 //画布高
    };
  },
  created() {},
  methods: {
    toDownload() {
      var video = document.getElementById("qrImg");
      this.canvasWith = document.getElementById("qrImg").offsetWidth;
      this.canvasHeight = document.getElementById("qrImg").offsetHeight;
      let canvas = document.getElementById("myCanvas");
      var ctx = canvas.getContext("2d");
      this.$nextTick(() => {
        ctx.drawImage(video, 0, 0, this.canvasWith, this.canvasHeight);
        // canvas.toDataURL("image/png");
        var oGrayImg = canvas.toDataURL("image/png");
        console.log(123, oGrayImg);
        this.canvasShow = true;
        this.$nextTick(() => {
          this.download();
        });
      });
    },
    download() {
      let qr = document.getElementById("qr");
      html2canvas(qr, {
        backgroundColor: null,
        useCORS: true // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
      }).then(canvas => {
        let mySrc = canvas.toDataURL("image/png");
        // 把生成的base64位图片上传到服务器,生成在线图片地址
        let vTime = new Date().getTime();
        let name = "截图" + vTime + ".png";
        canvas = null;
        this.downloadFile(name, mySrc);
      });
    },
    download2() {
      let qr = document.getElementById("qr2");
      html2canvas(qr, {
        backgroundColor: null,
        useCORS: true // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
      }).then(canvas => {
        let mySrc = canvas.toDataURL("image/png");
        // 把生成的base64位图片上传到服务器,生成在线图片地址
        let vTime = new Date().getTime();
        let name = "截图" + vTime + ".png";
        canvas = null;
        this.downloadFile(name, mySrc);
      });
    },
    /**
     * 下载
     */
    downloadFile(fileName, content) {
      let aLink = document.createElement("a");
      let blob = this.base64ToBlob(content); //new Blob([content]);

      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);

      // aLink.dispatchEvent(evt);
      aLink.click();
    },
    base64ToBlob(code) {
      let parts = code.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;

      let uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    },

    //打开注册、编辑道闸弹窗
    showDialog(id) {
      this.isShow = true;
      this.getDetials(id);
    },
    //获取详情
    getDetials(id) {
      let para = { id: id };
      gateGetInfo(para).then(response => {
        this.newList = response.data;
        if (response.data.type > 2) {
          this.title = "出场码";
        }
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
.base_dialog_main {
  display: flex;
}
.qrBox {
  margin: 100px 100px 0 100px;
  width: 502px;
  height: 542px;
  border: 1px solid #bbb;
  .qrBox_title {
    width: 500px;
    height: 70px;
    background: #fff;
    display: flex;
    .qrBox_img {
      width: 50px;
      height: 50px;
      margin: 10px;
    }
    .qrBox_title_text {
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      font-weight: bold;
      margin: 5px;
    }
  }
  .qrBox_con {
    width: 500px;
    height: 470px;
    background: #3394fc;
    .qrBox_title2 {
      height: 100px;
      line-height: 100px;
      width: 500px;
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      color: #fff;
    }
    .qrBox_qr {
      width: 300px;
      height: 300px;
      background: #fff;
      margin: 0 100px;
      overflow: hidden;
      .qr_img {
        width: 280px;
        height: 280px;
        margin: 10px;
      }
    }
    .qrBox_text {
      height: 70px;
      line-height: 70px;
      color: #fff;
      padding-left: 30px;
    }
  }
  .qrBox_con_g {
    background: #5dd470;
  }
}
.qrBtn {
  margin: 50px 100px;
  width: 100px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #33ae73;
  color: #fff;
  cursor: pointer;
}
</style>
