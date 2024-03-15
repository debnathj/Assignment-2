
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const user = {
    x: 20,
    y: canvas.height / 2 - 60 / 2,
    width: 10,
    height: 60,
    color: "#0095DD",
    score: 0,
    speed: 10, // Adjust the speed of paddle movement
    upPressed: false,
    downPressed: false
};

const ai = {
    x: canvas.width - 30,
    y: canvas.height / 2 - 60 / 2,
    width: 10,
    height: 60,
    color: "#FF0000",
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 9 + 5),
    velocityY: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 9 + 5),
    color: "#000"
};

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "#000");
    }
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
    ctx.fillText("User Score:" + user.score + "      " + "AI Score:" + ai.score, canvas.width / 2 - 160, 30);
}

function collisionDetection() {
    // Ball and user paddle collision
    if (
        ball.x - ball.radius < user.x + user.width &&
        ball.x + ball.radius > user.x &&
        ball.y - ball.radius < user.y + user.height &&
        ball.y + ball.radius > user.y
    ) {
        ball.velocityX = -ball.velocityX;
    }

    // Ball and AI paddle collision
    if (
        ball.x - ball.radius < ai.x + ai.width &&
        ball.x + ball.radius > ai.x &&
        ball.y - ball.radius < ai.y + ai.height &&
        ball.y + ball.radius > ai.y
    ) {
        ball.velocityX = -ball.velocityX;
    }
}

function resetBall() {
    ball.x = Math.random() * (canvas.width - 2 * ball.radius) + ball.radius;
    ball.y = Math.random() * (canvas.height - 2 * ball.radius) + ball.radius;
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 9 + 5);
    ball.speed = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 9 + 5);
}

function update() {
    // Handle paddle movement with arrow keys
    if (user.upPressed && user.y > 0) {
        user.y -= user.speed;
    }
    if (user.downPressed && user.y < canvas.height - user.height) {
        user.y += user.speed;
    }

    // AI movement
    let randomFactor = Math.random() * 0.2 + 0.1;
    ai.y += (ball.y - (ai.y + ai.height / 2)) * randomFactor;

    // Ball movement
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Score update
    if (ball.x - ball.radius < 0) {
        ai.score++;
        showMessage("AI got a point!");
        resetBall(); // Reset the ball position here
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        showMessage("User got a point!");
        resetBall(); // Reset the ball position here
    }

    collisionDetection();
    // Trigger fireworks animation when winner is announced


}
function showMessage(message) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
    messageElement.style.display = "block";
    setTimeout(function () {
        messageElement.style.display = "none";
    }, 2000); // Hide the message after 2 seconds
}



function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawNet();
    drawScore();
}
document.getElementById("start-button").addEventListener("click", function () {
    if (!gameRunning) {
        gameRunning = true;
        gameLoop();
    }
});

document.getElementById("pause-button").addEventListener("click", function () {
    gameRunning = false;
});
document.getElementById("restart-button").addEventListener("click", function () {
    resetGame();
    if (!gameRunning) {
        gameRunning = true;
        gameLoop();
    }
});

let gameRunning = false;

function resetGame() {
    user.score = 0;
    ai.score = 0;
    resetBall();
    document.getElementById("game-over").style.display = "none";
}

function gameLoop() {
    if (!gameRunning) return;

    update();
    draw();

    if (user.score === 20 || ai.score === 20) {
        let winner = user.score === 20 ? "User" : "AI";
        document.getElementById("game-over").textContent = winner + " wins!";
        document.getElementById("game-over").style.display = "block";
        gameRunning = false;
        setTimeout(resetGame, 3000); // Reset the game after 3 seconds
    } else {
        requestAnimationFrame(gameLoop);
    }
}




// Event listeners for arrow key press and release
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        user.upPressed = true;
    } else if (e.key === "ArrowDown") {
        user.downPressed = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") {
        user.upPressed = false;
    } else if (e.key === "ArrowDown") {
        user.downPressed = false;
    }
});
canvas.addEventListener("mousemove", function (event) {
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
});


gameLoop();
