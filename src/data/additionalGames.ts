
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
    playUrl: "/play/racing-game",
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
    playUrl: "/play/pong-game",
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
        questionElement.textContent = "What is " + num1 + " + " + num2 + "?";
        break;
      
      case 'subtraction':
        // Ensure num1 >= num2 to avoid negative results
        num1 = Math.floor(Math.random() * maxNum) + Math.floor(maxNum/2);
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        questionElement.textContent = "What is " + num1 + " - " + num2 + "?";
        break;
      
      case 'multiplication':
        // Adjust for reasonable difficulty
        const factor = difficulty === 'hard' ? 1 : 0.5;
        num1 = Math.floor(Math.random() * (maxNum * factor)) + 1;
        num2 = Math.floor(Math.random() * (maxNum * factor)) + 1;
        answer = num1 * num2;
        questionElement.textContent = "What is " + num1 + " × " + num2 + "?";
        break;
      
      case 'division':
        // Create a division problem with a whole number answer
        num2 = Math.floor(Math.random() * 5) + 1; // divisor
        answer = Math.floor(Math.random() * 5) + 1; // quotient
        num1 = num2 * answer; // dividend
        questionElement.textContent = "What is " + num1 + " ÷ " + num2 + "?";
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
    
    finalScoreElement.textContent = "Your score: " + score;
    finalLevelElement.textContent = "You reached level: " + level;
  }
});`,
    },
    difficulty: "beginner",
    playUrl: "/play/math-quiz",
  },
  {
    id: "space-shooter",
    title: "Space Shooter",
    description: "Defend Earth from alien invaders in this classic arcade shooter.",
    imageUrl: "/placeholder.svg",
    category: "arcade",
    sourceCode: {
      html: `<div class="game-container">
  <canvas id="game-canvas" width="600" height="400"></canvas>
  <div class="game-controls">
    <div id="score">Score: 0</div>
    <button id="start-btn">Start Game</button>
    <div id="lives">Lives: 3</div>
  </div>
</div>`,
      css: `.game-container {
  max-width: 600px;
  margin: 0 auto;
}
canvas {
  display: block;
  background: #000;
  border: 2px solid #333;
}
.game-controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #222;
  color: white;
}
button {
  background: #0066cc;
  color: white;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
}`,
      js: `document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-btn');
  const scoreDisplay = document.getElementById('score');
  const livesDisplay = document.getElementById('lives');
  
  // Game state
  let gameActive = false;
  let score = 0;
  let lives = 3;
  let gameLoop;
  
  // Player ship
  const player = {
    x: canvas.width / 2,
    y: canvas.height - 40,
    width: 30,
    height: 30,
    speed: 5
  };
  
  // Bullets array
  let bullets = [];
  const bulletSpeed = 7;
  
  // Enemies array
  let enemies = [];
  const enemySpeed = 2;
  
  // Controls
  const keys = {
    left: false,
    right: false,
    space: false
  };
  
  // Event listeners
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ') keys.space = true;
  });
  
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') keys.space = false;
  });
  
  startBtn.addEventListener('click', startGame);
  
  function startGame() {
    if (gameActive) return;
    
    // Reset game state
    gameActive = true;
    score = 0;
    lives = 3;
    bullets = [];
    enemies = [];
    
    // Update display
    scoreDisplay.textContent = "Score: " + score;
    livesDisplay.textContent = "Lives: " + lives;
    
    // Create initial enemies
    createEnemyWave();
    
    // Start game loop
    gameLoop = setInterval(update, 1000 / 60);
  }
  
  function createEnemyWave() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 8; j++) {
        enemies.push({
          x: j * 60 + 50,
          y: i * 40 + 30,
          width: 30,
          height: 20,
          speed: enemySpeed,
          direction: 1
        });
      }
    }
  }
  
  function update() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move player
    if (keys.left && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.right && player.x < canvas.width - player.width) {
      player.x += player.speed;
    }
    
    // Create new bullet on space press
    if (keys.space) {
      if (bullets.length === 0 || bullets[bullets.length - 1].y < canvas.height - 100) {
        bullets.push({
          x: player.x + player.width / 2 - 2,
          y: player.y,
          width: 4,
          height: 10,
          speed: bulletSpeed
        });
      }
    }
    
    // Move and draw bullets
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].y -= bullets[i].speed;
      
      // Remove bullets that go off screen
      if (bullets[i].y < 0) {
        bullets.splice(i, 1);
        i--;
        continue;
      }
      
      // Draw bullet
      ctx.fillStyle = '#fff';
      ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
    }
    
    // Check if all enemies are destroyed
    if (enemies.length === 0) {
      createEnemyWave();
    }
    
    // Move enemies
    let reverseDirection = false;
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].x += enemies[i].speed * enemies[i].direction;
      
      // Check if any enemy reaches the edge
      if (enemies[i].x <= 0 || enemies[i].x >= canvas.width - enemies[i].width) {
        reverseDirection = true;
      }
    }
    
    // If enemies hit the edge, reverse direction and move down
    if (reverseDirection) {
      for (let i = 0; i < enemies.length; i++) {
        enemies[i].direction *= -1;
        enemies[i].y += 20;
        
        // Check if enemies reached the bottom (game over)
        if (enemies[i].y >= player.y - enemies[i].height) {
          gameOver();
          return;
        }
      }
    }
    
    // Check collisions
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < enemies.length; j++) {
        if (checkCollision(bullets[i], enemies[j])) {
          // Remove bullet and enemy
          bullets.splice(i, 1);
          enemies.splice(j, 1);
          i--;
          
          // Increase score
          score += 10;
          scoreDisplay.textContent = "Score: " + score;
          break;
        }
      }
    }
    
    // Draw player
    ctx.fillStyle = '#0099ff';
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.fill();
    
    // Draw enemies
    for (let i = 0; i < enemies.length; i++) {
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }
  }
  
  function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
  
  function gameOver() {
    clearInterval(gameLoop);
    gameActive = false;
    
    // Draw game over text
    ctx.fillStyle = 'white';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Click Start to play again', canvas.width / 2, canvas.height / 2 + 40);
  }
  
  // Initial draw
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Space Shooter', canvas.width / 2, canvas.height / 2 - 30);
  ctx.font = '16px Arial';
  ctx.fillText('Click Start to play', canvas.width / 2, canvas.height / 2 + 10);
  ctx.fillText('Use arrow keys to move and space to shoot', canvas.width / 2, canvas.height / 2 + 40);
});`,
    },
    difficulty: "beginner",
    featured: true,
    playUrl: "/play/space-shooter",
  },
  {
    id: "platformer-game",
    title: "Pixel Platformer",
    description: "Run and jump through obstacles in this retro platformer game.",
    imageUrl: "/placeholder.svg",
    category: "action",
    sourceCode: {
      html: `<div class="game-container">
  <canvas id="game-canvas" width="800" height="400"></canvas>
  <div class="controls">
    <button id="start-button">Start Game</button>
    <div id="score">Score: 0</div>
  </div>
