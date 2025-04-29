import React from "react";
import { Game } from "../../types";

export const getTetrisGame = (): Game => {
  return {
    id: "tetris-java",
    title: "Tetris (Java)",
    description: "Classic Tetris game implemented in Java and converted to JavaScript",
    imageUrl: "https://images.unsplash.com/photo-1642501077610-4c2be83f643b?q=80&w=1170&fm=jpg",
    category: "puzzle",
    sourceCode: {
      html: `<div id="tetris-container">
  <canvas id="tetris" width="320" height="640"></canvas>
  <div id="score-panel">Score: <span id="score">0</span></div>
  <div id="controls">
    <button id="left">←</button>
    <button id="rotate">Rotate</button>
    <button id="right">→</button>
    <button id="down">↓</button>
  </div>
</div>`,
      css: `#tetris-container {
  width: 100%;
  height: 100%;
  text-align: center;
  font-family: Arial, sans-serif;
}

#tetris {
  border: 1px solid #333;
  background: #111;
  display: block;
  margin: 0 auto;
}

#score-panel {
  margin: 10px 0;
  color: #fff;
  font-size: 18px;
}

#controls {
  margin-top: 10px;
}

button {
  margin: 0 5px;
  padding: 8px 12px;
  background: #6c5ce7;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}`,
      java: `
/**
 * Tetris Game in Java
 * Note: This is the Java source code that would be compiled and 
 * translated to JavaScript for web play
 */
import java.awt.Color;
import java.awt.Graphics;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import javax.swing.JFrame;
import javax.swing.JPanel;
import java.util.Random;

public class Tetris extends JPanel implements KeyListener {
    // Game board size
    private static final int BOARD_WIDTH = 10;
    private static final int BOARD_HEIGHT = 20;
    private static final int BLOCK_SIZE = 30;
    
    // Game state
    private int[][] board = new int[BOARD_HEIGHT][BOARD_WIDTH];
    private int currentPiece;
    private int currentRotation;
    private int currentX;
    private int currentY;
    private int score = 0;
    private boolean gameOver = false;
    private Random random = new Random();
    
    // Tetromino shapes defined by their blocks coordinates
    private int[][][] tetrominoes = {
        // I-piece
        {
            {0,0,0,0, 1,1,1,1, 0,0,0,0, 0,0,0,0},
            {0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0},
            {0,0,0,0, 0,0,0,0, 1,1,1,1, 0,0,0,0},
            {0,1,0,0, 0,1,0,0, 0,1,0,0, 0,1,0,0}
        },
        // J-piece
        {
            {1,0,0,0, 1,1,1,0, 0,0,0,0, 0,0,0,0},
            {0,1,1,0, 0,1,0,0, 0,1,0,0, 0,0,0,0},
            {0,0,0,0, 1,1,1,0, 0,0,1,0, 0,0,0,0},
            {0,1,0,0, 0,1,0,0, 1,1,0,0, 0,0,0,0}
        },
        // L-piece
        {
            {0,0,1,0, 1,1,1,0, 0,0,0,0, 0,0,0,0},
            {0,1,0,0, 0,1,0,0, 0,1,1,0, 0,0,0,0},
            {0,0,0,0, 1,1,1,0, 1,0,0,0, 0,0,0,0},
            {1,1,0,0, 0,1,0,0, 0,1,0,0, 0,0,0,0}
        },
        // O-piece
        {
            {0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0},
            {0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0},
            {0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0},
            {0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0}
        },
        // S-piece
        {
            {0,1,1,0, 1,1,0,0, 0,0,0,0, 0,0,0,0},
            {0,1,0,0, 0,1,1,0, 0,0,1,0, 0,0,0,0},
            {0,0,0,0, 0,1,1,0, 1,1,0,0, 0,0,0,0},
            {1,0,0,0, 1,1,0,0, 0,1,0,0, 0,0,0,0}
        },
        // T-piece
        {
            {0,1,0,0, 1,1,1,0, 0,0,0,0, 0,0,0,0},
            {0,1,0,0, 0,1,1,0, 0,1,0,0, 0,0,0,0},
            {0,0,0,0, 1,1,1,0, 0,1,0,0, 0,0,0,0},
            {0,1,0,0, 1,1,0,0, 0,1,0,0, 0,0,0,0}
        },
        // Z-piece
        {
            {1,1,0,0, 0,1,1,0, 0,0,0,0, 0,0,0,0},
            {0,0,1,0, 0,1,1,0, 0,1,0,0, 0,0,0,0},
            {0,0,0,0, 1,1,0,0, 0,1,1,0, 0,0,0,0},
            {0,1,0,0, 1,1,0,0, 1,0,0,0, 0,0,0,0}
        }
    };
    
    public Tetris() {
        // Initialize the game
        newPiece();
        setFocusable(true);
        addKeyListener(this);
    }
    
    // Generate a new random piece
    private void newPiece() {
        currentPiece = random.nextInt(7);
        currentRotation = 0;
        currentX = BOARD_WIDTH / 2 - 2;
        currentY = 0;
        
        // Check if the new piece can be placed
        if (!isValidMove(currentPiece, currentRotation, currentX, currentY)) {
            gameOver = true;
        }
    }
    
    // Check if the move is valid
    private boolean isValidMove(int piece, int rotation, int x, int y) {
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 4; j++) {
                int index = i * 4 + j;
                if (tetrominoes[piece][rotation][index] == 1) {
                    int newX = x + j;
                    int newY = y + i;
                    
                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                        return false;
                    }
                    
                    if (newY >= 0 && board[newY][newX] != 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    // Lock the piece into the board
    private void lockPiece() {
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 4; j++) {
                int index = i * 4 + j;
                if (tetrominoes[currentPiece][currentRotation][index] == 1) {
                    int newX = currentX + j;
                    int newY = currentY + i;
                    
                    if (newY >= 0) {
                        board[newY][newX] = currentPiece + 1;
                    }
                }
            }
        }
        
        // Check for completed lines
        checkLines();
        
        // Create a new piece
        newPiece();
    }
    
    // Check for completed lines
    private void checkLines() {
        for (int i = BOARD_HEIGHT - 1; i >= 0; i--) {
            boolean lineIsFull = true;
            
            for (int j = 0; j < BOARD_WIDTH; j++) {
                if (board[i][j] == 0) {
                    lineIsFull = false;
                    break;
                }
            }
            
            if (lineIsFull) {
                // Clear the line
                for (int k = i; k > 0; k--) {
                    for (int j = 0; j < BOARD_WIDTH; j++) {
                        board[k][j] = board[k-1][j];
                    }
                }
                
                // Clear the top line
                for (int j = 0; j < BOARD_WIDTH; j++) {
                    board[0][j] = 0;
                }
                
                score += 100;
                i++; // Check the same line again
            }
        }
    }
    
    // Game loop
    public void gameLoop() {
        if (!gameOver) {
            if (isValidMove(currentPiece, currentRotation, currentX, currentY + 1)) {
                currentY++;
            } else {
                lockPiece();
            }
            repaint();
        }
    }
    
    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        
        // Draw the board
        for (int i = 0; i < BOARD_HEIGHT; i++) {
            for (int j = 0; j < BOARD_WIDTH; j++) {
                if (board[i][j] != 0) {
                    drawBlock(g, j, i, board[i][j] - 1);
                }
            }
        }
        
        // Draw the current piece
        if (!gameOver) {
            for (int i = 0; i < 4; i++) {
                for (int j = 0; j < 4; j++) {
                    int index = i * 4 + j;
                    if (tetrominoes[currentPiece][currentRotation][index] == 1) {
                        drawBlock(g, currentX + j, currentY + i, currentPiece);
                    }
                }
            }
        }
        
        // Draw game over
        if (gameOver) {
            g.setColor(Color.WHITE);
            g.drawString("Game Over - Score: " + score, 50, 200);
        }
    }
    
    // Draw a block
    private void drawBlock(Graphics g, int x, int y, int colorIndex) {
        Color[] colors = {
            Color.CYAN, Color.BLUE, Color.ORANGE, 
            Color.YELLOW, Color.GREEN, Color.MAGENTA, Color.RED
        };
        
        g.setColor(colors[colorIndex]);
        g.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        
        g.setColor(Color.BLACK);
        g.drawRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    @Override
    public void keyPressed(KeyEvent e) {
        if (!gameOver) {
            switch (e.getKeyCode()) {
                case KeyEvent.VK_LEFT:
                    if (isValidMove(currentPiece, currentRotation, currentX - 1, currentY)) {
                        currentX--;
                    }
                    break;
                case KeyEvent.VK_RIGHT:
                    if (isValidMove(currentPiece, currentRotation, currentX + 1, currentY)) {
                        currentX++;
                    }
                    break;
                case KeyEvent.VK_DOWN:
                    if (isValidMove(currentPiece, currentRotation, currentX, currentY + 1)) {
                        currentY++;
                    }
                    break;
                case KeyEvent.VK_UP:
                    int newRotation = (currentRotation + 1) % 4;
                    if (isValidMove(currentPiece, newRotation, currentX, currentY)) {
                        currentRotation = newRotation;
                    }
                    break;
                case KeyEvent.VK_SPACE:
                    // Hard drop
                    while (isValidMove(currentPiece, currentRotation, currentX, currentY + 1)) {
                        currentY++;
                    }
                    lockPiece();
                    break;
            }
            repaint();
        }
    }
    
    @Override
    public void keyReleased(KeyEvent e) {}
    
    @Override
    public void keyTyped(KeyEvent e) {}
    
    public static void main(String[] args) {
        JFrame frame = new JFrame("Tetris");
        Tetris game = new Tetris();
        frame.add(game);
        frame.setSize(BOARD_WIDTH * BLOCK_SIZE + 16, BOARD_HEIGHT * BLOCK_SIZE + 39);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
        
        // Game loop
        while (!game.gameOver) {
            game.gameLoop();
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}`,
      js: `// JavaScript implementation for web browser
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game constants
const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Initialize the game
let board = Array.from({length: BOARD_HEIGHT}, () => Array(BOARD_WIDTH).fill(0));
let score = 0;
let gameOver = false;
let currentPiece, currentRotation, currentX, currentY;

// Colors for different pieces
const colors = [
  '#00FFFF', // Cyan
  '#0000FF', // Blue
  '#FFA500', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#800080', // Purple
  '#FF0000'  // Red
];

// Tetromino shapes
const tetrominoes = [
  // I-piece
  [
    [0,0,0,0, 1,1,1,1, 0,0,0,0, 0,0,0,0],
    [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
    [0,0,0,0, 0,0,0,0, 1,1,1,1, 0,0,0,0],
    [0,1,0,0, 0,1,0,0, 0,1,0,0, 0,1,0,0]
  ],
  // Rest of the tetrominoes...
];

// Initialize the game
function init() {
  newPiece();
  draw();
  setInterval(moveDown, 500);
  
  // Set up controls
  document.getElementById('left').addEventListener('click', () => movePiece(-1, 0));
  document.getElementById('right').addEventListener('click', () => movePiece(1, 0));
  document.getElementById('down').addEventListener('click', () => movePiece(0, 1));
  document.getElementById('rotate').addEventListener('click', rotatePiece);
  
  document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    switch(e.keyCode) {
      case 37: // Left
        movePiece(-1, 0);
        break;
      case 39: // Right
        movePiece(1, 0);
        break;
      case 40: // Down
        movePiece(0, 1);
        break;
      case 38: // Up (Rotate)
        rotatePiece();
        break;
      case 32: // Space (Hard drop)
        hardDrop();
        break;
    }
  });
}

// Create a new piece
function newPiece() {
  currentPiece = Math.floor(Math.random() * 7);
  currentRotation = 0;
  currentX = Math.floor(BOARD_WIDTH / 2) - 2;
  currentY = 0;
  
  if (!isValidMove(currentPiece, currentRotation, currentX, currentY)) {
    gameOver = true;
  }
}

// Check if the move is valid
function isValidMove(piece, rotation, x, y) {
  const tetromino = tetrominoes[piece][rotation];
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      
      if (tetromino[index] === 1) {
        const newX = x + j;
        const newY = y + i;
        
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  
  return true;
}

// Move the piece
function movePiece(dx, dy) {
  if (gameOver) return;
  
  if (isValidMove(currentPiece, currentRotation, currentX + dx, currentY + dy)) {
    currentX += dx;
    currentY += dy;
    draw();
    return true;
  }
  
  // If moving down and hitting something, lock the piece
  if (dy > 0) {
    lockPiece();
  }
  
  return false;
}

// Hard drop the piece
function hardDrop() {
  while (movePiece(0, 1)) {}
}

// Rotate the piece
function rotatePiece() {
  if (gameOver) return;
  
  const newRotation = (currentRotation + 1) % 4;
  
  if (isValidMove(currentPiece, newRotation, currentX, currentY)) {
    currentRotation = newRotation;
    draw();
  }
}

// Move down automatically
function moveDown() {
  if (!gameOver) {
    movePiece(0, 1);
  }
}

// Lock the current piece into the board
function lockPiece() {
  const tetromino = tetrominoes[currentPiece][currentRotation];
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      
      if (tetromino[index] === 1) {
        const newX = currentX + j;
        const newY = currentY + i;
        
        if (newY >= 0) {
          board[newY][newX] = currentPiece + 1;
        }
      }
    }
  }
  
  // Check for completed lines
  checkLines();
  
  // Create a new piece
  newPiece();
  
  draw();
}

// Check for completed lines
function checkLines() {
  let linesCleared = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    let lineIsFull = true;
    
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] === 0) {
        lineIsFull = false;
        break;
      }
    }
    
    if (lineIsFull) {
      // Move all rows above down
      for (let y2 = y; y2 > 0; y2--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y2][x] = board[y2 - 1][x];
        }
      }
      
      // Clear the top row
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[0][x] = 0;
      }
      
      linesCleared++;
      y++; // Check the same line again
    }
  }
  
  // Update the score
  if (linesCleared > 0) {
    score += linesCleared * 100;
    scoreElement.textContent = score;
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the board
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] !== 0) {
        const colorIndex = board[y][x] - 1;
        drawBlock(x, y, colorIndex);
      }
    }
  }
  
  // Draw the current piece
  if (!gameOver) {
    const tetromino = tetrominoes[currentPiece][currentRotation];
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const index = i * 4 + j;
        
        if (tetromino[index] === 1) {
          drawBlock(currentX + j, currentY + i, currentPiece);
        }
      }
    }
  }
  
  // Draw game over
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Game Over - Score: ' + score, 20, canvas.height / 2);
  }
}

// Draw a block
function drawBlock(x, y, colorIndex) {
  ctx.fillStyle = colors[colorIndex];
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Start the game
init();`
    },
    difficulty: "advanced",
    featured: true,
    playUrl: "/play/tetris-java"
  };
};
