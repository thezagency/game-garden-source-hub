
export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  sourceCode: {
    html?: string;
    css?: string; 
    js?: string;
    ts?: string;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
  playUrl: string;
}

export type GameCategory = 'puzzle' | 'arcade' | 'strategy' | 'action' | 'all';
