// here we store the photo manifest for the rover we select 
var roverManifest = {};

// this function fetches the manifest for the selected rover and generates the info
// for the dropdown menu with a list of 10 random days
function fetchRandomEarthDays() {
  var rover = document.getElementById("rover").value;
  var url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=GGboVELwdTMQUM6rJcA5xx7EbK6SWxUTjOSiCvjX`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      roverManifest[rover] = data.photo_manifest;
      generateEarthDayOptions(rover);
    })
    .catch(error => {
      console.log(error);
    });
}

//this function generates random day for near objects search
function nearObjectsRandomDays() {
  var rover = document.getElementById("rover").value;
  var url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=GGboVELwdTMQUM6rJcA5xx7EbK6SWxUTjOSiCvjX`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      roverManifest[rover] = data.photo_manifest;
      generateNearObjectsDaysOptions(rover);
    })
    .catch(error => {
      console.log(error);
    });
}

//function to fill near object select
function generateNearObjectsDaysOptions(rover){
  var earthDaysSelect = document.getElementById("eartDayObjects");
  earthDaysSelect.innerHTML = "";
  var earthDays = getRandomEarthDays(rover);

  for (var i = 0; i < earthDays.length; i++) {
    var option = document.createElement("option");
    option.value = earthDays[i];
    option.textContent = earthDays[i];
    earthDaysSelect.appendChild(option);
  }

  earthDaysSelect.disabled = false;
}

var btnSearchObjects = document.getElementById("searchObjects");

btnSearchObjects.addEventListener("click",function(){
  fetchNeoData();
})

function fetchAPO() {
  url = 'https://api.nasa.gov/planetary/apod?api_key=RqGGlaKBgTnm9AdkXaLJ6pzgz5nHihUZTEw52fVV';
  fetch(url, {
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log(data);
      var div = document.getElementById("apodImage")
      var section = document.getElementById("rightSection");
      var img = document.createElement('img');
      img.setAttribute("src", data.url);
      //div.appendChild(img);
      section.style.backgroundImage = "url('"+ data.url +"')";
    });

}

// we use the rover input and generates the date options 
function generateEarthDayOptions(rover) {
  var earthDaysSelect = document.getElementById("earthDay");
  earthDaysSelect.innerHTML = "";
  var earthDays = getRandomEarthDays(rover);

  for (var i = 0; i < earthDays.length; i++) {
    var option = document.createElement("option");
    option.value = earthDays[i];
    option.textContent = earthDays[i];
    earthDaysSelect.appendChild(option);
  }

  earthDaysSelect.disabled = false;
}

//this function generates the 10 random dates from the photo manifest of the rover
//we selected
function getRandomEarthDays(rover) {
  var manifest = roverManifest[rover];
  var earthDates = manifest.photos.map(photo => photo.earth_date);
  var randomEarthDays = [];

  while (randomEarthDays.length < 10) {
    var randomIndex = Math.floor(Math.random() * earthDates.length);
    var randomEarthDay = earthDates[randomIndex];
    if (!randomEarthDays.includes(randomEarthDay)) {
      randomEarthDays.push(randomEarthDay);
    }
  }

  return randomEarthDays;
}

//this function generates the 10 random days from the photo manifest
// and it calls the displayRover(data) fuction to display the fetched images

