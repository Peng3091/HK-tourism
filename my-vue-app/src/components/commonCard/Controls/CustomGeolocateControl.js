export default class CustomGeolocateControl {
  constructor() {
    this._button = null;
    this._container = document.createElement("div");
  }

  onAdd(map) {
    this._map = map;
    this._button = document.createElement("button");
    this._button.textContent = "定位";
    this._button.onclick = () => {
      // 定位逻辑
      navigator.geolocation.getCurrentPosition((position) => {
        this._map.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15,
        });
      });
    };
    this._container.className =
      "mapboxgl-ctrl mapboxgl-ctrl-group custom-control-geo";
    this._container.appendChild(this._button);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
