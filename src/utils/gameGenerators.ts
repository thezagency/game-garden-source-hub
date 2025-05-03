
import { Game } from "../types";

// Function to generate a batch of simple arcade games
export function generateSimpleArcadeGames(): Game[] {
  return [
    {
      id: "classic-pacman",
      title: "Classic Pacman",
      description: "Navigate through a maze eating dots while avoiding ghosts.",
      imageUrl: "/placeholder.svg",
      category: "arcade",
      difficulty: "beginner",
      playUrl: "/play/classic-pacman",
      sourceCode: {
        html: `<div id="game-container">
          <canvas id="gameCanvas" width="400" height="400"></canvas>
          <div id="score">Score: 0</div>
        </div>`,
        js: `
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');
          const scoreDisplay = document.getElementById('score');
          let score = 0;
          
          // Simple Pacman game initialization
          function initGame() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawMaze();
            drawPacman(100, 100);
            drawGhosts();
            scoreDisplay.textContent = 'Score: ' + score;
            
            // Game instructions
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText('Use arrow keys to move', 100, 200);
            ctx.fillText('Collect dots to score points', 100, 230);
            ctx.fillText('Avoid ghosts', 100, 260);
          }
          
          function drawMaze() {
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
            
            // Draw some maze walls
            ctx.beginPath();
            ctx.moveTo(100, 100);
            ctx.lineTo(300, 100);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(100, 300);
            ctx.lineTo(300, 300);
            ctx.stroke();
          }
          
          function drawPacman(x, y) {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(x, y, 15, 0.2 * Math.PI, 1.8 * Math.PI);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fill();
          }
          
          function drawGhosts() {
            // Red ghost
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(300, 100, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Blue ghost
            ctx.fillStyle = 'cyan';
            ctx.beginPath();
            ctx.arc(300, 300, 15, 0, Math.PI * 2);
            ctx.fill();
          }
          
          initGame();
        `
      }
    },
    {
      id: "frogger-clone",
      title: "Frogger Clone",
      description: "Help the frog cross the road while avoiding traffic.",
      imageUrl: "/placeholder.svg",
      category: "arcade",
      difficulty: "intermediate",
      playUrl: "/play/frogger-clone",
      sourceCode: {
        html: `<div id="game-container">
          <canvas id="gameCanvas" width="400" height="400"></canvas>
          <div id="status">Lives: 3</div>
        </div>`,
        js: `
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');
          const statusDisplay = document.getElementById('status');
          let lives = 3;
          
          // Simple Frogger game initialization
          function initGame() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawRoad();
            drawFrog(200, 350);
            drawCars();
            statusDisplay.textContent = 'Lives: ' + lives;
            
            // Game instructions
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText('Use arrow keys to move the frog', 100, 50);
            ctx.fillText('Avoid cars and reach the top', 100, 80);
          }
          
          function drawRoad() {
            // Draw road
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 100, canvas.width, 200);
            
            // Draw lane markings
            ctx.strokeStyle = 'white';
            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(0, 200);
            ctx.lineTo(canvas.width, 200);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          
          function drawFrog(x, y) {
            ctx.fillStyle = 'green';
            ctx.fillRect(x - 15, y - 15, 30, 30);
            
            // Draw eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x - 5, y - 5, 5, 0, Math.PI * 2);
            ctx.arc(x + 5, y - 5, 5, 0, Math.PI * 2);
            ctx.fill();
          }
          
          function drawCars() {
            // Car 1
            ctx.fillStyle = 'red';
            ctx.fillRect(50, 150, 60, 30);
            
            // Car 2
            ctx.fillStyle = 'blue';
            ctx.fillRect(200, 250, 60, 30);
            
            // Car 3
            ctx.fillStyle = 'yellow';
            ctx.fillRect(300, 120, 60, 30);
          }
          
          initGame();
        `
      }
    },
    {
      id: "space-invaders",
      title: "Space Invaders",
      description: "Defend Earth from alien invaders in this classic arcade game.",
      imageUrl: "/placeholder.svg",
      category: "arcade",
      difficulty: "intermediate",
      playUrl: "/play/space-invaders",
      sourceCode: {
        html: `<div id="game-container">
          <canvas id="gameCanvas" width="400" height="500"></canvas>
          <div id="score">Score: 0</div>
        </div>`,
        js: `
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');
          const scoreDisplay = document.getElementById('score');
          let score = 0;
          
          // Space Invaders initialization
          function initGame() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawPlayer(200, 450);
            drawAliens();
            scoreDisplay.textContent = 'Score: ' + score;
            
            // Game instructions
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText('Left/Right to move', 130, 30);
            ctx.fillText('Space to shoot', 150, 60);
          }
          
          function drawPlayer(x, y) {
            ctx.fillStyle = 'lime';
            ctx.beginPath();
            ctx.moveTo(x, y - 20);
            ctx.lineTo(x - 20, y);
            ctx.lineTo(x + 20, y);
            ctx.closePath();
            ctx.fill();
          }
          
          function drawAliens() {
            const rows = 3;
            const cols = 6;
            const width = 30;
            const height = 20;
            const padding = 15;
            
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                const x = 50 + (c * (width + padding));
                const y = 100 + (r * (height + padding));
                
                // Alternate alien colors by row
                if (r % 2 === 0) {
                  ctx.fillStyle = '#FF4136';
                } else {
                  ctx.fillStyle = '#7FDBFF';
                }
                
                ctx.fillRect(x, y, width, height);
              }
            }
          }
          
          initGame();
        `
      }
    }
  ];
}

