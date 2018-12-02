var map = null;
var markerLive;
var route;
var stepSize = 0;
var ACCESS_TOKEN = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';

function initMap() {
  mapboxgl.accessToken = ACCESS_TOKEN
   var map = new mapboxgl.Map({
     container: 'mapid1', // HTML container id
     style: 'mapbox://styles/mapbox/streets-v9', // style URL
     center: [-96.3365,30.6185], // starting position as [lng, lat]
     zoom: 15
   });
   
}


function findMidPoint(start,end) {
  var lat1= start[1];
  var lon1= start[0];
  var lat2 = end[1];
  var lon2 = end[0];
  var dLon = (function (x) { return x * Math.PI / 180; })(lon2 - lon1);
  lat1 = (function (x) { return x * Math.PI / 180; })(lat1);
  lat2 = (function (x) { return x * Math.PI / 180; })(lat2);
  lon1 = (function (x) { return x * Math.PI / 180; })(lon1);
  var Bx = Math.cos(lat2) * Math.cos(dLon);
  var By = Math.cos(lat2) * Math.sin(dLon);
  var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
  var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
  lat3 = lat3 * 180 / Math.PI;
  lon3 = lon3 * 180 / Math.PI;
  console.log("My lat long are:", lat3, lon3);
  return [lon3,lat3];
}


function initMapWithMarker(start, end, liveLocation) {
  
      console.log("in initMapwithMarker");
      var mapEl = $('#map');
      var optimized = mapEl.data('test-env');
      mapboxgl.accessToken = ACCESS_TOKEN
      map = new mapboxgl.Map({
        container: 'mapid1', // HTML container id
        style: 'mapbox://styles/mapbox/streets-v9', // style URL
        center: findMidPoint(start,end),
        zoom: 14
      });
      
      console.log("travel time invoked from outside");
      
      map.on('load', function() {
        getRoute(start,end);
      });

      function getRoute(start,end) {
        console.log("route enter");
        var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
        console.log(directionsRequest)
        $.ajax({
          method: 'GET',
          url: directionsRequest,
        }).done(function(data) {
            route = data.routes[0].geometry;
            var distancebtw = data.routes[0].distance*0.001*0.621371;//km to miles
            var durationbtw = data.routes[0].duration*60;
            var distDur = getDistanceDuration(start,end)
            console.log("distance is " + distancebtw);
            console.log("duration is " + durationbtw);
            if(distDur!=null){
              console.log("Live distance is " + distDur[0]);
              console.log("Live duration is " + distDur[1]);
            }
            document.getElementById('ETA').innerHTML = distancebtw;
            document.getElementById('ETT').innerHTML = durationbtw;
            
            if(route!=null && route.coordinates.length!=0){
            console.log("data " +route);
            console.log("data " + route.coordinates[0])
            console.log("fsdfsd"+route.coordinates.length);
            console.log("travel time invoked from outside");
            
            start = route.coordinates[0];
            if(markerLive!=null){
              markerLive.setLngLat(route.coordinates[1]);
            }
            end = route.coordinates[route.coordinates.length-1];
            console.log(route);
          }
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: route
              }
            },
            paint: {
              'line-width': 2
            }
          });
          // this is where the code from the next step will go
          var message = null;
          if(start!=null){
            strtMessage = "Start:"+"HRBB"
            strtAddress = "Harvey R. \"Bum\" Bright Building, College Station, TX 77840..";
          }
          if(end!=null){
            endMessage = "End:"+"ZACH"
            endAddress = "Zachry Engineering Education Complex, College Station, TX 77840..";
          }
          var contentStartString = '<h5>'+strtMessage+"</h5>"
          contentStartString = contentStartString + "<p>Details : "+strtAddress+"</p>"
          var contenEndString = '<h5>'+endMessage+"</h5>"
          contenEndString = contenEndString + "<p>Details : "+strtAddress+"</p>"
          
          var popStart = new mapboxgl.Popup().setHTML(contentStartString);
          var popEnd = new mapboxgl.Popup().setHTML(contenEndString);
          
          var geojson = {
              "type": "FeatureCollection",
              "features": [
                  {
                      "type": "Feature",
                      "properties": {
                          "iconSize": [15, 15]
                      }
                  }
              ]
          };
          
          var startDiv = document.createElement('div');
          startDiv.className = 'markerStart';
          var endDiv = document.createElement('div');
          endDiv.className = 'markerEnd';
          var liveDiv = document.createElement('div');
          liveDiv.className = 'markerLive';
          
          var markerStart = new mapboxgl.Marker(startDiv)
                .setLngLat(start)
                .setPopup(popStart)
                .addTo(map);
          var markerEnd = new mapboxgl.Marker(endDiv)
                .setLngLat(end)
                .setPopup(popEnd)
                .addTo(map);
          markerLive = new mapboxgl.Marker(liveDiv)
                .setLngLat(liveLocation)
                .addTo(map);
          
        }).always(function(){
        });
      }
      setInterval(function(){
        console.log("Hello");
        if(markerLive!= null && stepSize<=route.coordinates.length){
          markerLive.setLngLat(route.coordinates[stepSize++]);
          console.log("Change");
        }
      }, 3000);
      console.log("Hi!!!");
}    

function calcRoute(lat, lng) {
}


function calculateAndDisplayRoute(request, startPointName, endPointName, routeId) {
}

function getDistanceDuration(start, end){
    var e = start[0] +","+start[1] +";" + end[0] + "," + end[1];
    mapboxgl.accessToken = ACCESS_TOKEN
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    req.onload  = function() {
      var jsonResponse = req.response;
      var distance = jsonResponse.routes[0].distance*0.001*0.621371; // convert to km
      var duration = jsonResponse.routes[0].duration/60; // convert to minutes
      return [distance,duration];
    };
    var data = req.send();
    return data;
}



function getMatch(e) {
    console.log("match route invoked");
    mapboxgl.accessToken = ACCESS_TOKEN
    var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
    
    $.ajax({
          method: 'GET',
          url: directionsRequest,
        }).done(function(data) {
            var geo = data.routes[0].geometry;
            var distancebtw = data.routes[0].distance*0.001;
            var durationbtw = data.routes[0].duration*60;
            
            console.log("distance is " + distancebtw);
            console.log("duration is " + durationbtw);
            
            if(geo!=null && geo.coordinates.length!=0){
              start = geo.coordinates[0];
              end = geo.coordinates[geo.coordinates.length-1];
              setTimeout(getMatch(e), 10000);
              
          }
        })
}
    
function abc(){
  console.log("hello hello");
}