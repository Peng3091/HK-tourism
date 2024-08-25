<template>
  <div class="container">
    <!-- 头部功能区 -->
    <topHeader class="header"></topHeader>

    <!-- 地图相关组件 -->
    <mapBox class="box" />
    <mapGeo class="geo-point" />
    <mapControl class="control" v-if="isLoaded && !isOnlineQuery" />

    <!-- 咨询中心组件 -->
    <div
      class="overlay"
      v-if="isOnlineQuery || isOnlineComment || isActivityRecom || isNotice"
    ></div>
    <onlineQuery v-if="isOnlineQuery" class="query-table" />
    <onlineComment v-if="isOnlineComment" class="query-table" />

    <!-- 玩乐指南 -->
    <activityRecom class="activity" v-if="isActivityRecom" />
    <notice class="notice" v-if="isNotice" />

    <!--计划旅程  -->
    <routesRecom class="routes" v-if="isRoutesRecom" />
    <tourPlan class="plans" v-if="isTourPlan" />
    <planTable class="planTab" v-if="isPlanTable" />
  </div>
</template>

<script setup>
import mapBox from "../commonCard/mapBox.vue";
import mapControl from "../commonCard/mapControl.vue";
import topHeader from "./topHeader.vue";
import mapGeo from "../commonCard/mapGeo.vue";
import onlineQuery from "./headComp/mapCenterComp/onlineQuery.vue";
import onlineComment from "./headComp/mapCenterComp/onlineComment.vue";
import activityRecom from "./headComp/mapGuideComp/activityRecom.vue";
import notice from "./headComp/mapGuideComp/notice.vue";

import routesRecom from "./headComp/mapPlanComp/routesRecom.vue";
import tourPlan from "./headComp/mapPlanComp/tourPlan.vue";
import planTable from "./headComp/mapPlanComp/planTable.vue";

import { useStore } from "../../store/index";
import { computed } from "vue";
const store = useStore();
const isLoaded = computed(() => store.isLoaded);
const isOnlineQuery = computed(() => store.isOnlineQuery);
const isOnlineComment = computed(() => store.isOnlineComment);
const isActivityRecom = computed(() => store.isActivityRecom);
const isNotice = computed(() => store.isNotice);
const isRoutesRecom = computed(() => store.isRoutesRecom);
const isTourPlan = computed(() => store.isTourPlan);
const isPlanTable = computed(() => store.isPlanTable);
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100vh;
}
.header {
  position: relative;
  z-index: 100;
}
.control {
  position: relative;
  z-index: 1;
}
.geo-point {
  position: relative;
  z-index: 10;
}
.query-table {
  position: fixed;
  padding: 20px 30px 10px;
  top: 50%;
  left: 50%;
  background-color: rgba(255, 255, 255, 1);
  z-index: 100;
  transform: translate(-50%, -50%);
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 阴影背景 */
  z-index: 99; /* 比 .query-table 的 z-index 小 */
}
.activity {
  position: fixed;
  padding: 20px 30px 10px;
  height: 80%;
  top: 50%;
  left: 50%;
  background-color: rgba(255, 255, 255, 1);
  z-index: 100;
  transform: translate(-50%, -50%);
}
.notice {
  position: fixed;
  padding: 20px 30px 10px;
  height: 85%;
  width: 30%;
  top: 50%;
  left: 50%;
  background-color: rgba(255, 255, 255, 1);
  z-index: 100;
  transform: translate(-50%, -50%);
}
.routes {
  position: fixed;
  padding: 20px 30px 10px;
  height: 80%;
  width: 50%;
  top: 50%;
  left: 50%;
  background-color: rgba(255, 255, 255, 1);
  z-index: 100;
  transform: translate(-50%, -50%);
}
.plans {
  position: fixed;
  padding: 20px 30px 10px;
  height: 80%;
  width: 50%;
  top: 50%;
  left: 50%;
  background-color: rgba(255, 255, 255, 1);
  z-index: 100;
  transform: translate(-50%, -50%);
}
.planTab{
  position: fixed;
  padding: 20px 30px 10px;
  height: 80%;
  width: 45%;
  top: 50%;
  left: 50%;
  background-color: rgba(255, 255, 255, 1);
  z-index: 100;
  transform: translate(-50%, -50%);
}
</style>