// Function to generate a batch of puzzle games
export function generatePuzzleGames(): Game[] {
  return [
    {
      id: "sliding-puzzle",
      title: "15 Puzzle",
      description: "Arrange the tiles in numerical order by sliding them into the empty space.",
      imageUrl: "/placeholder.svg",
      category: "puzzle",
      difficulty: "beginner",
      playUrl: "/play/sliding-puzzle",
      sourceCode: {
        html: `<div id="game-container">
          <div id="puzzle-board"></div>
          <div id="moves">Moves: 0</div>
          <button id="restart-button">Restart</button>
        </div>`,
        css: `
          #puzzle-board {
            display: grid;
            grid-template-columns: repeat(4, 60px);
            grid-template-rows: repeat(4, 60px);
            gap: 5px;
            margin: 20px auto;
            width: 255px;
          }
          .tile {
            width: 60px;
            height: 60px;
            background-color: #3498db;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            border-radius: 5px;
          }
          .empty {
            background-color: #f0f0f0;
            border: 2px dashed #ccc;
          }
          #moves {
            text-align: center;
            margin: 10px;
            font-size: 18px;
          }
          #restart-button {
            display: block;
            margin: 10px auto;
            padding: 8px 16px;
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        `,
        js: `
          const board = document.getElementById('puzzle-board');
          const movesDisplay = document.getElementById('moves');
          const restartButton = document.getElementById('restart-button');
          let tiles = [];
          let emptyPos = 15;
          let moves = 0;
          
          function initPuzzle() {
            board.innerHTML = '';
            moves = 0;
            movesDisplay.textContent = 'Moves: ' + moves;
            
            // Create a solved puzzle first
            tiles = Array.from({ length: 15 }, (_, i) => i + 1);
            tiles.push(0); // Empty tile represented as 0
            
            // Draw the board
            drawBoard();
            
            // Shuffle the board with legal moves
            shuffleBoard(100);
          }
          
          function drawBoard() {
            board.innerHTML = '';
            for (let i = 0; i < 16; i++) {
              const tile = document.createElement('div');
              const value = tiles[i];
              
              if (value === 0) {
                tile.className = 'tile empty';
                emptyPos = i;
              } else {
                tile.className = 'tile';
                tile.textContent = value;
                tile.addEventListener('click', () => moveTile(i));
              }
              
              board.appendChild(tile);
            }
          }
          
          function moveTile(index) {
            // Check if the clicked tile is adjacent to the empty space
            if (isAdjacent(index, emptyPos)) {
              // Swap the tile with the empty space
              [tiles[index], tiles[emptyPos]] = [tiles[emptyPos], tiles[index]];
              emptyPos = index;
              moves++;
              movesDisplay.textContent = 'Moves: ' + moves;
              
              // Redraw the board
              drawBoard();
              
              // Check if puzzle is solved
              if (isSolved()) {
                setTimeout(() => {
                  alert('Puzzle solved in ' + moves + ' moves!');
                }, 100);
              }
            }
          }
          
          function isAdjacent(index1, index2) {
            const row1 = Math.floor(index1 / 4);
            const col1 = index1 % 4;
            const row2 = Math.floor(index2 / 4);
            const col2 = index2 % 4;
            
            return (
              (Math.abs(row1 - row2) === 1 && col1 === col2) ||
              (Math.abs(col1 - col2) === 1 && row1 === row2)
            );
          }
          
          function isSolved() {
            for (let i = 0; i < 15; i++) {
              if (tiles[i] !== i + 1) return false;
            }
            return tiles[15] === 0;
          }
          
          function shuffleBoard(moves) {
            // Make a series of random legal moves
            for (let i = 0; i < moves; i++) {
              const possibleMoves = [];
              
              // Check all four directions
              const directions = [
                emptyPos - 4, // up
                emptyPos + 4, // down
                emptyPos - 1, // left
                emptyPos + 1  // right
              ];
              
              // Filter valid moves
              for (const pos of directions) {
                if (pos >= 0 && pos < 16 && isAdjacent(emptyPos, pos)) {
                  possibleMoves.push(pos);
                }
              }
              
              // Make a random move
              const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
              [tiles[randomMove], tiles[emptyPos]] = [tiles[emptyPos], tiles[randomMove]];
              emptyPos = randomMove;
            }
            
            drawBoard();
          }
          
          // Initialize game
          initPuzzle();
          
          // Restart button
          restartButton.addEventListener('click', initPuzzle);
        `
      }
    },
    {
      id: "math-puzzle",
      title: "Math Challenge",
      description: "Solve math problems in a fun and interactive way.",
      imageUrl: "/placeholder.svg",
      category: "puzzle",
      difficulty: "beginner",
      playUrl: "/play/math-puzzle",
      sourceCode: {
        html: `<div id="game-container">
          <div id="question">What is 5 + 3?</div>
          <div id="answers">
            <button class="answer-btn">6</button>
            <button class="answer-btn">7</button>
            <button class="answer-btn">8</button>
            <button class="answer-btn">9</button>
          </div>
          <div id="score">Score: 0</div>
          <div id="timer">Time: 30s</div>
        </div>`,
        css: `
          #game-container {
            text-align: center;
            padding: 20px;
          }
          #question {
            font-size: 24px;
            margin: 20px 0;
            font-weight: bold;
          }
          #answers {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            max-width: 300px;
            margin: 0 auto;
          }
          .answer-btn {
            padding: 15px;
            font-size: 18px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .answer-btn:hover {
            background-color: #2980b9;
          }
          #score, #timer {
            margin-top: 20px;
            font-size: 18px;
          }
          .correct {
            background-color: #2ecc71 !important;
          }
          .incorrect {
            background-color: #e74c3c !important;
          }
        `,
        js: `
          const questionElement = document.getElementById('question');
          const answerButtons = document.querySelectorAll('.answer-btn');
          const scoreElement = document.getElementById('score');
          const timerElement = document.getElementById('timer');
          
          let score = 0;
          let timeLeft = 30;
          let timer;
          let num1, num2, answer;
          const maxNum = 10;
          
          // Initialize the game
          function startGame() {
            score = 0;
            timeLeft = 30;
            scoreElement.textContent = "Score: " + score;
            
            // Start the timer
            timer = setInterval(updateTimer, 1000);
            
            // Generate first question
            generateQuestion();
          }
          
          function updateTimer() {
            timeLeft--;
            timerElement.textContent = "Time: " + timeLeft + "s";
            
            if (timeLeft <= 0) {
              clearInterval(timer);
              endGame();
            }
          }
          
          function generateQuestion() {
            // Generate two random numbers and an operation
            const operation = Math.floor(Math.random() * 3); // 0: add, 1: subtract, 2: multiply
            
            switch(operation) {
              case 0: // Addition
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                answer = num1 + num2;
                questionElement.textContent = "What is " + num1 + " + " + num2 + "?";
                break;
              case 1: // Subtraction (ensure positive answer)
                num1 = Math.floor(Math.random() * maxNum) + 5;
                num2 = Math.floor(Math.random() * num1);
                answer = num1 - num2;
                questionElement.textContent = "What is " + num1 + " - " + num2 + "?";
                break;
              case 2: // Multiplication (small numbers)
                num1 = Math.floor(Math.random() * 5) + 1;
                num2 = Math.floor(Math.random() * 5) + 1;
                answer = num1 * num2;
                questionElement.textContent = "What is " + num1 + " × " + num2 + "?";
                break;
            }
            
            // Generate answer choices with one correct answer
            const answerOptions = [answer];
            
            // Generate 3 unique incorrect answers
            while (answerOptions.length < 4) {
              let incorrect = Math.floor(Math.random() * (maxNum * 2)) + 1;
              if (!answerOptions.includes(incorrect) && incorrect !== answer) {
                answerOptions.push(incorrect);
              }
            }
            
            // Shuffle the answers
            const shuffledAnswers = answerOptions.sort(() => Math.random() - 0.5);
            
            // Set the answers on the buttons
            answerButtons.forEach((button, index) => {
              button.textContent = shuffledAnswers[index];
              button.classList.remove('correct', 'incorrect');
            });
          }
          
          // Add event listeners to answer buttons
          answerButtons.forEach(button => {
            button.addEventListener('click', () => {
              const selectedAnswer = parseInt(button.textContent);
              
              if (selectedAnswer === answer) {
                button.classList.add('correct');
                score += 10;
                scoreElement.textContent = "Score: " + score;
                
                // Add a bit of time as a reward
                timeLeft += 2;
                timerElement.textContent = "Time: " + timeLeft + "s";
                
                setTimeout(() => {
                  generateQuestion();
                }, 1000);
              } else {
                button.classList.add('incorrect');
                // Find and highlight the correct answer
                answerButtons.forEach(btn => {
                  if (parseInt(btn.textContent) === answer) {
                    btn.classList.add('correct');
                  }
                });
                
                // Penalty
                timeLeft -= 3;
                if (timeLeft < 0) timeLeft = 0;
                timerElement.textContent = "Time: " + timeLeft + "s";
                
                setTimeout(() => {
                  generateQuestion();
                }, 1500);
              }
            });
          });
          
          function endGame() {
            questionElement.textContent = "Time's up! Final score: " + score;
            
            // Disable answer buttons
            answerButtons.forEach(button => {
              button.disabled = true;
            });
            
            // Show replay option after 2 seconds
            setTimeout(() => {
              questionElement.textContent += "\\nClick any button to play again";
              
              answerButtons.forEach(button => {
                button.textContent = "Play Again";
                button.disabled = false;
                button.addEventListener('click', () => {
                  location.reload();
                }, { once: true });
              });
            }, 2000);
          }
          
          // Start the game
          startGame();
        `
      }
    }
  ];
}

