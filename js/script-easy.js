var imageDirectory = "stills/";

var movieName;
var imageUrl;
var score = 0;

var correctSound = new Audio("sounds/correct.wav");
var incorrectSound = new Audio("sounds/fail-trumpet-01.mp3");

var revealAnswer = document.getElementById("submit");
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
var options = []; //multiple choice options -- index 0 is always correct answer
var correctAnswer;

//FUNCTIONS

function uncheck() {
  document.getElementById("movie1").childNodes[1].checked = false;
  document.getElementById("movie2").childNodes[1].checked = false;
  document.getElementById("movie3").childNodes[1].checked = false;
  document.getElementById("movie4").childNodes[1].checked = false;
}

//gets the movie name -- can be called by movieName.name
function getMovieName(i) {
  return movieNames.find((movie) => movie.number === i);
}

//gets movie image url
function getMovieImageUrl(number) {
  imageUrl = imageDirectory + number + ".png";
}

//sets a movie to a multiple chioce option that doesn't have a set name yet
function randomOptionSetter(name) {
  options = [name.name];
  for (var i = 0; i < 3; i++) {
    var x = getMultipleChoiceIndex(name);
    var movie = getMovieName(x);
    var o = options.includes(movie.name, 0);
    while (o) {
      x = getMultipleChoiceIndex(name);
      movie = getMovieName(x);
      o = options.includes(movie.name, 0);
    }
    if (!o) {
      options.push(movie.name);
    }
  }
  var optionsIndexes = [1, 2, 3, 4];

  for (var i = 0; i < options.length; i++) {
    var z = Math.floor(Math.random() * 4) + 1;
    var b = optionsIndexes.includes(z, 0);
    while (!b) {
      z = Math.floor(Math.random() * 4) + 1;
      b = optionsIndexes.includes(z, 0);
    }
    if (b) {
      optionsIndexes.splice(z - 1, 1, 0);
      document.getElementById("movie" + z).childNodes[0].nodeValue = options[i];
    }
    if (i == 0) {
      correctAnswer = document.getElementById("movie" + z);
    }
  }
}

//sets new image and gets name
function newMovie(number) {
  uncheck();
  getMovieImageUrl(number);
  movieName = getMovieName(number);
  document.getElementById("movie-still").src = imageUrl;
  randomOptionSetter(movieName);
  console.log(movieName.name);
  roundTracker.push(1);
  console.log(roundTracker);
}

function startUp() {
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

  return i;
}

//gets random index from the decade of the answer and the two decades sandwiching it
//this is so that the other options are similar to the actual answer
function getMultipleChoiceIndex(ans) {
  var choiceIndexes = [];
  var decades = [
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
  var validDecades = [decades.indexOf(ans.decade)];
  if (decades.indexOf(ans.decade) == 0) {
    validDecades.push(decades.indexOf(ans.decade) + 1);
    validDecades.push(decades.indexOf(ans.decade) + 2);
  } else if (decades.indexOf(ans.decade) == 9) {
    validDecades.push(decades.indexOf(ans.decade) - 1);
    validDecades.push(decades.indexOf(ans.decade) - 2);
  } else {
    validDecades.push(decades.indexOf(ans.decade) + 1);
    validDecades.push(decades.indexOf(ans.decade) - 1);
  }

  for (var i = 0; i < validDecades.length; i++) {
    var possibleMovies = movieNames.filter(
      (movie) => movie.decade === decades[validDecades[i]]
    );
    possibleMovies.forEach((movie) => {
      choiceIndexes.push(movie.number);
    });
  }
  var i = choiceIndexes[Math.floor(Math.random() * choiceIndexes.length)];
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

    if (storedTimerSettings == 1) {
      clearInterval(stopTimer);
      var userTime = timer.innerHTML;
      document.getElementById("time").innerHTML = "Time: " + userTime;
      if (userTime < localStorage.getItem("best-time-easy") && score == 10) {
        console.log("new best time");
        document.getElementById("best-time").innerHTML = "New best time!";
        localStorage.setItem("best-time-easy", userTime);
      } else if (
        userTime > localStorage.getItem("best-time-easy") ||
        score !== 10
      ) {
        document.getElementById("best-time").innerHTML =
          "Best time: " + localStorage.getItem("best-time-easy");
      } else {
        localStorage.setItem("best-time-easy", userTime);
        document.getElementById("best-time").innerHTML =
          "Best time: " + localStorage.getItem("best-time-easy");
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
  } else if (stillsTracker.length >= validIndexes.length) {
    stillsTracker = [val];
    newMovie(val);
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
    audio.src = "images/unmuted.png";
    correctSound.muted = false;
    incorrectSound.muted = false;
    audio.classList.remove("muted");
  } else if (!audio.classList.contains("muted")) {
    audio.src = "images/muted.png";
    correctSound.muted = true;
    incorrectSound.muted = true;
    audio.classList.add("muted");
  }
}

//EVENT HANDLERS

revealAnswer.onclick = function () {
  revealAnswer.style.pointerEvents = "none"; // makes it so you can't double click
  if (correctAnswer.childNodes[1].checked == true) {
    correctSound.currentTime = 0;
    correctSound.play();
    score = score + 1;
    document.getElementById("number-score").innerHTML = score + "/10";
    updateTracker();
    revealAnswer.style.pointerEvents = "auto";
  } else {
    incorrectSound.currentTime = 0;
    incorrectSound.play();
    correctAnswer.childNodes[1].checked = true;
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
  }
};

//play again button
playAgain.onclick = function () {
  endGameText.classList.add("notransition");
  score = 0;
  document.getElementById("number-score").innerHTML = score + "/10";
  endGameText.style.opacity = "0";
  z = getValidIndex();
  checkStillHistory(z);
  if (storedTimerSettings == 1) {
    timerOn();
  }
};

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
