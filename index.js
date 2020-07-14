"use strict";

const weatherURL = 'https://api.openweathermap.org/data/2.5/onecall'
const weatherAPI = '116aca242c5f08dc2166394d2f40f3b8'
const googleAPI = 'AIzaSyBYsjmWMCMAbPap8N1BHN9P4RImidA6sGk'
const reverseGeocodingURL = 'https://maps.googleapis.com/maps/api/geocode/json'

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
    var hours = ((hour + 11) % 12 + 1);
    var time = /*date + ' ' + month + ' ' + year + ' ' +*/ hours + ":00";
    return time;
}

function displayCity(responseJson2) {
  console.log(responseJson2);
  $('#city').empty();
  $('#city').append(`${responseJson2.results[0].formatted_address}
  `)
}

function getCity(lat, long) {
  const url = reverseGeocodingURL + '?' + 'latlng=' + lat + ',' + long + '&key=' + googleAPI;
   
  console.log(url);

  fetch(url)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error(response.statusText);
      })
      .then(responseJson2 => displayCity(responseJson2))
      .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
      })
}

function timeConverterWeek(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var time = date + ' ' + month;
  return time;
}

function getCardinal(angle) {
  const degreePerDirection = 360 / 8;

  const offsetAngle = angle + degreePerDirection / 2;

  return (offsetAngle >= 0 * degreePerDirection && offsetAngle < 1 * degreePerDirection) ? "N"
    : (offsetAngle >= 1 * degreePerDirection && offsetAngle < 2 * degreePerDirection) ? "NE"
      : (offsetAngle >= 2 * degreePerDirection && offsetAngle < 3 * degreePerDirection) ? "E"
        : (offsetAngle >= 3 * degreePerDirection && offsetAngle < 4 * degreePerDirection) ? "SE"
          : (offsetAngle >= 4 * degreePerDirection && offsetAngle < 5 * degreePerDirection) ? "S"
            : (offsetAngle >= 5 * degreePerDirection && offsetAngle < 6 * degreePerDirection) ? "SW"
              : (offsetAngle >= 6 * degreePerDirection && offsetAngle < 7 * degreePerDirection) ? "W"
                : "NW";
}

function weekWeather(responseJson) {
  $('#week').empty();
    $('#week').append(`
    <table>
      <thead>
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Temperature (F)</th>
          <th scope="col">Weather</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${timeConverterWeek(responseJson.daily[0].dt)}</td>
          <td>${Math.round(responseJson.daily[0].temp.min)}/${Math.round(responseJson.daily[0].temp.max)}</td>
          <td>${responseJson.daily[0].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverterWeek(responseJson.daily[1].dt)}</td>
          <td>${Math.round(responseJson.daily[1].temp.min)}/${Math.round(responseJson.daily[1].temp.max)}</td>
          <td>${responseJson.daily[1].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverterWeek(responseJson.daily[2].dt)}</td>
          <td>${Math.round(responseJson.daily[2].temp.min)}/${Math.round(responseJson.daily[2].temp.max)}</td>
          <td>${responseJson.daily[2].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverterWeek(responseJson.daily[3].dt)}</td>
          <td>${Math.round(responseJson.daily[3].temp.min)}/${Math.round(responseJson.daily[3].temp.max)}</td>
          <td>${responseJson.daily[3].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverterWeek(responseJson.daily[4].dt)}</td>
          <td>${Math.round(responseJson.daily[4].temp.min)}/${Math.round(responseJson.daily[4].temp.max)}</td>
          <td>${responseJson.daily[4].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverterWeek(responseJson.daily[5].dt)}</td>
          <td>${Math.round(responseJson.daily[5].temp.min)}/${Math.round(responseJson.daily[5].temp.max)}</td>
          <td>${responseJson.daily[5].weather[0].main}</td>
        </tr>
      </tbody>
    </table>
    `)
}

function todayWeather(responseJson) {
  $('#today').empty();
    $('#today').append(`
    <table>
      <thead>
        <tr>
          <th scope="col">Time</th>
          <th scope="col">Temperature (F)</th>
          <th scope="col">Wind (MPH)</th>
          <th scope="col">Weather</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${timeConverter(responseJson.hourly[0].dt)}</td>
          <td>${Math.round(responseJson.hourly[0].temp)}</td>
          <td>${Math.round(responseJson.hourly[0].wind_speed)}@${getCardinal(responseJson.hourly[0].wind_deg)}</td>
          <td>${responseJson.hourly[0].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverter(responseJson.hourly[1].dt)}</td>
          <td>${Math.round(responseJson.hourly[1].temp)}</td>
          <td>${Math.round(responseJson.hourly[1].wind_speed)}@${getCardinal(responseJson.hourly[1].wind_deg)}</td>
          <td>${responseJson.hourly[1].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverter(responseJson.hourly[2].dt)}</td>
          <td>${Math.round(responseJson.hourly[2].temp)}</td>
          <td>${Math.round(responseJson.hourly[2].wind_speed)}@${getCardinal(responseJson.hourly[2].wind_deg)}</td>
          <td>${responseJson.hourly[2].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverter(responseJson.hourly[3].dt)}</td>
          <td>${Math.round(responseJson.hourly[3].temp)}</td>
          <td>${Math.round(responseJson.hourly[3].wind_speed)}@${getCardinal(responseJson.hourly[3].wind_deg)}</td>
          <td>${responseJson.hourly[3].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverter(responseJson.hourly[4].dt)}</td>
          <td>${Math.round(responseJson.hourly[4].temp)}</td>
          <td>${Math.round(responseJson.hourly[4].wind_speed)}@${getCardinal(responseJson.hourly[4].wind_deg)}</td>
          <td>${responseJson.hourly[4].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverter(responseJson.hourly[5].dt)}</td>
          <td>${Math.round(responseJson.hourly[5].temp)}</td>
          <td>${Math.round(responseJson.hourly[5].wind_speed)}@${getCardinal(responseJson.hourly[5].wind_deg)}</td>
          <td>${responseJson.hourly[5].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverter(responseJson.hourly[6].dt)}</td>
          <td>${Math.round(responseJson.hourly[6].temp)}</td>
          <td>${Math.round(responseJson.hourly[6].wind_speed)}@${getCardinal(responseJson.hourly[6].wind_deg)}</td>
          <td>${responseJson.hourly[6].weather[0].main}</td>
        </tr>
        <tr>
          <td>${timeConverter(responseJson.hourly[7].dt)}</td>
          <td>${Math.round(responseJson.hourly[7].temp)}</td>
          <td>${Math.round(responseJson.hourly[7].wind_speed)}@${getCardinal(responseJson.hourly[7].wind_deg)}</td>
          <td>${responseJson.hourly[7].weather[0].main}</td>
        </tr>
      </tbody>
    </table>`)
}
function displayWeather(responseJson) {
    console.log(responseJson);
    $("#Intro").hide();
    todayWeather(responseJson);
    weekWeather(responseJson);
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
  var slc = new google.maps.LatLng(40.7608, -111.8910);

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
  getCity(lat, long);
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
