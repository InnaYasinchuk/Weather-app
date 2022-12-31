let now = new Date();
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

let day = days[now.getDay()];
document.querySelector(
  "#date"
).innerHTML = `Today is ${day}, ${hour}:${minutes}`;

function formatDay(timestamp){
  let date = new Date(timestamp * 1000);
  let day = date.getDay()
  let days = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];
  return days[day];

}

function displayForecast(response){
  let forecast = response.data.daily;
  let forecastElement = document.querySelector('#forecast');
  let forecastHTML = "";
  forecast.forEach(function(forecastDay, index){
    if(index < 8){
    forecastHTML = forecastHTML + `
  <div class="days">
        <p class="forecast-day">${formatDay(forecastDay.dt)}</p> 
        <img class="forecast-image" src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="" width="46">
        <p class="forecast-temperature"> 
          <span class="forecast-temperature-max"> ${Math.round(forecastDay.temp.max)}°</span> 
          <span> / </span>
          <span class="forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span> 
        </p> 
      </div> `;
    }
  })
  
      

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates){
  let apiKey = "2bd326a60dc89a53287e446e819664df";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
  
  axios.get(apiUrl).then(displayForecast)
}


function showTemperatureAndCity(response) {
  
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#description").innerHTML = `Sky: ${response.data.weather[0].description}`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(response.data.wind.speed)} km/h`;
  document.querySelector("#humidity").innerHTML = `Humidity: ${Math.round(response.data.main.humidity)} %`;
  document.querySelector("#icon").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#icon").setAttribute("alt", response.data.weather[0].description);

  celsiusTemp = response.data.main.temp;

  getForecast(response.data.coord);
}

function chooseCity(event) {
  event.preventDefault();
  let apiKey = "2bd326a60dc89a53287e446e819664df";
  let city = document.querySelector("#input").value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperatureAndCity);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", chooseCity);

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "2bd326a60dc89a53287e446e819664df";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperatureAndCity);
}

navigator.geolocation.getCurrentPosition(showPosition);

function convertFahrenheit(event) {
  event.preventDefault();
  let fahrenheitConvert = (celsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitConvert);
}

function convertCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", convertFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", convertCelsius);

displayForecast()