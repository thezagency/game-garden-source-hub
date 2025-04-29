
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GameCard from "../components/GameCard";
import FeaturedGame from "../components/FeaturedGame";
import { getFeaturedGames, getGameByCategory } from "../data/games";
import { Game, GameCategory } from "../types";
import { Gamepad, Code, Dices } from "lucide-react";

const Index = () => {
  const featuredGames = getFeaturedGames();
  const [activeCategory, setActiveCategory] = useState<GameCategory>("all");
  const games = getGameByCategory(activeCategory);
  
  return (
    <div className="flex flex-col min-h-screen bg-game-dark">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-game-dark-accent overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-game-purple/20 to-game-teal/10"></div>
          <div className="container mx-auto px-4 py-16 md:py-24 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Learn Game Development with Source Code Examples
                </h1>
                <p className="text-gray-300 text-lg mb-8 max-w-lg">
                  Explore, play, and learn from a collection of web-based games with complete source code and detailed explanations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link 
                    to="/categories/all" 
                    className="btn-game flex items-center justify-center"
                  >
                    <Gamepad className="mr-2 h-5 w-5" />
                    Browse Games
                  </Link>
                  <a 
                    href="#featured" 
                    className="btn-outline flex items-center justify-center"
                  >
                    <Dices className="mr-2 h-5 w-5" />
                    Featured Games
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 animate-float">
                <div className="bg-gradient-to-br from-game-purple/20 to-game-teal/10 rounded-lg p-6 animate-pulse-glow">
                  <div className="bg-game-dark-accent rounded-lg p-4">
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>
{`// Game development is fun!
class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.context = this.canvas.getContext('2d');
    this.score = 0;
    this.init();
  }

  init() {
    // Setup game environment
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Start the game
const myGame = new Game();`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Games Section */}
        <section id="featured" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Featured Games</h2>
            <p className="text-gray-400">Check out our most popular games with source code</p>
          </div>
          
          <div className="space-y-8">
            {featuredGames.map((game) => (
              <FeaturedGame key={game.id} game={game} />
            ))}
          </div>
        </section>
        
        {/* Game Categories Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Game Collection</h2>
            <p className="text-gray-400">Explore different categories of games with source code</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === "all"
                  ? "bg-game-purple text-white"
                  : "bg-game-dark-accent text-gray-400 hover:text-white"
              }`}
            >
              All Games
            </button>
            <button
              onClick={() => setActiveCategory("arcade")}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === "arcade"
                  ? "bg-game-purple text-white"
                  : "bg-game-dark-accent text-gray-400 hover:text-white"
              }`}
            >
              Arcade
            </button>
            <button
              onClick={() => setActiveCategory("puzzle")}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === "puzzle"
                  ? "bg-game-purple text-white"
                  : "bg-game-dark-accent text-gray-400 hover:text-white"
              }`}
            >
              Puzzle
            </button>
            <button
              onClick={() => setActiveCategory("action")}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === "action"
                  ? "bg-game-purple text-white"
                  : "bg-game-dark-accent text-gray-400 hover:text-white"
              }`}
            >
              Action
            </button>
            <button
              onClick={() => setActiveCategory("strategy")}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === "strategy"
                  ? "bg-game-purple text-white"
                  : "bg-game-dark-accent text-gray-400 hover:text-white"
              }`}
            >
              Strategy
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
        
        {/* About Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-br from-game-dark-accent to-black rounded-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-white mb-6">Learn by Seeing Real Code</h2>
                <p className="text-gray-300 mb-4">
                  GameSourceHub provides fully commented source code for all games, making it perfect for:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="bg-game-purple/20 p-1 rounded-full text-game-purple mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-300">Beginner programmers learning the basics of game logic</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-game-purple/20 p-1 rounded-full text-game-purple mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-300">Intermediate developers looking for specific implementation techniques</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-game-purple/20 p-1 rounded-full text-game-purple mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-300">Advanced coders seeking inspiration for their own projects</span>
                  </li>
                </ul>
                <Link to="/categories/all" className="btn-outline inline-flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Explore All Games
                </Link>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-game-purple/30 to-game-teal/20 p-8 lg:p-12 flex items-center justify-center">
                <div className="bg-black/50 rounded-lg p-6 w-full max-w-md">
                  <pre className="text-gray-300 text-xs sm:text-sm overflow-x-auto">
                    <code>
{`// Snake Game Movement Logic
function moveSnake() {
  // Create new head based on direction
  const head = {...snake[0]};
  
  // Update head position based on current direction
  switch(direction) {
    case 'up': 
      head.y--; 
      break;
    case 'down': 
      head.y++; 
      break;
    case 'left': 
      head.x--; 
      break;
    case 'right': 
      head.x++; 
      break;
  }
  
  // Add new head to beginning of snake array
  snake.unshift(head);
  
  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    // Generate new food, no need to remove tail
    food = generateFood();
    score += 10;
  } else {
    // Remove tail segment if no food eaten
    snake.pop();
  }
}`}
                    </code>
                  </pre>
                  <div className="text-center mt-4">
                    <span className="text-game-teal text-sm">Every game includes readable, commented code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-game-purple to-game-teal rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Coding Games?</h2>
            <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
              Dive into our collection of games with source code examples and start building your own interactive experiences today!
            </p>
            <Link to="/categories/beginner" className="bg-white text-game-purple font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition-colors inline-block">
              Start with Beginner Games
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
