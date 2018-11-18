
var directionsService;
var map = null;
var infowindow;
var marker;
var stmarker;
var showDirections = true;
var ACCESS_TOKEN = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';

function initMap() {
  // mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';
  mapboxgl.accessToken = ACCESS_TOKEN
   var map = new mapboxgl.Map({
     container: 'mapid1', // HTML container id
     style: 'mapbox://styles/mapbox/streets-v9', // style URL
     center: [-96.3365,30.6185], // starting position as [lng, lat]
     zoom: 15
   });
}

function initMapWithMarker(start, end) {
      console.log("in initMapwithMarker");
      var mapEl = $('#map');
      var optimized = mapEl.data('test-env'); //so that marker elements show up for testing
      // var myLatLng = {lat: lat, lng: lng};
     
      // mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';
      mapboxgl.accessToken = ACCESS_TOKEN
      map = new mapboxgl.Map({
        container: 'mapid1', // HTML container id
        style: 'mapbox://styles/mapbox/streets-v9', // style URL
        center: start,//[-96.3365,30.6185],
        //center: //[lat,lng], // starting position as [lng, lat]
        zoom: 15
      });
      
      var start = [-96.3409565,30.6189768];//start;
      var end = [ -96.3425741,30.6213251];//end;
      console.log("travel time invoked from outside");
      // getTravelTime(start[1], start[0], end[1], end[0]);
      
      map.on('load', function() {
        getRoute(start,end);
      });

      function getRoute(start,end) {
        console.log("route enter");
        var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
        console.log(directionsRequest)
        $.ajax({
          method: 'GET',
          url: directionsRequest,
        }).done(function(data) {
            var geo = data.routes[0].geometry;
            var route = geo;
            if(geo!=null && geo.coordinates.length!=0){
            console.log("data " +geo);
            console.log("data " + geo.coordinates[0])
            console.log("fsdfsd"+geo.coordinates.length);
            console.log("travel time invoked from outside");
            
            start = geo.coordinates[0];
            end = geo.coordinates[geo.coordinates.length-1];
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
            strtMessage = "HRBB"
            strtAddress = "Harvey R. \"Bum\" Bright Building, College Station, TX 77840..";
          }
          if(end!=null){
            endMessage = "ZACH"
            endAddress = "Zachry Engineering Education Complex, College Station, TX 77840..";
          }
          var contentStartString = '<h5>'+strtMessage+"</h5>"
          contentStartString = contentStartString + "<p>Details : "+strtAddress+"</p>"
          var contenEndString = '<h5>'+endMessage+"</h5>"
          contenEndString = contenEndString + "<p>Details : "+strtAddress+"</p>"
          
          var popStart = new mapboxgl.Popup().setHTML(contentStartString);
          var popEnd = new mapboxgl.Popup().setHTML(contenEndString);
          
          var markerStart = new mapboxgl.Marker()
                .setLngLat(start)
                .setPopup(popStart)
                .addTo(map);
          var markerEnd = new mapboxgl.Marker()
                .setLngLat(end)
                .setPopup(popEnd)
                .addTo(map);
          
        }).always(function(){
                    map.addLayer({
                      id: 'start',
                      type: 'circle',
                      source: {
                        type: 'geojson',
                        data: {
                          type: 'Feature',
                          geometry: {
                            type: 'Point',
                            coordinates: start
                          }
                        }
                      }
                      
                    });
                    map.setPaintProperty('start', 'fill-color', '#ff0000');
                    map.addLayer({
                      id: 'end',
                      type: 'circle',
                      source: {
                        type: 'geojson',
                        data: {
                          type: 'Feature',
                          geometry: {
                            type: 'Point',
                            coordinates: end
                          }
                        }
                      }
                    });
                    map.setPaintProperty('end', 'fill-color', '#ff0000');
        });
      }
}    

function removeDirections() {
  // directionsDisplay.setMap(null);
}
function calcRoute(lat, lng) {
  // if (showDirections == false) {
  //   showDirections = !showDirections;
  //   directionsDisplay.setMap(null);
  //   return;
  // }
  
 
  // var start = {
  //   lat: 0,
  //   lng: 0
  // };
  
  // if (navigator.geolocation) {
  //   directionsDisplay.setMap(map)
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     start = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //       };
        
  //       var end = {
  //           lat: lat,
  //           lng: lng
  //       };

  //       var request = {
  //         origin: start,
  //         destination: end,
  //         travelMode: 'WALKING'
  //       };
  //       directionsService.route(request, function(result, status) {
  //         if (status == 'OK') {
  //           directionsDisplay.setDirections(result);
  //             stmarker = new google.maps.Marker({
  //             position: start,
  //             map: map,
  //             icon: '/if_Star_Gold_1398915.png',
  //             optimized: false
  //           });
  //           infowindow.close()
  //         }
  //       });
        
  //     }, function() {
  //           alert('Directions to pickup point not available');
  //         });
  // } 
  // else {
  //   alert("Directions to pickup point not available")
  // }
  // showDirections = !showDirections;
  
}


