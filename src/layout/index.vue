<template>
  <div :class="classObj" class="app-wrapper">
    <div class="app-top">
      <div class="app-header">
        <Navbar />
      </div>
      <div class="app-topbar">
        <topbar />
      </div>
    </div>
    <div class="app-body">
      <div
        v-if="device === 'mobile' && sidebar.opened"
        class="drawer-bg"
        @click="handleClickOutside"
      />
      <sidebar class="sidebar-container" v-if="!sidebar.hide" />
      <div :class="{ sidebarHide: sidebar.hide }" class="main-container">
        <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
// import RightPanel from "@/components/RightPanel";
import Breadcrumb from "@/components/Breadcrumb";

import {
  AppMain,
  Navbar,
  //  Settings,
  Sidebar,
  //  TagsView
  Topbar
} from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";

export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    // RightPanel,
    // Settings,
    Sidebar,
    Topbar,
    Breadcrumb
    // TagsView
  },
  mixins: [ResizeMixin],
  isFullSize: false, //是否全屏模式
  computed: {
    ...mapState({
      // sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    classObj() {
      return {
        // hideSidebar: !this.sidebar.opened,
        // openSidebar: this.sidebar.opened,
        hideSidebar: false,
        openSidebar: true,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  .app-top {
    height: 98px;
    width: 100%;
    background: linear-gradient(to bottom, $gradientTop, $gradientBottom);
    box-shadow: 0px 2px 2px 0px rgba($color: #000000, $alpha: 0.2);
    margin-bottom: 2px;
  }
  .app-header {
    height: 60px;
    width: 100%;
  }
  .app-topbar {
    height: 40px;
    width: 100%;
  }
  .app-body {
    position: relative;
    height: calc(100% - 110px);
    width: 100%;
  }
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1009;
  width: 100%;
  height: 54px;
  padding-top: 12px;
  transition: width 0.28s;
  background-color: #fff;
}

.hideSidebar .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}

// .full-size-area {
//   position: fixed;
//   overflow: hidden;
//   height: 100%;
//   width: 100%;
//   z-index: 1002;
//   left: 0px;
//   top: 0px;
// }
</style>
