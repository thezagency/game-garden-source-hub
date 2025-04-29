
import { Link } from "react-router-dom";
import { Gamepad } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-game-dark-accent sticky top-0 z-50 border-b border-game-purple/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Gamepad className="text-game-teal h-8 w-8" />
            <span className="text-xl font-bold text-white">GameSourceHub</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-game-teal transition-colors">
              Home
            </Link>
            <Link to="/categories/arcade" className="text-white hover:text-game-teal transition-colors">
              Arcade
            </Link>
            <Link to="/categories/puzzle" className="text-white hover:text-game-teal transition-colors">
              Puzzle
            </Link>
            <Link to="/categories/action" className="text-white hover:text-game-teal transition-colors">
              Action
            </Link>
            <Link to="/categories/strategy" className="text-white hover:text-game-teal transition-colors">
              Strategy
            </Link>
          </div>
          
          <div className="md:hidden">
            <button className="text-white p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
