<template>
  <!--  
    /**
      * 图片通用组件
      * @desc 对图片加载失败和暂无图片进行简单处理
      * @author Yangyi Lee
      * @date 2021-4-19
      * @param {String} [PicSrc] - 传入图片路径
               {String} [type] - 图片类型：1.人脸 2.人体 3.人 4.全景图
    */
-->
  <div class="load_picture">
    <div class="img_box">
      <img :src="PicSrc" class="img_pic" v-if="PicSrc" @error="defImg4()" />
      <img src="../../../assets/images/imgError.png" class="img_pic2" v-else />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    PicSrc: {
      type: String
    },
    type: {
      type: String
      //
    }
  },
  data() {
    return {
      defaultImg: require("../../../assets/images/imgError2.png")
    };
  },
  mounted() {},
  methods: {
    defImg4() {
      let img = event.srcElement;
      img.src = this.defaultImg;
      img.style = "width:100%;height:100%;";
      img.onerror = null; //防止闪图
    }
  }
};
</script>

<style lang="scss">
.load_picture {
  display: inline-block;
  width: 100%;
  height: 100%;
  background: #def8f2;
  .img_box {
    width: 100%;
    height: 100%;
    background: #def8f2;
    display: flex;
    justify-content: center;
    // align-items: center;
    .img_pic {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      width: auto;
      height: auto;
    }
    .img_pic2 {
      width: 60px;
      height: 60px;
      margin: auto;
    }
  }
}
</style>
