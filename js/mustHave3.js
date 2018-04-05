function getInfoFromMarker(marker) {
    var latlng = { lat: parseFloat(marker.latLng.lat()), lng: parseFloat(marker.latLng.lng()) };
    geocoder.geocode({ 'location': latlng }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                infoWindow.setContent(
                    '<div><b>Globant ' +
                    buildGlobantLocation(results[0]) +
                    '</b></div>');
            }
        }
    });
}

function buildGlobantLocation(location) {
    return extractShortNameFrom(location.address_components, "locality") + '/' + extractShortNameFrom(location.address_components, "country");
}