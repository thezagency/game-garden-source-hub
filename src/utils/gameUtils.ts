
import { getSnakeGame } from "../components/games/SnakeGame";
import { getTetrisGame } from "../components/games/TetrisGame";
import { getChessGame } from "../components/games/ChessGame";
import { getTowerDefenseGame } from "../components/games/TowerDefenseGame";
import { getPongGame } from "../components/games/PongGame";
import { get2048Game } from "../components/games/Game2048";
import { Game } from "../types";

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
    get2048Game()
  ];
  
  // Ensure all games have the correct playUrl format
  return games.map(game => ({
    ...game,
    playUrl: `/play/${game.id}`
  }));
};
