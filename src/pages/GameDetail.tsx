
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getGameById } from "../data/games";
import { Play, Code, ChevronLeft } from "lucide-react";

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const game = getGameById(id || "");
  const [activeTab, setActiveTab] = useState<string>(
    game?.sourceCode.html ? "html" : 
    game?.sourceCode.ts ? "ts" : 
    game?.sourceCode.js ? "js" : 
    game?.sourceCode.css ? "css" : ""
  );
  
  if (!game) {
    return (
      <div className="min-h-screen bg-game-dark flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game Not Found</h2>
            <p className="text-gray-400 mb-8">The game you're looking for doesn't exist.</p>
            <Link to="/" className="btn-game">
              Go Back Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const renderSourceCode = () => {
    switch (activeTab) {
      case "html":
        return game.sourceCode.html || "No HTML code available";
      case "css":
        return game.sourceCode.css || "No CSS code available";
      case "js":
        return game.sourceCode.js || "No JavaScript code available";
      case "ts":
        return game.sourceCode.ts || "No TypeScript code available";
      default:
        return "Select a tab to view code";
    }
  };
  
  const formatCode = (code: string) => {
    // This would normally use a proper syntax highlighter
    // But for simplicity, we'll just handle comments with a basic approach
    return code.split('\n').map((line, index) => {
      if (line.trim().startsWith("//")) {
        return (
          <div key={index} className="comment">
            {line}
          </div>
        );
      } else if (line.includes("//")) {
        const [code, comment] = line.split("//");
        return (
          <div key={index}>
            {code}<span className="comment">//{comment}</span>
          </div>
        );
      } else if (line.trim().startsWith("/*") || line.includes("/*") || line.includes("*/")) {
        return (
          <div key={index} className="comment">
            {line}
          </div>
        );
      } else if (line.trim().startsWith("<!--") || line.includes("<!--") || line.includes("-->")) {
        return (
          <div key={index} className="comment">
            {line}
          </div>
        );
      }
      return <div key={index}>{line}</div>;
    });
  };

  return (
    <div className="min-h-screen bg-game-dark flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/" className="text-gray-400 hover:text-game-teal inline-flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Games
            </Link>
          </div>
          
          <div className="bg-game-dark-accent rounded-xl overflow-hidden border border-game-purple/20">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{game.title}</h1>
                  <p className="text-gray-300 mb-4">{game.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="bg-game-purple/20 text-game-purple px-3 py-1 rounded-full text-sm">
                      {game.category}
                    </span>
                    <span className="bg-game-teal/20 text-game-teal px-3 py-1 rounded-full text-sm capitalize">
                      {game.difficulty}
                    </span>
                    <div className="flex gap-2">
                      {game.sourceCode.html && (
                        <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">HTML</span>
                      )}
                      {game.sourceCode.css && (
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">CSS</span>
                      )}
                      {game.sourceCode.js && (
                        <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">JS</span>
                      )}
                      {game.sourceCode.ts && (
                        <span className="bg-blue-700/20 text-blue-300 px-3 py-1 rounded-full text-sm">TS</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Link 
                    to={`/play/${game.id}`} 
                    className="btn-game flex items-center justify-center"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Play Game
                  </Link>
                </div>
              </div>
              
              <div>
                <div className="flex border-b border-game-purple/20">
                  {game.sourceCode.html && (
                    <button 
                      className={`px-4 py-2 ${activeTab === "html" ? "text-game-teal border-b-2 border-game-teal" : "text-gray-400"}`}
                      onClick={() => setActiveTab("html")}
                    >
                      HTML
                    </button>
                  )}
                  {game.sourceCode.css && (
                    <button 
                      className={`px-4 py-2 ${activeTab === "css" ? "text-game-teal border-b-2 border-game-teal" : "text-gray-400"}`}
                      onClick={() => setActiveTab("css")}
                    >
                      CSS
                    </button>
                  )}
                  {game.sourceCode.js && (
                    <button 
                      className={`px-4 py-2 ${activeTab === "js" ? "text-game-teal border-b-2 border-game-teal" : "text-gray-400"}`}
                      onClick={() => setActiveTab("js")}
                    >
                      JavaScript
                    </button>
                  )}
                  {game.sourceCode.ts && (
                    <button 
                      className={`px-4 py-2 ${activeTab === "ts" ? "text-game-teal border-b-2 border-game-teal" : "text-gray-400"}`}
                      onClick={() => setActiveTab("ts")}
                    >
                      TypeScript
                    </button>
                  )}
                </div>
                
                <pre className="language-javascript mt-4 p-6 bg-[#1e1e1e] rounded-lg overflow-x-auto text-sm text-gray-300 font-mono">
                  <code>
                    {formatCode(renderSourceCode())}
                  </code>
                </pre>
              </div>
              
              <div className="mt-8 p-6 bg-black/30 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
                <p className="text-gray-300 mb-4">
                  This game showcases core principles of interactive web development using 
                  {game.sourceCode.html && " HTML"}
                  {game.sourceCode.css && ", CSS"}
                  {game.sourceCode.js && ", JavaScript"}
                  {game.sourceCode.ts && ", TypeScript"}.
                </p>
                <p className="text-gray-300">
                  The source code is heavily commented to explain the logic behind each component. 
                  Feel free to study it, modify it, and use it as a foundation for your own projects!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GameDetail;
