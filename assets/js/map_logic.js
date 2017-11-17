// Google API key
var gApiKey = "AIzaSyA93nggvvGoSQ5SdADAd10d0EjqgLooYGc";

// Include the libraries=places parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infoWindow;
var infoWindowLocation;

var placesService;
var directionsService;
var directionsDisplay;

// default location: 300 Atrium Drive, Somerset
var mapLocation = {
  lat: 40.535140, 
  lng: -74.521617 
};

// flag to keep track if using geolocation for nearest location search
var geolocationFound = false;

// location of the nearest McDonald's
var nearestVenue = null;
var nearestLocation = null;

function initMap() {
  // draw map
  map = new google.maps.Map(document.getElementById('map'), {
    center: mapLocation,
    zoom: 20,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var inputLocation = document.getElementById('loc-input');
  var searchBox = new google.maps.places.SearchBox(inputLocation);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // var markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    if (places.length == 1) {
      console.log("Place Selected!");
      console.log(places[0]);

      mapLocation = places[0].geometry.location;       

      searchForLocations();   
      return;
    }

    // Clear out the old markers.
    // markers.forEach(function(marker) {
    //   marker.setMap(null);
    // });
    // markers = [];



    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      // var icon = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25)
      // };

      // Create a marker for each place.
      // markers.push(new google.maps.Marker({
      //   map: map,
      //   icon: icon,
      //   title: place.name,
      //   position: place.geometry.location
      // }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);
  });

  infoWindow = new google.maps.InfoWindow();
  infoWindowLocation = new google.maps.InfoWindow();

  // on startup, try the user's location
  tryLocation();
}

function tryLocation(){
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      mapLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      geolocationFound = true;

      searchForLocations();
    }, 
    function() {
      // geolocation failed
      handleLocationError(true, infoWindow);
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow);
  }
}

function handleLocationError(browserHasGeolocation, infoWindow) {
  var locationFailedMessage = browserHasGeolocation ?
    "The GeoLocation service failed." :
    "GeoLocation not supported by browser.";

  $("#loc-failed").html(locationFailedMessage);

  // Create the search box and link it to the UI element.
  var inputArea = document.getElementById('user-input');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputArea);
}

function searchForLocations(){
  placesService = new google.maps.places.PlacesService(map);
  placesService.nearbySearch({
    location: mapLocation,
    key: gApiKey,
    // radius: 8047, (5 miles)
    rankBy: google.maps.places.RankBy.DISTANCE,
    name: "McDonald's",
    type: ['restaurant']
  }, 
  findLocations);
}

function findLocations(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {

    if (results.length > 0){
      // set nearest venue
      nearestVenue = results[0];
      console.log(nearestVenue);

      // get location
      nearestLocation = nearestVenue.geometry.location;

      getDirections();
    }          
  }
}

function getDirections() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  var directionsPanel = document.getElementById('directions');
  directionsDisplay.setPanel(directionsPanel);

  calculateAndDisplayRoute(directionsService, directionsDisplay);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: mapLocation,
    destination: nearestLocation,
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.IMPERIAL
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);

      console.log(response);

      getLocationDetails();
    } else {
      console.log('Directions request failed due to ' + status);
    }
  });
}

function getLocationDetails(){
  placesService.getDetails({
    placeId: nearestVenue.place_id
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      infoWindowLocation.setContent(
        '<div><strong><em>' + place.name + '</em></strong><br>' +
        // 'Place ID: ' + place.place_id + '<br>' +
        place.formatted_address + '<br>' +
        place.formatted_phone_number + '</div>');
      infoWindowLocation.setPosition(nearestLocation);
      infoWindowLocation.open(map);

      console.log(place);

      var locationString = geolocationFound ?
        "as determined by GeoLocation" : 
        "as entered by the user";
      infoWindow.setContent(
        "<div><strong><em>Your location</em></strong><br>" +
        locationString + "</div>");
      infoWindow.setPosition(mapLocation);
      infoWindow.open(map);

      // var inputLocation = document.getElementById('loc-input');
      var mapControls = map.controls[google.maps.ControlPosition.TOP_LEFT];
      if (mapControls.length > 0){
        mapControls.pop();
      }
    }
  });
}

// currently unused
// function createMarker(place) {
//   var marker = new google.maps.Marker({
//     map: map,
//     position: place.geometry.location
//   });
//   google.maps.event.addListener(marker, 'click', function() {
//     infoWindow.setContent(place.name);
//     infoWindow.open(map, this);
//   });
// }