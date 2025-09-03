<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">停车场</div>
        <el-input v-model="listQuery.parkName" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">设备编号</div>
        <el-input v-model="listQuery.deviceId" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">设备名称</div>
        <el-input v-model="listQuery.deviceName" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">是否道闸像机</div>
        <el-select
          v-model="listQuery.isGate"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in typeList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="toSearchList"
        >查询</el-button
      >
    </div>
    <div class="btn_box">
      <el-button
        type="info"
        icon="el-icon-circle-plus-outline"
        v-has="{ red: 'monitoringEquipmentAdd', type: 1 }"
        @click="toAdd"
        >新增</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        v-has="{ red: 'monitoringEquipmentDelete', type: 1 }"
        @click="toDel"
        >删除</el-button
      >
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 320px)"
        @selection-change="handleSelectionChange"
        ref="selTable"
        align="left"
      >
        <el-table-column type="selection" width="34"></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="停车场名称"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.parkName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.deviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备厂家" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ getBrand(scope.row.deviceBrand) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getType(scope.row.deviceType) }}
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.deviceId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="IP地址" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="端口号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.port }}</span>
          </template>
        </el-table-column>
        <el-table-column label="网关ID" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.gatewayId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="offLine_ball" v-show="scope.row.state == 0"></span>
            <span v-show="scope.row.state == 0" class="offLine"> 离线</span>
            <span class="onLine_ball" v-show="scope.row.state == 1"></span>
            <span v-show="scope.row.state == 1" class="onLine"> 在线</span>
          </template>
        </el-table-column>
        <el-table-column label="流状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <svg-icon
              icon-class="WIFI"
              v-show="scope.row.streamState == 0"
              class="offLine"
            />
            <span v-show="scope.row.streamState == 0" class="offLine">
              网络不通</span
            >
            <svg-icon
              icon-class="WIFI"
              v-show="scope.row.streamState == 1"
              class="onLine"
            />
            <span v-show="scope.row.streamState == 1" class="onLine">
              网络正常</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          min-width="160px"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              v-has="{ red: 'monitoringEquipmentEdit', type: 1 }"
              @click="toEdit(scope.row)"
            >
              编辑
            </span>
            <span
              class="operation_button update_btn"
              v-if="scope.row.status == 0"
              v-has="{ red: 'monitoringEquipmentEnable', type: 1 }"
              @click="toEnable(scope.row)"
            >
              启用
            </span>
            <span
              class="operation_button update_btn"
              v-if="scope.row.status == 1"
              v-has="{ red: 'monitoringEquipmentEnable', type: 1 }"
              @click="toDeactivate(scope.row)"
            >
              停用
            </span>
            <!-- <span
              class="operation_button update_btn"
              v-has="{ red: 'monitoringEquipmentROI', type: 1 }"
              @click="toROI(scope.row)"
            >
              ROI
            </span> -->
            <span
              class="operation_button update_btn"
              v-has="{ red: 'monitoringEquipmentDetails', type: 1 }"
              @click="toDetails(scope.row)"
            >
              详情
            </span>
            <!-- v-has="{ red: 'editBox', type: 1 }" -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="listQuery.pageNum"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="listQuery.pageSize"
        :total="listQuery.total"
        style="float: right;;margin: 10px"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <Dialog ref="dialog" @getList="getList" @openLoading="openLoading"></Dialog>
    <DialogROI ref="dialogROI"></DialogROI>
  </div>
</template>

<script>
import {
  SsBaseDeviceList, //监控设备分页查询
  SsBaseDeviceUpdate, //监控设备编辑设备
  openGate, //远程开闸
  SsBaseDevice //删除监控设备
} from "@/api/equipmentManagement";
import Dialog from "./components/dialog";
import { fieldTable } from "@/api/common";
import DialogROI from "./components/dialogROI";

