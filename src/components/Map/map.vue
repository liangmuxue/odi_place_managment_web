<template>
  <div id="MapBox">
    <div class="baiduMap" id="mapShow"></div>
  </div>
</template>

<script>
// import { fetchDeviceList } from "@/api/resourceCenter";

// 初始化绘制对象
export default {
  props: {
    pageType: {
      type: Number
    }
  },
  name: "baiduMap",
  data() {
    return {
      tenantId: "",
      map: null,
      address: "",
      isFirst: true,
      selectPoint: "",
      overlays: [],
      overlays_info: [],
      Drawingshow: true,
      pointArr: [],
      polygonArr: [], //所有小区轮廓
      polygon: {}, //小区轮廓
      pointList: [], //点坐标组
      componentParams_map: null, //父组件传值
      locationInfo: {
        drawType: "",
        coordinate: {
          longitude: 121.542328,
          latitude: 38.875049
        },
        coordinateArea: "",
        villageName: "",
        building: ""
      },
      tipsTitle: "",
      mapZoom: 16,
      listQuery: {
        currentPage: 1, //当前页数
        pageSize: 100, //每页数量
        villageName: "", //小区名称
        userIds: "", //当前用户编号
        regionCodes: [], //区划编号，多个以英文","分
        total: 0 // 数据总条数
      },
      list: [], // 小区数据源
      data: [],
      realTimeMonitoringList: [] //摄像头数据源
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tenantId = this.$store.getters.tenantId;
    });

    window.onload = function() {
      resolve(BMap);
    };
    this.baiduMap();
    //监听鼠标滚动事件
    window.addEventListener(
      "mousewheel",
      this.debounce(this.handleScroll, 300),
      true
    ) ||
      window.addEventListener(
        "DOMMouseScroll",
        this.debounce(this.handleScroll, 300),
        false
      );
  },
  // beforeMounted() {
  //   window._bd_share_main = "";
  //   window.init = function() {
  //     resolve(BMap);
  //   };
  // },
  created() {},
  updated() {},

  methods: {
    /**
     * 开启绘制
     */
    openDraw() {
      this.map.drawingManager.open();
    },
    baiduMap: function() {
      this.map = new BMap.Map("mapShow", {
        minZoom: 3,
        maxZoom: 18
      });
      // 动态设置级别：
      //					this.map.setMaxZoom(10);
      //					this.map.setMinZoom(2);
      var point = new BMap.Point(121.534528, 38.865049); // 创建点坐标
      this.map.centerAndZoom(point, this.mapZoom); // 初始化地图，设置中心点坐标和地图级别
      this.map.setMapStyle({ style: "normal" });
      var top_left_control = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_TOP_LEFT
      }); // 左上角，添加比例尺
      var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
      this.map.enableScrollWheelZoom(); //获取缩放等级,这里没什么用写着玩的;
      this.map.setCurrentCity("大连"); // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom();
      // var nowHc2 = document.documentElement.clientHeight / 2; //算出高的一半
      // var nowWc2 = document.documentElement.width() / 2; //宽的一半
      // map.panBy(nowWc2, nowHc2); //定位
      // 添加一个标注
      /*this.marker = new BMap.Marker(point);
        this.map.addOverlay(this.marker);*/

      // 初始化地图类型和缩略图控件变量
      this.map.mapType1 = new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
        anchor: BMAP_ANCHOR_TOP_RIGHT
      });
      this.map.overView = new BMap.OverviewMapControl();
      this.map.overViewOpen = new BMap.OverviewMapControl({
        isOpen: true,
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT
      });
      // 初始化鼠标拉框放大变量
      this.map.dragZoom = new BMapLib.RectangleZoom(this.map, {
        followText: "拖拽鼠标进行操作"
      });
      // 初始化鼠标绘制工具
      var styleOptions = {
        strokeColor: "blue", //边线颜色。
        fillColor: "blue", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.1, //填充的透明度，取值范围0 - 1。
        strokeStyle: "dashed" //边线的样式，solid或dashed。
      };
      this.map.drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: this.pageType !== 3, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
          offset: new BMap.Size(30, 5), //偏离值
          scale: 1.4, //工具栏缩放比例
          drawingModes: [
            BMAP_DRAWING_MARKER
            // , BMAP_DRAWING_POLYGON
          ]
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
      });
      // setTimeout(() => {
      //   this.openDraw();
      // }, 300);
      // 添加鼠标绘制工具监听事件，用于获取绘制结果
      this.map.drawingManager.addEventListener(
        "overlaycomplete",
        (e, overlay) => {
          this.map.drawingManager.close();
          var lays = [];
          var lng_sum = 0;
          var lat_sum = 0;
          if (e.overlay.ja) {
            const arr_lay = e.overlay.ja;
            for (let i = 0; i < arr_lay.length; i++) {
              lng_sum += arr_lay[i].lng;
              lat_sum += arr_lay[i].lat;
              lays.push(arr_lay[i].lng + ":" + arr_lay[i].lat + ";");
            }
            var lngc = Number((lng_sum / arr_lay.length).toFixed(6));
            var latc = Number((lat_sum / arr_lay.length).toFixed(6));
            this.locationInfo.coordinate.longitude = lngc;
            this.locationInfo.coordinate.latitude = latc;
            this.overlays.push(
              lays
                .toString()
                .replace(/,/g, "")
                .replace(/:/g, ",")
            ); //获取不规则样式的坐标
            this.locationInfo.coordinateArea = lays
              .toString()
              .replace(/,/g, "")
              .replace(/:/g, ",");

            this.gisCenter = lngc + "," + latc;
            this.getLocation();
          } else if (e.overlay.point) {
            this.locationInfo.coordinate.longitude = e.overlay.point.lng;
            this.locationInfo.coordinate.latitude = e.overlay.point.lat;
            // this.locationInfo.drawType = this.componentParams_map.drawType;
            this.getLocation();
          }
        }
      );

      // 只保留一个选点或选区
      this.map.drawingManager.addEventListener(
        "polygoncomplete",
        (e, overlay) => {
          this.map.clearOverlays();
          this.map.addOverlay(overlay);
        }
      );
      this.map.drawingManager.addEventListener(
        "markercomplete",
        (e, overlay) => {
          this.map.clearOverlays();
          this.map.addOverlay(overlay);
        }
      );
    },
    //向上传递绘制信息
    getLocation() {
      this.$emit("getLocation", this.locationInfo);
    },
    /* **************地图类型、缩略图控件控制************** */
    add_control() {
      this.map.addControl(this.map.mapType1); //2D图，混合图
      this.map.addControl(this.map.overView); //添加默认缩略地图控件
      this.map.addControl(this.map.overViewOpen); //右下角，打开
    },
    delete_control() {
      this.map.removeControl(this.map.mapType1); //移除2D图，混合图
      this.map.removeControl(this.map.overView);
      this.map.removeControl(this.map.overViewOpen);
    },
    /* **************鼠标点击拾取经纬度************** */
    getLngLat() {
      this.map.addEventListener("click", lngLatEvent);
    },
    cancelLngLat() {
      this.map.removeEventListener("click", lngLatEvent);
    },

    DrawingShow() {},
    DrawingClose() {},
    //选择区划时，定位
    selectVillage_toLocation(val) {
      setTimeout(() => {
        // this.locationInfo.coordinate.longitude = val.lon;
        // this.locationInfo.coordinate.latitude = val.lat;
        this.selectToLocation(val.lon, val.lat);
        var allOverlay = this.map.getOverlays();
        for (var i = 1; i < allOverlay.length - 1; i++) {
          if (allOverlay[i].ja) {
            if (
              allOverlay[i - 1].point.lat == val.lat &&
              allOverlay[i - 1].point.lng == val.lon
            ) {
              allOverlay[i].setStrokeColor("green");
              allOverlay[i].setFillColor("green");
              this.map.setZoom(17);
            } else {
              allOverlay[i].setStrokeColor("blue");
              allOverlay[i].setFillColor("blue");
            }
          }
        }
      }, 1000);
    },
    /* **************经纬度定位************** */
    toLocation() {
      if (
        this.locationInfo.coordinate.longitude &&
        this.locationInfo.coordinate.latitude
      ) {
        console.log(this.locationInfo.coordinate);
        // this.map.clearOverlays();
        const longitude = this.locationInfo.coordinate.longitude;
        const latitude = this.locationInfo.coordinate.latitude;
        var new_point = new BMap.Point(longitude, latitude);
        // var myIcon = new BMap.Icon("assets/js/bMap/images/quanjing.png",new BMap.Size(30, 30));
        // var marker = new BMap.Marker(new_point,{icon:myIcon}); // 创建标注
        var dingwei_marker = new BMap.Marker(new_point); // 创建标注
        this.map.clearOverlays();
        this.map.addOverlay(dingwei_marker); // 将标注添加到地图中
        setTimeout(() => {
          dingwei_marker.setAnimation();
        }, 3000);
        dingwei_marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        this.map.panTo(new_point);
        // 添加信息窗口
        var opts = {
          width: 120, // 信息窗口宽度
          height: 90, // 信息窗口高度
          title: this.tipsTitle, // 信息窗口标题
          enableMessage: true //设置允许信息窗发送短息
        };
        var infoWindow = new BMap.InfoWindow(
          "定位坐标：" + longitude + "," + latitude,
          opts
        ); // 创建信息窗口对象
        dingwei_marker.addEventListener("click", function() {
          this.map.openInfoWindow(infoWindow, new_point); //开启信息窗口
        });
      }
    },
    showOverlays() {
      // map.addOverlay(polyline); //增加折线
      // map.addOverlay(circle); //增加圆
      /* *********显示小区********* */

      for (let i = 0; i < this.overlays.length; i++) {
        if (this.overlays && this.overlays[i]) {
          var overlays2 = this.overlays[i].split(";");
          var overlays3 = this.overlays[i].split(",");
          this.pointArr = [];
          for (var n = 0; n < overlays2.length - 1; n++) {
            this.pointArr.push(
              new BMap.Point(
                parseFloat(overlays2[n]),
                parseFloat(overlays3[n + 1])
              )
            );
          }
          this.polygonArr.push(this.pointArr);
          this.addPolygon(this.pointArr, this.overlays_info[i]);
        }
      }
    },

    selectToLocation(longitude, latitude) {
      var new_point;
      var dingwei_marker;
      if (longitude && latitude) {
        new_point = new BMap.Point(longitude, latitude);
        dingwei_marker = new BMap.Marker(new_point); // 创建标注
        this.map.addOverlay(dingwei_marker); // 将标注添加到地图中
        dingwei_marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      } else {
        new_point = new BMap.Point(116.2317, 39.5427);
        this.map.centerAndZoom(new_point, 4);
        // dingwei_marker = new BMap.Marker(new_point); // 创建标注
        // this.map.addOverlay(dingwei_marker); // 将标注添加到地图中
      }
      this.map.panTo(new_point);
      // 添加信息窗口
      var opts = {
        width: 120, // 信息窗口宽度
        height: 90, // 信息窗口高度
        title: this.tipsTitle, // 信息窗口标题
        enableMessage: true //设置允许信息窗发送短息
      };
      var infoWindow = new BMap.InfoWindow(
        "定位坐标：" + longitude + "," + latitude,
        opts
      ); // 创建信息窗口对象
      dingwei_marker.addEventListener("click", function() {
        this.map.openInfoWindow(infoWindow, new_point); //开启信息窗口
      });
    },
    //点亮摄像头
    cameraLight2(data) {
      console.log(222333, data);
      for (var k = 0; k < data.length; k++) {
        let id = data[k].regionId;
        this.cameraLight(data[k], true);
      }
    },
    cameraChecked(data) {
      console.log(222333, data);
      for (var k = 0; k < data.length; k++) {
        let id = data[k].regionId;
        this.cameraLight(data[k], true);
      }
    },
    cameraLight(data, checked) {
      console.log(5555, data);
      console.log(5555, checked);
      let id = data.regionId;
      let lon = data.lon;
      let lat = data.lat + 0.000001;
      var light_point = new BMap.Point(lon, lat);
      var myIcon = new BMap.Icon(
        "assets/js/bMap/images/checked.png",
        new BMap.Size(32, 32)
      );
      var light_marker = new BMap.Marker(light_point, {
        icon: myIcon
      }); // 创建标注
      light_marker.setZIndex(1000);
      var allOverlay = this.map.getOverlays();
      if (checked === true) {
        for (var i = 1; i < allOverlay.length - 1; i++) {
          if (allOverlay[i].getLabel) {
            if (allOverlay[i].getLabel().content === id) {
              console.log(77777777, allOverlay[i].getLabel().content);
              var light_cont = new BMap.Icon(
                "assets/js/bMap/images/camera2.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont);
            }
          }
        }
      } else {
        for (var i = 1; i < allOverlay.length - 1; i++) {
          if (allOverlay[i].getLabel) {
            if (allOverlay[i].getLabel().content === id) {
              var light_cont = new BMap.Icon(
                "assets/js/bMap/images/camera.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont);
            }
          }
        }
      }
    },
    //选择摄像头变色
    cameraSelect2(data) {
      setTimeout(() => {
        for (var k = 0; k < data.length; k++) {
          this.cameraSelect(data[k], true);
        }
      }, 1000);
    },
    cameraSelect(data, checked) {
      var allOverlay = this.map.getOverlays();
      if (checked === true) {
        for (var i = 1; i < allOverlay.length - 1; i++) {
          if (allOverlay[i].getLabel && allOverlay[i].getLabel()) {
            if (allOverlay[i].getLabel().content === data) {
              var light_cont = new BMap.Icon(
                "assets/js/bMap/images/camera2.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont);
            }
          }
        }
      } else {
        for (var i = 1; i < allOverlay.length - 1; i++) {
          if (allOverlay[i].getLabel) {
            if (allOverlay[i].getLabel().content === data) {
              var light_cont = new BMap.Icon(
                "assets/js/bMap/images/camera.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont);
            }
          }
        }
      }
    },
    //基础数据/设备选中变色
    PointSelect(data) {
      console.log(77777777, data);
      var allOverlay = this.map.getOverlays();
      // if (this.selectPoint !== data.lat) {
      //     this.selectPoint = data.lat
      for (var i = 0; i < allOverlay.length - 1; i++) {
        if (allOverlay[i].getLabel) {
          if (
            data.pageType === "findBuilding" ||
            data.pageType === "findUnit" ||
            data.drawType === "building"
          ) {
            if (allOverlay[i].getLabel().content === data.buildingName) {
              var light_cont = new BMap.Icon(
                "assets/js/bMap/images/building2.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont);
            } else {
              var light_cont2 = new BMap.Icon(
                "assets/js/bMap/images/building.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont2);
            }
          } else if (
            data.pageType === "findEntranceAndExit" ||
            data.drawType === "entranceAndExit"
          ) {
            if (allOverlay[i].getLabel().content === data.entranceName) {
              var light_cont = new BMap.Icon(
                "assets/js/bMap/images/exit2.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont);
            } else {
              var light_cont2 = new BMap.Icon(
                "assets/js/bMap/images/exit.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont2);
            }
          } else if (
            data.pageType === "findVehicleChuck" ||
            data.drawType === "vehicleChuck"
          ) {
            if (allOverlay[i].getLabel().content === data.tollgateName) {
              var light_cont = new BMap.Icon(
                "assets/js/bMap/images/vehicle2.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont);
            } else {
              var light_cont2 = new BMap.Icon(
                "assets/js/bMap/images/vehicle.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont2);
            }
          } else if (
            data.pageType === "findCameras" ||
            data.drawType === "camera" ||
            data.pageType === "findWithCondit" ||
            data.pageType === "findWithPic"
          ) {
            console.log(9999, allOverlay[i].getLabel().content);
            console.log(9999999, data.cameraId);
            if (allOverlay[i].getLabel().content === data.cameraId) {
              var light_cont = new BMap.Icon(
                "assets/js/bMap/images/camera2.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont);
            } else {
              var light_cont2 = new BMap.Icon(
                "assets/js/bMap/images/camera.png",
                new BMap.Size(32, 32)
              );
              allOverlay[i].setIcon(light_cont2);
            }
          }
        }
      }
      // } else {
      //   this.selectPoint = data.lat
      //   for (var i = 1; i < allOverlay.length - 1; i++) {
      //     if (allOverlay[i].getLabel) {
      //       if (allOverlay[i].getLabel().content === data.buildingName) {
      //         var light_cont = new BMap.Icon(
      //           "assets/js/bMap/images/camera.png",
      //           new BMap.Size(32, 32)
      //         );
      //         allOverlay[i].setIcon(light_cont);
      //       }
      //     }
      //   }
      // }
    },
    /* *******************覆盖图层显示******************* */
    //函数防抖
    debounce(func, wait) {
      let timeout;
      return function() {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    },
    //通过判断鼠标滚轮时间，获取当前地图的mapZoom，并设置显示样式
    handleScroll(e) {
      setTimeout(() => {
        let overlays = this.map.getOverlays();
        overlays.forEach(v => {
          if (v.content) {
            let zoom = this.map.getZoom();
            if (zoom > 17) {
              v.setStyle({
                color: "darkblue",
                fontSize: "18px",
                height: "20px",
                lineHeight: "20px",
                fontFamily: "微软雅黑",
                border: "0",
                background: "transparent",
                fontWeight: "bold"
              });
            } else if (zoom > 15) {
              v.setStyle({
                color: "darkblue",
                fontSize: "14px",
                height: "20px",
                lineHeight: "20px",
                fontFamily: "微软雅黑",
                border: "0",
                background: "transparent",
                fontWeight: "bold"
              });
            } else if (zoom > 14) {
              v.setStyle({
                color: "darkblue",
                fontSize: "10px",
                height: "20px",
                lineHeight: "20px",
                fontFamily: "微软雅黑",
                border: "0",
                background: "transparent",
                fontWeight: "bold"
              });
            } else {
              v.setStyle({
                color: "darkblue",
                fontSize: "0",
                height: "20px",
                lineHeight: "20px",
                fontFamily: "微软雅黑",
                border: "0",
                background: "transparent",
                fontWeight: "bold"
              });
            }
          }
        });
      }, 310);
    },
    clearOverlays() {
      this.map.clearOverlays();
      // this.overlays = [];
      this.locationInfo.coordinate.longitude = "";
      this.locationInfo.coordinate.latitude = "";
    }
  },
  watch: {
    ParentComponentParam_map(val) {
      this.componentParams_map = val;
      this.overlays.push(this.componentParams_map.gisArea);
      this.locationInfo.coordinate.longitude = this.componentParams_map.lon;
      this.locationInfo.coordinate.latitude = this.componentParams_map.lat;
      this.locationInfo.villageName = this.componentParams_map.villageName;
      this.locationInfo.villagePicUrl = this.componentParams_map.villagePicUrl;
      this.locationInfo.drawType = this.componentParams_map.drawType;
      if (this.componentParams_map.buildingName) {
        this.tipsTitle =
          this.componentParams_map.villageName +
          "-" +
          this.componentParams_map.buildingName;
      } else {
        this.tipsTitle = this.componentParams_map.villageName;
      }
      // setTimeout(() => {
      //   this.showOverlays();
      // }, 300);
      // this.toLocation();
    }
  }
};

var lngLatEvent = function(e) {
  alert(e.point.lng + "," + e.point.lat);
};
</script>
<style lang="scss">
/* 地图父级容器 */
#MapBox {
  width: 100%;
  height: 100%;
  /*padding: 10px;*/
  position: relative;
}

/* 地图 */
.baiduMap {
  height: 99%;
  width: 100%;
  display: inline-block;
}

.location {
  height: 24px;
  line-height: 1px;
  padding: 0;
  position: absolute;
  background: rgba(45, 39, 119, 0.3);
  bottom: 3px;
  right: 0;
  z-index: 1000;
  color: #fff;
}
.location .el-input__inner {
  padding: 5px 0;
  height: 20px;
}
.location .el-button {
  padding: 3px 8px;
}

/* 去除地图上，左下字体标注 */
.anchorBL {
  display: none;
}

.search-view {
  position: absolute;
  left: 20px;
  top: 12px;
}
</style>
