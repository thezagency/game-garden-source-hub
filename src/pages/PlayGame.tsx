
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getGameById } from "../data/games";
import { ChevronLeft, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PlayGame = () => {
  const { id } = useParams<{ id: string }>();
  const game = getGameById(id || "");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [iframeContent, setIframeContent] = useState("");

  useEffect(() => {
    // Generate the iframe content once game data is loaded
    if (game) {
      const content = generateGameContent();
      setIframeContent(content);
    }

    // Show loading state briefly for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [game]);

  useEffect(() => {
    if (game && !isLoading) {
      toast({
        title: `${game.title} loaded!`,
        description: "Have fun playing this game!",
      });
    }
  }, [game, isLoading, toast]);

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

  // Determine if the game has C# or Java code to show warning
  const hasNonWebCode = game.sourceCode?.csharp || game.sourceCode?.java;

  // Generate the HTML content for the iframe
  function generateGameContent() {
    // Fix for template literals in JavaScript code
    const jsCode = game.sourceCode?.js || game.sourceCode?.ts || '// No JavaScript or TypeScript code available';
    
    // Create safe HTML content without template literals
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${game.title}</title>
        <style>
          body {
            margin: 0;
            overflow: hidden;
            font-family: Arial, sans-serif;
          }
          ${game.sourceCode?.css || ''}
        </style>
      </head>
      <body>
        ${game.sourceCode?.html || '<div id="game-container"></div>'}
        <script>
          ${jsCode}
        </script>
      </body>
      </html>
    `;
  }

  return (
    <div className="min-h-screen bg-game-dark flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <Link to={`/game/${game.id}`} className="text-gray-400 hover:text-game-teal inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            View Source Code
          </Link>
          <h1 className="text-2xl font-bold text-white">{game.title}</h1>
          <div className="w-24"></div> {/* Empty div for balanced layout */}
        </div>

        <div className="bg-game-dark-accent rounded-xl overflow-hidden border border-game-purple/20">
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="w-12 h-12 border-4 border-game-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="game-frame p-4">
              {hasNonWebCode && (
                <div className="bg-amber-500/20 border border-amber-500/50 text-amber-200 p-4 mb-4 rounded-lg">
                  <p className="font-semibold">
                    This game is showing the JavaScript implementation of the {game.sourceCode?.csharp ? 'C#' : 'Java'} code.
                  </p>
                  <p className="text-sm mt-2">
                    In a production environment, the {game.sourceCode?.csharp ? 'C#' : 'Java'} code would be running on the server.
                    View the source code to see both implementations.
                  </p>
                </div>
              )}
              <iframe
                title={game.title}
                className="w-full h-[500px] bg-white rounded-lg"
                srcDoc={iframeContent}
                sandbox="allow-scripts"
              ></iframe>
            </div>
          )}

          <div className="p-6 border-t border-game-purple/20">
            <h2 className="text-xl font-bold text-white mb-4">How to Play</h2>
            <div className="text-gray-300">
              <p>Use the controls as indicated in the game. Generally:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Arrow keys for movement</li>
                <li>Space for jump or action</li>
                <li>Mouse clicks for selections</li>
                <li>Refer to in-game instructions for specific controls</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to={`/game/${game.id}`} className="btn-outline inline-flex items-center">
            <Code className="mr-2 h-5 w-5" />
            View Source Code
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlayGame;
