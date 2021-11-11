let pipe = document.getElementById("pipe");
let hole = document.getElementById("hole");
let topPipe = document.getElementById("top");
let bottomPipe = document.getElementById("bottom");
let bird = document.getElementById("bird");
let startButton = document.getElementById('start');
let scoreBox = document.getElementById("scorebox");
let jumping = 0;
let over = false;
let started = false;
let gravityInterval;
let checkIfOver;
let score = 0;
let animationSpeed;


function startGame() {

    if (!started) {
        animationSpeed = 2;
        score = 0;
        pipe.style.animation = "none"
        pipe.style.left = "500px"
        bird.style.top = "350px"


        setTimeout(function () {
            pipe.style.animation = "pipe-move " + parseInt(animationSpeed) + "s infinite linear";
            gravityInterval = setInterval(gravity, 10);
            checkIfOver = setInterval(gameOver, 5);

        }, 20)
        startButton.style.visibility = "hidden";
        over = false;
        started = true;

    }
    if (over) {

        clearInterval(gravityInterval)
        started = false;
    }



    console.log('function is called')
}


function gravity() {
    let birdStyle = window.getComputedStyle(bird);
    let birdTop = parseInt(birdStyle.getPropertyValue("top"));
    if (birdTop < 750 && birdTop > -50) {
        bird.style.top = birdTop + 5 + "px";
    }
}


function jump() {
    if (started) {
        jumping = 1;
        let jumpTime = 0;

        let jumpingInterval = setInterval(function () {
            let birdStyle = window.getComputedStyle(bird);
            let birdTop = parseInt(birdStyle.getPropertyValue("top"));

            if (birdTop > 100) {
                bird.style.top = parseInt(birdTop) - 7 + "px";
            }
            // jumpTime == 15 * 10 ms
            if (jumpTime > 15 || over) {
                clearInterval(jumpingInterval);
                jumpTime = 0;
                jumping = 0;
            }
            jumpTime++;
        }, 10)
    }
}

pipe.addEventListener("animationiteration", function () {
    let random = Math.random();
    let generatedTop = random * 400 + 100;
    hole.style.top = generatedTop + "px";
    topPipe.style.height = hole.style.top;
    bottomPipe.style.top = parseInt(hole.style.top) + 200 + "px";
    bottomPipe.style.height = 800 - parseInt(bottomPipe.style.top) +"px";
    
    score++;
    scoreBox.textContent = "Score: " + score;
})


function gameOver() {

    if (!over) {

        let birdStyle = window.getComputedStyle(bird);
        let birdTop = parseInt(birdStyle.getPropertyValue("top"));
        let holeStyle = window.getComputedStyle(hole);
        let holeTop = parseInt(holeStyle.getPropertyValue("top"));
        let pipeStyle = window.getComputedStyle(pipe);
        let pipeLeft = parseInt(pipeStyle.getPropertyValue("left"));


        if (((pipeLeft > 20 && pipeLeft < 130) && ((birdTop <= holeTop) || (birdTop + 50 >= holeTop + 200)))) {

            pipe.style.animationPlayState = "paused"
            over = true;
            startGame();
            startButton.style.visibility = "visible";
            clearInterval(checkIfOver);
        }

        if (birdTop >= 750) {
            pipe.style.animationPlayState = "paused";
            over = true;
            startGame();
            startButton.style.visibility = "visible";
            clearInterval(checkIfOver);

        }
    }
}



