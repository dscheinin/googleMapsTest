function centerOnUserLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
        currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.panTo(currentPosition);
        showCurrentPosition(currentPosition);
    });
}