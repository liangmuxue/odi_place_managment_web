<template>
  <div>
    <el-dialog
      :visible.sync="dialogTableVisible"
      width="800px"
      center
      title="录像下载"
      class="dialog1"
    >
      <!-- :show-close="false" -->
      <div class="dialog_body">
        <!-- <div class="dialog_tittle">录像下载</div>
        <div class="dialog_close" @click="dialogTableVisible = false"></div> -->
        <div class="dialog_content">
          <el-table
            :data="videoList"
            v-if="dialogTableVisible"
            fit
            highlight-current-row
            style="width: 99%"
            size="mini"
            height="410"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              label="视频名称"
              min-width="60px"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span class="content">{{ scope.row.showName }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="base_dialog_main_btnBox">
            <el-button
              type="info"
              style="padding:10px 20px"
              @click="downloadVideo"
              >下载</el-button
            ><el-button
              type="danger"
              style="padding:10px 20px"
              @click="closeDialog"
              >取消</el-button
            >
          </div>

          <!-- <div class="dialog_footer">
            <div class="footer_button1" @click="closeDialog">取消</div>
            <div class="footer_button2" @click="downloadVideo">下载</div>
          </div> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // props: ["ParentComponentParam"],
  data() {
    return {
      dialogTableVisible: false, //详情弹窗
      videoList: [],
      selVideoList: []
    };
  },
  created() {},
  methods: {
    handleSelectionChange(data) {
      this.selVideoList = data;
    },
    showDialog(list) {
      this.videoList = [];
      this.selVideoList = [];
      this.dialogTableVisible = true;
      this.videoList = list;
    },
    //关闭弹窗
    closeDialog() {
      this.dialogTableVisible = false;
    },
    //下载视频
    downloadVideo() {
      this.dialogTableVisible = false;
      let vieloList = this.selVideoList;
      this.GLOBAL.downloadVideo(vieloList);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog_body {
  position: relative;
  // background-image: url("../../../../assets/images/addEquipment/bg_header.png");
  // background-size: 348px 206px;
  // background-repeat: no-repeat;
  padding: 0 12px;
  width: 99%;
  .dialog_tittle {
    font-size: 18px;
    width: 196px;
    text-align: center;
    color: #fff;
    float: left;
    margin-top: -24px;
  }
  .dialog_close {
    display: block;
    position: absolute;
    right: 10px;
    margin: 0px;
    width: 16px;
    height: 16px;
    // background-image: url("../../../../assets/images/equipmentList/close_white.png");
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    cursor: pointer;
  }
  .dialog_content {
    height: 520px;
    // background-image: url("../../../../assets/images/addEquipment/bg.png");
    // background-size: 100% 520px;
    // background-repeat: no-repeat;
    padding: 30px 30px 0;
    .base_dialog_main_btnBox {
      margin: 20px auto 0;
      height: 54px;
      width: 180px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