// Function to generate a batch of strategy games
export function generateStrategyGames(): Game[] {
  return [
    {
      id: "simple-chess",
      title: "Simple Chess",
      description: "A simplified version of chess with basic piece movement.",
      imageUrl: "/placeholder.svg",
      category: "strategy",
      difficulty: "advanced",
      playUrl: "/play/simple-chess",
      sourceCode: {
        html: `<div id="game-container">
          <div id="chess-board"></div>
          <div id="status">White's turn</div>
        </div>`,
        css: `
          #chess-board {
            width: 400px;
            height: 400px;
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            grid-template-rows: repeat(8, 1fr);
            border: 2px solid #333;
            margin: 0 auto;
          }
          .square {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            cursor: pointer;
          }
          .white {
            background-color: #f0d9b5;
          }
          .black {
            background-color: #b58863;
          }
          .selected {
            background-color: #58a4b0;
          }
          .possible-move {
            background-color: #8cd3ff;
          }
          #status {
            text-align: center;
            margin-top: 15px;
            font-size: 18px;
            font-weight: bold;
          }
        `,
        js: `
          const chessBoard = document.getElementById('chess-board');
          const statusDisplay = document.getElementById('status');
          let selectedPiece = null;
          let currentPlayer = 'white';
          
          // Chess pieces with Unicode symbols
          const pieces = {
            'white': {
              'pawn': '♙',
              'rook': '♖',
              'knight': '♘',
              'bishop': '♗',
              'queen': '♕',
              'king': '♔'
            },
            'black': {
              'pawn': '♟',
              'rook': '♜',
              'knight': '♞',
              'bishop': '♝',
              'queen': '♛',
              'king': '♚'
            }
          };
          
          // Initialize board state
          let board = Array(8).fill().map(() => Array(8).fill(null));
          
          function initializeBoard() {
            // Set up pawns
            for (let i = 0; i < 8; i++) {
              board[1][i] = { type: 'pawn', color: 'black' };
              board[6][i] = { type: 'pawn', color: 'white' };
            }
            
            // Set up back row pieces
            const backRowOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
            for (let i = 0; i < 8; i++) {
              board[0][i] = { type: backRowOrder[i], color: 'black' };
              board[7][i] = { type: backRowOrder[i], color: 'white' };
            }
            
            renderBoard();
          }
          
          function renderBoard() {
            chessBoard.innerHTML = '';
            
            for (let row = 0; row < 8; row++) {
              for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = "square " + ((row + col) % 2 === 0 ? 'white' : 'black');
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = board[row][col];
                if (piece) {
                  square.textContent = pieces[piece.color][piece.type];
                }
                
                square.addEventListener('click', () => handleSquareClick(row, col));
                chessBoard.appendChild(square);
              }
            }
          }
          
          function handleSquareClick(row, col) {
            // Clear previous highlights
            clearHighlights();
            
            const clickedPiece = board[row][col];
            
            // If no piece is selected and the clicked square has a piece of the current player
            if (!selectedPiece && clickedPiece && clickedPiece.color === currentPlayer) {
              selectedPiece = { row, col, ...clickedPiece };
              highlightSquare(row, col, 'selected');
              highlightPossibleMoves(row, col, clickedPiece);
            } 
            // If a piece is already selected
            else if (selectedPiece) {
              // If clicking on a different piece of the same color, select that piece instead
              if (clickedPiece && clickedPiece.color === currentPlayer) {
                selectedPiece = { row, col, ...clickedPiece };
                highlightSquare(row, col, 'selected');
                highlightPossibleMoves(row, col, clickedPiece);
              } 
              // Try to move the selected piece
              else if (isValidMove(selectedPiece, row, col)) {
                movePiece(selectedPiece, row, col);
                selectedPiece = null;
                
                // Switch players
                currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
                statusDisplay.textContent = currentPlayer.charAt(0).toUpperCase() + 
                                          currentPlayer.slice(1) + "'s turn";
              } 
              // Invalid move, deselect
              else {
                selectedPiece = null;
              }
            }
          }
          
          function isValidMove(piece, newRow, newCol) {
            // This is a simplified move validation
            // In a real chess game, we'd need much more complex logic
            
            // Can't move to a square with your own piece
            if (board[newRow][newCol] && board[newRow][newCol].color === piece.color) {
              return false;
            }
            
            // Basic movement rules for each piece type
            switch(piece.type) {
              case 'pawn':
                if (piece.color === 'white') {
                  // Forward movement (no capture)
                  if (newCol === piece.col && !board[newRow][newCol]) {
                    // Move one square forward
                    if (newRow === piece.row - 1) {
                      return true;
                    }
                    // First move can be two squares
                    if (piece.row === 6 && newRow === 4 && !board[5][newCol]) {
                      return true;
                    }
                  }
                  // Diagonal capture
                  if (Math.abs(newCol - piece.col) === 1 && newRow === piece.row - 1) {
                    return board[newRow][newCol] && board[newRow][newCol].color !== piece.color;
                  }
                } else { // Black pawn
                  // Forward movement (no capture)
                  if (newCol === piece.col && !board[newRow][newCol]) {
                    // Move one square forward
                    if (newRow === piece.row + 1) {
                      return true;
                    }
                    // First move can be two squares
                    if (piece.row === 1 && newRow === 3 && !board[2][newCol]) {
                      return true;
                    }
                  }
                  // Diagonal capture
                  if (Math.abs(newCol - piece.col) === 1 && newRow === piece.row + 1) {
                    return board[newRow][newCol] && board[newRow][newCol].color !== piece.color;
                  }
                }
                return false;
              
              case 'rook':
                // Rook moves in straight lines
                if (newRow === piece.row || newCol === piece.col) {
                  return !isPieceInPath(piece.row, piece.col, newRow, newCol);
                }
                return false;
              
              case 'knight':
                // Knight moves in an L shape
                return (Math.abs(newRow - piece.row) === 2 && Math.abs(newCol - piece.col) === 1) ||
                      (Math.abs(newRow - piece.row) === 1 && Math.abs(newCol - piece.col) === 2);
              
              case 'bishop':
                // Bishop moves diagonally
                if (Math.abs(newRow - piece.row) === Math.abs(newCol - piece.col)) {
                  return !isPieceInPath(piece.row, piece.col, newRow, newCol);
                }
                return false;
              
              case 'queen':
                // Queen moves like rook or bishop
                if (newRow === piece.row || newCol === piece.col || 
                    Math.abs(newRow - piece.row) === Math.abs(newCol - piece.col)) {
                  return !isPieceInPath(piece.row, piece.col, newRow, newCol);
                }
                return false;
              
              case 'king':
                // King moves one square in any direction
                return Math.abs(newRow - piece.row) <= 1 && Math.abs(newCol - piece.col) <= 1;
              
              default:
                return false;
            }
          }
          
          function isPieceInPath(startRow, startCol, endRow, endCol) {
            // For straight lines (rook moves)
            if (startRow === endRow) {
              const minCol = Math.min(startCol, endCol);
              const maxCol = Math.max(startCol, endCol);
              for (let col = minCol + 1; col < maxCol; col++) {
                if (board[startRow][col]) {
                  return true; // There's a piece in the way
                }
              }
            } else if (startCol === endCol) {
              const minRow = Math.min(startRow, endRow);
              const maxRow = Math.max(startRow, endRow);
              for (let row = minRow + 1; row < maxRow; row++) {
                if (board[row][startCol]) {
                  return true; // There's a piece in the way
                }
              }
            } 
            // For diagonals (bishop moves)
            else if (Math.abs(endRow - startRow) === Math.abs(endCol - startCol)) {
              const rowStep = endRow > startRow ? 1 : -1;
              const colStep = endCol > startCol ? 1 : -1;
              let row = startRow + rowStep;
              let col = startCol + colStep;
              
              while (row !== endRow && col !== endCol) {
                if (board[row][col]) {
                  return true; // There's a piece in the way
                }
                row += rowStep;
                col += colStep;
              }
            }
            
            return false; // Path is clear
          }
          
          function movePiece(piece, newRow, newCol) {
            // Move the piece on the board
            board[newRow][newCol] = {
              type: piece.type, 
              color: piece.color
            };
            board[piece.row][piece.col] = null;
            
            // Check for pawn promotion (simplified - always promote to queen)
            if (piece.type === 'pawn' && (newRow === 0 || newRow === 7)) {
              board[newRow][newCol].type = 'queen';
            }
            
            renderBoard();
          }
          
          function clearHighlights() {
            const squares = document.querySelectorAll('.square');
            squares.forEach(square => {
              square.classList.remove('selected', 'possible-move');
            });
          }
          
          function highlightSquare(row, col, className) {
            const square = document.querySelector(
              \`.square[data-row="\${row}"][data-col="\${col}"]\`
            );
            if (square) {
              square.classList.add(className);
            }
          }
          
          function highlightPossibleMoves(row, col, piece) {
            // This is simplified and just highlights some potential moves
            // In a real chess game, you'd need to calculate all valid moves
            for (let r = 0; r < 8; r++) {
              for (let c = 0; c < 8; c++) {
                if (isValidMove({ row, col, ...piece }, r, c)) {
                  highlightSquare(r, c, 'possible-move');
                }
              }
            }
          }
          
          // Initialize the chess game
          initializeBoard();
        `
      }
    },
    {
      id: "tic-tac-toe-advanced",
      title: "Advanced Tic-Tac-Toe",
      description: "Play tic-tac-toe against a smart computer opponent.",
      imageUrl: "/placeholder.svg",
      category: "strategy",
      difficulty: "beginner",
      playUrl: "/play/tic-tac-toe-advanced",
      sourceCode: {
        html: `<div id="game-container">
          <div id="board"></div>
          <div id="status">Your turn (X)</div>
          <button id="restart">New Game</button>
        </div>`,
        css: `
          #game-container {
            text-align: center;
            max-width: 300px;
            margin: 0 auto;
          }
          #board {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }
          .cell {
            width: 80px;
            height: 80px;
            background-color: #f0f0f0;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .cell:hover {
            background-color: #e0e0e0;
          }
          #status {
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: bold;
          }
          #restart {
            padding: 8px 16px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          #restart:hover {
            background-color: #2980b9;
          }
        `,
        js: `
          const board = document.getElementById('board');
          const statusDisplay = document.getElementById('status');
          const restartButton = document.getElementById('restart');
          
          let gameActive = true;
          let currentPlayer = 'X';
          let gameState = ['', '', '', '', '', '', '', '', ''];
          
          const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
          ];
          
          function initializeGame() {
            board.innerHTML = '';
            gameState = ['', '', '', '', '', '', '', '', ''];
            gameActive = true;
            currentPlayer = 'X';
            statusDisplay.textContent = "Your turn (X)";
            
            // Create the board
            for (let i = 0; i < 9; i++) {
              const cell = document.createElement('div');
              cell.classList.add('cell');
              cell.dataset.cellIndex = i;
              cell.addEventListener('click', () => handleCellClick(i));
              board.appendChild(cell);
            }
          }
          
          function handleCellClick(clickedCellIndex) {
            // Don't allow moves on filled cells or when game is over
            if (gameState[clickedCellIndex] !== '' || !gameActive) {
              return;
            }
            
            // Make player's move
            gameState[clickedCellIndex] = currentPlayer;
            updateCell(clickedCellIndex, currentPlayer);
            
            // Check for win or draw
            if (checkWin()) {
              statusDisplay.textContent = "You won!";
              gameActive = false;
              return;
            }
            
            if (checkDraw()) {
              statusDisplay.textContent = "It's a draw!";
              gameActive = false;
              return;
            }
            
            // Switch to computer's turn
            currentPlayer = 'O';
            statusDisplay.textContent = "Computer thinking...";
            
            // Computer makes a move after a short delay
            setTimeout(() => {
              makeComputerMove();
            }, 800);
          }
          
          function makeComputerMove() {
            if (!gameActive) return;
            
            // Try to find a winning move
            const winningMove = findBestMove(gameState, 'O');
            
            gameState[winningMove] = 'O';
            updateCell(winningMove, 'O');
            
            // Check for win or draw
            if (checkWin()) {
              statusDisplay.textContent = "Computer won!";
              gameActive = false;
              return;
            }
            
            if (checkDraw()) {
              statusDisplay.textContent = "It's a draw!";
              gameActive = false;
              return;
            }
            
            // Switch back to player's turn
            currentPlayer = 'X';
            statusDisplay.textContent = "Your turn (X)";
          }
          
          function updateCell(index, value) {
            document.querySelector([\`[data-cell-index="\${index}"]\`]).textContent = value;
          }
          
          function checkWin() {
            for (let i = 0; i < winningConditions.length; i++) {
              const [a, b, c] = winningConditions[i];
              if (
                gameState[a] !== '' &&
                gameState[a] === gameState[b] &&
                gameState[a] === gameState[c]
              ) {
                return true;
              }
            }
            return false;
          }
          
          function checkDraw() {
            return !gameState.includes('');
          }
          
          function findBestMove(board, player) {
            // First try to win
            for (let i = 0; i < winningConditions.length; i++) {
              const [a, b, c] = winningConditions[i];
              // Check if we can win in one move
              if (board[a] === player && board[b] === player && board[c] === '') {
                return c;
              }
              if (board[a] === player && board[c] === player && board[b] === '') {
                return b;
              }
              if (board[b] === player && board[c] === player && board[a] === '') {
                return a;
              }
            }
            
            // Block player's winning move
            const opponent = player === 'X' ? 'O' : 'X';
            for (let i = 0; i < winningConditions.length; i++) {
              const [a, b, c] = winningConditions[i];
              // Check if opponent can win in one move and block it
              if (board[a] === opponent && board[b] === opponent && board[c] === '') {
                return c;
              }
              if (board[a] === opponent && board[c] === opponent && board[b] === '') {
                return b;
              }
              if (board[b] === opponent && board[c] === opponent && board[a] === '') {
                return a;
              }
            }
            
            // Take center if available
            if (board[4] === '') {
              return 4;
            }
            
            // Take corners if available
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(corner => board[corner] === '');
            if (availableCorners.length > 0) {
              return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }
            
            // Take any available square
            const availableMoves = [];
            for (let i = 0; i < board.length; i++) {
              if (board[i] === '') {
                availableMoves.push(i);
              }
            }
            
            if (availableMoves.length > 0) {
              return availableMoves[Math.floor(Math.random() * availableMoves.length)];
            }
            
            // No moves available (shouldn't happen in this game)
            return -1;
          }
          
          // Initialize and add restart functionality
          initializeGame();
          restartButton.addEventListener('click', initializeGame);
        `
      }
    }
  ];
}

