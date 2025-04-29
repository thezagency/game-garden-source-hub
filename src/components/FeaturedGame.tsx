
import { Link } from "react-router-dom";
import { Game } from "../types";
import { Star, Code, Play } from "lucide-react";

interface FeaturedGameProps {
  game: Game;
}

const FeaturedGame = ({ game }: FeaturedGameProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-game-purple/30 bg-gradient-to-br from-game-dark to-game-dark-accent">
      <div className="md:flex">
        <div className="md:w-1/2 relative">
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-game-purple text-white px-3 py-1 rounded-full text-sm flex items-center">
              <Star className="h-4 w-4 mr-1 text-game-yellow" />
              Featured Game
            </div>
          </div>
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-game-dark via-transparent to-transparent md:hidden"></div>
        </div>
        
        <div className="p-6 md:w-1/2 flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-xs uppercase tracking-wider text-game-teal bg-game-teal/10 px-3 py-1 rounded-full">
              {game.category}
            </span>
          </div>
          
          <h2 className="text-3xl font-bold mb-3 text-white">{game.title}</h2>
          
          <p className="text-gray-300 mb-6">{game.description}</p>
          
          <div className="flex space-x-4">
            <Link
              to={`/game/${game.id}`}
              className="btn-outline flex items-center justify-center"
            >
              <Code className="w-5 h-5 mr-2" />
              View Source
            </Link>
            
            <a
              href={game.playUrl}
              className="btn-game flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Game
            </a>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center">
              <span className="text-gray-400 text-sm">Difficulty:</span>
              <span className="ml-2 text-white capitalize">{game.difficulty}</span>
            </div>
            
            <div className="flex items-center mt-1">
              <span className="text-gray-400 text-sm">Languages:</span>
              <div className="flex ml-2 space-x-2">
                {game.sourceCode.html && (
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">HTML</span>
                )}
                {game.sourceCode.css && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">CSS</span>
                )}
                {game.sourceCode.js && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">JavaScript</span>
                )}
                {game.sourceCode.ts && (
                  <span className="px-2 py-1 bg-blue-700/20 text-blue-300 text-xs rounded">TypeScript</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedGame;
