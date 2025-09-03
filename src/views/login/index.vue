<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login_form"
      autocomplete="on"
      label-position="left"
    >
      <div class="inputAndButton">
        <div class="inputAndButton_top">
          <img
            src="@/assets/images/login/logo.png"
            class="inputAndButton_top_img"
          />
        </div>
        <div class="inputAndButton_top2">Hi-car 海创停车场管理系统</div>
        <el-form-item
          prop="username"
          class="input-box"
          style="margin-top: 30px"
        >
          <!-- <span class="svg-container">
            <img src="@/assets/images/login/username.png" />
          </span> -->
          <!-- <img src="@/assets/images/login/interval.png" class="input-interval" /> -->
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入账户名称"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
            class="input-content"
          />
        </el-form-item>

        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password" class="input-box">
            <!-- <span class="svg-container">
              <img src="@/assets/images/login/password.png" />
            </span> -->
            <!-- <img src="@/assets/images/login/interval.png" class="input-interval" /> -->
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
              class="input-content"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-form-item class="button-box">
          <el-button type="primary" class="login-button" @click="handleLogin"
            >登录</el-button
          >
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from "@/utils/validate";
// import SocialSign from "./components/SocialSignin";
import { setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

export default {
  name: "Login",
  // components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("账户名称不能为空"));
      } else {
        // let userNameTest = validUsername(value);
        // this.$nextTick(() => {
        //   if (!userNameTest) {
        //     callback(new Error("请输入正确用户名"));
        //   } else {
        callback();
        //   }
        // });
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度为 6 - 32位"));
      } else if (value.length > 32) {
        callback(new Error("密码长度为 6 - 32位"));
      } else {
        callback();
      }
    };
    const validateVerificationCode = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("请输入验证码"));
      } else if (value !== this.code) {
        callback(new Error("请输入正确验证码"));
      } else {
        callback();
      }
    };
    return {
      code: "",
      list: {
        SYS_AUTHORIZATION: "",
        SYS_BG_IMAGE: "",
        SYS_BROWSER_ICO: "",
        SYS_LOGO: "",
        SYS_NAME: "",
        SYS_REFERENCE: "",
        SYS_VERSION: ""
      },
      loginForm: {
        username: "",
        password: "",
        verificationCode: ""
      },
      loginRules: {
        username: [
          { required: false, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        verificationCode: [
          {
            required: true,
            trigger: "blur",
            validator: validateVerificationCode
          }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.createCode();
    this.getList();
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getList() {
      //获取系统信息
      // let queryList = {};
      // infoMap(queryList).then(res => {
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

    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      setToken("");
      removeToken();
      resetRouter();

      // this.$router.push({
      //   path: "/homePage",
      // }); //登录成功，向首页跳转

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const form = {};
          form.username = this.loginForm.username;
          // form.password = this.$md5(this.loginForm.password); //登录密码加密
          form.password = this.loginForm.password; //登录密码加密
          this.$store
            .dispatch("user/login", form) //将form传入store--user中的login方法
            .then(() => {
              console.log("login ok"); //点击登录之后，在加载router之前会触发permission中的router.beforeEach周期
              this.$router.push({
                // path: this.redirect || "/",
                path: "/",
                query: this.otherQuery
              }); //登录成功，向首页跳转
              this.loading = false;
              // setTimeout(() => {
              //   location.reload();
              // }, 3000);
            })
            .catch(() => {
              console.log("login fail");
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    createCode() {
      this.code = "";
      var codeLength = 6; //验证码的长度
      // var checkCode = document.getElementById("checkCode");
      var random = new Array(
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ); //随机数
      for (var i = 0; i < codeLength; i++) {
        //循环操作
        var charIndex = Math.floor(Math.random() * 36); //取得随机数的索引
        this.code += random[charIndex]; //根据索引取得随机数加到code上
      }
    }
    // //校验验证码
    // validate() {
    //   var inputCode = "";
    //   if (this.loginForm.verificationCode) {
    //     inputCode = this.loginForm.verificationCode.toUpperCase(); //取得输入的验证码并转化为大写
    //   }
    //   if (inputCode.length <= 0) {
    //     //若输入的验证码长度为0
    //     alert("请输入验证码！"); //则弹出请输入验证码
    //   } else if (inputCode != this.code) {
    //     //若输入的验证码与产生的验证码不一致时
    //     alert("验证码输入错误！"); //则弹出验证码输入错误
    //     createCode(); //刷新验证码
    //   } else {
    //     //输入正确时
    //     alert("^-^"); //弹出^-^
    //   }
    // }

    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  height: 100%;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    color: #333;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      font-size: 20px;
      font-weight: bold;
      height: 47px;
      caret-color: $cursor;
      color: #333;
      &:-webkit-autofill {
        // box-shadow: 0 0 0px 10px rgba(60, 150, 240, 0.4) inset !important;
        // -webkit-text-fill-color: $cursor !important;
        -webkit-text-fill-color: #999 !important;
        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        background-color: transparent;
        background-image: none;
        transition: background-color 50000s ease-in-out 0s; //背景色透明 生效时长 过渡效果 启用时延迟的时间
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.form-title {
  position: absolute;
  left: 43%;
  top: 27%;
  color: white;
  font-size: 24px;
}
.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  background-image: url("../../assets/images/login/bg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;

  .login_form {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: calc(50vh - 300px) auto;
    overflow: hidden;
    padding-top: 1%;
    .inputAndButton {
      width: 678px;
      height: 480px;
      position: relative;
      background: #fff;
      margin: 70px auto;
      .inputAndButton_top {
        position: absolute;
        top: -72px;
        left: 267px;
        width: 144px;
        height: 144px;
        border-radius: 72px;
        background: #fff;
        .inputAndButton_top_img {
          width: 80px;
          height: 80px;
          margin: 20px 32px;
        }
      }
      .inputAndButton_top2 {
        position: relative;
        width: 400px;
        height: 110px;
        line-height: 40px;
        font-size: 32px;
        margin: 40px auto;
        padding-top: 70px;
        text-align: center;
        color: #666;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .input-box {
    margin: 60px;
    height: 40px;
    background: #fff;
    color: #333;

    .input-content {
      position: absolute;
      top: 8px;
      left: 60px;
      width: 441px;
      height: 57px;
      border: 1px solid #caecd4;
      border-radius: 2px;
    }
    .input-interval {
      position: absolute;
      top: 5px;
    }
  }
  .verificationCode {
    display: inline-block;
    margin-left: 20px;
    height: 60px;
    width: 120px;
    line-height: 60px;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
  }
  .button-box {
    margin-top: 12%;
    position: relative;
    background: transparent;
  }
  .checkPassword {
    position: absolute;
    left: 480px;
    top: -60px;
    color: #fff;
    font-size: 16px;
  }
  .login-button {
    width: 210px;
    height: 60px;
    margin: 0 234px;
    font-size: 30px;
    text-align: center;
    color: #fff;
  }
  .svg-container {
    text-align: center;
    padding-top: 7px;
    font-size: 34px;
    color: #8cecf7;
    width: 58px;
    height: 58px;
    line-height: 58px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 20px;
    top: 10px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
/deep/.el-form-item__error {
  margin-left: 80px;
  margin-top: 70px;
  font-size: 14px;
}
/deep/input {
  caret-color: #999 !important ;
}
/deep/.el-form-item__error {
  color: #22ae6c;
}
</style>
