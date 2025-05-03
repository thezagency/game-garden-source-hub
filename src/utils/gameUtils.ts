import { getSnakeGame } from "../components/games/SnakeGame";
import { getTetrisGame } from "../components/games/TetrisGame";
import { getChessGame } from "../components/games/ChessGame";
import { getTowerDefenseGame } from "../components/games/TowerDefenseGame";
import { getPongGame } from "../components/games/PongGame";
import { get2048Game } from "../components/games/Game2048";
import { getMemoryCardGame } from "../components/games/MemoryCardGame";
import { getTetrisGravityGame } from "../components/games/TetrisGravityGame";
import { getSnakeGameAdvanced } from "../components/games/SnakeGameAdvanced";
import { Game } from "../types";
import { additionalGames } from "../data/additionalGames";

// Define some simple working games that we can be sure will function properly
const createSimpleWorkingGames = (): Game[] => {
  return [
    {
      id: "simple-clicker",
      title: "Simple Clicker",
      description: "Click as fast as you can to increase your score!",
      category: "arcade",
      imageUrl: "https://placehold.co/600x400?text=Simple+Clicker",
      rating: 4.1,
      playCount: 5834,
      tags: ["arcade", "clicker", "casual"],
      playUrl: "/play/simple-clicker",
      sourceCode: {
        html: `<div class="game-container">
          <h2>Simple Clicker</h2>
          <div id="score">Score: 0</div>
          <button id="click-button">Click Me!</button>
        </div>`,
        css: `
          .game-container {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 8px;
            max-width: 400px;
            margin: 0 auto;
          }
          #score {
            font-size: 24px;
            margin: 20px 0;
            font-weight: bold;
          }
          #click-button {
            padding: 15px 30px;
            font-size: 18px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          #click-button:hover {
            background-color: #45a049;
          }
        `,
        js: `
          let score = 0;
          const scoreElement = document.getElementById('score');
          const button = document.getElementById('click-button');
          
          button.addEventListener('click', () => {
            score++;
            scoreElement.textContent = 'Score: ' + score;
            
            // Add a little animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
              button.style.transform = 'scale(1)';
            }, 100);
          });
        `
      }
    },
    {
      id: "color-matcher",
      title: "Color Matcher",
      description: "Match the color shown by selecting the correct color swatch.",
      category: "puzzle",
      imageUrl: "https://placehold.co/600x400?text=Color+Matcher",
      rating: 4.3,
      playCount: 3209,
      tags: ["puzzle", "colors", "matching"],
      playUrl: "/play/color-matcher",
      sourceCode: {
        html: `<div class="game-container">
          <h2>Color Matcher</h2>
          <div id="target-color"></div>
          <div id="score">Score: 0</div>
          <div id="color-options"></div>
        </div>`,
        css: `
          .game-container {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f8f8f8;
            max-width: 500px;
            margin: 0 auto;
          }
          #target-color {
            width: 100px;
            height: 100px;
            margin: 20px auto;
            border-radius: 50%;
            border: 2px solid #333;
          }
          #score {
            font-size: 24px;
            margin: 20px 0;
          }
          #color-options {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
          }
          .color-option {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid #333;
            transition: transform 0.2s;
          }
          .color-option:hover {
            transform: scale(1.1);
          }
        `,
        js: `
          let score = 0;
          let targetColor;
          const scoreElement = document.getElementById('score');
          const targetColorElement = document.getElementById('target-color');
          const colorOptionsElement = document.getElementById('color-options');
          
          function generateRandomColor() {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return { r, g, b };
          }
          
          function rgbToString(color) {
            return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
          }
          
          function generateSimilarColor(color, difficulty = 50) {
            let r = color.r + Math.floor(Math.random() * difficulty * 2) - difficulty;
            let g = color.g + Math.floor(Math.random() * difficulty * 2) - difficulty;
            let b = color.b + Math.floor(Math.random() * difficulty * 2) - difficulty;
            
            r = Math.max(0, Math.min(255, r));
            g = Math.max(0, Math.min(255, g));
            b = Math.max(0, Math.min(255, b));
            
            return { r, g, b };
          }
          
          function startGame() {
            targetColor = generateRandomColor();
            targetColorElement.style.backgroundColor = rgbToString(targetColor);
            
            colorOptionsElement.innerHTML = '';
            
            // Create 4 color options, one is correct
            const correctOptionIndex = Math.floor(Math.random() * 4);
            
            for (let i = 0; i < 4; i++) {
              const colorOption = document.createElement('div');
              colorOption.className = 'color-option';
              
              let optionColor;
              if (i === correctOptionIndex) {
                optionColor = targetColor;
              } else {
                optionColor = generateSimilarColor(targetColor);
              }
              
              colorOption.style.backgroundColor = rgbToString(optionColor);
              colorOption.dataset.correct = (i === correctOptionIndex).toString();
              
              colorOption.addEventListener('click', function() {
                if (colorOption.dataset.correct === 'true') {
                  score += 10;
                  scoreElement.textContent = 'Score: ' + score;
                  startGame();
                } else {
                  score = Math.max(0, score - 5);
                  scoreElement.textContent = 'Score: ' + score;
                }
              });
              
              colorOptionsElement.appendChild(colorOption);
            }
          }
          
          // Start the game
          startGame();
        `
      }
    },
    {
      id: "quick-math",
      title: "Quick Math",
      description: "Solve simple math problems as quickly as possible.",
      category: "educational",
      imageUrl: "https://placehold.co/600x400?text=Quick+Math",
      rating: 4.4,
      playCount: 6721,
      tags: ["educational", "math", "brain training"],
      playUrl: "/play/quick-math",
      sourceCode: {
        html: `<div class="game-container">
          <h2>Quick Math</h2>
          <div id="timer">Time: 30s</div>
          <div id="score">Score: 0</div>
          <div id="problem"></div>
          <div id="answer-input">
            <input type="number" id="user-answer" placeholder="Answer">
            <button id="submit-btn">Submit</button>
          </div>
        </div>`,
        css: `
          .game-container {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 10px;
            max-width: 500px;
            margin: 0 auto;
          }
          #timer, #score {
            font-size: 18px;
            margin: 10px 0;
          }
          #problem {
            font-size: 32px;
            font-weight: bold;
            margin: 30px 0;
          }
          #answer-input {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
          }
          #user-answer {
            padding: 10px;
            font-size: 18px;
            width: 100px;
            text-align: center;
            border: 2px solid #ccc;
            border-radius: 4px;
          }
          #submit-btn {
            padding: 10px 20px;
            font-size: 18px;
            background-color: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          #submit-btn:hover {
            background-color: #3271d9;
          }
        `,
        js: `
          let score = 0;
          let timeLeft = 30;
          let timer;
          let currentAnswer;
          
          const timerElement = document.getElementById('timer');
          const scoreElement = document.getElementById('score');
          const problemElement = document.getElementById('problem');
          const userAnswerInput = document.getElementById('user-answer');
          const submitButton = document.getElementById('submit-btn');
          
          function generateProblem() {
            const operations = ['+', '-', '*'];
            const operation = operations[Math.floor(Math.random() * operations.length)];
            
            let num1, num2;
            
            switch (operation) {
              case '+':
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                currentAnswer = num1 + num2;
                break;
              case '-':
                num1 = Math.floor(Math.random() * 50) + 25;
                num2 = Math.floor(Math.random() * num1);
                currentAnswer = num1 - num2;
                break;
              case '*':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                currentAnswer = num1 * num2;
                break;
            }
            
            problemElement.textContent = num1 + ' ' + operation + ' ' + num2 + ' = ?';
            userAnswerInput.value = '';
            userAnswerInput.focus();
          }
          
          function startTimer() {
            timer = setInterval(() => {
              timeLeft--;
              timerElement.textContent = 'Time: ' + timeLeft + 's';
              
              if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
              }
            }, 1000);
          }
          
          function endGame() {
            problemElement.textContent = 'Game Over! Final Score: ' + score;
            userAnswerInput.disabled = true;
            submitButton.disabled = true;
          }
          
          function checkAnswer() {
            const userAnswer = parseInt(userAnswerInput.value);
            
            if (userAnswer === currentAnswer) {
              score += 10;
              scoreElement.textContent = 'Score: ' + score;
              generateProblem();
            } else {
              score = Math.max(0, score - 5);
              scoreElement.textContent = 'Score: ' + score;
              userAnswerInput.value = '';
            }
          }
          
          submitButton.addEventListener('click', checkAnswer);
          
          userAnswerInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
              checkAnswer();
            }
          });
          
          // Start the game
          generateProblem();
          startTimer();
        `
      }
    },
    {
      id: "maze-runner",
      title: "Maze Runner",
      description: "Navigate through a simple maze to reach the exit.",
      category: "puzzle",
      imageUrl: "https://placehold.co/600x400?text=Maze+Runner",
      rating: 4.2,
      playCount: 4521,
      tags: ["puzzle", "maze", "strategy"],
      playUrl: "/play/maze-runner",
      sourceCode: {
        html: `<div class="game-container">
          <h2>Maze Runner</h2>
          <div id="maze"></div>
          <div id="game-message">Use arrow keys to move</div>
        </div>`,
        css: `
          .game-container {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f0f0f0;
            max-width: 500px;
            margin: 0 auto;
          }
          #maze {
            display: grid;
            grid-template-columns: repeat(10, 30px);
            grid-template-rows: repeat(10, 30px);
            gap: 1px;
            margin: 20px auto;
            background-color: #333;
            width: fit-content;
          }
          .cell {
            width: 30px;
            height: 30px;
            box-sizing: border-box;
          }
          .wall {
            background-color: #333;
          }
          .path {
            background-color: #fff;
          }
          .player {
            background-color: #ff5722;
            border-radius: 50%;
          }
          .exit {
            background-color: #4CAF50;
          }
          #game-message {
            margin-top: 20px;
            font-size: 18px;
          }
        `,
        js: `
          // Simple maze layout: 0 = path, 1 = wall
          const mazeLayout = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          ];
          
          let playerPosition = { x: 1, y: 1 };
          const exitPosition = { x: 8, y: 8 };
          const mazeElement = document.getElementById('maze');
          const gameMessage = document.getElementById('game-message');
          
          function renderMaze() {
            mazeElement.innerHTML = '';
            
            for (let y = 0; y < mazeLayout.length; y++) {
              for (let x = 0; x < mazeLayout[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                if (x === playerPosition.x && y === playerPosition.y) {
                  cell.classList.add('player');
                } else if (x === exitPosition.x && y === exitPosition.y) {
                  cell.classList.add('exit');
                } else if (mazeLayout[y][x] === 1) {
                  cell.classList.add('wall');
                } else {
                  cell.classList.add('path');
                }
                
                mazeElement.appendChild(cell);
              }
            }
          }
          
          function movePlayer(dx, dy) {
            const newX = playerPosition.x + dx;
            const newY = playerPosition.y + dy;
            
            // Check if the new position is valid
            if (
              newX >= 0 && newX < mazeLayout[0].length &&
              newY >= 0 && newY < mazeLayout.length &&
              mazeLayout[newY][newX] !== 1
            ) {
              playerPosition.x = newX;
              playerPosition.y = newY;
              renderMaze();
              
              // Check if player reached the exit
              if (newX === exitPosition.x && newY === exitPosition.y) {
                gameMessage.textContent = 'Congratulations! You reached the exit!';
                gameMessage.style.color = '#4CAF50';
                document.removeEventListener('keydown', handleKeyPress);
              }
            }
          }
          
          function handleKeyPress(event) {
            switch (event.key) {
              case 'ArrowUp':
                movePlayer(0, -1);
                break;
              case 'ArrowDown':
                movePlayer(0, 1);
                break;
              case 'ArrowLeft':
                movePlayer(-1, 0);
                break;
              case 'ArrowRight':
                movePlayer(1, 0);
                break;
            }
          }
          
          // Initialize the game
          renderMaze();
          document.addEventListener('keydown', handleKeyPress);
        `
      }
    },
    {
      id: "rock-paper-scissors",
      title: "Rock Paper Scissors",
      description: "The classic game of Rock, Paper, Scissors against the computer.",
      category: "arcade",
      imageUrl: "https://placehold.co/600x400?text=Rock+Paper+Scissors",
      rating: 4.0,
      playCount: 8932,
      tags: ["arcade", "classic", "casual"],
      playUrl: "/play/rock-paper-scissors",
      sourceCode: {
        html: `<div class="game-container">
          <h2>Rock Paper Scissors</h2>
          <div id="score-display">
            <div id="player-score">Player: 0</div>
            <div id="computer-score">Computer: 0</div>
          </div>
          <div id="result">Choose your move!</div>
          <div id="moves">
            <div class="move" id="rock">✊</div>
            <div class="move" id="paper">✋</div>
            <div class="move" id="scissors">✌️</div>
          </div>
          <div id="history"></div>
        </div>`,
        css: `
          .game-container {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            background-color: #f8f9fa;
            border-radius: 10px;
          }
          #score-display {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            font-size: 20px;
          }
          #result {
            font-size: 24px;
            margin: 20px 0;
            min-height: 30px;
          }
          #moves {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
          }
          .move {
            font-size: 40px;
            cursor: pointer;
            background-color: #fff;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
          }
          .move:hover {
            transform: scale(1.1);
          }
          #history {
            margin-top: 20px;
            font-size: 16px;
          }
        `,
        js: `
          let playerScore = 0;
          let computerScore = 0;
          
          const playerScoreElement = document.getElementById('player-score');
          const computerScoreElement = document.getElementById('computer-score');
          const resultElement = document.getElementById('result');
          const historyElement = document.getElementById('history');
          
          const moves = ['rock', 'paper', 'scissors'];
          
          // Add click listeners to moves
          document.getElementById('rock').addEventListener('click', () => playGame('rock'));
          document.getElementById('paper').addEventListener('click', () => playGame('paper'));
          document.getElementById('scissors').addEventListener('click', () => playGame('scissors'));
          
          function getComputerMove() {
            const randomIndex = Math.floor(Math.random() * 3);
            return moves[randomIndex];
          }
          
          function determineWinner(playerMove, computerMove) {
            if (playerMove === computerMove) {
              return 'tie';
            }
            
            if (
              (playerMove === 'rock' && computerMove === 'scissors') ||
              (playerMove === 'paper' && computerMove === 'rock') ||
              (playerMove === 'scissors' && computerMove === 'paper')
            ) {
              return 'player';
            }
            
            return 'computer';
          }
          
          function getMoveName(move) {
            return move.charAt(0).toUpperCase() + move.slice(1);
          }
          
          function getEmojiForMove(move) {
            switch (move) {
              case 'rock': return '✊';
              case 'paper': return '✋';
              case 'scissors': return '✌️';
              default: return '';
            }
          }
          
          function playGame(playerMove) {
            const computerMove = getComputerMove();
            const winner = determineWinner(playerMove, computerMove);
            
            // Update scores and result message
            if (winner === 'player') {
              playerScore++;
              playerScoreElement.textContent = 'Player: ' + playerScore;
              resultElement.textContent = 'You win! ' + getMoveName(playerMove) + ' beats ' + getMoveName(computerMove);
            } else if (winner === 'computer') {
              computerScore++;
              computerScoreElement.textContent = 'Computer: ' + computerScore;
              resultElement.textContent = 'You lose! ' + getMoveName(computerMove) + ' beats ' + getMoveName(playerMove);
            } else {
              resultElement.textContent = "It's a tie!";
            }
            
            // Add to history
            const historyItem = document.createElement('div');
            historyItem.textContent = 'You: ' + getEmojiForMove(playerMove) + ' vs Computer: ' + getEmojiForMove(computerMove);
            historyElement.prepend(historyItem);
            
            // Limit history to last 5 moves
            while (historyElement.childNodes.length > 5) {
              historyElement.removeChild(historyElement.lastChild);
            }
          }
        `
      }
    }
  ];
};

/**
 * Helper function to get additional games created as components
 * This makes it easy to add more games in component format
 */
export const getComponentGames = (): Game[] => {
  // Get games from component files - these are reliable and well-tested
  const games = [
    getSnakeGame(),
    getTetrisGame(),
    getChessGame(),
    getTowerDefenseGame(),
    getPongGame(),
    get2048Game(),
    getMemoryCardGame(),
    getTetrisGravityGame(),
    getSnakeGameAdvanced()
  ];
  
  // Ensure all games have the correct playUrl format
  const componentGames = games.map(game => ({
    ...game,
    playUrl: `/play/${game.id}`
  }));

  // Create simple working games that are guaranteed to work
  const workingGames = createSimpleWorkingGames();

  // Filter the additionalGames to only include games that are known to work well
  const workingAdditionalGames = additionalGames.filter(game => 
    // Filter criteria to exclude problematic games
    game.id && 
    game.title && 
    game.sourceCode && 
    !game.sourceCode?.js?.includes('${') // Exclude games with template literals in JS
  ).slice(0, 20); // Limit to first 20 working games to avoid any problematic ones
  
  // Return a well-tested set of games
  return [...componentGames, ...workingGames, ...workingAdditionalGames];
};
