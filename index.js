'use strict';

const locationAPI = 'AIzaSyBYsjmWMCMAbPap8N1BHN9P4RImidA6sGk';
const geocoderURL= 'https://maps.googleapis.com/maps/api/geocode/json'
const weatherURL = 'https://api.weatherusa.net/v1/forecast';
const locationURL= 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

function displayCourses(responseJson2) {
    console.log(responseJson2);
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');   
}

function getGolfCourses(responseJson, searchRadius){
    const lat = responseJson.results[0].geometry.location.lat;
    const long = responseJson.results[0].geometry.location.lng;
    const params = {
        radius: (searchRadius*1609),
        type: "golf",
        keyword: "course",
        key: locationAPI,
    };
    const queryString = formatQueryParams(params);
    const url = locationURL + '?' + 'location=' + lat + ',' + long + '&' + queryString;
    console.log(url);

    fetch(url)
        .then(response2 => {
            if (response2.ok) {
                return response2.json();
            }
            throw new Error(response2.statusText);
        })
        .then(responseJson2 => displayCourses(responseJson2))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })
}

function getLatLngByZipcode(zipcode, searchRadius) {
    const params = {
        key: locationAPI,
        address: zipcode,
    };
    const queryString = formatQueryParams(params);
    const url = geocoderURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => getGolfCourses(responseJson, searchRadius))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })
    console.log(searchRadius);
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const zipcode = $('#js-zipCode').val();
        const searchRadius = $('#js-radius').val();
        getLatLngByZipcode(zipcode, searchRadius);
    });
}

$(watchForm);
//$(initMap);