import * as L7 from "@antv/l7";
// 引入谷歌翻译客户端库
export function createMapInfo(map, scene, icons) {
  const handleClick = (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: icons,
    });
    //滑动上去cursor变成pointer
    if (features.length) {
      const feature = features[0];
      const popup = new L7.Popup({
        maxWidth: "500px",
      }).setLnglat(feature.geometry.coordinates);
      console.log(popup);
      setTimeout(() => {
        popup.setHTML(`<div style="display: flex; align-items: center; justify-content: space-around; text-align: center; gap:10px"> 
      <div style="flex: 1.5;overflow: hidden">      
        <img src="${feature.properties.image}" alt="${
          feature.properties.name
        }" style="width:100%; object-fit: contain"> 
      </div> 
      <div style="flex: 2;overflow: hidden; display:flex; flex-direction:column; justify-content:space-around"> 
        <h2 style="margin:5px 0">${feature.properties.name}</h2> 
        <p style='text-align: left;font-size:12px; overflow: hidden; text-overflow: ellipsis;'>${
          feature.properties.description.length > 70
            ? feature.properties.description.substring(0, 200) + "..."
            : feature.properties.description
        }</p> 
        <hr style="width:100%; margin: 0 auto 5px; text-align:center; border: none; border-top: 1px solid rgb(237, 28, 36);">
        <div style= "display:flex;justify-content:space-around"><span>Tags:Beach, Island, Outdoor </span>
        <span>Rating:${feature.properties.rating}</span></div>
        <a href="${
          feature.properties.website
        }" style="color: rgb(237, 28, 36)">More Info</a> </div> 
    </div>`);
      }, 100);
      scene.addPopup(popup);
    }
  };
/* ${JSON.parse(
          feature.properties.tags
        ).join(",")} */
  const startQuery = () => {
    //给每个点击的要素显示popup
    map.on("click", handleClick);
  };

  const stopQuery = () => {
    map.off("click", handleClick);
  };

  return { handleClick, startQuery, stopQuery };
}
