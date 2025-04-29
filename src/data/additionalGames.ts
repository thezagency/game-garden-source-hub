
import { Game } from "../types";

export const additionalGames: Game[] = [
  {
    id: "racing-game",
    title: "2D Racing",
    description: "A top-down racing game where you race against the clock to set the best lap time.",
    imageUrl: "/placeholder.svg",
    category: "racing",
    sourceCode: {
      html: `<!-- Racing Game HTML Structure -->
<div class="game-container">
  <canvas id="racing-canvas" width="600" height="400"></canvas>
  <div class="game-controls">
    <button id="start-btn">Start Race</button>
    <div class="stats">
      <div>Lap: <span id="lap-counter">0</span></div>
      <div>Time: <span id="time-counter">0</span>s</div>
      <div>Best Lap: <span id="best-time">N/A</span></div>
    </div>
  </div>
</div>`,
      css: `/* Racing Game Styling */
.game-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

canvas {
  background: #333;
  display: block;
  margin: 0 auto;
  border: 2px solid #000;
}

.game-controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #222;
  color: white;
}

button {
  background: #d62;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
}

.stats {
  display: flex;
  gap: 20px;
}`,
      js: `// Racing Game Logic
document.addEventListener('DOMContentLoaded', () => {
  // Game canvas setup
  const canvas = document.getElementById('racing-canvas');
  const ctx = canvas.getContext('2d');
  
  // Game variables
  let gameLoop;
  let isPlaying = false;
  let lapCounter = 0;
  let startTime = 0;
  let currentTime = 0;
  let bestTime = Infinity;
  
  // Track properties
  const track = {
    outerRadius: 170,
    innerRadius: 80,
    centerX: canvas.width / 2,
    centerY: canvas.height / 2
  };
  
  // Car properties
  const car = {
    x: track.centerX,
    y: track.centerY + track.outerRadius - 20,
    width: 10,
    height: 20,
    angle: Math.PI * 1.5, // Start pointing up
    speed: 0,
    maxSpeed: 3,
    acceleration: 0.1,
    deceleration: 0.05,
    rotationSpeed: 0.05,
    isDrifting: false
  };
  
  // Control states
  const keys = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  
  // Lap tracking
  let checkpointPassed = false;
  const startLine = {
    x1: track.centerX - track.outerRadius,
    y1: track.centerY,
    x2: track.centerX - track.innerRadius,
    y2: track.centerY
  };
  
  const checkpoint = {
    x1: track.centerX,
    y1: track.centerY - track.outerRadius,
    x2: track.centerX,
    y2: track.centerY - track.innerRadius
  };
  
  // Event listeners for controls
  window.addEventListener('keydown', (e) => {
    updateKeys(e.key, true);
  });
  
  window.addEventListener('keyup', (e) => {
    updateKeys(e.key, false);
  });
  
  function updateKeys(key, isPressed) {
    switch(key) {
      case 'ArrowUp':
        keys.up = isPressed;
        break;
      case 'ArrowDown':
        keys.down = isPressed;
        break;
      case 'ArrowLeft':
        keys.left = isPressed;
        break;
      case 'ArrowRight':
        keys.right = isPressed;
        break;
    }
  }
  
  // Draw the race track
  function drawTrack() {
    // Outer track
    ctx.beginPath();
    ctx.arc(track.centerX, track.centerY, track.outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#4C724C'; // Green grass
    ctx.fill();
    
    // Inner track (cut out)
    ctx.beginPath();
    ctx.arc(track.centerX, track.centerY, track.innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#4C724C';
    ctx.fill();
    
    // Race track
    ctx.beginPath();
    ctx.arc(track.centerX, track.centerY, track.outerRadius - 10, 0, Math.PI * 2);
    ctx.strokeStyle = '#777777';
    ctx.lineWidth = 20;
    ctx.stroke();
    
    // Start/finish line
    ctx.beginPath();
    ctx.moveTo(startLine.x1, startLine.y1);
    ctx.lineTo(startLine.x2, startLine.y2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Checkered pattern on start line
    const segments = 5;
    const segmentWidth = (startLine.x2 - startLine.x1) / (segments * 2);
    
    for (let i = 0; i < segments; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#000000';
      ctx.fillRect(
        startLine.x1 + i * segmentWidth * 2,
        startLine.y1 - 2.5,
        segmentWidth,
        5
      );
      
      ctx.fillStyle = i % 2 === 1 ? '#FFFFFF' : '#000000';
      ctx.fillRect(
        startLine.x1 + i * segmentWidth * 2 + segmentWidth,
        startLine.y1 - 2.5,
        segmentWidth,
        5
      );
    }
  }
  
  // Draw the car
  function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    
    // Car body
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
    
    // Car details
    ctx.fillStyle = '#000000';
    ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height / 5); // Front
    ctx.fillRect(-car.width / 2, car.height / 2 - car.height / 5, car.width, car.height / 5); // Back
    
    ctx.restore();
  }
  
  // Update car position and rotation
  function updateCar() {
    // Apply acceleration/deceleration
    if (keys.up) {
      car.speed = Math.min(car.maxSpeed, car.speed + car.acceleration);
    } else if (keys.down) {
      car.speed = Math.max(-car.maxSpeed / 2, car.speed - car.acceleration);
    } else {
      // Friction
      if (car.speed > 0) {
        car.speed = Math.max(0, car.speed - car.deceleration);
      } else if (car.speed < 0) {
        car.speed = Math.min(0, car.speed + car.deceleration);
      }
    }
    
    // Apply rotation
    if (car.speed !== 0) {
      const rotationFactor = car.speed > 0 ? 1 : -1;
      
      if (keys.left) {
        car.angle -= car.rotationSpeed * rotationFactor;
      } else if (keys.right) {
        car.angle += car.rotationSpeed * rotationFactor;
      }
    }
    
    // Update position based on angle and speed
    car.x += Math.sin(car.angle) * car.speed;
    car.y -= Math.cos(car.angle) * car.speed;
    
    // Track collision detection
    const distFromCenter = Math.sqrt(
      Math.pow(car.x - track.centerX, 2) +
      Math.pow(car.y - track.centerY, 2)
    );
    
    if (distFromCenter < track.innerRadius || distFromCenter > track.outerRadius) {
      // Bounce off walls and slow down
      car.speed = -car.speed * 0.5;
    }
    
    // Check if car is crossing the start/finish line
    if (car.x < track.centerX && Math.abs(car.y - track.centerY) < 10) {
      if (checkpointPassed) {
        // Complete a lap
        completeLap();
        checkpointPassed = false;
      }
    }
    
    // Check if car is passing the checkpoint
    if (car.y < track.centerY && Math.abs(car.x - track.centerX) < 10) {
      checkpointPassed = true;
    }
  }
  
  function completeLap() {
    lapCounter++;
    const lapTime = currentTime - startTime;
    
    // Update best time
    if (lapCounter > 1 && lapTime < bestTime) {
      bestTime = lapTime;
      document.getElementById('best-time').textContent = (bestTime / 1000).toFixed(2);
    }
    
    // Reset for next lap
    startTime = currentTime;
    document.getElementById('lap-counter').textContent = lapCounter;
  }
  
  // Game loop
  function gameUpdate(timestamp) {
    if (!isPlaying) return;
    
    // Update time
    currentTime = timestamp;
    if (lapCounter > 0) {
      document.getElementById('time-counter').textContent = 
        ((currentTime - startTime) / 1000).toFixed(2);
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawTrack();
    updateCar();
    drawCar();
    
    // Continue the game loop
    requestAnimationFrame(gameUpdate);
  }
  
  // Start game
  document.getElementById('start-btn').addEventListener('click', () => {
    // Reset game state
    car.x = track.centerX;
    car.y = track.centerY + track.outerRadius - 20;
    car.angle = Math.PI * 1.5;
    car.speed = 0;
    lapCounter = 0;
    checkpointPassed = false;
    isPlaying = true;
    
    // Reset UI
    document.getElementById('lap-counter').textContent = lapCounter;
    document.getElementById('time-counter').textContent = "0.00";
    
    // Start game loop
    requestAnimationFrame((timestamp) => {
      startTime = timestamp;
      currentTime = timestamp;
      gameUpdate(timestamp);
    });
  });
  
  // Initial draw
  drawTrack();
  drawCar();
});`,
    },
    difficulty: "intermediate",
    playUrl: "#/play/racing-game",
  },
  {
    id: "pong-game",
    title: "Classic Pong",
    description: "The classic two-player Pong game that started the arcade revolution.",
    imageUrl: "/placeholder.svg",
    category: "arcade",
    sourceCode: {
      html: `<!-- Pong Game HTML Structure -->
<div class="game-container">
  <canvas id="pong-canvas" width="600" height="400"></canvas>
  <div class="game-controls">
    <div id="score-left" class="score">0</div>
    <button id="start-btn">Start Game</button>
    <div id="score-right" class="score">0</div>
  </div>
  <div class="game-instructions">
    <p>Player 1: W (up) / S (down) | Player 2: Arrow Up / Arrow Down</p>
  </div>
</div>`,
      css: `/* Pong Game Styling */
.game-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Courier New', monospace;
  text-align: center;
}

canvas {
  background: #000;
  margin: 0 auto;
  display: block;
  border: 2px solid #fff;
}

.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.score {
  font-size: 24px;
  color: #fff;
  background: #333;
  padding: 5px 15px;
  border-radius: 5px;
  min-width: 40px;
}

button {
  background: #0066cc;
  color: white;
  border: none;
  padding: 10px 20px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #0055aa;
}

.game-instructions {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}`,
      js: `// Pong Game Logic
document.addEventListener('DOMContentLoaded', () => {
  // Game canvas setup
  const canvas = document.getElementById('pong-canvas');
  const ctx = canvas.getContext('2d');
  
  // Game variables
  let gameLoop;
  let gameActive = false;
  
  // Game objects
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5,
    color: '#ffffff'
  };
  
  const paddleHeight = 100;
  const paddleWidth = 10;
  const paddleOffset = 30;
  
  const leftPaddle = {
    x: paddleOffset,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#4ca5ff',
    speed: 6
  };
  
  const rightPaddle = {
    x: canvas.width - paddleOffset - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#ff4c4c',
    speed: 6
  };
  
  // Game state
  const gameState = {
    scoreLeft: 0,
    scoreRight: 0,
    maxScore: 7,
    keys: {
      w: false,
      s: false,
      arrowUp: false,
      arrowDown: false
    }
  };
  
  // Event listeners for paddle controls
  document.addEventListener('keydown', (e) => {
    updateKeys(e.key.toLowerCase(), true);
  });
  
  document.addEventListener('keyup', (e) => {
    updateKeys(e.key.toLowerCase(), false);
  });
  
  function updateKeys(key, isPressed) {
    switch(key) {
      case 'w':
        gameState.keys.w = isPressed;
        break;
      case 's':
        gameState.keys.s = isPressed;
        break;
      case 'arrowup':
        gameState.keys.arrowUp = isPressed;
        break;
      case 'arrowdown':
        gameState.keys.arrowDown = isPressed;
        break;
    }
  }
  
  // Draw game elements
  function draw() {
    // Clear the canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
    
    // Draw paddles
    ctx.fillStyle = leftPaddle.color;
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    
    ctx.fillStyle = rightPaddle.color;
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    
    // Draw scores
    ctx.font = '24px Courier New';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.scoreLeft.toString(), canvas.width / 4, 30);
    ctx.fillText(gameState.scoreRight.toString(), 3 * canvas.width / 4, 30);
  }
  
  // Update game state
  function update() {
    if (!gameActive) return;
    
    // Move paddles
    if (gameState.keys.w) {
      leftPaddle.y = Math.max(0, leftPaddle.y - leftPaddle.speed);
    }
    if (gameState.keys.s) {
      leftPaddle.y = Math.min(canvas.height - leftPaddle.height, leftPaddle.y + leftPaddle.speed);
    }
    if (gameState.keys.arrowUp) {
      rightPaddle.y = Math.max(0, rightPaddle.y - rightPaddle.speed);
    }
    if (gameState.keys.arrowDown) {
      rightPaddle.y = Math.min(canvas.height - rightPaddle.height, rightPaddle.y + rightPaddle.speed);
    }
    
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
      ball.speedY = -ball.speedY;
      
      // Add slight randomness to prevent looping patterns
      ball.speedY += (Math.random() - 0.5) * 0.5;
    }
    
    // Ball collision with paddles
    // Left paddle
    if (
      ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
      ball.y >= leftPaddle.y &&
      ball.y <= leftPaddle.y + leftPaddle.height &&
      ball.speedX < 0
    ) {
      ball.speedX = -ball.speedX;
      
      // Change angle based on where ball hits paddle
      const hitPosition = (ball.y - leftPaddle.y) / leftPaddle.height;
      ball.speedY = (hitPosition - 0.5) * 10;
      
      // Speed up the ball slightly
      ball.speedX *= 1.05;
    }
    
    // Right paddle
    if (
      ball.x + ball.radius >= rightPaddle.x &&
      ball.y >= rightPaddle.y &&
      ball.y <= rightPaddle.y + rightPaddle.height &&
      ball.speedX > 0
    ) {
      ball.speedX = -ball.speedX;
      
      // Change angle based on where ball hits paddle
      const hitPosition = (ball.y - rightPaddle.y) / rightPaddle.height;
      ball.speedY = (hitPosition - 0.5) * 10;
      
      // Speed up the ball slightly
      ball.speedX *= 1.05;
    }
    
    // Ball goes past paddles (scoring)
    if (ball.x < 0) {
      // Right player scores
      gameState.scoreRight++;
      document.getElementById('score-right').textContent = gameState.scoreRight;
      resetBall(1);
      
      checkGameEnd();
    } else if (ball.x > canvas.width) {
      // Left player scores
      gameState.scoreLeft++;
      document.getElementById('score-left').textContent = gameState.scoreLeft;
      resetBall(-1);
      
      checkGameEnd();
    }
  }
  
  // Reset the ball after scoring
  function resetBall(directionX) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Normalize speeds
    ball.speedX = 5 * directionX;
    ball.speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
  }
  
  // Check if game has ended
  function checkGameEnd() {
    if (gameState.scoreLeft >= gameState.maxScore || gameState.scoreRight >= gameState.maxScore) {
      gameActive = false;
      
      // Show winner message
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '36px Courier New';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      
      if (gameState.scoreLeft > gameState.scoreRight) {
        ctx.fillText('Player 1 Wins!', canvas.width / 2, canvas.height / 2);
      } else {
        ctx.fillText('Player 2 Wins!', canvas.width / 2, canvas.height / 2);
      }
      
      ctx.font = '18px Courier New';
      ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 40);
    }
  }
  
  // Game loop
  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
  
  // Start game
  document.getElementById('start-btn').addEventListener('click', () => {
    // Reset game state
    gameActive = true;
    gameState.scoreLeft = 0;
    gameState.scoreRight = 0;
    document.getElementById('score-left').textContent = '0';
    document.getElementById('score-right').textContent = '0';
    
    // Reset ball position
    resetBall(Math.random() > 0.5 ? 1 : -1);
  });
  
  // Initialize game
  draw();
  requestAnimationFrame(gameLoop);
});`,
    },
    difficulty: "beginner",
    featured: true,
    playUrl: "#/play/pong-game",
  },
  {
    id: "math-quiz",
    title: "Math Challenge",
    description: "Test your math skills with this educational quiz game.",
    imageUrl: "/placeholder.svg",
    category: "educational",
    sourceCode: {
      html: `<!-- Math Quiz Game HTML Structure -->
<div class="game-container">
  <div class="quiz-header">
    <h2>Math Challenge</h2>
    <div class="stats">
      <div>Score: <span id="score">0</span></div>
      <div>Level: <span id="level">1</span></div>
      <div>Time: <span id="time">60</span>s</div>
    </div>
  </div>
  
  <div id="question-container" class="question-container">
    <div id="question" class="question">What is 5 + 3?</div>
    <div class="answer-container">
      <div id="answers" class="answers">
        <!-- Answer buttons will be added here -->
      </div>
    </div>
  </div>
  
  <div id="result-container" class="result-container hidden">
    <h2>Game Over!</h2>
    <div id="final-score">Your score: 0</div>
    <div id="final-level">You reached level: 1</div>
    <button id="restart-btn">Play Again</button>
  </div>
  
  <div class="controls">
    <button id="start-btn">Start Game</button>
    <div class="difficulty">
      <button id="easy-btn" class="diff-btn active">Easy</button>
      <button id="medium-btn" class="diff-btn">Medium</button>
      <button id="hard-btn" class="diff-btn">Hard</button>
    </div>
  </div>
</div>`,
      css: `/* Math Quiz Game Styling */
.game-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.quiz-header h2 {
  margin: 0;
  color: #333;
}

.stats {
  display: flex;
  gap: 15px;
  font-weight: bold;
}

.question-container {
  margin: 20px 0;
  text-align: center;
}

.question {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.answers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.answer-btn {
  padding: 12px;
  font-size: 18px;
  border: none;
  background: #4c7cff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.answer-btn:hover {
  background: #3867e0;
}

.answer-btn.correct {
  background: #4caf50;
}

.answer-btn.wrong {
  background: #f44336;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

#start-btn, #restart-btn {
  padding: 10px 20px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

#start-btn:hover, #restart-btn:hover {
  background: #27ae60;
}

.difficulty {
  display: flex;
  gap: 5px;
}

.diff-btn {
  padding: 8px 12px;
  border: none;
  background: #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.diff-btn.active {
  background: #4c7cff;
  color: white;
}

.result-container {
  text-align: center;
  margin: 20px 0;
}

#final-score, #final-level {
  font-size: 18px;
  margin: 10px 0;
}

.hidden {
  display: none;
}`,
      js: `// Math Quiz Game Logic
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const questionContainer = document.getElementById('question-container');
  const resultContainer = document.getElementById('result-container');
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');
  const scoreElement = document.getElementById('score');
  const levelElement = document.getElementById('level');
  const timeElement = document.getElementById('time');
  const finalScoreElement = document.getElementById('final-score');
  const finalLevelElement = document.getElementById('final-level');
  const startButton = document.getElementById('start-btn');
  const restartButton = document.getElementById('restart-btn');
  const easyButton = document.getElementById('easy-btn');
  const mediumButton = document.getElementById('medium-btn');
  const hardButton = document.getElementById('hard-btn');

  // Game variables
  let score = 0;
  let level = 1;
  let timeLeft = 60;
  let timer;
  let currentAnswer = null;
  let isGameActive = false;
  let difficulty = 'easy'; // Default difficulty
  
  // Math operation types
  const operationTypes = {
    easy: ['addition', 'subtraction'],
    medium: ['addition', 'subtraction', 'multiplication'],
    hard: ['addition', 'subtraction', 'multiplication', 'division']
  };
  
  // Set difficulty
  easyButton.addEventListener('click', () => setDifficulty('easy'));
  mediumButton.addEventListener('click', () => setDifficulty('medium'));
  hardButton.addEventListener('click', () => setDifficulty('hard'));
  
  function setDifficulty(diff) {
    difficulty = diff;
    
    // Update UI
    easyButton.classList.remove('active');
    mediumButton.classList.remove('active');
    hardButton.classList.remove('active');
    
    if (diff === 'easy') easyButton.classList.add('active');
    if (diff === 'medium') mediumButton.classList.add('active');
    if (diff === 'hard') hardButton.classList.add('active');
  }
  
  // Start game
  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', startGame);
  
  function startGame() {
    // Reset game state
    score = 0;
    level = 1;
    timeLeft = 60;
    isGameActive = true;
    
    // Update UI
    scoreElement.textContent = score;
    levelElement.textContent = level;
    timeElement.textContent = timeLeft;
    
    // Show question container, hide result container
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    
    // Start timer
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    
    // Generate first question
    generateQuestion();
  }
  
  // Update timer
  function updateTimer() {
    timeLeft--;
    timeElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      endGame();
    }
  }
  
  // Generate a new math question based on level and difficulty
  function generateQuestion() {
    // Clear previous answers
    answersElement.innerHTML = '';
    
    // Select question type based on difficulty
    const operationChoices = operationTypes[difficulty];
    const operation = operationChoices[Math.floor(Math.random() * operationChoices.length)];
    
    // Generate numbers based on level
    let num1, num2, answer;
    
    const maxNum = 5 + (level * 2); // Increase max number with level
    
    switch (operation) {
      case 'addition':
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        answer = num1 + num2;
        questionElement.textContent = \`What is \${num1} + \${num2}?\`;
        break;
      
      case 'subtraction':
        // Ensure num1 >= num2 to avoid negative results
        num1 = Math.floor(Math.random() * maxNum) + Math.floor(maxNum/2);
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        questionElement.textContent = \`What is \${num1} - \${num2}?\`;
        break;
      
      case 'multiplication':
        // Adjust for reasonable difficulty
        const factor = difficulty === 'hard' ? 1 : 0.5;
        num1 = Math.floor(Math.random() * (maxNum * factor)) + 1;
        num2 = Math.floor(Math.random() * (maxNum * factor)) + 1;
        answer = num1 * num2;
        questionElement.textContent = \`What is \${num1} × \${num2}?\`;
        break;
      
      case 'division':
        // Create a division problem with a whole number answer
        num2 = Math.floor(Math.random() * 5) + 1; // divisor
        answer = Math.floor(Math.random() * 5) + 1; // quotient
        num1 = num2 * answer; // dividend
        questionElement.textContent = \`What is \${num1} ÷ \${num2}?\`;
        break;
    }
    
    currentAnswer = answer;
    
    // Generate answer choices
    const answers = generateAnswerChoices(answer);
    
    // Shuffle answers
    shuffleArray(answers);
    
    // Create answer buttons
    answers.forEach(choice => {
      const button = document.createElement('button');
      button.textContent = choice;
      button.classList.add('answer-btn');
      button.addEventListener('click', () => checkAnswer(choice));
      answersElement.appendChild(button);
    });
  }
  
  // Generate wrong answers that are close to the correct answer
  function generateAnswerChoices(correctAnswer) {
    const choices = [correctAnswer];
    
    while (choices.length < 4) {
      // Generate an offset between -5 and 5, but not 0
      let offset = Math.floor(Math.random() * 10) - 5;
      if (offset === 0) offset = 1;
      
      const wrongAnswer = correctAnswer + offset;
      
      // Ensure all choices are positive and unique
      if (wrongAnswer > 0 && !choices.includes(wrongAnswer)) {
        choices.push(wrongAnswer);
      }
    }
    
    return choices;
  }
  
  // Shuffle array in place
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Check if answer is correct
  function checkAnswer(userAnswer) {
    if (!isGameActive) return;
    
    const buttons = answersElement.querySelectorAll('.answer-btn');
    buttons.forEach(button => {
      button.disabled = true;
      
      // Highlight correct and wrong answers
      if (parseInt(button.textContent) === currentAnswer) {
        button.classList.add('correct');
      } else if (parseInt(button.textContent) === parseInt(userAnswer) && 
                parseInt(userAnswer) !== currentAnswer) {
        button.classList.add('wrong');
      }
    });
    
    // If answer is correct
    if (parseInt(userAnswer) === currentAnswer) {
      // Calculate points based on level and difficulty multiplier
      let difficultyMultiplier;
      switch (difficulty) {
        case 'easy': difficultyMultiplier = 1; break;
        case 'medium': difficultyMultiplier = 2; break;
        case 'hard': difficultyMultiplier = 3; break;
        default: difficultyMultiplier = 1;
      }
      
      const points = 10 * level * difficultyMultiplier;
      score += points;
      scoreElement.textContent = score;
      
      // Level up every 5 correct answers
      if (score >= level * 50) {
        level++;
        levelElement.textContent = level;
        
        // Add bonus time for leveling up
        timeLeft += 10;
        timeElement.textContent = timeLeft;
      }
    }
    
    // Wait before showing next question
    setTimeout(() => {
      if (isGameActive) {
        generateQuestion();
      }
    }, 1000);
  }
  
  // End game
  function endGame() {
    isGameActive = false;
    clearInterval(timer);
    
    // Show results
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    finalScoreElement.textContent = \`Your score: \${score}\`;
    finalLevelElement.textContent = \`You reached level: \${level}\`;
  }
});`,
    },
    difficulty: "beginner",
    playUrl: "#/play/math-quiz",
  }
];
