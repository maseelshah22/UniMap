// Initializes the map... map gets called in map.html
function initMap() {

    let sidebar = document.getElementById('sidebar');
    var adminStatus= isAdmin;

    // map hardcoded to center on the Rotunda
    const myLatLng = {lat: 38.03564922306521, lng: -78.50340162710884};
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: myLatLng,
    });



    // loops over each location in locations and creates a marker for each
    for (let i = 0; i < locations.length; i++) {

        // grabs the fields from the location (name, description, latitude, longitude)
        const location = locations[i]['fields'];

        // adds a marker for each location


        let marker;

        if (location['verified'] === true) {
            marker = new google.maps.Marker({
                position: {lat: location['latitude'], lng: location['longitude']},
                map: map,
                title: location['name'],
            });
        } else {
            marker = new google.maps.Marker({
                position: {lat: location['latitude'], lng: location['longitude']},
                map: map,
                title: location['name'],
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Set the URL to your custom marker image
                },
            });
        }

        var location_pk = locations[i]['pk'];


        // html content for the infoWindow for the marker
        let contentString =
            '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            '<h1 id="firstHeading" class="firstHeading">' + location['name'] + '</h1>' +
            '<div id="bodyContent">' +
            "<p>" + location['description'] + "</p>" +

            "<p>Number of Votes: 0</p>" +

            "</div>" +
            "</div>";



        if(isAdmin===true){
            console.log("truee");
        }
        //this helps us get the csrf value
        function getCookie(name) {
                    let cookieValue = null;
                    if (document.cookie && document.cookie !== '') {
                        const cookies = document.cookie.split(';');
                        for (let i = 0; i < cookies.length; i++) {
                            const cookie = cookies[i].trim();
                            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
        if(isAdmin===true) {
            if (location['verified'] === true) {

                const csrftoken = getCookie('csrftoken');

                contentString +=
                    '<form id="deleteButton" action="/' + location_pk + '/delete/" method="post">' +
                    '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                    '<input type="submit" value="Delete Location">' +
                    '</form>';

            } else {

                const csrftoken = getCookie('csrftoken');

                contentString +=
                    '<form id="verifyForm" action="/' + location_pk + '/verify/" method="post">' +
                    '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                    '<input type="submit" value="Verify Location">' +
                    '</form>'+

                    '<form id="deleteButton" action="/' + location_pk + '/delete/" method="post">' +
                    '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                    '<input type="submit" value="Deny Verification">' +
                    '</form>';

            }
        }



        // add the infoWindow to the marker
        const infoWindow = new google.maps.InfoWindow({
            content: contentString, // This can be HTML content
        });

        // // Add a click event listener to the marker
        // TODO: Add infoWindow when hovering over a location
        // marker.addEventListener("mouseover", function() {
        //     infoWindow.open({
        //         anchor: marker,
        //         map,
        //     });
        // });

        marker.addListener("click", () => {
            sidebar.innerHTML = contentString;
        });

    }

}

// set initMap as a variable that the html can reference (i think)
window.initMap = initMap;
// initMap();