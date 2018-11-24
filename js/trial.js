var mymap = L.map('map');

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

mymap.setView([43.0620306, 141.3543755], 7);

function getJSON(jsonFile) {
  var req = new XMLHttpRequest();                 // XMLHttpRequest オブジェクトを生成する
  req.onreadystatechange = function() {           // XMLHttpRequest オブジェクトの状態が変化した際に呼び出されるイベントハンドラ
    if(req.readyState == 4 && req.status == 200){ // サーバーからのレスポンスが完了し、かつ、通信が正常に終了した場合
      return JSON.parse(req.responseText);    // 取得した JSON ファイルの中身を変数へ格納
    }
  };
  req.open("GET", jsonFile, false);          // HTTPメソッドとアクセスするサーバーのURLを指定
  req.send(null);                            // 実際にサーバーへリクエストを送信
}

var hokkaido = getJson("../data/01.json");

var boundary = L.geoJson(hokkaido, {
        style: style,
}).addTo(map);