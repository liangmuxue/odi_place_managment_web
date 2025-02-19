<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
//   mounted(){
// 	window.addEventListener('hashchange',()=>{
//     var currentPath = window.location.hash.slice(1); // 获取输入的路由
// 		if(this.$router.path !== currentPath){
// 			this.$router.push('/homePage'); // 动态跳转
// 		}
// 	},false);
// }
}
</script>
<style lang="scss">
#app {
  min-height: 100%;
  width: 100%;
  // background-image: url("./assets/images/homePage/big_bg.png");
  background: #ECF0F5;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
}
body .el-table th.gutter {
  display: table-cell !important;
}
// .filter-container {
//   font-size: 10px
// }
.main-container.hasTagsView {
  min-width: 1080px;
}
</style>