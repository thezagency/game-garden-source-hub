
import { Game } from "../types";

export const games: Game[] = [
  {
    id: "snake-game",
    title: "Snake Game",
    description: "Classic snake game where you control a snake to eat food and grow longer.",
    imageUrl: "/placeholder.svg",
    category: "arcade",
    sourceCode: {
      html: `<!-- Snake Game HTML Structure -->
<div class="game-container">
  <canvas id="snake-canvas" width="400" height="400"></canvas>
  <div class="game-controls">
    <button id="start-btn">Start Game</button>
    <div class="score">Score: <span id="score">0</span></div>
  </div>
</div>`,
      css: `/* Snake Game Styling */
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  max-width: 500px;
}

canvas {
  border: 2px solid #333;
  background: #222;
}

.game-controls {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  width: 400px;
}

button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.score {
  font-size: 1.2em;
}`,
      js: `// Snake Game Logic
document.addEventListener('DOMContentLoaded', () => {
  // Game canvas setup
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  
  // Game variables
  const gridSize = 20;
  let snake = [
    {x: 10, y: 10}
  ];
  let food = generateFood();
  let direction = 'right';
  let gameSpeed = 100;
  let gameLoop;
  let score = 0;
  
  // Generate random food position
  function generateFood() {
    // Random position that doesn't collide with snake
    return {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
  }
  
  // Draw the snake on canvas
  function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
  }
  
  // Draw food on canvas
  function drawFood() {
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }
  
  // Move the snake
  function moveSnake() {
    // Create new head based on direction
    const head = {...snake[0]};
    switch(direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }
    
    // Add new head to beginning
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      // Generate new food and increase score
      food = generateFood();
      score += 10;
      document.getElementById('score').textContent = score;
    } else {
      // Remove tail if no food eaten
      snake.pop();
    }
  }
  
  // Check for collisions
  function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.y < 0 || 
        head.x >= canvas.width / gridSize || 
        head.y >= canvas.height / gridSize) {
      return true;
    }
    
    // Self collision (check if head collides with any segment)
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    
    return false;
  }
  
  // Game loop function
  function gameUpdate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Move and draw
    moveSnake();
    
    // Check for collision
    if (checkCollision()) {
      clearInterval(gameLoop);
      alert('Game Over! Score: ' + score);
      return;
    }
    
    drawFood();
    drawSnake();
  }
  
  // Handle keyboard input
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowUp': 
        if (direction !== 'down') direction = 'up';
        break;
      case 'ArrowDown': 
        if (direction !== 'up') direction = 'down';
        break;
      case 'ArrowLeft': 
        if (direction !== 'right') direction = 'left';
        break;
      case 'ArrowRight': 
        if (direction !== 'left') direction = 'right';
        break;
    }
  });
  
  // Start button event listener
  document.getElementById('start-btn').addEventListener('click', () => {
    // Reset game state
    clearInterval(gameLoop);
    snake = [{x: 10, y: 10}];
    direction = 'right';
    score = 0;
    document.getElementById('score').textContent = score;
    food = generateFood();
    
    // Start game loop
    gameLoop = setInterval(gameUpdate, gameSpeed);
  });
});`,
    },
    difficulty: "beginner",
    featured: true,
    playUrl: "#/play/snake-game",
  },
  {
    id: "tetris-game",
    title: "Tetris",
    description: "A classic block-stacking puzzle game where you arrange falling tetrominos.",
    imageUrl: "/placeholder.svg",
    category: "puzzle",
    sourceCode: {
      ts: `// Tetris Game in TypeScript
interface Position {
  x: number;
  y: number;
}

interface Tetromino {
  shape: number[][];
  position: Position;
  color: string;
}

class TetrisGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private grid: string[][];
  private currentPiece: Tetromino | null = null;
  private score: number = 0;
  private gameOver: boolean = false;
  private gameLoop: number | null = null;
  
  // Tetromino shapes represented as matrices
  private readonly shapes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]]  // Z
  ];
  
  private readonly colors = [
    '#00FFFF', // Cyan (I)
    '#FFFF00', // Yellow (O)
    '#800080', // Purple (T)
    '#FFA500', // Orange (L)
    '#0000FF', // Blue (J)
    '#00FF00', // Green (S)
    '#FF0000'  // Red (Z)
  ];
  
  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Initialize empty grid (10x20)
    this.grid = Array(20).fill(null).map(() => Array(10).fill(''));
    
    this.setupEventListeners();
  }
  
  start(): void {
    if (this.gameLoop) return;
    
    this.grid = Array(20).fill(null).map(() => Array(10).fill(''));
    this.score = 0;
    this.gameOver = false;
    this.spawnPiece();
    
    this.gameLoop = window.setInterval(() => this.update(), 500);
    this.updateScore();
  }
  
  private spawnPiece(): void {
    // Randomly select a tetromino
    const shapeIndex = Math.floor(Math.random() * this.shapes.length);
    
    this.currentPiece = {
      shape: this.shapes[shapeIndex],
      position: { 
        x: Math.floor((10 - this.shapes[shapeIndex][0].length) / 2),
        y: 0
      },
      color: this.colors[shapeIndex]
    };
    
    // Check if piece can be placed
    if (!this.isValidMove(this.currentPiece)) {
      this.gameOver = true;
      if (this.gameLoop) clearInterval(this.gameLoop);
      alert('Game Over! Score: ' + this.score);
    }
  }
  
  private draw(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw grid
    const cellSize = this.canvas.width / 10;
    
    // Draw placed pieces
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x]) {
          this.ctx.fillStyle = this.grid[y][x];
          this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          this.ctx.strokeStyle = '#000';
          this.ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Draw current piece
    if (this.currentPiece) {
      this.ctx.fillStyle = this.currentPiece.color;
      for (let y = 0; y < this.currentPiece.shape.length; y++) {
        for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
          if (this.currentPiece.shape[y][x]) {
            const posX = (this.currentPiece.position.x + x) * cellSize;
            const posY = (this.currentPiece.position.y + y) * cellSize;
            this.ctx.fillRect(posX, posY, cellSize, cellSize);
            this.ctx.strokeStyle = '#000';
            this.ctx.strokeRect(posX, posY, cellSize, cellSize);
          }
        }
      }
    }
  }
  
  private update(): void {
    if (this.gameOver || !this.currentPiece) return;
    
    // Try to move piece down
    const movedPiece = {
      ...this.currentPiece,
      position: {
        ...this.currentPiece.position,
        y: this.currentPiece.position.y + 1
      }
    };
    
    if (this.isValidMove(movedPiece)) {
      this.currentPiece = movedPiece;
    } else {
      // Lock piece in place
      this.placePiece();
      
      // Check for completed rows
      const linesCleared = this.clearLines();
      this.score += linesCleared * 100;
      this.updateScore();
      
      // Spawn new piece
      this.spawnPiece();
    }
    
    this.draw();
  }
  
  private isValidMove(piece: Tetromino): boolean {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.position.x + x;
          const newY = piece.position.y + y;
          
          // Check boundaries
          if (newX < 0 || newX >= 10 || newY >= 20) {
            return false;
          }
          
          // Check collision with placed pieces
          if (newY >= 0 && this.grid[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  private placePiece(): void {
    if (!this.currentPiece) return;
    
    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        if (this.currentPiece.shape[y][x]) {
          const gridY = this.currentPiece.position.y + y;
          const gridX = this.currentPiece.position.x + x;
          
          if (gridY >= 0) {
            this.grid[gridY][gridX] = this.currentPiece.color;
          }
        }
      }
    }
  }
  
  private clearLines(): number {
    let linesCleared = 0;
    
    for (let y = this.grid.length - 1; y >= 0; y--) {
      // Check if row is completely filled
      if (this.grid[y].every(cell => cell !== '')) {
        // Remove the row
        this.grid.splice(y, 1);
        // Add empty row at top
        this.grid.unshift(Array(10).fill(''));
        linesCleared++;
        y++; // Check the same index again
      }
    }
    
    return linesCleared;
  }
  
  private rotate(): void {
    if (!this.currentPiece) return;
    
    // Create rotated shape matrix
    const rotated = Array(this.currentPiece.shape[0].length)
      .fill(null)
      .map(() => Array(this.currentPiece.shape.length).fill(0));
    
    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        rotated[x][this.currentPiece.shape.length - 1 - y] = this.currentPiece.shape[y][x];
      }
    }
    
    const rotatedPiece = {
      ...this.currentPiece,
      shape: rotated
    };
    
    if (this.isValidMove(rotatedPiece)) {
      this.currentPiece = rotatedPiece;
    }
  }
  
  private moveHorizontal(direction: number): void {
    if (!this.currentPiece) return;
    
    const movedPiece = {
      ...this.currentPiece,
      position: {
        ...this.currentPiece.position,
        x: this.currentPiece.position.x + direction
      }
    };
    
    if (this.isValidMove(movedPiece)) {
      this.currentPiece = movedPiece;
      this.draw();
    }
  }
  
  private hardDrop(): void {
    if (!this.currentPiece) return;
    
    // Move piece down until collision
    while (this.isValidMove({
      ...this.currentPiece,
      position: {
        ...this.currentPiece.position,
        y: this.currentPiece.position.y + 1
      }
    })) {
      this.currentPiece.position.y++;
    }
    
    // Update immediately
    this.update();
  }
  
  private updateScore(): void {
    const scoreElement = document.getElementById('tetris-score');
    if (scoreElement) {
      scoreElement.textContent = this.score.toString();
    }
  }
  
  private setupEventListeners(): void {
    document.addEventListener('keydown', (e) => {
      if (this.gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          this.moveHorizontal(-1);
          break;
        case 'ArrowRight':
          this.moveHorizontal(1);
          break;
        case 'ArrowDown':
          this.update();
          break;
        case 'ArrowUp':
          this.rotate();
          this.draw();
          break;
        case ' ':
          this.hardDrop();
          break;
      }
    });
    
    // Start button
    const startButton = document.getElementById('tetris-start');
    if (startButton) {
      startButton.addEventListener('click', () => this.start());
    }
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new TetrisGame('tetris-canvas');
  
  // Add game instructions
  const instructions = document.createElement('div');
  instructions.className = 'instructions';
  instructions.innerHTML = \`
    <h3>Controls:</h3>
    <p>← → : Move horizontally</p>
    <p>↑ : Rotate</p>
    <p>↓ : Move down</p>
    <p>Space : Hard drop</p>
  \`;
  
  document.querySelector('.game-container')?.appendChild(instructions);
});`,
    },
    difficulty: "intermediate",
    featured: true,
    playUrl: "#/play/tetris-game",
  },
  {
    id: "memory-game",
    title: "Memory Match",
    description: "Test your memory by matching pairs of cards in this concentration game.",
    imageUrl: "/placeholder.svg",
    category: "puzzle",
    sourceCode: {
      html: `<!-- Memory Game HTML Structure -->
<div class="game-container">
  <div class="game-header">
    <h2>Memory Match</h2>
    <div class="game-stats">
      <div class="moves">Moves: <span id="moves-count">0</span></div>
      <div class="timer">Time: <span id="timer">0</span>s</div>
    </div>
    <button id="restart">Restart</button>
  </div>
  <div id="memory-game" class="memory-board"></div>
</div>`,
      css: `/* Memory Game Styling */
.game-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.memory-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.memory-card {
  height: 120px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  cursor: pointer;
}

.memory-card.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  width: 100%;
  height: 100%;
  padding: 10px;
  position: absolute;
  border-radius: 5px;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-front {
  background-color: #2980b9;
  transform: rotateY(180deg);
  font-size: 2rem;
}

.card-back {
  background-color: #3498db;
  background-image: linear-gradient(315deg, #3498db 0%, #2c3e50 74%);
}

button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.disabled {
  pointer-events: none;
}

.matched .card-front {
  background-color: #27ae60;
}

@media (max-width: 600px) {
  .memory-board {
    grid-template-columns: repeat(3, 1fr);
  }
  .memory-card {
    height: 100px;
  }
}`,
      js: `// Memory Game Logic
document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('memory-game');
  const movesDisplay = document.getElementById('moves-count');
  const timerDisplay = document.getElementById('timer');
  const restartButton = document.getElementById('restart');
  
  let cards = [];
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let moves = 0;
  let timer = 0;
  let timerInterval;
  let matches = 0;
  
  // Card symbols (can be emojis or icons)
  const cardSymbols = [
    '🍎', '🍎',
    '🍌', '🍌',
    '🍒', '🍒',
    '🍓', '🍓',
    '🍕', '🍕',
    '🍩', '🍩',
    '🍺', '🍺',
    '🎮', '🎮'
  ];
  
  // Initialize game
  function initGame() {
    // Reset variables
    moves = 0;
    timer = 0;
    matches = 0;
    movesDisplay.textContent = moves;
    timerDisplay.textContent = timer;
    clearInterval(timerInterval);
    gameBoard.innerHTML = '';
    
    // Shuffle card symbols
    const shuffledCards = shuffleArray([...cardSymbols]);
    
    // Create cards and add to board
    shuffledCards.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.symbol = symbol;
      
      card.innerHTML = \`
        <div class="card-front">\${symbol}</div>
        <div class="card-back"></div>
      \`;
      
      card.addEventListener('click', flipCard);
      gameBoard.appendChild(card);
    });
    
    // Start timer
    startTimer();
  }
  
  // Fisher-Yates shuffle algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Card flip logic
  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    
    this.classList.add('flipped');
    
    if (!hasFlippedCard) {
      // First card flipped
      hasFlippedCard = true;
      firstCard = this;
      return;
    }
    
    // Second card flipped
    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;
    
    checkForMatch();
  }
  
  // Check if the two flipped cards match
  function checkForMatch() {
    const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
    
    if (isMatch) {
      disableCards();
      matches++;
      
      // Check if all matches found
      if (matches === cardSymbols.length / 2) {
        setTimeout(() => {
          clearInterval(timerInterval);
          alert(\`Congratulations! You completed the game in \${moves} moves and \${timer} seconds.\`);
        }, 500);
      }
    } else {
      unflipCards();
    }
  }
  
  // Disable matched cards
  function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
  }
  
  // Unflip non-matching cards
  function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      
      resetBoard();
    }, 1000);
  }
  
  // Reset board state
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }
  
  // Start timer function
  function startTimer() {
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = timer;
    }, 1000);
  }
  
  // Restart button event listener
  restartButton.addEventListener('click', initGame);
  
  // Initialize game on load
  initGame();
});`,
    },
    difficulty: "beginner",
    playUrl: "#/play/memory-game",
  },
  {
    id: "platformer-game",
    title: "Mini Platformer",
    description: "A simple platformer game where you navigate through obstacles.",
    imageUrl: "/placeholder.svg",
    category: "action",
    sourceCode: {
      html: `<!-- Platformer Game HTML Structure -->
<div class="game-container">
  <canvas id="platformer-canvas" width="800" height="400"></canvas>
  <div class="game-controls">
    <button id="start-btn">Start Game</button>
    <div class="instructions">
      Use ← → to move, Space to jump
    </div>
  </div>
</div>`,
      js: `// Platformer Game Logic
document.addEventListener('DOMContentLoaded', () => {
  // Game setup
  const canvas = document.getElementById('platformer-canvas');
  const ctx = canvas.getContext('2d');
  const startButton = document.getElementById('start-btn');
  
  // Game variables
  const gravity = 0.5;
  let gameRunning = false;
  let gameLoop;
  
  // Player object
  const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 40,
    jumping: false,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: -12,
    color: '#4285F4'
  };
  
  // Platforms
  const platforms = [
    { x: 0, y: 350, width: 800, height: 50, color: '#34A853' },  // Ground
    { x: 200, y: 250, width: 100, height: 20, color: '#FBBC05' },
    { x: 400, y: 200, width: 100, height: 20, color: '#FBBC05' },
    { x: 600, y: 150, width: 100, height: 20, color: '#FBBC05' },
    { x: 150, y: 300, width: 50, height: 20, color: '#FBBC05' }
  ];
  
  // Collectible coins
  const coins = [
    { x: 220, y: 220, width: 15, height: 15, collected: false, color: '#FFD700' },
    { x: 420, y: 170, width: 15, height: 15, collected: false, color: '#FFD700' },
    { x: 620, y: 120, width: 15, height: 15, collected: false, color: '#FFD700' }
  ];
  
  // Score tracking
  let score = 0;
  
  // Controls
  let keys = {
    left: false,
    right: false,
    up: false
  };
  
  // Input handling
  function setupControls() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') keys.left = true;
      if (e.key === 'ArrowRight') keys.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp') keys.up = true;
    });
    
    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') keys.left = false;
      if (e.key === 'ArrowRight') keys.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp') keys.up = false;
    });
  }
  
  // Check for collision between two rectangles
  function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }
  
  // Update game state
  function update() {
    // Apply gravity
    player.velocityY += gravity;
    
    // Handle controls
    if (keys.left) player.velocityX = -player.speed;
    else if (keys.right) player.velocityX = player.speed;
    else player.velocityX = 0;
    
    // Handle jumping
    if (keys.up && !player.jumping) {
      player.velocityY = player.jumpPower;
      player.jumping = true;
    }
    
    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Handle platform collisions
    player.jumping = true; // Reset jumping status
    
    for (let platform of platforms) {
      // Check if player is on top of platform
      if (player.velocityY > 0 &&
          player.y + player.height <= platform.y + 5 &&
          player.y + player.height + player.velocityY >= platform.y &&
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.width) {
        
        player.jumping = false;
        player.velocityY = 0;
        player.y = platform.y - player.height;
      }
      
      // Check for side collisions with platforms
      if (player.x + player.width > platform.x &&
          player.x < platform.x + platform.width &&
          player.y + player.height > platform.y &&
          player.y < platform.y + platform.height) {
        
        // Left or right collision
        if (player.velocityX > 0) {
          player.x = platform.x - player.width;
        } else if (player.velocityX < 0) {
          player.x = platform.x + platform.width;
        }
      }
    }
    
    // Handle coin collection
    for (let coin of coins) {
      if (!coin.collected && checkCollision(player, coin)) {
        coin.collected = true;
        score += 10;
      }
    }
    
    // Handle boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    
    // Check game over (falling off bottom)
    if (player.y > canvas.height) {
      gameOver();
    }
    
    // Check win condition (all coins collected)
    if (coins.every(coin => coin.collected)) {
      gameWin();
    }
  }
  
  // Draw game elements
  function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sky background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw platforms
    for (let platform of platforms) {
      ctx.fillStyle = platform.color;
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw coins
    for (let coin of coins) {
      if (!coin.collected) {
        ctx.fillStyle = coin.color;
        ctx.beginPath();
        ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 20, 30);
  }
  
  // Game loop
  function gameLoop() {
    if (!gameRunning) return;
    
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
  
  // Game over
  function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width/2 - 100, canvas.height/2);
    
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, canvas.width/2 - 50, canvas.height/2 + 40);
    ctx.fillText('Press Start to play again', canvas.width/2 - 100, canvas.height/2 + 70);
  }
  
  // Game win
  function gameWin() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText('You Win!', canvas.width/2 - 80, canvas.height/2);
    
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, canvas.width/2 - 50, canvas.height/2 + 40);
    ctx.fillText('Press Start to play again', canvas.width/2 - 100, canvas.height/2 + 70);
  }
  
  // Start game
  function startGame() {
    // Reset game state
    player.x = 50;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    player.jumping = false;
    
    score = 0;
    
    // Reset coins
    for (let coin of coins) {
      coin.collected = false;
    }
    
    // Start game loop
    gameRunning = true;
    gameLoop();
  }
  
  // Initialize game
  function init() {
    setupControls();
    draw(); // Draw initial state
    
    startButton.addEventListener('click', startGame);
  }
  
  // Start initialization when document is loaded
  init();
});`,
    },
    difficulty: "intermediate",
    playUrl: "#/play/platformer-game",
  },
  {
    id: "quiz-game",
    title: "Quiz Challenge",
    description: "Test your knowledge with this interactive quiz game.",
    imageUrl: "/placeholder.svg",
    category: "puzzle",
    sourceCode: {
      html: `<!-- Quiz Game HTML Structure -->
<div class="quiz-container">
  <div class="quiz-header">
    <h2 id="quiz-title">Coding Quiz Challenge</h2>
    <div class="quiz-stats">
      <div id="quiz-score">Score: 0</div>
      <div id="quiz-question-number">Question: 1/10</div>
    </div>
  </div>
  
  <div class="quiz-content">
    <div id="question-container">
      <h3 id="question-text">Question text will appear here</h3>
      <div id="answers-container">
        <!-- Answer buttons will be generated here -->
      </div>
    </div>
    
    <div id="result-container" class="hidden">
      <h2>Quiz Complete!</h2>
      <div id="final-score">Your score: 0/10</div>
      <div id="feedback">Well done!</div>
      <button id="restart-button">Play Again</button>
    </div>
  </div>
</div>`,
      css: `/* Quiz Game Styling */
.quiz-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.quiz-content {
  padding: 20px 0;
}

#question-text {
  font-size: 1.3rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

#answers-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-button {
  padding: 15px;
  border: 1px solid #ddd;
  background-color: #f7f7f7;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.answer-button:hover {
  background-color: #eaeaea;
}

.answer-button.correct {
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.answer-button.incorrect {
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.answer-button.selected {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

#result-container {
  text-align: center;
  padding: 20px 0;
}

#final-score {
  font-size: 1.5rem;
  margin: 20px 0;
}

#feedback {
  margin-bottom: 20px;
  font-size: 1.2rem;
}

#restart-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.hidden {
  display: none;
}`,
      js: `// Quiz Game Logic
document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const questionContainer = document.getElementById('question-container');
  const resultContainer = document.getElementById('result-container');
  const questionText = document.getElementById('question-text');
  const answersContainer = document.getElementById('answers-container');
  const scoreDisplay = document.getElementById('quiz-score');
  const questionNumberDisplay = document.getElementById('quiz-question-number');
  const finalScoreDisplay = document.getElementById('final-score');
  const feedbackDisplay = document.getElementById('feedback');
  const restartButton = document.getElementById('restart-button');
  
  // Quiz state
  let currentQuestion = 0;
  let score = 0;
  let quizCompleted = false;
  
  // Quiz questions
  const questions = [
    {
      question: "Which of the following is NOT a JavaScript data type?",
      answers: [
        "String",
        "Boolean",
        "Float",
        "Object"
      ],
      correctAnswer: 2 // Float (JavaScript has Number, not separate Float)
    },
    {
      question: "Which HTML tag is used to create an unordered list?",
      answers: [
        "<ol>",
        "<ul>",
        "<li>",
        "<list>"
      ],
      correctAnswer: 1 // <ul>
    },
    {
      question: "In CSS, which property is used to change the text color?",
      answers: [
        "text-color",
        "font-color",
        "color",
        "text-style"
      ],
      correctAnswer: 2 // color
    },
    {
      question: "What does DOM stand for?",
      answers: [
        "Document Object Model",
        "Document Oriented Markup",
        "Digital Ordinance Model",
        "Display Object Management"
      ],
      correctAnswer: 0 // Document Object Model
    },
    {
      question: "Which method is used to add an element at the end of an array in JavaScript?",
      answers: [
        "push()",
        "pop()",
        "append()",
        "concat()"
      ],
      correctAnswer: 0 // push()
    },
    {
      question: "Which CSS property is used to control the space between elements?",
      answers: [
        "spacing",
        "margin",
        "padding",
        "border"
      ],
      correctAnswer: 1 // margin
    },
    {
      question: "Which of the following is a valid way to comment in JavaScript?",
      answers: [
        "<!-- Comment -->",
        "# Comment",
        "/* Comment */",
        "'Comment"
      ],
      correctAnswer: 2 // /* Comment */
    },
    {
      question: "What does API stand for?",
      answers: [
        "Application Programming Interface",
        "Application Protocol Integration",
        "Automated Programming Interface",
        "Application Process Integration"
      ],
      correctAnswer: 0 // Application Programming Interface
    },
    {
      question: "Which HTML5 element is used for playing video files?",
      answers: [
        "<media>",
        "<video>",
        "<movie>",
        "<play>"
      ],
      correctAnswer: 1 // <video>
    },
    {
      question: "Which of these is NOT a CSS box model property?",
      answers: [
        "margin",
        "border",
        "padding",
        "alignment"
      ],
      correctAnswer: 3 // alignment
    }
  ];
  
  // Start quiz
  function initQuiz() {
    currentQuestion = 0;
    score = 0;
    quizCompleted = false;
    
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    
    loadQuestion();
  }
  
  // Load current question
  function loadQuestion() {
    if (currentQuestion >= questions.length) {
      showResults();
      return;
    }
    
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.textContent = answer;
      button.classList.add('answer-button');
      button.dataset.index = index;
      button.addEventListener('click', selectAnswer);
      answersContainer.appendChild(button);
    });
    
    // Update question number display
    questionNumberDisplay.textContent = \`Question: \${currentQuestion + 1}/\${questions.length}\`;
  }
  
  // Handle answer selection
  function selectAnswer(event) {
    if (quizCompleted) return;
    
    const selectedAnswerIndex = parseInt(event.target.dataset.index);
    const question = questions[currentQuestion];
    
    // Mark button as selected
    const buttons = answersContainer.querySelectorAll('.answer-button');
    buttons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Check if answer is correct
    if (selectedAnswerIndex === question.correctAnswer) {
      score++;
      scoreDisplay.textContent = \`Score: \${score}\`;
      
      event.target.classList.add('correct');
    } else {
      event.target.classList.add('incorrect');
      
      // Highlight correct answer
      buttons[question.correctAnswer].classList.add('correct');
    }
    
    // Disable all buttons after selection
    buttons.forEach(button => button.removeEventListener('click', selectAnswer));
    
    // Move to next question after delay
    setTimeout(() => {
      currentQuestion++;
      loadQuestion();
    }, 1500);
  }
  
  // Show quiz results
  function showResults() {
    quizCompleted = true;
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    finalScoreDisplay.textContent = \`Your score: \${score}/\${questions.length}\`;
    
    // Provide feedback based on score
    const percentage = (score / questions.length) * 100;
    let feedbackMessage;
    
    if (percentage === 100) {
      feedbackMessage = "Perfect! You're a coding master!";
    } else if (percentage >= 80) {
      feedbackMessage = "Great job! You know your stuff!";
    } else if (percentage >= 60) {
      feedbackMessage = "Good work! Keep learning!";
    } else if (percentage >= 40) {
      feedbackMessage = "Not bad, but there's room for improvement.";
    } else {
      feedbackMessage = "Keep practicing and try again soon!";
    }
    
    feedbackDisplay.textContent = feedbackMessage;
  }
  
  // Restart quiz event
  restartButton.addEventListener('click', initQuiz);
  
  // Initialize quiz on load
  initQuiz();
});`,
    },
    difficulty: "beginner",
    playUrl: "#/play/quiz-game",
  },
  {
    id: "strategy-game",
    title: "Resource Strategy",
    description: "A turn-based strategy game focusing on resource management and decision making.",
    imageUrl: "/placeholder.svg",
    category: "strategy",
    sourceCode: {
      ts: `// Resource Strategy Game in TypeScript
interface Resource {
  type: string;
  amount: number;
  growthRate: number;
  maxAmount: number;
}

interface Building {
  id: number;
  name: string;
  level: number;
  cost: { [key: string]: number };
  production: { [key: string]: number };
  upgradeMultiplier: number;
}

class StrategyGame {
  private resources: { [key: string]: Resource };
  private buildings: Building[];
  private dayCount: number = 1;
  private gameSpeed: number = 1000; // ms per turn
  private gameLoop: number | null = null;
  private isPaused: boolean = true;
  
  // DOM Elements
  private resourcesContainer: HTMLElement;
  private buildingsContainer: HTMLElement;
  private actionContainer: HTMLElement;
  private dayCounter: HTMLElement;
  private messageLog: HTMLElement;
  
  constructor() {
    // Initialize resources
    this.resources = {
      food: { type: 'food', amount: 50, growthRate: 1, maxAmount: 1000 },
      wood: { type: 'wood', amount: 30, growthRate: 0, maxAmount: 1000 },
      stone: { type: 'stone', amount: 20, growthRate: 0, maxAmount: 1000 },
      gold: { type: 'gold', amount: 10, growthRate: 0, maxAmount: 500 }
    };
    
    // Initialize buildings
    this.buildings = [
      {
        id: 1,
        name: 'Farm',
        level: 0,
        cost: { wood: 10, stone: 5 },
        production: { food: 5 },
        upgradeMultiplier: 1.5
      },
      {
        id: 2,
        name: 'Lumber Mill',
        level: 0,
        cost: { food: 10, stone: 5 },
        production: { wood: 3 },
        upgradeMultiplier: 1.7
      },
      {
        id: 3,
        name: 'Quarry',
        level: 0,
        cost: { food: 15, wood: 10 },
        production: { stone: 2 },
        upgradeMultiplier: 1.8
      },
      {
        id: 4,
        name: 'Trading Post',
        level: 0,
        cost: { food: 20, wood: 15, stone: 10 },
        production: { gold: 1 },
        upgradeMultiplier: 2
      }
    ];
    
    // Get DOM elements
    this.resourcesContainer = document.getElementById('resources') as HTMLElement;
    this.buildingsContainer = document.getElementById('buildings') as HTMLElement;
    this.actionContainer = document.getElementById('actions') as HTMLElement;
    this.dayCounter = document.getElementById('day-counter') as HTMLElement;
    this.messageLog = document.getElementById('message-log') as HTMLElement;
    
    // Initialize game interface
    this.initializeGame();
  }
  
  private initializeGame(): void {
    this.renderResources();
    this.renderBuildings();
    this.renderActions();
    this.updateDayCounter();
    
    this.logMessage('Welcome to Resource Strategy! Start managing your resources.');
  }
  
  private renderResources(): void {
    this.resourcesContainer.innerHTML = '';
    
    Object.values(this.resources).forEach(resource => {
      const resourceElement = document.createElement('div');
      resourceElement.className = 'resource';
      
      resourceElement.innerHTML = \`
        <div class="resource-name">\${resource.type}</div>
        <div class="resource-amount">\${Math.floor(resource.amount)} / \${resource.maxAmount}</div>
        <div class="resource-growth">(\${resource.growthRate > 0 ? '+' : ''}\${resource.growthRate}/day)</div>
      \`;
      
      this.resourcesContainer.appendChild(resourceElement);
    });
  }
  
  private renderBuildings(): void {
    this.buildingsContainer.innerHTML = '';
    
    this.buildings.forEach(building => {
      const buildingElement = document.createElement('div');
      buildingElement.className = 'building';
      
      // Create cost display string
      let costDisplay = '';
      for (const [resource, amount] of Object.entries(building.cost)) {
        const upgradedCost = Math.floor(amount * Math.pow(building.upgradeMultiplier, building.level));
        costDisplay += \`\${resource}: \${upgradedCost} \`;
      }
      
      // Create production display string
      let productionDisplay = '';
      for (const [resource, amount] of Object.entries(building.production)) {
        const currentProduction = amount * (building.level > 0 ? building.level : 0);
        const nextProduction = amount * (building.level + 1);
        productionDisplay += \`\${resource}: \${currentProduction} → \${nextProduction} \`;
      }
      
      buildingElement.innerHTML = \`
        <div class="building-header">
          <div class="building-name">\${building.name}</div>
          <div class="building-level">Level: \${building.level}</div>
        </div>
        <div class="building-info">
          <div class="building-cost">Cost: \${costDisplay}</div>
          <div class="building-production">Production: \${productionDisplay}</div>
        </div>
        <button class="upgrade-btn" data-building-id="\${building.id}">Upgrade</button>
      \`;
      
      this.buildingsContainer.appendChild(buildingElement);
    });
    
    // Add event listeners to upgrade buttons
    const upgradeButtons = document.querySelectorAll('.upgrade-btn');
    upgradeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const buildingId = parseInt((e.target as HTMLElement).getAttribute('data-building-id') || '0');
        this.upgradeBuilding(buildingId);
      });
    });
  }
  
  private renderActions(): void {
    this.actionContainer.innerHTML = '';
    
    // Add basic resource gathering actions
    const gatherFoodButton = document.createElement('button');
    gatherFoodButton.className = 'action-btn';
    gatherFoodButton.textContent = 'Gather Food (+5)';
    gatherFoodButton.addEventListener('click', () => this.gatherResource('food', 5));
    
    const gatherWoodButton = document.createElement('button');
    gatherWoodButton.className = 'action-btn';
    gatherWoodButton.textContent = 'Gather Wood (+3)';
    gatherWoodButton.addEventListener('click', () => this.gatherResource('wood', 3));
    
    const gatherStoneButton = document.createElement('button');
    gatherStoneButton.className = 'action-btn';
    gatherStoneButton.textContent = 'Gather Stone (+2)';
    gatherStoneButton.addEventListener('click', () => this.gatherResource('stone', 2));
    
    // Add game control buttons
    const startStopButton = document.createElement('button');
    startStopButton.id = 'start-stop-btn';
    startStopButton.className = 'control-btn';
    startStopButton.textContent = this.isPaused ? 'Start Day Cycle' : 'Pause Day Cycle';
    startStopButton.addEventListener('click', () => this.toggleGameCycle());
    
    this.actionContainer.appendChild(gatherFoodButton);
    this.actionContainer.appendChild(gatherWoodButton);
    this.actionContainer.appendChild(gatherStoneButton);
    this.actionContainer.appendChild(document.createElement('hr'));
    this.actionContainer.appendChild(startStopButton);
  }
  
  private updateDayCounter(): void {
    this.dayCounter.textContent = \`Day: \${this.dayCount}\`;
  }
  
  private logMessage(message: string): void {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = \`Day \${this.dayCount}: \${message}\`;
    
    this.messageLog.prepend(messageElement);
    
    // Limit log to 5 messages
    const messages = this.messageLog.querySelectorAll('.message');
    if (messages.length > 5) {
      messages[messages.length - 1].remove();
    }
  }
  
  private gatherResource(type: string, amount: number): void {
    if (this.resources[type]) {
      this.resources[type].amount = Math.min(
        this.resources[type].amount + amount,
        this.resources[type].maxAmount
      );
      
      this.logMessage(\`Gathered \${amount} \${type}\`);
      this.renderResources();
    }
  }
  
  private upgradeBuilding(buildingId: number): void {
    const building = this.buildings.find(b => b.id === buildingId);
    if (!building) return;
    
    // Calculate costs based on current level
    const upgradeCosts: { [key: string]: number } = {};
    let canAfford = true;
    
    for (const [resource, baseCost] of Object.entries(building.cost)) {
      const upgradeCost = Math.floor(baseCost * Math.pow(building.upgradeMultiplier, building.level));
      upgradeCosts[resource] = upgradeCost;
      
      if (this.resources[resource].amount < upgradeCost) {
        canAfford = false;
      }
    }
    
    if (canAfford) {
      // Deduct resources
      for (const [resource, cost] of Object.entries(upgradeCosts)) {
        this.resources[resource].amount -= cost;
      }
      
      // Upgrade building
      building.level++;
      
      // Update production rates
      for (const [resource, production] of Object.entries(building.production)) {
        if (this.resources[resource]) {
          this.resources[resource].growthRate += production;
        }
      }
      
      this.logMessage(\`Upgraded \${building.name} to level \${building.level}\`);
      this.renderResources();
      this.renderBuildings();
    } else {
      this.logMessage(\`Cannot afford to upgrade \${building.name}\`);
    }
  }
  
  private progressDay(): void {
    // Apply resource growth
    for (const resource of Object.values(this.resources)) {
      resource.amount = Math.min(
        resource.amount + resource.growthRate,
        resource.maxAmount
      );
    }
    
    this.dayCount++;
    this.updateDayCounter();
    this.renderResources();
    
    // Random events (10% chance)
    if (Math.random() < 0.1) {
      this.triggerRandomEvent();
    }
  }
  
  private triggerRandomEvent(): void {
    const events = [
      {
        name: 'Bountiful Harvest',
        effect: () => {
          const bonus = Math.floor(10 + Math.random() * 20);
          this.resources.food.amount += bonus;
          return \`Bountiful Harvest: +\${bonus} food\`;
        }
      },
      {
        name: 'Forest Discovery',
        effect: () => {
          const bonus = Math.floor(5 + Math.random() * 15);
          this.resources.wood.amount += bonus;
          return \`Forest Discovery: +\${bonus} wood\`;
        }
      },
      {
        name: 'Stone Vein',
        effect: () => {
          const bonus = Math.floor(5 + Math.random() * 10);
          this.resources.stone.amount += bonus;
          return \`Stone Vein Found: +\${bonus} stone\`;
        }
      },
      {
        name: 'Gold Nugget',
        effect: () => {
          const bonus = Math.floor(2 + Math.random() * 5);
          this.resources.gold.amount += bonus;
          return \`Gold Nugget Found: +\${bonus} gold\`;
        }
      },
      {
        name: 'Bad Weather',
        effect: () => {
          const penaltyResource = Math.random() < 0.5 ? 'food' : 'wood';
          const penalty = Math.floor(5 + Math.random() * 10);
          this.resources[penaltyResource].amount = Math.max(0, this.resources[penaltyResource].amount - penalty);
          return \`Bad Weather: -\${penalty} \${penaltyResource}\`;
        }
      }
    ];
    
    // Select random event
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const message = randomEvent.effect();
    
    this.logMessage(message);
  }
  
  private toggleGameCycle(): void {
    if (this.isPaused) {
      this.startGameCycle();
    } else {
      this.pauseGameCycle();
    }
    
    this.renderActions();
  }
  
  private startGameCycle(): void {
    if (!this.gameLoop) {
      this.gameLoop = window.setInterval(() => {
        this.progressDay();
      }, this.gameSpeed);
    }
    
    this.isPaused = false;
    this.logMessage('Day cycle started');
  }
  
  private pauseGameCycle(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    
    this.isPaused = true;
    this.logMessage('Day cycle paused');
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create game HTML structure
  const gameContainer = document.createElement('div');
  gameContainer.className = 'strategy-game-container';
  
  gameContainer.innerHTML = \`
    <div class="game-header">
      <h2>Resource Strategy</h2>
      <div id="day-counter">Day: 1</div>
    </div>
    
    <div class="game-grid">
      <div class="resources-section">
        <h3>Resources</h3>
        <div id="resources" class="resources-container"></div>
      </div>
      
      <div class="buildings-section">
        <h3>Buildings</h3>
        <div id="buildings" class="buildings-container"></div>
      </div>
      
      <div class="actions-section">
        <h3>Actions</h3>
        <div id="actions" class="actions-container"></div>
      </div>
      
      <div class="log-section">
        <h3>Event Log</h3>
        <div id="message-log" class="message-log"></div>
      </div>
    </div>
  \`;
  
  document.querySelector('.game-container')?.appendChild(gameContainer);
  
  // Initialize game
  new StrategyGame();
});`,
      css: `/* Strategy Game Styling */
.strategy-game-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

h3 {
  margin-top: 0;
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
}

/* Resources */
.resources-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.resource {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: center;
}

.resource-name {
  text-transform: capitalize;
  font-weight: bold;
}

.resource-growth {
  font-size: 0.9em;
  color: #777;
}

/* Buildings */
.buildings-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.building {
  padding: 12px;
  background-color: #e6e6e6;
  border-radius: 6px;
  transition: transform 0.2s;
}

.building:hover {
  transform: translateY(-2px);
}

.building-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.building-name {
  font-weight: bold;
}

.building-info {
  font-size: 0.9em;
  margin-bottom: 10px;
}

/* Actions */
.actions-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  padding: 8px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2980b9;
}

.upgrade-btn {
  background-color: #27ae60;
}

.upgrade-btn:hover {
  background-color: #219653;
}

.control-btn {
  background-color: #e74c3c;
}

.control-btn:hover {
  background-color: #c0392b;
}

/* Message Log */
.message-log {
  height: 250px;
  overflow-y: auto;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.message {
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}

/* Responsive */
@media (max-width: 768px) {
  .game-grid {
    grid-template-columns: 1fr;
  }
  
  .resources-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .resources-container {
    grid-template-columns: 1fr;
  }
}`,
    },
    difficulty: "advanced",
    playUrl: "#/play/strategy-game",
  },
];

export const getGameByCategory = (category: string): Game[] => {
  if (category === 'all') {
    return games;
  }
  
  return games.filter(game => game.category === category);
};

export const getFeaturedGames = (): Game[] => {
  return games.filter(game => game.featured);
};

export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};