// Function to generate a batch of action games
export function generateActionGames(): Game[] {
  return [
    {
      id: "platform-jumper",
      title: "Platform Jumper",
      description: "Jump from platform to platform collecting coins.",
      imageUrl: "/placeholder.svg",
      category: "action",
      difficulty: "intermediate",
      playUrl: "/play/platform-jumper",
      sourceCode: {
        html: `<div id="game-container">
          <canvas id="gameCanvas" width="800" height="500"></canvas>
          <div id="info">
            <div id="score">Score: 0</div>
            <div id="lives">Lives: 3</div>
          </div>
        </div>`,
        css: `
          #game-container {
            position: relative;
            width: 800px;
            margin: 0 auto;
          }
          #gameCanvas {
            background: #333;
            border-radius: 5px;
            border: 1px solid #555;
          }
          #info {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 18px;
            font-weight: bold;
            color: white;
          }
        `,
        js: `
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');
          const scoreDisplay = document.getElementById('score');
          const livesDisplay = document.getElementById('lives');
          
          // Game variables
          let score = 0;
          let lives = 3;
          let isGameOver = false;
          let platforms = [];
          let coins = [];
          let player = {
            x: 100,
            y: 200,
            width: 30,
            height: 40,
            velocityX: 0,
            velocityY: 0,
            isJumping: false,
            jumpPower: -12,
            speed: 5,
            gravity: 0.5,
          };
          
          // Key tracking
          const keys = {
            right: false,
            left: false,
            up: false
          };
          
          // Event listeners for keyboard controls
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') keys.right = true;
            if (e.key === 'ArrowLeft') keys.left = true;
            if (e.key === 'ArrowUp') keys.up = true;
          });
          
          document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight') keys.right = false;
            if (e.key === 'ArrowLeft') keys.left = false;
            if (e.key === 'ArrowUp') keys.up = false;
          });
          
          // Initialize platforms
          function initPlatforms() {
            platforms = [
              { x: 0, y: 450, width: 800, height: 50 }, // Ground
              { x: 200, y: 350, width: 100, height: 20 },
              { x: 400, y: 300, width: 100, height: 20 },
              { x: 600, y: 250, width: 100, height: 20 },
              { x: 150, y: 200, width: 100, height: 20 },
              { x: 350, y: 150, width: 100, height: 20 },
              { x: 550, y: 100, width: 100, height: 20 }
            ];
          }
          
          // Initialize coins
          function initCoins() {
            coins = [];
            platforms.forEach(platform => {
              if (Math.random() > 0.3 && platform.y < 450) { // Don't always place coins, skip ground
                coins.push({
                  x: platform.x + platform.width / 2,
                  y: platform.y - 30,
                  width: 20,
                  height: 20,
                  collected: false
                });
              }
            });
          }
          
          // Check collisions between player and platforms
          function checkPlatformCollision() {
            for (const platform of platforms) {
              if (
                player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height <= platform.y &&
                player.y + player.height + player.velocityY >= platform.y
              ) {
                return platform;
              }
            }
            return null;
          }
          
          // Check collisions between player and coins
          function checkCoinCollision() {
            for (const coin of coins) {
              if (
                !coin.collected &&
                player.x < coin.x + coin.width &&
                player.x + player.width > coin.x &&
                player.y < coin.y + coin.height &&
                player.y + player.height > coin.y
              ) {
                coin.collected = true;
                score += 10;
                scoreDisplay.textContent = "Score: " + score;
              }
            }
          }
          
          // Update game state
          function update() {
            if (isGameOver) {
              drawGameOver();
              return;
            }
            
            // Handle player input
            if (keys.right) {
              player.velocityX = player.speed;
            } else if (keys.left) {
              player.velocityX = -player.speed;
            } else {
              player.velocityX = 0;
            }
            
            // Apply gravity
            player.velocityY += player.gravity;
            
            // Handle jumping
            if (keys.up && !player.isJumping) {
              player.velocityY = player.jumpPower;
              player.isJumping = true;
            }
            
            // Update player position
            player.x += player.velocityX;
            player.y += player.velocityY;
            
            // Check boundaries
            if (player.x < 0) player.x = 0;
            if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
            
            // Check if fallen off the screen
            if (player.y > canvas.height) {
              lives--;
              livesDisplay.textContent = "Lives: " + lives;
              
              if (lives <= 0) {
                isGameOver = true;
              } else {
                // Reset player position
                player.x = 100;
                player.y = 200;
                player.velocityY = 0;
              }
            }
            
            // Check platform collision
            const platform = checkPlatformCollision();
            if (platform) {
              player.y = platform.y - player.height;
              player.velocityY = 0;
              player.isJumping = false;
            }
            
            // Check coin collision
            checkCoinCollision();
            
            // Check if all coins collected - victory condition
            if (coins.every(coin => coin.collected)) {
              initCoins(); // Generate new coins when all are collected
              score += 50; // Bonus for collecting all coins
              scoreDisplay.textContent = "Score: " + score;
            }
          }
          
          // Draw game elements
          function draw() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw platforms
            ctx.fillStyle = '#8B4513'; // Brown for platforms
            platforms.forEach(platform => {
              ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            });
            
            // Draw coins
            ctx.fillStyle = 'gold';
            coins.forEach(coin => {
              if (!coin.collected) {
                ctx.beginPath();
                ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, 
                     coin.width / 2, 0, Math.PI * 2);
                ctx.fill();
              }
            });
            
            // Draw player
            ctx.fillStyle = '#FF6347'; // Tomato color for player
            ctx.fillRect(player.x, player.y, player.width, player.height);
            
            // Draw player eyes
            ctx.fillStyle = 'white';
            ctx.fillRect(player.x + 7, player.y + 8, 5, 5);
            ctx.fillRect(player.x + 18, player.y + 8, 5, 5);
          }
          
          function drawGameOver() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
            
            ctx.font = '24px Arial';
            ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2);
            ctx.fillText("Press SPACE to play again", canvas.width / 2, canvas.height / 2 + 50);
            
            // Listen for space to restart
            document.addEventListener('keydown', function restartHandler(e) {
              if (e.code === 'Space') {
                document.removeEventListener('keydown', restartHandler);
                resetGame();
              }
            });
          }
          
          function resetGame() {
            player.x = 100;
            player.y = 200;
            player.velocityY = 0;
            score = 0;
            lives = 3;
            isGameOver = false;
            
            scoreDisplay.textContent = "Score: " + score;
            livesDisplay.textContent = "Lives: " + lives;
            
            initPlatforms();
            initCoins();
          }
          
          // Game loop
          function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
          }
          
          // Initialize the game
          function initGame() {
            initPlatforms();
            initCoins();
            gameLoop();
          }
          
          // Start the game
          initGame();
        `
      }
    },
    {
      id: "space-shooter",
      title: "Space Shooter",
      description: "Shoot down alien ships before they destroy you.",
      imageUrl: "/placeholder.svg",
      category: "action",
      difficulty: "intermediate",
      playUrl: "/play/space-shooter",
      sourceCode: {
        html: `<div id="game-container">
          <canvas id="gameCanvas" width="600" height="700"></canvas>
          <div id="ui">
            <div id="score">Score: 0</div>
            <div id="lives">Lives: 3</div>
          </div>
        </div>`,
        css: `
          #game-container {
            position: relative;
            width: 600px;
            margin: 0 auto;
          }
          #gameCanvas {
            background: #000;
            display: block;
            margin: 0 auto;
          }
          #ui {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 20px;
            font-weight: bold;
            color: white;
          }
        `,
        js: `
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');
          const scoreDisplay = document.getElementById('score');
          const livesDisplay = document.getElementById('lives');
          
          let score = 0;
          let lives = 3;
          let gameOver = false;
          
          // Game entities
          let player = {
            x: canvas.width / 2,
            y: canvas.height - 60,
            width: 50,
            height: 50,
            speed: 6,
            color: '#3498db'
          };
          
          let bullets = [];
          let enemies = [];
          let stars = [];
          
          // Key states
          const keys = {
            left: false,
            right: false,
            space: false
          };
          
          // Add event listeners
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') keys.left = true;
            if (e.key === 'ArrowRight') keys.right = true;
            if (e.key === ' ') keys.space = true;
            
            // Restart on Enter if game over
            if (gameOver && e.key === 'Enter') {
              resetGame();
            }
          });
          
          document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') keys.left = false;
            if (e.key === 'ArrowRight') keys.right = false;
            if (e.key === ' ') keys.space = false;
          });
          
          // Generate background stars
          function createStars() {
            for (let i = 0; i < 100; i++) {
              stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3,
                speed: 0.5 + Math.random() * 1
              });
            }
          }
          
          // Update star positions
          function updateStars() {
            for (let i = 0; i < stars.length; i++) {
              stars[i].y += stars[i].speed;
              
              // If star goes off screen, reset to top
              if (stars[i].y > canvas.height) {
                stars[i].y = 0;
                stars[i].x = Math.random() * canvas.width;
              }
            }
          }
          
          // Draw stars
          function drawStars() {
            ctx.fillStyle = 'white';
            for (let i = 0; i < stars.length; i++) {
              ctx.beginPath();
              ctx.arc(stars[i].x, stars[i].y, stars[i].size, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          
          // Create a new bullet
          function createBullet() {
            if (!gameOver) {
              bullets.push({
                x: player.x + player.width / 2 - 2.5,
                y: player.y,
                width: 5,
                height: 15,
                color: '#FFF',
                speed: 7
              });
            }
          }
          
          // Create a new enemy
          function createEnemy() {
            if (!gameOver && enemies.length < 10) {
              enemies.push({
                x: Math.random() * (canvas.width - 40),
                y: -50,
                width: 40,
                height: 40,
                color: '#e74c3c',
                speed: 2 + Math.random() * 3
              });
            }
          }
          
          // Update game state
          function update() {
            if (gameOver) {
              displayGameOver();
              return;
            }
            
            // Update player position
            if (keys.left && player.x > 0) {
              player.x -= player.speed;
            }
            if (keys.right && player.x < canvas.width - player.width) {
              player.x += player.speed;
            }
            
            // Shoot bullets
            if (keys.space) {
              // Limit fire rate with a simple timer
              if (!player.lastShot || Date.now() - player.lastShot > 300) {
                createBullet();
                player.lastShot = Date.now();
              }
            }
            
            // Update bullet positions
            for (let i = 0; i < bullets.length; i++) {
              bullets[i].y -= bullets[i].speed;
              
              // Remove bullets that go off screen
              if (bullets[i].y < 0) {
                bullets.splice(i, 1);
                i--;
              }
            }
            
            // Update enemy positions and check collisions
            for (let i = 0; i < enemies.length; i++) {
              enemies[i].y += enemies[i].speed;
              
              // Check for collisions with bullets
              for (let j = 0; j < bullets.length; j++) {
                if (checkCollision(bullets[j], enemies[i])) {
                  // Enemy hit
                  score += 10;
                  scoreDisplay.textContent = "Score: " + score;
                  
                  enemies.splice(i, 1);
                  bullets.splice(j, 1);
                  i--;
                  break;
                }
              }
              
              // Check if enemy passed the screen
              if (enemies[i] && enemies[i].y > canvas.height) {
                lives--;
                livesDisplay.textContent = "Lives: " + lives;
                enemies.splice(i, 1);
                i--;
                
                if (lives <= 0) {
                  gameOver = true;
                }
              }
              
              // Check for collision with player
              if (enemies[i] && checkCollision(player, enemies[i])) {
                lives--;
                livesDisplay.textContent = "Lives: " + lives;
                enemies.splice(i, 1);
                i--;
                
                if (lives <= 0) {
                  gameOver = true;
                }
              }
            }
            
            // Periodically create new enemies
            if (Math.random() < 0.03) {
              createEnemy();
            }
            
            // Update stars
            updateStars();
          }
          
          // Check collision between two objects
          function checkCollision(obj1, obj2) {
            return (
              obj1.x < obj2.x + obj2.width &&
              obj1.x + obj1.width > obj2.x &&
              obj1.y < obj2.y + obj2.height &&
              obj1.y + obj1.height > obj2.y
            );
          }
          
          // Draw game elements
          function draw() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw stars
            drawStars();
            
            // Draw player ship
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.width, player.height);
            
            // Add detail to player ship
            ctx.fillStyle = '#ecf0f1';
            ctx.beginPath();
            ctx.moveTo(player.x + player.width / 2, player.y);
            ctx.lineTo(player.x + player.width, player.y + player.height);
            ctx.lineTo(player.x, player.y + player.height);
            ctx.closePath();
            ctx.fill();
            
            // Draw bullets
            for (const bullet of bullets) {
              ctx.fillStyle = bullet.color;
              ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            }
            
            // Draw enemies
            for (const enemy of enemies) {
              ctx.fillStyle = enemy.color;
              ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
              
              // Add details to enemy ships
              ctx.fillStyle = '#7f8c8d';
              ctx.beginPath();
              ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 
                   enemy.width / 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          
          // Display game over screen
          function displayGameOver() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
            
            ctx.font = '24px Arial';
            ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2);
            ctx.fillText("Press ENTER to play again", canvas.width / 2, canvas.height / 2 + 50);
          }
          
          // Reset game
          function resetGame() {
            score = 0;
            lives = 3;
            gameOver = false;
            bullets = [];
            enemies = [];
            
            player.x = canvas.width / 2;
            player.y = canvas.height - 60;
            
            scoreDisplay.textContent = "Score: " + score;
            livesDisplay.textContent = "Lives: " + lives;
          }
          
          // Game loop
          function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
          }
          
          // Initialize game
          function initGame() {
            createStars();
            gameLoop();
          }
          
          // Start the game
          initGame();
        `
      }
    }
  ];
}

