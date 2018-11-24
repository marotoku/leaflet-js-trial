var mymap = L.map('map');

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

mymap.setView([43.0620306, 141.3543755], 7);


var markerIcon = L.icon({
  iconUrl: 'http://www.nowhere.co.jp/blog/wp-content/uploads/2018/07/marker.png', // アイコン画像のURL

  iconSize: [32, 32], // アイコンの大きさ
  iconAnchor: [16, 32], // 画像内でマーカーの位置を指し示す点の位置
  popupAnchor: [0, -32] // ポップアップが出現する位置（iconAnchorからの相対位置）
});

var marker01 = L.marker([37.508106, 139.930239], {
  icon: markerIcon
}).addTo(mymap);
var marker02 = L.marker([37.494833, 139.929750], {
  icon: markerIcon
}).addTo(mymap);

marker01.bindPopup("会津若松駅");
marker02.bindPopup("会津若松市役所");

var route = L.polyline([
  [37.507543, 139.930619],
  [37.507016, 139.932408],
  [37.498371, 139.928649],
  [37.495337, 139.928006],
  [37.495123, 139.929800],
  [37.494833, 139.929750]
], {
  color: "blue",
  weight: 6
}).addTo(mymap);

route.bindPopup("駅から市役所までの経路");
