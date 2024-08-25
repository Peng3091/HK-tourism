<template>
  <div class="toggleLayer" v-if="isQueryType">
    <ul>
      <h4>Nature</h4>
      <li class="outerLi">
        <ul>
          <li class="innerLi">
            <button @click="mountVisi" :class="{ active: !refs[0] }">
              mount
            </button>
          </li>
          <li class="innerLi">
            <button @click="waterVisi" :class="{ active: !refs[1] }">
              water
            </button>
          </li>
        </ul>
      </li>
      <h4>Culture</h4>
      <li class="outerLi">
        <ul>
          <li class="innerLi">
            <button @click="roadVisi" :class="{ active: !refs[2] }">street</button>
          </li>
          <li class="innerLi">
            <button @click="memoVisi" :class="{ active: !refs[3] }">memo</button>
          </li>
          <li class="innerLi">
            <button @click="eduVisi" :class="{ active: !refs[4] }">edu</button>
          </li>
          <li class="innerLi">
            <button @click="tempVisi" :class="{ active: !refs[5] }">temp</button>
          </li>
        </ul>
      </li>
      <h4>Recreation</h4>
      <li class="outerLi">
        <ul>
          <li class="innerLi">
            <button @click="leisVisi" :class="{ active: !refs[6] }">leis</button>
          </li>
          <li class="innerLi">
            <button @click="shopVisi" :class="{ active: !refs[7] }">shop</button>
          </li>
        </ul>
      </li>
      <hr />
      <li class="buttonLi">
        <button @click="openAll">openAll</button>
        <button @click="closeAll">closeAll</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { app } from "../../main";
import { onMounted, inject, computed, ref } from "vue";
import axios from "../../axiosConfig";
import { useStore } from "../../store/index";
import coordtransform from "coordtransform";

import waterIcon from "../../assets/沙滩.png";
import mountIcon from "../../assets/山.png";
import roadIcon from "../../assets/cityscape.png";
import memoIcon from "../../assets/博物馆.png";
import eduIcon from "../../assets/大学.png";
import tempIcon from "../../assets/丽江古城.png";
import leisIcon from "../../assets/摩天轮.png";
import shopIcon from "../../assets/购物.png";
import touristCenter from "../../assets/游客中心.png";
const store = useStore();
const isQueryType = computed(() => store.isQueryType);
//icon的图片和对应的属性
let icons = [
  [mountIcon, "isMount"],
  [waterIcon, "isWater"],
  [roadIcon, "isRoad"],
  [memoIcon, "isMemo"],
  [eduIcon, "isEdu"],
  [tempIcon, "isTemp"],
  [leisIcon, "isLeis"],
  [shopIcon, "isShop"],
];
//layer的id
let ids = [
  "mountIcon",
  "waterIcon",
  "roadIcon",
  "memoIcon",
  "eduIcon",
  "tempIcon",
  "leisIcon",
  "shopIcon",
];

let state = ref({
  mount: true,
  water: true,
  road: true,
  memo: true,
  edu: true,
  temp: true,
  leis: true,
  shop: true,
});

let refs = computed(() => [
  state.value.mount,
  state.value.water,
  state.value.road,
  state.value.memo,
  state.value.edu,
  state.value.temp,
  state.value.leis,
  state.value.shop,
]);
let mountVisi = null;
let waterVisi = null;
let roadVisi = null;
let memoVisi = null;
let eduVisi = null;
let tempVisi = null;
let leisVisi = null;
let shopVisi = null;
let allJson = null;
let openAll = null;
let closeAll = null;