</div>`,
      css: `.game-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
canvas {
  background: #5c94fc;
  display: block;
  margin: 0 auto;
  border: 4px solid #333;
}
.controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #333;
  color: white;
}
button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
  font-weight: bold;
}`,
      js: `document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const startButton = document.getElementById('start-button');
  const scoreDisplay = document.getElementById('score');
  
  // Game variables
  let gameActive = false;
  let score = 0;
  let animationId;
  
  // Player properties
  const player = {
    x: 50,
    y: 300,
    width: 32,
    height: 32,
    speed: 5,
    jumpPower: 12,
    gravity: 0.5,
    velocityY: 0,
    jumping: false
  };
  
  // Platform properties
  const platforms = [];
  const platformColors = ['#8F563B', '#663931', '#5D4037'];
  
  // Obstacle properties
  const obstacles = [];
  
  // Background elements
  const clouds = [];
  
  // Controls
  const keys = {
    right: false,
    left: false,
    up: false
  };
  
  // Event listeners
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowUp' || e.key === ' ') keys.up = true;
  });
  
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowUp' || e.key === ' ') keys.up = false;
  });
  
  startButton.addEventListener('click', startGame);
  
  function startGame() {
    if (gameActive) return;
    
    // Reset game state
    gameActive = true;
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    platforms.length = 0;
    obstacles.length = 0;
    clouds.length = 0;
    
    // Reset player position
    player.x = 50;
    player.y = 300;
    player.velocityY = 0;
    player.jumping = false;
    
    // Create initial platforms
    createInitialPlatforms();
    
    // Create some clouds
    for (let i = 0; i < 5; i++) {
      createCloud();
    }
    
    // Start game loop
    cancelAnimationFrame(animationId);
    gameLoop();
  }
  
  function createInitialPlatforms() {
    // Create ground
    for (let i = 0; i < canvas.width / 64; i++) {
      platforms.push({
        x: i * 64,
        y: canvas.height - 32,
        width: 64,
        height: 32,
        color: platformColors[0]
      });
    }
    
    // Create some platforms
    platforms.push({ x: 200, y: 250, width: 128, height: 16, color: platformColors[1] });
    platforms.push({ x: 400, y: 200, width: 128, height: 16, color: platformColors[1] });
    platforms.push({ x: 600, y: 250, width: 128, height: 16, color: platformColors[1] });
    
    // Create some obstacles
    obstacles.push({ x: 300, y: canvas.height - 64, width: 32, height: 32 });
    obstacles.push({ x: 500, y: canvas.height - 64, width: 32, height: 32 });
  }
  
  function createCloud() {
    clouds.push({
      x: Math.random() * canvas.width,
      y: Math.random() * 100 + 20,
      width: Math.random() * 60 + 40,
      height: Math.random() * 20 + 20,
      speed: Math.random() * 0.5 + 0.1
    });
  }
  
  function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Update clouds
    updateClouds();
    
    // Player movement
    updatePlayer();
    
    // Periodically add new platforms and obstacles
    if (Math.random() < 0.01) {
      platforms.push({
        x: canvas.width,
        y: Math.random() * 200 + 150,
        width: Math.random() * 80 + 50,
        height: 16,
        color: platformColors[Math.floor(Math.random() * platformColors.length)]
      });
    }
    
    if (Math.random() < 0.005) {
      obstacles.push({
        x: canvas.width,
        y: canvas.height - 64,
        width: 32,
        height: 32
      });
    }
    
    // Update and draw platforms
    updatePlatforms();
    
    // Update and draw obstacles
    updateObstacles();
    
    // Draw player
    drawPlayer();
    
    // Increase score over time
    if (gameActive && animationId % 5 === 0) {
      score++;
      scoreDisplay.textContent = "Score: " + score;
    }
    
    // Continue game loop
    if (gameActive) {
      animationId = requestAnimationFrame(gameLoop);
    }
  }
  
  function drawBackground() {
    // Sky
    ctx.fillStyle = '#5c94fc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw clouds
    ctx.fillStyle = '#ffffff';
    clouds.forEach(cloud => {
      ctx.beginPath();
      ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Ground
    ctx.fillStyle = '#507830';
    ctx.fillRect(0, canvas.height - 32, canvas.width, 32);
  }
  
  function updateClouds() {
    for (let i = 0; i < clouds.length; i++) {
      // Move clouds
      clouds[i].x -= clouds[i].speed;
      
      // If cloud moves off screen, reset position
      if (clouds[i].x + clouds[i].width < 0) {
        clouds[i].x = canvas.width + clouds[i].width;
        clouds[i].y = Math.random() * 100 + 20;
      }
    }
  }
  
  function updatePlayer() {
    // Apply gravity
    player.velocityY += player.gravity;
    
    // Handle jumping
    if (keys.up && !player.jumping) {
      player.velocityY = -player.jumpPower;
      player.jumping = true;
    }
    
    // Handle left/right movement
    if (keys.right && player.x < canvas.width - player.width) {
      player.x += player.speed;
    }
    if (keys.left && player.x > 0) {
      player.x -= player.speed;
    }
    
    // Update player position
    player.y += player.velocityY;
    
    // Check platform collisions
    let onPlatform = false;
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      
      // Check if player is on a platform
      if (player.x + player.width > p.x &&
          player.x < p.x + p.width &&
          player.y + player.height > p.y &&
          player.y + player.height < p.y + player.velocityY + 10 &&
          player.velocityY > 0) {
        
        player.y = p.y - player.height;
        player.velocityY = 0;
        player.jumping = false;
        onPlatform = true;
      }
    }
    
    // Check if player falls off the bottom
    if (player.y > canvas.height) {
      gameOver();
    }
    
    // Check obstacle collisions
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      
      if (player.x + player.width > o.x &&
          player.x < o.x + o.width &&
          player.y + player.height > o.y &&
          player.y < o.y + o.height) {
        
        gameOver();
        break;
      }
    }
  }
  
  function updatePlatforms() {
    for (let i = 0; i < platforms.length; i++) {
      // Move platforms to create side-scrolling effect
      platforms[i].x -= 2;
      
      // Draw platform
      ctx.fillStyle = platforms[i].color;
      ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
      
      // Remove platforms that go off screen
      if (platforms[i].x + platforms[i].width < 0) {
        platforms.splice(i, 1);
        i--;
      }
    }
  }
  
  function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
      // Move obstacles
      obstacles[i].x -= 2;
      
      // Draw obstacle (spikes)
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.moveTo(obstacles[i].x, obstacles[i].y + obstacles[i].height);
      ctx.lineTo(obstacles[i].x + obstacles[i].width / 2, obstacles[i].y);
      ctx.lineTo(obstacles[i].x + obstacles[i].width, obstacles[i].y + obstacles[i].height);
      ctx.fill();
      
      // Remove obstacles that go off screen
      if (obstacles[i].x + obstacles[i].width < 0) {
        obstacles.splice(i, 1);
        i--;
      }
    }
  }
  
  function drawPlayer() {
    // Draw player character (simple rectangle for now)
    ctx.fillStyle = '#ff9800';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw face
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + player.width - 12, player.y + 8, 4, 4); // Eye
    ctx.fillRect(player.x + 8, player.y + 8, 4, 4); // Other eye
    ctx.fillRect(player.x + 10, player.y + 20, 12, 3); // Mouth
  }
  
  function gameOver() {
    gameActive = false;
    
    // Display game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '18px Arial';
    ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Click Start to play again', canvas.width / 2, canvas.height / 2 + 60);
  }
  
  // Show initial instructions
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Pixel Platformer', canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = '16px Arial';
  ctx.fillText('Use arrow keys to move and jump', canvas.width / 2, canvas.height / 2);
  ctx.fillText('Click Start to begin', canvas.width / 2, canvas.height / 2 + 30);
});`,
    },
    difficulty: "intermediate",
    playUrl: "/play/platformer-game",
  },
  {
    id: "breakout-game",
    title: "Brick Breaker",
    description: "Classic brick breaker arcade game with multiple levels.",
    imageUrl: "/placeholder.svg",
    category: "arcade",
    sourceCode: {
      html: `<div class="game-container">
  <canvas id="breakout-canvas" width="480" height="320"></canvas>
  <div class="controls">
    <button id="start-button">Start Game</button>
    <div id="score-display">Score: 0</div>
    <div id="lives-display">Lives: 3</div>
  </div>
