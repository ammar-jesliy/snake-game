const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

const retry_btn = document.getElementById("retry");
const start_btn = document.getElementById("start");

let snake = [ {x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150} ];

let dx = 10;
let dy = 0;

let foodX = 10;
let foodY = 10;

let scoreHtml = document.getElementById("score");
let score = 0;
let highScore = localStorage.getItem('highScore');

let changingDirection = true;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

ctx.strokeStyle = "black";
ctx.lineWidth = 2;
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.lineWidth = 2
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {
    const LEFT_KEY = "ArrowLeft";
    const RIGHT_KEY = "ArrowRight";
    const UP_KEY = "ArrowUp";
    const DOWN_KEY = "ArrowDown";

    const keyPressed = event.key;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;


    if(changingDirection) {
        return;
    }

    changingDirection = true;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        createFood();
        score = score + 1;
        scoreHtml.innerHTML = score;
    } else {
        snake.pop();
    }
    if (score > highScore) {
        setHighScore();
    }
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';

    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) {
            createFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';

    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) {
            return true;
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function main() {
    retry_btn.style.display = "none";
    scoreHtml.innerHTML = "Score = " + score;

    if (didGameEnd()) {
        setTimeout(() => {
            clearCanvas();
            ctx.font = "50px monospace";
            ctx.fillStyle = 'black';
            ctx.fillText("Game Over!", 15, 150);

            ctx.font = "20px monospace";
            ctx.fillText("score = " + score + "   best = " + highScore, 30, 200);

            retry_btn.style.display = "flex";
            scoreHtml.innerHTML = "";
            
        }, 1000);

        return;
    }
    
    setTimeout(function onTick() {
        clearCanvas();
        changingDirection = false;
        advanceSnake();
        drawSnake();
        drawFood();
        main();
    }, 100);

    document.addEventListener("keydown", changeDirection);

    
}

function start() {
    createFood();
    main();

    start_btn.style.display = "none";
}

function retry() {
    snake = [ {x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150} ];
    score = 0;
    dx = 10;
    dy = 0;

    createFood();
    main();
}

function setHighScore() {
    highScore = score;

    localStorage.setItem('highScore', highScore)
}

retry_btn.style.display = "none";

ctx.font = "35px monospace";
ctx.fillStyle = 'black';
ctx.fillText("Welcome to the", 17, 125);
ctx.fillText("Snake Game", 55, 175);

start_btn.addEventListener("click", start);
retry_btn.addEventListener("click", retry);

