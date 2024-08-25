<template>
  <div>
    <div id="map"></div>
    <div id="mapi" :class="isStreetView ? 'streetView-on' : ''"></div>
    <div id="pano" :class="isStreetView ? 'streetView-on' : ''"></div>
    <div class="label">
      <el-button @click="toggleLabel" Plain>label</el-button>
      <el-button @click="toggleRoad" Plain>road-num</el-button>
    </div>
  </div>
</template>

<script setup>
/* 初始地图 */
import { Scene } from "@antv/l7";
import { Mapbox } from "@antv/l7-maps";
import { onMounted, computed, ref } from "vue";
import { useStore } from "../../store/index";
import { app } from "../../main";
const store = useStore();
const isStreetView = computed(() => store.isStreetView);
let toggleLabel = ref(() => {});
let toggleRoad = ref(() => {});
function initialize() {
  const fenway = { lat: 22.383333, lng: 114.166667 };
  let mapi;
  async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    mapi = new Map(document.getElementById("mapi"), {
      center: { lat: 22.383333, lng: 114.166667 },
      zoom: 11,
    });
    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("pano"),
      {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10,
        },
      }
    );
    mapi.setStreetView(panorama);
  }

  initMap();
}
window.initialize = initialize;
function loadGoogleMapsAPI() {
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyC-cmA9rRVAtPJ1wEDdwtux3j9fb6lqLLo&callback=initialize&loading=async&v=weekly";
  script.defer = true;
  document.head.appendChild(script);
}
onMounted(() => {
  loadGoogleMapsAPI();
  const token = import.meta.env.VITE_TOKEN;
  const scene = new Scene({
    id: "map",
    map: new Mapbox({
      container: "map", // container ID
      style: "normal", // style URL
      center: [114.166667, 22.383333],
      zoom: 10,
      token,
      projection: "equalEarth",
      attributionControl: false,
      preserveDrawingBuffer: true,
      collectResourceTiming: false, // 禁用事件数据收集
    }),
    logoVisible: false,
  });
  const map = scene.map;
  console.log(map);
  console.log(scene);
  scene.on("load", function () {
    var layers = map.getStyle().layers;
    // 遍历所有图层
    toggleLabel.value = () => {
      console.log("toggleLabel");
      for (var i = 0; i < layers.length; i++) {
        // 检查图层id是否包含"label"，如果包含，就隐藏这个图层
        if (layers[i].id.indexOf("label") > -1) {
          var visibility = map.getLayoutProperty(layers[i].id, "visibility");
          console.log(visibility);
          if (visibility === "visible" || typeof visibility === "undefined") {
            map.setLayoutProperty(layers[i].id, "visibility", "none");
          } else {
            map.setLayoutProperty(layers[i].id, "visibility", "visible");
          }
        }
      }
    };
    toggleRoad.value = () => {
      for (var i = 0; i < layers.length; i++) {
        // 检查图层id是否包含"label"，如果包含，就隐藏这个图层
        if (layers[i].id.indexOf("road") > -1) {
          var visibility = map.getLayoutProperty(layers[i].id, "visibility");
          if (visibility === "visible" || typeof visibility === "undefined") {
            map.setLayoutProperty(layers[i].id, "visibility", "none");
          } else {
            map.setLayoutProperty(layers[i].id, "visibility", "visible");
          }
        }
      }
    };
  });
  app.provide("$map_init", map);
  app.provide("$scen_init", scene);
});
</script>

<style lang="scss" scoped>
#map {
  position: absolute;
  width: 100%;
  height: 100%;
}
:deep(.mapboxgl-ctrl-logo) {
  display: none !important;
}

#mapi {
  display: none;
  position: absolute;
  right: 0;
  z-index: 10;
  width: 50%;
  height: 100%;
}
#pano {
  display: none;
  position: absolute;
  left: 0;
  z-index: 10;
  width: 50%;
  height: 100%;
}
.streetView-on {
  display: block !important;
}
.label {
  position: absolute;
  display: flex;
  top: 70px;
  left: 5px;
  z-index: 50;
  .el-button {
    padding: 5px;
    margin: 5px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
  }
}
</style>
