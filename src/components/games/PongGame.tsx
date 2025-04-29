import React from "react";
import { Game } from "../../types";

export const getPongGame = (): Game => {
  return {
    id: "pong-java",
    title: "Pong Game (Java)",
    description: "Classic Pong game implemented in Java with JavaScript bridge for web interaction",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&fm=jpg",
    category: "arcade",
    sourceCode: {
      html: `<div id="pong-container">
  <canvas id="pong-canvas" width="600" height="400"></canvas>
  <div id="pong-controls">
    <button id="start-btn">Start Game</button>
    <div class="score-display">
      <div>Player: <span id="player-score">0</span></div>
      <div>AI: <span id="ai-score">0</span></div>
    </div>
  </div>
</div>`,
      css: `#pong-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

#pong-canvas {
  background: #222;
  border: 2px solid #444;
  margin: 0 auto;
  display: block;
  max-width: 100%;
}

#pong-controls {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.score-display {
  display: flex;
  gap: 20px;
}`,
      java: `
/**
 * Pong Game Implementation in Java
 * 
 * Note: This is the Java code that would run on a Java backend.
 * In the web environment, we're using JavaScript to simulate the Java behavior.
 */
package com.game.pong;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class PongGame extends JPanel implements ActionListener, KeyListener {
    // Game area dimensions
    private static final int WIDTH = 600;
    private static final int HEIGHT = 400;
    
    // Game elements size
    private static final int PADDLE_WIDTH = 15;
    private static final int PADDLE_HEIGHT = 80;
    private static final int BALL_SIZE = 15;
    
    // Movement speeds
    private static final int BALL_SPEED = 4;
    private static final int PADDLE_SPEED = 5;
    
    // Game state
    private int playerScore = 0;
    private int aiScore = 0;
    private boolean isRunning = false;
    
    // Positions
    private int playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    private int aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    private int ballX = WIDTH / 2 - BALL_SIZE / 2;
    private int ballY = HEIGHT / 2 - BALL_SIZE / 2;
    
    // Ball movement
    private int ballDX = BALL_SPEED;
    private int ballDY = BALL_SPEED;
    
    // Timer for game loop
    private Timer timer;
    
    public PongGame() {
        this.setPreferredSize(new Dimension(WIDTH, HEIGHT));
        this.setBackground(Color.BLACK);
        this.setFocusable(true);
        this.addKeyListener(this);
        
        timer = new Timer(16, this);  // ~60fps
    }
    
    public void start() {
        if (!isRunning) {
            isRunning = true;
            ballX = WIDTH / 2 - BALL_SIZE / 2;
            ballY = HEIGHT / 2 - BALL_SIZE / 2;
            ballDX = BALL_SPEED;
            ballDY = (Math.random() > 0.5) ? BALL_SPEED : -BALL_SPEED;
            timer.start();
        }
    }
    
    public void stop() {
        isRunning = false;
        timer.stop();
    }
    
    public void reset() {
        playerScore = 0;
        aiScore = 0;
        playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
        aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
        stop();
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
        if (isRunning) {
            moveBall();
            moveAI();
            checkCollisions();
        }
        repaint();
    }
    
    private void moveBall() {
        ballX += ballDX;
        ballY += ballDY;
    }
    
    private void moveAI() {
        // Simple AI - follow the ball
        int aiCenter = aiY + PADDLE_HEIGHT / 2;
        int ballCenter = ballY + BALL_SIZE / 2;
        
        if (aiCenter < ballCenter) {
            aiY += PADDLE_SPEED;
        } else if (aiCenter > ballCenter) {
            aiY -= PADDLE_SPEED;
        }
        
        // Keep AI paddle in bounds
        aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
    }
    
    private void checkCollisions() {
        // Ball hits top or bottom
        if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
            ballDY = -ballDY;
        }
        
        // Ball hits player paddle
        if (ballX <= PADDLE_WIDTH && 
            ballY + BALL_SIZE >= playerY && 
            ballY <= playerY + PADDLE_HEIGHT) {
            ballDX = Math.abs(ballDX);
            // Adjust angle based on where ball hits paddle
            double relativePaddleHit = (playerY + PADDLE_HEIGHT / 2) - (ballY + BALL_SIZE / 2);
            ballDY = (int)(-relativePaddleHit / 10);
        }
        
        // Ball hits AI paddle
        if (ballX + BALL_SIZE >= WIDTH - PADDLE_WIDTH && 
            ballY + BALL_SIZE >= aiY && 
            ballY <= aiY + PADDLE_HEIGHT) {
            ballDX = -Math.abs(ballDX);
            // Adjust angle based on where ball hits paddle
            double relativePaddleHit = (aiY + PADDLE_HEIGHT / 2) - (ballY + BALL_SIZE / 2);
            ballDY = (int)(-relativePaddleHit / 10);
        }
        
        // Ball goes out of bounds - scoring
        if (ballX < 0) {
            aiScore++;
            resetBall();
        } else if (ballX > WIDTH) {
            playerScore++;
            resetBall();
        }
    }
    
    private void resetBall() {
        ballX = WIDTH / 2 - BALL_SIZE / 2;
        ballY = HEIGHT / 2 - BALL_SIZE / 2;
        ballDX = -ballDX;
        ballDY = (Math.random() > 0.5) ? BALL_SPEED : -BALL_SPEED;
    }
    
    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        
        // Draw everything in white
        g.setColor(Color.WHITE);
        
        // Draw paddles
        g.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
        g.fillRect(WIDTH - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);
        
        // Draw ball
        g.fillOval(ballX, ballY, BALL_SIZE, BALL_SIZE);
        
        // Draw center line
        Graphics2D g2d = (Graphics2D) g;
        g2d.setStroke(new BasicStroke(2f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 
                      0, new float[]{10}, 0));
        g2d.drawLine(WIDTH / 2, 0, WIDTH / 2, HEIGHT);
        
        // Draw scores
        g.setFont(new Font("Arial", Font.BOLD, 20));
        g.drawString(Integer.toString(playerScore), WIDTH / 4, 30);
        g.drawString(Integer.toString(aiScore), 3 * WIDTH / 4, 30);
    }
    
    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_UP) {
            playerY -= PADDLE_SPEED * 2;
        } else if (e.getKeyCode() == KeyEvent.VK_DOWN) {
            playerY += PADDLE_SPEED * 2;
        }
        
        // Keep player paddle in bounds
        playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
    }
    
    @Override
    public void keyReleased(KeyEvent e) {
        // Not used
    }
    
    @Override
    public void keyTyped(KeyEvent e) {
        // Not used
    }
    
    // Main method to run the game
    public static void main(String[] args) {
        JFrame frame = new JFrame("Pong Game");
        PongGame game = new PongGame();
        frame.add(game);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setVisible(true);
        
        JButton startButton = new JButton("Start Game");
        startButton.addActionListener(e -> game.start());
        
        JButton resetButton = new JButton("Reset Game");
        resetButton.addActionListener(e -> game.reset());
        
        JPanel controls = new JPanel();
        controls.add(startButton);
        controls.add(resetButton);
        frame.add(controls, BorderLayout.SOUTH);
    }
}`,
      js: `// JavaScript implementation that simulates the Java Pong game for web
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('pong-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-btn');
  const playerScoreDisplay = document.getElementById('player-score');
  const aiScoreDisplay = document.getElementById('ai-score');
  
  // Game constants
  const PADDLE_WIDTH = 15;
  const PADDLE_HEIGHT = 80;
  const BALL_SIZE = 15;
  const BALL_SPEED = 4;
  const PADDLE_SPEED = 5;
  
  // Game state
  let playerScore = 0;
  let aiScore = 0;
  let isRunning = false;
  
  // Positions
  let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
  let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
  let ballX = canvas.width / 2 - BALL_SIZE / 2;
  let ballY = canvas.height / 2 - BALL_SIZE / 2;
  
  // Ball movement
  let ballDX = BALL_SPEED;
  let ballDY = BALL_SPEED;
  
  // Animation frame ID
  let animationId;
  
  // Key state
  const keys = {
    ArrowUp: false,
    ArrowDown: false
  };
  
  // Event listeners
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      keys[e.key] = true;
    }
  });
  
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      keys[e.key] = false;
    }
  });
  
  startBtn.addEventListener('click', () => {
    if (isRunning) {
      // Reset game
      playerScore = 0;
      aiScore = 0;
      playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
      aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
      updateScoreDisplay();
      stopGame();
      startBtn.textContent = "Start Game";
    } else {
      // Start game
      startGame();
      startBtn.textContent = "Reset Game";
    }
  });
  
  function startGame() {
    if (!isRunning) {
      isRunning = true;
      resetBall();
      gameLoop();
    }
  }
  
  function stopGame() {
    isRunning = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = undefined;
    }
  }
  
  function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballDX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballDY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  }
  
  function updateScoreDisplay() {
    playerScoreDisplay.textContent = playerScore;
    aiScoreDisplay.textContent = aiScore;
  }
  
  function moveBall() {
    ballX += ballDX;
    ballY += ballDY;
  }
  
  function movePlayer() {
    if (keys.ArrowUp) {
      playerY -= PADDLE_SPEED * 2;
    }
    if (keys.ArrowDown) {
      playerY += PADDLE_SPEED * 2;
    }
    
    // Keep player paddle in bounds
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
  }
  
  function moveAI() {
    // Simple AI - follow the ball
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    const ballCenter = ballY + BALL_SIZE / 2;
    
    if (aiCenter < ballCenter) {
      aiY += PADDLE_SPEED;
    } else if (aiCenter > ballCenter) {
      aiY -= PADDLE_SPEED;
    }
    
    // Keep AI paddle in bounds
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
  }
  
  function checkCollisions() {
    // Ball hits top or bottom
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
      ballDY = -ballDY;
    }
    
    // Ball hits player paddle
    if (ballX <= PADDLE_WIDTH && 
        ballY + BALL_SIZE >= playerY && 
        ballY <= playerY + PADDLE_HEIGHT) {
      ballDX = Math.abs(ballDX);
      // Adjust angle based on where ball hits paddle
      const relativePaddleHit = (playerY + PADDLE_HEIGHT / 2) - (ballY + BALL_SIZE / 2);
      ballDY = -(relativePaddleHit / 10);
    }
    
    // Ball hits AI paddle
    if (ballX + BALL_SIZE >= canvas.width - PADDLE_WIDTH && 
        ballY + BALL_SIZE >= aiY && 
        ballY <= aiY + PADDLE_HEIGHT) {
      ballDX = -Math.abs(ballDX);
      // Adjust angle based on where ball hits paddle
      const relativePaddleHit = (aiY + PADDLE_HEIGHT / 2) - (ballY + BALL_SIZE / 2);
      ballDY = -(relativePaddleHit / 10);
    }
    
    // Ball goes out of bounds - scoring
    if (ballX < 0) {
      aiScore++;
      updateScoreDisplay();
      resetBall();
    } else if (ballX > canvas.width) {
      playerScore++;
      updateScoreDisplay();
      resetBall();
    }
  }
  
  function draw() {
    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(canvas.width - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
    
    // Draw center line
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    
    // Draw scores
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(playerScore, canvas.width / 4, 30);
    ctx.fillText(aiScore, 3 * canvas.width / 4, 30);
  }
  
  function gameLoop() {
    if (isRunning) {
      movePlayer();
      moveBall();
      moveAI();
      checkCollisions();
      draw();
      animationId = requestAnimationFrame(gameLoop);
    }
  }
  
  // Initial draw
  draw();
});`
    },
    difficulty: "intermediate",
    featured: true,
    playUrl: "/play/pong-java"
  };
};
