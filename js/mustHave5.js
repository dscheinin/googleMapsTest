function initDirectionsDisplay() {
    directionsDisplay.setMap(null);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(null);
    directionsDisplay.setPanel(directionsPanel);
}

function showDirectionsFromLocationMarker(feature) {
    initDirectionsDisplay();

    navigator.geolocation.getCurrentPosition(function(position) {
        var userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        directionsService.route({
            origin: currentPosition,
            destination: feature.getGeometry().get(),
            travelMode: 'DRIVING'
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    });
}