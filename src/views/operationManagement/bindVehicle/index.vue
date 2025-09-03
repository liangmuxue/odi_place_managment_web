<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title">车牌号</div>
        <el-input v-model="listQuery.vehicleNumber" placeholder="请输入">
        </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title2">绑定用户手机</div>
        <el-input v-model="listQuery.phone" placeholder="请输入"> </el-input>
      </span>
      <span class="search_content">
        <div class="search_content_title">车牌颜色</div>
        <el-select
          v-model="listQuery.licensePlateColor"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in enumsData.LICENSE_PLATE_COLOR"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title">是否认证</div>
        <el-select
          v-model="listQuery.isAuth"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in statusList"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title">无感停车</div>
        <el-select
          v-model="listQuery.nonParking"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in nonParkings"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <span class="search_content">
        <div class="search_content_title">车辆类型</div>
        <el-select
          v-model="listQuery.vehicleType"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in enumsData.VEHICLE_TYPE"
            :key="item.enumValue"
            :label="item.enumName"
            :value="item.enumValue"
          />
        </el-select>
      </span>
      <el-button icon="el-icon-refresh-right" @click="resetList"
        >重置</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-search"
        v-has="{ red: 'unbind', type: 1 }"
        @click="toSearchList"
        >查询</el-button
      >
    </div>
    <div class="btn_box">
      <el-button type="danger" icon="el-icon-remove-outline" @click="toDel"
        >解除绑定</el-button
      >
      <!-- v-has="{ red: 'deleteBox', type: 1 }" -->
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        highlight-current-row
        size="mini"
        stripe
        height="calc(100vh - 320px)"
        @selection-change="handleSelectionChange"
        align="left"
      >
        <el-table-column type="selection" width="34"></el-table-column>

        <el-table-column
          label="序号"
          type="index"
          min-width="60px"
          align="center"
        ></el-table-column>
        <el-table-column label="车牌号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="绑定用户手机"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="content">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌颜色" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.licensePlateColorName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleTypeName }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="车辆品牌" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleBrandName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车身颜色" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.vehicleColorName }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="是否认证" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.isAuth == 1 ? "是" : "否"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="无感停车" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{
              scope.row.nonParking == 1 ? "已开通" : "未开通"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span
              class="operation_button update_btn"
              @click="toDetial(scope.row)"
              v-has="{ red: 'bindVehicleDetails', type: 1 }"
            >
              详情
            </span>
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
  </div>
</template>

<script>
import {
  systemVehiclePage, //绑定车辆列表
  systemVehicleUnbinding // 取消绑定车辆
} from "@/api/operationManagement";
import Dialog from "./components/dialog";
import { fieldTable } from "@/api/common";

export default {
  name: "BindVehicle",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        vehicleNumber: "", //车牌号
        phone: "", //手机
        isAuth: null, //是否认证1通过 -1不通过
        licensePlateColor: null, //车牌颜色
        nonParking: null, //无感停车 0-未开通 1-已开通
        vehicleType: null //车辆类型 1-大型车 2-中型车 3-小型车
      },
      selGateway: null,
      statusList: [
        { enumName: "否", enumValue: -1 },
        { enumName: "是", enumValue: 1 }
      ],
      nonParkings: [
        { enumName: "未开通", enumValue: 0 },
        { enumName: "已开通", enumValue: 1 }
      ],
      Dictionaries: {
        enumTypes:
          "LICENSE_PLATE_COLOR,VEHICLE_BRAND,VEHICLE_COLOR,VEHICLE_TYPE"
      },
      enumsData: {}, //字典表返回数据

      listLoading: false, //加载
      list: [] //信息
    };
  },

  created() {
    this.getFieldTable();
    this.toSearchList();
  },
  methods: {
    getFieldTable() {
      fieldTable(this.Dictionaries).then(response => {
        this.enumsData = response.data;
        let list = response.data.VEHICLE_TYPE;
        [list[0], list[1]] = [list[1], list[0]];
        this.enumsData.VEHICLE_TYPE = list;
      });
    },

    //选择复选框
    handleSelectionChange(val) {
      this.selGateway = val;
    },

    //查询用户列表
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
        orderField: null, //排序字段// 1-注册时间2-最后登录时间3-钱包余额4-绑定车辆数量5-授权车辆数量
        orderType: null, //排序类型1 (升序)，2 (降序)
        purePhoneNumber: "", //手机号码
        hasPurse: null, //开通钱包'0-没有钱包 1-开通钱包'
        noPasswordPay: null, //免密支付'0-未开通免密支付 1-开通免密支付',
        startTime: "", //开始时间
        endTime: "" //结束时间
      };
      this.openLoading();
      this.getList();
    },
    //显示溢出隐藏
    showTips(obj, row) {
      /*obj为鼠标移入时的事件对象*/
      /*currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除*/
      let TemporaryTag = document.createElement("span");
      TemporaryTag.innerText = row.note;
      TemporaryTag.className = "getTextWidth";
      document.querySelector("body").appendChild(TemporaryTag);
      let currentWidth = document.querySelector(".getTextWidth").offsetWidth;
      document.querySelector(".getTextWidth").remove();

      /*cellWidth为表格容器的宽度*/
      const cellWidth = obj.target.offsetWidth;

      /*当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行*/
      currentWidth <= 2 * cellWidth
        ? (row.showTooltip = false)
        : (row.showTooltip = true);
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
    //取消绑定
    toDel() {
      if (this.selGateway.length > 0) {
        let arr = [];
        this.selGateway.forEach(el => {
          arr.push(el.id);
        });
        let text = "确认批量解除绑定车辆吗?";
        if (this.selGateway.length == 1) {
          text = "确认解除该绑定车辆吗?";
        }

        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          let para = {
            ids: arr.toString()
          };
          systemVehicleUnbinding(para).then(response => {
            if (response.code == "200") {
              this.$message({
                type: "success",
                message: "解除绑定成功"
              });
              this.openLoading();
              this.getList();
            } else {
              // this.$message({
              //   type: "error",
              //   message: "解除绑定失败"
              // });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择解除绑定车辆"
        });
      }
    },

    //获取绑定车辆列表
    getList() {
      let para = this.listQuery;
      systemVehiclePage(para)
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

    //打开车辆详情
    toDetial(e) {
      let id = e.id;
      this.$refs.dialog.showDialog(id);
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