function fetchRoverData() {

  //show rover images section
  var roverSection = document.getElementById("roverSection");
  roverSection.style.display = "block";

  //hide near objects section
  var nearObjectSection = document.getElementById("nearObjectSection");
  nearObjectSection.style.display = "none";

  var rover = document.getElementById("rover").value;
  var selectedEarthDay = document.getElementById("earthDay").value;
  var url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${selectedEarthDay}&api_key=GGboVELwdTMQUM6rJcA5xx7EbK6SWxUTjOSiCvjX`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayRoverData(data);
    })
    .catch(error => {
      console.log(error);
    });
}

//this function as we said earlier take the images and display them, 
//we just put 5, because there are too many
function displayRoverData(data) {
  var roverDataDiv = document.getElementById("roverData");
  roverDataDiv.innerHTML = "";

  if (data.photos.length === 0) {
    roverDataDiv.innerHTML = "No photos found for the selected criteria.";
    return;
  }

  var photosToDisplay = data.photos.slice(0, 5);

  for (var i = 0; i < photosToDisplay.length; i++) {
    var imgSrc = photosToDisplay[i].img_src;
    var imgElement = document.createElement("img");
    var div = document.createElement("div");
    div.setAttribute('class', 'swiper-slide');
    imgElement.src = imgSrc;
    div.appendChild(imgElement);
    roverDataDiv.appendChild(div);
  }
}


//this is the function for the api of the near earth objects 
async function fetchNeoData() {

  //show near objects section
  var nearObjectSection = document.getElementById("nearObjectSection");
  nearObjectSection.style.display = "block";

   //hide rover images section
   var roverSection = document.getElementById("roverSection");
   roverSection.style.display = "none";

  let selectedEarthDay = document.getElementById("eartDayObjects").value;
  let API_KEY = "GGboVELwdTMQUM6rJcA5xx7EbK6SWxUTjOSiCvjX";
  let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${selectedEarthDay}&end_date=${selectedEarthDay}&api_key=${API_KEY}`;

  try {
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data); emma does not want us to use console log.
    useApiData(data);
  } catch (error) {
    console.log(error);
  }
}

//we also slice the data, but we get some omminous things from the api and we put that
//info in a div
function useApiData(data) {
  let nearEarthObjects = data.near_earth_objects;

  let dates = Object.keys(nearEarthObjects).slice(0, 5);

  let htmlContent = `<h2 style="margin-bottom: 25px;">Near Earth Objects on `+ dates +`</h2>`;

  for (let date of dates) {
    let neoObjects = nearEarthObjects[date];

    for (let i = 0; i < neoObjects.length && i < 5; i++) {
      let neo = neoObjects[i];
      let name = neo.name;
      let isDangerous = neo.is_potentially_hazardous_asteroid ? "Yes" : "No";
      let magnitude = neo.absolute_magnitude_h;
      let diameterMin = neo.estimated_diameter.meters.estimated_diameter_min;
      let diameterMax = neo.estimated_diameter.meters.estimated_diameter_max;
      let distance = neo.close_approach_data[0].miss_distance.kilometers;

      htmlContent += `<div style="margin-bottom: 20px">
                        <h3>Name: ${name}</h3>
                        <p>Is Dangerous: ${isDangerous}</p>
                        <p>Magnitude: ${magnitude}</p>
                        <p>Diameter (Min-Max): ${diameterMin} - ${diameterMax} meters</p>
                        <p>Distance: ${distance} kilometers</p>
                      </div>`;
    }
  }

  document.querySelector("#content").innerHTML = htmlContent;
}

//we add an event listener ensuring that that all the jave is executed once we have loaded all the dom
// this button makes the world work, because it starts the entire code

document.addEventListener("DOMContentLoaded", () => {
  var searchButton = document.getElementById("search");
  searchButton.addEventListener("click", () => {
    //console.log("button pressed");
    fetchRandomEarthDays();
    fetchRoverData();
    //fetchNeoData();
  });
});

// email localstorage

// Get the email input element and send button
const emailInput = document.getElementById('emailInput');
const btnSendEmail = document.getElementById('btnSendEmail');

// Check if email exists in local storage and display it if it does
if (localStorage.getItem('email')) {
  emailInput.value = localStorage.getItem('email');
}

// Listen for button click event
btnSendEmail.addEventListener('click', function () {
  // Get the email input value
  const emailValue = emailInput.value;

  // Save the email to local storage
  localStorage.setItem('email', emailValue);

  // Display a confirmation message
  alert('Email saved to local storage: ' + emailValue);
});

function init() {
  fetchAPO()
}

function selectTab(tabIndex) {
  // Declare all variables
  var i, tabcontent;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  //Show the Selected Tab
  document.getElementById(tabIndex).style.display = "block";
}

var swiper = new Swiper('.carousel',{
  navigation:{
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination:{
    el: '.swiper-pagination',
  },
})

init();