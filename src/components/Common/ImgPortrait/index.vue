<template>
  <!--  
    /**
      * 图片通用组件
      * @desc 对图片加载失败和暂无图片进行简单处理
      * @author Yangyi Lee
      * @date 2021-4-19
      * @param {String} [PicSrc] - 传入图片路径
    */
-->
  <div class="load_picture">
    <el-image :src="PicSrc" class="load_picture" v-if="PicSrc">
      <div slot="error" class="image-slot pic_solt">
        <img src="../../../assets/images/imgError2.png" class="pic_error" />
        <!-- 加载失败 -->
      </div>
    </el-image>
    <el-image :src="PicSrc" class="load_picture" v-if="!PicSrc">
      <div slot="error" class="image-slot pic_solt">
        <img src="../../../assets/images/imgError.png" class="pic_error" />
        <!-- 无图片 -->
      </div>
    </el-image>
  </div>
</template>
<script>
export default {
  mounted() {
  },
  props: {
    PicSrc: {
      type: String
    }
  }
};
</script>

<style lang="scss" >
.load_picture {
  background: #eee;
  display: block;
  width: 100%;
  height: 100%;
  .pic_solt {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .pic_error {
      width: 60%;
      max-width: 128px;
      max-height: 128px;
      object-fit: contain;
    }
  }
}
</style>