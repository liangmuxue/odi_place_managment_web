<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <!-- <div class="sidebar-head">
      <img src="../../../assets/images/logo.png" class="sidebar-head-logo" />
      <div class="sidebar-head-title">Hi-car 海创停车场管理系统</div>
    </div> -->

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        unique-opened
        background-color="transparent"
        text-color="white"
        active-text-color="#3bdbfc"
        mode="vertical"
      >
        <!-- :collapse="true"
        :collapse-transition="true" -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="basePath + route.path"
        />
      </el-menu>
      <!-- <div class="telescopic" >
        <img src="../../../assets/images/homePage/telescopic.png" @click="toggleSideBar" v-show="sidebar.opened"  
/>
        <img src="../../../assets/images/homePage/telescopic2.png" @click="toggleSideBar" v-show="!sidebar.opened"/>
      </div>-->
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    routes() {
      // return this.$router.options.routes
      return this.$store.state.permission.currentRoutes.children;
    },
    basePath() {
      // return this.$router.options.routes
      return this.$store.state.permission.currentRoutes.path + "/";
    },

    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      // return !this.sidebar.opened;
      return false;
    }
  },
  data() {
    return {
      picShow: true
    };
  },
  methods: {
    toggleSideBar() {
      this.picShow = !this.picShow;
      this.$store.dispatch("app/toggleSideBar");
    }
  }
};
</script>

<style lang="scss" scoped></style>
