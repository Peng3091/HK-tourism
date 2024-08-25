import * as L7 from "@antv/l7";

export function createCenterInfo(map, scene, layer) {
  const handleClick = (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [layer],
    });
    //滑动上去cursor变成pointer
    if (features.length) {
      map.getCanvas().style.cursor = "pointer";
      const feature = features[0];
      const popup = new L7.Popup({
        maxWidth: "700px",
      }).setLnglat(feature.geometry.coordinates).setHTML(`<div style="display: flex; align-items: center; justify-content: center;">
      <div style="flex:1.5">      
      <h2 style="margin-bottom:10px">${feature.properties.title}</h2>
      <p style="margin-bottom:5px"><span style="font-weight:800">Address: </span>${feature.properties.Address}</p>
      <p><span style="font-weight:800;">Centre offers:</span> ${feature.properties.Centre_offers}</p>
      </div>
      <div style="flex:1">
      <img src=${feature.properties.image} style="max-width: 100%; height: auto;"></img>
      </div>
    </div>`);
      scene.addPopup(popup);
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
