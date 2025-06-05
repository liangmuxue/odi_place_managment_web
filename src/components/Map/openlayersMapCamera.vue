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
      curZoom: 2,
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
      retentionCarList: [
        // {
        //   id: 5,
        //   vehicle: "辽B2JL55",
        //   course: 270,
        //   userPoint: { x: 2270, y: 1120 },
        //   type: 3
        // }
      ], //滞留车辆列表
      parallelograms: [
        // {
        //   id: 1,
        //   name: "车位1",
        //   status: 2,
        //   plateNumber: "辽B12345",
        //   time: "2025-4-25 20:25:00",
        //   phone: "13812341234",
        //   pointList: [
        //     {
        //       x: 214,
        //       y: 562
        //     },
        //     {
        //       x: 228,
        //       y: 548
        //     },
        //     {
        //       x: 195,
        //       y: 514
        //     },
        //     {
        //       x: 181,
        //       y: 528
        //     },
        //     {
        //       x: 214,
        //       y: 562
        //     }
        //   ]
        // },
        // {
        //   id: 2,
        //   name: "车位2",
        //   status: 1,
        //   plateNumber: "辽B12346",
        //   time: "2025-4-25 21:25:00",
        //   phone: "13812341235",
        //   pointList: [
        //     {
        //       x: 194,
        //       y: 513
        //     },
        //     {
        //       x: 180,
        //       y: 527
        //     },
        //     {
        //       x: 147,
        //       y: 493
        //     },
        //     {
        //       x: 161,
        //       y: 479
        //     },
        //     {
        //       x: 194,
        //       y: 513
        //     }
        //   ]
        // },
        // {
        //   id: 3,
        //   name: "车位3",
        //   status: 3,
        //   plateNumber: "辽B12312",
        //   time: "2025-4-25 21:15:00",
        //   phone: "13812341115",
        //   pointList: [
        //     {
        //       x: 270,
        //       y: 506
        //     },
        //     {
        //       x: 256,
        //       y: 520
        //     },
        //     {
        //       x: 225,
        //       y: 488
        //     },
        //     {
        //       x: 239,
        //       y: 474
        //     },
        //     {
        //       x: 270,
        //       y: 506
        //     }
        //   ]
        // }
      ],
      carList: [
        {
          id: 1,
          vehicle: "辽B12345",
          course: 45,
          x: 215,
          y: 338,
          type: 3
        },
        {
          id: 2,
          vehicle: "辽B12346",
          course: 124,
          x: 590,
          y: 245,
          type: 2
        },
        {
          id: 3,
          vehicle: "辽B12347",
          course: 270,
          x: 200,
          y: 420,
          type: 4
        },
        {
          id: 4,
          vehicle: "辽B12348",
          course: 225,
          x: 204,
          y: 538,
          type: 3
        }
      ]
    };
  },
  mounted() {
    // 生成地图
    this.initMap();
    // 生成一个绘制层，用于地图绘制
    // this.initDraw();
    // this.generateSampleData(); // 生成车位数据
    // this.getCarLoation(); //生成车辆点位
    this.addSelectInteraction();
    setTimeout(() => {
      // this.typeChange();
      // this.carChange();
    }, 5000);
  },
  methods: {
    //新车入场
    newCar() {
      let newC = {
        id: 5,
        vehicle: "辽B11100",
        course: 90,
        userPoint: { x: 1760, y: 350 },
        type: 5
      };
      this.carList.push(newC);
      const newFeature = this.createPointFeature(newC);
      newFeature.setId(newC.id);
      this.pointsSource.addFeature(newFeature);
      //动画演示车辆移动效果
      this.carChange();
    },
    //正确停放
    tureCar(car) {
      let newCar = {
        id: "tc" + car.id,
        vehicle: car.vehicle || "正确停放",
        course: car.course || 270,
        userPoint: { x: car.point.pointx - 2, y: car.point.pointy - 80 },
        type: 8 //正确停放提示
      };
      this.retentionCarAdd(newCar);
      setTimeout(() => {
        this.retentionCarDel(newCar);
      }, 500);
      setTimeout(() => {
        this.retentionCarAdd(newCar);
      }, 1000);
      setTimeout(() => {
        this.retentionCarDel(newCar);
      }, 1500);
      setTimeout(() => {
        this.retentionCarAdd(newCar);
      }, 2000);
      setTimeout(() => {
        this.retentionCarDel(newCar);
      }, 2500);
      setTimeout(() => {
        this.retentionCarAdd(newCar);
      }, 3000);
      setTimeout(() => {
        this.retentionCarDel(newCar);
      }, 3500);
      setTimeout(() => {
        this.retentionCarAdd(newCar);
      }, 4000);
      setTimeout(() => {
        this.retentionCarDel(newCar);
      }, 4500);
      setTimeout(() => {
        this.retentionCarAdd(newCar);
      }, 5000);
      setTimeout(() => {
        this.retentionCarDel(newCar);
      }, 5500);
    },
    retentionCarAdd(newR) {
      // this.carList.push(newR);
      const newFeature = this.createPointFeature(newR);
      newFeature.setId(newR.id);
      this.dailogSource.addFeature(newFeature);
    },
    retentionCarDel(newR) {
      const features = this.dailogSource.getFeatures();
      for (let i = 0; i < features.length; i++) {
        if (features[i].getId() === newR.id) {
          // 检查feature的ID是否匹配
          this.dailogSource.removeFeature(features[i]); // 删除找到的feature
          break; // 找到并删除后退出循环
        }
      }
    },
    //车辆驶离
    carOut() {
      const features = this.pointsSource.getFeatures();
      for (let i = 0; i < features.length; i++) {
        if (features[i].getId() === 2) {
          // 检查feature的ID是否匹配
          this.pointsSource.removeFeature(features[i]); // 删除找到的feature
          break; // 找到并删除后退出循环
        }
      }
    },
    clearMap() {
      if (this.layerList.length) {
        this.layerList.forEach(item => {
          this.map.removeLayer(item);
        });
      }
      this.map.getOverlays().clear();
    },

    getIconStyle(type, direction) {
      // console.log(123, type);
      const iconInfo = {
        2: "../../assets/images/carM.png",
        3: "../../assets/images/carS.png",
        4: "../../assets/images/carB.png",
        5: "../../assets/images/carC.png"
      };

      return new ol.style.Style({
        image: new ol.style.Icon({
          src: iconInfo[type],
          scale: 0.8,
          anchor: [36, 64],
          rotation: (direction * Math.PI) / 180, // 角度转弧度
          rotateWithView: true // 保持图标方向不随地图旋转
        })
      });
    },
    initMap() {
      // //地图容器
      // 影像范围，从左上角到右下角的最大坐标

      const extent = [0, 0, this.baseWidth, this.baseHeight];
      // 自定义影像投影，将图片坐标映射到地图坐标，使用像素作为单位，投影范围为影像范围。
      const imageProjection = new ol.proj.Projection({
        code: "world-iamge",
        units: "pixel",
        extent: extent
      });

      // 定义静态影像数据源
      const staticImageSource = new ol.source.ImageStatic({
        url: this.curMap,
        // url:
        //   "http://59.110.222.2:8101/hiCar/profile/upload/2025/04/28/vIYwXRdLKfnjd4b97973929cd29e8f39f900448a9956_20250428092421A001.jpg",
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
          zoom: 2,
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
    },
    // initDraw() {
    //   //实例化一个矢量图层Vector作为绘制层
    //   this.source = new ol.source.Vector({ wrapX: false });
    //   this.vector = new ol.layer.Vector({
    //     source: this.source,
    //     style: new ol.style.Style({
    //       fill: new ol.style.Fill({
    //         color: "rgba(255, 255, 255, 0.2)"
    //       }),
    //       stroke: new ol.style.Stroke({
    //         color: "#ffcc33",
    //         width: 10
    //       }),
    //       image: new ol.style.Circle({
    //         radius: 7,
    //         fill: new ol.style.Fill({
    //           color: "#ffcc33"
    //         })
    //       })
    //     })
    //   });
    //   //将绘制层添加到地图容器中
    //   this.map.addLayer(this.vector);
    //   // 将已添加的图层装起来
    //   this.layerList.push(this.vector);
    // },
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
      // if (!this.iconCache[key]) {
      //   this.iconCache[key] = new ol.style.Icon({
      //     src: "./car" + type + ".png", // 图标路径根据type动态获取
      //     // src: "../../assets/images/car2.png", // 图标路径
      //     scale: scale,
      //     anchor: [0.5, 0.5], // 图标中心锚点
      //     rotation: (course * Math.PI) / 180, // 转换为弧度
      //     rotateWithView: true // 随地图旋转
      //   });
      // } else {
      let icoSrc = "./car" + type + ".png";
      // if (type == 5) {
      //   icoSrc = "./car5.gif";
      // } else {
      //   icoSrc = "./car" + type + ".png";
      // }
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
    },

    // 添加选择交互
    addSelectInteraction() {
      const selectedPolygonStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "#499efb",
          width: 2
        }),
        fill: new ol.style.Fill({
          color: "#499efb" + "33" // 添加透明度
        })
      });
      let selectedPointStyle;
      const select = new ol.interaction.Select({
        style: feature => {
          const geometryType = feature.getGeometry().getType();
          // 只有多边形选中时应用特殊样式
          // console.log(333, geometryType);
          if (geometryType === "Polygon" || geometryType === "MultiPolygon") {
            return selectedPolygonStyle;
          }
          // 其他类型（如点）返回 null，保持原样式不变
          return selectedPointStyle;
        }
      });

      select.on("select", e => {
        if (e.selected.length > 0) {
          this.selectedFeature = e.selected[0];
          let status = this.selectedFeature.get("status");
          let name = this.selectedFeature.get("name");
          if (name) {
            this.selectedFeature.setStyle(
              this.polygonStyle(this.selectedFeature)
            );
            if (status == 2) {
              const coordinate = e.mapBrowserEvent.coordinate;
              this.popupOverlay.setPosition(coordinate);
            } else {
              this.selectedFeature = null;
              this.popupOverlay.setPosition(undefined);
            }
          } else {
            let data = this.selectedFeature.N;
            selectedPointStyle = new ol.style.Style({
              image: this.getIcon(data.id, data.type, data.course + 90, 1)
            });
            setTimeout(() => {
              select.getFeatures().clear();
            }, 2000);
            this.selectedFeature = null;
            this.popupOverlay.setPosition(undefined);
          }
        } else {
          this.selectedFeature = null;
          this.popupOverlay.setPosition(undefined);
        }
      });

      this.map.addInteraction(select);
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
