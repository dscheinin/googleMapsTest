function showFeatureDistanceFromUserLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
        userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var distanceToArray = new Array();
        var distanceToLocation = new Array();
        map.data.forEach(function(feature) {
            distanceToArray.push(feature.getGeometry().get());
        });
        showDrivingDistancesFromLatLng(userLocation, distanceToArray);
    });
};

function showDrivingDistancesFromLatLng(origin, positions) {
    var service = new google.maps.DistanceMatrixService();
    drivingDistancePanel.innerHTML = "";

    do {
        var positionSplice = positions.splice(0, positions.length > 25 ? 25 : positions.length);
        service.getDistanceMatrix({
            origins: [origin],
            destinations: positionSplice,
            travelMode: 'DRIVING',
        }, callback);
    } while (positions.length > 0);

    function callback(response, status) {
        var row;
        var originIndex = 0;
        for (row of response.rows) {
            var element;
            var destinationIndex = 0;
            if (isDivInnerHTMLEmpty(drivingDistancePanel)) {
                addStringToDivInnerHTML(drivingDistancePanel, "Driving distance from " + response.originAddresses[originIndex] + ":<br/>");
            }
            for (element of row.elements) {
                var duration, distance;
                try {
                    distance = element.distance.text;
                } catch (e) {
                    distance = 'unknown';
                }
                try {
                    duration = element.duration.text;
                } catch (e) {
                    duration = 'unknown';
                }

                addStringToDivInnerHTML(drivingDistancePanel, "To " + response.destinationAddresses[destinationIndex] + ", " + distance + " can drive in " + duration + "<br/>");

                destinationIndex++;
            }
            originIndex++; //support multiple for future implementation
        }
    }
}

function exportJSON() {
    map.data.toGeoJson(function(obj) {
        document.getElementById('geoJson').innerHTML = JSON.stringify(obj, null, 2);
      });
}