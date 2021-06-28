var imageDirectory = "/stills/";

var movieName;
var imageUrl;
var userGuess;
var score = 0;

var correctSound = new Audio("/sfx/ding-sound-effect_1.mp3");
var incorrectSound = new Audio("/sfx/fail-trumpet-01.mp3");
var textInput = document.getElementById("text-input");
var revealAnswer = document.getElementById("skip");
var countdown = document.getElementById("countdown");
var endGameText = document.getElementById("end-game-text");

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

//decade select
function setDecade(decade) {
  console.log(decade.classList);
  if (decade.classList.contains("selected")) {
    unsetDecade(decade);
  } else if (!decade.classList.contains("selected")) {
    decade.classList.add("selected");
  }
}

function unsetDecade(decade) {
  decade.classList.remove("selected");
  console.log(decade.classList);
}

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
  textInput.innerText = "";
}

function startUp() {
  endGameText.classList.add("notransition");
  endGameText.style.opacity = "0";
  var z = Math.floor(Math.random() * movieNames.length) + 1;
  newMovie(z);
  stillsTracker.push(z);
  console.log("index: " + z);
  console.log("tracker length: " + stillsTracker.length);
  console.log("total num movies: " + movieNames.length);
}

startUp();

//updates image tracker for new image
function updateTracker() {
  if (stillsTracker.length % 10 == 0) {
    endGameText.classList.remove("notransition");
    endGameText.style.opacity = "1";
    document.getElementById("score").innerHTML =
      "Score: " + (score / 10) * 100 + "%";
    textInput.disabled = true;
  } else {
    var i = Math.floor(Math.random() * movieNames.length) + 1;
    console.log("index: " + i);
    checkStillHistory(i);
    console.log("tracker: " + stillsTracker.length);
  }
}

//checks if the movie still has been shown already
function checkStillHistory(val) {
  var n = stillsTracker.includes(val, 0);
  console.log(n);
  if (!n) {
    //if this movie hasn't been shown:
    newMovie(val);
    stillsTracker.push(val);
    textInput.value = "";
  } else if (stillsTracker.length >= movieNames.length) {
    stillsTracker = [];
    newMovie(val);
    stillsTracker.push(val);
    textInput.value = "";
  } else {
    i = Math.floor(Math.random() * movieNames.length) + 1;
    checkStillHistory(i);
  }
}

//checks answer whenever a someone types
textInput.onkeyup = function () {
  var userGuess = textInput.value.toLowerCase();
  if (userGuess == movieName.name || userGuess == movieName.name_1) {
    correctSound.currentTime = 0;
    correctSound.play();
    score = score + 1;
    document.getElementById("number-score").innerHTML = score + "/10";
    updateTracker();
  }
};

//reveals correct answer and moves on to the next question
revealAnswer.onclick = function () {
  incorrectSound.currentTime = 0;
  incorrectSound.play();
  textInput.value = movieName.name;
  var timeLeft = 3;
  var nextPictureCountdown = setInterval(function () {
    if (timeLeft <= 0) {
      clearInterval(nextPictureCountdown);
      countdown.innerHTML = "";
      updateTracker();
    } else {
      countdown.innerHTML = "next image in " + timeLeft + " seconds...";
    }
    timeLeft -= 1;
  }, 1000);
};

//play again button
document.getElementById("play-again").onclick = function () {
  score = 0;
  document.getElementById("number-score").innerHTML = score + "/10";
  textInput.value = "";
  endGameText.style.opacity = "0";
  textInput.disabled = false;
  var z = Math.floor(Math.random() * movieNames.length) + 1;
  newMovie(z);
  stillsTracker.push(z);
  console.log("index = " + z);
  console.log("tracker: " + stillsTracker.length);
};
