let pipe = document.getElementById("pipe");
let hole = document.getElementById("hole");
let topPipe = document.getElementById("top");
let bottomPipe = document.getElementById("bottom");
let bird = document.getElementById("bird");
let startMessage = document.getElementById("start-message");
let startBox = document.getElementById("start-box");
let scoreBox = document.getElementById("scorebox");
let personalBests = document.getElementById("score-list");
let leaderBoard = document.getElementById("leaderboard-ol");
let usernameBox = document.getElementById("username");
let enterUsernameDiv = document.getElementById("enter-username");
let jumping = 0;
let over = false;
let started = false;
let gravityInterval;
let checkIfOver;
let score = 0;

let uniqueScores;
let user;

async function saveUser() {
  user = usernameBox.value;
  updateLeaderboard();
  updateBestScores();
  enterUsernameDiv.style.display = "none";
}

async function updateLeaderboard() {
  const leaders = await getScores();
  leaderBoard.textContent = "";
  for (let i in leaders) {
    if (i < 10) {
      let li = document.createElement("li");
      li.textContent = leaders[i]["user"] + "  " + leaders[i]["score"];
      leaderBoard.appendChild(li);
    }
  }
}

async function updateBestScores() {
  personalBests.textContent = "";
  const userBestScores = await getBestScores(user);
  for (let i in userBestScores) {
    if (i > 0) {
      while (userBestScores[i - 1]["score"] == userBestScores[i]["score"]) {
        if ((i = userBestScores.length)) {
          break;
        }
        i++;
      }
    }
    try {
      let li = document.createElement("li");
      li.textContent = userBestScores[i]["score"];
      personalBests.appendChild(li);
    } catch {
    }

    if (personalBests.childElementCount == 10) break;
  }
}

async function startGame() {
  if (!started) {
    scoreBox.textContent = "Score: 0";
    animationSpeed = 2;
    score = 0;
    pipe.style.height = "100vh";
    let pipeHeight = window.getComputedStyle(pipe).getPropertyValue("height");
    pipe.style.animation = "none";
    pipe.style.left = "500px";
    hole.style.top = "200px";
    topPipe.style.height = hole.style.top;
    bottomPipe.style.top = parseInt(hole.style.top) + 200 + "px";
    bottomPipe.style.height =
      parseInt(pipeHeight) - parseInt(bottomPipe.style.top) + "px";
    bird.style.top = "350px";

    setTimeout(function () {
      pipe.style.animation =
        "pipe-move " + parseInt(animationSpeed) + "s infinite linear";
      gravityInterval = setInterval(gravity, 10);
      checkIfOver = setInterval(gameOver, 5);
      started = true;
    }, 20);
    startBox.style.visibility = "hidden";
    over = false;
  }
  if (over) {
    clearInterval(gravityInterval);
    started = false;
    const res = await postScores(user, score);
    updateBestScores();
    updateLeaderboard();
  }
}

function gravity() {
  let birdStyle = window.getComputedStyle(bird);
  let birdTop = parseInt(birdStyle.getPropertyValue("top"));
  if (!jumping) {
    bird.style.top = birdTop + 3 + "px";
  }
}

function jump() {
  if (started) {
    jumping = 1;
    let jumpTime = 0;

    let jumpingInterval = setInterval(function () {
      let birdStyle = window.getComputedStyle(bird);
      let birdTop = parseInt(birdStyle.getPropertyValue("top"));

      if (birdTop > 0) {
        bird.style.top = parseInt(birdTop) - 5 + "px";
      }
      // jumpTime == 15 * 10 ms
      if (jumpTime > 15 || over) {
        clearInterval(jumpingInterval);
        jumpTime = 0;
        jumping = 0;
      }
      jumpTime++;
    }, 10);
  }
}

pipe.addEventListener("animationiteration", function () {
  let random = Math.random();
  let pipeHeight = window.getComputedStyle(pipe).getPropertyValue("height");
  let generatedTop = random * (parseInt(pipeHeight) / 2) + 100;
  console.log(generatedTop);
  hole.style.top = generatedTop + "px";
  topPipe.style.height = hole.style.top;
  bottomPipe.style.top = parseInt(hole.style.top) + 200 + "px";
  bottomPipe.style.height =
    parseInt(pipeHeight) - parseInt(bottomPipe.style.top) + "px";
  score++;
  scoreBox.textContent = "Score: " + score;
});

function gameOver() {
  if (!over) {
    let birdStyle = window.getComputedStyle(bird);
    let birdTop = parseInt(birdStyle.getPropertyValue("top"));
    let holeStyle = window.getComputedStyle(hole);
    let holeTop = parseInt(holeStyle.getPropertyValue("top"));
    let pipeStyle = window.getComputedStyle(pipe);
    let pipeLeft = parseInt(pipeStyle.getPropertyValue("left"));

    if (
      pipeLeft > 20 &&
      pipeLeft < 130 &&
      (birdTop <= holeTop || birdTop + 50 >= holeTop + 200)
    ) {
      pipe.style.animationPlayState = "paused";
      over = true;
      startGame();
      startMessage.textContent = "GAME OVER SCORE: " + score;
      startBox.style.visibility = "visible";

      clearInterval(checkIfOver);
    }

    if (birdTop >= 750) {
      pipe.style.animationPlayState = "paused";
      over = true;
      startGame();
      startMessage.textContent = "GAME OVER SCORE: " + score;
      startBox.style.visibility = "visible";
      clearInterval(checkIfOver);
    }
  }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

async function getScores() {
  const response = await fetch("/score-api");
  return response.json();
}

async function getBestScores(username) {
  const response = await fetch("/best-scores/" + username);
  // .then((response) => response.json())
  // .then((data) => {
  //   console.log(data);
  //   bestScoreList = data;
  // });
  return response.json();
}

async function postScores(username, userScore) {
  let data = {
    user: username,
    score: userScore,
  };
  const response = await fetch("/score-api", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