export default {
  name: "MonitoringEquipment",
  components: { Dialog, DialogROI },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkName: "", //停车场名称
        deviceName: "", //设备名称
        deviceId: "", //设备编号
        isGate: null //道闸类型
      },
      selGateway: null,
      typeList: [
        { enumName: "是", enumValue: 1 },
        { enumName: "否", enumValue: 0 }
      ],
      Dictionaries: {
        enumTypes: "STATUS"
      },
      enumsData: {}, //字典表返回数据
      listLoading: false, //加载
      list: [] //信息
    };
  },
  created() {
    this.toSearchList();
  },
  methods: {
    //获取设备类型
    getBrand(type) {
      let name;
      if (type == 1) {
        name = "海康";
      } else if (type == 2) {
        name = "宇视";
      } else if (type == 3) {
        name = "大华";
      }
      return name;
    },
    //获取设备类型
    getType(type) {
      let name;
      if (type == 1) {
        name = "抓拍机";
      } else if (type == 2) {
        name = "摄像头";
      }
      return name;
    },

    //查询设备列表
    toSearchList() {
      this.listQuery.pageNum = 1;
      this.openLoading();
      this.getList();
    },

    //重置查询条件
    resetList() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        parkName: "", //停车场名称
        deviceName: "", //设备名称
        deviceId: "", //设备编号
        isGate: null //道闸类型
      };
      this.openLoading();
      this.getList();
    },
    openLoading() {
      let claeeName;
      if (this.$store.getters.sidebar.opened) {
        claeeName = "hasSidebar";
      } else {
        claeeName = "noSidebar";
      }
      this.listLoading = this.$loading({
        lock: true,
        text: "数据加载中...",
        customClass: claeeName, // *这里设置他的class名称,这里最重要
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },

    //获取设备列表
    getList() {
      let para = this.listQuery;
      SsBaseDeviceList(para)
        .then(response => {
          this.list = response.rows;
          if (response.total > 0) {
            this.listQuery.total = response.total; // 数据总条数
          } else {
            this.listQuery.pageSize = 40; //每页数量
            this.listQuery.total = 0; // 数据总条数
            this.listQuery.pageNum = 1; // 当前页
          }
          this.total = response.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        })
        .catch(() => {
          setTimeout(() => {
            this.listLoading.close();
          }, 300);
        });
    },

    //打开添加设备
    toAdd() {
      let id = null;
      let pageType = 1;
      this.$refs.dialog.showDialog(id, pageType);
    },

    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },

    //批量删除
    toDel() {
      if (this.selGateway && this.selGateway.length > 0) {
        let arr = [];
        this.selGateway.forEach(el => {
          arr.push(el.id);
        });
        let text = "确认批量删除道闸吗?";
        if (this.selGateway.length == 1) {
          text = "确认删除该道闸吗?";
        }

        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          SsBaseDevice(arr.toString()).then(response => {
            if (response.code == "200") {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.openLoading();
              this.getList();
            } else {
              // this.$message({
              //   type: "error",
              //   message: "删除失败"
              // });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择删除的道闸"
        });
      }
    },
    //远程开闸
    openDoor() {
      function createObjectFromArrays(keys, values) {
        return keys
          .map((key, index) => [key, values[index]])
          .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {});
      }
      if (this.selGateway && this.selGateway.length > 0) {
        let arr = [];
        let arr2 = [];
        this.selGateway.forEach(el => {
          arr.push(el.barrierNumber);
          arr2.push(el.parkId);
        });
        const result = createObjectFromArrays(arr, arr2);
        console.log(123, result);
        let para = { gateMap: result };
        openGate(para).then(response => {
          if (response.code == "200") {
            this.$message({
              type: "success",
              message: "开闸成功"
            });
          } else {
            // this.$message({
            //   type: "error",
            //   message: "开闸失败"
            // });
          }
        });
        this.$refs.selTable.clearSelection();
      }
    },
    //常开
    openDoorAlways() {
      this.$message({
        type: "warning",
        message: "该设备暂不支持此功能"
      });
    },
    //取消常开
    openDoorCancel() {},
    //启用
    toEnable(e) {
      let para = { ...e };
      para.status = 1;
      this.openLoading();

      SsBaseDeviceUpdate(para).then(response => {
        setTimeout(() => {
          this.listLoading.close();
        }, 300);

        if (response.code == "200") {
          this.$message({
            type: "success",
            message: "启用成功"
          });
          e.status = 1;
        } else {
          // this.$message({
          //   type: "error",
          //   message: "启用失败"
          // });
        }
      });
    },
    //停用
    toDeactivate(e) {
      let para = { ...e };
      para.status = 0;
      this.openLoading();

      SsBaseDeviceUpdate(para).then(response => {
        setTimeout(() => {
          this.listLoading.close();
        }, 300);

        if (response.code == "200") {
          this.$message({
            type: "success",
            message: "停用成功"
          });
          e.status = 0;
        } else {
          // this.$message({
          //   type: "error",
          //   message: "停用失败"
          // });
        }
      });
    },
    //打开编辑道闸
    toEdit(e) {
      let id = e.id;
      let pageType = 2;
      this.$refs.dialog.showDialog(id, pageType);
    },
    //ROI配置
    toROI(e) {
      this.$refs.dialogROI.showDialog(e);
    },

    //打开道闸详情
    toDetails(e) {
      let id = e.id;
      let pageType = 3;
      this.$refs.dialog.showDialog(id, pageType);
    },
    // 切换页码方法
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.openLoading();
      this.getList();
    },
    // 切换每页显示的方法
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.openLoading();
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.commit_page {
  position: relative;
}
.content_box {
  .content_row {
    position: relative;
    height: 32px;
    line-height: 32px;
    .content_boxId {
      color: #8c8787;
      font-size: 14px;
      font-weight: bold;
    }
    .content_num {
      color: #8c8787;
      font-size: 12px;
      font-weight: bold;
    }
    .content_title {
      color: rgba($color: #828484, $alpha: 0.5);
      font-size: 14px;
      padding-right: 5px;
    }
  }
}

.operation_button {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  width: 45px;
  margin: 0 2px;
  cursor: pointer;
  text-align: center;
  i {
    margin-right: 2px;
  }
  .circle {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 9px;
    border: 1px solid #6ca6e8;
    font-size: 12px;
  }
}
</style>