// Function to generate a batch of racing games
export function generateRacingGames(): Game[] {
  return [
    {
      id: "top-down-racer",
      title: "Top Down Racer",
      description: "Race against time on a track avoiding obstacles.",
      imageUrl: "/placeholder.svg",
      category: "racing",
      difficulty: "intermediate",
      playUrl: "/play/top-down-racer",
      sourceCode: {
        html: `<div id="game-container">
          <canvas id="gameCanvas" width="600" height="800"></canvas>
          <div id="game-ui">
            <div id="time">Time: 0s</div>
            <div id="lap">Lap: 1/3</div>
          </div>
        </div>`,
        css: `
          #game-container {
            position: relative;
            width: 600px;
            margin: 0 auto;
          }
          #gameCanvas {
            background: #333;
            display: block;
            margin: 0 auto;
          }
          #game-ui {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 18px;
            font-weight: bold;
            color: white;
          }
        `,
        js: `
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');
          const timeDisplay = document.getElementById('time');
          const lapDisplay = document.getElementById('lap');
          
          // Game variables
          let startTime = Date.now();
          let currentLap = 1;
          let maxLaps = 3;
          let gameFinished = false;
          
          // Track properties
          const trackOuter = {
            x: 50,
            y: 50,
            width: canvas.width - 100,
            height: canvas.height - 100
          };
          
          const trackInner = {
            x: 150,
            y: 150,
            width: canvas.width - 300,
            height: canvas.height - 300
          };
          
          // Start/finish line
          const finishLine = {
            x: canvas.width / 2 - 50,
            y: trackOuter.y,
            width: 100,
            height: 20
          };
          
          // Player car
          const car = {
            x: canvas.width / 2,
            y: trackOuter.y + 50,
            width: 30,
            height: 50,
            speed: 0,
            maxSpeed: 5,
            acceleration: 0.1,
            deceleration: 0.05,
            angle: Math.PI * 1.5, // Facing up
            rotationSpeed: 0.05,
            color: '#e74c3c'
          };
          
          // Obstacles
          let obstacles = [
            {
              x: 200,
              y: 300,
              width: 30,
              height: 30,
              color: '#7f8c8d'
            },
            {
              x: 400,
              y: 500,
              width: 30,
              height: 30,
              color: '#7f8c8d'
            },
            {
              x: 250,
              y: 600,
              width: 30,
              height: 30,
              color: '#7f8c8d'
            }
          ];
          
          // Controls
          const keys = {
            up: false,
            down: false,
            left: false,
            right: false
          };
          
          // Event listeners
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') keys.up = true;
            if (e.key === 'ArrowDown') keys.down = true;
            if (e.key === 'ArrowLeft') keys.left = true;
            if (e.key === 'ArrowRight') keys.right = true;
            
            // Restart game if finished
            if (gameFinished && e.key === 'Enter') {
              resetGame();
            }
          });
          
          document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp') keys.up = false;
            if (e.key === 'ArrowDown') keys.down = false;
            if (e.key === 'ArrowLeft') keys.left = false;
            if (e.key === 'ArrowRight') keys.right = false;
          });
          
          // Game update
          function update() {
            if (gameFinished) {
              return;
            }
            
            // Update time
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timeDisplay.textContent = "Time: " + elapsedTime + "s";
            
            // Handle car movement
            if (keys.up) {
              car.speed += car.acceleration;
              if (car.speed > car.maxSpeed) {
                car.speed = car.maxSpeed;
              }
            } else if (keys.down) {
              car.speed -= car.acceleration;
              if (car.speed < -car.maxSpeed / 2) {
                car.speed = -car.maxSpeed / 2; // Slower in reverse
              }
            } else {
              // Decelerate when no keys are pressed
              if (car.speed > 0) {
                car.speed -= car.deceleration;
                if (car.speed < 0) car.speed = 0;
              } else if (car.speed < 0) {
                car.speed += car.deceleration;
                if (car.speed > 0) car.speed = 0;
              }
            }
            
            // Rotate car
            if (car.speed !== 0) { // Only allow rotation when moving
              if (keys.left) {
                car.angle -= car.rotationSpeed;
              }
              if (keys.right) {
                car.angle += car.rotationSpeed;
              }
            }
            
            // Update car position
            car.x += Math.sin(car.angle) * car.speed;
            car.y -= Math.cos(car.angle) * car.speed;
            
            // Check track boundaries
            checkTrackCollisions();
            
            // Check obstacle collisions
            checkObstacleCollisions();
            
            // Check lap completion
            checkLapCompletion();
          }
          
          // Check if car is on the track
          function checkTrackCollisions() {
            // Get car corners after rotation
            const corners = getCarCorners();
            
            // Check if any corner is outside outer boundary or inside inner boundary
            for (const point of corners) {
              const outsideOuter = 
                point.x < trackOuter.x || 
                point.x > trackOuter.x + trackOuter.width ||
                point.y < trackOuter.y || 
                point.y > trackOuter.y + trackOuter.height;
                
              const insideInner = 
                point.x > trackInner.x && 
                point.x < trackInner.x + trackInner.width &&
                point.y > trackInner.y && 
                point.y < trackInner.y + trackInner.height;
                
              if (outsideOuter || insideInner) {
                // Hit wall, bounce back slightly
                car.speed = -car.speed * 0.5;
                return;
              }
            }
          }
          
          // Get car corner points after rotation
          function getCarCorners() {
            const corners = [];
            const halfWidth = car.width / 2;
            const halfHeight = car.height / 2;
            
            // Calculate car center
            const centerX = car.x;
            const centerY = car.y;
            
            // Calculate corners relative to center, then rotate
            const points = [
              {x: -halfWidth, y: -halfHeight}, // Top left
              {x: halfWidth, y: -halfHeight},  // Top right
              {x: halfWidth, y: halfHeight},   // Bottom right
              {x: -halfWidth, y: halfHeight}   // Bottom left
            ];
            
            // Rotate points around center and translate back
            for (const point of points) {
              const rotX = point.x * Math.cos(car.angle) - point.y * Math.sin(car.angle);
              const rotY = point.x * Math.sin(car.angle) + point.y * Math.cos(car.angle);
              
              corners.push({
                x: centerX + rotX,
                y: centerY + rotY
              });
            }
            
            return corners;
          }
          
          // Check collision with obstacles
          function checkObstacleCollisions() {
            const carBounds = {
              x: car.x - car.width / 2,
              y: car.y - car.height / 2,
              width: car.width,
              height: car.height
            };
            
            for (const obstacle of obstacles) {
              if (
                carBounds.x < obstacle.x + obstacle.width &&
                carBounds.x + carBounds.width > obstacle.x &&
                carBounds.y < obstacle.y + obstacle.height &&
                carBounds.y + carBounds.height > obstacle.y
              ) {
                // Hit obstacle, bounce back
                car.speed = -car.speed * 0.7;
                return;
              }
            }
          }
          
          // Check if car crossed finish line to complete a lap
          function checkLapCompletion() {
            // Simple finish line detection
            const carBounds = {
              x: car.x - car.width / 2,
              y: car.y - car.height / 2,
              width: car.width,
              height: car.height
            };
            
            if (
              carBounds.x < finishLine.x + finishLine.width &&
              carBounds.x + carBounds.width > finishLine.x &&
              carBounds.y < finishLine.y + finishLine.height &&
              carBounds.y + carBounds.height > finishLine.y &&
              car.y > finishLine.y + finishLine.height // Only count when crossing from bottom to top
            ) {
              // Must be moving upward to count lap
              if (Math.cos(car.angle) > 0) {
                // Complete lap
                currentLap++;
                lapDisplay.textContent = "Lap: " + currentLap + "/" + maxLaps;
                
                if (currentLap > maxLaps) {
                  finishGame();
                }
              }
            }
          }
          
          // Finish the game
          function finishGame() {
            gameFinished = true;
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timeDisplay.textContent = "Final Time: " + elapsedTime + "s";
          }
          
          // Reset game
          function resetGame() {
            startTime = Date.now();
            currentLap = 1;
            gameFinished = false;
            car.x = canvas.width / 2;
            car.y = trackOuter.y + 50;
            car.angle = Math.PI * 1.5;
            car.speed = 0;
            lapDisplay.textContent = "Lap: " + currentLap + "/" + maxLaps;
          }
          
          // Draw game
          function draw() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw track
            ctx.fillStyle = '#2ecc71'; // Green grass
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#95a5a6'; // Gray track
            ctx.fillRect(trackOuter.x, trackOuter.y, trackOuter.width, trackOuter.height);
            
            ctx.fillStyle = '#2ecc71'; // Green inner grass
            ctx.fillRect(trackInner.x, trackInner.y, trackInner.width, trackInner.height);
            
            // Draw finish line
            ctx.fillStyle = '#f1c40f'; // Yellow
            ctx.fillRect(finishLine.x, finishLine.y, finishLine.width, finishLine.height);
            
            // Draw obstacles
            ctx.fillStyle = '#7f8c8d'; // Gray obstacles
            for (const obstacle of obstacles) {
              ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
            
            // Draw car
            ctx.save();
            
            // Translate to car center and rotate
            ctx.translate(car.x, car.y);
            ctx.rotate(car.angle);
            
            // Draw car body
            ctx.fillStyle = car.color;
            ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
            
            // Draw car details
            ctx.fillStyle = '#333';
            ctx.fillRect(-car.width / 2 + 5, -car.height / 2 + 5, car.width - 10, 10); // Windshield
            
            ctx.restore();
            
            // Draw game over message
            if (gameFinished) {
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 80, 300, 160);
              
              ctx.fillStyle = 'white';
              ctx.font = '30px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('Race Complete!', canvas.width / 2, canvas.height / 2 - 30);
              
              const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
              ctx.font = '24px Arial';
              ctx.fillText('Time: ' + elapsedTime + ' seconds', canvas.width / 2, canvas.height / 2 + 10);
              
              ctx.font = '18px Arial';
              ctx.fillText('Press ENTER to race again', canvas.width / 2, canvas.height / 2 + 50);
            }
          }
          
          // Game loop
          function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
          }
          
          // Initialize game
          gameLoop();
        `
      }
    }
  ];
}

