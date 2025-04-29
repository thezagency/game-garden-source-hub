
import React from "react";
import { Game } from "../../types";

export const get2048Game = (): Game => {
  return {
    id: "2048-csharp",
    title: "2048 Game (C#)",
    description: "A puzzle game where you combine tiles to reach 2048",
    imageUrl: "https://images.unsplash.com/photo-1592168855341-52d7832855fb?q=80&w=1480&fm=jpg",
    category: "puzzle",
    sourceCode: {
      html: `<div id="game2048-container">
  <div class="game-header">
    <div>
      <h3>2048</h3>
      <p>Join the tiles, get to <strong>2048</strong>!</p>
    </div>
    <div>
      <div class="score-container">Score: <span id="score">0</span></div>
    </div>
  </div>
  
  <div id="game-grid" class="game-container"></div>
  
  <div class="game-controls">
    <button id="new-game-button">New Game</button>
  </div>
  
  <div class="instructions">
    <p>Use arrow keys or swipe to move tiles. When two tiles with the same number touch, they merge!</p>
  </div>
</div>`,
      css: `#game2048-container {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.score-container {
  background: #bbada0;
  padding: 10px 15px;
  border-radius: 6px;
  color: white;
  font-weight: bold;
}

.game-container {
  background: #bbada0;
  border-radius: 6px;
  width: 100%;
  height: 400px;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 10px;
}

.tile {
  background: #eee4da;
  border-radius: 3px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.1s ease;
}

.tile-2 { background: #eee4da; color: #776e65; }
.tile-4 { background: #ede0c8; color: #776e65; }
.tile-8 { background: #f2b179; color: #f9f6f2; }
.tile-16 { background: #f59563; color: #f9f6f2; }
.tile-32 { background: #f67c5f; color: #f9f6f2; }
.tile-64 { background: #f65e3b; color: #f9f6f2; }
.tile-128 { background: #edcf72; color: #f9f6f2; font-size: 22px; }
.tile-256 { background: #edcc61; color: #f9f6f2; font-size: 22px; }
.tile-512 { background: #edc850; color: #f9f6f2; font-size: 22px; }
.tile-1024 { background: #edc53f; color: #f9f6f2; font-size: 18px; }
.tile-2048 { background: #edc22e; color: #f9f6f2; font-size: 18px; }

.game-controls {
  margin-top: 20px;
}

button {
  background: #8f7a66;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #7f6a56;
}

.instructions {
  margin-top: 20px;
  color: #776e65;
  font-size: 14px;
}`,
      csharp: `using System;
using System.Collections.Generic;
using System.Linq;

namespace Game2048
{
    public class Game
    {
        private readonly int Size;
        private int[,] Board;
        private Random Random;
        public int Score { get; private set; }

        public Game(int size = 4)
        {
            Size = size;
            Board = new int[Size, Size];
            Random = new Random();
            Score = 0;
            
            // Add initial tiles
            AddRandomTile();
            AddRandomTile();
        }

        // Returns string representation of the board for debugging
        public override string ToString()
        {
            string result = "";
            for (int y = 0; y < Size; y++)
            {
                for (int x = 0; x < Size; x++)
                {
                    result += Board[y, x] + "\\t";
                }
                result += "\\n";
            }
            return result;
        }
        
        // Returns a list of all cell positions that are empty
        private List<(int, int)> GetEmptyCells()
        {
            List<(int, int)> emptyCells = new List<(int, int)>();
            
            for (int y = 0; y < Size; y++)
            {
                for (int x = 0; x < Size; x++)
                {
                    if (Board[y, x] == 0)
                    {
                        emptyCells.Add((y, x));
                    }
                }
            }
            
            return emptyCells;
        }
        
        // Adds a random tile (2 or 4) to an empty cell
        public bool AddRandomTile()
        {
            List<(int, int)> emptyCells = GetEmptyCells();
            
            if (emptyCells.Count == 0)
            {
                return false;
            }
            
            // Choose a random empty cell
            int randomIndex = Random.Next(emptyCells.Count);
            (int y, int x) = emptyCells[randomIndex];
            
            // 90% chance of 2, 10% chance of 4
            Board[y, x] = Random.NextDouble() < 0.9 ? 2 : 4;
            
            return true;
        }
        
        // Moves the board in a direction and returns if anything changed
        public bool Move(Direction direction)
        {
            // Save the current state to check if anything moved
            int[,] previousBoard = new int[Size, Size];
            Array.Copy(Board, previousBoard, Board.Length);
            
            // Apply move based on direction
            switch (direction)
            {
                case Direction.Up:
                    MoveUp();
                    break;
                case Direction.Down:
                    MoveDown();
                    break;
                case Direction.Left:
                    MoveLeft();
                    break;
                case Direction.Right:
                    MoveRight();
                    break;
            }
            
            // Check if anything changed
            bool changed = !Enumerable.Range(0, Size * Size).All(i => 
                previousBoard[i / Size, i % Size] == Board[i / Size, i % Size]);
            
            // If something moved, add a new random tile
            if (changed)
            {
                AddRandomTile();
            }
            
            return changed;
        }
        
        // Helper method for moving up
        private void MoveUp()
        {
            for (int x = 0; x < Size; x++)
            {
                // Process column from top to bottom
                for (int y = 0; y < Size; y++)
                {
                    if (Board[y, x] != 0)
                    {
                        int currentY = y;
                        
                        // Move the tile as far up as possible
                        while (currentY > 0 && Board[currentY - 1, x] == 0)
                        {
                            Board[currentY - 1, x] = Board[currentY, x];
                            Board[currentY, x] = 0;
                            currentY--;
                        }
                        
                        // Merge with tile above if values are the same
                        if (currentY > 0 && Board[currentY - 1, x] == Board[currentY, x])
                        {
                            Board[currentY - 1, x] *= 2;
                            Score += Board[currentY - 1, x];
                            Board[currentY, x] = 0;
                        }
                    }
                }
            }
        }
        
        // Helper method for moving down
        private void MoveDown()
        {
            for (int x = 0; x < Size; x++)
            {
                // Process column from bottom to top
                for (int y = Size - 1; y >= 0; y--)
                {
                    if (Board[y, x] != 0)
                    {
                        int currentY = y;
                        
                        // Move the tile as far down as possible
                        while (currentY < Size - 1 && Board[currentY + 1, x] == 0)
                        {
                            Board[currentY + 1, x] = Board[currentY, x];
                            Board[currentY, x] = 0;
                            currentY++;
                        }
                        
                        // Merge with tile below if values are the same
                        if (currentY < Size - 1 && Board[currentY + 1, x] == Board[currentY, x])
                        {
                            Board[currentY + 1, x] *= 2;
                            Score += Board[currentY + 1, x];
                            Board[currentY, x] = 0;
                        }
                    }
                }
            }
        }
        
        // Helper method for moving left
        private void MoveLeft()
        {
            for (int y = 0; y < Size; y++)
            {
                // Process row from left to right
                for (int x = 0; x < Size; x++)
                {
                    if (Board[y, x] != 0)
                    {
                        int currentX = x;
                        
                        // Move the tile as far left as possible
                        while (currentX > 0 && Board[y, currentX - 1] == 0)
                        {
                            Board[y, currentX - 1] = Board[y, currentX];
                            Board[y, currentX] = 0;
                            currentX--;
                        }
                        
                        // Merge with tile to the left if values are the same
                        if (currentX > 0 && Board[y, currentX - 1] == Board[y, currentX])
                        {
                            Board[y, currentX - 1] *= 2;
                            Score += Board[y, currentX - 1];
                            Board[y, currentX] = 0;
                        }
                    }
                }
            }
        }
        
        // Helper method for moving right
        private void MoveRight()
        {
            for (int y = 0; y < Size; y++)
            {
                // Process row from right to left
                for (int x = Size - 1; x >= 0; x--)
                {
                    if (Board[y, x] != 0)
                    {
                        int currentX = x;
                        
                        // Move the tile as far right as possible
                        while (currentX < Size - 1 && Board[y, currentX + 1] == 0)
                        {
                            Board[y, currentX + 1] = Board[y, currentX];
                            Board[y, currentX] = 0;
                            currentX++;
                        }
                        
                        // Merge with tile to the right if values are the same
                        if (currentX < Size - 1 && Board[y, currentX + 1] == Board[y, currentX])
                        {
                            Board[y, currentX + 1] *= 2;
                            Score += Board[y, currentX + 1];
                            Board[y, currentX] = 0;
                        }
                    }
                }
            }
        }
        
        // Checks if the game is over (no more valid moves)
        public bool IsGameOver()
        {
            // If there are empty cells, the game is not over
            if (GetEmptyCells().Count > 0)
            {
                return false;
            }
            
            // Check if any adjacent tiles have the same value (can be merged)
            for (int y = 0; y < Size; y++)
            {
                for (int x = 0; x < Size; x++)
                {
                    int currentValue = Board[y, x];
                    
                    // Check right and down neighbors
                    if ((x < Size - 1 && Board[y, x + 1] == currentValue) || 
                        (y < Size - 1 && Board[y + 1, x] == currentValue))
                    {
                        return false;
                    }
                }
            }
            
            // No empty cells and no possible merges
            return true;
        }
        
        // Checks if the player has won (has a 2048 tile)
        public bool HasWon()
        {
            return Enumerable.Range(0, Size * Size).Any(i => 
                Board[i / Size, i % Size] >= 2048);
        }
        
        // Gets the value at a specific position
        public int GetValue(int row, int col)
        {
            if (row >= 0 && row < Size && col >= 0 && col < Size)
            {
                return Board[row, col];
            }
            return 0;
        }
        
        // Resets the game
        public void Reset()
        {
            Board = new int[Size, Size];
            Score = 0;
            
            // Add initial tiles
            AddRandomTile();
            AddRandomTile();
        }
    }
    
    public enum Direction
    {
        Up,
        Down,
        Left,
        Right
    }
}`,
      js: `// JavaScript implementation for the 2048 game
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('game-grid');
  const scoreDisplay = document.getElementById('score');
  const newGameButton = document.getElementById('new-game-button');
  
  const SIZE = 4;
  let board = [];
  let score = 0;
  let isGameOver = false;
  
  // Initialize the game
  function init() {
    // Create empty board
    board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
    score = 0;
    isGameOver = false;
    
    // Add initial tiles
    addRandomTile();
    addRandomTile();
    
    updateDisplay();
  }
  
  // Create the UI grid
  function createGrid() {
    gridContainer.innerHTML = '';
    
    for (let i = 0; i < SIZE * SIZE; i++) {
      const cell = document.createElement('div');
      cell.classList.add('tile');
      gridContainer.appendChild(cell);
    }
  }
  
  // Update the display based on current board state
  function updateDisplay() {
    // Update score
    scoreDisplay.textContent = score;
    
    // Update tiles
    const tiles = document.querySelectorAll('.tile');
    
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const index = row * SIZE + col;
        const value = board[row][col];
        
        tiles[index].textContent = value === 0 ? '' : value;
        
        // Reset classes
        tiles[index].className = 'tile';
        
        if (value > 0) {
          tiles[index].classList.add('tile-' + value);
        }
      }
    }
    
    // Check game over
    if (isGameOver && !hasEmptyCells()) {
      setTimeout(() => {
        alert('Game over! Your score: ' + score);
      }, 300);
    } else if (hasWon()) {
      setTimeout(() => {
        const playOn = confirm('You won! Would you like to continue playing?');
        if (!playOn) {
          init();
        }
      }, 300);
    }
  }
  
  // Add a random tile to an empty cell
  function addRandomTile() {
    const emptyCells = [];
    
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length === 0) {
      return false;
    }
    
    // Choose a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // 90% chance for a 2, 10% chance for a 4
    board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    
    return true;
  }
  
  // Check if there are empty cells
  function hasEmptyCells() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] === 0) {
          return true;
        }
      }
    }
    return false;
  }
  
  // Check if the player has won (has a 2048 tile)
  function hasWon() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] >= 2048) {
          return true;
        }
      }
    }
    return false;
  }
  
  // Check if the game is over
  function checkGameOver() {
    // If there are empty cells, the game is not over
    if (hasEmptyCells()) {
      return false;
    }
    
    // Check if any adjacent tiles have the same value (can be merged)
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const value = board[row][col];
        
        // Check right neighbor
        if (col < SIZE - 1 && board[row][col + 1] === value) {
          return false;
        }
        
        // Check down neighbor
        if (row < SIZE - 1 && board[row + 1][col] === value) {
          return false;
        }
      }
    }
    
    // No empty cells and no possible merges
    isGameOver = true;
    return true;
  }
  
  // Move tiles in a direction
  function move(direction) {
    // Save previous board state to check if anything moved
    const previousBoard = board.map(row => [...row]);
    let moved = false;
    
    // Apply move logic based on direction
    switch (direction) {
      case 'up':
        moved = moveUp();
        break;
      case 'down':
        moved = moveDown();
        break;
      case 'left':
        moved = moveLeft();
        break;
      case 'right':
        moved = moveRight();
        break;
    }
    
    // If something moved, add a new random tile
    if (moved) {
      addRandomTile();
      checkGameOver();
      updateDisplay();
    }
    
    return moved;
  }
  
  // Helper functions for moving
  function moveUp() {
    let moved = false;
    
    for (let col = 0; col < SIZE; col++) {
      // Process column from top to bottom
      for (let row = 0; row < SIZE; row++) {
        if (board[row][col] !== 0) {
          let currentRow = row;
          
          // Move the tile as far up as possible
          while (currentRow > 0 && board[currentRow - 1][col] === 0) {
            board[currentRow - 1][col] = board[currentRow][col];
            board[currentRow][col] = 0;
            currentRow--;
            moved = true;
          }
          
          // Merge with tile above if values are the same
          if (currentRow > 0 && board[currentRow - 1][col] === board[currentRow][col]) {
            board[currentRow - 1][col] *= 2;
            score += board[currentRow - 1][col];
            board[currentRow][col] = 0;
            moved = true;
          }
        }
      }
    }
    
    return moved;
  }
  
  function moveDown() {
    let moved = false;
    
    for (let col = 0; col < SIZE; col++) {
      // Process column from bottom to top
      for (let row = SIZE - 1; row >= 0; row--) {
        if (board[row][col] !== 0) {
          let currentRow = row;
          
          // Move the tile as far down as possible
          while (currentRow < SIZE - 1 && board[currentRow + 1][col] === 0) {
            board[currentRow + 1][col] = board[currentRow][col];
            board[currentRow][col] = 0;
            currentRow++;
            moved = true;
          }
          
          // Merge with tile below if values are the same
          if (currentRow < SIZE - 1 && board[currentRow + 1][col] === board[currentRow][col]) {
            board[currentRow + 1][col] *= 2;
            score += board[currentRow + 1][col];
            board[currentRow][col] = 0;
            moved = true;
          }
        }
      }
    }
    
    return moved;
  }
  
  function moveLeft() {
    let moved = false;
    
    for (let row = 0; row < SIZE; row++) {
      // Process row from left to right
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] !== 0) {
          let currentCol = col;
          
          // Move the tile as far left as possible
          while (currentCol > 0 && board[row][currentCol - 1] === 0) {
            board[row][currentCol - 1] = board[row][currentCol];
            board[row][currentCol] = 0;
            currentCol--;
            moved = true;
          }
          
          // Merge with tile to the left if values are the same
          if (currentCol > 0 && board[row][currentCol - 1] === board[row][currentCol]) {
            board[row][currentCol - 1] *= 2;
            score += board[row][currentCol - 1];
            board[row][currentCol] = 0;
            moved = true;
          }
        }
      }
    }
    
    return moved;
  }
  
  function moveRight() {
    let moved = false;
    
    for (let row = 0; row < SIZE; row++) {
      // Process row from right to left
      for (let col = SIZE - 1; col >= 0; col--) {
        if (board[row][col] !== 0) {
          let currentCol = col;
          
          // Move the tile as far right as possible
          while (currentCol < SIZE - 1 && board[row][currentCol + 1] === 0) {
            board[row][currentCol + 1] = board[row][currentCol];
            board[row][currentCol] = 0;
            currentCol++;
            moved = true;
          }
          
          // Merge with tile to the right if values are the same
          if (currentCol < SIZE - 1 && board[row][currentCol + 1] === board[row][currentCol]) {
            board[row][currentCol + 1] *= 2;
            score += board[row][currentCol + 1];
            board[row][currentCol] = 0;
            moved = true;
          }
        }
      }
    }
    
    return moved;
  }
  
  // Event listeners
  document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    
    switch (e.key) {
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
    }
  });
  
  newGameButton.addEventListener('click', init);
  
  // Touch swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  
  gridContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
  }, { passive: false });
  
  gridContainer.addEventListener('touchend', (e) => {
    if (isGameOver) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Determine the direction of the swipe based on which axis had a greater change
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) {
        move('right');
      } else if (deltaX < -50) {
        move('left');
      }
    } else {
      if (deltaY > 50) {
        move('down');
      } else if (deltaY < -50) {
        move('up');
      }
    }
    
    e.preventDefault();
  }, { passive: false });
  
  // Initialize
  createGrid();
  init();
});`
    },
    difficulty: "intermediate",
    featured: true,
    playUrl: "/play/2048-csharp"
  };
};
