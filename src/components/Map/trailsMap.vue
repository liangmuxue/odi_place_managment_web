<template>
  <div id="MapBox">
    <div class="baiduMap" id="map"></div>
  </div>
</template>


<script>
import { OneClubOneFileInfo } from "@/api/article";
// import { fetchDeviceList } from "@/api/resourceCenter";
import successmap from "../../assets/images/portrait/success-map.png";
import cameraIcon from "../../assets/images/portrait/camera1.png";
import bgPic from "../../assets/images/portrait/picBox.png";
// 初始化绘制对象
export default {
  props: ["ParentComponentParam_map"],
  name: "baiduMap",
  data() {
    return {
      tenantId: "",
      // 缩放比例
      mapZoom: 15,
      // 地图
      map: null,
      // 测距
      distanceTool: null,
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
    this.tenantId = this.$store.getters.tenantId;

    this.initBaiduMap();
    this.getLngLat();
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

  created() {},
  updated() {
    if (this.locationInfo.drawType === "realTimeMonitoring") {
      this.getRealTimeMonitoring();
    } else if (this.locationInfo.drawType === "distributandwarning") {
      this.getRealTimeMonitoring();
    } else if (this.locationInfo.drawType === "findCameras") {
      this.getRealTimeMonitoring();
    } else if (this.locationInfo.drawType === "findBuilding") {
    } else if (this.locationInfo.drawType === "findUnit") {
    } else if (this.locationInfo.drawType === "findEntranceAndExit") {
    } else if (this.locationInfo.drawType === "findVehicleChuck") {
    }

    // if ((this.locationInfo.drawType = "village")) {
    //   this.mapZoom = 16;
    // } else {
    //   this.mapZoom = 17;
    // }
    // this.initBaiduMap();
    // this.showOverlays();
    // this.toLocation();
  },

  methods: {
    /**
     * 初始化地图
     */
    initBaiduMap() {
      this.map = new BMap.Map("map", {
        minZoom: 3,
        maxZoom: 18
      });

      var point = new BMap.Point(121.534528, 38.865049); // 创建点坐标
      this.map.centerAndZoom(point, this.mapZoom); // 初始化地图，设置中心点坐标和地图级别
      this.map.setMapStyle({ style: "" });
      this.map.enableScrollWheelZoom(); //获取缩放等级,这里没什么用写着玩的;
      this.map.setCurrentCity("大连"); // 设置地图显示的城市 此项是必须设置的

      // // // 创建小车图标
      // var myIcon = new BMap.Icon(successmap, new BMap.Size(26, 36));
      // // // 创建小车图标
      // // var pt = new BMap.Point(121.534528, 38.865049)
      // // var marker =  new BMap.Marker(pt,{icon:myIcon})

      // var marker1 = new BMap.Marker(new BMap.Point(121.506285,38.85412), {
      //   icon: myIcon
      // });
      // var marker2 = new BMap.Marker(new BMap.Point(121.518502,38.871033), {
      //   icon: myIcon
      // });
      // var marker3 = new BMap.Marker(new BMap.Point(121.533306,38.859571), {
      //   icon: myIcon
      // });
      // this.map.addOverlay(marker1);
      // this.map.addOverlay(marker2);
      // this.map.addOverlay(marker3);

      //  //绘制箭头及其样式
      // var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
      //   scale: 0.6,//图标缩放大小
      //   strokeColor:'#fff',//设置矢量图标的线填充颜色
      //   strokeWeight: 2,//设置线宽
      // });

      // var icons = new BMap.IconSequence(sy, '100%', '10%',false);//设置为true，可以对轨迹进行编辑

      // var polyline = new BMap.Polyline(
      //   [
      //     new BMap.Point(121.506285,38.85412),
      //     new BMap.Point(121.518502,38.871033),
      //     new BMap.Point(121.533306,38.859571)
      //   ],
      //   {   strokeColor:"#18a45b",//设置颜色
      //           strokeWeight:6 ,//宽度
      //           strokeOpacity:0.8,//折线的透明度，取值范围0 - 1
      //           enableEditing: false,//是否启用线编辑，默认为false
      //           enableClicking: false,//是否响应点击事件，默认为true
      //           icons:[icons]}
      // );
      // this.map.addOverlay(polyline);

      // // 创建信息窗口
      // var opts = {
      //     width: 200,
      //     height: 50,
      //     title: ''
      // };
      // var infoWindow = new BMap.InfoWindow('我就是这条该最亮的崽', opts);
      // // 点标记添加点击事件
      // marker1.addEventListener('click', function () {
      //     this.map.openInfoWindow(infoWindow, new BMap.Point(121.506285,38.85412)); // 开启信息窗口
      // });
      // marker2.addEventListener('click', function () {
      //     this.map.openInfoWindow(infoWindow,  new BMap.Point(121.518502,38.871033)); // 开启信息窗口
      // });
      // marker3.addEventListener('click', function () {
      //     this.map.openInfoWindow(infoWindow, new BMap.Point(121.533306,38.859571)); // 开启信息窗口
      // });
    },
    //显示同行人员地图
    getPeer(arr) {
      var that = this;
      //先清除原有绘制
      that.map.clearOverlays();

      // // 创建小车图标
      var myIcon = new BMap.Icon(cameraIcon, new BMap.Size(26, 36));
      arr.forEach(el => {
        var marker = new BMap.Marker(new BMap.Point(el.lon, el.lat), {
          icon: myIcon
        });
        that.map.addOverlay(marker);
        var sContent =
          `<div id='picCard' style="width:70px;height:92px;position: relative;cursor: pointer; @click='showDetails'">
          <img class='pic_bg' style='width:70px;height:92px' src='./assets/images/picBox.png'/ width='70' height='92'>
          <img class='pic_people' style='width:42px;height:56px' src='` +
          el.peopleWithCapUrl +
          `'/ width='42' height='56'>
          <div class='cameraName'  style="width:70px;height:92px;">` +
          el.cameraName +
          `</div>
          <div class='second' style="width:70px;height:92px;">` +
          el.childs.length +
          `</div>
          </div>`;
        var infoWindow = new BMap.InfoWindow(sContent);
        that.map.openInfoWindow(infoWindow, new BMap.Point(el.lon, el.lat)); // 开启信息窗口
        if (!infoWindow.isOpen()) {
          infoWindow.addEventListener("open", function(e) {
            document.getElementById("picCard").onclick = function() {
              that.showDetails(el);
            };
          });
        } else {
          var card = document.getElementById("picCard");
          card.onclick = function() {
            that.showDetails(el);
          };
        }
        // 点标记添加点击事件
      });
    },
    showDetails(el) {
      this.$emit("showDetails", el);
    },
    /**
     * 改变地图类型
     */
    changeMapType(mapType = BMAP_NORMAL_MAP) {
      this.map.setMapType(mapType);
    },
    /**
     * 开启测距
     */
    openDistanceTool() {
      this.distanceTool = new BMapLib.DistanceTool(this.map);
      this.distanceTool.open();
    },
    /**
     * 退出测距
     */
    closeDistanceTool() {
      this.distanceTool.close();
    },

    //判断选择分页
    selectPage(list) {
      this.$nextTick(() => {
        if (this.locationInfo.drawType === "realTimeMonitoring") {
          this.getRealTimeMonitoring();
        } else if (this.locationInfo.drawType === "distributandwarning") {
          this.getRealTimeMonitoring();
        } else if (
          this.locationInfo.drawType === "findCameras" ||
          this.locationInfo.drawType === "camera" ||
          this.locationInfo.drawType === "findWithCondit" ||
          this.locationInfo.drawType === "findWithPic"
        ) {
          this.getRealTimeMonitoring();
        } else if (
          this.locationInfo.drawType === "findBuilding" ||
          this.locationInfo.drawType === "building"
        ) {
          this.realTimeMonitoringList = list;
          this.showOverlays_camera();
        } else if (this.locationInfo.drawType === "findUnit") {
          this.realTimeMonitoringList = list;
          this.showOverlays_camera();
        } else if (
          this.locationInfo.drawType === "findEntranceAndExit" ||
          this.locationInfo.drawType === "entranceAndExit"
        ) {
          this.realTimeMonitoringList = list;
          this.showOverlays_camera();
        } else if (
          this.locationInfo.drawType === "findVehicleChuck" ||
          this.locationInfo.drawType === "vehicleChuck"
        ) {
          this.realTimeMonitoringList = list;
          this.showOverlays_camera();
        }
      });
    },
    //是否获取
    isGetRealTimeMonitoring() {},
    //获取设备信息
    getRealTimeMonitoring() {
      this.listQuery.userIds = this.$store.getters.userId;
      fetchDeviceList(this.listQuery).then(response => {
        this.realTimeMonitoringList = response.data.datas;
        for (let i = 0; i < this.realTimeMonitoringList.length; i++) {
          this.realTimeMonitoringList[i].checked = true;
          this.pointList.push(
            this.realTimeMonitoringList[i].lon +
              "," +
              this.realTimeMonitoringList[i].lat
          );
        }
        this.showOverlays_camera();
      });
    },
    //获取小区数据
    getList() {
      this.listQuery.userIds = this.$store.getters.userId;
      // if (this.listQuery.regionCodes) {
      //   this.listQuery.regionCodes = "2102";
      // }
      this.listQuery.regionCodes = "2102";

      OneClubOneFileInfo(this.listQuery, this.tenantId).then(response => {
        this.list = response.data.datas;
        this.overlays = [];
        this.overlays_info = [];
        for (let i = 0; i < this.list.length; i++) {
          this.overlays.push(this.list[i].gisArea);
          this.overlays_info.push({
            gisCenter: this.list[i].gisCenter,
            lat: this.list[i].lat,
            lon: this.list[i].lon,
            villageName: this.list[i].villageName,
            villageCode: this.list[i].villageCode,
            peopleCount: this.list[i].peopleCount,
            houseCount: this.list[i].houseCount,
            vehicleCount: this.list[i].vehicleCount,
            address: this.list[i].address
          });
        }
        this.showOverlays();
        this.listQuery.total = response.data.totalRows;
      });
      this.initBaiduMap();
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
        this.map.addOverlay(dingwei_marker); // 将标注添加到地图中
        setTimeout(() => {
          this.map.removeOverlay(dingwei_marker);
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
    selectToLocation(longitude, latitude) {
      var new_point = new BMap.Point(longitude, latitude);
      // var myIcon = new BMap.Icon("assets/js/bMap/images/quanjing.png",new BMap.Size(30, 30));
      // var marker = new BMap.Marker(new_point,{icon:myIcon}); // 创建标注
      var dingwei_marker = new BMap.Marker(new_point); // 创建标注
      this.map.addOverlay(dingwei_marker); // 将标注添加到地图中
      setTimeout(() => {
        this.map.removeOverlay(dingwei_marker);
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
    showOverlays_camera() {
      let nowType = "";
      if (nowType !== this.locationInfo.drawType) {
        this.map.clearOverlays();
        nowType = this.locationInfo.drawType;
      }
      /* *********显示摄像头********* */
      if (this.realTimeMonitoringList) {
        var realTimeMonitoring_opts = {
          width: 120, // 信息窗口宽度
          height: 60, // 信息窗口高度
          title: "摄像头信息" // 信息窗口标题
          // enableMessage: true //设置允许信息窗发送短息
        };
        for (let i = 0; i < this.realTimeMonitoringList.length; i++) {
          var realTimeMonitorin_point = new BMap.Point(
            this.realTimeMonitoringList[i].lon,
            this.realTimeMonitoringList[i].lat
          );
          var labelText = this.realTimeMonitoringList[i].cameraId;
          var realTimeMonitoring_content = this.realTimeMonitoringList[i]
            .cameraName;
          var myIcon = new BMap.Icon(
            "assets/js/bMap/images/camera.png",
            new BMap.Size(32, 32)
          );
          if (
            this.locationInfo.drawType === "findBuilding" ||
            this.locationInfo.drawType === "building"
          ) {
            myIcon = new BMap.Icon(
              "assets/js/bMap/images/building.png",
              new BMap.Size(32, 32)
            );
            labelText = this.realTimeMonitoringList[i].buildingName;
            realTimeMonitoring_content =
              "<b>" +
              "小区名称：" +
              "</b>" +
              this.realTimeMonitoringList[i].villageName +
              "<br/>" +
              "<b>" +
              "楼栋名称：" +
              "</b>" +
              this.realTimeMonitoringList[i].buildingName +
              "<br/>" +
              "<b>" +
              "住户数：" +
              "</b>" +
              (this.realTimeMonitoringList[i].houseNum === null
                ? 0
                : this.realTimeMonitoringList[i].houseNum);
          } else if (this.locationInfo.drawType === "findUnit") {
            myIcon = new BMap.Icon(
              "assets/js/bMap/images/building.png",
              new BMap.Size(32, 32)
            );
            labelText = this.realTimeMonitoringList[i].buildingName;
            realTimeMonitoring_content =
              "<b>" +
              "小区名称：" +
              "</b>" +
              this.realTimeMonitoringList[i].villageName +
              "<br/>" +
              "<b>" +
              "楼栋名称：" +
              "</b>" +
              this.realTimeMonitoringList[i].buildingName +
              "<br/>" +
              "<b>" +
              "单元数：" +
              "</b>" +
              (this.realTimeMonitoringList[i].units === null
                ? 0
                : this.realTimeMonitoringList[i].units) +
              "<br/>" +
              "<b>" +
              "住户数：" +
              "</b>" +
              (this.realTimeMonitoringList[i].houseNum === null
                ? 0
                : this.realTimeMonitoringList[i].houseNum);
          } else if (
            this.locationInfo.drawType === "findEntranceAndExit" ||
            this.locationInfo.drawType === "entranceAndExit"
          ) {
            myIcon = new BMap.Icon(
              "assets/js/bMap/images/exit.png",
              new BMap.Size(32, 32)
            );
            labelText = this.realTimeMonitoringList[i].entranceName;
            realTimeMonitoring_content =
              "<b>" +
              "小区名称：" +
              "</b>" +
              this.realTimeMonitoringList[i].villageName +
              "<br/>" +
              "<b>" +
              "出入口名称：" +
              "</b>" +
              this.realTimeMonitoringList[i].entranceName;
          } else if (
            this.locationInfo.drawType === "findVehicleChuck" ||
            this.locationInfo.drawType === "vehicleChuck"
          ) {
            myIcon = new BMap.Icon(
              "assets/js/bMap/images/vehicle.png",
              new BMap.Size(32, 32)
            );
            labelText = this.realTimeMonitoringList[i].tollgateName;
            realTimeMonitoring_content =
              "<b>" +
              "小区名称：" +
              "</b>" +
              this.realTimeMonitoringList[i].villageName +
              "<br/>" +
              "<b>" +
              "车辆卡口名称：" +
              "</b>" +
              this.realTimeMonitoringList[i].tollgateName;
          }
          var realTimeMonitoring_marker = new BMap.Marker(
            realTimeMonitorin_point,
            { icon: myIcon }
          ); // 创建标注
          if (
            this.ParentComponentParam_map.drawType === "carmea" ||
            this.ParentComponentParam_map.drawType === "building" ||
            this.ParentComponentParam_map.drawType === "entranceAndExit" ||
            this.ParentComponentParam_map.drawType === "vehicleChuck" ||
            this.ParentComponentParam_map.drawType === "village"
          ) {
            realTimeMonitoring_marker.disableMassClear();
          }
          realTimeMonitoring_marker.setZIndex(1001);

          var realTimeMonitoring_opts = {
            position: realTimeMonitorin_point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-1, 0) //设置文本偏移量
          };
          var realTimeMonitoring_label = new BMap.Label(
            labelText,
            realTimeMonitoring_opts
          ); //创建marker点的标记,这里注意下,因为百度地图可以对label样式做编辑,所以我这里把重要的id放在了label(然后再隐藏)
          realTimeMonitoring_label.setStyle({ display: "none" }); //对label 样式隐藏
          realTimeMonitoring_marker.setLabel(realTimeMonitoring_label);

          var realTimeMonitoring_id = labelText;
          this.map.addOverlay(realTimeMonitoring_marker); // 将标注添加到地图中
          // data["chargerMarker"]=realTimeMonitoring_marker
          addClickHandler(
            realTimeMonitoring_content,
            realTimeMonitoring_marker,
            realTimeMonitoring_id
          );
        }
        //打开摄像机
        let openCamera1 = realTimeMonitoring_id => {
          if (this.componentParams_map.drawType === "realTimeMonitoring") {
            this.$emit("openCamera", realTimeMonitoring_id);
          } else if (
            this.componentParams_map.drawType === "distributandwarning"
          ) {
            var camera = this.listQuery;
            var cameraTo = {};

            for (var j = 0; j < this.realTimeMonitoringList.length; j++) {
              if (
                this.realTimeMonitoringList[j].cameraId ===
                realTimeMonitoring_id
              ) {
                this.$emit("selectCamera", this.realTimeMonitoringList[j]);
                camera.villageName = this.realTimeMonitoringList[j].villageName;
                OneClubOneFileInfo(camera, this.tenantId).then(response => {
                  cameraTo = response.data.datas;
                  this.$emit("selectVillageTree", cameraTo[0]);
                  var allOverlay = this.map.getOverlays();
                  for (var i = 1; i < allOverlay.length - 1; i++) {
                    if (allOverlay[i].ja) {
                      if (
                        allOverlay[i - 1].point.lat == cameraTo[0].lat &&
                        allOverlay[i - 1].point.lng == cameraTo[0].lon
                      ) {
                        allOverlay[i].setStrokeColor("green");
                        allOverlay[i].setFillColor("green");
                      } else {
                        allOverlay[i].setStrokeColor("blue");
                        allOverlay[i].setFillColor("blue");
                      }
                    }
                  }
                });
              }
            }
          } else if (
            this.componentParams_map.drawType === "findBuilding" ||
            this.componentParams_map.drawType === "findUnit" ||
            this.componentParams_map.drawType === "findEntranceAndExit" ||
            this.componentParams_map.drawType === "findVehicleChuck" ||
            this.componentParams_map.drawType === "findCameras" ||
            this.componentParams_map.drawType === "findWithCondit" ||
            this.componentParams_map.drawType === "findWithPic"
          ) {
            // this.$emit("openCamera", realTimeMonitoring_id);
            var building = this.listQuery;
            var buildingTo = {};
            for (var j = 0; j < this.realTimeMonitoringList.length; j++) {
              if (
                this.realTimeMonitoringList[j].buildingName ===
                  realTimeMonitoring_id ||
                this.realTimeMonitoringList[j].entranceName ===
                  realTimeMonitoring_id ||
                this.realTimeMonitoringList[j].tollgateName ===
                  realTimeMonitoring_id ||
                this.realTimeMonitoringList[j].cameraId ===
                  realTimeMonitoring_id
              ) {
                this.realTimeMonitoringList[
                  j
                ].pageType = this.componentParams_map.drawType;
                this.$emit("selectPoint", this.realTimeMonitoringList[j]);
                building.villageName = this.realTimeMonitoringList[
                  j
                ].villageName;
                OneClubOneFileInfo(building, this.tenantId).then(response => {
                  buildingTo = response.data.datas;
                  this.$emit("selectVillageTree", buildingTo[0]);
                  var allOverlay = this.map.getOverlays();
                  for (var i = 1; i < allOverlay.length - 1; i++) {
                    if (allOverlay[i].ja) {
                      if (
                        allOverlay[i - 1].point.lat == buildingTo[0].lat &&
                        allOverlay[i - 1].point.lng == buildingTo[0].lon
                      ) {
                        allOverlay[i].setStrokeColor("green");
                        allOverlay[i].setFillColor("green");
                      } else {
                        allOverlay[i].setStrokeColor("blue");
                        allOverlay[i].setFillColor("blue");
                      }
                    }
                  }
                });
              }
            }
          } else if (this.componentParams_map.drawType === "findCameras") {
          }
        };
        function addClickHandler(
          realTimeMonitoring_content,
          realTimeMonitoring_marker,
          realTimeMonitoring_id
        ) {
          realTimeMonitoring_marker.addEventListener("click", function(e) {
            openCamera1(realTimeMonitoring_id);
          });
          realTimeMonitoring_marker.addEventListener("mouseover", function(e) {
            var realTimeMonitoring_p = e.target;
            var realTimeMonitoring_point = new BMap.Point(
              realTimeMonitoring_p.getPosition().lng,
              realTimeMonitoring_p.getPosition().lat
            );
            var infoWindow = new BMap.InfoWindow(
              realTimeMonitoring_content,
              realTimeMonitoring_opts
            ); // 创建信息窗口对象
            this.map.openInfoWindow(infoWindow, realTimeMonitoring_point); //开启信息窗口
          });
          realTimeMonitoring_marker.addEventListener("mouseout", function(e) {
            this.map.closeInfoWindow(); //关闭信息窗口
          });
        }

        this.map.addOverlay(realTimeMonitoring_marker); //增加点
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
    addPolygon(pointArr, polygonINfo) {
      //添加多边形

      var polygon = new BMap.Polygon(pointArr, {
        strokeColor: "blue",
        fillColor: "blue",
        strokeWeight: 1,
        strokeOpacity: 0.8,
        fillOpacity: 0.1,
        strokeStyle: "dashed"
      }); //创建多边形
      polygon.disableMassClear();
      var content = polygonINfo.villageName;
      var gisCenter = polygonINfo.gisCenter.split(",");
      var new_point = new BMap.Point(gisCenter[1], gisCenter[0]);

      // this.map.panTo(new_point);

      // var marker = new BMap.Marker(new_point); // 创建标注
      // this.map.addOverlay(marker);
      // var label = new BMap.Label(polygonINfo.villageName, {
      //   offset: new BMap.Size(20, -10)
      // });
      // marker.setLabel(label);

      var opts = {
        position: new_point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(-40, 0) //设置文本偏移量
      };
      var label = new BMap.Label(polygonINfo.villageName, opts); // 创建文本标注对象
      // let mapZoomNow = this.map.enableScrollWheelZoom()

      if (this.mapZoom > 17) {
        label.setStyle({
          color: "darkblue",
          fontSize: "16px",
          height: "20px",
          lineHeight: "20px",
          fontFamily: "微软雅黑",
          border: "0",
          background: "transparent",
          fontWeight: "bold"
        });
      } else if (this.mapZoom > 15) {
        label.setStyle({
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
        label.setStyle({
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
      this.map.addOverlay(label);
      label.disableMassClear();
      // 添加信息窗口
      var opts = {
        width: 132, // 信息窗口宽度
        height: 132, // 信息窗口高度
        title:
          "<b style='font-size:18px;line-height:24px'>" +
          polygonINfo.villageName +
          "</b>" // 信息窗口标题
      };
      var infoWindow = new BMap.InfoWindow(
        "<b>" +
          "社区地址：" +
          "</b>" +
          polygonINfo.address +
          "<br/>" +
          "<b>" +
          "登记人口：" +
          "</b>" +
          polygonINfo.peopleCount +
          "<br/>" +
          "<b>" +
          "登记房屋：" +
          "</b>" +
          polygonINfo.houseCount +
          "<br/>" +
          "<b>" +
          "登记车辆：" +
          "</b>" +
          polygonINfo.vehicleCount +
          "<br/>" +
          "<b>" +
          "定位坐标：" +
          "</b>" +
          polygonINfo.gisCenter,
        opts
      ); // 创建信息窗口对象
      var me = this;
      polygon.addEventListener("click", function() {
        var allOverlay = this.map.getOverlays();
        for (var i = 1; i < allOverlay.length - 1; i++) {
          if (allOverlay[i].ja) {
            if (allOverlay[i] === this) {
              allOverlay[i].setStrokeColor("green");
              allOverlay[i].setFillColor("green");
            } else {
              allOverlay[i].setStrokeColor("blue");
              allOverlay[i].setFillColor("blue");
            }
          }
        }
        me.map.openInfoWindow(infoWindow, new_point); //开启信息窗口
        me.$emit("selectVillageTree", polygonINfo);
      });
      // polygon.addEventListener("mouseover", function() {
      //   this.map.openInfoWindow(infoWindow, new_point); //开启信息窗口
      // });
      // polygon.addEventListener("mouseout", function() {
      //   this.map.closeInfoWindow(); //关闭信息窗口
      // });

      this.polygon = polygon;
      this.map.addOverlay(polygon); //增加多边形
      // map.addOverlay(rectangle); //增加矩形
    },
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
  // alert(e.point.lng + "," + e.point.lat);
};
</script>
<style>
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

/*地图标题*/
.BMap_bubble_title {
  color: white;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  padding-left: 5px;
  padding-top: 5px;
  border-bottom: 1px solid gray;
  background-color: #0066b3;
}
/* 消息内容 */
.BMap_bubble_content {
  background-color: transparent;
  /* padding-top: 142px; */
  padding-bottom: 10px;
}
/* 内容 */
.BMap_pop div:nth-child(9) {
  top: 45px !important;
  left: 75px !important;
  width: 70px !important;
  height: 92px !important;
  border-radius: 7px;
}
/* 左上角删除按键 */
.BMap_pop img {
  display: none;
}
.BMap_pop .pic_bg {
  display: block;
}
.BMap_pop .pic_people {
  display: block;
  position: absolute;
  top: 10px;
  left: 15px;
  z-index: 1;
}
.BMap_top {
  display: none;
}
.BMap_bottom {
  display: none;
}
.BMap_center {
  display: none;
}
/* 隐藏边角 */
.BMap_pop div:nth-child(1) div {
  display: none;
}
.BMap_pop div:nth-child(3) {
  display: none;
}
.BMap_pop div:nth-child(7) {
  display: none;
}
.BMap_pop div:nth-child(5) {
  display: none;
}
.BMap_shadow {
  display: none;
}
.BMap_pop .cameraName {
  display: block !important;
  position: absolute;
  top: 70px;
  left: 12px;
  width: 49px !important;
  height: 16px !important;
  z-index: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
  color: #b30000;
}
.BMap_pop .second {
  display: block !important;
  position: absolute;
  top: 3px;
  left: 52px;
  width: 18px !important;
  height: 18px !important;
  line-height: 18px;
  text-align: center;
  border-radius: 9px;
  background: #0edb53;
  color: #fff;
  font-size: 12px;
  z-index: 2;
}

.right-tool-bar {
  height: 100%;
  width: 18%;
  display: inline-block;
  float: right;
}
.tool-unit {
  font-size: 12px;
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
.btn {
  font-size: 12px;
}
.btn:hover {
  cursor: pointer;
}

/* 去除地图上，左下字体标注 */
.anchorBL {
  display: none;
}

.btn.on {
  background: skyblue;
  color: #fff;
  background: darkblue;
}
</style>
