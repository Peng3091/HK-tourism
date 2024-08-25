<template>
  <div>
    <div id="menu">
      <el-dropdown>
        <div class="el-dropdown-link">
          <img src="../../assets/地图.png" alt="" />
        </div>
        <template #dropdown>
          <el-dropdown-menu
            v-model="selectedStyle"
            v-for="style in styles"
            :value="style.value"
            :key="style.value"
            @click="changeStyle(style.value)"
          >
            <el-dropdown-item class="dropdown-item">{{
              style.name
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import {
  Zoom,
  Fullscreen,
  GeoLocate,
  ExportImage,
  MouseLocation,
  MapTheme,
} from "@antv/l7";
import gcoord from "gcoord";
const show = ref(false);
let changeStyle = ref();
let selectedStyle = ref("mapbox://styles/mapbox/streets-v12");
const styles = [
  { name: "Streets", value: "mapbox://styles/mapbox/streets-v12" },
  { name: "Satellite", value: "mapbox://styles/mapbox/satellite-v9" },
  { name: "Dark", value: "mapbox://styles/mapbox/dark-v10" },
  { name: "Light", value: "mapbox://styles/mapbox/light-v10" },
  { name: "Outdoors", value: "mapbox://styles/mapbox/outdoors-v11" },
];
onMounted(() => {
  const scene = inject("$scene");
  const map = inject("$map");
  // 添加缩放控件
  const zoom = new Zoom({
    zoomInTitle: "zoom in",
    zoomOutTitle: "zoom out",
    className: "zoomer",
    position: "topright",
  });
  scene.addControl(zoom);
  // 添加全屏控件
  const fullscreen = new Fullscreen({
    btnText: "full screen",
    exitBtnText: "exit full screen",
    className: "fullscreener",
  });
  scene.addControl(fullscreen);

  //地图主题
  const mapTheme = new MapTheme({
    theme: "light",
    className: "map-theme",
  });
  scene.addControl(mapTheme);
  // 添加定位控件
  const geoLocate = new GeoLocate({
    transform: (position) => {
      // 将获取到基于 WGS84 地理坐标系 的坐标转成 GCJ02 坐标系
      return gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02);
    },
    className: "geo-locate",
  });
  scene.addControl(geoLocate);
  const exImage = new ExportImage({
    /**
     * @param {string} base64
     */
    onExport: (base64) => {
      download(base64);
    },
    imageType: "png",
    className: "export-image",
  });
  scene.addControl(exImage);
  function download(base64) {
    const link = document.createElement("a");
    link.href = base64;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  //光标经纬度
  const mouseLocation = new MouseLocation({
    transform: (position) => {
      return [
        "Lng: " + parseFloat(position[0].toFixed(2)),
        "Lat: " + parseFloat(position[1].toFixed(2)),
      ];
    },
    className: "mouse-location",
  });
  scene.addControl(mouseLocation);

  map.addControl(
    new mapboxgl.AttributionControl({
      customAttribution: "Map design by PHZ from CUHK",
    })
  );
  map.addControl(new mapboxgl.ScaleControl());

  // 底图样式选项
  setTimeout(() => {
    show.value = true;
  }, 100);
  changeStyle = (value) => {
    // 保存当前的源和图层
    const sources = {};
    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
      const source = map.getSource(layer.source);
      if (source) {
        sources[layer.source] = source.serialize();
      }
    });
    // 设置新的样式
    map.setStyle(value);
    map.on("style.load", function () {
      // 添加保存的源和图层
      for (const id in sources) {
        if (!map.getSource(id)) {
          map.addSource(id, sources[id]);
        }
      }
      layers.forEach((layer) => {
        if (!map.getLayer(layer.id)) {
          map.addLayer(layer);
        }
      });
    });
  };
});
</script>

<style lang="scss">
.zoomer {
  top: 135px;
  z-index: 1000;
  background-color: black;
}
.export-image {
  top: 60px;
  z-index: 1000;
  background-color: #fff;
}
.fullscreener {
  z-index: 1000;
  background-color: #fff;
}
.mouse-location {
  width: 40px;
  bottom: 12px;
  left: 80px;
  z-index: 1000;
  background-color: #fff;
}
.map-theme {
  z-index: 1000;
  background-color: #fff;
}
.geo-locate {
  top: 62px;
  z-index: 1000;
  background-color: #fff;
}
</style>
<style lang="scss" scoped>
#menu {
  display: flex;
  position: absolute;
  justify-content: center; /* 添加这一行来水平居中 */
  align-items: center;
  width: 24px;
  top: 215px;
  right: 8px;
  padding: 4px 2px;
  background-color: #fff;
  font-family: "Open Sans", sans-serif;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  .dropdown-item {
    width: 10px;
    color: #fff;
  }
}
.el-dropdown-link img {
  width: 15px;
  height: 15px;
}
.el-dropdown-link:hover {
  cursor: pointer;
}
.el-dropdown-menu {
  padding: 0 10px;
  width: 80px;
  background-color: #fff;
}
:deep(.l7-control-container) {
  z-index: 100 !important;
}
</style>
