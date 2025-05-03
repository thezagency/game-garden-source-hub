
import React from 'react';
import { Game } from "../../types";

export const getSnakeGameAdvanced = (): Game => {
  return {
    id: "snake-advanced",
    title: "Advanced Snake Game",
    description: "A modern take on the classic Snake game with score tracking and responsive design",
    imageUrl: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1064&fm=jpg",
    category: "arcade",
    difficulty: "intermediate",
    featured: true,
    playUrl: "/play/snake-advanced",
    sourceCode: {
      html: `<div class="app-container">
        <div class="scores">
            <p>Score:<span id="score">0</span></p>
            <p id="high-score">0</p>
        </div>
        <div class="board"></div>
    </div>
    <div class="btns">
        <button class="reset btn">Restart</button>
    </div>`,
      css: `@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.app-container {
    width: 36rem;
    height: 36rem;
    background-color: #808E62;
    padding: 0rem 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 1rem;
    border: 12px solid #B3C194;
    outline: 10px solid #4F5440;
}

.scores {
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.scores p {
    padding: 0.5rem 0 1.2rem;
    font-size: 2rem;
    color: #fff;
    font-family: "VT323", monospace;
}

.board {
    width: 85%;
    height: 87%;
    background-color: #B3C194;
    display: grid;
    grid-template-columns: repeat(21,1fr);
    grid-template-rows: repeat(21,1fr);
}

.btn {
    width: 8rem;
    height: 3.5rem;
    font-family: "VT323", monospace;
    margin: 2rem;
    padding: 0.7rem;
    font-size: 2rem;
    color: white;
    background-color: rgba(6, 202, 16, 0.897);
    outline: none;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
}

.snake {
    background-color: #5a5a5a;
    z-index: 22;
}

.food {
    background-color: rgba(190, 36, 16, 0.849);
    border-radius: 50%;
}

@media screen and (max-width:750px) {
    .app-container {
        width: 30rem;
        height: 30rem;
    }
}

@media screen and (max-width:550px) {
    .app-container {
        width: 25rem;
        height: 25rem;
    }
}

@media screen and (max-width:450px) {
    .app-container {
        width: 22rem;
        height: 27rem;
    }
}

@media screen and (max-width:390px) {
    .app-container {
        width: 20rem;
        height: 27rem;
    }
}`,
      js: `(function() {
        document.addEventListener('DOMContentLoaded', () => {
          const gameBoard = document.querySelector(".board");
          const gameRestart = document.querySelector(".reset");
          const highScoreBox = document.querySelector("#high-score");
          const currentScoreBox = document.querySelector("#score");

          let lastRenderTime = 0;
          let gameOver = false;
          let currentScore = 0;
          let highScore = 0;
          let gridSize = 21;
          let snakeSpeed = 5;
          let gameStarted = true;
          let snakeBody = [
            {x:10, y:10},
          ];
          let food = randomFoodPosition();
          let inputDirection = {x: 0, y: 0};
          let lastInputDirection = {x:0, y:0};

          function main(currenttime) {
            window.requestAnimationFrame(main);

            if((currenttime - lastRenderTime)/1000 < 1/snakeSpeed) {
              return;
            }
            lastRenderTime = currenttime;
            
            if(gameStarted) {
              gameEngine();
            }
          }

          function gameEngine() {
            checkCollision();
            updateFood();
            moveSnake();
            drawSnake();
            drawFood();
          }

          function checkCollision() {
            if(isCollide(snakeBody)) {
              gameStarted = false;
              gameRestart.addEventListener('click', () => {
                location.reload();
              });
            }
          }

          function isCollide(snake) {
            for (let i = 1; i < snakeBody.length; i++) {
              if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true;
              }
            }
            if(snake[0].x > gridSize || snake[0].x < 1 || snake[0].y > gridSize || snake[0].y < 1) {
              return true;
            }
            return false;
          }

          function updateFood() {
            if(snakeBody[0].x === food.x && snakeBody[0].y === food.y) {
              updateScore();
              snakeSpeed += 0.5;
              snakeBody.unshift({x: snakeBody[0].x + inputDirection.x, y: snakeBody[0].y + inputDirection.y});
              let newFoodPosition;
              do {
                newFoodPosition = randomFoodPosition();
              } while(newFoodPosition == null || onSnake(newFoodPosition));
              food = newFoodPosition;
            }
          }

          function randomFoodPosition() {
            return {
              x: Math.floor(Math.random() * gridSize) + 1,
              y: Math.floor(Math.random() * gridSize) + 1
            }
          }

          function onSnake(item) {
            return snakeBody.some(segment => segment.x === item.x && segment.y === item.y);
          }

          function updateScore() {
            currentScore += 1;
            if(currentScore > highScore) {
              highScore = currentScore;
              localStorage.setItem("HighScore", JSON.stringify(highScore));
              highScoreBox.innerHTML = highScore;
            }
            currentScoreBox.innerHTML = currentScore;
          }

          function moveSnake() {
            inputDirection = getInputDirection();
            for (let i = snakeBody.length - 2; i >= 0; i--) { 
              snakeBody[i+1] = {...snakeBody[i]};
            }
            snakeBody[0].x += inputDirection.x;
            snakeBody[0].y += inputDirection.y;
          }

          function drawSnake() {
            gameBoard.innerHTML = "";
            snakeBody.forEach(element => {
              let snakeElement = document.createElement("div");
              snakeElement.style.gridColumnStart = element.x;
              snakeElement.style.gridRowStart = element.y;
              snakeElement.classList.add("snake");
              gameBoard.appendChild(snakeElement);
            });
          }

          function drawFood() {
            let foodElement = document.createElement("div");
            foodElement.style.gridColumnStart = food.x;
            foodElement.style.gridRowStart = food.y;
            foodElement.classList.add("food");
            gameBoard.appendChild(foodElement);
          }

          // Initialize high score
          let hiscore = localStorage.getItem("HighScore");
          if(hiscore === null) {
            highScore = 0;
            localStorage.setItem("HighScore", JSON.stringify(highScore))
          } else {
            highScore = JSON.parse(hiscore);
            highScoreBox.innerHTML = hiscore;
          }

          // Start the game
          window.requestAnimationFrame(main);

          // Handle keyboard input
          window.addEventListener('keydown', (e) => {
            switch(e.key) {
              case 'ArrowUp':
                if(lastInputDirection.y !== 0) break;
                inputDirection.x = 0;
                inputDirection.y = -1;
                break;
              case 'ArrowDown':
                if(lastInputDirection.y !== 0) break;
                inputDirection.x = 0;
                inputDirection.y = 1;
                break;
              case 'ArrowRight':
                if(lastInputDirection.x !== 0) break;
                inputDirection.x = 1;
                inputDirection.y = 0;
                break;
              case 'ArrowLeft':
                if(lastInputDirection.x !== 0) break;
                inputDirection.x = -1;
                inputDirection.y = 0;
                break;
            }
          });

          function getInputDirection() {
            lastInputDirection = inputDirection;
            return inputDirection;
          }
        });
      })();`
    }
  };
};
