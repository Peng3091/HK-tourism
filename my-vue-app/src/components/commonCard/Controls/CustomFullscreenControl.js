// customFullscreenControl.js
export default class CustomFullscreenControl {
  constructor() {
    this._button = null;
    this._container = document.createElement("div");
  }

  onAdd(map) {
    this._map = map;
    this._button = document.createElement("button");
    this._button.textContent = "全屏";
    this._button.onclick = () => {
      if (!document.fullscreenElement) {
        this._map.getContainer().requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };
    this._container.className =
      "mapboxgl-ctrl mapboxgl-ctrl-group custom-control-ful";
    this._container.appendChild(this._button);
    /* // 添加调试代码
    console.log(this._container instanceof Node); // 应该打印 "true"
    console.log(this._container); // 打印 this._container 的值
    console.log(this._map.getContainer() instanceof Node); // 应该打印 "true"
    console.log(this._map.getContainer()); // 打印 this._map.getContainer() 的值"true"
    console.log(this._button instanceof Node); // 应该打印 "true"
    console.log(this._button); // 打印 this._button 的值
    // 在这里添加你的appendChild调用 */
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
