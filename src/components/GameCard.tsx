
import { Link } from "react-router-dom";
import { Game } from "../types";
import { Trophy, Play } from "lucide-react";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const difficultyColor = () => {
    switch (game.difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="game-card group">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={game.imageUrl} 
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          {game.featured && (
            <div className="bg-game-purple text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              Featured
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="text-white font-bold">{game.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs px-2 py-1 rounded-full text-white ${difficultyColor()}`}>
            {game.difficulty}
          </span>
          <span className="text-xs text-gray-300 capitalize">{game.category}</span>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{game.description}</p>
        
        <div className="flex space-x-2">
          <Link 
            to={`/game/${game.id}`}
            className="btn-outline text-xs px-3 py-2 flex-1 text-center"
          >
            View Code
          </Link>
          <Link 
            to={`/play/${game.id}`}
            className="btn-game text-xs px-3 py-2 flex-1 text-center flex items-center justify-center"
          >
            <Play className="h-3 w-3 mr-1" />
            Play
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
