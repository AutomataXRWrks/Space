var roverManifest = {};

function fetchRandomEarthDays() {
  var rover = document.getElementById("rover").value;
  var url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=DEMO_KEY`;

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

function fetchRoverData() {
  var rover = document.getElementById("rover").value;
  var selectedEarthDay = document.getElementById("earthDay").value;
  var url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${selectedEarthDay}&api_key=DEMO_KEY`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayRoverData(data);
    })
    .catch(error => {
      console.log(error);
    });
}

function displayRoverData(data) {
  var roverDataDiv = document.getElementById("roverData");
  roverDataDiv.innerHTML = "";

  if (data.photos.length === 0) {
    roverDataDiv.innerHTML = "No photos found for the selected criteria.";
    return;
  }

  // only 5 photos because sometimes there are too many
  var photosToDisplay = data.photos.slice(0, 5);

  for (var i = 0; i < photosToDisplay.length; i++) {
    var imgSrc = photosToDisplay[i].img_src;
    var imgElement = document.createElement("img");
    imgElement.src = imgSrc;
    roverDataDiv.appendChild(imgElement);
  }
}