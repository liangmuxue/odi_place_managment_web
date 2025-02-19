  <!--  
    /**
      * 暂无数据组件
      * @desc 用于查询不到数据时，默认显示
      * @author Yangyi Lee
      * @date 2021-4-16
      * @param {String} [text] - 传入无数据是图片下放标准文字,不传入时默认暂无数据
      * @param {String} [size] - 传入'small'图片为100px*100px,不传入时默认150px*150px
    */
  -->
<template>
  <div class="empty-box">
    <img
      :class="size=='small'?'empty-pic-small':'empty-pic'"
      src="../../../assets/images/equipmentList/tabel_none.png"
      alt
    />
    <div class="empty-text">{{text||'暂无数据'}}</div>
  </div>
</template>
<script>
export default {
  name: "Empty",
  props: {
    text: String, //无数据展示字段图片大小
    size: String //字段
  }
};
</script>
<style scoped lang="scss">
.empty-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .empty-pic {
    width: 150px;
    height: 150px;
  }
  .empty-pic-small {
    width: 100px;
    height: 100px;
  }
  .empty-text {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    text-align: center;
    color: #335056;
  }
}
</style>
