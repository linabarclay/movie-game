var imageDirectory = "stills/";

var movieName;
var imageUrl;
var userGuess;
var score = 0;

var correctSound = new Audio("sounds/correct.wav");
var incorrectSound = new Audio("sounds/fail-trumpet-01.mp3");
var textInput = document.getElementById("text-input");
var revealAnswer = document.getElementById("skip");
var countdown = document.getElementById("countdown");
var endGameText = document.getElementById("end-game-text");
var playAgain = document.getElementById("play-again");

var timer = document.getElementById("timer");
var timerOnOff = 0; // local variable for index.html
var storedTimerSettings = 0; //retrieved timer settings from local storage
var stopTimer;

var storedActiveDecades = []; //retrieved array from local storage
var activeDecades = []; // pretty much a local variable for index.html -- is reset everytime index.html is loaded
var stillsTracker = [];
var roundTracker = []; //keeps track of when to end round

var validIndexes = []; //made as a global variable so that length can be used to check if tracker should be refreshed

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

//FUNCTIONS

//decade select
function setDecade(decade) {
  if (decade.classList.contains("selected")) {
    unsetDecade(decade);
  } else if (!decade.classList.contains("selected")) {
    decade.classList.add("selected");
    activeDecades.push(decade.id); // adds decade to active decades list
    console.log(activeDecades);
    localStorage.setItem("active-decades", JSON.stringify(activeDecades));
  }
}

function unsetDecade(decade) {
  decade.classList.remove("selected");
  activeDecades.splice(activeDecades.indexOf(decade.id), 1); // removes decade from active decades list
  localStorage.setItem("active-decades", JSON.stringify(activeDecades));
  console.log(activeDecades);
}

function resetActiveDecades() {
  activeDecades = [];
  localStorage.setItem("active-decades", JSON.stringify(activeDecades));
}

function timedOnOff() {
  if (timer.checked) {
    timerOnOff = 1;
    localStorage.setItem("timer-check", timerOnOff);
  } else if (!timer.checked) {
    timerOnOff = 0;
    localStorage.setItem("timer-check", timerOnOff);
  }
}

//called by html
function resetStuff() {
  activeDecades = [];
  localStorage.setItem("active-decades", JSON.stringify(activeDecades));
  timerOnOff = 0;
  localStorage.setItem("timer-check", timerOnOff);
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
  roundTracker.push(1);
  console.log(roundTracker);
  textInput.focus();
  textInput.innerText = "";
}

function startUp() {
  textInput.focus(); //automatically puts cursor in text input
  storedTimerSettings = localStorage.getItem("timer-check");
  if (storedTimerSettings == 0) {
    console.log("timer off");
  } else if (storedTimerSettings == 1) {
    console.log("timer on");
    timerOn();
  }
  typoCheck();
  storedActiveDecades = JSON.parse(localStorage.getItem("active-decades"));
  if (storedActiveDecades.length >= 1) {
    endGameText.classList.add("notransition");
    endGameText.style.opacity = "0";
    endGameText.style.cursor = "default";
    playAgain.style.cursor = "default";
    playAgain.style.pointerEvents = "none"; //disables clicking the invisible play again text in-game
    console.log(storedActiveDecades);
    var z = getValidIndex();
    console.log("num of valid indexes: " + validIndexes.length);
    console.log(
      "valid indexes: " +
        validIndexes +
        "\n" +
        "\n" +
        "===================" +
        "\n" +
        "END OF GENERAL DEBUG"
    );

    newMovie(z);
    stillsTracker.push(z);
  } else if (storedActiveDecades.length == 0) {
    storedActiveDecades = [
      "thirties",
      "forties",
      "fifties",
      "sixties",
      "seventies",
      "eighties",
      "nineties",
      "aughts",
      "tens",
      "twenties",
    ];
    endGameText.classList.add("notransition");
    endGameText.style.opacity = "0";
    var z = getValidIndex();
    console.log("num of valid indexes: " + validIndexes.length);
    console.log(
      "valid indexes: " +
        validIndexes +
        "\n" +
        "\n" +
        "===================" +
        "\n" +
        "END OF GENERAL DEBUG"
    );
    console.log("selected index: " + z);
    newMovie(z);
    stillsTracker.push(z);
  }
}

