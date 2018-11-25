var mymap = L.map('map');

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

mymap.setView([43.0620306, 141.3543755], 7);

function getJSON(url) {
  var req = new XMLHttpRequest();
  var data;
  req.onreadystatechange = function() {
    if(req.readyState == 4 && req.status == 200){
      data = JSON.parse(req.responseText);
    }
  };
  req.open("GET", url, false);
  req.send(null);
  return data;
}

function getColor(pop) {
  return pop > 200000 ? '#005a32' :
         pop > 100000  ? '#238443' :
         pop > 50000  ? '#41ab5d' :
         pop > 20000   ? '#78c679' :
         pop > 10000   ? '#addd8e' :
         pop > 5000   ? '#d9f0a3' :
                        '#ffffcc' ;
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

  info.update(layer.feature.id);
}

function resetHighlight(e) {
  boundary.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

function getStatsById(stats, id) {
  var cityName = "";
  var population = 0;
  var populationMale = 0;
  var populationFemale = 0;
  var households = 0;

  var items = stats.filter(item => item.id === id);
  if (items.length == 1) {
    cityName = items[0].cityName;
    population = items[0].population;
    populationMale = items[0].populationMale;
    populationFemale = items[0].populationFemale;
    households = items[0].households;
  }

  return {
    'cityName': cityName,
    'population': population,
    'populationMale': populationMale,
    'populationFemale': populationFemale,
    'households': households
  };
}

function addComma(num) {
  var _num = num.replace( /^(-?\d+)(\d{3})/, "$1,$2" );
  if(_num !== num) {
    return addComma(_num);
  }
  return _num;
}

var stats = getJSON("./data/population.json");
var hokkaido = getJSON("./data/01.json");

var boundary = L.geoJson(hokkaido, {
        style: style,
        onEachFeature: onEachFeature
}).addTo(mymap);

var info = L.control();

info.onAdd = function (mymap) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (id) {
  var data = getStatsById(stats, id);
  var html = "<h4>国勢調査（H27）人口・世帯数</h4>"
  html = html + "<h5>" + (id ? data.cityName : "マウスカーソルを合わせてください") + "</h5>"
  html = html + "<table>"
  html = html + "<tr><th scope='row'>人口</th><td>" + (id ? addComma(data.population.toString()) : "--") + "</td><td class='unit'>人</td></tr>"
  html = html + "<tr><th scope='row'>男性人口</th><td>" + (id ? addComma(data.populationMale.toString()) : "--") + "</td><td class='unit'>人</td></tr>"
  html = html + "<tr><th scope='row'>女性人口</th><td>" + (id ? addComma(data.populationFemale.toString()) : "--") + "</td><td class='unit'>人</td></tr>"
  html = html + "<tr><th scope='row'>世帯数</th><td>" + (id ? addComma(data.households.toString()) : "--") + "</td><td class='unit'>世帯</td></tr>"
  html = html + "</table>"
  this._div.innerHTML = html;
};
info.addTo(mymap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 5000, 10000, 20000, 50000, 100000, 200000],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];
    
    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }
    
  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(mymap);