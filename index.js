"use strict";

const weatherURL = 'https://api.openweathermap.org/data/2.5/onecall'
const weatherAPI = '116aca242c5f08dc2166394d2f40f3b8'
const googleAPI = 'AIzaSyBYsjmWMCMAbPap8N1BHN9P4RImidA6sGk'

var map;
var service;
var infowindow;

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var time = /*date + ' ' + month + ' ' + year + ' ' +*/ hour + "o'clock";
    return time;
}

function todayWeather(responseJson) {
  $('#weather').append(`
  <h3>Today's Weather</h3>
  <div id="today">
  <div><p>${timeConverter(responseJson.hourly[0].dt)}</p>
  <p>${responseJson.hourly[0].temp}F<p>
  <p>${responseJson.hourly[0].weather[0].description}</p>
  <p>Wind speed: ${responseJson.hourly[0].wind_speed}mph</p></div>
  <div><p>${timeConverter(responseJson.hourly[2].dt)}</p>
  <p>${responseJson.hourly[2].temp}F<p>
  <p>${responseJson.hourly[2].weather[0].description}</p>
  <p>Wind speed: ${responseJson.hourly[2].wind_speed}mph</p></div>
  <div><p>${timeConverter(responseJson.hourly[4].dt)}</p>
  <p>${responseJson.hourly[4].temp}F<p>
  <p>${responseJson.hourly[4].weather[0].description}</p>
  <p>Wind speed: ${responseJson.hourly[4].wind_speed}mph</p></div>
  <div><p>${timeConverter(responseJson.hourly[6].dt)}</p>
  <p>${responseJson.hourly[6].temp}F<p>
  <p>${responseJson.hourly[6].weather[0].description}</p>
  <p>Wind speed: ${responseJson.hourly[6].wind_speed}mph</p></div>
  </div>
  `)
}

function displayWeather(responseJson) {
    $('#weather').empty();
    console.log(responseJson);
    todayWeather(responseJson);
    /*$('#weather').html(`
    <p>Today's minimum/maximum temperatures: ${responseJson.daily[0].temp.min}/${responseJson.daily[0].temp.max}F</p>
    <p>Today's predominant weather: ${responseJson.daily[0].weather[0].description}</p>
    <h3>Hourly Weather:</h3>
    `);
    for (let i=0; i<20; i=i+4) {
        $('#weather').append(`
        <li>
        <p>${timeConverter(responseJson.hourly[i].dt)}</p>
        <p>Temprature: ${responseJson.hourly[i].temp}F<p>
        <p>${responseJson.hourly[i].weather[0].description}</p>
        <p>Wind speed: ${responseJson.hourly[i].wind_speed}mph</p>
        <li>`)
    }
    ;*/
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');   
}

function getWeather(lat, long){
    const params = {
        lat: lat,
        lon: long,
        appid: weatherAPI,
        units: 'imperial',
    };
    const queryString = formatQueryParams(params);
    const url = weatherURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayWeather(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        })
}

function initMap(searchTerm) {
  var slc = new google.maps.LatLng(40.76, -111.89);

  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById("map"), {
    center: slc,
    zoom: 15
  });

  var request = {
    query: searchTerm,
    fields: ["name", "geometry"]
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    };
  });
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
  const lat = place.geometry.viewport.Za.i;
  const long = place.geometry.viewport.Ua.i;
  getWeather(lat, long);
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const st = $('#js-search-term').val();
        const searchTerm = String(st);
        console.log(searchTerm);
        initMap(searchTerm);
    });
}

$(watchForm);
