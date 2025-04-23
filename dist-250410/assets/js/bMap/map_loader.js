(function() {
    window.BMap_loadScriptTime = new Date().getTime();
    window.BMap = window.BMap || {};
    window.BMap.apiLoad = function() {
      delete window.BMap.apiLoad;
    };
    document.write("<script src='/assets/js/bMap/map.js'></script>");
  })();
  
  