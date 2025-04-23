/*
 * 离线地图扩展功能函数
 */
//////////////////下面的保持不动///////////////////////////////////
var scripts = document.getElementsByTagName("script");
var JS__FILE__ = scripts[scripts.length - 1].getAttribute("src");  //获得当前js文件路径
var extendHome = JS__FILE__.substr(0, JS__FILE__.lastIndexOf("/")+1) + "modules/extend/"; // 拓展js目录
var extendCss = extendHome + "css/";
(function(){
  window.BMap_loadScriptTime = (new Date).getTime();
  // 加载鼠标拉框放大地图
  document.write('<script type="text/javascript" src="'+extendHome+'rectangleZoom.js"></script>');
  // 加载加载鼠标绘制工具
  document.write('<script type="text/javascript" src="'+extendHome+'drawingManager.js"></script>');
  document.write('<link rel="stylesheet" href="'+extendCss+'drawingManager_min.css" />');
  // 加载鼠标测距工具
  document.write('<script type="text/javascript" src="'+extendHome+'DistanceTool_min.js"></script>');
})();
///////////////////////////////////////////////////////////////////