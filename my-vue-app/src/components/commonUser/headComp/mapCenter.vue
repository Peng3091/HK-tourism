<template>
  <div>
    <div
      v-for="(subItem, index) in subItems"
      :key="index"
      @click="toggleClick(index)"
      class="drop-item"
    >
      {{ subItem }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, inject, computed } from "vue";
import { useStore } from "../../../store/index";
const store = useStore();
let toggleClick = ref(() => {});
const props = defineProps({
  subItems: {
    type: Array,
    required: true,
  },
});

onMounted(() => {
  const map = inject("$map");
  const scene = inject("$scene");
  store.createTourCenterInfo(map, scene, "tour-center");
  toggleClick.value = (index) => {
    if (index == 0) {
      store.setOnlineQuery();
    } else if (index == 1) {
      var visibility = map.getLayoutProperty("tour-center", "visibility");
      console.log(visibility);
      if (visibility === "visible") {
        map.setLayoutProperty("tour-center", "visibility", "none");
        store.centerInfo.stopQuery();
      } else {
        map.setLayoutProperty("tour-center", "visibility", "visible");
        store.centerInfo.startQuery();
      }
      map.on('mouseenter', 'tour-center', function () {
        map.getCanvasContainer().style.cursor = "pointer";
      });
      map.on('mouseleave', 'tour-center', function () {
        map.getCanvasContainer().style.cursor = "";
      });
    } else {
      store.setOnlineComment();
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
