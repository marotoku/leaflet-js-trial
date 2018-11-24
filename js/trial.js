var mymap = L.map('map');

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

mymap.setView([43.0620306, 141.3543755], 7);

function getJSON(url) {
  var req = new XMLHttpRequest();                 // XMLHttpRequest オブジェクトを生成する
  req.onreadystatechange = function() {           // XMLHttpRequest オブジェクトの状態が変化した際に呼び出されるイベントハンドラ
    if(req.readyState == 4 && req.status == 200){ // サーバーからのレスポンスが完了し、かつ、通信が正常に終了した場合
      return JSON.parse(req.responseText);
    }
  };
  req.open("GET", url, true); // HTTPメソッドとアクセスするサーバーのURLを指定
  req.send(null);              // 実際にサーバーへリクエストを送信
}

function getColor(pop) {
  return pop > 100000 ? '#ffffe5' :
         pop > 23000  ? '#fff7bc' :
         pop > 14000  ? '#fee391' :
         pop > 8500   ? '#fec44f' :
         pop > 6500   ? '#fe9929' :
         pop > 5000   ? '#ec7014' :
         pop > 4000   ? '#cc4c02' :
         pop > 3200   ? '#993404' :
         pop > 2500   ? '#662506' :
                        '#331203' ;
}

function style(feature) {
  var id = feature.geometry.id;
  var population = stats[id].population;
  return {
    fillColor: getColor(population),
    weight: 2,
    opacity: 1,
    color: 'black',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

var stats = getJSON("./data/population.json");
var hokkaido = getJSON("./data/01.json");

var boundary = L.geoJson(hokkaido, {
        style: style
}).addTo(mymap);