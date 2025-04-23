<template>
  <div class="navbar">
    <div class="navbar-head">
      <img src="../../assets/images/logo.png" class="navbar-head-logo" />
    </div>

    <!-- 侧边栏缩进工具-->
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />-->

    <!-- 面包屑-->
    <!-- <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <!-- <div class="sidebar-btn" @click="changeSidebar"></div> -->
    <div class="right-menu">
      <template v-if="device !== 'mobile'"> </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <div class="user-avatar">
            <div class="el-icon-caret-name">
              {{ roleName }}： {{ username }}
            </div>
          </div>
          <img src="@/assets/images/user-pic.png" alt="" class="user-pic" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display: block" @click="changePassWord"
              ><i class="el-icon-key"></i>修改密码</span
            >
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display: block" @click="logout"
              ><i class="el-icon-right"></i>退出登陆</span
            >
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 修改密码 -->
      <el-dialog
        :visible.sync="dialogFormVisible"
        width="45%"
        title="修改密码"
        center
        class="dialog_navber"
      >
        <div class="base_dialog_main_content">
          <el-form :model="newList" :rules="rules" ref="userForm">
            <div class="base_dialog_main_content">
              <div class="base_dialog_main_left" style="padding:20px 80px">
                <span class="base_dialog_condit">
                  <el-form-item label="原密码" prop="password">
                    <el-input
                      v-model="newList.password"
                      placeholder="请输入原密码"
                      style="width: 72%"
                      class="filter-item"
                      size="small"
                    />
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="新密码" prop="newPassword">
                    <el-input
                      v-model="newList.newPassword"
                      placeholder="请输入新密码"
                      style="width: 72%"
                      class="filter-item"
                      size="small"
                    />
                  </el-form-item>
                </span>
                <span class="base_dialog_condit">
                  <el-form-item label="确认密码" prop="newPassword2">
                    <el-input
                      v-model="newList.newPassword2"
                      placeholder="请再次输入新密码"
                      style="width: 72%"
                      class="filter-item"
                      size="small"
                    />
                  </el-form-item>
                </span>
              </div>
            </div>
          </el-form>
          <div class="base_dialog_main_btnBox" style="padding-bottom:30px">
            <el-button type="info" icon="el-icon-circle-plus" @click="toSave"
              >保存</el-button
            ><el-button type="danger" icon="el-icon-error" @click="closeDialog"
              >取消</el-button
            >
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Breadcrumb from "@/components/Breadcrumb";
// import Hamburger from "@/components/Hamburger";
// import ErrorLog from "@/components/ErrorLog";
// import SizeSelect from "@/components/SizeSelect";
// import Search from "@/components/HeaderSearch";
import user from "@/store/modules/user"; // has directive
// import { uesrDetail } from "@/api/systemset";
// import { infoMap } from "@/api/systemset";

import { getUserName, getRoleName } from "@/utils/auth"; // get token from cookie
import {
  userUpdatePwd //重置密码
} from "@/api/systemset";

