function displayAllLocations() {
    // all Globant offices
    var shape = {
        coords: [0, 0, 0, 32, 16, 24, 0, 0],
        type: 'poly'
    };
    var image = {
        url: 'globant.png',
        size: new google.maps.Size(24, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32),
        shape: shape
    };

    loadGeoJSON();
    
    map.data.setStyle(function(feature) {
        return {
            icon: image
        };
    });
}

function loadGeoJSON () {
    //return await map.data.loadGeoJson('mustHave1.json');
    fetch('mustHave1.json').then(function(features){
        return features.json();
    }).then(function(jsonData){
        map.data.addGeoJson(jsonData);
        map.data.forEach(function(feature){
            feature.setProperty('globantOffice', '');
            var latlng = { lat: parseFloat(feature.getGeometry().get().lat()), lng: parseFloat(feature.getGeometry().get().lng()) };
            geocoder.geocode({ 'location': latlng }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        feature.setProperty('globantOffice',
                            'Globant ' + buildGlobantLocation(results[0]));
                    }
                } else {
                    feature.setProperty('globantOffice',
                            'Globant {lat:' + parseFloat(feature.getGeometry().get().lat()) + ',lng:' + parseFloat(feature.getGeometry().get().lng()) + '}');
                }
            });
        });    
    });
}

function displayNearestLocations() {
    nearestLocationsPanel.innerHTML = "Nearest locations from current location:<br/>";
    var distanceToLocation = new Array();
    map.data.forEach(function(feature) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, feature.getGeometry().get()) / 1000;
        distanceToLocation.push({ distance: distance, feature: feature.getGeometry().get(), name: feature.getProperty('globantOffice') });
    });
    showNearestLocations(distanceToLocation);
}

function showNearestLocations(distanceToLocation) {
    var topNSelected = document.getElementById("topLocations") ? document.getElementById("topLocations").value : 1 ;
    distanceToLocation.sort(function(a, b) { return a.distance - b.distance });
    nearestLocations = distanceToLocation.splice(0, distanceToLocation.length > topNSelected ? topNSelected : distanceToLocation.length);
    nearestLocations.forEach(function(element) {
        addStringToDivInnerHTML(nearestLocationsPanel,
            "To " + element.name + " " +
            element.distance.toFixed(2) + "km<br/>");
    });
}