function calculateAndDisplayRoute(request, startPointName, endPointName, routeId) {
//   initMap();
//   selectRoute(startPointName + " to " + endPointName);
//   var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
//   directionsDisplay.setMap(map);
//   var startPoint;
//   var endPoint;

// 	var service_callback = function(response, status) {
// 		if (status === 'OK') {
// 			directionsDisplay.setDirections(response);
// 		} else {
// 			window.alert('Directions request failed due to ' + status);
// 		}
// 	}
  
//   //var jsonData = JSON.parse(request);
// 	for (var i = 0, parts = [], max = 22; i < request.length; i = i+max) {
// 		parts.push(request.slice(i, i + max + 1));
// 	}
	
// 	startPoint = new google.maps.LatLng(parseFloat(parts[0][0].lat), parseFloat(parts[0][0].lng));
	
//     var startMark = new google.maps.Marker({
//       position: startPoint,
//       map: map,
//       title: startPointName,
//       icon: '/if_Star_Gold_1398915.png'
//     });
    
//     var startInfo = new google.maps.InfoWindow({
//       content: '<h4>' + startPointName + '</h4>',
//       maxWidth: 250
//     });
//     startMark.addListener('mouseover', function() {
//       startInfo.open(map, startMark);
//     });
    
//     endPoint = new google.maps.LatLng(parseFloat(parts[0][parts[0].length-1].lat), parseFloat(parts[0][parts[0].length-1].lng))
    
//     //add marker at end point
//     var endMark = new google.maps.Marker({
//       position: endPoint,
//       map: map,
//       title: endPointName,
//     });
//     var endInfo = new google.maps.InfoWindow({
//       content: '<h4>' + endPointName + '</h4>',
//       maxWidth: 250
//     });
//     endMark.addListener('mouseover', function() {
//       endInfo.open(map, endMark);
//     });
    
//   for (var i = 0; i < parts.length; i++) {
// 		var waypts = [];
// 		for (var j = 0; j < parts[i].length - 1; j++) {
// 			waypts.push({
// 				location : new google.maps.LatLng(parseFloat(parts[i][j].lat), parseFloat(parts[i][j].lng)),
// 				stopover : false
// 			});
// 		}
// 		//alert(parts[i][parts[i].length-1].lat)
// 		var service_opts = {
// 			origin: new google.maps.LatLng(parseFloat(parts[i][0].lat), parseFloat(parts[i][0].lng)),
// 			destination: new google.maps.LatLng(parseFloat(parts[i][parts[i].length-1].lat), parseFloat(parts[i][parts[i].length-1].lng)),
// 			waypoints: waypts,
// 			optimizeWaypoints: true,
// 			travelMode: 'WALKING'
// 		};
// 		directionsService.route(service_opts, service_callback);
// 	}
}

function selectRoute(route) {
	$('#selectedRoute').text(route);
}

// function getCartLiveLoc(){q
  
// }

// function getTravelTime(startGPSLat, startGPSLon,endGPSLat, endGPSLon){
//   console.log("travel time invoked")
//   startGPS = [startGPSLat,startGPSLon];
//   console.log("travel time invoked2")
//   endGPS = [endGPSLat,endGPSLon];
//   console.log("travel time invoked3")
//   listOfPoints = startGPS + ";" + endGPS;
//   pointList = new ArrayList<>();
//   console.log("travel time invoked4")
//   var directionsMatrixClient = MapboxMatrix.builder()
//     .accessToken('pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA')
//     .profile(DirectionsCriteria.PROFILE_DRIVING)
//     .coordinates(listOfPoints)
//     .build()
       
//     //console.log( "My travel times are:", directionsMatrixClient[0][0], directionsMatrixClient[0][1], directionsMatrixClient[1][0], directionsMatrixClient[1][1])
// }

// // function calculateDistance(strtLat, strtLong, endLat, endLong){
 
// // }


// function calculateEstimatedArrival(startGPSLat, startGPSLon){
//   // getTravelTime()
// }

// //Public API
// function plotMap( start_id, end_id){
  
// }
// function getClosestVehicleCartID(start_id){
  
// }
// function getVehicleGPS(cart_id){
  
// }