</div>`,
      css: `.game-container {
  max-width: 480px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}
canvas {
  background: #222;
  display: block;
  margin: 0 auto;
  border: 2px solid #555;
}
.controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #333;
  color: white;
}
button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
}`,
      js: `document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('breakout-canvas');
  const ctx = canvas.getContext('2d');
  const startButton = document.getElementById('start-button');
  const scoreDisplay = document.getElementById('score-display');
  const livesDisplay = document.getElementById('lives-display');
  
  // Game variables
  let score = 0;
  let lives = 3;
  let level = 1;
  let gameActive = false;
  let bricks = [];
  let animationId;
  
  // Ball properties
  const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 8,
    dx: 4,
    dy: -4,
    color: '#0095DD'
  };
  
  // Paddle properties
  const paddle = {
    width: 75,
    height: 10,
    x: (canvas.width - 75) / 2,
    y: canvas.height - 20,
    dx: 7,
    color: '#0095DD'
  };
  
  // Brick properties
  const brickRowCount = 5;
  const brickColumnCount = 8;
  const brickWidth = 50;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 25;
  const brickColors = ['#FF5252', '#FF8A80', '#FFAB40', '#FFECB3', '#CCFF90'];
  
  // Controls
  const keys = {
    right: false,
    left: false
  };
  
  // Event listeners
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      keys.right = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      keys.left = true;
    }
  });
  
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      keys.right = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      keys.left = false;
    }
  });
  
  // Mouse movement
  canvas.addEventListener('mousemove', (e) => {
    if (gameActive) {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
      }
    }
  });
  
  startButton.addEventListener('click', startGame);
  
  // Create bricks
  function createBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r] = { 
          x: brickX, 
          y: brickY, 
          status: 1, 
          color: brickColors[r],
          hits: level > 1 ? (level - 1) * (r + 1) % 3 : 1 // Higher levels have bricks requiring multiple hits
        };
      }
    }
  }
  
  // Draw ball
  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  }
  
  // Draw paddle
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.closePath();
  }
  
  // Draw bricks
  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status > 0) {
          // Adjust color based on hits remaining
          const opacity = bricks[c][r].hits > 1 ? 0.5 : 1;
          const brickColor = bricks[c][r].color;
          
          ctx.beginPath();
          ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
          ctx.fillStyle = brickColor;
          ctx.globalAlpha = opacity;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.strokeStyle = "#000";
          ctx.strokeRect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
          ctx.closePath();
        }
      }
    }
  }
  
  // Collision detection
  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status > 0) {
          if (ball.x > b.x && ball.x < b.x + brickWidth && 
              ball.y > b.y && ball.y < b.y + brickHeight) {
            ball.dy = -ball.dy;
            b.hits--;
            
            if (b.hits <= 0) {
              b.status = 0;
              score += (r + 1) * 10; // Higher rows worth more points
              scoreDisplay.textContent = "Score: " + score;
              
              // Check if level complete
              checkLevelComplete();
            }
            
            // Add particle effects (simplified)
            createParticles(ball.x, ball.y, b.color);
          }
        }
      }
    }
  }
  
  // Check if level is complete
  function checkLevelComplete() {
    let bricksRemaining = 0;
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status > 0) {
          bricksRemaining++;
        }
      }
    }
    
    if (bricksRemaining === 0) {
      levelUp();
    }
  }
  
  // Level up
  function levelUp() {
    level++;
    ball.dx *= 1.1; // Increase ball speed
    ball.dy *= 1.1;
    
    // Show level up message
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.textAlign = 'center';
    ctx.fillText("Level " + level + "!", canvas.width / 2, canvas.height / 2);
    
    // Pause briefly before starting next level
    gameActive = false;
    setTimeout(() => {
      ball.x = canvas.width / 2;
      ball.y = canvas.height - 30;
      paddle.x = (canvas.width - paddle.width) / 2;
      createBricks();
      gameActive = true;
      draw();
    }, 2000);
  }
  
  // Particle effects (simple)
  function createParticles(x, y, color) {
    // In a full version, this would create particle effects
    // Simplified version just for demonstration
  }
  
  // Draw everything
  function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawBricks();
    drawBall();
    drawPaddle();
    
    // Collision detection
    collisionDetection();
    
    // Ball movement and collisions
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
      ball.dx = -ball.dx;
    }
    
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        // Calculate bounce angle based on where ball hits paddle
        const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.dx = hitPos * 5; // Adjust angle based on hit position
        ball.dy = -Math.abs(ball.dy); // Always bounce up
      } else {
        lives--;
        livesDisplay.textContent = "Lives: " + lives;
        
        if (lives === 0) {
          gameOver();
          return;
        } else {
          ball.x = canvas.width / 2;
          ball.y = canvas.height - 30;
          ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
          ball.dy = -4;
          paddle.x = (canvas.width - paddle.width) / 2;
        }
      }
    }
    
    // Paddle movement
    if (keys.right && paddle.x < canvas.width - paddle.width) {
      paddle.x += paddle.dx;
    }
    if (keys.left && paddle.x > 0) {
      paddle.x -= paddle.dx;
    }
    
    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Continue animation
    if (gameActive) {
      animationId = requestAnimationFrame(draw);
    }
  }
  
  function startGame() {
    if (gameActive) return;
    
    // Reset game state
    score = 0;
    lives = 3;
    level = 1;
    
    // Reset ball and paddle
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 4;
    ball.dy = -4;
    paddle.x = (canvas.width - paddle.width) / 2;
    
    // Update display
    scoreDisplay.textContent = "Score: " + score;
    livesDisplay.textContent = "Lives: " + lives;
    
    // Create bricks
    createBricks();
    
    // Start game
    gameActive = true;
    cancelAnimationFrame(animationId);
    draw();
  }
  
  function gameOver() {
    gameActive = false;
    
    // Show game over message
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FF5252';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '18px Arial';
    ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Click Start to play again', canvas.width / 2, canvas.height / 2 + 40);
  }
  
  // Show initial instructions
  ctx.font = '24px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.textAlign = 'center';
  ctx.fillText('Brick Breaker', canvas.width / 2, canvas.height / 2 - 30);
  ctx.font = '16px Arial';
  ctx.fillText('Use arrow keys or mouse to move paddle', canvas.width / 2, canvas.height / 2);
  ctx.fillText('Click Start to begin', canvas.width / 2, canvas.height / 2 + 30);
});`,
    },
    difficulty: "beginner",
    featured: true,
    playUrl: "/play/breakout-game",
  },
  {
    id: "maze-game",
    title: "Maze Runner",
    description: "Navigate through procedurally generated mazes against the clock.",
    imageUrl: "/placeholder.svg",
    category: "puzzle",
    sourceCode: {
      html: `<div class="game-container">
  <canvas id="maze-canvas" width="500" height="500"></canvas>
  <div class="game-controls">
    <button id="start-btn">Start Game</button>
    <div id="timer">Time: 60s</div>
    <div id="level">Level: 1</div>
  </div>
