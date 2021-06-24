var imageDirectory = "/stills/";

var movieName;
var imageUrl;
var userGuess;
var score = 0;

var textInput = document.getElementById("text-input");

var stillsTracker = [];

//disables enter key on text inputs
window.addEventListener(
  "keydown",
  function (e) {
    if (
      e.keyIdentifier == "U+000A" ||
      e.keyIdentifier == "Enter" ||
      e.keyCode == 13
    ) {
      if (e.target.nodeName == "INPUT" && e.target.type == "text") {
        e.preventDefault();
        return false;
      }
    }
  },
  true
);

//functions

//gets the movie name -- can be called by movieName.name
function getMovieName(i) {
  movieName = movieNames.find((movie) => movie.number === i);
}

//gets movie image url
function getMovieImageUrl(number) {
  imageUrl = imageDirectory + number + ".png";
}

//sets new image and gets name
function newMovie(number) {
  getMovieImageUrl(number);
  getMovieName(number);
  document.getElementById("movie-still").src = imageUrl;
  console.log(movieName.name);
  document.getElementById("text-input").innerText = "";
}

//checks if the movie still has been shown already
function checkStillHistory(val) {
  var n = stillsTracker.includes(val, 0);
  console.log(n);
  if (!n) {
    newMovie(val);
    stillsTracker.push(val);
    textInput.value = "";
  } else {
    i = Math.floor(Math.random() * movieNames.length) + 1;
    checkStillHistory(i);
  }
}

function startUp() {
  var z = Math.floor(Math.random() * movieNames.length) + 1;
  newMovie(z);
  stillsTracker.push(z);
  console.log("index = " + z);
  console.log("tracker: " + stillsTracker);
  document.getElementById("end-game-text").style.opacity = "0";
}

startUp();

//checks answer whenever a someone types
textInput.onkeyup = function () {
  userGuess = textInput.value;
  if (userGuess == movieName.name) {
    score = score + 1;
    document.getElementById("number-score").innerHTML = score + "/10";
    var i = Math.floor(Math.random() * movieNames.length) + 1;
    console.log("index = " + i);
    checkStillHistory(i);
    console.log("tracker: " + stillsTracker);
  }
  if (stillsTracker.length == 11) {
    document.getElementById("end-game-text").style.opacity = "1";
    document.getElementById("score").innerHTML =
      "Score = " + (score / 10) * 100 + "%";
    document.getElementById("text-input").disabled = true;
  }
};
