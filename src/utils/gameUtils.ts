
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

/**
 * Helper function to get additional games created as components
 * This makes it easy to add more games in component format
 */
export const getComponentGames = (): Game[] => {
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

  // Merge component games with additional games from data file
  // This will give us a large collection of games
  return [...componentGames, ...additionalGames];
};
