
import React from 'react';
import { Game } from "../../types";

export const getTetrisGravityGame = (): Game => {
  return {
    id: "tetris-gravity",
    title: "Tetris Gravity",
    description: "A variant of Tetris where blocks fall faster as you progress",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1335&fm=jpg",
    category: "puzzle",
    difficulty: "intermediate",
    featured: false,
    playUrl: "/play/tetris-gravity",
    sourceCode: {
      html: `<div class="tetris-container">
  <div class="game-area">
    <canvas id="tetris" width="240" height="400"></canvas>
  </div>
  <div class="info-section">
    <h2>Tetris Gravity</h2>
    <div class="score">Score: <span id="score">0</span></div>
    <div class="level">Level: <span id="level">1</span></div>
    <div class="controls">
      <p>← → : Move</p>
      <p>↑ : Rotate</p>
      <p>↓ : Soft Drop</p>
      <p>Space : Hard Drop</p>
    </div>
    <button id="start-button">Start / Reset</button>
  </div>
</div>`,
      css: `body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}

.tetris-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.game-area {
  background-color: #222;
  padding: 10px;
  border-radius: 5px;
}

canvas {
  display: block;
  background-color: #000;
  border-radius: 2px;
}

.info-section {
  margin-left: 20px;
  width: 200px;
}

h2 {
  margin-top: 0;
  color: #333;
}

.score, .level {
  margin-bottom: 10px;
  font-size: 18px;
}

.controls {
  margin: 20px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.controls p {
  margin: 5px 0;
}

button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #45a049;
}

@media (max-width: 600px) {
  .tetris-container {
    flex-direction: column;
  }
  
  .info-section {
    margin-left: 0;
    margin-top: 20px;
    width: 100%;
  }
}`,
      js: `document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('tetris');
  const context = canvas.getContext('2d');
  const scoreElement = document.getElementById('score');
  const levelElement = document.getElementById('level');
  const startButton = document.getElementById('start-button');
  
  context.scale(20, 20);
  
  // Game constants
  const ROWS = 20;
  const COLS = 12;
  const BLOCK_SIZE = 1;
  const COLORS = [
    null,
    '#FF0D72', // I
    '#0DC2FF', // O
    '#0DFF72', // Z
    '#F538FF', // S
    '#FF8E0D', // L
    '#FFE138', // J
    '#3877FF'  // T
  ];
  
  let dropCounter = 0;
  let dropInterval = 1000;
  let lastTime = 0;
  let score = 0;
  let level = 1;
  let gameOver = false;
  let isPaused = false;
  let animationId;
  
  // Create a blank arena
  const arena = createMatrix(COLS, ROWS);
  
  // Player representation
  const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0
  };
  
  // Create a matrix filled with zeros
  function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  }
  
  // Create tetromino pieces
  function createPiece(type) {
    switch(type) {
      case 'I':
        return [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0]
        ];
      case 'O':
        return [
          [2, 2],
          [2, 2]
        ];
      case 'Z':
        return [
          [3, 3, 0],
          [0, 3, 3],
          [0, 0, 0]
        ];
      case 'S':
        return [
          [0, 4, 4],
          [4, 4, 0],
          [0, 0, 0]
        ];
      case 'L':
        return [
          [0, 5, 0],
          [0, 5, 0],
          [0, 5, 5]
        ];
      case 'J':
        return [
          [0, 6, 0],
          [0, 6, 0],
          [6, 6, 0]
        ];
      case 'T':
        return [
          [0, 7, 0],
          [7, 7, 7],
          [0, 0, 0]
        ];
    }
  }
  
  // Reset the game
  function resetGame() {
    arena.forEach(row => row.fill(0));
    score = 0;
    level = 1;
    dropInterval = 1000;
    updateScore();
    gameOver = false;
    isPaused = false;
    
    playerReset();
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    update();
  }
  
  // Check collision
  function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
           (arena[y + o.y] &&
           arena[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }
  
  // Draw the game elements
  function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
  }
  
  // Draw a matrix (tetromino or arena)
  function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = COLORS[value];
          context.fillRect(
            x + offset.x,
            y + offset.y,
            1, 1
          );
          context.strokeStyle = 'black';
          context.lineWidth = 0.05;
          context.strokeRect(
            x + offset.x,
            y + offset.y,
            1, 1
          );
        }
      });
    });
  }
  
  // Merge player tetromino with arena
  function merge(arena, player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }
  
  // Player controls
  function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
      player.pos.y--;
      merge(arena, player);
      playerReset();
      arenaSweep();
      updateScore();
    }
    dropCounter = 0;
  }
  
  function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
      player.pos.x -= dir;
    }
  }
  
  function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    player.pos.y = 0;
    player.pos.x = Math.floor((arena[0].length - player.matrix[0].length) / 2);
    
    // Game over check
    if (collide(arena, player)) {
      gameOver = true;
      draw();
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillRect(0, 0, canvas.width / 20, canvas.height / 20);
      context.fillStyle = 'white';
      context.font = '1px Arial';
      context.fillText('Game Over', 1, 9.5);
      return;
    }
  }
  
  function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    
    // Handle collision during rotation
    while (collide(arena, player)) {
      player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > player.matrix[0].length) {
        rotate(player.matrix, -dir);
        player.pos.x = pos;
        return;
      }
    }
  }
  
  // Rotate matrix (tetromino)
  function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [
          matrix[x][y],
          matrix[y][x],
        ] = [
          matrix[y][x],
          matrix[x][y],
        ];
      }
    }
    if (dir > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }
  }
  
  // Clear completed rows
  function arenaSweep() {
    let rowCount = 0;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
      for (let x = 0; x < arena[y].length; ++x) {
        if (arena[y][x] === 0) {
          continue outer;
        }
      }
      
      const row = arena.splice(y, 1)[0].fill(0);
      arena.unshift(row);
      y++;
      rowCount++;
    }
    
    // Update score and level based on rows cleared
    if (rowCount > 0) {
      const points = [0, 40, 100, 300, 1200]; // Points for 0, 1, 2, 3, 4 rows
      score += points[rowCount] * level;
      
      // Level up after every 10 rows
      const totalRows = Math.floor(score / 100);
      const newLevel = Math.floor(totalRows / 10) + 1;
      if (newLevel > level) {
        level = newLevel;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100); // Make game faster
      }
    }
  }
  
  function updateScore() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
  }
  
  // Game loop
  function update(time = 0) {
    if (gameOver || isPaused) {
      return;
    }
    
    const deltaTime = time - lastTime;
    lastTime = time;
    
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
      playerDrop();
    }
    
    draw();
    animationId = requestAnimationFrame(update);
  }
  
  // Key controls
  document.addEventListener('keydown', event => {
    if (gameOver) return;
    
    switch(event.key) {
      case 'ArrowLeft':
        playerMove(-1);
        break;
      case 'ArrowRight':
        playerMove(1);
        break;
      case 'ArrowDown':
        playerDrop();
        break;
      case 'ArrowUp':
        playerRotate(1);
        break;
      case ' ':
        // Hard drop
        while (!collide(arena, {...player, pos: {...player.pos, y: player.pos.y + 1}})) {
          player.pos.y++;
        }
        break;
      case 'p':
        // Toggle pause
        isPaused = !isPaused;
        if (!isPaused) {
          update();
        }
        break;
    }
  });
  
  // Start button event
  startButton.addEventListener('click', resetGame);
  
  // Initialize game
  resetGame();
});`
    }
  };
};
