export default class CustomNavigationControl {
  constructor() {
    this._zoomInButton = null;
    this._zoomOutButton = null;
    this._compassButton = null;
    this._container = document.createElement("div");
  }

  onAdd(map) {
    this._map = map;

    // 创建放大按钮
    this._zoomInButton = document.createElement("button");
    this._zoomInButton.textContent = "+";
    this._zoomInButton.onclick = () => {
      this._map.zoomIn();
    };

    // 创建缩小按钮
    this._zoomOutButton = document.createElement("button");
    this._zoomOutButton.textContent = "-";
    this._zoomOutButton.onclick = () => {
      this._map.zoomOut();
    };

    // 创建指北针按钮
    this._compassButton = document.createElement("button");
    this._compassButton.textContent = "N";
    this._compassButton.onclick = () => {
      this._map.setBearing(0);
    };

    this._container.className =
      "mapboxgl-ctrl mapboxgl-ctrl-group custom-control-nav";
    this._container.appendChild(this._zoomInButton);
    this._container.appendChild(this._zoomOutButton);
    this._container.appendChild(this._compassButton);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
