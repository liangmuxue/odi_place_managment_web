<template>
  <div class="custom-tree-container">
    <div class="base_dialog" v-if="isShow">
      <div class="base_dialog_top">
        {{ title }}
        <div class="base_dialog_close" @click="closeDialog">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="base_dialog_main">
        <el-form :model="newList" :rules="rules" ref="parkingForm">
          <div class="base_dialog_main_content">
            <div
              class="base_dialog_main_left"
              style="padding: 60px 100px;max-width:1600px"
            >
              <span class="base_dialog_condit">
                <el-form-item label="算法配置" prop="parkId">
                  <span class="base_dialog_condit_text" v-if="pageType == 3">
                    {{ newList.parkName }}</span
                  >
                  <el-select
                    v-else
                    v-model="newList.parkId"
                    placeholder="请选择该摄像头配置算法（可多选，默认全选 ）"
                    clearable
                    @change="parkChange"
                    class="filter-item"
                    style="width: 600px"
                    size="small"
                  >
                    <el-option
                      v-for="item in parkingList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </span>
              <span class="base_dialog_condit">
                <el-form-item label="ROI配置" prop="name">
                  <!-- <el-input
                    v-show="false"
                    v-model="newList.name"
                    placeholder="输入设备名称"
                    style="width: 1200px"
                    class="filter-item"
                    size="small"
                  /> -->
                  <!-- <div class="dialog_body" v-if="isShow">
                    <div class="dialog_content">
                      <div class="tab_box">
                        <el-tabs
                          tab-position="left"
                          type="border-card"
                          style="height: 540px"
                          @tab-click="changeTab"
                        >
                          <el-tab-pane
                            v-for="(item, i) in algorithmList"
                            :key="i"
                          >
                            <span slot="label" class="tab_t"
                              >{{ item.algoriName }}&nbsp;&nbsp;&nbsp;&nbsp;
                              <div
                                :style="getColor(item)"
                                class="color_box"
                              ></div
                            ></span>
                          </el-tab-pane>
                        </el-tabs>
                      </div>
                      <div class="video_box">
                        <VideoBox
                          ref="videoW1"
                          id="1"
                          bindId="p-videoW1"
                        ></VideoBox>

                        <div
                          class="markCanvas_box"
                          v-if="algorithmList.length > 0"
                        >
                          <markCanvas4OnlyShow
                            class="markCanvas"
                            ref="markCanvas4OnlyShow"
                            v-if="showAll"
                          ></markCanvas4OnlyShow>
                          <markCanvasOnlyShow
                            class="markCanvas"
                            ref="markCanvasOnlyShow"
                            v-if="showAll"
                          ></markCanvasOnlyShow>

                          <markCanvas
                            class="markCanvas"
                            ref="markCanvas"
                            v-if="showOptions == 1 && !showAll"
                          ></markCanvas>
                          <markCanvas4
                            class="markCanvas"
                            ref="markCanvas4"
                            v-if="showOptions == 0 && !showAll"
                          ></markCanvas4>
                          <div class="mark" v-if="showMark"></div>
                        </div>
                      </div>
                      <div class="operation_btns">
                        <div class="operation_btns_left">
                          绘制区域：
                          <div
                            class="operation_btn"
                            v-if="selOptions != 1"
                            @click="toPolygon"
                          >
                            <div class="operation_ico polygon_ico"></div>
                            <div class="operation_text">多边形</div>
                          </div>
                          <div class="operation_btn2" v-else>
                            <div class="operation_ico polygon_ico"></div>
                            <div class="operation_text">多边形</div>
                          </div>
                          <div
                            class="operation_btn"
                            v-if="selOptions != 0"
                            @click="toRectangle"
                          >
                            <div class="operation_ico rectangle_ico"></div>
                            <div class="operation_text">矩形</div>
                          </div>
                          <div class="operation_btn2" v-else>
                            <div class="operation_ico rectangle_ico"></div>
                            <div class="operation_text">矩形</div>
                          </div>
                        </div>
                        <div class="operation_btns_right">
                          <div class="operation_btn" @click="clearMark">
                            <div class="operation_ico clear_ico"></div>
                            <div class="operation_text">清除区域</div>
                          </div>
                          <div class="operation_btn" @click="clearALl">
                            <div class="operation_ico clearAll_ico"></div>
                            <div class="operation_text">清除全部</div>
                          </div>
                          <div
                            class="operation_btn"
                            v-if="!showAll"
                            @click="toShowAll"
                          >
                            <div class="operation_ico seeAll_ico"></div>
                            <div class="operation_text">查看全部</div>
                          </div>
                          <div
                            class="operation_btn"
                            v-if="showAll"
                            @click="toShowNow"
                          >
                            <div class="operation_ico seeAll_ico"></div>
                            <div class="operation_text">查看当前</div>
                          </div>
                        </div>
                      </div>

                      <div
                        class="footer_text"
                        v-show="algorithmList.length == 0"
                      >
                        该设备暂未配置算法，请在高级设置-算法配置-规则引擎页面进行配置
                      </div>
                      <div class="dialog_footer">
                        <el-button
                          type="info"
                          icon="el-icon-circle-plus"
                          @click="toSave"
                          >保存</el-button
                        ><el-button
                          type="danger"
                          icon="el-icon-error"
                          @click="closeDialog"
                          >取消</el-button
                        >
                      </div>
                    </div>
                  </div> -->
                </el-form-item>
              </span>
              <div class="dialog_body" v-if="isShow">
                <div class="dialog_content">
                  <div class="tab_box">
                    <el-tabs
                      tab-position="left"
                      type="border-card"
                      style="height: 580px"
                      @tab-click="changeTab"
                    >
                      <el-tab-pane v-for="(item, i) in algorithmList" :key="i">
                        <span slot="label" class="tab_t"
                          >{{ item.algoriName }}&nbsp;&nbsp;&nbsp;&nbsp;
                          <div :style="getColor(item)" class="color_box"></div
                        ></span>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                  <div class="video_box">
                    <VideoBox
                      ref="videoW1"
                      id="1"
                      bindId="p-videoW1"
                    ></VideoBox>

                    <div class="markCanvas_box" v-if="algorithmList.length > 0">
                      <markCanvas4OnlyShow
                        class="markCanvas"
                        ref="markCanvas4OnlyShow"
                        v-if="showAll"
                      ></markCanvas4OnlyShow>
                      <markCanvasOnlyShow
                        class="markCanvas"
                        ref="markCanvasOnlyShow"
                        v-if="showAll"
                      ></markCanvasOnlyShow>

                      <markCanvas
                        class="markCanvas"
                        ref="markCanvas"
                        v-if="showOptions == 1 && !showAll"
                      ></markCanvas>
                      <markCanvas4
                        class="markCanvas"
                        ref="markCanvas4"
                        v-if="showOptions == 0 && !showAll"
                      ></markCanvas4>
                      <div class="mark" v-if="showMark"></div>
                    </div>
                  </div>
                  <div class="operation_btns">
                    <div class="operation_btns_left">
                      绘制区域：
                      <div
                        class="operation_btn"
                        v-if="selOptions != 1"
                        @click="toPolygon"
                      >
                        <div class="operation_ico polygon_ico"></div>
                        <div class="operation_text">多边形</div>
                      </div>
                      <div class="operation_btn2" v-else>
                        <div class="operation_ico polygon_ico"></div>
                        <div class="operation_text">多边形</div>
                      </div>
                      <div
                        class="operation_btn"
                        v-if="selOptions != 0"
                        @click="toRectangle"
                      >
                        <div class="operation_ico rectangle_ico"></div>
                        <div class="operation_text">矩形</div>
                      </div>
                      <div class="operation_btn2" v-else>
                        <div class="operation_ico rectangle_ico"></div>
                        <div class="operation_text">矩形</div>
                      </div>
                    </div>
                    <div class="operation_btns_right">
                      <div class="operation_btn" @click="clearMark">
                        <div class="operation_ico clear_ico"></div>
                        <div class="operation_text">清除区域</div>
                      </div>
                      <div class="operation_btn" @click="clearALl">
                        <div class="operation_ico clearAll_ico"></div>
                        <div class="operation_text">清除全部</div>
                      </div>
                      <div
                        class="operation_btn"
                        v-if="!showAll"
                        @click="toShowAll"
                      >
                        <div class="operation_ico seeAll_ico"></div>
                        <div class="operation_text">查看全部</div>
                      </div>
                      <div
                        class="operation_btn"
                        v-if="showAll"
                        @click="toShowNow"
                      >
                        <div class="operation_ico seeAll_ico"></div>
                        <div class="operation_text">查看当前</div>
                      </div>
                    </div>
                  </div>

                  <!-- <div class="footer_text" v-show="algorithmList.length == 0">
                    该设备暂未配置算法，请在高级设置-算法配置-规则引擎页面进行配置
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </el-form>
        <div class="base_dialog_main_btnBox" v-if="pageType < 3">
          <el-button type="info" @click="toSave">保存</el-button
          ><el-button type="danger" @click="closeDialog">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoBox from "@/components/VideoBox/videoBoxROI";
