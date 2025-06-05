<template>
  <div class="custom-tree-container realTimeTree">
    <div class="block">
      <el-input
        placeholder="请输入要查询的设备名称"
        v-model="filterText"
        size="mini"
        style="margin: 0 10px; width: 240px"
      >
      </el-input>
      <el-tree
        ref="treeForm"
        :data="data"
        node-key="regionCode"
        highlight-current
        accordion
        check-strictly
        :props="defaultProps"
        :default-expanded-keys="expandedKeys"
        @check-change="handleClick"
        :render-content="renderContent"
        :filter-node-method="filterNode"
        show-checkbox
        auto-expand-parent
        default-expand-all
      ></el-tree>
    </div>
  </div>
</template>

<script>
import { deviceListTree } from "@/api/homePage";

export default {
  // props: ["ParentComponentParam"],
  data() {
    return {
      filterText: "",
      data: [],
      defaultProps: {
        // 配置项（必选）
        id: "regionCode",
        value: "regionCode",
        label: "regionName",
        count: "offlineNum",
        children: "children",
        disabled: this.disabledFn,
        icon: this.showIcon
      },
      checkedArr: [],
      opencamreaArr: [],
      cameraList: [],
      expandedKeys: []
    };
  },
  created() {
    // this.getAddressCamera();
  },
  watch: {
    filterText(val) {
      this.$refs.treeForm.filter(val);
    }
  },

  methods: {
    filterNode(value, data) {
      // console.log(111, value);
      // console.log(222, data);
      if (!value) return true;
      return data.regionName.indexOf(value) !== -1;
    },
    getAddressCamera(id) {
      let para = { parkId: id };
      deviceListTree(para).then(response => {
        let tree = response.data;
        // let arr = tree[0].children
        // let list = []
        // arr.forEach(el => {
        //   if(el.state > 0){
        //     list.push(el)
        //   }
        // });
        // tree[0].children = list
        this.data = tree;
        let cameralist = this.data[0].children;
        cameralist.forEach(el => {
          if (!el.frameList) {
            el.coordinateList = [
              ["0", "0"],
              ["1920", "0"],
              ["1920", "1080"],
              ["0", "1080"],
              ["0", "0"]
            ];
            el.makrsList = [
              [
                { x: 0, y: 0 },
                { x: 1920, y: 0 },
                { x: 1920, y: 1080 },
                { x: 0, y: 1080 },
                { x: 0, y: 0 }
              ],
              [
                { x: 0, y: 0 },
                { x: 1920, y: 0 },
                { x: 1920, y: 1080 },
                { x: 0, y: 1080 },
                { x: 0, y: 0 }
              ],
              [
                { x: 0, y: 0 },
                { x: 1920, y: 0 },
                { x: 1920, y: 1080 },
                { x: 0, y: 1080 },
                { x: 0, y: 0 }
              ]
            ];
            el.makrscolorList = ["#41c96c", "#fdf004", "#ff6600"];
          } else {
            let makrscolorList = [];
            let makrsList = [];
            let arr = el.frameList[0].newCoordinate;
            // arr.push(el.frameList[0].newCoordinate[0]);
            el.coordinateList = arr;
            let list = el.frameList;
            list.forEach(e => {
              if (e.options == 1) {
                let marks = e.coordinate;
                let arr = [];
                marks.forEach(m => {
                  let e = { x: m[0], y: m[1] };
                  arr.push(e);
                });
                makrscolorList.push(e.algoriColor);
                makrsList.push(arr);
              } else {
                let marks = [...e.newCoordinate];
                marks.push(e.newCoordinate[0]);
                let arr = [];
                marks.forEach(m => {
                  let e = { x: m[0], y: m[1] };
                  arr.push(e);
                });
                makrscolorList.push(e.algoriColor);
                makrsList.push(arr);
              }
            });
            el.makrsList = makrsList;
            el.makrscolorList = makrscolorList;
          }
        });
        this.cameraList = [];
        this.getCameraList(this.data);
        this.$nextTick(() => {
          // this.$emit("initializationSelect", this.cameraList);
        });
        // console.log(this.data);
      });
    },
    toSelect(data) {
      let arr = [];
      let list = [];
      for (let i = 0; i < data.length; i++) {
        let a = JSON.parse(data[i]).regionCode;
        arr.push(a);
        let b = JSON.parse(data[i]);
        // list.push(JSON.parse(data[i]));
        this.handleClick(b, true);
        list.push(data[i].replace(/,/g, ";"));
      }
      this.$refs.treeForm.setCheckedKeys(arr);
      this.expandedKeys = arr;
      // localStorage.setItem("openCameraList", list);
    },
    normalizer(nodes) {
      let arr = nodes;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children !== null) {
          let obj = { value: "", label: "", children: [] };
          obj.value = arr[i].regionCode;
          obj.label = arr[i].regionName;
          obj.parentId = arr[i].parentId;
          obj.regionId = arr[i].regionId;
          obj.children = arr[i].children;
          obj.disabled = true;
          arr[i] = obj;
          this.normalizer(arr[i].children);
        } else {
          let obj = { value: "", label: "" };
          obj.value = arr[i].regionCode;
          obj.label = arr[i].regionName;
          obj.parentId = arr[i].parentId;
          obj.regionId = arr[i].regionId;
          obj.disabled = false;
          arr[i] = obj;
        }
      }
      return arr;
    },
    getCameraList(data) {
      let arr = data;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children !== null) {
          this.getCameraList(arr[i].children);
        } else {
          if (arr[i].regionType == 2) {
            this.cameraList.push(arr[i].regionCode);
          }
        }
      }
    },
    //勾选设备触发
    handleClick(data, checked) {
      this.$emit("treeItemSelect", data, checked);
    },

    //取消设备勾选
    closeCamera(data) {
      // console.log(123, data);
      this.$refs.treeForm.setChecked(data, false);
    },

    //初始化勾选设备触发

    disabledFn(data) {
      let disabled;
      if (data.regionType === 2) {
        if (data.state === 0) {
          disabled = true;
        } else if (data.state === 1) {
          disabled = false;
        }
      } else {
        disabled = true;
      }
      return disabled;
    },
    showIcon(data) {
      let icon;
      if (data.regionType < 2) {
        icon = "el-icon-info";
      } else if (data.regionType === 2) {
        data.state === 0 ? (icon = "el-icon-info") : (icon = "el-icon-info");
      }
      return icon;
    },
    renderContent(h, { node, data }) {
      if (data.regionType < 2) {
        return (
          <span
            class="tree_box"
            style="font-size: 12px;position: relative;height:16px;line-height:16px;"
          >
            <svg-icon
              icon-class="build01"
              class-name="card-panel-icon"
              style="position: absolute;left: -22px; bottom:2;color:#999;"
              v-show="data.regionType<2"
            />
            <div style="position: absolute;left: -22px;height:16px;width:16px;cursor: pointer;z-index:10001" />
            <el-tooltip
              class="item"
              effect="dark"
              content={node.label}
              placement="top-start"
            >
              <span style="display: inline-block;max-width:90px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;height:13px;">
                {" "}
                {node.label}
              </span>
            </el-tooltip>
            <span style="color:#55cc55;font-weight:bold;">
              {" "}
              {data.onlineNum === null ? 0 : data.onlineNum}
            </span>
            /
            <span style="color:#999;font-weight:bold;">
              {" "}
              {data.offlineNum === null ? 0 : data.offlineNum}
            </span>
            /&nbsp;
            <span style="color:#5ac3d6;font-weight:bold;">
              {(data.onlineNum === null ? 0 : data.onlineNum) +
                (data.offlineNum === null ? 0 : data.offlineNum)}
            </span>
          </span>
        );
      } else if (data.regionType === 2) {
        if (data.state === 0) {
          return (
            <span class="tree_box" style="font-size: 12px;position: relative;">
              <svg-icon
                icon-class="select_dis"
                class-name="card-panel-icon"
                style="position: absolute;left: -22px;font-size: 14px;top:5px;"
                v-show="data.regionType===2"
              />
              <svg-icon
                icon-class="camera01"
                class-name="card-panel-icon"
                style="position: relative;left: -2px; "
                v-show="data.regionType===2"
              />
              <span
                style="position: relative;top: 2px;display: inline-block;height:14px;line-height:14px;max-width:160px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
                title={node.label}
              >
                {" "}
                {node.label}
              </span>
            </span>
          );
        } else if (data.state === 1) {
          // if (data.remark) {
          return (
            <span class="tree_box" style="font-size: 12px;">
              <svg-icon
                icon-class="camera02"
                class-name="card-panel-icon"
                style="position: relative;left: -2px;"
                v-show="data.regionType===2"
              />
              <span
                style="position: relative;top: 2px;display: inline-block;height:14px;line-height:14px;max-width:160px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
                title={node.label}
              >
                {" "}
                {node.label}
              </span>
            </span>
          );
          // } else {
          //   return (
          //     <span
          //       class="tree_box"
          //       style="font-size: 12px;position: relative;"
          //     >
          //       <svg-icon
          //         icon-class="select_dis"
          //         class-name="card-panel-icon"
          //         style="position: absolute;left: -22px;font-size: 14px;top:-3px;"
          //         v-show="data.regionType===2"
          //       />
          //       <svg-icon
          //         icon-class="camera01"
          //         class-name="card-panel-icon"
          //         style="position: relative;left: -2px; "
          //         v-show="data.regionType===2"
          //       />
          //       <span> {node.label}</span>
          //     </span>
          //   );
          // }
        }
      }
    },
    openCamera(id) {
      //判断视频摄像头是否开启
      let arr = this.$refs.treeForm.getCheckedNodes().map(v => {
        return v.regionId;
      });
      let hasCamera = false;
      for (var k = 0; k < arr.length; k++) {
        if (arr[k] === id) {
          arr.splice(k, 1);
          hasCamera = true;
        }
      }
      if (hasCamera === false) {
        arr.push(id);
      }
      //视频摄像头是否开启
      this.opencamreaArr = [];
      for (var j = 0; j < arr.length; j++) {
        let newArr = [];
        let flat = function(item) {
          for (var i = 0; i < item.length; i++) {
            if (Array.isArray(item[i].children)) {
              flat(item[i].children);
            } else if (item[i].regionId === arr[j]) {
              newArr = item[i].regionId;
            }
          }
        };
        flat(this.data[0].children);
        this.opencamreaArr.push(newArr);
      }
      this.$refs.treeForm.setCheckedKeys(this.opencamreaArr);
    }
  }
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
.tree_box {
  color: #433241;
}
.icon_address {
  position: absolute;
  left: -20;
}
</style>
<style lang="scss">
.realTimeTree .el-checkbox__input.is-disabled .el-checkbox__inner {
  background: transparent;
  border: 0;
}
// .el-tree-node__content {
//   .tree_box {
//     span {
//       display: inline-block;
//       width: 140px;
//       overflow: hidden;
//     }
//   }
// }
</style>
