<template>
  <div class="openlayersBox">
    <div class="map" id="map"></div>
    <div id="popup" ref="popup" class="ol-popup">
      <div class="popup-content">
        <div v-if="selectedFeature && selectedFeature.N.status == 2">
          <div class="popup-content-text">
            泊位号：{{ selectedFeature.get("name") }}
          </div>
          <div class="popup-content-text">
            状态：占用
          </div>
          <div class="popup-content-text">
            车牌号：{{ selectedFeature.get("plateNumber") }}
          </div>
          <div class="popup-content-text">
            入场时间：{{
              selectedFeature.get("time") | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}
          </div>
          <div class="popup-content-text">
            车主手机：{{ selectedFeature.get("phone") }}
          </div>
        </div>
        <div class="popup-content-bottom"></div>
      </div>
    </div>
    <div id="popup2" ref="popup2" class="ol-popup2">
      <div class="newCar-content2-top" v-if="newCarDate">
        {{ newCarDate.plateNumber }} 车辆已入场!
      </div>
      <div class="newCar-content2" v-if="newCarDate">
        <div class="newCar-content-left">
          <img
            :src="newCarDate.smallImg"
            alt=""
            class="newCar-content-left-img"
          />
        </div>
        <div class="newCar-content-right">
          <div class="popup-content-text">
            {{ newCarDate.deviceName }}
          </div>
          <div class="popup-content-text">已预约泊位 {{ reservationId }}</div>
        </div>
        <div class="newCar-content-bottom"></div>
      </div>
    </div>
  </div>
</template>
<script>
import * as ol from "openlayers";
import {
  licensePlate //路上的车辆信息
} from "@/api/homePage";

export default {
  name: "OpenlayersMap",
  props: {
    curMap: {
      type: String
    },
    baseWidth: {
      type: Number
    },
    pageType: {
      type: Number
    },
    baseHeight: {
      type: Number
    }
  },
  data() {
    return {
      map: null,
      idleColor: "#33cc33", //空闲颜色
      reservationColor: "#FFA409", //预约颜色
      occupyColor: "#F50A0A", //占用颜色
      faultColor: "#666666", //故障颜色
      dynamicsColor: "#499EFB", //动态颜色
      selColor: "499efb",
      pointsSource: new ol.source.Vector(),
      dailogSource: new ol.source.Vector(),
      initialResolution: null, //
      polygonsSource: new ol.source.Vector(),
      curZoom: 1,
      iconCache: {}, // 缓存图标实例
      selectedFeature: null,
      newCarFeature: null,
      newCarDate: {
        smallImg:
          "https://jizhi-pay.ss-cas.com:4433/hiCar/profile/upload/2025-05-19/null_1747642759677_8_small.jpg",
        plateNumber: "辽B2JL55",
        deviceName: "北入口摄像头"
      },
      entryTime: null,
      reservationId: null,
      popupOverlay: null,
      layerList: [],
      carList: [
        {
          id: 1,
          vehicle: "辽B12345",
          course: 45,
          x: 215,
          y: 338,
          type: 3
        }
      ]
    };
  },
  mounted() {
    // 生成地图
    this.initMap();
  },
  methods: {
    //新车入场
    newCar(coordinate) {
      // console.log("坐标", coordinate);
      let newC = {
        id: 5,
        vehicle: "辽B11100",
        course: 270,
        userPoint: { x: coordinate[0], y: this.baseHeight - coordinate[1] },
        type: 6
      };
      const features = [];
      this.carList.push(newC);
      const newFeature = this.createPointFeature(newC);
      newFeature.setId(newC.id);
      features.push(newFeature);
      this.pointsSource.clear(true);
      this.pointsSource.addFeatures(features);
      this.$emit("addPoint", coordinate);
    },
    initMap() {
      // //地图容器
      // 影像范围，从左上角到右下角的最大坐标
      let that = this;
      const extent = [0, 0, this.baseWidth, this.baseHeight];
      // 自定义影像投影，将图片坐标映射到地图坐标，使用像素作为单位，投影范围为影像范围。
      const imageProjection = new ol.proj.Projection({
        code: "world-iamge",
        units: "pixel",
        extent: extent
      });

      // 定义静态影像数据源
      const staticImageSource = new ol.source.ImageStatic({
        // url: this.curMap,
        url:
          "https://jizhi-pay.ss-cas.com:4433/hiCar/profile/upload/2025/06/05/%E6%B5%B7%E5%A4%96%E5%AD%A6%E5%AD%90%E5%9B%AD%E5%81%9C%E8%BD%A6%E5%B9%B3%E9%9D%A2%E5%9B%BE-%E5%8E%8B%E7%BC%A9_20250509141452A004_20250605104943A001.jpg",
        projection: imageProjection,
        imageExtent: extent
      });
      // 定义影像图层
      const staticImageLayer = new ol.layer.Image({
        source: staticImageSource
      });
      this.map = new ol.Map({
        target: "map",
        loadTilesWhileInteracting: true,
        view: new ol.View({
          // 获取影像中心
          center: ol.extent.getCenter(extent),
          zoom: 1,
          maxZoom: 8,
          mimZoom: 1,
          // 使用自定义影像投影
          projection: imageProjection
        }),
        layers: [
          staticImageLayer,
          new ol.layer.Vector({
            zIndex: 5, // 初始层级设置为5
            source: this.polygonsSource,
            style: this.polygonStyle
          }),
          new ol.layer.Vector({
            zIndex: 4, // 初始层级设置为4
            source: this.pointsSource,
            style: (feature, resolution) =>
              this.pointStyleFunction(feature, resolution)
          }),
          new ol.layer.Vector({
            zIndex: 6, // 初始层级设置为4
            source: this.dailogSource,
            style: (feature, resolution) =>
              this.pointStyleFunction(feature, resolution)
          })
        ],
        // 地图默认控件
        controls: ol.control.defaults({
          zoom: false,
          attribution: false,
          rotate: false
        })
      });

      this.popupOverlay = new ol.Overlay({
        element: this.$refs.popup,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });
      this.map.addOverlay(this.popupOverlay);
      this.popupOverlay2 = new ol.Overlay({
        element: this.$refs.popup2,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });
      this.map.addOverlay(this.popupOverlay2);
      // 3. 添加单击事件监听器
      this.map.on("click", function(event) {
        // 获取点击坐标（地图投影坐标系）
        const coordinate = event.coordinate;
        if (that.pageType != 3) {
          that.newCar(coordinate);
        }
      });
    },
    // 点要素样式函数
    pointStyleFunction(feature, resolution) {
      const id = feature.get("id");
      const type = feature.get("type");
      const course = feature.get("course");
      return new ol.style.Style({
        image: this.getIcon(id, type, course + 90, resolution)
      });
    },
    getIcon(id, type, course, resolution) {
      const key = "p" + id;
      const baseScale = 2; // 基础缩放比例
      const zoom = this.map.getView().getZoom();
      const scale = baseScale * Math.pow(2, zoom - 6); // 根据缩放级别调整比例
      let icoSrc = "./car" + type + ".png";
      this.iconCache[key] = new ol.style.Icon({
        src: icoSrc, // 图标路径根据type动态获取
        // src: "../../assets/images/car2.png", // 图标路径
        scale: scale,
        anchor: [0.5, 0.5], // 图标中心锚点
        rotation: (course * Math.PI) / 180, // 转换为弧度
        rotateWithView: true // 随地图旋转
      });
      // }
      return this.iconCache[key];
    },
    getTrueCar(number) {
      let correctStr = "辽B2JL55";
      let isTrue = false;
      if (number.length !== 7 || correctStr.length !== 7) return false;
      let correctCount = 0;
      for (let i = 0; i < 7; i++) {
        if (number[i] === correctStr[i]) correctCount++;
      }
      if (correctCount > 5) {
        isTrue = true;
      }
      return isTrue;
    },
    //生成汽车位置
    getCarLoation(cars) {
      if (cars && cars.length) {
        this.carList = cars;

        let newCar = null;
        cars.forEach(el => {
          if (el.id) {
            let isTrue = this.getTrueCar(el.plateNumber);
            if (isTrue) {
              newCar = el;
              newCar.plateNumber = "辽B2JL55";
              let para = { plateNumber: "辽B2JL55" };
              licensePlate(para).then(response => {
                this.entryTime = response.data.createTime;
              });
            }
          }
          // if (el.id && el.plateNumber == "辽B2JL55") {
          //   newCar = el;
          // }
        });
        if (newCar) {
          // console.log("测试车辆", newCar);
          // if (newCar.id) {
          let userPoint = [
            newCar.userPoint.x,
            this.baseHeight - newCar.userPoint.y
          ];
          this.newCarDate = newCar;
          this.popupOverlay2.setPosition(userPoint);
        } else {
          this.newCarDate = null;
          this.popupOverlay2.setPosition(undefined);
        }
        // let newCar = cars[0];
      } else {
        this.carList = [];
      }
      if (this.retentionCarList && this.retentionCarList.length) {
        this.carList = [...cars, ...this.retentionCarList];
        this.retentionCar();
      }
      const features = [];
      this.carList.forEach((el, i) => {
        const feature = this.createPointFeature(el, i);
        let id;
        if (el.id) {
          id = "p" + el.id;
        } else {
          id = "c" + i;
        }
        feature.setId(id);
        features.push(feature);
      });
      this.pointsSource.clear(true);
      this.pointsSource.addFeatures(features);
    },
    // 创建汽车点位
    createPointFeature(item, i) {
      let p = item.userPoint;
      let carx;
      let cary;
      if (p.x && p.x != "NaN") {
        carx = Math.round(p.x);
      } else {
        carx = 1717;
      }

      if (p.y && p.y != "NaN") {
        cary = Math.round(this.baseHeight - p.y);
      } else {
        cary = this.baseHeight - 271;
      }
      const feature = new ol.Feature({
        geometry: new ol.geom.Point([carx, cary])
      });

      let id;
      if (item.id) {
        id = "p" + item.id;
      } else {
        id = "c" + i;
      }
      let type = item.type || 3;
      let course = item.course || 90;
      if (item.course) {
        course = item.course;
      } else if (item.course === 0) {
        course = item.course;
      } else {
        course = 90;
      }

      feature.set("id", id);
      feature.set("type", type);
      feature.set("course", course);
      // console.log("汽车", feature);
      return feature;
    }
  }
};
</script>
<style scoped>
.openlayersBox {
  /* width: calc(100vw - 750px);
  height: calc(100vh - 300px); */
  width: 100%;
  height: 100%;
  border: 1px solid #999;
  border-radius: 5px;
}
.map {
  /* width: calc(100vw - 750px);
  height: calc(100vh - 300px); */
  width: 100%;
  height: 100%;
}
.ol-popup {
  position: absolute;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3);
  width: 200px;
  height: 120px;
  margin-top: -150px;
  margin-left: -100px;
}
.popup-content-text {
  font-size: 12px;
  height: 20px;
  line-height: 20px;
}
.control-panel {
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 1000;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.popup-content-bottom {
  position: absolute;
  bottom: -15px;
  left: 90px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid #fff;
  /* background-color: #499efb; */
  /* box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3); */
}

.ol-popup2 {
  position: absolute;
  background-color: #fff;
  color: #333;
  border-radius: 5px;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3);
  width: 280px;
  height: 130px;
  margin-left: -140px;
  margin-top: -154px;
  border-radius: 20px;
}
.newCar-content2-top {
  height: 36px;
  line-height: 36px;
  font-size: 20px;
  font-weight: bold;
  background: #037659;
  color: #fff;
  text-align: center;
  border-radius: 20px 20px 0 0;
}
.newCar-content2 {
  display: flex;
}
.newCar-content-left {
  width: 90px;
  height: 90px;
  background: #fff;
  padding: 10px;
}
.newCar-content-left-img {
  width: 70px;
  height: 70px;
}
.newCar-content-right {
  margin-left: 10px;
}
.newCar-content-right .popup-content-text {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
.newCar-content-bottom {
  position: absolute;
  bottom: -15px;
  left: 130px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid #fff;
  /* background-color: #499efb; */
  /* box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3); */
}
</style>
