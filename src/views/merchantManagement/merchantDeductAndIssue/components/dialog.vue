<template>
  <el-dialog
    :visible.sync="isShow"
    class="carNoDialog"
    width="600px"
    :show-close="false"
  >
    <div class="carInputBox">
      <div class="carNoBoxInput">
        <input
          class="inputBox1"
          :value="licensePlateUnit[0]"
          @click="licensePlateDoor = true"
        />
        <div class="inputBoxB" style="">
          <input
            class="inputBox"
            :value="licensePlateUnit[1]"
            @click="licensePlateDoor = true"
          />
          <input
            class="inputBox"
            :value="licensePlateUnit[2]"
            @click="licensePlateDoor = true"
          />
          <input
            class="inputBox"
            :value="licensePlateUnit[3]"
            @click="licensePlateDoor = true"
          />
          <input
            class="inputBox"
            :value="licensePlateUnit[4]"
            @click="licensePlateDoor = true"
          />
          <input
            class="inputBox"
            :value="licensePlateUnit[5]"
            @click="licensePlateDoor = true"
          />
          <input
            class="inputBox"
            :value="licensePlateUnit[6]"
            @click="licensePlateDoor = true"
          />
          <input
            v-if="7 === licensePlateUnit.length - 1"
            class="inputBox"
            :class="
              7 === licensePlateUnit.length - 1 ? 'inputBoxActive' : 'inputBox'
            "
            :value="licensePlateUnit[7]"
          />
          <!-- <img
          v-if="7 !== licensePlateUnit.length - 1"
          src="../assets/newEnergy.png"
          style="height: 36px;width: 36px;"
          alt="新能源"
        /> -->
        </div>
        <div style="display: flex;align-items: center">
          <span class="delBt" @click="delCarNo">
            <i class="el-icon-back"></i>
          </span>
        </div>
      </div>
      <div style="margin-left:20px">
        <!-- <div v-if="licensePlateUnit.length < 1" class="carNoBox"> -->
        <div class="carNoBox">
          <span v-for="item in columns1" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length < 1"
              @click="pickOn(item)"
              class="carNo1"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>
        </div>
        <div class="carNoBox">
          <span v-for="item in columns2" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length < 1"
              @click="pickOn(item)"
              class="carNo1"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>
        </div>
        <div class="carNoBox">
          <span v-for="item in columns3" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length < 1"
              @click="pickOn(item)"
              class="carNo1"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>

          <span class="carNo-n"> </span>
          <span v-for="item in numberColumns7" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length > 5"
              @click="pickOn(item)"
              class="carNo1"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>
        </div>
        <div class="carNoBox">
          <span v-for="item in numberColumns1" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length > 0"
              @click="pickOn(item)"
              class="carNo2"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>
          <span class="carNo-n"> </span>

          <span v-for="item in numberColumns6" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length > 1"
              @click="pickOn(item)"
              class="carNo3"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>
        </div>
        <div class="carNoBox">
          <span v-for="item in numberColumns2" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length > 0"
              @click="pickOn(item)"
              class="carNo2"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>
          <span class="carNo-n"> </span>

          <span v-for="item in numberColumns5" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length > 1"
              @click="pickOn(item)"
              class="carNo3"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>
        </div>
        <div class="carNoBox">
          <span v-for="item in numberColumns3" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length > 0"
              @click="pickOn(item)"
              class="carNo2"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>

          <span class="carNo-n"> </span>
          <span v-for="item in numberColumns4" :key="item" class="carNo">
            <span
              v-if="licensePlateUnit.length > 1"
              @click="pickOn(item)"
              class="carNo3"
            >
              {{ item }}
            </span>
            <span class="carNoN" v-else>
              {{ item }}
            </span>
          </span>
        </div>
        <div class="carNoBox">
          <div
            class="confirmBt"
            style="margin-left: 6px"
            @click="confirm"
            v-if="licensePlateUnit.length > 6"
          >
            确认
          </div>
          <div
            class="confirmBtN"
            style="margin-left: 6px"
            @click="confirm"
            v-else
          >
            确认
          </div>
          <div
            class="confirmBt"
            style="margin-left: 6px"
            @click="isShow = false"
          >
            取消
          </div>
          <span class="carNo-n"> </span>

          <div
            class="carNo0"
            @click="pickOn('0')"
            v-if="licensePlateUnit.length > 1"
          >
            {{ "0" }}
          </div>
          <div class="carNo0N" v-else>
            {{ "0" }}
          </div>
        </div>

        <!-- <div class="carNoBox">
        <span
          class="carNo"
          v-for="item in numberColumns"
          :key="item"
          @click="pickOn(item)"
        >
          {{ item }}
        </span>
        <div style="display: flex;align-items: center">
          <span class="delBt" @click="delCarNo">X</span>
        </div>
      </div> -->
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      licensePlateDoor: false,
      activeIndex: 0,
      licensePlate: null,
      licensePlateUnit: [],
      columns1: [
        "京",
        "沪",
        "粤",
        "津",
        "冀",
        "晋",
        "蒙",
        "辽",
        "吉",
        "黑",
        "苏",
        "浙"
      ],
      columns2: [
        "皖",
        "闽",
        "赣",
        "鲁",
        "豫",
        "鄂",
        "湘",
        "桂",
        "琼",
        "渝",
        "川",
        "贵"
      ],
      columns3: ["云", "藏", "陕", "甘", "青", "宁", "新"],
      numberColumns1: ["A", "B", "C", "D", "E", "F", "G", "H"],
      numberColumns2: ["J", "K", "L", "M", "N", "P", "Q", "R"],
      numberColumns3: ["S", "T", "U", "V", "W", "X", "Y", "Z"],
      numberColumns4: ["1", "2", "3"],
      numberColumns5: ["4", "5", "6"],
      numberColumns6: ["7", "8", "9"],
      numberColumns7: ["挂", "港", "澳", "学"]
    };
  },
  methods: {
    openDialog(licensePlate) {
      this.isShow = true;
      this.licensePlate = licensePlate;
      this.licensePlateUnit = licensePlate.split("");
    },
    //关闭新增/编辑弹窗
    closeDialog() {
      this.isShow = false;
      // this.$emit("openLoading", {});
      // this.$emit("getList", {});
    },

    pickOn(value) {
      this.licensePlateDoor = true;
      if (this.licensePlateUnit.length <= 7) {
        this.licensePlateUnit.push(value);
      }
    },
    delCarNo() {
      this.licensePlateUnit.pop();
    },
    confirm() {
      if (this.licensePlateUnit.length >= 7) {
        let licensePlate = this.licensePlateUnit.join("");
        console.log("车牌是：" + this.licensePlateUnit.join(""));
        this.licensePlateDoor = false;
        this.isShow = false;
        this.$emit("setNo", licensePlate);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.carNoBox {
  background: #fff;
  position: relative;
  width: 540px;
  /* border-radius: 6px; */
  display: flex;
  flex-wrap: wrap;
  justify-items: center;
  align-items: center;
  padding-left: 5px;
}

.carNo {
  border-radius: 6px;
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 32px;
  margin: 6px;
  text-align: center;
  cursor: pointer;
}
.carNo1 {
  display: inline-block;
  border-radius: 6px;
  background: rgba($color: #aed293, $alpha: 0.3);
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 32px;
  text-align: center;
  cursor: pointer;
}
.carNo2 {
  display: inline-block;
  border-radius: 6px;
  background: rgba($color: #cffce9, $alpha: 0.3);
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 32px;
  text-align: center;
  cursor: pointer;
}
.carNo3 {
  display: inline-block;
  border-radius: 6px;
  background: rgba($color: #1d9879, $alpha: 0.3);
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 32px;
  text-align: center;
  cursor: pointer;
}
.carNoN {
  display: inline-block;
  border-radius: 6px;
  background: #ccc;
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 32px;
  text-align: center;
  cursor: no-drop;
}
.carNo0 {
  border-radius: 6px;
  background: rgba($color: #1d9879, $alpha: 0.3);
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 120px;
  margin: 6px;
  text-align: center;
  /* padding: 12px; */
  cursor: pointer;
}
.carNo0N {
  border-radius: 6px;
  background: #ccc;
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 120px;
  margin: 6px;
  text-align: center;
  /* padding: 12px; */
  cursor: no-drop;
}
.carNo-n {
  border-radius: 6px;
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 32px;
  margin: 6px;
  text-align: center;
  /* padding: 12px; */
}
.inputBoxB {
  padding: 6px;
  border-radius: 6px;
  background: #fff;
  width: 350px;
  display: flex;
  justify-content: space-around;
}
.inputBox {
  color: #000;
  height: 40px;
  line-height: 40px;
  width: 40px;
  font-size: 32px;
  text-align: center;
  background-color: transparent;
  border: none;
  outline: none;
  caret-color: rgba(0, 0, 0, 0);
}
.inputBox1 {
  color: white;
  height: 54px;
  line-height: 54px;
  width: 48px;
  font-size: 32px;
  text-align: center;
  background-color: #037659;
  border: none;
  outline: none;
  caret-color: rgba(0, 0, 0, 0);
  border-radius: 6px;
  margin-right: -6px;
  z-index: 1;
}
input:focus {
  border-bottom: 3px solid #fff;
  transition: all 0.5s;
}
.dot {
  margin-bottom: 6px;
  background-color: #fff;
  height: 6px;
  width: 6px;
  border-radius: 50%;
  display: inline-block;
}
.delBt {
  /* background: #acb3bb;
  border-radius: 6px; */
  display: inline-block;
  font-weight: bold;
  font-size: 40px;
  height: 40px;
  line-height: 40px;
  width: 40px;
  color: #000;
  margin: 6px 10px;
  text-align: center;
  cursor: pointer;
}
.confirmBt {
  display: block;
  background: rgba($color: #1d9879, $alpha: 0.3);
  border-radius: 6px;
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 164px;
  text-align: center;
  margin: 6px;
  cursor: pointer;
}
.confirmBtN {
  display: block;
  background: #ccc;
  border-radius: 6px;
  font-weight: bold;
  font-size: 20px;
  height: 32px;
  line-height: 32px;
  width: 164px;
  text-align: center;
  margin: 6px;
  cursor: no-drop;
}
.carNoBoxInput {
  display: flex;
  width: 450px;
  align-items: center;
  height: 80px;
  border-radius: 8px;
  margin: 2px auto;
  background: #e8f2f1;
  padding-left: 20px;
}
.carInputBox {
  width: 600px;
  height: 400px;
  background: #e8f2f1;
}
</style>