import {
  selCoor,
  updateCoor //设备详情查询
} from "@/api/equipmentManagement";
import markCanvas4 from "./markCanvas4";
import markCanvas from "./markCanvas";
import markCanvas4OnlyShow from "./markCanvas4OnlyShow";
import markCanvasOnlyShow from "./markCanvasOnlyShow";

export default {
  components: {
    VideoBox,
    markCanvas4,
    markCanvas,
    markCanvas4OnlyShow,
    markCanvasOnlyShow
  },
  data() {
    return {
      pageType: 1,
      title: "ROI",
      isShow: false, //弹框展示状态
      videoUrl: "", //视频
      videoPath: "", //视频流接口
      selId: null,
      showMark: true,
      clearType: true, //清除按钮状态 true:正常状态，false:不可编辑状态
      clearAllType: true, //清除全部按钮状态 true:正常状态，false:不可编辑状态
      showAll: false,
      marks: null, //坐标点
      algorithmList: [], //算法列表
      selAlgorithmId: 18, //选中算法id
      selOptions: null, //选择绘制模式 0.矩形 1.多边形
      showOptions: null, //选择绘制模式 0.矩形 1.多边形
      selColor: "#41c96c",
      videoType: 1, //1:webrtc 2:hls
      sourceUrl: "",
      newList: {
        parkId: null, //停车场id
        name: "" //道闸名称
      }, //道闸详情
      rules: {
        parkId: [
          { required: true, message: "请选择停车场", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入道闸名称", trigger: "blur" }]
      }
    };
  },
  created() {
    this.$bus.$on("markType", type => {
      //这里获取到http工具js文件中传过来的wholeSpin值
      this.showMark = type;
      if (this.showMark) {
        this.selOptions = null;
      }
    });
  },
  methods: {
    changeTab(a) {
      let i = a.index;
      let item = this.algorithmList[i];
      this.selALg(item);
    },
    changePlayStatus(status) {
      //获取子组件的播放状态
      if (status) {
        this.disabledShot = false;
      } else {
        this.disabledShot = true;
        this.sourceUrl = "";
        this.checkedPontsName = "";
      }
    },
    //切换播放视频模式
    changVideoType(type) {
      this.videoType = type;
    },
    //获取颜色
    getColor(el) {
      return "background:" + el.algoriColor;
    },
    //选择算法
    selALg(item) {
      this.selOptions = null;
      this.showMark = true;
      if (!this.showAll) {
        //判断当前不属于查看全部状态
        if (this.$refs.markCanvas4) {
          let marks = this.$refs.markCanvas4.getmark();
          let list = [];
          list.push(marks.w);
          list.push(marks.h);
          list.push(marks.x);
          list.push(marks.y);
          // console.log("可编辑RIO", list);
          this.algorithmList.forEach(el => {
            if (el.algoriId == this.selAlgorithmId) {
              el.newCoordinate = list;
              el.options = 0;
            }
          });
        }
        if (this.$refs.markCanvas) {
          let marks = this.$refs.markCanvas.getmark();
          if (marks.length > 0) {
            let list = [];
            marks.forEach(el => {
              let e = [el.x, el.y];
              list.push(e);
            });
            // console.log("可编辑RIO", list);
            this.algorithmList.forEach(el => {
              if (el.algoriId == this.selAlgorithmId) {
                el.coordinate = list;
                el.options = 1;
              }
            });
          }
        }

        setTimeout(() => {
          this.selAlgorithmId = item.algoriId;
          this.selColor = item.algoriColor;
          this.showOptions = item.options;
          if (item.options == 1) {
            let marks = item.coordinate;
            let list = [];
            marks.forEach(el => {
              let e = { x: el[0], y: el[1] };
              list.push(e);
            });
            this.$nextTick(() => {
              this.$refs.markCanvas.initCanvas(list, this.selColor);
            });
          } else {
            let marks = {
              w: item.newCoordinate[0] * 1,
              h: item.newCoordinate[1] * 1,
              x: item.newCoordinate[2] * 1,
              y: item.newCoordinate[3] * 1
            };
            this.$nextTick(() => {
              this.$refs.markCanvas4.initCanvas(marks, this.selColor);
            });
          }
        }, 300);
      } else {
        this.selAlgorithmId = item.algoriId;
        //当处于多点绘制状态时，清除当前绘制
        // if (this.selOptions == 0 && !this.showMark) {
        //   this.$refs.markCanvas4.clearALl(this.selColor);
        // }
        this.toShowNow();
      }
    },
    //查看全部
    toShowAll() {
      let item;
      this.algorithmList.forEach(el => {
        if (el.algoriId == this.selAlgorithmId) {
          item = el;
        }
      });
      // if (item.algoriId != 19) {
      this.selALg(item);
      // }
      this.showAll = true;
      let list = [];
      let colorList = [];
      let makrsList = [];
      let makrscolorList = [];
      this.algorithmList.forEach(el => {
        if (el.options == 1) {
          let marks = el.coordinate;
          let arr = [];
          marks.forEach(m => {
            let e = { x: m[0], y: m[1] };
            arr.push(e);
          });
          colorList.push(el.algoriColor);
          list.push(arr);
        } else {
          let marks = {
            w: el.newCoordinate[0] * 1,
            h: el.newCoordinate[1] * 1,
            x: el.newCoordinate[2] * 1,
            y: el.newCoordinate[3] * 1
          };
          makrsList.push(marks);
          makrscolorList.push(el.algoriColor);
        }
      });
      if (list.length > 0) {
        this.$nextTick(() => {
          this.$refs.markCanvasOnlyShow.initCanvas(list, colorList);
        });
      }
      if (makrsList.length > 0) {
        this.$nextTick(() => {
          this.$refs.markCanvas4OnlyShow.initCanvas(makrsList, makrscolorList);
        });
      }
    },
    //查看当前
    toShowNow() {
      this.showAll = false;
      let item;
      this.algorithmList.forEach(el => {
        if (el.algoriId == this.selAlgorithmId) {
          item = el;
        }
      });
      this.selALg(item);
    },
    //获取视频播放速度
    speed(name, speed) {
      this.speed = speed;
    },

    //打开弹窗
    showDialog(item) {
      this.selId = item.id;
      let para = { id: item.id };
      this.showAll = false;
      this.videoType = 1;
      this.isShow = true;

      // selCoor(para).then(response => {
      //   this.marks = response.data;
      //   this.video = response.data;
      //   this.videoPath = response.data.videoPath;
      //   this.isShow = true;
      //   if (response.data.frameList) {
      //     let list = [];
      //     response.data.frameList.forEach(el => {
      //       if (el.options == 1) {
      //         list.push(el);
      //       } else {
      //         // let arr = [
      //         //   el.newCoordinate[0] - el.newCoordinate[2],
      //         //   el.newCoordinate[1] - el.newCoordinate[3],
      //         //   el.newCoordinate[2],
      //         //   el.newCoordinate[3],
      //         // ];
      //         let arr = [
      //           el.newCoordinate[2][0] - el.newCoordinate[0][0],
      //           el.newCoordinate[2][1] - el.newCoordinate[0][1],
      //           el.newCoordinate[0][0],
      //           el.newCoordinate[0][1]
      //         ];
      //         el.newCoordinate = arr;
      //         list.push(el);
      //       }
      //     });

      //     this.algorithmList = list;
      //     if (list.length > 0) {
      //       this.selALg(list[0]);
      //     }
      //   }
      //   let videoItem = {
      //     refId: "videoW1",
      //     pwId: "p-videoW1", //外层div的id
      //     src: "", //视频连接
      //     deviceId: null, //对应的相机设备编号
      //     status: 1 //状态： 0-未启动 1-播放中
      //   };
      //   var videoInfo = Object.assign(item, videoItem);
      //   this.$nextTick(() => {
      //     this.$refs.videoW1.toPlay(videoInfo);
      //   });
      // });
    },
    //算左上角点页面内x坐标
    getX(mask) {
      if (mask.xDown) {
        return parseInt((mask.xDown * 960) / mask.camWidth);
      } else {
        return 0;
      }
    },
    //算左上角点页面内y坐标
    getY(mask) {
      if (mask.yDown) {
        return parseInt((mask.yDown * 540) / mask.camHeight);
      } else {
        return 0;
      }
    },
    //算左上角点页面内宽
    getW(mask) {
      let w = mask.xUp - mask.xDown;
      if (w > 0) {
        return parseInt((w * 960) / mask.camWidth);
      } else {
        return 0;
      }
    },
    //算左上角点页面内高
    getH(mask) {
      let h = mask.yUp - mask.yDown;
      if (h > 0) {
        return parseInt((h * 540) / mask.camHeight);
      } else {
        return 0;
      }
    },
    //关闭新增/编辑设备弹窗
    closeDialog() {
      // this.$refs.markCanvas.clearALl();
      this.isShow = false;
    },
    //开始绘制多边形
    toPolygon() {
      this.showMark = false;
      this.selOptions = 1;
      this.showOptions = 1;
      this.$nextTick(() => {
        this.$refs.markCanvas.clearALl(this.selColor);
      });
    },
    //开始绘制矩形
    toRectangle() {
      this.showMark = false;
      this.selOptions = 0;
      this.showOptions = 0;
      this.$nextTick(() => {
        this.$refs.markCanvas4.clearALl(this.selColor);
      });
    },
    //清除当前绘制
    clearMark(type) {
      if (type != "keepType") {
        this.clearType = false;
        setTimeout(() => {
          this.clearType = true;
        }, 500);
      }
      if (this.showOptions == 1) {
        if (this.showMark) {
          let list = [
            { x: 0, y: 0 },
            { x: 1920, y: 0 },
            { x: 1920, y: 1080 },
            { x: 0, y: 1080 },
            { x: 0, y: 0 }
          ];
          this.$nextTick(() => {
            this.$refs.markCanvas.initCanvas(list, this.selColor);
          });
        } else {
          this.$refs.markCanvas.clearALl(this.selColor);
        }
      } else {
        this.$nextTick(() => {
          let marks = {
            w: 1920,
            h: 1080,
            x: 0,
            y: 0
          };
          let list = [];
          list.push(marks);
          let colorList = [];
          colorList.push(this.selColor);
          this.$nextTick(() => {
            this.$refs.markCanvas4.initCanvas(marks, this.selColor);
          });
        });
      }
    },
    //清除所有绘制
    clearALl() {
      this.clearAllType = false;
      setTimeout(() => {
        this.clearAllType = true;
      }, 500);
      if (this.showAll) {
        this.algorithmList.forEach(el => {
          if (el.showOptions == 1) {
            el.coordinate = [
              [0, 0],
              [1920, 0],
              [1920, 1080],
              [0, 1080],
              [0, 0]
            ];
          } else {
            el.newCoordinate = [1920, 1080, 0, 0];
          }
        });
        this.toShowAll();
      } else {
        this.clearMark("keepType");
        this.algorithmList.forEach(el => {
          if (el.options == 1) {
            el.coordinate = [
              [0, 0],
              [1920, 0],
              [1920, 1080],
              [0, 1080],
              [0, 0]
            ];
          } else {
            el.newCoordinate = [1920, 1080, 0, 0];
          }
        });
      }
    },
    //保存
    toSave() {
      if (this.algorithmList.length) {
        this.$refs["parkingForm"].validate(valid => {
          if (valid) {
            this.$confirm("确认提交保存ROI信息吗?", "提示", {
              type: "warning"
            }).then(() => {
              let item;
              this.algorithmList.forEach(el => {
                if (el.algoriId == this.selAlgorithmId) {
                  item = el;
                }
              });
              this.selALg(item);
              setTimeout(() => {
                let list = [];
                let aList = JSON.parse(JSON.stringify(this.algorithmList));
                aList.forEach(el => {
                  if (el.options == 1) {
                    el.newCoordinate = [
                      [0, 0],
                      [1920, 0],
                      [1920, 1080],
                      [0, 1080]
                    ];
                    list.push(el);
                  } else {
                    // let arr = [
                    //   el.newCoordinate[0] + el.newCoordinate[2],
                    //   el.newCoordinate[1] + el.newCoordinate[3],
                    //   el.newCoordinate[2],
                    //   el.newCoordinate[3],
                    // ];
                    let arr = [
                      [el.newCoordinate[2], el.newCoordinate[3]],
                      [
                        el.newCoordinate[2] + el.newCoordinate[0],
                        el.newCoordinate[3]
                      ],
                      [
                        el.newCoordinate[2] + el.newCoordinate[0],
                        el.newCoordinate[3] + el.newCoordinate[1]
                      ],
                      [
                        el.newCoordinate[2],
                        el.newCoordinate[3] + el.newCoordinate[1]
                      ]
                    ];
                    el.coordinate = [
                      [0, 0],
                      [1920, 0],
                      [1920, 1080],
                      [0, 1080],
                      [0, 0]
                    ];
                    el.newCoordinate = arr;
                    list.push(el);
                  }
                });
                let para = { id: this.selId, frameList: list };
                updateCoor(para).then(() => {
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                  this.isShow = false;
                });
              }, 500);
            });
          }
        });
      } else {
        this.$message({
          type: "error",
          message: "请绘制完整区域"
        });
      }

      // //原绘制矩形方法
      // if (marks) {
      //   this.marks.xDown = parseInt((marks.x * this.marks.camWidth) / 960);
      //   this.marks.xUp = parseInt(
      //     ((marks.x + marks.w) * this.marks.camWidth) / 960
      //   );
      //   this.marks.yDown = parseInt((marks.y * this.marks.camHeight) / 540);
      //   this.marks.yUp = parseInt(
      //     ((marks.y + marks.h) * this.marks.camHeight) / 540
      //   );
      // } else {
      //   this.marks.xDown = 0;
      //   this.marks.xUp = 0;
      //   this.marks.yDown = 0;
      //   this.marks.yUp = 0;
      // }
      // let para = this.marks;
      // //防止画框超出范围
      // if (para.xDown < 0) {
      //   para.xDown = 0;
      // }
      // if (para.yDown < 0) {
      //   para.yDown = 0;
      // }
      // if (para.xUp > para.camWidth) {
      //   para.xUp = para.camWidth;
      // }
      // if (para.yUp > para.camHeight) {
      //   para.yUp = para.camHeight;
      // }
      // updateCoor(para).then((response) => {
      //   this.$message({
      //     type: "success",
      //     message: "保存成功",
      //   });
      //   this.isShow = false;
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog_body {
  position: relative;
  top: -60px;
  left: 120px;
  width: 1120px;
  height: 660px;
  margin: 0 5px;
  .tab_box {
    float: left;
    width: 120px;
    height: 580px;
    margin-left: 10px;
    .tab_t {
      display: inline-block;
      min-width: 70px;
    }
    .color_box {
      position: absolute;
      width: 10px;
      height: 10px;
      left: 86px;
      top: 15px;
    }
  }
  .video_box {
    float: left;
    width: 960px;
    height: 540px;
    background: #333;
    position: relative;
    padding: 0px;
    .video_btn_box {
      position: absolute;
      width: 80px;
      height: 24px;
      border: 1px solid #6ca6e8;
      border-radius: 12px;
      top: 10px;
      left: 10px;
      z-index: 1003;
      display: flex;
      overflow: hidden;
      font-size: 12px;
      .video_btn_sel {
        width: 40px;
        height: 24px;
        line-height: 23px;
        background: rgba($color: #6ca6e8, $alpha: 0.6);
        color: #fff;
        text-align: center;
        cursor: pointer;
      }
      .video_btn {
        width: 40px;
        height: 24px;
        line-height: 24px;
        background: rgba($color: #fff, $alpha: 0.6);
        color: #333;
        text-align: center;
        cursor: pointer;
      }
    }
    .markCanvas_box {
      position: absolute;
      top: -1px;
      left: -1px;
      z-index: 1002;
      .markCanvas {
        position: absolute;
        top: 0;
        left: 0;
      }
      .mark {
        position: absolute;
        z-index: 1;
        width: 962px;
        height: 542px;
        top: 0px;
        left: 0px;
      }
    }
  }
  .btn_box {
    float: left;
    width: 120px;
    height: 540px;
    .btn_box1 {
      height: 111px;
      margin-top: 35px;
    }
    .drawing_btn {
      width: 100px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #6ca6e8;
      border-radius: 6px;
      color: #fff;
      margin-top: 35px;
      margin-left: 35px;
      cursor: pointer;
    }
    .drawing_btn_un {
      width: 100px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #929497;
      border-radius: 6px;
      color: #fff;
      margin-top: 35px;
      margin-left: 35px;
      cursor: no-drop;
    }
    .clear_btn {
      width: 100px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #6ca6e8;
      border-radius: 6px;
      color: #fff;
      margin-top: 35px;
      margin-left: 35px;
      cursor: pointer;
    }
    .clear_btn_un {
      width: 100px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #929497;
      border-radius: 6px;
      color: #fff;
      margin-top: 35px;
      margin-left: 35px;
      cursor: no-drop;
    }
  }
  .operation_btns {
    position: absolute;
    width: 960px;
    top: 540px;
    left: 130px;
    height: 40px;
    line-height: 40px;
    background: #333;
    color: #fff;
    .operation_btns_left {
      float: left;
      padding-left: 10px;
      display: flex;
      .operation_btn {
        width: 90px;
        display: flex;
        cursor: pointer;
        .operation_ico {
          width: 20px;
          height: 20px;
          margin: 10px 5px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        .polygon_ico {
          background-image: url("../../../../assets/images/equipmentList/polygon.png");
        }
        .rectangle_ico {
          background-image: url("../../../../assets/images/equipmentList/rectangle.png");
        }
        .operation_text {
          width: 60px;
          height: 40px;
          line-height: 40px;
        }
      }
      :hover {
        .operation_ico {
          width: 20px;
          height: 20px;
          margin: 10px 5px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        .polygon_ico {
          background-image: url("../../../../assets/images/equipmentList/polygon_sel.png");
        }
        .rectangle_ico {
          background-image: url("../../../../assets/images/equipmentList/rectangle_sel.png");
        }

        .operation_text {
          width: 60px;
          height: 40px;
          line-height: 40px;
          color: #6ca6e8;
        }
      }
      .operation_btn2 {
        width: 90px;
        display: flex;
        cursor: pointer;
        .operation_ico {
          width: 20px;
          height: 20px;
          margin: 10px 5px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        .polygon_ico {
          background-image: url("../../../../assets/images/equipmentList/polygon_sel.png");
        }
        .rectangle_ico {
          background-image: url("../../../../assets/images/equipmentList/rectangle_sel.png");
        }
        .operation_text {
          width: 60px;
          height: 40px;
          line-height: 40px;
          color: #6ca6e8;
        }
      }
    }
    .operation_btns_right {
      float: right;
      display: flex;
      .operation_btn {
        width: 100px;
        display: flex;
        cursor: pointer;
        .operation_ico {
          width: 20px;
          height: 20px;
          margin: 10px 5px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        .clear_ico {
          background-image: url("../../../../assets/images/equipmentList/clear.png");
        }
        .clearAll_ico {
          background-image: url("../../../../assets/images/equipmentList/clearAll.png");
        }
        .seeAll_ico {
          background-image: url("../../../../assets/images/equipmentList/seeAll.png");
        }

        .operation_text {
          width: 70px;
          height: 40px;
          line-height: 40px;
        }
      }
      :hover {
        .operation_ico {
          width: 20px;
          height: 20px;
          margin: 10px 5px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
        .clear_ico {
          background-image: url("../../../../assets/images/equipmentList/clear_sel.png");
        }
        .clearAll_ico {
          background-image: url("../../../../assets/images/equipmentList/clearAll_sel.png");
        }
        .seeAll_ico {
          background-image: url("../../../../assets/images/equipmentList/seeAll_sel.png");
        }

        .operation_text {
          width: 70px;
          height: 40px;
          line-height: 40px;
          color: #6ca6e8;
        }
      }
    }
  }
  .footer_text {
    float: left;
    width: 100%;
    padding-left: 150px;
    height: 30px;
    line-height: 30px;
  }
  .dialog_footer {
    float: left;
    width: 240px;
    height: 40px;
    margin: 20px 440px;
    .footer_button1 {
      float: left;
      width: 101px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      border-radius: 6px;
      border: 1px solid #037659;
      background: #037659;
      color: #fff;
      cursor: pointer;
    }
    .footer_button2 {
      float: right;
      width: 101px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      border-radius: 6px;
      border: 1px solid #e1e1e1;
      background: #fff;
      cursor: pointer;
    }
  }
}
</style>
