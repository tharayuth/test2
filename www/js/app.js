// Dom7
var $ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  theme: theme,
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  routes: routes,
  vi: {
    placementId: 'pltd4o7ibb9rc653x14',
  },
});

$(document).on('deviceready', function () {
  console.log("Device is ready!");
  // console.log(StatusBar);
  StatusBar.overlaysWebView(false);

  document.addEventListener("backbutton", function (e) {
    app.router.back(true)
  }, false);

  initGoogleMap();
  var map_toyota1 = new GMaps({
      el: '#map_toyota1',
      lat: 13.043333,
      lng: 100.028333
  });
  var map_toyota2 = new GMaps({
      el: '#map_toyota2',
      lat: 13.043333,
      lng: 100.028333
  });

  // document.getElementById("cameraTakePicture").addEventListener
  // 	("click", cameraTakePicture);

});

var watchID = null;
var loc1,loc2;
var map_google,infoWindow,trafficLayer,currentPosition;
function initGoogleMap() {
    map_google = new google.maps.Map(document.getElementById('map_google'), {
        zoom: 17,
        center : {lat: 13.743333,lng: 100.628333}
    });
    infoWindow = new google.maps.InfoWindow;
    setTimeout(function(){
      reloadTrafficGoogleMap();
    },10000);
    reloadTrafficGoogleMap();
    trackingLocation();
}

function trackingLocation(){
  var options = { frequency: 5000 };
  watchID = navigator.geolocation.watchPosition(function(position){

    currentPosition = position;
    document.getElementById('current_lat').innerHTML = position.coords.latitude.toFixed(5);
    document.getElementById('current_lng').innerHTML = position.coords.longitude.toFixed(5);
    //document.getElementById('current_alt').innerHTML = position.coords.altitude;
    //document.getElementById('current_acc').innerHTML = position.coords.accuracy;
    //document.getElementById('current_speed').innerHTML = position.coords.speed;
    document.getElementById('current_time').innerHTML = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");;
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log('trackingLocation# position 5sec ',position.coords.latitude+','+position.coords.longitude);

    loc1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    if(loc2){
      var distance = google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2);
      if (distance < 50) {
          //alert("target arrived");
      } else {
        console.log('trackingLocation# position change ',position.coords.latitude+','+position.coords.longitude);
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map_google);
        map_google.setCenter(pos);
        loc2 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      }
    } else {
      console.log('trackingLocation# position start ',position.coords.latitude+','+position.coords.longitude);
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map_google);
      map_google.setCenter(pos);
      loc2 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    }

  }, function(error){

  }, options);

}

function reloadTrafficGoogleMap(){
  trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map_google);
}
