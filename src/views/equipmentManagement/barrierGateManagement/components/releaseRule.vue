<template>
  <div class="base_dialog" v-if="isShow">
    <div class="base_dialog_top">
      {{ title }}
      <div class="base_dialog_close" @click="closeDialog">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="base_dialog_main">
      <el-form :model="newList" :rules="rules" ref="parkingForm">
        <div
          v-for="(item, index) in newList.data"
          :key="index"
          class="releaseRule_box"
        >
          <div class="releaseRule_title">
            <div class="releaseRule_title_t">规则{{ index + 1 }}</div>
            <div
              class="releaseRule_close"
              v-if="newList.data.length > 1"
              @click="delRule(index)"
            >
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="releaseRule_mian">
            <span class="releaseRule_err1">
              <el-form-item
                label="放行时段"
                :prop="'data.' + index"
                :rules="rules['weekDays']"
              >
                <div class="form_itembox">
                  <div class="form_itemBox_text" v-if="item.releaseType == 1">
                    (全天放行不分时段)
                  </div>
                  <div class="form_itemBox_text" v-else>
                    (分时段放行请勾选允许放行日，并配置放行时段)
                  </div>

                  <div class="form_btnbox">
                    <div
                      :class="item.releaseType == 1 ? 'form_btn1' : 'form_btn2'"
                      @click="changeType(item)"
                    >
                      全天
                    </div>
                    <div
                      :class="item.releaseType == 2 ? 'form_btn1' : 'form_btn2'"
                      @click="changeType2(item)"
                    >
                      分时段
                    </div>
                  </div>
                  <div>
                    <div class="form_selbox" v-if="item.releaseType == 2">
                      <div class="form_selbox_title">星期</div>
                      <el-checkbox-group v-model="item.weekDays">
                        <el-checkbox
                          v-for="weekDays in weekList"
                          :label="weekDays.id"
                          :key="weekDays.id"
                          >{{ weekDays.text }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </div>
                    <!-- <div class="form_selbox" v-if="item.releaseType == 2">
                    <div class="form_selbox_title">时段</div>
                    <el-time-picker
                      v-for="(t, i) in item.timeList"
                      :key="i"
                      v-model="item.timeList[i].times"
                      is-range
                      value-format="HH:mm:ss"
                      size="mini"
                      style="width:180px;margin-right:10px"
                      placeholder="选择时间范围"
                    >
                    </el-time-picker>
                  </div> -->
                  </div>
                </div>
              </el-form-item>
              <el-form-item
                :prop="'data.' + index"
                :rules="rules['times']"
                v-if="item.releaseType == 2"
              >
                <div class="form_itembox">
                  <div class="form_btnbox_n"></div>
                  <div>
                    <div class="form_selbox" v-if="item.releaseType == 2">
                      <div class="form_selbox_title">时段</div>
                      <el-time-picker
                        v-for="(t, i) in item.timeList"
                        :key="i"
                        v-model="item.timeList[i].times"
                        is-range
                        value-format="HH:mm:ss"
                        size="mini"
                        style="width:180px;margin-right:10px;margin-top:4px"
                        @change="pickerChange(item.timeList, t, i)"
                        placeholder="选择时间范围"
                      >
                      </el-time-picker>
                      <div
                        class="timeAddBtn"
                        @click="addTimes(item.timeList)"
                        v-if="item.timeList.length < 4"
                      >
                        +添加时段
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </span>

            <el-form-item
              label="放行车辆"
              :prop="'data.' + index"
              :rules="rules['releaseCarTypes']"
            >
              <div class="form_itembox">
                <div class="form_itemBox_text">
                  (请勾选允许道闸放行的车辆)
                </div>

                <div class="form_selbox">
                  <el-checkbox-group v-model="item.releaseCarTypes">
                    <el-checkbox
                      v-for="releaseCarType in carList"
                      :label="releaseCarType.id"
                      :key="releaseCarType.id"
                      @change="releaseCarTypesChange(item, releaseCarType)"
                      >{{ releaseCarType.text }}</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="addRulesBtn" @click="addRules" v-if="newList.data.length < 7">
        +添加规则
      </div>
      <div class="base_dialog_main_btnBox">
        <el-button type="info" @click="toSave">保存</el-button
        ><el-button type="danger" @click="closeDialog">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  barrierRuleBarrier, //获取道闸全部规则
  barrierRuleEdit //编辑道闸规则
} from "@/api/equipmentManagement";

