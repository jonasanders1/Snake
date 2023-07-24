var score = document.getElementById("score");

var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;
var userScore = 0;
// snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

// snake body
var snakeBody = [];
// food
var foodX;
var foodY;

var gameOver = false;
var snakeSpeed = 10; // Adjust the speed as needed
var lastUpdateTime = 0;
var snakeMoveInterval = 1000 / snakeSpeed;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); // used for drawing on the board

    placeFood();
    document.addEventListener("keyup", changeDirction);
    requestAnimationFrame(update); // Use requestAnimationFrame instead of setInterval
}

function update(currentTime) {
    if (gameOver) {
        return;
    }

    if (!lastUpdateTime) {
        lastUpdateTime = currentTime;
    }

    var timeElapsed = currentTime - lastUpdateTime;

    if (timeElapsed > snakeMoveInterval) {
        var blocksToMove = Math.floor(timeElapsed / snakeMoveInterval);

        for (var i = 0; i < blocksToMove; i++) {
            // Update the positions of the body segments
            for (let i = snakeBody.length - 1; i > 0; i--) {
                snakeBody[i] = snakeBody[i - 1];
            }

            if (snakeBody.length) {
                snakeBody[0] = [snakeX, snakeY];
            }

            snakeX = (snakeX + velocityX * blockSize + board.width) % board.width;
            snakeY = (snakeY + velocityY * blockSize + board.height) % board.height;

            // Game over conditions - only check for collisions with the snake's body
            for (let i = 0; i < snakeBody.length; i++) {
                if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
                    gameOver = true;
                    alert("Game over!");
                    break;
                }
            }

            // Check for collision with food and update the snake's body
            if (snakeX === foodX && snakeY === foodY) {
                snakeBody.push([foodX, foodY]); // Add new segment to the end
                userScore++;
                score.innerHTML = `${userScore}`;
                placeFood();
            }

            timeElapsed -= snakeMoveInterval;
        }

        lastUpdateTime = currentTime - timeElapsed;
    }

    // drawing board
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    // drawing food
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Check for collision with food and update the snake's body
    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]); // Add new segment to the end
        userScore++;
        score.innerHTML = `${userScore}`;
        placeFood();
    }

    // drawing snake
    context.fillStyle = "lime";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    requestAnimationFrame(update); // Continue the animation loop
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function changeDirction(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}