// Function to generate educational games
export function generateEducationalGames(): Game[] {
  return [
    {
      id: "typing-tutor",
      title: "Typing Tutor",
      description: "Learn to type faster with this fun typing game.",
      imageUrl: "/placeholder.svg",
      category: "educational",
      difficulty: "beginner",
      playUrl: "/play/typing-tutor",
      sourceCode: {
        html: `<div id="game-container">
          <div id="stats">
            <div id="wpm">WPM: 0</div>
            <div id="accuracy">Accuracy: 100%</div>
            <div id="timer">Time: 60s</div>
          </div>
          <div id="text-display"></div>
          <div id="input-area">
            <input type="text" id="typing-input" placeholder="Start typing..." autocomplete="off">
          </div>
          <div id="instructions">
            <p>Type the text above as quickly and accurately as possible.</p>
            <button id="restart-btn">Restart</button>
          </div>
        </div>`,
        css: `
          #game-container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
          }
          #stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 18px;
          }
          #text-display {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 18px;
            line-height: 1.5;
            min-height: 150px;
          }
          #input-area {
            margin-bottom: 20px;
          }
          #typing-input {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            border: 2px solid #ddd;
          }
          #typing-input:focus {
            outline: none;
            border-color: #3498db;
          }
          .correct {
            color: green;
          }
          .incorrect {
            color: red;
            text-decoration: underline;
          }
          .current {
            background-color: #ffff99;
          }
          #restart-btn {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          #restart-btn:hover {
            background-color: #2980b9;
          }
        `,
        js: `
          const textDisplay = document.getElementById('text-display');
          const typingInput = document.getElementById('typing-input');
          const wpmDisplay = document.getElementById('wpm');
          const accuracyDisplay = document.getElementById('accuracy');
          const timerDisplay = document.getElementById('timer');
          const restartBtn = document.getElementById('restart-btn');
          
          // Sample texts for typing practice
          const sampleTexts = [
            "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet.",
            "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
            "Learning to type faster can significantly boost your productivity and save you hours of valuable time.",
            "Good typing skills are essential in today's digital world where most communication happens through keyboards.",
            "Practice makes perfect. The more you type, the faster and more accurate you'll become over time."
          ];
          
          let currentText = '';
          let timeLeft = 60;
          let timer;
          let startTime;
          let wordCount = 0;
          let correctChars = 0;
          let totalChars = 0;
          let gameActive = false;
          
          // Initialize the game
          function initGame() {
            // Choose a random text
            currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
            
            // Display the text with each character in a span
            textDisplay.innerHTML = currentText.split('').map(char => {
              return \`<span>\${char}</span>\`;
            }).join('');
            
            // Reset stats
            wordCount = 0;
            correctChars = 0;
            totalChars = 0;
            timeLeft = 60;
            gameActive = true;
            
            // Update displays
            wpmDisplay.textContent = "WPM: 0";
            accuracyDisplay.textContent = "Accuracy: 100%";
            timerDisplay.textContent = "Time: 60s";
            
            // Clear input and focus
            typingInput.value = "";
            typingInput.disabled = false;
            typingInput.focus();
            
            // Clear any existing timer
            clearInterval(timer);
            
            // Set current character highlight
            const allSpans = textDisplay.querySelectorAll('span');
            allSpans[0].classList.add('current');
            
            // Start timer when user starts typing
            typingInput.addEventListener('input', handleTyping);
          }
          
          // Handle typing input
          function handleTyping() {
            if (!gameActive) return;
            
            // Start timer on first input
            if (!startTime) {
              startTime = new Date();
              startTimer();
            }
            
            const inputText = typingInput.value;
            const allSpans = textDisplay.querySelectorAll('span');
            
            // Compare input with text
            for (let i = 0; i < allSpans.length; i++) {
              // Remove all current highlights
              allSpans[i].classList.remove('current');
              
              if (i < inputText.length) {
                totalChars = i + 1;
                
                // Check if character matches
                if (inputText[i] === currentText[i]) {
                  allSpans[i].className = 'correct';
                  correctChars = totalChars - (i + 1 - correctChars);
                } else {
                  allSpans[i].className = 'incorrect';
                }
              } else {
                // Current character to type
                if (i === inputText.length) {
                  allSpans[i].classList.add('current');
                }
                // Future characters
                allSpans[i].classList.remove('correct', 'incorrect');
              }
            }
            
            // Calculate accuracy
            const accuracy = totalChars > 0 ? Math.floor((correctChars / totalChars) * 100) : 100;
            accuracyDisplay.textContent = \`Accuracy: \${accuracy}%\`;
            
            // Calculate WPM (Word Per Minute)
            const elapsedMinutes = (new Date() - startTime) / 60000;
            // Assuming average word length of 5 characters
            wordCount = correctChars / 5;
            const wpm = Math.floor(wordCount / elapsedMinutes) || 0;
            wpmDisplay.textContent = \`WPM: \${wpm}\`;
            
            // Check if completed
            if (inputText.length === currentText.length) {
              completeGame();
            }
          }
          
          // Start countdown timer
          function startTimer() {
            timer = setInterval(() => {
              timeLeft--;
              timerDisplay.textContent = \`Time: \${timeLeft}s\`;
              
              if (timeLeft <= 0) {
                completeGame();
              }
            }, 1000);
          }
          
          // Complete the game
          function completeGame() {
            gameActive = false;
            clearInterval(timer);
            typingInput.disabled = true;
            
            // Calculate final stats
            const elapsedMinutes = Math.min(1, (60 - timeLeft) / 60);
            const wpm = Math.floor(wordCount / elapsedMinutes) || 0;
            const accuracy = totalChars > 0 ? Math.floor((correctChars / totalChars) * 100) : 100;
            
            wpmDisplay.textContent = \`WPM: \${wpm}\`;
            accuracyDisplay.textContent = \`Accuracy: \${accuracy}%\`;
            
            // Highlight results
            textDisplay.innerHTML += \`
              <div style="margin-top: 20px; font-weight: bold;">
                Game Over! Your typing speed is \${wpm} WPM with \${accuracy}% accuracy.
              </div>
            \`;
            
            // Remove the input listener
            typingInput.removeEventListener('input', handleTyping);
          }
          
          // Restart button
          restartBtn.addEventListener('click', () => {
            startTime = null;
            initGame();
          });
          
          // Initialize the game
          initGame();
        `
      }
    },
    {
      id: "math-learning-game",
      title: "Math Learning Game",
      description: "Practice basic math operations with this interactive game.",
      imageUrl: "/placeholder.svg",
      category: "educational",
      difficulty: "beginner",
      playUrl: "/play/math-learning-game",
      sourceCode: {
        html: `<div id="game-container">
          <div id="header">
            <div id="timer">Time: 30s</div>
            <div id="score">Score: 0</div>
          </div>
          <div id="problem-container">
            <div id="problem">5 + 3 = ?</div>
            <div id="answer-container">
              <input type="number" id="answer-input" placeholder="Your answer">
              <button id="submit-btn">Submit</button>
            </div>
          </div>
          <div id="result-feedback"></div>
          <div id="difficulty">
            <button class="difficulty-btn selected" data-level="easy">Easy</button>
            <button class="difficulty-btn" data-level="medium">Medium</button>
            <button class="difficulty-btn" data-level="hard">Hard</button>
          </div>
          <div id="operation">
            <button class="operation-btn selected" data-op="addition">Addition</button>
            <button class="operation-btn" data-op="subtraction">Subtraction</button>
            <button class="operation-btn" data-op="multiplication">Multiplication</button>
            <button class="operation-btn" data-op="division">Division</button>
          </div>
          <button id="start-btn">Start Game</button>
        </div>`,
        css: `
          #game-container {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          #header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: bold;
          }
          #problem-container {
            background-color: #f5f5f5;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
          }
          #problem {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          #answer-container {
            display: flex;
            justify-content: center;
            gap: 10px;
          }
          #answer-input {
            padding: 10px;
            font-size: 20px;
            width: 100px;
            text-align: center;
            border: 2px solid #ddd;
            border-radius: 5px;
          }
          #submit-btn {
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }
          #submit-btn:hover {
            background-color: #2980b9;
          }
          #result-feedback {
            text-align: center;
            height: 30px;
            margin-bottom: 20px;
            font-weight: bold;
            font-size: 18px;
          }
          .correct {
            color: green;
          }
          .incorrect {
            color: red;
          }
          #difficulty, #operation {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          .difficulty-btn, .operation-btn, #start-btn {
            padding: 8px 15px;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
          }
          .selected {
            background-color: #3498db;
            color: white;
            border-color: #2980b9;
          }
          #start-btn {
            display: block;
            width: 100%;
            padding: 12px;
            background-color: #2ecc71;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
          }
          #start-btn:hover {
            background-color: #27ae60;
          }
          .disabled {
            opacity: 0.6;
            pointer-events: none;
          }
        `,
        js: `
          const problemEl = document.getElementById('problem');
          const answerInput = document.getElementById('answer-input');
          const submitBtn = document.getElementById('submit-btn');
          const resultFeedback = document.getElementById('result-feedback');
          const timerEl = document.getElementById('timer');
          const scoreEl = document.getElementById('score');
          const startBtn = document.getElementById('start-btn');
          const difficultyBtns = document.querySelectorAll('.difficulty-btn');
          const operationBtns = document.querySelectorAll('.operation-btn');
          
          // Game variables
          let score = 0;
          let timeLeft = 30;
          let timer;
          let currentAnswer;
          let gameActive = false;
          
          // Game settings
          let difficulty = 'easy';
          let operation = 'addition';
          
          // Set up difficulty selection
          difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              // Remove selected class from all buttons
              difficultyBtns.forEach(b => b.classList.remove('selected'));
              // Add selected class to clicked button
              btn.classList.add('selected');
              difficulty = btn.dataset.level;
            });
          });
          
          // Set up operation selection
          operationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              // Remove selected class from all buttons
              operationBtns.forEach(b => b.classList.remove('selected'));
              // Add selected class to clicked button
              btn.classList.add('selected');
              operation = btn.dataset.op;
            });
          });
          
          // Start the game
          startBtn.addEventListener('click', () => {
            if (gameActive) return;
            
            gameActive = true;
            score = 0;
            timeLeft = 30;
            scoreEl.textContent = "Score: " + score;
            timerEl.textContent = "Time: " + timeLeft + "s";
            resultFeedback.textContent = "";
            resultFeedback.className = "";
            
            // Toggle UI elements
            startBtn.classList.add('disabled');
            difficultyBtns.forEach(btn => btn.classList.add('disabled'));
            operationBtns.forEach(btn => btn.classList.add('disabled'));
            answerInput.disabled = false;
            submitBtn.disabled = false;
            
            // Generate first problem
            generateProblem();
            
            // Focus on input
            answerInput.focus();
            
            // Start timer
            timer = setInterval(updateTimer, 1000);
          });
          
          // Submit answer
          submitBtn.addEventListener('click', checkAnswer);
          answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              checkAnswer();
            }
          });
          
          // Generate math problem based on selected difficulty and operation
          function generateProblem() {
            let num1, num2, problem, answer;
            
            // Set number ranges based on difficulty
            let maxNum;
            switch(difficulty) {
              case 'easy':
                maxNum = 10;
                break;
              case 'medium':
                maxNum = 25;
                break;
              case 'hard':
                maxNum = 100;
                break;
              default:
                maxNum = 10;
            }
            
            // Generate problem based on operation
            switch(operation) {
              case 'addition':
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                answer = num1 + num2;
                problem = num1 + " + " + num2 + " = ?";
                break;
                
              case 'subtraction':
                // Ensure positive result
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * num1) + 1; // Ensure num2 <= num1
                answer = num1 - num2;
                problem = num1 + " - " + num2 + " = ?";
                break;
                
              case 'multiplication':
                // Adjust range for multiplication to avoid too large numbers
                const multMaxNum = difficulty === 'easy' ? 5 : (difficulty === 'medium' ? 10 : 12);
                num1 = Math.floor(Math.random() * multMaxNum) + 1;
                num2 = Math.floor(Math.random() * multMaxNum) + 1;
                answer = num1 * num2;
                problem = num1 + " × " + num2 + " = ?";
                break;
                
              case 'division':
                // Create division problems with whole number answers
                num2 = Math.floor(Math.random() * Math.min(10, maxNum)) + 1; // divisor
                const multiplier = Math.floor(Math.random() * Math.min(10, maxNum)) + 1;
                num1 = num2 * multiplier; // dividend
                answer = num1 / num2;
                problem = num1 + " ÷ " + num2 + " = ?";
                break;
                
              default:
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                answer = num1 + num2;
                problem = num1 + " + " + num2 + " = ?";
            }
            
            problemEl.textContent = problem;
            currentAnswer = answer;
            answerInput.value = "";
          }
          
          // Check user's answer
          function checkAnswer() {
            if (!gameActive) return;
            
            const userAnswer = parseInt(answerInput.value);
            
            if (isNaN(userAnswer)) {
              resultFeedback.textContent = "Please enter a number";
              resultFeedback.className = "incorrect";
              return;
            }
            
            if (userAnswer === currentAnswer) {
              score += difficulty === 'easy' ? 1 : (difficulty === 'medium' ? 2 : 3);
              scoreEl.textContent = "Score: " + score;
              resultFeedback.textContent = "Correct!";
              resultFeedback.className = "correct";
              
              // Generate new problem
              generateProblem();
            } else {
              resultFeedback.textContent = "Incorrect! The answer is " + currentAnswer;
              resultFeedback.className = "incorrect";
              
              // Generate new problem after a short delay
              setTimeout(generateProblem, 1500);
            }
          }
          
          // Update timer
          function updateTimer() {
            timeLeft--;
            timerEl.textContent = "Time: " + timeLeft + "s";
            
            if (timeLeft <= 0) {
              endGame();
            }
          }
          
          // End the game
          function endGame() {
            clearInterval(timer);
            gameActive = false;
            
            // Disable input
            answerInput.disabled = true;
            submitBtn.disabled = true;
            
            // Show final score
            problemEl.textContent = "Game Over!";
            resultFeedback.textContent = "Final Score: " + score;
            resultFeedback.className = "correct";
            
            // Re-enable controls
            startBtn.classList.remove('disabled');
            difficultyBtns.forEach(btn => btn.classList.remove('disabled'));
            operationBtns.forEach(btn => btn.classList.remove('disabled'));
          }
          
          // Initialize the game
          answerInput.disabled = true;
          submitBtn.disabled = true;
        `
      }
    }
  ];
}
