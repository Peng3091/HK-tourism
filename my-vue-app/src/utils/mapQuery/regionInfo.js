import * as L7 from "@antv/l7";
import * as turf from "@turf/turf";

export function createRegionInfo(map, scene, region_layer, allData) {
  // 获取被点击的区域
  const handleClick = (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [region_layer],
    });
    if (features.length) {
      const feature = features[0];
      const center = JSON.parse(feature.properties.center);
      const coordinates = [Number(center[0]), Number(center[1])];

      let searchWithin = feature.geometry;

      let pointsInRegion = [];
      allData.features.forEach((item) => {
        let point = turf.point([
          item.geometry.coordinates[0],
          item.geometry.coordinates[1],
        ]);
        let isInPolygon = turf.booleanPointInPolygon(point, searchWithin);
        if (isInPolygon) {
          pointsInRegion.push(item);
        }
        //把在区域内的点存储在一个数组中
        let typeCounts = {};
        for (var i = 0; i < pointsInRegion.length; i++) {
          var properties = pointsInRegion[i].properties;
          for (var type in properties) {
            let typeNames = {
              isMount: "Hiking & Trekking",
              isWater: "Beaches & Islands",
              isRoad: "Ethnic Districts",
              isMemo: "Memorials",
              isEdu: "Cultural Centers",
              isTemp: "Temples",
              isLeis: "Leisure Activities",
              isShop: "Shopping",
            };
            if (properties[type] === true) {
              let typeName = typeNames[type];
              if (typeCounts[typeName]) {
                typeCounts[typeName]++;
              } else {
                typeCounts[typeName] = 1;
              }
            }
          }
        }
        // 创建HTML表格
        var tableHTML = `<h3 style="color: rgb(0, 124, 191);margin-bottom:10px">${feature.properties.name} Attraction Type Statistics Table</h3><table style="width: 100%; border: 1px solid black;border-collapse: collapse"><tr><th style="background-color: #f2f2f2;">Type</th><th style="background-color: #f2f2f2;">Count</th></tr>`;
        for (var type in typeCounts) {
          tableHTML +=
            "<tr><td style='border: 1px solid black;text-align: center'>" +
            type +
            "</td><td style='border: 1px solid black;text-align: center'>" +
            typeCounts[type] +
            "</td></tr>";
        }
        tableHTML += "</table>";
        //访问center的类型
        // 创建一个新的Popup并显示区域的名称

        const popup = new L7.Popup()
          .setLngLat(coordinates) // 假设区域的中心点存储在'centroid'属性中
          .setHTML(tableHTML); // 假设区域的名称存储在'name'属性中
        scene.addPopup(popup);
      });
    }
  };
  const startQuery = () => {
    //给每个点击的要素显示popup
    map.on("click", handleClick);
  };

  const stopQuery = () => {
    map.off("click", handleClick);
  };
  return { handleClick, startQuery, stopQuery };
}
