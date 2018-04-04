function initGlobalMapsComponents() {
    window.markers = [];

    window.infoWindow = new google.maps.InfoWindow;
    window.geocoder = new google.maps.Geocoder;

    window.directionsService = new google.maps.DirectionsService;
    window.directionsDisplay = new google.maps.DirectionsRenderer;

    window.map = buildMap();

    window.currentPosition = map.getCenter();
}

function initGlobalDOMShortcuts() {
    window.drivingDistancePanel = document.getElementById("drivingDistancePanel");
    window.directionsPanel = document.getElementById("directionsPanel");
    window.nearestLocationsPanel = document.getElementById("nearestLocationsPanel")
    window.mapPanel = document.getElementById("map");
    window.locationSelect = document.getElementById("locationSelect");
}

function buildMap() {
    var buenosAires = {
        lat: -34.5681375,
        lng: -58.4544698
    };
    var builtMap = new google.maps.Map(mapPanel, {
        center: buenosAires,
        zoom: 5,
        mapTypeId: 'roadmap',
        styles: getMapStyle(),
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    });

    return builtMap;
}

function initDOMListeners() {
    map.data.addListener('click', function(event) {
        onMarkerClick(event, map);
    });

    initAutocomplete();
}

function onMarkerClick(event, map) {
    infoWindow.setPosition(event.feature.getGeometry().get());
    infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
    infoWindow.setContent(event.feature.getProperty('globantOffice'));
    // getInfoFromMarker(event);
    infoWindow.open(map);
    showDirectionsFromLocationMarker(event.feature);
}

function extractShortNameFrom(addressComponents, component) {
    for (var i = 0; i < addressComponents.length; i++) {
        if (addressComponents[i].types[0] == component) {
            return addressComponents[i].short_name;
        }
    }
    return '';
}

function showCurrentPosition(latLng) {
    window.currentPositionMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(currentPositionMarker, 'click', function() {
        infoWindow.setContent("You are here!");
        infoWindow.open(map, currentPositionMarker);
    });
    currentPosition = latLng;
    displayNearestLocations();
}

function onPlaceChanged() {
    infoWindow.close();
    if (currentPositionMarker) {
        currentPositionMarker.setVisible(false);
    }
    if (autocomplete) {
        var place = autocomplete.getPlace();
        if (place) {
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
                map.setZoom(5);
            }
            showCurrentPosition(place.geometry.location);
            currentPositionMarker.setVisible(true);
        }
    }
    currentPosition = map.getCenter();
    displayNearestLocations();
    console.log("onPlaceChanged");
}

function isDivInnerHTMLEmpty(div) {
    return div.innerHTML.trim() == '';
}

function addStringToDivInnerHTML(div, string) {
    div.innerHTML = div.innerHTML + string;
}