export default {
  components: {},
  data() {
    const validateWeekDays = (rule, value, callback) => {
      if (value.releaseType == 2) {
        if (!value.weekDays || value.weekDays.length < 1) {
          callback(new Error("请勾选放行日"));
        }
        callback();
      }
      callback();
    };
    const validateTimes = (rule, value, callback) => {
      function hasOverlap(timeList) {
        for (let i = 0; i < timeList.length; i++) {
          for (let j = i + 1; j < timeList.length; j++) {
            const a = timeList[i];
            const b = timeList[j];
            if (a.startTime < b.endTime && a.endTime > b.startTime) {
              return true; // 存在重叠
            }
          }
        }
        return false; // 无重叠
      }
      if (value.releaseType == 2) {
        if (!value.timeList || value.timeList.length < 1) {
          callback(new Error("请配置放行时段"));
        } else if (value.timeList.length == 1 && !value.timeList[0].times) {
          callback(new Error("请配置放行时段"));
        } else if (value.timeList.length > 1) {
          let hasOver = hasOverlap(value.timeList);
          if (hasOver) {
            callback(new Error("放行时段不可重叠"));
          }
          callback();
        }
      }
      callback();
    };
    const validateReleaseCarTypes = (rule, value, callback) => {
      if (!value.releaseCarTypes || value.releaseCarTypes.length < 1) {
        callback(new Error("请勾选允许道闸放行的车辆"));
      }
      callback();
    };

    return {
      title: "放行规则",
      isShow: false,
      barrierId: null,
      newList: {
        data: [
          {
            barrierId: this.barrierId,
            releaseType: 1,
            weekDays: [1, 2, 3, 4, 5, 6, 7],
            releaseCarTypes: [],
            sort: 1,
            status: 1,
            remark: null,
            timeList: []
          }
        ]
      }, //规则列表
      weekList: [
        { id: 1, text: "星期一" },
        { id: 2, text: "星期二" },
        { id: 3, text: "星期三" },
        { id: 4, text: "星期四" },
        { id: 5, text: "星期五" },
        { id: 6, text: "星期六" },
        { id: 7, text: "星期日" }
      ],
      carList: [
        { id: 1, text: "全部" },
        { id: 2, text: "白名单" },
        { id: 3, text: "长租车" },
        { id: 4, text: "限免车" },
        { id: 5, text: "内部临停车" },
        { id: 6, text: "外来临停车" }
      ],
      rules: {
        weekDays: [
          {
            required: true,
            trigger: "change",
            validator: validateWeekDays
          }
        ],
        times: [
          {
            required: true,
            trigger: "change",
            validator: validateTimes
          }
        ],
        releaseCarTypes: [
          {
            required: true,
            trigger: "change",
            validator: validateReleaseCarTypes
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    //打开注册、编辑道闸弹窗
    showDialog(id) {
      this.isShow = true;
      this.getDetials(id);
    },
    //获取详情
    getDetials(id) {
      this.barrierId = id;
      let para = { barrierId: id };
      barrierRuleBarrier(para).then(response => {
        this.newList = { data: response.data };
        this.newList.data.forEach(el => {
          if (el.releaseType == 2) {
            if (el.timeList) {
              el.timeList.forEach(e => {
                let times = [e.startTime, e.endTime];
                this.$set(e, "times", times);
              });
            } else {
              el.timeList = [{ times: ["00:00:00", "23:59:59"] }];
            }
          }
        });
      });
    },
    //切换全天
    changeType(item) {
      item.releaseType = 1;
      item.weekDays = [1, 2, 3, 4, 5, 6, 7];
      item.timeList = [];
    },
    //切换分时段
    changeType2(item) {
      item.releaseType = 2;
      item.weekDays = [];
      item.timeList = [
        {
          times: ["00:00:00", "23:59:59"],
          startTime: "00:00:00",
          endTime: "23:59:59"
        }
      ];
    },
    //时间选择
    pickerChange(timeList, t, i) {
      if (t.times) {
        t.startTime = t.times[0];
        t.endTime = t.times[1];
      }
      if (!t.times && timeList.length > 1) {
        timeList.splice(i, 1);
      }
      // this.$refs.formRef.validateField("times");
    },
    //添加时段
    addTimes(timeList) {
      let newTimes = {
        times: null,
        startTime: "",
        endTime: ""
      };
      timeList.push(newTimes);
    },
    //
    releaseCarTypesChange(item, releaseCarType) {
      let releaseCarTypes = item.releaseCarTypes;
      if (releaseCarType.id == 1) {
        if (releaseCarTypes.indexOf(1) === -1) {
          releaseCarTypes = [];
        } else {
          releaseCarTypes = [1];
        }
      } else {
        if (releaseCarTypes.indexOf(1) !== -1) {
          releaseCarTypes.splice(releaseCarTypes.indexOf(1), 1);
          if (releaseCarTypes.length == 0 && releaseCarType.id !== 1) {
            releaseCarTypes = [releaseCarType.id];
          }
        }
        if (releaseCarTypes.length == 5) {
          releaseCarTypes = [1];
        }
      }
      this.$set(item, "releaseCarTypes", releaseCarTypes);
    },
    //关闭新增/编辑道闸弹窗
    closeDialog() {
      this.isShow = false;
      this.$emit("openLoading", {});
      this.$emit("getList", {});
    },
    //添加新规则
    addRules() {
      let newRule = {
        barrierId: this.barrierId,
        releaseType: 1,
        weekDays: [1, 2, 3, 4, 5, 6, 7],
        releaseCarTypes: [],
        sort: this.newList.data.length,
        status: 1,
        remark: null,
        timeList: []
      };
      this.newList.data.push(newRule);
    },
    //删除规则
    delRule(i) {
      this.newList.data.splice(i, 1);
    },
    //点击保存按钮
    toSave() {
      this.$refs["parkingForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交编辑的放行规则吗?", "提示", {
            type: "warning"
          }).then(() => {
            this.isShow = false;
            this.$emit("openLoading", {});
            let para = [];
            this.newList.data.forEach((el, i) => {
              let newTimeList = [];
              el.timeList.forEach((e, j) => {
                newTimeList.push({
                  startTime: e.startTime,
                  endTime: e.endTime,
                  sort: j + 1
                });
              });
              if (el.releaseType == 1) {
                newTimeList = null;
              }
              let newEl = {
                barrierId: el.barrierId,
                ruleName: "规则" + i + 1,
                releaseType: el.releaseType,
                weekDays: el.weekDays,
                releaseCarTypes: el.releaseCarTypes,
                sort: i + 1,
                status: el.status,
                remark: el.remark,
                timeList: newTimeList
              };
              para.push(newEl);
            });
            console.log(123, para);
            barrierRuleEdit(para)
              .then(response => {
                if (response.code == "200") {
                  this.$message({
                    type: "success",
                    message: "提交成功"
                  });
                } else {
                  // this.$message({
                  //   type: "error",
                  //   message: "提交失败"
                  // });
                }
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              })
              .catch(() => {
                // this.$message({
                //   type: "error",
                //   message: "提交失败"
                // });
                setTimeout(() => {
                  this.$emit("getList", {});
                }, 300);
              });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.base_dialog_main {
  overflow: auto;
  .releaseRule_box {
    min-height: 200px;
    box-shadow: 0px 3px 10px 0px rgba(188, 200, 198, 0.52);
    border: 1px solid #daf2ec;
    margin: 10px;
    .releaseRule_title {
      height: 30px;
      line-height: 30px;
      background: linear-gradient(0deg, #ffffff, #def8f2);
      .releaseRule_title_t {
        float: left;
        height: 24px;
        line-height: 24px;
        border-left: 4px solid #037659;
        margin: 3px 10px;
        color: #037659;
        padding-left: 10px;
      }
      .releaseRule_close {
        float: right;
        cursor: pointer;
        height: 24px;
        line-height: 24px;
        font-size: 20px;
        margin: 3px 10px;
        color: #037659;
        padding-left: 10px;
      }
    }
    .releaseRule_mian {
      padding-left: 20px;
      .form_itembox {
        width: 100%;
        display: flex;
        position: relative;
        .form_itemBox_text {
          position: absolute;
          top: -36px;
          left: 80px;
          font-size: 14px;
          color: #ccc;
        }
        .form_btnbox {
          width: 180px;
          height: 30px;
          line-height: 30px;
          display: flex;
          border: 1px solid#999;
          color: #999;
          font-size: 16px;
          margin-top: 3px;
          .form_btn1 {
            flex: 1;
            background: #037659;
            color: #fff;
            text-align: center;
            cursor: pointer;
          }
          .form_btn2 {
            flex: 1;
            background: #fff;
            color: #999;
            text-align: center;
            cursor: pointer;
          }
        }
        .form_btnbox_n {
          width: 180px;
          height: 30px;
          line-height: 30px;
          display: flex;
          color: #999;
          font-size: 16px;
          margin-top: 3px;
        }
        .form_selbox {
          display: flex;
          .form_selbox_title {
            width: 100px;
            // height: 30px;
            // line-height: 30px;
            text-align: center;
            color: #999;
          }
          .timeAddBtn {
            width: 180px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            color: #037659;
            border-radius: 5px;
            margin-top: 4px;
            border: 1px solid #dcdfe6;
          }
        }
      }
    }
  }
  .addRulesBtn {
    height: 36px;
    line-height: 36px;
    text-align: center;
    border: 1px solid #037659;
    color: #037659;
    margin: 0 10px;
  }
}
</style>
