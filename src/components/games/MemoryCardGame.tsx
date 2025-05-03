
import React from 'react';
import { Game } from "../../types";

export const getMemoryCardGame = (): Game => {
  return {
    id: "memory-card",
    title: "Memory Card Match",
    description: "Test your memory by matching pairs of cards in this fun memory game",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1335&fm=jpg",
    category: "puzzle",
    difficulty: "beginner",
    featured: false,
    playUrl: "/play/memory-card",
    sourceCode: {
      html: `<div class="memory-game-container">
  <div class="memory-game-header">
    <h2>Memory Card Game</h2>
    <div class="stats">
      <div class="moves">Moves: <span id="moves-count">0</span></div>
      <div class="timer">Time: <span id="timer">0</span>s</div>
    </div>
    <button id="restart">Restart Game</button>
  </div>
  
  <div id="game-board" class="memory-game-board">
    <!-- Cards will be added here -->
  </div>
</div>`,
      css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.memory-game-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.memory-game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

h2 {
  color: #333;
}

.stats {
  display: flex;
  gap: 20px;
}

.stats div {
  background-color: #eee;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #45a049;
}

.memory-game-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  perspective: 1000px;
}

.memory-card {
  height: 150px;
  position: relative;
  transform-style: preserve-3d;
  transform: scale(1);
  transition: transform 0.5s;
  cursor: pointer;
}

.memory-card.flipped {
  transform: rotateY(180deg);
}

.memory-card.matched {
  transform: rotateY(180deg) scale(0.95);
}

.front-face, .back-face {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.front-face {
  background-color: #fff;
  transform: rotateY(180deg);
  font-size: 3rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.back-face {
  background-color: #2980b9;
  background-image: linear-gradient(315deg, #2980b9 0%, #6dd5fa 74%);
}

@media (max-width: 600px) {
  .memory-game-board {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .memory-card {
    height: 120px;
  }
}

@media (max-width: 400px) {
  .memory-game-board {
    grid-template-columns: repeat(2, 1fr);
  }
}`,
      js: `document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
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
  let matchedPairs = 0;
  
  // Card emoji pairs
  const emojis = [
    '🍎', '🍎',
    '🍌', '🍌',
    '🍒', '🍒',
    '🍓', '🍓',
    '🍕', '🍕',
    '🍩', '🍩',
    '🍦', '🍦',
    '🎮', '🎮'
  ];
  
  // Initialize game
  function initGame() {
    resetGameState();
    createCards();
    startTimer();
  }
  
  function resetGameState() {
    gameBoard.innerHTML = '';
    cards = [];
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    moves = 0;
    timer = 0;
    matchedPairs = 0;
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0';
    clearInterval(timerInterval);
  }
  
  function createCards() {
    // Shuffle the emojis
    const shuffledEmojis = [...emojis].sort(() => Math.random() - 0.5);
    
    shuffledEmojis.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.emoji = emoji;
      
      card.innerHTML = \`
        <div class="front-face">\${emoji}</div>
        <div class="back-face"></div>
      \`;
      
      card.addEventListener('click', flipCard);
      gameBoard.appendChild(card);
      cards.push(card);
    });
  }
  
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
  
  function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    
    if (isMatch) {
      disableCards();
      matchedPairs++;
      
      // Check if all pairs found
      if (matchedPairs === emojis.length / 2) {
        setTimeout(() => {
          clearInterval(timerInterval);
          alert(\`Congratulations! You completed the game in \${moves} moves and \${timer} seconds.\`);
        }, 500);
      }
    } else {
      unflipCards();
    }
  }
  
  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    resetBoard();
  }
  
  function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      
      resetBoard();
    }, 1000);
  }
  
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }
  
  function startTimer() {
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = timer;
    }, 1000);
  }
  
  restartButton.addEventListener('click', initGame);
  
  // Start the game
  initGame();
});`
    }
  };
};