//gets random index of a movie from selected decades
function getValidIndex() {
  validIndexes = [];
  for (var i = 0; i < storedActiveDecades.length; i++) {
    var possibleMovies = movieNames.filter(
      (movie) => movie.decade === storedActiveDecades[i]
    );
    possibleMovies.forEach((movie) => {
      validIndexes.push(movie.number);
    });
  }

  var i = validIndexes[Math.floor(Math.random() * validIndexes.length)];
  console.log("selected index: " + i);
  return i;
}

//updates image tracker for new image
function updateTracker() {
  if (roundTracker.length % 10 == 0) {
    endGameText.classList.remove("notransition");
    endGameText.style.opacity = "1";
    playAgain.style.cursor = "pointer";
    playAgain.style.pointerEvents = "initial";
    document.getElementById("score").innerHTML =
      "Score: " + (score / 10) * 100 + "%";
    textInput.disabled = true;

    if (storedTimerSettings == 1) {
      clearInterval(stopTimer);
      var userTime = timer.innerHTML;
      document.getElementById("time").innerHTML = "Time: " + userTime;
      if (userTime < localStorage.getItem("best-time") && score == 10) {
        console.log("new best time");
        document.getElementById("best-time").innerHTML = "New best time!";
        localStorage.setItem("best-time", userTime);
      } else if (userTime > localStorage.getItem("best-time") || score !== 10) {
        document.getElementById("best-time").innerHTML =
          "Best time: " + localStorage.getItem("best-time");
      } else {
        localStorage.setItem("best-time", userTime);
        document.getElementById("best-time").innerHTML =
          "Best time: " + localStorage.getItem("best-time");
      }
    }
  } else {
    var z = getValidIndex();
    checkStillHistory(z);
  }
}

//checks if the movie still has been shown already
function checkStillHistory(val) {
  var n = stillsTracker.includes(val, 0);
  console.log(stillsTracker);
  console.log(n);
  if (!n) {
    //if this movie hasn't been shown:
    newMovie(val);
    stillsTracker.push(val);
    textInput.value = "";
  } else if (stillsTracker.length >= validIndexes.length) {
    stillsTracker = [val];
    newMovie(val);
    textInput.value = "";
  } else {
    var z = getValidIndex();
    checkStillHistory(z);
  }
}

function timerOn() {
  var start = Date.now();
  stopTimer = setInterval(function () {
    var timeElapsed = Date.now() - start;

    var s = Math.floor(timeElapsed / 1000);
    var ms = timeElapsed % 1000;
    var m = Math.floor(s / 60);

    if (s >= 60) {
      s = Math.floor(s - 60 * m);
    }

    if (s < 10) {
      s = "0" + s;
    }

    if (m < 10) {
      m = "0" + m;
    }

    if (ms < 10) {
      ms = "00" + ms;
    } else if (ms < 100) {
      ms = "0" + ms;
    }

    timer.innerHTML = m + ":" + s + "." + ms;
  }, 1);
}

function mute() {
  var audio = document.getElementById("audio");
  if (audio.classList.contains("muted")) {
    audio.src = "/images/unmuted.png";
    correctSound.muted = false;
    incorrectSound.muted = false;
    audio.classList.remove("muted");
  } else if (!audio.classList.contains("muted")) {
    audio.src = "/images/muted.png";
    correctSound.muted = true;
    incorrectSound.muted = true;
    audio.classList.add("muted");
  }
}

//EVENT HANDLERS

