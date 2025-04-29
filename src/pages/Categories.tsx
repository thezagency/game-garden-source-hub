
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GameCard from "../components/GameCard";
import { getGameByCategory } from "../data/games";
import { ChevronLeft } from "lucide-react";

const Categories = () => {
  const { category = "all" } = useParams<{ category: string }>();
  const games = getGameByCategory(category);
  
  const categoryDisplayName = () => {
    switch (category) {
      case "arcade":
        return "Arcade Games";
      case "puzzle":
        return "Puzzle Games";
      case "action":
        return "Action Games";
      case "strategy":
        return "Strategy Games";
      default:
        return "All Games";
    }
  };
  
  const categoryDescription = () => {
    switch (category) {
      case "arcade":
        return "Classic arcade-style games with simple controls and addictive gameplay.";
      case "puzzle":
        return "Brain-teasing puzzles that challenge your problem-solving skills.";
      case "action":
        return "Fast-paced games that test your reflexes and coordination.";
      case "strategy":
        return "Games that require careful planning and tactical decision making.";
      default:
        return "Browse our complete collection of games with full source code and explanations.";
    }
  };
  
  return (
    <div className="min-h-screen bg-game-dark flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/" className="text-gray-400 hover:text-game-teal inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{categoryDisplayName()}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{categoryDescription()}</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            to="/categories/all"
            className={`px-6 py-2 rounded-full transition-all ${
              category === "all"
                ? "bg-game-purple text-white"
                : "bg-game-dark-accent text-gray-400 hover:text-white"
            }`}
          >
            All Games
          </Link>
          <Link
            to="/categories/arcade"
            className={`px-6 py-2 rounded-full transition-all ${
              category === "arcade"
                ? "bg-game-purple text-white"
                : "bg-game-dark-accent text-gray-400 hover:text-white"
            }`}
          >
            Arcade
          </Link>
          <Link
            to="/categories/puzzle"
            className={`px-6 py-2 rounded-full transition-all ${
              category === "puzzle"
                ? "bg-game-purple text-white"
                : "bg-game-dark-accent text-gray-400 hover:text-white"
            }`}
          >
            Puzzle
          </Link>
          <Link
            to="/categories/action"
            className={`px-6 py-2 rounded-full transition-all ${
              category === "action"
                ? "bg-game-purple text-white"
                : "bg-game-dark-accent text-gray-400 hover:text-white"
            }`}
          >
            Action
          </Link>
          <Link
            to="/categories/strategy"
            className={`px-6 py-2 rounded-full transition-all ${
              category === "strategy"
                ? "bg-game-purple text-white"
                : "bg-game-dark-accent text-gray-400 hover:text-white"
            }`}
          >
            Strategy
          </Link>
        </div>
        
        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-4">No games found in this category.</h3>
            <p className="text-gray-400 mb-8">Try selecting a different category or check back later.</p>
            <Link to="/categories/all" className="btn-game">
              View All Games
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