</div>`,
      css: `.game-container {
  max-width: 500px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}
canvas {
  display: block;
  margin: 0 auto;
  background: #f8f8f8;
  border: 2px solid #333;
}
.game-controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #333;
  color: white;
}
button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
}`,
      js: `document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('maze-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-btn');
  const timerDisplay = document.getElementById('timer');
  const levelDisplay = document.getElementById('level');
  
  // Game variables
  let gameActive = false;
  let level = 1;
  let timeLeft = 60;
  let timer;
  let animationId;
  
  // Maze properties
  let cellSize = 25;
  let mazeWidth, mazeHeight;
  let maze = [];
  
  // Player properties
  const player = {
    x: cellSize + cellSize / 2,
    y: cellSize + cellSize / 2,
    size: cellSize * 0.6,
    color: '#4c6ef5'
  };
  
  // Exit position
  let exitX, exitY;
  
  // Controls
  const keys = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  
  // Event listeners
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.up = true;
    if (e.key === 'ArrowDown') keys.down = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
  });
  
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.up = false;
    if (e.key === 'ArrowDown') keys.down = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
  });
  
  startBtn.addEventListener('click', startGame);
  
  // Start the game
  function startGame() {
    if (gameActive) return;
    
    // Reset game state
    level = 1;
    timeLeft = 60;
    
    // Update display
    levelDisplay.textContent = "Level: " + level;
    timerDisplay.textContent = "Time: " + timeLeft + "s";
    
    // Create maze
    generateMaze();
    
    // Place player at start
    player.x = cellSize + cellSize / 2;
    player.y = cellSize + cellSize / 2;
    
    // Start game
    gameActive = true;
    
    // Start timer
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    
    // Start game loop
    cancelAnimationFrame(animationId);
    gameLoop();
  }
  
  // Generate a random maze using DFS algorithm
  function generateMaze() {
    // Calculate maze dimensions based on cell size
    mazeWidth = Math.floor(canvas.width / cellSize);
    mazeHeight = Math.floor(canvas.height / cellSize);
    
    // Initialize maze grid with walls (1 = wall, 0 = path)
    maze = Array(mazeHeight).fill().map(() => Array(mazeWidth).fill(1));
    
    // Start with all walls, then carve paths
    const stack = [];
    // Start at (1,1) to ensure border walls
    let currentX = 1;
    let currentY = 1;
    maze[currentY][currentX] = 0; // Mark as path
    
    stack.push({x: currentX, y: currentY});
    
    // Directions: up, right, down, left
    const directions = [
      {dx: 0, dy: -2},
      {dx: 2, dy: 0},
      {dx: 0, dy: 2},
      {dx: -2, dy: 0}
    ];
    
    // DFS to generate maze
    while (stack.length > 0) {
      // Get current cell
      let cell = stack[stack.length - 1];
      
      // Find unvisited neighbors
      let unvisitedNeighbors = [];
      
      for (let dir of directions) {
        let nx = cell.x + dir.dx;
        let ny = cell.y + dir.dy;
        
        // Check if neighbor is within bounds and unvisited
        if (nx > 0 && nx < mazeWidth - 1 && ny > 0 && ny < mazeHeight - 1 && maze[ny][nx] === 1) {
          unvisitedNeighbors.push({x: nx, y: ny, dx: dir.dx, dy: dir.dy});
        }
      }
      
      // If no unvisited neighbors, backtrack
      if (unvisitedNeighbors.length === 0) {
        stack.pop();
        continue;
      }
      
      // Choose a random unvisited neighbor
      let randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
      let next = unvisitedNeighbors[randomIndex];
      
      // Remove wall between current and neighbor
      maze[cell.y + next.dy / 2][cell.x + next.dx / 2] = 0;
      
      // Mark neighbor as visited
      maze[next.y][next.x] = 0;
      
      // Add neighbor to stack
      stack.push({x: next.x, y: next.y});
    }
    
    // Set exit point at bottom right
    exitX = mazeWidth - 2;
    exitY = mazeHeight - 2;
    maze[exitY][exitX] = 0;
    
    // Ensure there's a path to the exit
    maze[exitY][exitX - 1] = 0;
    maze[exitY - 1][exitX] = 0;
  }
  
  // Draw the maze
  function drawMaze() {
    for (let y = 0; y < mazeHeight; y++) {
      for (let x = 0; x < mazeWidth; x++) {
        if (maze[y][x] === 1) {
          // Draw wall
          ctx.fillStyle = '#333';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Draw exit
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(exitX * cellSize + cellSize / 2, exitY * cellSize + cellSize / 2, 
            cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw the player
  function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Update timer
  function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = "Time: " + timeLeft + "s";
    
    if (timeLeft <= 0) {
      gameOver(false);
    }
  }
  
  // Update player position
  function updatePlayer() {
    const speed = 3;
    let nextX = player.x;
    let nextY = player.y;
    
    if (keys.up) nextY -= speed;
    if (keys.down) nextY += speed;
    if (keys.left) nextX -= speed;
    if (keys.right) nextX += speed;
    
    // Check if movement is valid (no wall collision)
    if (!checkWallCollision(nextX, nextY)) {
      player.x = nextX;
      player.y = nextY;
    }
    
    // Check if player reached exit
    checkExit();
  }
  
  // Check for wall collision
  function checkWallCollision(x, y) {
    // Calculate grid position from player position
    const size = player.size / 2;
    
    // Check each corner of the player
    const corners = [
      {x: x - size, y: y - size}, // Top left
      {x: x + size, y: y - size}, // Top right
      {x: x - size, y: y + size}, // Bottom left
      {x: x + size, y: y + size}  // Bottom right
    ];
    
    for (let corner of corners) {
      const gridX = Math.floor(corner.x / cellSize);
      const gridY = Math.floor(corner.y / cellSize);
      
      // Check if out of bounds or hitting a wall
      if (gridX < 0 || gridY < 0 || gridX >= mazeWidth || gridY >= mazeHeight || maze[gridY][gridX] === 1) {
        return true;
      }
    }
    
    return false;
  }
  
  // Check if player reached the exit
  function checkExit() {
    const exitCenterX = exitX * cellSize + cellSize / 2;
    const exitCenterY = exitY * cellSize + cellSize / 2;
    
    const distance = Math.sqrt(Math.pow(player.x - exitCenterX, 2) + 
                               Math.pow(player.y - exitCenterY, 2));
    
    if (distance < cellSize / 2) {
      levelComplete();
    }
  }
  
  // Level complete
  function levelComplete() {
    level++;
    timeLeft = 60 - level * 5; // Reduce time each level
    
    // Minimum time of 15 seconds
    if (timeLeft < 15) {
      timeLeft = 15;
    }
    
    // Update display
    levelDisplay.textContent = "Level: " + level;
    timerDisplay.textContent = "Time: " + timeLeft + "s";
    
    // Generate new maze
    cellSize = Math.max(15, 25 - level); // Make maze more complex each level
    generateMaze();
    
    // Reset player position
    player.x = cellSize + cellSize / 2;
    player.y = cellSize + cellSize / 2;
    player.size = cellSize * 0.6;
  }
  
  // Game over
  function gameOver(win = false) {
    gameActive = false;
    clearInterval(timer);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Display game over message
    ctx.fillStyle = win ? '#4CAF50' : '#FF5252';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(win ? 'You Win!' : 'Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '20px Arial';
    ctx.fillText("Reached Level: " + level, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Click Start to play again', canvas.width / 2, canvas.height / 2 + 60);
  }
  
  // Game loop
  function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw maze
    drawMaze();
    
    // Update and draw player
    updatePlayer();
    drawPlayer();
    
    // Continue animation
    if (gameActive) {
      animationId = requestAnimationFrame(gameLoop);
    }
  }
  
  // Show initial instructions
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Maze Runner', canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = '16px Arial';
  ctx.fillText('Use arrow keys to navigate the maze', canvas.width / 2, canvas.height / 2);
  ctx.fillText('Reach the green exit before time runs out', canvas.width / 2, canvas.height / 2 + 30);
  ctx.fillText('Click Start to begin', canvas.width / 2, canvas.height / 2 + 60);
});`,
    },
    difficulty: "intermediate",
    playUrl: "/play/maze-game",
  },
  {
    id: "flappy-bird",
    title: "Flappy Bird Clone",
    description: "Navigate a bird through pipes in this popular arcade-style game.",
    imageUrl: "/placeholder.svg",
    category: "arcade",
    sourceCode: {
      html: `<div class="game-container">
  <canvas id="flappy-canvas" width="320" height="480"></canvas>
  <div class="game-controls">
    <button id="start-btn">Start Game</button>
    <div id="score">Score: 0</div>
    <div id="high-score">High Score: 0</div>
  </div>
  <div class="instructions">
    Press Space or Tap to Flap
  </div>
</div>`,
      css: `.game-container {
  max-width: 320px;
  margin: 0 auto;
  font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
}
canvas {
  display: block;
  margin: 0 auto;
  background: #70c5ce;
  border: 2px solid #333;
}
.game-controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #333;
  color: white;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
button {
  background: #f7dc6f;
  color: #333;
  border: none;
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.instructions {
  text-align: center;
  padding: 10px;
  font-size: 14px;
  color: #555;
}`,
      js: `document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('flappy-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-btn');
  const scoreDisplay = document.getElementById('score');
  const highScoreDisplay = document.getElementById('high-score');
  
  // Game variables
  let frames = 0;
  let gameActive = false;
  let score = 0;
  let highScore = 0;
  let animationId;
  
  // Retrieve high score from local storage
  const storedHighScore = localStorage.getItem('flappyHighScore');
  if (storedHighScore) {
    highScore = parseInt(storedHighScore);
    highScoreDisplay.textContent = "High Score: " + highScore;
  }
  
  // Bird properties
  const bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.5,
    jump: 8,
    velocity: 0,
    rotation: 0,
    
    update: function() {
      // Apply gravity
      this.velocity += this.gravity;
      this.y += this.velocity;
      
      // Rotation based on velocity
      if (this.velocity >= this.jump) {
        this.rotation = 90 * Math.PI / 180;
      } else {
        this.rotation = -25 * Math.PI / 180;
      }
      
      // Check ground collision
      if (this.y + this.height >= canvas.height - ground.height) {
        this.y = canvas.height - ground.height - this.height;
        gameOver();
      }
      
      // Check ceiling collision
      if (this.y <= 0) {
        this.y = 0;
        this.velocity = 0;
      }
    },
    
    flap: function() {
      this.velocity = -this.jump;
    },
    
    draw: function() {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.rotation);
      
      // Draw bird body
      ctx.fillStyle = '#f7dc6f'; // Yellow
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw wing
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 5, 12, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(8, -5, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw beak
      ctx.fillStyle = '#e67e22';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(22, -3);
      ctx.lineTo(22, 3);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  };
  
  // Pipe properties
  const pipes = {
    position: [],
    gap: 130,
    minYPos: 50,
    maxYPos: 320,
    width: 52,
    
    update: function() {
      // Add new pipes every 100 frames
      if (frames % 100 === 0) {
        const yPos = Math.floor(Math.random() * (this.maxYPos - this.minYPos)) + this.minYPos;
        
        this.position.push({
          x: canvas.width,
          y: yPos,
          passed: false
        });
      }
      
      // Update pipe positions
      for (let i = 0; i < this.position.length; i++) {
        // Move pipes left
        this.position[i].x -= 2;
        
        // Check if bird passed pipe
        if (!this.position[i].passed && bird.x > this.position[i].x + this.width) {
          score++;
          scoreDisplay.textContent = "Score: " + score;
          this.position[i].passed = true;
        }
        
        // Check for collision
        if (checkCollision(bird, this.position[i])) {
          gameOver();
        }
        
        // Remove pipes that move off screen
        if (this.position[i].x + this.width < 0) {
          this.position.splice(i, 1);
          i--;
        }
      }
    },
    
    draw: function() {
      for (let i = 0; i < this.position.length; i++) {
        const p = this.position[i];
        
        // Draw top pipe
        ctx.fillStyle = '#558b2f'; // Green
        ctx.fillRect(p.x, 0, this.width, p.y);
        
        // Pipe cap (top)
        ctx.fillStyle = '#33691e'; // Darker green
        ctx.fillRect(p.x - 3, p.y - 10, this.width + 6, 10);
        
        // Draw bottom pipe
        ctx.fillStyle = '#558b2f'; // Green
        ctx.fillRect(p.x, p.y + this.gap, this.width, canvas.height - ground.height - (p.y + this.gap));
        
        // Pipe cap (bottom)
        ctx.fillStyle = '#33691e'; // Darker green
        ctx.fillRect(p.x - 3, p.y + this.gap, this.width + 6, 10);
      }
    }
  };
  
  // Ground properties
  const ground = {
    y: canvas.height - 60,
    height: 60,
    
    draw: function() {
      ctx.fillStyle = '#795548'; // Brown
      ctx.fillRect(0, this.y, canvas.width, this.height);
      
      // Grass
      ctx.fillStyle = '#8bc34a';
      ctx.fillRect(0, this.y, canvas.width, 5);
    }
  };
  
  // Background properties
  const background = {
    draw: function() {
      // Sky
      ctx.fillStyle = '#70c5ce';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Clouds
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(80, 80, 20, 0, Math.PI * 2);
      ctx.arc(100, 70, 25, 0, Math.PI * 2);
      ctx.arc(120, 85, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(250, 100, 25, 0, Math.PI * 2);
      ctx.arc(280, 90, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  // Check for collision between bird and pipe
  function checkCollision(bird, pipe) {
    // Check if bird hits top pipe
    const birdTop = bird.y;
    const birdBottom = bird.y + bird.height;
    const birdLeft = bird.x;
    const birdRight = bird.x + bird.width;
    
    const pipeTop = pipe.y;
    const pipeBottom = pipe.y + pipes.gap;
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + pipes.width;
    
    // Reduce collision area slightly for more forgiving gameplay
    const collisionBuffer = 5;
    
    // Check collision with top pipe
    if (birdRight - collisionBuffer > pipeLeft && 
        birdLeft + collisionBuffer < pipeRight && 
        birdBottom - collisionBuffer > 0 && 
        birdTop + collisionBuffer < pipeTop) {
      return true;
    }
    
    // Check collision with bottom pipe
    if (birdRight - collisionBuffer > pipeLeft && 
        birdLeft + collisionBuffer < pipeRight && 
        birdBottom - collisionBuffer > pipeBottom && 
        birdTop + collisionBuffer < canvas.height - ground.height) {
      return true;
    }
    
    return false;
  }
  
  // Reset game state
  function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    bird.rotation = 0;
    pipes.position = [];
    score = 0;
    frames = 0;
    
    scoreDisplay.textContent = 'Score: 0';
  }
  
  // Game over
  function gameOver() {
    gameActive = false;
    
    // Update high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('flappyHighScore', highScore);
      highScoreDisplay.textContent = "High Score: " + highScore;
    }
    
    // Stop animation
    cancelAnimationFrame(animationId);
    
    // Display game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 30);
    
    ctx.font = '20px Arial';
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 50);
  }
  
  // Start game
  function startGame() {
    if (gameActive) return;
    
    resetGame();
    gameActive = true;
    gameLoop();
  }
  
  // Game loop
  function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update frames
    frames++;
    
    // Draw background
    background.draw();
    
    // Update and draw pipes
    pipes.update();
    pipes.draw();
    
    // Draw ground
    ground.draw();
    
    // Update and draw bird
    bird.update();
    bird.draw();
    
    // Continue game loop
    if (gameActive) {
      animationId = requestAnimationFrame(gameLoop);
    }
  }
  
  // Event listeners
  startBtn.addEventListener('click', startGame);
  
  // Space bar or tap to flap
  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && gameActive) {
      bird.flap();
    }
  });
  
  canvas.addEventListener('click', function() {
    if (gameActive) {
      bird.flap();
    }
  });
  
  // Show initial instructions
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Flappy Bird', canvas.width / 2, canvas.height / 2 - 50);
  
  ctx.font = '16px Arial';
  ctx.fillText('Press Space or Tap to flap', canvas.width / 2, canvas.height / 2);
  ctx.fillText('Avoid the pipes and', canvas.width / 2, canvas.height / 2 + 30);
  ctx.fillText('don\\'t hit the ground!', canvas.width / 2, canvas.height / 2 + 50);
  ctx.fillText('Click Start to begin', canvas.width / 2, canvas.height / 2 + 80);
});`,
    },
    difficulty: "beginner",
    featured: true,
    playUrl: "/play/flappy-bird",
  }
];

