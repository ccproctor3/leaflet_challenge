// Store our API endpoint inside queryUrl
//var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  //"2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
console.log(queryUrl)
// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function circleSize(num){
    varnewnum = num * 4
    return varnewnum


};

function colorChoose(size) {
  switch (true) {
  case (size < 10):
    return "#55FF33";
    break;
  case (size <= 30 && size>10):
    return "#B5FF33";
    break;
  case (size <= 50 && size >30):
    return "#F9FF33";
    break;
  case (size <= 70 && size >50):
    return "#FFD733";
    break;
  case (size <= 90 && size >70):
    return "#FFB533";
    break;
  case (size > 90):
    return "#FF4633";
  default:
    return "#55FF33";
  break;
  }
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + " " +feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function(feature){
      
      return{
        radius: circleSize(feature.properties.mag),
        fillColor: colorChoose(parseFloat(feature.geometry.coordinates[2])),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
      }

    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {
	
    var div = L.DomUtil.create('div', 'info legend'),
        quakes = [0, 20, 40, 60, 80, 100],
        labels = [];

    //use loop to create each line
    for (var i = 0; i < quakes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorChoose(quakes[i] + 1) + '"></i> ' +
            quakes[i] + (quakes[i + 1] ? '&ndash;' + quakes[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
}


