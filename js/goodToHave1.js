function initAutocomplete() {
    // add Autocomplete suport
    var autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('addressInput')),{types: ['(regions)']});
    //(document.getElementById('addressInput')),{types: ['(cities)']});
    //(document.getElementById('addressInput')));
    autocomplete.bindTo('bounds', map);

    // add event to handle autocomplete
    autocomplete.addListener('place_changed', function() {
        infoWindow.close();
        currentPositionMarker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(6);
        }
        window.alert("Location: " + place.geometry.location);
        showCurrentPosition(place.geometry.location);
        currentPositionMarker.setVisible(true);
        displayNearestLocations();
    });
}