export default {
  components: {
    // Breadcrumb,
    // Hamburger,
    // ErrorLog,
    // SizeSelect,
    // Search,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "sysList"])
  },
  data() {
    const validatepassword = (rule, value, callback) => {
      if (this.newList.newPassword !== value) {
        callback(new Error("新密码两次输入不一致"));
      } else {
        callback();
      }
    };

    return {
      picShow: true,
      userName: "",
      websock: "",
      code: "", //随机码
      dialogFormVisible: false, //关于系统
      boxList: [], //盒子列表
      listQuery: {
        currentPage: 1, //当前页数
        pageSize: 10, //每页数量
        total: 0, // 数据总条数
        eqBoxId: "" //盒子编号
      },
      username: "",
      roleName: "",
      dateTime: "", //时间
      gisTypeOption: [], // 坐标体系数据源
      selectVillageGis: {
        lon: "", //经度
        lat: "" // 纬度
      }, //选中区划的坐标
      newList: {
        userId: null, //主键
        userName: "", //用户名
        password: "", //原密码
        newPassword: "", //新密码
        newPassword2: "" //确认密码
      },
      rules: {
        password: [
          { required: true, message: "请输入原密码", trigger: "blur" }
          // {
          //   pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{6,32}$/,
          //   message:
          //     "请输入6-32个以内的字符，输入字符必须包含大小写、数字、特殊字符等三种以上组合",
          //   trigger: "blur"
          // }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{6,32}$/,
            message:
              "请输入6-32个以内的字符，输入字符必须包含大小写、数字、特殊字符等三种以上组合",
            trigger: "blur"
          }
        ],
        newPassword2: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          {
            required: true,
            message: "用户名已存在",
            trigger: "blur",
            validator: validatepassword
          }
        ]
      },

      list: {
        SYS_AUTHORIZATION: "",
        SYS_BG_IMAGE: "",
        SYS_BROWSER_ICO: "",
        SYS_LOGO: "",
        SYS_NAME: "",
        SYS_REFERENCE: "",
        SYS_VERSION: ""
      }, //系统信息
      notifications: [],
      componentParams_map: {
        drawType: "village"
      }
    };
  },
  beforeCreate() {
    if (this.GLOBAL.ws.url) {
      this.websock = this.GLOBAL.ws;
      this.websock.close();
    }
  },
  mounted() {
    console.log(user.state);
    this.userName = user.state.userName;
    this.newList.userName = user.state.userName;
    this.newList.userId = user.state.userId;
    this.dateTime = new Date();
    this.getList();

    this.userId = this.$store.getters.userId;
    // this.getcode(); //生成随机码
    this.username = getUserName();
    this.roleName = getRoleName();
  },
  methods: {
    getList() {
      this.listLoading = false;
      let para = { opUserId: this.$store.getters.userId };
      // //获取账户信息
      // uesrDetail(para, this.tenantId).then(response => {
      //   this.newList = response.data;
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false;
      //   }, 1000);
      // });
      // //获取系统信息
      // let queryList = {};
      // infoMap(queryList, this.tenantId).then(res => {
      //   this.$store.dispatch("user/setSysList", res.data);
      //   this.list = this.$store.getters.sysList;
      //   var link =
      //     document.querySelector("link[rel*='icon']") ||
      //     document.createElement("link");
      //   link.type = "image/x-icon";
      //   link.rel = "shortcut icon";
      //   link.href = this.list.SYS_BROWSER_ICO;
      //   document.getElementsByTagName("head")[0].appendChild(link);
      // });
    },
    //修改侧边栏状态
    changeSidebar() {
      this.picShow = !this.picShow;
      console.log(111, document.getElementsByClassName("el-loading-mask"));

      if (document.getElementsByClassName("el-loading-mask").length > 0) {
        let arr = document.getElementsByClassName("el-loading-mask");
        if (this.picShow) {
          arr[0].classList.add("hasSidebar");
          arr[0].classList.remove("noSidebar");
        } else {
          arr[0].classList.add("noSidebar");
          arr[0].classList.remove("hasSidebar");
        }
      }
      this.$store.dispatch("app/toggleSideBar");
    },
    // 切换页码方法
    handleSizeChange(val) {
      this.listQuery.currentPage = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    // 切换每页显示的方法
    handleCurrentChange(val) {
      this.listQuery.currentPage = val;
    },

    //生成随机码并开启websocket
    getcode() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      this.code = uuid;
      this.GLOBAL.setCode(uuid);
      this.openWebsocket();
    },
    /*************** webSocket ****************/
    openWebsocket() {
      const wsuri = "ws://192.168.0.98:8083/faceServer";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
      this.GLOBAL.setWs(this.websock);
    },
    initWebSocket() {
      // 初始化weosocket
      this.websock = this.GLOBAL.ws;
      this.webType = this.GLOBAL.wsType;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      let code = this.code;
      let str = this.userId + "_" + code;
      let org = { type: "register", userId: str };
      this.websocketsend(JSON.stringify(org));
      console.log("连接成功", JSON.stringify(org));
      this.reconnectNo = 0;
    },
    websocketonerror() {
      //连接建立失败重连
      console.log("重连次数", this.reconnectNo);
      if (this.reconnectNo < 10) {
        setTimeout(() => {
          this.initWebSocket();
          this.reconnectNo = this.reconnectNo + 1;
        }, 10000);
      }
    },

    websocketonmessage(e) {
      console.log("接收消息", e);
      const redata = JSON.parse(e.data.replace(/[\r\n]/g, ""));
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
      // this.initWebSocket();
      this.websocketonerror();
    },
    /*************** webSocket ****************/

    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    changePassWord() {
      this.dialogFormVisible = true;
    },
    //关闭新增/编辑设备弹窗
    closeDialog() {
      this.dialogFormVisible = false;
    },
    //点击保存按钮
    toSave() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交修改密码吗?", "提示", {
            type: "warning"
          }).then(() => {
            let para = this.newList;
            userUpdatePwd(para)
              .then(response => {
                if (response.code == "200") {
                  this.dialogFormVisible = false;
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                } else {
                  this.$message({
                    type: "warning",
                    message: "提交失败"
                  });
                }
              })
              .catch(() => {
                this.$message({
                  type: "warning",
                  message: "提交失败"
                });
              });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    logout() {
      let para = {};
      para.username = getUserName();
      this.$confirm("是否退出登陆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("user/logout", para).then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-dropdown-menu {
  width: 240px;
  // background: #20262d;
  margin-right: -15px;
  .el-dropdown-menu__item {
    // color: #fff;
    font-weight: bold;
    border: 0;
  }
  .el-dropdown-menu__item:hover {
    color: #fff;
    background: #037659;
    font-weight: bold;
    border: 0;
  }
}
.dialog_navber {
  .base_dialog_main_content {
    text-align: center;
    padding-top: 20px;
  }
}
.selectButton {
  width: 68px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  color: #6ca6e8;
  background: #fff;
  border: 1px solid #6ca6e8;
  border-radius: 14px;
  margin: 0 auto;
  cursor: pointer;
}
.selectButton2 {
  width: 68px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  color: #ddd;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 14px;
  margin: 0 auto;
  cursor: no-drop;
}
.selectedButton {
  width: 68px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  color: #fff;
  background: #f68104;
  border: 1px solid #fff;
  border-radius: 14px;
  margin: 0 auto;
  cursor: pointer;
}

.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  .navbar-head {
    float: left;
    padding-left: 20px;
    height: 60px;
    width: 500px;
    .navbar-head-logo {
      float: left;
      height: 60px;
      width: 500px;
    }
    .navbar-head-title {
      padding-left: 10px;
      float: left;
      height: 60px;
      line-height: 60px;
      font-size: 29px;
      color: #fff;
    }
  }

  .hamburger-container {
    background: #5a5e66;
    line-height: 46px;
    height: 46px;
    float: left;
    margin-left: 40px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .sidebar-btn {
    float: left;
    margin: 25px 10px;
    width: 20px;
    height: 20px;
    background-image: url("../../assets/images/sidebar-btn.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .right-menu {
    float: right;
    width: 240px;
    padding: 10px;
    margin: 10px;
    height: 40px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      width: 200px;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .selectBox {
      float: left;
      height: 38px;
      color: #fff;
      cursor: pointer;
      margin-right: 20px;
    }
    .right-menu-icon {
      float: left;
      height: 38px;
      font-size: 32px;
      margin-right: 10px;
      padding-top: 2px;
    }
    .right-menu-icon-text {
      float: left;
      height: 38px;
      line-height: 38px;
      font-size: 16px;
      margin-right: 10px;
    }
    .avatar-container {
      float: right;
      width: 240px;
      margin-right: 15px;

      .avatar-wrapper {
        position: relative;
        right: 0px;
        width: 240px;
        .user-pic {
          float: right;
          cursor: pointer;
          width: 24px;
          height: 24px;
          overflow: hidden;
        }
        .user-avatar {
          float: right;
          width: 210px;
          display: inline-block;
          height: 24px;
          line-height: 24px;
          font-size: 16px;
          cursor: pointer;
          padding-left: 5px;
          .el-icon-caret-name {
            width: 200px;
            height: 24px;
            line-height: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333;
            font-weight: bold;
          }
        }
        .el-icon-caret-bottom {
          display: inline-block;
          height: 18px;
          line-height: 18px;
          padding-right: 20px;
          margin-top: 10px;
          float: right;
          font-size: 14px;
        }
        // .map-box{
        //   z-index: 10000;
        // }
      }
    }
  }
}
.alarm_card {
  position: fixed;
  z-index: 1100;
  width: 300px;
  height: 150px;
  background: #fff;
  right: 3px;
  bottom: 3px;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #6ca6e8;
  .alarm_card_top {
    width: 300px;
    height: 26px;
    background: #6ca6e8;
    display: flex;
    .alarm_card_top_name {
      width: 250px;
      height: 26px;
      line-height: 26px;
      margin: 0 10px;
      color: #fff;
    }
    .alarm_card_top_close {
      width: 16px;
      height: 16px;
      line-height: 26px;
      margin: 5px;
      background-image: url("../../assets/images/equipmentList/close2.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
  .alarm_card_content {
    width: 300px;
    height: 100px;
    background: #fff;
    display: flex;
    .alarm_card_content_left {
      width: 80px;
      height: 100px;
      .alarm_card_content_left_pic {
        width: 66px;
        height: 85px;
        margin: 7px;
      }
    }
    .alarm_card_content_right {
      height: 100px;
      flex: 1;
      padding: 10px;
      .alarm_card_alarmName {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        color: #333;
      }
      .alarm_card_peopleName {
        height: 36px;
        line-height: 36px;
        font-size: 20px;
        color: #d91512;
      }
      .alarm_card_alarmTime {
        height: 20px;
        line-height: 20px;
        color: #333;
        font-size: 14px;
      }
    }
  }
  .alarm_card_footer {
    height: 24px;
    display: flex;
    color: #333;
    font-size: 14px;
    .alarm_card_icon {
      width: 14px;
      height: 14px;
      margin: 3px 8px;
      background-image: url("../../assets/images/equipmentList/camera2.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .alarm_card_cameraName {
      height: 24px;
      line-height: 20px;
      color: #6ca6e8;
    }
  }
  .alarm_card_button {
    position: absolute;
    right: 5px;
    bottom: 5px;
    width: 66px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    color: #6ca6e8;
    border: 1px solid #6ca6e8;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
  }
}
/deep/ .el-dialog__body {
  padding: 10px 30px;
}
</style>

<style lang="scss">
.dialog_navber {
  .el-dialog__headerbtn {
    margin-top: -10px;
    margin-right: -10px;
  }
  .el-form-item__label {
    width: 80px;
    text-align: left;
  }
}
</style>