//checks answer whenever a someone types
textInput.onkeyup = function () {
  var userGuess = textInput.value.toLowerCase(); // fixes capitalization errors
  userGuess = userGuess.trim(); // removes start and end spaces
  userGuess = userGuess.replace(/[^a-zA-Z 0-9]/g, ""); // removes special characters
  if (
    userGuess == movieName.name ||
    userGuess == movieName.name_1 ||
    userGuess == movieName.name_2
  ) {
    correctSound.currentTime = 0;
    correctSound.play();
    score = score + 1;
    document.getElementById("number-score").innerHTML = score + "/10";
    updateTracker();
  }
};

//reveals correct answer and moves on to the next question
revealAnswer.onclick = function () {
  revealAnswer.style.pointerEvents = "none"; // makes it so you can't double click
  incorrectSound.currentTime = 0;
  incorrectSound.play();
  textInput.value = movieName.name;
  var timeLeft = 3;
  var nextPictureCountdown = setInterval(function () {
    if (timeLeft <= 0) {
      clearInterval(nextPictureCountdown);
      countdown.innerHTML = "";
      updateTracker();
      revealAnswer.style.pointerEvents = "auto"; // reactivates button for next image
    } else {
      countdown.innerHTML = "next image in " + timeLeft + " seconds...";
    }
    timeLeft -= 1;
  }, 1000);
};

//play again button
playAgain.onclick = function () {
  endGameText.classList.add("notransition");
  score = 0;
  document.getElementById("number-score").innerHTML = score + "/10";
  textInput.value = "";
  endGameText.style.opacity = "0";
  textInput.disabled = false;
  z = getValidIndex();
  checkStillHistory(z);
  if (storedTimerSettings == 1) {
    timerOn();
  }
};

//check for typos in movie list

function typoCheck() {
  var allMovies = [];
  var thirties = [];
  var forties = [];
  var fifties = [];
  var sixties = [];
  var seventies = [];
  var eighties = [];
  var nineties = [];
  var aughts = [];
  var tens = [];
  var twenties = [];
  for (var i = 0; i < movieNames.length; i++) {
    thirties = movieNames.filter((movie) => movie.decade === "thirties");
    forties = movieNames.filter((movie) => movie.decade === "forties");
    fifties = movieNames.filter((movie) => movie.decade === "fifties");
    sixties = movieNames.filter((movie) => movie.decade === "sixties");
    seventies = movieNames.filter((movie) => movie.decade === "seventies");
    eighties = movieNames.filter((movie) => movie.decade === "eighties");
    nineties = movieNames.filter((movie) => movie.decade === "nineties");
    aughts = movieNames.filter((movie) => movie.decade === "aughts");
    tens = movieNames.filter((movie) => movie.decade === "tens");
    twenties = movieNames.filter((movie) => movie.decade === "twenties");
  }
  console.log("GENERAL DEBUGGING" + "\n" + "===================" + "\n");
  console.log(
    "decades sum: " +
      (thirties.length +
        forties.length +
        fifties.length +
        sixties.length +
        seventies.length +
        eighties.length +
        nineties.length +
        aughts.length +
        tens.length +
        twenties.length)
  );
  console.log("total num movies: " + movieNames.length);
  console.log(
    "spelling check: " +
      (movieNames.length ==
        thirties.length +
          forties.length +
          fifties.length +
          sixties.length +
          seventies.length +
          eighties.length +
          nineties.length +
          aughts.length +
          tens.length +
          twenties.length)
  );

  console.log("num thirties: " + thirties.length);
  console.log("num forties: " + forties.length);
  console.log("num fifties: " + fifties.length);
  console.log("num sixties: " + sixties.length);
  console.log("num seventies: " + seventies.length);
  console.log("num eighties: " + eighties.length);
  console.log("num nineties: " + nineties.length);
  console.log("num aughts: " + aughts.length);
  console.log("num tens: " + tens.length);
  console.log("num twenties: " + twenties.length);
}

startUp();