onMounted(() => {
  const map = inject("$map_init");
  const scene = inject("$scen_init");
  map.on("load", function () {
    //分成三类, 一类是自然景观, 一类是人文景观, 一类是其他景观; 每一个下面又有几个分类,可以选择单项显示或者全部显示
    map.getCanvas().style.cursor = "pointer";
    axios.get("/api/data").then((res) => {
      let mountJson = [];
      let waterJson = [];
      let roadJson = [];
      let memoJson = [];
      let eduJson = [];
      let tempJson = [];
      let leisJson = [];
      let shopJson = [];
      let allData = [];
      res.data.forEach((item) => {
        allData.push(item);
        if (item.tags.includes("登山")) {
          mountJson.push(item);
        } else if (item.tags.includes("沙滩")) {
          waterJson.push(item);
        } else if (item.tags.includes("街区")) {
          roadJson.push(item);
        } else if (item.tags.includes("纪念")) {
          memoJson.push(item);
        } else if (item.tags.includes("教育")) {
          eduJson.push(item);
        } else if (item.tags.includes("宗教")) {
          tempJson.push(item);
        } else if (item.tags.includes("休闲")) {
          leisJson.push(item);
        } else {
          shopJson.push(item);
        }
      });
      const dataToGeojson = (data) => {
        return {
          type: "FeatureCollection",
          features: data.map((item) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                item.coordinates.longitude,
                item.coordinates.latitude,
              ],
            },
            properties: {
              tags: item.tags,
              isMount: item.tags.includes("登山"),
              isWater: item.tags.includes("沙滩"),
              isRoad: item.tags.includes("街区"),
              isMemo: item.tags.includes("纪念"),
              isEdu: item.tags.includes("教育"),
              isTemp: item.tags.includes("宗教"),
              isLeis: item.tags.includes("休闲"),
              isShop: item.tags.includes("shopping"),
              name: item.name,
              //(`name`,`type`, `location`, `description`, `openingHours`, `entryFee`, `website`, `contact`, `rating`, `tags`, `image`, `coordinates`)
              description: item.description,
              openingHours: item.openingHours,
              entryFee: item.entryFee,
              website: item.website,
              contact: item.contact,
              rating: item.rating,
              image: item.image,
              location: item.location,
              type: item.type,
            },
          })),
        };
      };
      const mountGeojson = dataToGeojson(mountJson);
      const waterGeojson = dataToGeojson(waterJson);
      const roadGeojson = dataToGeojson(roadJson);
      const memoGeojson = dataToGeojson(memoJson);
      const eduGeojson = dataToGeojson(eduJson);
      const tempGeojson = dataToGeojson(tempJson);
      const leisGeojson = dataToGeojson(leisJson);
      const shopGeojson = dataToGeojson(shopJson);
      const allGeo = dataToGeojson(allData);
      let geojsons = [
        mountGeojson,
        waterGeojson,
        roadGeojson,
        memoGeojson,
        eduGeojson,
        tempGeojson,
        leisGeojson,
        shopGeojson,
      ];
      const getAllJson = () => {
        let allData = {
          type: "FeatureCollection",
          features: [],
        };
        for (let i = 0; i < refs.value.length; i++) {
          if (refs.value[i]) {
            allData.features.push(...geojsons[i].features);
          }
        }
        return allData;
      };
      allData = getAllJson();
      store.setData(allData);
      // 加载cluster图
      // 创建数据源和图层
      map.addSource("clusterSource", {
        type: "geojson",
        data: allData,
        generateId: true,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
      /* 设置样式图层 */
      map.addLayer({
        id: "fill-layer",
        type: "circle",
        source: "clusterSource",
        paint: {
          "circle-color": {
            property: "point_count",
            stops: [
              [5, "green"],
              [10, "rgb(0, 124, 191)"],
              [15, "rgb(224, 97, 72)"],
              [20, "rgb(238, 10, 0)"],
            ],
          },
          "circle-opacity": 0.8,
          "circle-radius": {
            property: "point_count",
            stops: [
              [0, 20],
              [5, 30],
              [10, 40],
              [15, 50],
              [20, 60],
            ],
          },
        },
        filter: ["has", "point_count"],
      });
      /* 设置文字图层 */
      map.addLayer({
        id: "text-layer",
        type: "symbol",
        source: "clusterSource",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count}",
          "text-size": 16,
        },
        paint: {
          "text-color": "#333",
        },
      });
      /* 设置没有count的情况 */
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "clusterSource",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#007cbf",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
        layout: {
          visibility: "none", // 或者 'none' 来隐藏图层
        },
      });
      /* 点击对应聚合元素,获取zoom,执行漫游 */
      map.on("click", "fill-layer", (e) => {
        let features = map.queryRenderedFeatures(e.point, {
          layers: ["fill-layer"],
        });
        let clusterId = features[0].properties.cluster_id;
        map
          .getSource("clusterSource")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });
      map.on("mouseenter", "fill-layer", () => {
        map.getCanvasContainer().style.cursor = "pointer";
      });
      map.on("mouseleave", "fill-layer", () => {
        map.getCanvasContainer().style.cursor = "";
      });

      //加载咨询中心图层
      map.addSource("tour_source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [113.93781489143184, 22.31538783572877],
              },
              properties: {
                title: "Hong Kong International Airport Visitor Centre",
                Address:
                  "Buffer Halls A and B, Arrivals Level, Terminal 1, Hong Kong International Airport, Lantau Island",
                Centre_offers:
                  "A comprehensive range of guidebooks and maps; Recommendations on attractions, major events and festivals; Interactive sightseeing tips and practical information about airport facilities, accommodation and transport through self-service kiosks ;Free Wi-Fi access",
                image: "/src/assets/airport.jpg",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [114.16862239567102, 22.29390794829481], // approximate coordinates for Kowloon Visitor Centre
              },
              properties: {
                title: "Kowloon Visitor Centre",
                Address: "Star Ferry Concourse, Tsim Sha Tsui, Kowloon",
                Centre_offers:
                  "A comprehensive range of guidebooks and maps; Tailored itinerary planning; Signature souvenirs, Tourist Octopus (Sold version) and Discover Hong Kong Tourist SIM card available for sale; Assistance with booking selected tours; Interactive sightseeing tips and practical information through self-service kiosks; Free Wi-Fi access and mobile phone charging services available upon request",
                image: "/src/assets/kowloon.jpg",
              },
            },

            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [114.16505168421114, 22.30397675685633], // approximate coordinates for Hong Kong West Kowloon Station Visitor Centre
              },
              properties: {
                title: "Hong Kong West Kowloon Station Visitor Centre",
                Address:
                  "B2 Level, Arrival Concourse, Hong Kong West Kowloon Station",
                Centre_offers:
                  "Interactive sightseeing tips and practical information about accommodation and transport through self-service kiosks; Free Wi-Fi access",
                image: "/src/assets/west-kowloon.jpg",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [113.95152749685644, 22.317795832852312], // approximate coordinates for Hong Kong-Zhuhai-Macao Bridge Hong Kong Port Visitor Centre
              },
              properties: {
                title:
                  "Hong Kong-Zhuhai-Macao Bridge Hong Kong Port Visitor Centre",
                Address: "G/F, Passenger Clearance Building, Hong Kong Port",
                Centre_offers:
                  "A comprehensive range of guidebooks and maps; Interactive sightseeing tips and practical information about accommodation and transport through self-service kiosks; Free Wi-Fi access",
                image: "/src/assets/hkzmb.jpg",
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [114.15357302345504, 22.552726792091836], // approximate coordinates for Heung Yuen Wai Visitor Centre
              },
              properties: {
                title: "Heung Yuen Wai Visitor Centre",
                Address:
                  "Outside Arrival Hall on 2/F, Passenger Terminal Building, Heung Yuen Wai Boundary Control Point",
                Centre_offers:
                  "Interactive sightseeing tips and practical information through self-service kiosks; Free Wi-Fi access",
                image: "/src/assets/heung.jpg",
              },
            },
          ],
        },
      });
      // 加载icon图--只改变显示与隐藏
      map.addSource("icons_source", {
        type: "geojson",
        data: allGeo,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
      let id = 0;
      let promises = icons.map((icon) => {
        return new Promise((resolve, reject) => {
          map.loadImage(icon[0], function (error, image) {
            if (error) reject(error);
            map.addImage(icon[0], image);

            let size = 0.25;
            if (icon[1] === "isshop" || icon[1] === "isMemo") {
              size = 0.35;
            }
            if (icon[1] === "isShop") {
              size = 0.3;
            }
            if (icon[1] === "isTemp") {
              size = 0.28;
            }
            if (icon[1] === "isLeis") {
              size = 0.27;
            }

            map.addLayer({
              id: ids[id],
              type: "symbol",
              source: "icons_source",
              layout: {
                "icon-image": icon[0],
                "icon-size": size,
              },
              filter: ["==", ["get", icon[1]], true],
            });
            map.on("mouseenter", ids[id], function () {
              map.getCanvasContainer().style.cursor = "pointer";
            });
            map.on("mouseleave", ids[id], function () {
              map.getCanvasContainer().style.cursor = "";
            });
            id++;
            resolve();
          });
        });
      });
      // 加载区域图层
      promises.push(
        new Promise((resolve, reject) => {
          fetch("../../../public/region.json")
            .then((response) => response.json())
            .then((data) => {
              /* data.features.forEach((item) => {
                console.log(typeof item.properties.center[0]);
              }); */
              // 使用 turf.js 遍历每一个坐标点
              turf.coordEach(data, (coord) => {
                // 使用 coordtransform 库将 GCJ-02 坐标转换为 WGS-84 坐标
                const [lng, lat] = coordtransform.gcj02towgs84(
                  coord[0],
                  coord[1]
                );
                coord[0] = Number(lng);
                coord[1] = Number(lat);
              });
              // 将转换后的 GeoJSON 数据传递给 addSource 方法
              map.addSource("region_source", {
                type: "geojson",
                data: data,
              });
              map.addLayer({
                id: "region_layer",
                type: "fill", // 这将创建一个填充图层，你也可以创建其他类型的图层，如 'line' 或 'circle'
                source: "region_source", // 这是你之前添加的源的 ID
                paint: {
                  "fill-color": "#888888", // 设置图层的填充颜色
                  "fill-opacity": 0.5, // 设置图层的填充不透明度
                  "fill-outline-color": "#000000", // 设置描边的颜色
                },
              });
              //隐藏区域图层
              map
                .getLayer("region_layer")
                .setLayoutProperty("visibility", "none");
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        })
      );
      // 加载咨询中心图标
      promises.push(
        //加载image
        new Promise((resolve, reject) => {
          map.loadImage(touristCenter, function (error, image) {
            if (error) reject(error);
            map.addImage("touristCenter", image);
            map.addLayer({
              id: "tour-center",
              type: "symbol",
              source: "tour_source",
              layout: {
                "icon-image": "touristCenter",
                "icon-size": 0.2,
                "icon-allow-overlap": true,
              },
            });
            resolve();
          });
        })
      );

      Promise.all(promises)
        .then(() => {
          app.provide("$scene", scene);
          app.provide("$map", map);
          store.setLoaded();
          map.moveLayer("region_layer", "fill-layer");
          map.getLayer("region_layer").setLayoutProperty("visibility", "none");
          map.getLayer("tour-center").setLayoutProperty("visibility", "none");
        })
        .catch((error) => {
          // 如果有任何操作失败，你可以在这里处理错误
          console.error(error);
        });
      function createToggleFunction(name, index) {
        return () => {
          state.value[name] = !state.value[name];
          //设置图层的显示与隐藏
          var visibility = map.getLayoutProperty(ids[index], "visibility");
          if (visibility === "visible") {
            map.setLayoutProperty(ids[index], "visibility", "none");
          } else {
            map.setLayoutProperty(ids[index], "visibility", "visible");
          }
          allJson = getAllJson();
          map.getSource("clusterSource").setData(allJson);
        };
      }
      let keys = Object.keys(state.value);
      mountVisi = createToggleFunction(keys[0], 0);
      waterVisi = createToggleFunction(keys[1], 1);
      roadVisi = createToggleFunction(keys[2], 2);
      memoVisi = createToggleFunction(keys[3], 3);
      eduVisi = createToggleFunction(keys[4], 4);
      tempVisi = createToggleFunction(keys[5], 5);
      leisVisi = createToggleFunction(keys[6], 6);
      shopVisi = createToggleFunction(keys[7], 7);
      openAll = () => {
        for (let key in state.value) {
          state.value[key] = true;
        }
        console.log(refs.value);
        allJson = getAllJson();
        map.getSource("clusterSource").setData(allJson);
        ids.forEach((id) => {
          map.setLayoutProperty(id, "visibility", "visible");
        });
      };
      closeAll = () => {
        for (let key in state.value) {
          state.value[key] = false;
        }
        map.getSource("clusterSource").setData({
          type: "FeatureCollection",
          features: [],
        });
        ids.forEach((id) => {
          map.setLayoutProperty(id, "visibility", "none");
        });
      };
    });
  });
});
</script>

<style lang="scss" scoped>
.toggleLayer {
  position: absolute;
  width: 120px;
  top: 50px;
  left: 10px;
  z-index: 1000;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  h4 {
    margin-bottom: 10px;
  }
  ul {
    list-style: none;
    padding: 0;
    .outerLi {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 10px;
        button {
          width: 50px;
          padding: 5px;
          border: none;
          border-radius: 5px;
          background-color: rgb(0, 86, 179);
          color: white;
          cursor: pointer;
        }
      }
    }
    .buttonLi {
      display: flex;
      gap: 5px;
      button {
        width: 60%;
        padding: 5px;
        border: none;
        border-radius: 5px;
        background-color: #007cbf;
        color: white;
        cursor: pointer;
      }
    }
    hr {
      margin: 10px 0;
    }
  }
}
.pointer-cursor {
  cursor: pointer !important;
}
.active {
  background-color: rgba(66, 133, 204, 0.5) !important;
}
</style>
