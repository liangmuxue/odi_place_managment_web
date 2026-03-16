<template>
  <div class="commit_page">
    <div class="search_box">
      <span class="search_content">
        <div class="search_content_title" style="width:120px">链接类型</div>
        <el-select
          v-model="listQuery.urlType"
          placeholder="选择链接类型"
          clearable
          class="filter-item"
          style="width: 72%"
        >
          <el-option
            v-for="item in urlTypes"
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
        @click="toAdd"
        v-has="{ red: 'miniProgramInformationAdd', type: 1 }"
        >新增</el-button
      >
      <!-- v-has="{ red: 'addBox', type: 1 }" -->
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        @click="toDel"
        v-has="{ red: 'miniProgramInformationDelete', type: 1 }"
        >删除</el-button
      >
    </div>

    <div class="content_box">
      <el-table
        :data="list"
        ref="eTable"
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
        <el-table-column label="资讯分类" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ scope.row.consultType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" min-width="90px" align="center">
          <template slot-scope="scope">
            <div class="content" :key="scope.row.id">
              <el-popover placement="top-start" width="500" trigger="click">
                <img
                  :src="scope.row.banner ? scope.row.banner : scope.row.banner"
                  width="100%"
                  style="margin-right:5px"
                />
                <img
                  v-if="scope.row.banner !== '' && scope.row.banner !== null"
                  slot="reference"
                  :src="scope.row.banner"
                  width="48"
                  height="36"
                  style="margin-right:5px"
                />
                <!-- :src="
                    scope.row.banner + '?x-oss-process=image/resize,h_36,w_48'
                  " -->
                <span v-else>
                  <div min-width="48" height="36"></div>
                </span>
              </el-popover>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="链接类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="content">{{ getTypeName(scope.row.urlType) }}</span>
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
              @click="toUpdate(scope.row)"
              v-has="{ red: 'miniProgramInformationEdit', type: 1 }"
            >
              编辑
            </span>
            <span
              class="operation_button update_btn"
              style="width:100px"
              @click="toDetial(scope.row)"
              v-has="{ red: 'miniProgramInformationDetails', type: 1 }"
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
  consultList, //小程序资讯分页
  consultDel //小程序资讯删除
} from "@/api/operationManagement";
import Dialog from "./components/dialog";
import { fieldTable } from "@/api/common";

export default {
  name: "MiniProgramInformation",
  components: { Dialog },
  data() {
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        urlType: null //链接类型
      },
      selGateway: null,
      urlTypes: [
        {
          enumValue: 0,
          enumName: "无"
        },
        {
          enumValue: 1,
          enumName: "站内链接"
        },
        {
          enumValue: 2,
          enumName: "站外小程序"
        },
        {
          enumValue: 3,
          enumName: "站外网页"
        }
      ],
      listLoading: false, //加载
      list: [] //信息
    };
  },
  created() {
    this.toSearchList();
  },

  methods: {
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
        urlType: null //链接类型
      };
      this.openLoading();
      this.$refs.eTable.clearSort();
      this.getList();
    },
    getTypeName(type) {
      let name;
      this.urlTypes.forEach(el => {
        if (type == el.enumValue) {
          name = el.enumName;
        }
      });
      return name;
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

    //获取用户列表
    getList() {
      let para = this.listQuery;
      consultList(para)
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
        let text = "确认批量删除资讯吗?";
        if (this.selGateway.length == 1) {
          text = "确认删除该资讯吗?";
        }

        this.$confirm(text, "提示", {
          type: "warning"
        }).then(() => {
          consultDel(arr.toString()).then(response => {
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
          message: "请选择删除的资讯"
        });
      }
    },

    //编辑
    toUpdate(e) {
      let id = e.id;
      this.$refs.dialog.showDialog(id, 2);
    },
    //详情
    toDetial(e) {
      let id = e.id;
      this.$refs.dialog.showDialog(id, 3);
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
