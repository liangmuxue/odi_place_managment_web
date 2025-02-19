<template>
  <!-- 仅用名字进行查询 -->
  <div>
    <el-cascader
      ref="treedate"
      placeholder="请选择"
      :options="options"
      change-on-select
      :value="parentId"
      :disabled="disabled"
      clearable
      filterable
      size="small"
      @change="handleChange"
    >
      <div slot="prepend">停车场</div>
    </el-cascader>
  </div>
</template>
<script>
import { treeList } from "@/api/yardManagement";

export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    tenantId: "",
    value: null,
    options: [],
    disabled: false,
    parentId: null
  }),
  created() {
    this.$nextTick(() => {
      const listQuery = { regionType: 2, flag: 2 };
      // listQuery.userIds = this.$store.getters.userId;
      treeList(listQuery).then(response => {
        let a = response.data;
        this.options = this.normalizer(a);
      });
    });
  },
  methods: {
    selectRegion(id) {
      console.log(11, id);
      this.parentId = id;
      // if (id !== "") {
      //   this.disabled = true;
      //   let parentId = [];
      //   parentId.push(id.slice(0, 2));
      //   parentId.push(id.slice(0, 4));
      //   parentId.push(id.slice(0, 6));
      //   parentId.push(id);
      //   this.parentId = parentId;
      // } else {
      //   this.disabled = false;
      //   // this.$refs.treedate.clearCheckedNodes();
      //   this.parentId = [];
      // }
    },
    resetChecked() {
      // this.$refs.treedate.clearCheckedNodes();
      this.parentId = [];
    },
    handleChange(data) {
      console.log(111, data);
      let id;
      if (data.length > 0) {
        id = data[data.length - 1];
      } else {
        id = "";
      }
      let names = this.$refs["treedate"]
        .getCheckedNodes()[0]
        .pathLabels.toString()
        .replace(/,/g, "");
      this.$emit("selectAddress", id, names);
      this.$refs.treedate.dropDownVisible = false;
    },

    normalizer(nodes) {
      let arr = nodes;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].areaList && arr[i].areaList.length > 0) {
          let obj = { value: "", label: "", children: [], areaList: [] };
          obj.value = arr[i].id;
          obj.label = arr[i].cname;
          obj.children = arr[i].areaList;
          obj.areaList = arr[i].areaList;
          arr[i] = obj;
          this.normalizer(arr[i].areaList);
        } else {
          let obj = { value: "", label: "" };
          obj.value = arr[i].id;
          obj.label = arr[i].cname;
          arr[i] = obj;
        }
      }
      return arr;
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll(
          ".el-scrollbar .el-select-dropdown__wrap"
        )[0];
        let scrollBar = document.querySelectorAll(
          ".el-scrollbar .el-scrollbar__bar"
        );
        scrollWrap.style.cssText =
          "margin: 0px; max-height: none; overflow: hidden;";
        scrollBar.forEach(ele => (ele.style.width = 0));
      });
    }
  }
};
</script>
<style lang="scss"></style>
