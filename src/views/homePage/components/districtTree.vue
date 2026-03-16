<template>
  <el-select
    v-model="selectedLabel"
    :filterable="true"
    ref="select"
    clearable
    placeholder="请选择"
    :filter-method="filterTree"
    @clear="handleClear"
  >
    <!-- 自定义下拉内容 -->
    <el-option
      :value="selectedValue"
      :label="selectedLabel"
      style="display: none"
    />
    <el-tree
      ref="tree"
      :data="treeData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :default-expand-all="true"
      :expand-on-click-node="false"
      :render-content="renderContent"
      node-key="id"
      highlight-current
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node }" class="tree-node">
        {{ node.label }}
        <span v-if="node.isNew" style="color: #999; margin-left: 5px"
          >（匹配子项）</span
        >
      </span>
    </el-tree>
  </el-select>
</template>

<script>
export default {
  props: {
    treeData: {
      type: Array
    },
    treeNo: {
      type: Number
    }
  },
  data() {
    return {
      selectedValue: "", // 选中的值
      selectedLabel: "", // 显示文本
      searchText: "", // 搜索文本
      defaultProps: {
        // 配置项（必选）
        id: "regionCode",
        value: "regionCode",
        label: "regionName",
        name: "name",
        count: "offlineNum",
        children: "children",
        disabled: this.disabledFn,
        icon: this.showIcon
      }
      // 示例数据
    };
  },

  methods: {
    // 节点点击处理
    handleNodeClick(data, node) {
      if (data.regionType === 2 && data.state === 1) {
        this.selectedValue = data.regionCode;
        // this.selectedLabel = this.getFullPath(node);
        this.selectedLabel = data.deviceName;
        this.$refs.tree.setCurrentKey(data.id);
        this.$emit("treeItemSelect", data, this.treeNo);
        this.$refs.select.blur(); // 关闭下拉框
      }
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
            class="tree_box "
            style="font-size: 12px;position: relative;height:16px;line-height:16px;cursor: not-allowed;display: inline-block;width:200px"
          >
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
          </span>
        );
      } else if (data.regionType === 2) {
        if (data.state === 1) {
          // if (data.remark) {
          return (
            <span class="tree_box" style="font-size: 12px;">
              <div style="position: relative;display: inline-block;left: -2px;width: 10px;height: 10px;background: #4f0;border-radius: 10px;" />

              <span
                style="position: relative;top: 2px;display: inline-block;height:14px;line-height:14px;max-width:160px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
                title={data.name || data.deviceName}
              >
                {" "}
                {data.name || data.deviceName}
              </span>
            </span>
          );
        } else {
          return (
            <span
              class="tree_box "
              style="font-size: 12px;position: relative;cursor: not-allowed;inline-block;width:200px"
            >
              <div style="position: relative;display: inline-block;left: -2px;width: 10px;height: 10px;background: #999;border-radius: 10px;" />
              <span
                style="position: relative;top: 2px;display: inline-block;height:14px;line-height:14px;max-width:160px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
                title={data.name || data.deviceName}
              >
                {" "}
                {data.name || data.deviceName}
              </span>
            </span>
          );
        }
      }
    },

    // 获取完整路径
    getFullPath(node) {
      const path = [];
      let current = node;
      while (current) {
        path.unshift(current.label);
        current = current.parent;
      }
      return path.join(" / ");
    },

    // 过滤方法
    filterTree(query) {
      this.searchText = query;
      this.$refs.tree.filter(query);
    },

    // 树节点过滤逻辑
    filterNode(value, data, node) {
      if (!value) return true;

      // 标记匹配的父节点
      const hasChildMatch = this.checkChildMatch(node, value);
      if (hasChildMatch) {
        node.isNew = true;
        return true;
      }

      // 自身匹配
      return data.name.includes(value);
    },

    // 检查子节点匹配
    checkChildMatch(node, value) {
      return node.childNodes.some(child => {
        return (
          child.data.name.includes(value) || this.checkChildMatch(child, value)
        );
      });
    },
    comeList() {
      console.log(123);
    },
    // 清空选择
    handleClear() {
      this.selectedValue = "";
      this.selectedLabel = "";
      this.$refs.tree.setCurrentKey(null);
      this.$emit("treeItemSelect", null, this.treeNo);
    }
  }
};
</script>

<style scoped>
/* 调整下拉框样式 */
.el-select-dropdown__item {
  height: auto;
  padding: 0;
}

/* 树形结构样式 */
.el-tree {
  padding: 5px;
  max-height: 300px;
  overflow-y: auto;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.disabled-node {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
