function initMap() {
    const myLatLng = {lat: 38.03564922306521, lng: -78.50340162710884};
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: myLatLng,
        streetViewControl: false,

    });


    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        draggable: true,
        title: "Drag me!"
    });

    //marker bounds
    const bounds = {
        north: 38.05741403,
        south: 38.02544052,
        east: -78.46203124,
        west: -78.52704798
    };

    let lastValidPosition = myLatLng;

    google.maps.event.addListener(marker, 'dragend', function (evt) {
        document.getElementById("latInput").value = evt.latLng.lat().toFixed(8);
        document.getElementById("lngInput").value = evt.latLng.lng().toFixed(8);

        let newLat = evt.latLng.lat();
        let newLng = evt.latLng.lng();

        //Restrict latitude
        if (newLat > bounds.north) {
            alert("You've passed the UVA area!");
            newLat = bounds.north;
        } else if (newLat < bounds.south) {
            alert("You've passed the UVA area!");
            newLat = bounds.south;
        }

        //Restrict longitude
        if (newLng > bounds.east) {
            alert("You've passed the UVA area!");
            newLng = bounds.east;
        } else if (newLng < bounds.west) {
            alert("You've passed the UVA area!");
            newLng = bounds.west;
        }

        //Set the position of the marker within the bounds
        marker.setPosition(new google.maps.LatLng(newLat, newLng));
    });

    google.maps.event.addListener(marker, 'dragend', function () {
        const finalPosition = marker.getPosition();
        document.getElementById("latInput").value = finalPosition.lat().toFixed(8);
        document.getElementById("lngInput").value = finalPosition.lng().toFixed(8);


    });

}