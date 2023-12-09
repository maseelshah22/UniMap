/*
Citations:

Google Maps API:
https://www.youtube.com/watch?v=DCmxC0NyfrA
https://pypi.org/project/django-google-maps/
https://stackoverflow.com/questions/39329874/googlemaps-api-key-for-localhost
https://developers.google.com/maps/documentation/javascript/markers#maps_marker_simple-javascript
https://stackoverflow.com/questions/10827613/placing-markers-on-google-map-with-django

Bar Chart:
https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
https://www.chartjs.org/docs/latest/charts/bar.html
 */


// Initializes the map... map gets called in map.html
function initMap() {

    let sidebar = document.getElementById('sidebar');
    var adminStatus = isAdmin;

    // map hardcoded to center on the Rotunda
    const myLatLng = {lat: 38.03564922306521, lng: -78.50340162710884};
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: myLatLng,
        mapId: "9a7353e68a254cd6",
        streetViewControl: false,
    });

    // loops over each location in locations and creates a marker for each
    for (let i = 0; i < locations.length; i++) {

        // grabs the fields from the location (name, description, latitude, longitude)
        const location = locations[i]['fields'];

        // adds a marker for each location
        let voteData = {
            vote1: parseInt(location['vote1'], 10),
            vote2: parseInt(location['vote2'], 10),
            vote3: parseInt(location['vote3'], 10),
            vote4: parseInt(location['vote4'], 10),
            vote5: parseInt(location['vote5'], 10)
        };


        let marker;

        // marker.addListener("click", () => {
        //     sidebar.innerHTML = contentString;
        //     renderBarChart(voteData);
        // });

        if (location['verified'] === true) {
            if (!onReviewPage && favoriteLocations.includes(locations[i]['pk'])) {
                marker = new google.maps.Marker({
                    position: {lat: location['latitude'], lng: location['longitude']},
                    map: map,
                    title: location['name'],
                    icon: {
                        url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png', // Set the URL to your custom marker image
                    },
                });
            } else {
                marker = new google.maps.Marker({
                    position: {lat: location['latitude'], lng: location['longitude']},
                    map: map,
                    title: location['name'],

                });
            }
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
        const csrftoken = getCookie('csrftoken');

        // html content for the infoWindow for the marker
        let contentString =
            '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            '<div style="display: flex; justify-content: center; align-items: center;">' +

            "<h1 id='test' class='firstHeading' style=\"font-family: 'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif; text-align: center;\">" + location['name'] + "</h1>"

        if (!favoriteLocations.includes(locations[i]['pk'])) {
            contentString +=
                '<form id="favoriteButton" action="/' + location_pk + '/favorite/" method="post">' +
                '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                '<button type="submit" ' +
                'style="background: transparent; border: none; margin-left: 10px; cursor: pointer !important;"> ' +
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">' +
                '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />' +
                '</svg></button>' +
                '</form>';
        } else {
            contentString +=
                '<form id="unfavoriteButton" action="/' + location_pk + '/unfavorite/" method="post">' +
                '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                '<button type="submit" ' +
                'style="background: transparent; border: none; margin-left: 10px; cursor: pointer !important;"> ' +
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="#E57200" stroke="#E57200"stroke-width="1" stroke-linecap="round" stroke-linejoin="round">' +
                '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />' +
                '</svg></button>' +
                '</form>';
        }

        contentString += '</div>'; // Close the flexbox div




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



        if (onReviewPage === true) {
            if (isAdmin === true) {

                if (location['verified'] === true) {


                    contentString +=
                    '<form id="editLocation" action="/' + location_pk + '/edit/" method="post">' +
                    '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                    '<input type="text" id="nameInput" required maxlength="45" name="nameInput" value="' + location['name'] + '"><br>' +
                    '<textarea id="descriptionInput" name="descriptionInput" required maxlength="150" style="font-family: \'Gill Sans\', \'Gill Sans MT\', \'Calibri\', \'Trebuchet MS\', sans-serif; text-align: center; resize: none; width: 400px; height: 100px; background-color: rgb(182, 182, 182); text-align: left;">' + location['description'] + '</textarea><br>' +
                    '<input type="submit" style="cursor: pointer;" value="Update Location">' +
                    '<style>' +
                    '#map-container {' +
                    '    display: flex;' +
                    '    padding-left: 5%;' +
                    '    padding-top: 1%;' +
                    '}' +
                    '#map {' +
                    '    flex: 1;' +
                    '    height: 100vh;' +
                    '    filter: drop-shadow(#b6b1a7 -0.6rem 0.6rem 11px);' +
                    '}' +
                    '#sidebar {' +
                    '    width: 30%;' +
                    '    height: 100%;' +
                    '    padding-left: 2%;' +
                    '    padding-right: 2%;' +
                    '    padding-top: 1%;' +
                    '    overflow: auto;' +
                    '    display: flex;' +
                    '    flex-direction: column;' +
                    '}' +
                    '#sidebar phead {' +
                    '    font-size: 64px;' +
                    '    font-weight: bold;' +
                    '    text-align: center;' +
                    '    display: flex;' +
                    '    flex-direction: column;' +
                    '    align-items: center;' +
                    '    justify-content: center;' +
                    '    font-family: \'Gill Sans\', \'Gill Sans MT\', \'Calibri\', \'Trebuchet MS\', sans-serif;' +
                    '}' +
                    '#sidebar ptext {' +
                    '    font-size: 32px;' +
                    '    text-align: center;' +
                    '    display: flex;' +
                    '    flex-direction: column;' +
                    '    align-items: center;' +
                    '    justify-content: center;' +
                    '    font-family: \'Gill Sans\', \'Gill Sans MT\', \'Calibri\', \'Trebuchet MS\', sans-serif;' +
                    '}' +
                    'form {' +
                    '    display: flex;' +
                    '    flex-direction: column;' +
                    '    padding-top: 1%;' +
                    '    padding-left: 1.5%;' +
                    '    align-items: center;' +
                    '}' +
                    'label {' +
                    '    text-decoration: none;' +
                    '    color: #232D4B;' +
                    '    font-family: \'Gill Sans\', \'Gill Sans MT\', Calibri, \'Trebuchet MS\', sans-serif;' +
                    '    padding-top: 1%;' +
                    '    padding-left: 1%;' +
                    '}' +
                    'input[type="text"] {' +
                    '    width: 100%;' +
                    '    border-radius: 10px;' +
                    '    background-color: rgb(182, 182, 182);' +
                    '    border: 0.01px solid #cccccc;' +
                    '    padding: 0.8%;' +
                    '    margin-bottom: 0.1%;' +
                    '    margin-right: 5%;' +
                    '    margin-top: 2%;' +
                    '    margin-bottom: 2%;' +
                    '    font-size: x-large;' +
                    '}' +
                    'input[type="submit"] {' +
                    '    width: 50%;' +
                    '    border-radius: 10px;' +
                    '    background-image: linear-gradient(to top right, #232D4B, 90%, #4f5f91);' +
                    '    color: #fdfdfd;' +
                    '    padding: 0.8%;' +
                    '    margin-bottom: 0.1%;' +
                    '    margin-right: 5%;' +
                    '    margin-top: 8%;' +
                    '    margin-bottom: 2%;' +
                    '    font-size: x-large;' +
                    '    text-align: center;' +
                    '}' +
                    '.p1 {' +
                    '    color: rgb(35, 45, 75);' +
                    '    font-size: 150%;' +
                    '    text-align: center;' +
                    '    margin-left: 0%;' +
                    '    font-family: \'Gill Sans\', \'Gill Sans MT\', \'Calibri\', \'Trebuchet MS\', sans-serif;' +
                    '}' +
                    '::placeholder {' +
                    '    text-decoration: none;' +
                    '    color: #8d8c8c;' +
                    '    font-family: \'Gill Sans\', \'Gill Sans MT\', Calibri, \'Trebuchet MS\', sans-serif;' +
                    '    padding-top: 1%;' +
                    '    padding-left: 1%;' +
                    '    font-size: x-large;' +
                    '}' +
                    '</style>' +
                    '</form>';


                    contentString +=
                        '<form id="deleteButton" action="/' + location_pk + '/delete/" method="post">' +
                        '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                        '<input type="submit" style="cursor: pointer;" value="Delete Location">' +
                        
                        '</form>';

                } else {

                    const csrftoken = getCookie('csrftoken');

                    contentString +=
                        '<form id="verifyForm" action="/' + location_pk + '/verify/" method="post">' +
                        '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                        '<input type="text" id="nameInput" name="nameInput" value="' + location['name'] + '"><br>' +
                        '<textarea id="descriptionInput" name="descriptionInput" style="font-family: \'Gill Sans\', \'Gill Sans MT\', \'Calibri\', \'Trebuchet MS\', sans-serif; text-align: center; resize: none; width: 400px; height: 100px; background-color: rgb(182, 182, 182); text-align: left;">' + location['description'] + '</textarea><br>' + 
                        '<input type="submit" style="cursor: pointer;" value="Verify Location">' +
                        '<style>' +
                        '#map-container {' +
                        '    display: flex;' +
                        '    padding-left: 5%;' +
                        '    padding-top: 1%;' +
                        '}' +
                        '#map {' +
                        '    flex: 1;' +
                        '    height: 100vh;' +
                        '    filter: drop-shadow(#b6b1a7 -0.6rem 0.6rem 11px);' +
                        '}' +
                        '#sidebar {' +
                        '    width: 30%;' +
                        '    height: 100%;' +
                        '    padding-left: 2%;' +
                        '    padding-right: 2%;' +
                        '    padding-top: 1%;' +
                        '    overflow: auto;' +
                        '    display: flex;' +
                        '    flex-direction: column;' +
                        '}' +
                        '#sidebar phead {' +
                        '    font-size: 64px;' +
                        '    font-weight: bold;' +
                        '    text-align: center;' +
                        '    display: flex;' +
                        '    flex-direction: column;' +
                        '    align-items: center;' +
                        '    justify-content: center;' +
                        '    font-family: \'Gill Sans\', \'Gill Sans MT\', \'Calibri\', \'Trebuchet MS\', sans-serif;' +
                        '}' +
                        '#sidebar ptext {' +
                        '    font-size: 32px;' +
                        '    text-align: center;' +
                        '    display: flex;' +
                        '    flex-direction: column;' +
                        '    align-items: center;' +
                        '    justify-content: center;' +
                        '    font-family: \'Gill Sans\', \'Gill Sans MT\', \'Calibri\', \'Trebuchet MS\', sans-serif;' +
                        '}' +
                        'form {' +
                        '    display: flex;' +
                        '    flex-direction: column;' +
                        '    padding-top: 1%;' +
                        '    padding-left: 1.5%;' +
                        '    align-items: center;' +
                        '}' +
                        'label {' +
                        '    text-decoration: none;' +
                        '    color: #232D4B;' +
                        '    font-family: \'Gill Sans\', \'Gill Sans MT\', Calibri, \'Trebuchet MS\', sans-serif;' +
                        '    padding-top: 1%;' +
                        '    padding-left: 1%;' +
                        '}' +
                        'input[type="text"] {' +
                        '    width: 100%;' +
                        '    border-radius: 10px;' +
                        '    background-color: rgb(182, 182, 182);' +
                        '    border: 0.01px solid #cccccc;' +
                        '    padding: 0.8%;' +
                        '    margin-bottom: 0.1%;' +
                        '    margin-right: 5%;' +
                        '    margin-top: 2%;' +
                        '    margin-bottom: 2%;' +
                        '    font-size: x-large;' +
                        '}' +
                        'input[type="submit"] {' +
                        '    width: 50%;' +
                        '    border-radius: 10px;' +
                        '    background-image: linear-gradient(to top right, #232D4B, 90%, #4f5f91);' +
                        '    color: #fdfdfd;' +
                        '    padding: 0.8%;' +
                        '    margin-bottom: 0.1%;' +
                        '    margin-right: 5%;' +
                        '    margin-top: 8%;' +
                        '    margin-bottom: 2%;' +
                        '    font-size: x-large;' +
                        '    text-align: center;' +
                        '}' +
                        '.p1 {' +
                        '    color: rgb(35, 45, 75);' +
                        '    font-size: 150%;' +
                        '    text-align: center;' +
                        '    margin-left: 0%;' +
                        '    font-family: \'Gill Sans\', \'Gill Sans MT\', \'Calibri\', \'Trebuchet MS\', sans-serif;' +
                        '}' +
                        '::placeholder {' +
                        '    text-decoration: none;' +
                        '    color: #8d8c8c;' +
                        '    font-family: \'Gill Sans\', \'Gill Sans MT\', Calibri, \'Trebuchet MS\', sans-serif;' +
                        '    padding-top: 1%;' +
                        '    padding-left: 1%;' +
                        '    font-size: x-large;' +
                        '}' +
                        '</style>' +
                        '</form>' +

                        '<form id="deleteButton" action="/' + location_pk + '/delete/" method="post">' +
                        '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                        '<input type="submit" value="Deny Verification" style="cursor: pointer;">' +
                        '</form>';

                }
            }
        } else {
            contentString +=
            '<div id="bodyContent">' +
            "<p style=\"font-family: 'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif;\">" + location['description'] + "</p>" +
            "<p style=\"font-family: 'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif;font-weight: bold;\"> How busy is " + location['name'] + " currently?</p>" +
            "<div id='chartContainer' style='width: 400px; height: 300px;'></div>" + //div to store the graph
            "</div>" +
            "</div>";

            let theName = location['name'];
            if (!theName.startsWith("The")) {
                theName = "The " + theName;
            }

            contentString +=
                '<form id="voteButton" action="/' + location_pk + '/vote/" method="post">' +
                // "<p style=\"font-family: 'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif;font-weight: bold; text-align: center;\"> Are you at " + theName + ' now? </p>' + // Eric commented this out
                "<p style=\"font-family: 'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif;font-weight: bold; text-align: center;\"> Vote on how busy it is!</p>" +
                '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
                '<div style="display: flex; align-items: center;">' +
                "<p1 style=\"font-family: 'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif; text-align: center;\">Not</p1>" +
                '<input type="range" name="sliderLevel" min="1" max="5" step="1" style="flex: 1; margin: 0 5%;">' +
                "<p1 style=\"font-family: 'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', sans-serif; text-align: center;\">Very</p1>" +
                '</div>' +
                '<div style="text-align: center;">' +
                '<input type="submit" value="Submit Vote" style="width: 80%; border-radius: 10px; cursor: pointer;' +
                'background-image: linear-gradient(to top right, #232D4B, 90%, #4f5f91);' +
                'color: #fdfdfd;' +
                'padding: 0.8%;' +
                'margin-bottom: 0.1%;' +
                'margin-right: 5%;' +
                'margin-top: 8%;' +
                'margin-bottom: 2%;' +
                'font-size: x-large;' +
                'text-align: center;">' +
                '</div>' +
                '</form>';


            // if (!favoriteLocations.includes(locations[i]['pk'])) {
            //     contentString +=
            //         '<form id="favoriteButton" action="/' + location_pk + '/favorite/" method="post">' +
            //         '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
            //         '<button type="submit" ' +
            //         'style="background: transparent; border: none;"> ' +
            //         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#FFDF00" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            //         '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />' +
            //         '</svg></button>' +
            //         '</form>';
            // } else {
            //     contentString +=
            //         '<form id="unfavoriteButton" action="/' + location_pk + '/unfavorite/" method="post">' +
            //         '<input type="hidden" name="csrfmiddlewaretoken" value="' + csrftoken + '">' +
            //         '<button type="submit" ' +
            //         'style="background: transparent; border: none;"> ' +
            //         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#FFFFFF" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            //         '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />' +
            //         '</svg></button>' +
            //         '</form>';
            // }

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
            //sidebar.innerHTML = contentString;
            sidebar.innerHTML = contentString;
            let voteData = {
                vote1: location['vote1'],
                vote2: location['vote2'],
                vote3: location['vote3'],
                vote4: location['vote4'],
                vote5: location['vote5'],
            };
            renderBarChart(voteData);
        });

    }

}

function renderBarChart(voteData) {
    var chartContainer = document.getElementById('chartContainer');

    var ctx = document.createElement('canvas');
    ctx.width = 400;
    ctx.height = 300;
    chartContainer.appendChild(ctx);

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5'],
            datasets: [{
                label: '# of Votes',
                data: [voteData.vote1, voteData.vote2, voteData.vote3, voteData.vote4, voteData.vote5],
                backgroundColor: [
                    'rgba(35, 45, 75)',  // this is navy

                ],
                borderColor: [
                    //Border colors for each bar
                    //'rgba(248, 76, 30)', //this is the color for orange
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    title: {
                        display: true,
                        text: 'Number of Votes',
                    },
                    ticks: {
                        stepSize: 1,  //graph scaling, adjusts steps
                        precision: 0,  //removes decimals on the axix
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Busy Level',
                    },
                }
            }
        }
    });
}


// set initMap as a variable that the html can reference (i think)
window.initMap = initMap;
// initMap();