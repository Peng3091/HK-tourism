<template>
  <div>
    <div
      v-for="(subItem, index) in subItems"
      :key="index"
      @click="toggleClick(index)"
      class="drop-item"
    >
      {{ subItem.label }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, inject, ref, computed } from "vue";
import { useStore } from "../../../store";
const store = useStore();
const allData = computed(() => store.allData);
const props = defineProps({
  subItems: {
    type: Array,
    required: true,
  },
});
let icons = [
  "mountIcon",
  "waterIcon",
  "roadIcon",
  "memoIcon",
  "eduIcon",
  "tempIcon",
  "leisIcon",
  "shopIcon",
];
let toggleClick = ref(() => {});
let draw = null;
onMounted(async () => {
  const map = inject("$map");
  const scene = inject("$scene");
  store.createInfo(map, scene, icons, allData);
  if (!store.hasDraw) {
    //创建draw控件;确保当前只有一个draw控件
    draw = new MapboxDraw({
      displayControlsDefault: false, // 关闭所有默认的控件
      controls: {
        polygon: true, // 启用面绘制
        trash: true, // 启用删除控件
      },
    });
    //将绘制控件添加到左上角
    map.addControl(draw, "top-left");
    // 获取控件的元素
    var drawControlElement = document.getElementsByClassName(
      "mapboxgl-ctrl-top-left"
    )[0];
    // 设置元素的位置
    drawControlElement.style.top = "62px";
    drawControlElement.style.left = "150px";
    drawControlElement.style.display = "none";
  }
  store.setHasDraw();
  toggleClick.value = (index) => {
    if (index === 0) {
      store.setPointQuery();
      if (store.isPointQuery) {
        store.mapInfo.startQuery();
      } else {
        store.mapInfo.stopQuery();
      }
    } else if (index === 1) {
      store.setStreetView();
    } else if (index === 2) {
      store.setRegionQuery();
      console.log(map.getStyle().layers);
      var visibility = map.getLayoutProperty("region_layer", "visibility");
      console.log(visibility);
      if (visibility === "visible") {
        map.setLayoutProperty("region_layer", "visibility", "none");
      } else {
        map.setLayoutProperty("region_layer", "visibility", "visible");
      }
      if (store.isRegionQuery) {
        store.regionInfo.startQuery();
        console.log("区域查询");
      } else {
        store.regionInfo.stopQuery();
        console.log("停止查询");
      }
    } else {
      store.setDrawQuery();
      if (store.isDrawQuery) {
        var drawControlElement = document.getElementsByClassName(
          "mapboxgl-ctrl-top-left"
        )[0];
        drawControlElement.style.display = "block";
        map.on("draw.create", handleDraw);
        function handleDraw(e) {
          console.log("handleDraw started");
          var position = e.features[0].geometry.coordinates;
          console.log(position);
          var searchWithin = turf.polygon([...position]);
          console.log(searchWithin);
          store.createDrawInfo(scene, allData.value, searchWithin);
          store.drawInfo.startQuery();
        }
      } else {
        var drawControlElement = document.getElementsByClassName(
          "mapboxgl-ctrl-top-left"
        )[0];
        drawControlElement.style.display = "none";
      }
    }
  };
});
</script>

<style lang="scss" scoped>
.drop-item {
  padding: 10px 0;
  border-bottom: 1px solid rgb(204, 204, 204);
  &:last-child {
    border-bottom: none;
  }
}
.drop-item:hover {
  cursor: pointer;
  color: rgb(83, 146, 249);
  background-color: #f0f0f0;
}
</style>
