//直接在index.js中定义store
import { defineStore } from "pinia";
import { createMapInfo } from "../utils/mapQuery/mapInfo";
import { createRegionInfo } from "../utils/mapQuery/regionInfo";
import { createDrawInfo } from "../utils/mapQuery/drawInfo";
import { createCenterInfo } from "../utils/mapQuery/centerInfo";
export const useStore = defineStore({
  id: "main",
  state: () => ({
    count: 0,
    isLoaded: false,
    isStreetView: false,
    isPointQuery: false,
    isRegionQuery: false,
    isDrawQuery: false,
    allData: null,
    mapInfo: null,
    regionInfo: null,
    drawInfo: null,
    centerInfo: null,
    infoCreated: false,
    centerInfoCreated: false,
    drawCreated: false,
    hasDraw: false,
    isOnlineQuery: false,
    isOnlineComment: false,
    isQueryType: false,
    isActivityRecom: false,
    isNotice: false,
    isRoutesRecom: false,
    isTourPlan: false,
    isPlanTable: false,
  }),
  getters: {
    doubleCount() {
      return this.count * 2;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
    setLoaded() {
      this.isLoaded = true;
    },
    setStreetView() {
      this.isStreetView = !this.isStreetView;
    },
    setData(all_Data) {
      this.allData = all_Data;
    },
    setPointQuery() {
      this.isPointQuery = !this.isPointQuery;
    },
    setRegionQuery() {
      this.isRegionQuery = !this.isRegionQuery;
    },
    setDrawQuery() {
      this.isDrawQuery = !this.isDrawQuery;
    },
    //把utils中的方法也统一放在store中
    createInfo(map, scene, icons, allData) {
      if (!this.infoCreated) {
        this.mapInfo = createMapInfo(map, scene, icons);
        this.regionInfo = createRegionInfo(
          map,
          scene,
          "region_layer",
          allData.value
        );
        this.infoCreated = true; // 创建完后将 infoCreated 设置为 true
      }
    },
    createTourCenterInfo(map, scene, layer) {
      if (!this.centerInfoCreated) {
        this.centerInfo = createCenterInfo(map, scene, layer);
        this.centerInfoCreated = true; // 创建完后将 infoCreated 设置为 true
      }
    },
    createDrawInfo(scene, allData, searchWithin) {
      if (!this.drawCreated) {
        this.drawInfo = createDrawInfo(scene, allData, searchWithin);
        this.drawCreated = true; // 创建完后将 infoCreated 设置为 true
      }
    },
    setHasDraw() {
      this.hasDraw = true;
    },
    setOnlineQuery() {
      this.isOnlineQuery = !this.isOnlineQuery;
    },
    setOnlineComment() {
      this.isOnlineComment = !this.isOnlineComment;
    },
    setQueryType() {
      this.isQueryType = !this.isQueryType;
    },
    setActivityRecom() {
      this.isActivityRecom = !this.isActivityRecom;
    },
    setNotice() {
      this.isNotice = !this.isNotice;
    },
    setRoutesRecom(){
      this.isRoutesRecom = !this.isRoutesRecom;
    },
    setTourPlan(){
      this.isTourPlan = !this.isTourPlan;
    },
    setPlanTable(){
      this.isPlanTable = !this.isPlanTable;
    }
  },
});
