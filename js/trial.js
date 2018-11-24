var mymap = L.map('map');

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

mymap.setView([43.0620306, 141.3543755], 7);

function getJSON(url) {
  var req = new XMLHttpRequest();                 // XMLHttpRequest オブジェクトを生成する
  var data;
  req.onreadystatechange = function() {           // XMLHttpRequest オブジェクトの状態が変化した際に呼び出されるイベントハンドラ
    if(req.readyState == 4 && req.status == 200){ // サーバーからのレスポンスが完了し、かつ、通信が正常に終了した場合
      data = JSON.parse(req.responseText);
    }
  };
  req.open("GET", url, false); // HTTPメソッドとアクセスするサーバーのURLを指定
  req.send(null);              // 実際にサーバーへリクエストを送信
  return data;
}

function getColor(pop) {
  return pop > 100000 ? '#ffffe5' :
         pop > 23000  ? '#f7fcb9' :
         pop > 14000  ? '#d9f0a3' :
         pop > 8500   ? '#addd8e' :
         pop > 6500   ? '#78c679' :
         pop > 5000   ? '#41ab5d' :
         pop > 4000   ? '#238443' :
         pop > 3200   ? '#006837' :
         pop > 2500   ? '#004529' :
                        '#002213' ;
}

function style(feature) {
  var id = feature.id;
  var items = stats.filter( item => item.id === id );
  var population = 0;
  if (items.length == 1) {
    population = items[0].population;
  }
  return {
    fillColor: getColor(population),
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.4
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.5
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}

function resetHighlight(e) {
  boundary.resetStyle(e.target);
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

var stats = getJSON("./data/population.json");
var hokkaido = getJSON("./data/01.json");

var boundary = L.geoJson(hokkaido, {
        style: style,
        onEachFeature: onEachFeature
}).addTo(mymap);