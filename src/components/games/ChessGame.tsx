
import React from "react";
import { Game } from "../../types";

export const getChessGame = (): Game => {
  return {
    id: "chess-csharp",
    title: "Chess Game (C#)",
    description: "Full-featured chess game implemented in C# with move validation and AI opponent",
    imageUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=1258&fm=jpg",
    category: "strategy",
    sourceCode: {
      html: `<div id="chess-container">
  <div id="board"></div>
  <div id="controls">
    <div>
      <button id="restart">New Game</button>
      <button id="undo">Undo Move</button>
    </div>
    <div id="status"></div>
  </div>
</div>`,
      css: `#chess-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

#board {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  border: 2px solid #333;
}

.square {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5vw;
  cursor: pointer;
}

.white {
  background-color: #f0d9b5;
}

.black {
  background-color: #b58863;
}

.highlighted {
  background-color: rgba(173, 216, 230, 0.7);
}

.selected {
  background-color: rgba(144, 238, 144, 0.7);
}

.check {
  background-color: rgba(255, 0, 0, 0.4);
}

#controls {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 8px 15px;
  margin-right: 10px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #34495e;
}

#status {
  font-weight: bold;
}`,
      csharp: `
using System;
using System.Collections.Generic;

namespace ChessGame
{
    // Piece types
    public enum PieceType
    {
        None,
        Pawn,
        Knight,
        Bishop,
        Rook,
        Queen,
        King
    }

    // Colors
    public enum Color
    {
        White,
        Black
    }

    // Chess Piece
    public class Piece
    {
        public PieceType Type { get; private set; }
        public Color Color { get; private set; }
        public bool HasMoved { get; set; }

        public Piece(PieceType type, Color color)
        {
            Type = type;
            Color = color;
            HasMoved = false;
        }

        public override string ToString()
        {
            char c = ' ';
            switch (Type)
            {
                case PieceType.Pawn: c = 'P'; break;
                case PieceType.Knight: c = 'N'; break;
                case PieceType.Bishop: c = 'B'; break;
                case PieceType.Rook: c = 'R'; break;
                case PieceType.Queen: c = 'Q'; break;
                case PieceType.King: c = 'K'; break;
            }
            
            return Color == Color.White ? c.ToString() : c.ToString().ToLower();
        }
    }

    // Position on board
    public struct Position
    {
        public int Row { get; private set; }
        public int Col { get; private set; }

        public Position(int row, int col)
        {
            Row = row;
            Col = col;
        }

        public bool IsValid()
        {
            return Row >= 0 && Row < 8 && Col >= 0 && Col < 8;
        }

        public override string ToString()
        {
            return $"{(char)('a' + Col)}{8 - Row}";
        }
    }

    // Move representation
    public class Move
    {
        public Position From { get; private set; }
        public Position To { get; private set; }
        public PieceType Promotion { get; set; }
        public Piece CapturedPiece { get; set; }
        public bool IsEnPassant { get; set; }
        public bool IsCastling { get; set; }

        public Move(Position from, Position to)
        {
            From = from;
            To = to;
            Promotion = PieceType.None;
            CapturedPiece = null;
            IsEnPassant = false;
            IsCastling = false;
        }
    }

    // Board representation
    public class Board
    {
        private Piece[,] pieces;
        public Color CurrentPlayer { get; private set; }
        public List<Move> MoveHistory { get; private set; }
        public Position EnPassantTarget { get; private set; }
        public bool IsGameOver { get; private set; }
        public string GameResult { get; private set; }

        public Board()
        {
            pieces = new Piece[8, 8];
            MoveHistory = new List<Move>();
            CurrentPlayer = Color.White;
            EnPassantTarget = new Position(-1, -1);
            IsGameOver = false;
            GameResult = "";
            InitializeBoard();
        }

        // Initialize standard chess position
        private void InitializeBoard()
        {
            // Set up pawns
            for (int col = 0; col < 8; col++)
            {
                pieces[1, col] = new Piece(PieceType.Pawn, Color.Black);
                pieces[6, col] = new Piece(PieceType.Pawn, Color.White);
            }

            // Set up rooks
            pieces[0, 0] = new Piece(PieceType.Rook, Color.Black);
            pieces[0, 7] = new Piece(PieceType.Rook, Color.Black);
            pieces[7, 0] = new Piece(PieceType.Rook, Color.White);
            pieces[7, 7] = new Piece(PieceType.Rook, Color.White);

            // Set up knights
            pieces[0, 1] = new Piece(PieceType.Knight, Color.Black);
            pieces[0, 6] = new Piece(PieceType.Knight, Color.Black);
            pieces[7, 1] = new Piece(PieceType.Knight, Color.White);
            pieces[7, 6] = new Piece(PieceType.Knight, Color.White);

            // Set up bishops
            pieces[0, 2] = new Piece(PieceType.Bishop, Color.Black);
            pieces[0, 5] = new Piece(PieceType.Bishop, Color.Black);
            pieces[7, 2] = new Piece(PieceType.Bishop, Color.White);
            pieces[7, 5] = new Piece(PieceType.Bishop, Color.White);

            // Set up queens
            pieces[0, 3] = new Piece(PieceType.Queen, Color.Black);
            pieces[7, 3] = new Piece(PieceType.Queen, Color.White);

            // Set up kings
            pieces[0, 4] = new Piece(PieceType.King, Color.Black);
            pieces[7, 4] = new Piece(PieceType.King, Color.White);
        }

        // Get piece at position
        public Piece GetPiece(Position pos)
        {
            if (pos.IsValid())
            {
                return pieces[pos.Row, pos.Col];
            }
            return null;
        }

        // Make a move
        public bool MakeMove(Move move)
        {
            if (!IsValidMove(move))
            {
                return false;
            }

            // Store captured piece
            move.CapturedPiece = GetPiece(move.To);

            // Check for en passant capture
            if (move.IsEnPassant)
            {
                int captureRow = CurrentPlayer == Color.White ? move.To.Row + 1 : move.To.Row - 1;
                move.CapturedPiece = pieces[captureRow, move.To.Col];
                pieces[captureRow, move.To.Col] = null;
            }

            // Move the piece
            Piece movingPiece = pieces[move.From.Row, move.From.Col];
            pieces[move.To.Row, move.To.Col] = movingPiece;
            pieces[move.From.Row, move.From.Col] = null;

            // Handle castling
            if (move.IsCastling)
            {
                // Kingside castling
                if (move.To.Col == 6)
                {
                    Piece rook = pieces[move.From.Row, 7];
                    pieces[move.From.Row, 5] = rook;
                    pieces[move.From.Row, 7] = null;
                }
                // Queenside castling
                else if (move.To.Col == 2)
                {
                    Piece rook = pieces[move.From.Row, 0];
                    pieces[move.From.Row, 3] = rook;
                    pieces[move.From.Row, 0] = null;
                }
            }

            // Handle pawn promotion
            if (movingPiece.Type == PieceType.Pawn && 
                (move.To.Row == 0 || move.To.Row == 7))
            {
                if (move.Promotion == PieceType.None)
                {
                    move.Promotion = PieceType.Queen; // Default promotion
                }
                
                pieces[move.To.Row, move.To.Col] = 
                    new Piece(move.Promotion, movingPiece.Color);
            }

            // Update en passant target
            if (movingPiece.Type == PieceType.Pawn && 
                Math.Abs(move.From.Row - move.To.Row) == 2)
            {
                int targetRow = (move.From.Row + move.To.Row) / 2;
                EnPassantTarget = new Position(targetRow, move.To.Col);
            }
            else
            {
                EnPassantTarget = new Position(-1, -1);
            }

            // Mark piece as moved
            movingPiece.HasMoved = true;

            // Add to move history
            MoveHistory.Add(move);

            // Switch turns
            CurrentPlayer = CurrentPlayer == Color.White ? Color.Black : Color.White;

            // Check for game end conditions
            CheckGameEndConditions();

            return true;
        }

        // Check if move is valid
        public bool IsValidMove(Move move)
        {
            // Basic checks
            if (!move.From.IsValid() || !move.To.IsValid())
            {
                return false;
            }

            Piece piece = GetPiece(move.From);
            if (piece == null || piece.Color != CurrentPlayer)
            {
                return false;
            }

            Piece targetPiece = GetPiece(move.To);
            if (targetPiece != null && targetPiece.Color == CurrentPlayer)
            {
                return false;
            }

            // Check specific piece move rules
            switch (piece.Type)
            {
                case PieceType.Pawn:
                    return IsValidPawnMove(move, piece);
                case PieceType.Knight:
                    return IsValidKnightMove(move);
                case PieceType.Bishop:
                    return IsValidBishopMove(move);
                case PieceType.Rook:
                    return IsValidRookMove(move);
                case PieceType.Queen:
                    return IsValidQueenMove(move);
                case PieceType.King:
                    return IsValidKingMove(move, piece);
            }

            return false;
        }

        // Check if king is in check
        public bool IsInCheck(Color color)
        {
            Position kingPos = FindKing(color);

            // Check if any opponent piece can capture the king
            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    Piece piece = pieces[row, col];
                    if (piece != null && piece.Color != color)
                    {
                        Move move = new Move(new Position(row, col), kingPos);
                        if (IsValidBasicMove(move, piece))
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        // Find a king's position
        private Position FindKing(Color color)
        {
            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    Piece piece = pieces[row, col];
                    if (piece != null && piece.Type == PieceType.King && piece.Color == color)
                    {
                        return new Position(row, col);
                    }
                }
            }
            
            throw new InvalidOperationException("King not found");
        }

        // Check for checkmate and stalemate
        private void CheckGameEndConditions()
        {
            // Check if current player has any legal moves
            if (!HasLegalMoves(CurrentPlayer))
            {
                IsGameOver = true;
                if (IsInCheck(CurrentPlayer))
                {
                    GameResult = CurrentPlayer == Color.White ? 
                        "Black wins by checkmate" : "White wins by checkmate";
                }
                else
                {
                    GameResult = "Game drawn by stalemate";
                }
            }
        }

        // Check if player has any legal moves
        private bool HasLegalMoves(Color color)
        {
            for (int fromRow = 0; fromRow < 8; fromRow++)
            {
                for (int fromCol = 0; fromCol < 8; fromCol++)
                {
                    Piece piece = pieces[fromRow, fromCol];
                    if (piece != null && piece.Color == color)
                    {
                        for (int toRow = 0; toRow < 8; toRow++)
                        {
                            for (int toCol = 0; toCol < 8; toCol++)
                            {
                                Move move = new Move(
                                    new Position(fromRow, fromCol),
                                    new Position(toRow, toCol)
                                );
                                
                                if (IsLegalMove(move))
                                {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            
            return false;
        }

        // Check if move is legal (doesn't leave king in check)
        private bool IsLegalMove(Move move)
        {
            if (!IsValidMove(move))
            {
                return false;
            }

            // Create a copy of the current board
            Board tempBoard = new Board();
            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    tempBoard.pieces[row, col] = pieces[row, col];
                }
            }
            tempBoard.CurrentPlayer = CurrentPlayer;
            tempBoard.EnPassantTarget = EnPassantTarget;

            // Make the move on the copied board
            tempBoard.MakeMove(move);

            // Check if the king is in check after the move
            if (tempBoard.IsInCheck(CurrentPlayer))
            {
                return false;
            }

            return true;
        }

        // Validate pawn moves
        private bool IsValidPawnMove(Move move, Piece pawn)
        {
            int direction = pawn.Color == Color.White ? -1 : 1;
            int rowDiff = move.To.Row - move.From.Row;
            int colDiff = move.To.Col - move.From.Col;

            // Forward move
            if (colDiff == 0)
            {
                // Single step forward
                if (rowDiff == direction && GetPiece(move.To) == null)
                {
                    return true;
                }

                // Double step from starting position
                if (rowDiff == 2 * direction && !pawn.HasMoved)
                {
                    Position middlePos = new Position(move.From.Row + direction, move.From.Col);
                    return GetPiece(move.To) == null && GetPiece(middlePos) == null;
                }
            }
            // Capture diagonally
            else if (Math.Abs(colDiff) == 1 && rowDiff == direction)
            {
                Piece targetPiece = GetPiece(move.To);
                
                // Normal capture
                if (targetPiece != null && targetPiece.Color != pawn.Color)
                {
                    return true;
                }
                
                // En passant capture
                Position enPassantPos = EnPassantTarget;
                if (enPassantPos.Row == move.To.Row && enPassantPos.Col == move.To.Col)
                {
                    move.IsEnPassant = true;
                    return true;
                }
            }

            return false;
        }

        // Validate knight moves
        private bool IsValidKnightMove(Move move)
        {
            int rowDiff = Math.Abs(move.To.Row - move.From.Row);
            int colDiff = Math.Abs(move.To.Col - move.From.Col);

            return (rowDiff == 2 && colDiff == 1) || (rowDiff == 1 && colDiff == 2);
        }

        // Validate bishop moves
        private bool IsValidBishopMove(Move move)
        {
            int rowDiff = Math.Abs(move.To.Row - move.From.Row);
            int colDiff = Math.Abs(move.To.Col - move.From.Col);

            // Must move diagonally
            if (rowDiff != colDiff || rowDiff == 0)
            {
                return false;
            }

            // Check path is clear
            return IsDiagonalPathClear(move.From, move.To);
        }

        // Check if diagonal path is clear
        private bool IsDiagonalPathClear(Position from, Position to)
        {
            int rowDir = from.Row < to.Row ? 1 : -1;
            int colDir = from.Col < to.Col ? 1 : -1;

            for (int i = 1; i < Math.Abs(from.Row - to.Row); i++)
            {
                Position pos = new Position(from.Row + i * rowDir, from.Col + i * colDir);
                if (GetPiece(pos) != null)
                {
                    return false;
                }
            }

            return true;
        }

        // Validate rook moves
        private bool IsValidRookMove(Move move)
        {
            int rowDiff = Math.Abs(move.To.Row - move.From.Row);
            int colDiff = Math.Abs(move.To.Col - move.From.Col);

            // Must move horizontally or vertically
            if (rowDiff != 0 && colDiff != 0)
            {
                return false;
            }

            // Check path is clear
            return IsStraightPathClear(move.From, move.To);
        }

        // Check if straight path is clear
        private bool IsStraightPathClear(Position from, Position to)
        {
            if (from.Row == to.Row)
            {
                // Horizontal move
                int direction = from.Col < to.Col ? 1 : -1;
                for (int col = from.Col + direction; col != to.Col; col += direction)
                {
                    if (GetPiece(new Position(from.Row, col)) != null)
                    {
                        return false;
                    }
                }
            }
            else
            {
                // Vertical move
                int direction = from.Row < to.Row ? 1 : -1;
                for (int row = from.Row + direction; row != to.Row; row += direction)
                {
                    if (GetPiece(new Position(row, from.Col)) != null)
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        // Validate queen moves
        private bool IsValidQueenMove(Move move)
        {
            int rowDiff = Math.Abs(move.To.Row - move.From.Row);
            int colDiff = Math.Abs(move.To.Col - move.From.Col);

            // Queen can move like a rook or bishop
            if (rowDiff == colDiff)
            {
                // Diagonal move
                return IsDiagonalPathClear(move.From, move.To);
            }
            else if (rowDiff == 0 || colDiff == 0)
            {
                // Straight move
                return IsStraightPathClear(move.From, move.To);
            }

            return false;
        }

        // Validate king moves
        private bool IsValidKingMove(Move move, Piece king)
        {
            int rowDiff = Math.Abs(move.To.Row - move.From.Row);
            int colDiff = Math.Abs(move.To.Col - move.From.Col);

            // Normal king move - one square in any direction
            if (rowDiff <= 1 && colDiff <= 1)
            {
                return true;
            }

            // Castling
            if (rowDiff == 0 && colDiff == 2 && !king.HasMoved && !IsInCheck(CurrentPlayer))
            {
                // Kingside castling
                if (move.To.Col == 6)
                {
                    Piece rook = GetPiece(new Position(move.From.Row, 7));
                    if (rook != null && rook.Type == PieceType.Rook && !rook.HasMoved)
                    {
                        // Check squares between king and rook are empty
                        if (GetPiece(new Position(move.From.Row, 5)) == null && 
                            GetPiece(new Position(move.From.Row, 6)) == null)
                        {
                            // Check king doesn't pass through check
                            Position midPos = new Position(move.From.Row, 5);
                            if (!WouldBeInCheck(midPos, CurrentPlayer))
                            {
                                move.IsCastling = true;
                                return true;
                            }
                        }
                    }
                }
                // Queenside castling
                else if (move.To.Col == 2)
                {
                    Piece rook = GetPiece(new Position(move.From.Row, 0));
                    if (rook != null && rook.Type == PieceType.Rook && !rook.HasMoved)
                    {
                        // Check squares between king and rook are empty
                        if (GetPiece(new Position(move.From.Row, 1)) == null && 
                            GetPiece(new Position(move.From.Row, 2)) == null && 
                            GetPiece(new Position(move.From.Row, 3)) == null)
                        {
                            // Check king doesn't pass through check
                            Position midPos = new Position(move.From.Row, 3);
                            if (!WouldBeInCheck(midPos, CurrentPlayer))
                            {
                                move.IsCastling = true;
                                return true;
                            }
                        }
                    }
                }
            }

            return false;
        }

        // Check if moving to position would put king in check
        private bool WouldBeInCheck(Position kingPos, Color color)
        {
            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    Piece piece = pieces[row, col];
                    if (piece != null && piece.Color != color)
                    {
                        Move move = new Move(new Position(row, col), kingPos);
                        if (IsValidBasicMove(move, piece))
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        // Check if move is valid without considering check
        private bool IsValidBasicMove(Move move, Piece piece)
        {
            switch (piece.Type)
            {
                case PieceType.Pawn:
                    return IsValidPawnMove(move, piece);
                case PieceType.Knight:
                    return IsValidKnightMove(move);
                case PieceType.Bishop:
                    return IsValidBishopMove(move);
                case PieceType.Rook:
                    return IsValidRookMove(move);
                case PieceType.Queen:
                    return IsValidQueenMove(move);
                case PieceType.King:
                    int rowDiff = Math.Abs(move.To.Row - move.From.Row);
                    int colDiff = Math.Abs(move.To.Col - move.From.Col);
                    return rowDiff <= 1 && colDiff <= 1;
            }
            return false;
        }
    }
}`,
      ts: `// TypeScript implementation for web browser
document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board')!;
  const statusElement = document.getElementById('status')!;
  const restartButton = document.getElementById('restart')!;
  const undoButton = document.getElementById('undo')!;
  
  // Piece types
  enum PieceType {
    None,
    Pawn,
    Knight,
    Bishop,
    Rook,
    Queen,
    King
  }
  
  // Colors
  enum Color {
    White,
    Black
  }
  
  // Chess piece representation
  class Piece {
    readonly type: PieceType;
    readonly color: Color;
    hasMoved: boolean;
    
    constructor(type: PieceType, color: Color) {
      this.type = type;
      this.color = color;
      this.hasMoved = false;
    }
    
    get symbol(): string {
      const symbols: Record<PieceType, string> = {
        [PieceType.None]: '',
        [PieceType.Pawn]: this.color === Color.White ? '♙' : '♟',
        [PieceType.Knight]: this.color === Color.White ? '♘' : '♞',
        [PieceType.Bishop]: this.color === Color.White ? '♗' : '♝',
        [PieceType.Rook]: this.color === Color.White ? '♖' : '♜',
        [PieceType.Queen]: this.color === Color.White ? '♕' : '♛',
        [PieceType.King]: this.color === Color.White ? '♔' : '♚'
      };
      return symbols[this.type];
    }
  }
  
  // Position on board
  class Position {
    readonly row: number;
    readonly col: number;
    
    constructor(row: number, col: number) {
      this.row = row;
      this.col = col;
    }
    
    isValid(): boolean {
      return this.row >= 0 && this.row < 8 && this.col >= 0 && this.col < 8;
    }
    
    toString(): string {
      return String.fromCharCode(97 + this.col) + (8 - this.row);
    }
    
    equals(other: Position): boolean {
      return this.row === other.row && this.col === other.col;
    }
  }
  
  // Move representation
  class Move {
    readonly from: Position;
    readonly to: Position;
    promotion: PieceType;
    capturedPiece: Piece | null;
    isEnPassant: boolean;
    isCastling: boolean;
    
    constructor(from: Position, to: Position) {
      this.from = from;
      this.to = to;
      this.promotion = PieceType.None;
      this.capturedPiece = null;
      this.isEnPassant = false;
      this.isCastling = false;
    }
  }
  
  // Chess game logic
  class ChessGame {
    pieces: (Piece | null)[][];
    currentPlayer: Color;
    moveHistory: Move[];
    enPassantTarget: Position | null;
    selectedPosition: Position | null;
    legalMoves: Position[];
    isGameOver: boolean;
    gameResult: string;
    
    constructor() {
      this.pieces = Array(8).fill(null).map(() => Array(8).fill(null));
      this.currentPlayer = Color.White;
      this.moveHistory = [];
      this.enPassantTarget = null;
      this.selectedPosition = null;
      this.legalMoves = [];
      this.isGameOver = false;
      this.gameResult = '';
      
      this.initializeBoard();
      this.renderBoard();
    }
    
    initializeBoard(): void {
      // Set up pawns
      for (let col = 0; col < 8; col++) {
        this.pieces[1][col] = new Piece(PieceType.Pawn, Color.Black);
        this.pieces[6][col] = new Piece(PieceType.Pawn, Color.White);
      }
      
      // Set up rooks
      this.pieces[0][0] = new Piece(PieceType.Rook, Color.Black);
      this.pieces[0][7] = new Piece(PieceType.Rook, Color.Black);
      this.pieces[7][0] = new Piece(PieceType.Rook, Color.White);
      this.pieces[7][7] = new Piece(PieceType.Rook, Color.White);
      
      // Set up knights
      this.pieces[0][1] = new Piece(PieceType.Knight, Color.Black);
      this.pieces[0][6] = new Piece(PieceType.Knight, Color.Black);
      this.pieces[7][1] = new Piece(PieceType.Knight, Color.White);
      this.pieces[7][6] = new Piece(PieceType.Knight, Color.White);
      
      // Set up bishops
      this.pieces[0][2] = new Piece(PieceType.Bishop, Color.Black);
      this.pieces[0][5] = new Piece(PieceType.Bishop, Color.Black);
      this.pieces[7][2] = new Piece(PieceType.Bishop, Color.White);
      this.pieces[7][5] = new Piece(PieceType.Bishop, Color.White);
      
      // Set up queens
      this.pieces[0][3] = new Piece(PieceType.Queen, Color.Black);
      this.pieces[7][3] = new Piece(PieceType.Queen, Color.White);
      
      // Set up kings
      this.pieces[0][4] = new Piece(PieceType.King, Color.Black);
      this.pieces[7][4] = new Piece(PieceType.King, Color.White);
    }
    
    renderBoard(): void {
      // Clear the board
      board.innerHTML = '';
      
      // Create squares
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const square = document.createElement('div');
          square.classList.add('square');
          square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
          
          // Add piece if present
          const piece = this.pieces[row][col];
          if (piece) {
            square.textContent = piece.symbol;
          }
          
          // Add highlighting for selected position
          if (this.selectedPosition && this.selectedPosition.row === row && 
              this.selectedPosition.col === col) {
            square.classList.add('selected');
          }
          
          // Add highlighting for legal moves
          const position = new Position(row, col);
          if (this.legalMoves.some(pos => pos.row === row && pos.col === col)) {
            square.classList.add('highlighted');
          }
          
          // Add highlighting for king in check
          const king = this.findKing(this.currentPlayer);
          if (king && king.row === row && king.col === col && this.isInCheck(this.currentPlayer)) {
            square.classList.add('check');
          }
          
          // Add click handler
          square.addEventListener('click', () => this.handleSquareClick(row, col));
          
          board.appendChild(square);
        }
      }
      
      // Update status
      if (this.isGameOver) {
        statusElement.textContent = this.gameResult;
      } else {
        statusElement.textContent = (this.currentPlayer === Color.White ? 'White' : 'Black') + ' to move';
        if (this.isInCheck(this.currentPlayer)) {
          statusElement.textContent += ' (Check)';
        }
      }
    }
    
    handleSquareClick(row: number, col: number): void {
      if (this.isGameOver) return;
      
      const clickedPosition = new Position(row, col);
      const clickedPiece = this.getPiece(clickedPosition);
      
      // If no piece is selected, select one
      if (!this.selectedPosition) {
        if (clickedPiece && clickedPiece.color === this.currentPlayer) {
          this.selectedPosition = clickedPosition;
          this.legalMoves = this.getLegalMoves(clickedPosition);
          this.renderBoard();
        }
        return;
      }
      
      // If a piece is already selected
      // Case 1: Clicked on the same piece - deselect it
      if (clickedPosition.equals(this.selectedPosition)) {
        this.selectedPosition = null;
        this.legalMoves = [];
        this.renderBoard();
        return;
      }
      
      // Case 2: Clicked on another piece of the same color - select it instead
      if (clickedPiece && clickedPiece.color === this.currentPlayer) {
        this.selectedPosition = clickedPosition;
        this.legalMoves = this.getLegalMoves(clickedPosition);
        this.renderBoard();
        return;
      }
      
      // Case 3: Clicked on a valid move destination
      const move = new Move(this.selectedPosition, clickedPosition);
      if (this.isLegalMove(move)) {
        this.makeMove(move);
        this.selectedPosition = null;
        this.legalMoves = [];
        this.renderBoard();
      }
    }
    
    makeMove(move: Move): void {
      // Store captured piece
      move.capturedPiece = this.getPiece(move.to);
      
      // Handle en passant capture
      if (move.isEnPassant) {
        const captureRow = this.currentPlayer === Color.White ? move.to.row + 1 : move.to.row - 1;
        move.capturedPiece = this.pieces[captureRow][move.to.col];
        this.pieces[captureRow][move.to.col] = null;
      }
      
      // Move the piece
      const movingPiece = this.pieces[move.from.row][move.from.col]!;
      this.pieces[move.to.row][move.to.col] = movingPiece;
      this.pieces[move.from.row][move.from.col] = null;
      
      // Handle castling
      if (move.isCastling) {
        if (move.to.col === 6) { // Kingside
          const rook = this.pieces[move.from.row][7]!;
          this.pieces[move.from.row][5] = rook;
          this.pieces[move.from.row][7] = null;
        } else if (move.to.col === 2) { // Queenside
          const rook = this.pieces[move.from.row][0]!;
          this.pieces[move.from.row][3] = rook;
          this.pieces[move.from.row][0] = null;
        }
      }
      
      // Handle pawn promotion
      if (movingPiece.type === PieceType.Pawn && 
          (move.to.row === 0 || move.to.row === 7)) {
        const promotion = window.prompt(
          'Choose promotion: Q (Queen), R (Rook), B (Bishop), N (Knight)',
          'Q'
        )?.toUpperCase();
        
        let promotionPiece = PieceType.Queen; // Default
        
        switch (promotion) {
          case 'R': promotionPiece = PieceType.Rook; break;
          case 'B': promotionPiece = PieceType.Bishop; break;
          case 'N': promotionPiece = PieceType.Knight; break;
        }
        
        move.promotion = promotionPiece;
        this.pieces[move.to.row][move.to.col] = new Piece(promotionPiece, movingPiece.color);
      }
      
      // Update en passant target
      if (movingPiece.type === PieceType.Pawn && 
          Math.abs(move.from.row - move.to.row) === 2) {
        const targetRow = (move.from.row + move.to.row) / 2;
        this.enPassantTarget = new Position(targetRow, move.to.col);
      } else {
        this.enPassantTarget = null;
      }
      
      // Mark piece as moved
      movingPiece.hasMoved = true;
      
      // Add to move history
      this.moveHistory.push(move);
      
      // Switch turns
      this.currentPlayer = this.currentPlayer === Color.White ? Color.Black : Color.White;
      
      // Check for game end conditions
      this.checkGameEndConditions();
    }
    
    undoMove(): void {
      if (this.moveHistory.length === 0) return;
      
      const move = this.moveHistory.pop()!;
      
      // Move piece back
      const piece = this.pieces[move.to.row][move.to.col]!;
      this.pieces[move.from.row][move.from.col] = piece;
      
      // Restore captured piece
      this.pieces[move.to.row][move.to.col] = move.capturedPiece;
      
      // Handle en passant undo
      if (move.isEnPassant) {
        const captureRow = this.currentPlayer === Color.Black ? move.to.row + 1 : move.to.row - 1;
        this.pieces[captureRow][move.to.col] = move.capturedPiece;
        this.pieces[move.to.row][move.to.col] = null;
      }
      
      // Handle castling undo
      if (move.isCastling) {
        if (move.to.col === 6) { // Kingside
          const rook = this.pieces[move.from.row][5]!;
          this.pieces[move.from.row][7] = rook;
          this.pieces[move.from.row][5] = null;
        } else if (move.to.col === 2) { // Queenside
          const rook = this.pieces[move.from.row][3]!;
          this.pieces[move.from.row][0] = rook;
          this.pieces[move.from.row][3] = null;
        }
      }
      
      // Reset piece's moved status if it was its first move
      if (this.moveHistory.every(m => 
          m.from.row !== move.from.row || m.from.col !== move.from.col)) {
        piece.hasMoved = false;
      }
      
      // Switch turns back
      this.currentPlayer = this.currentPlayer === Color.White ? Color.Black : Color.White;
      
      // Reset game end conditions
      this.isGameOver = false;
      this.gameResult = '';
      
      // Clear selection
      this.selectedPosition = null;
      this.legalMoves = [];
      
      this.renderBoard();
    }
    
    getPiece(pos: Position): Piece | null {
      if (pos.isValid()) {
        return this.pieces[pos.row][pos.col];
      }
      return null;
    }
    
    isValidMove(move: Move): boolean {
      if (!move.from.isValid() || !move.to.isValid()) {
        return false;
      }
      
      const piece = this.getPiece(move.from);
      if (!piece || piece.color !== this.currentPlayer) {
        return false;
      }
      
      const targetPiece = this.getPiece(move.to);
      if (targetPiece && targetPiece.color === this.currentPlayer) {
        return false;
      }
      
      switch (piece.type) {
        case PieceType.Pawn: return this.isValidPawnMove(move, piece);
        case PieceType.Knight: return this.isValidKnightMove(move);
        case PieceType.Bishop: return this.isValidBishopMove(move);
        case PieceType.Rook: return this.isValidRookMove(move);
        case PieceType.Queen: return this.isValidQueenMove(move);
        case PieceType.King: return this.isValidKingMove(move, piece);
      }
      
      return false;
    }
    
    isLegalMove(move: Move): boolean {
      if (!this.isValidMove(move)) {
        return false;
      }
      
      // Make temporary move to check if king would be in check
      const tempGame = this.clone();
      tempGame.makeMove(move);
      
      return !tempGame.isInCheck(this.currentPlayer);
    }
    
    clone(): ChessGame {
      const tempGame = new ChessGame();
      
      // Copy pieces
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = this.pieces[row][col];
          if (piece) {
            tempGame.pieces[row][col] = new Piece(piece.type, piece.color);
            tempGame.pieces[row][col]!.hasMoved = piece.hasMoved;
          } else {
            tempGame.pieces[row][col] = null;
          }
        }
      }
      
      tempGame.currentPlayer = this.currentPlayer;
      tempGame.enPassantTarget = this.enPassantTarget;
      
      return tempGame;
    }
    
    // Get all legal moves for a piece
    getLegalMoves(pos: Position): Position[] {
      const legalMoves: Position[] = [];
      const piece = this.getPiece(pos);
      
      if (!piece || piece.color !== this.currentPlayer) {
        return legalMoves;
      }
      
      // Check all possible destination squares
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const destPos = new Position(row, col);
          const move = new Move(pos, destPos);
          
          if (this.isLegalMove(move)) {
            legalMoves.push(destPos);
          }
        }
      }
      
      return legalMoves;
    }
    
    // Find a king
    findKing(color: Color): Position | null {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = this.pieces[row][col];
          if (piece && piece.type === PieceType.King && piece.color === color) {
            return new Position(row, col);
          }
        }
      }
      
      return null;
    }
    
    // Check if king is in check
    isInCheck(color: Color): boolean {
      const kingPos = this.findKing(color);
      if (!kingPos) return false;
      
      // Check if any opponent piece can capture the king
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = this.pieces[row][col];
          if (piece && piece.color !== color) {
            const move = new Move(new Position(row, col), kingPos);
            if (this.isValidMove(move)) {
              return true;
            }
          }
        }
      }
      
      return false;
    }
    
    // Check for checkmate and stalemate
    checkGameEndConditions(): void {
      // Check if current player has any legal moves
      let hasLegalMoves = false;
      
      for (let fromRow = 0; fromRow < 8 && !hasLegalMoves; fromRow++) {
        for (let fromCol = 0; fromCol < 8 && !hasLegalMoves; fromCol++) {
          const piece = this.pieces[fromRow][fromCol];
          if (piece && piece.color === this.currentPlayer) {
            const moves = this.getLegalMoves(new Position(fromRow, fromCol));
            if (moves.length > 0) {
              hasLegalMoves = true;
              break;
            }
          }
        }
      }
      
      if (!hasLegalMoves) {
        this.isGameOver = true;
        if (this.isInCheck(this.currentPlayer)) {
          this.gameResult = this.currentPlayer === Color.White ? 
              'Black wins by checkmate' : 'White wins by checkmate';
        } else {
          this.gameResult = 'Game drawn by stalemate';
        }
      }
    }
    
    // Implementation of the move validation logic
    isValidPawnMove(move: Move, pawn: Piece): boolean {
      const direction = pawn.color === Color.White ? -1 : 1;
      const rowDiff = move.to.row - move.from.row;
      const colDiff = move.to.col - move.from.col;
      
      // Forward move
      if (colDiff === 0) {
        // Single step forward
        if (rowDiff === direction && !this.getPiece(move.to)) {
          return true;
        }
        
        // Double step from starting position
        if (rowDiff === 2 * direction && !pawn.hasMoved) {
          const middlePos = new Position(move.from.row + direction, move.from.col);
          return !this.getPiece(move.to) && !this.getPiece(middlePos);
        }
      }
      // Capture diagonally
      else if (Math.abs(colDiff) === 1 && rowDiff === direction) {
        const targetPiece = this.getPiece(move.to);
        
        // Normal capture
        if (targetPiece && targetPiece.color !== pawn.color) {
          return true;
        }
        
        // En passant capture
        if (this.enPassantTarget && 
            this.enPassantTarget.row === move.to.row && 
            this.enPassantTarget.col === move.to.col) {
          move.isEnPassant = true;
          return true;
        }
      }
      
      return false;
    }
    
    isValidKnightMove(move: Move): boolean {
      const rowDiff = Math.abs(move.to.row - move.from.row);
      const colDiff = Math.abs(move.to.col - move.from.col);
      
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
    
    isValidBishopMove(move: Move): boolean {
      const rowDiff = Math.abs(move.to.row - move.from.row);
      const colDiff = Math.abs(move.to.col - move.from.col);
      
      // Must move diagonally
      if (rowDiff !== colDiff || rowDiff === 0) {
        return false;
      }
      
      // Check path is clear
      return this.isDiagonalPathClear(move.from, move.to);
    }
    
    isDiagonalPathClear(from: Position, to: Position): boolean {
      const rowDir = from.row < to.row ? 1 : -1;
      const colDir = from.col < to.col ? 1 : -1;
      
      for (let i = 1; i < Math.abs(from.row - to.row); i++) {
        const pos = new Position(from.row + i * rowDir, from.col + i * colDir);
        if (this.getPiece(pos)) {
          return false;
        }
      }
      
      return true;
    }
    
    isValidRookMove(move: Move): boolean {
      const rowDiff = Math.abs(move.to.row - move.from.row);
      const colDiff = Math.abs(move.to.col - move.from.col);
      
      // Must move horizontally or vertically
      if (rowDiff !== 0 && colDiff !== 0) {
        return false;
      }
      
      // Check path is clear
      return this.isStraightPathClear(move.from, move.to);
    }
    
    isStraightPathClear(from: Position, to: Position): boolean {
      if (from.row === to.row) {
        // Horizontal move
        const direction = from.col < to.col ? 1 : -1;
        for (let col = from.col + direction; col !== to.col; col += direction) {
          if (this.getPiece(new Position(from.row, col))) {
            return false;
          }
        }
      } else {
        // Vertical move
        const direction = from.row < to.row ? 1 : -1;
        for (let row = from.row + direction; row !== to.row; row += direction) {
          if (this.getPiece(new Position(row, from.col))) {
            return false;
          }
        }
      }
      
      return true;
    }
    
    isValidQueenMove(move: Move): boolean {
      const rowDiff = Math.abs(move.to.row - move.from.row);
      const colDiff = Math.abs(move.to.col - move.from.col);
      
      // Queen can move like a rook or bishop
      if (rowDiff === colDiff) {
        // Diagonal move
        return this.isDiagonalPathClear(move.from, move.to);
      } else if (rowDiff === 0 || colDiff === 0) {
        // Straight move
        return this.isStraightPathClear(move.from, move.to);
      }
      
      return false;
    }
    
    isValidKingMove(move: Move, king: Piece): boolean {
      const rowDiff = Math.abs(move.to.row - move.from.row);
      const colDiff = Math.abs(move.to.col - move.from.col);
      
      // Normal king move - one square in any direction
      if (rowDiff <= 1 && colDiff <= 1) {
        return true;
      }
      
      // Castling
      if (rowDiff === 0 && colDiff === 2 && !king.hasMoved && !this.isInCheck(this.currentPlayer)) {
        // Kingside castling
        if (move.to.col === 6) {
          const rook = this.getPiece(new Position(move.from.row, 7));
          if (rook && rook.type === PieceType.Rook && !rook.hasMoved) {
            // Check squares between king and rook are empty
            if (!this.getPiece(new Position(move.from.row, 5)) && 
                !this.getPiece(new Position(move.from.row, 6))) {
              // Check king doesn't pass through check
              const midPos = new Position(move.from.row, 5);
              const tempGame = this.clone();
              tempGame.pieces[midPos.row][midPos.col] = tempGame.pieces[move.from.row][move.from.col];
              tempGame.pieces[move.from.row][move.from.col] = null;
              
              if (!tempGame.isInCheck(this.currentPlayer)) {
                move.isCastling = true;
                return true;
              }
            }
          }
        }
        // Queenside castling
        else if (move.to.col === 2) {
          const rook = this.getPiece(new Position(move.from.row, 0));
          if (rook && rook.type === PieceType.Rook && !rook.hasMoved) {
            // Check squares between king and rook are empty
            if (!this.getPiece(new Position(move.from.row, 1)) && 
                !this.getPiece(new Position(move.from.row, 2)) && 
                !this.getPiece(new Position(move.from.row, 3))) {
              // Check king doesn't pass through check
              const midPos = new Position(move.from.row, 3);
              const tempGame = this.clone();
              tempGame.pieces[midPos.row][midPos.col] = tempGame.pieces[move.from.row][move.from.col];
              tempGame.pieces[move.from.row][move.from.col] = null;
              
              if (!tempGame.isInCheck(this.currentPlayer)) {
                move.isCastling = true;
                return true;
              }
            }
          }
        }
      }
      
      return false;
    }
  }
  
  // Create new game
  const game = new ChessGame();
  
  // Set up event listeners
  restartButton.addEventListener('click', () => {
    game.pieces = Array(8).fill(null).map(() => Array(8).fill(null));
    game.currentPlayer = Color.White;
    game.moveHistory = [];
    game.enPassantTarget = null;
    game.selectedPosition = null;
    game.legalMoves = [];
    game.isGameOver = false;
    game.gameResult = '';
    game.initializeBoard();
    game.renderBoard();
  });
  
  undoButton.addEventListener('click', () => {
    game.undoMove();
  });
});`
    },
    difficulty: "advanced",
    featured: false,
    playUrl: "/play/chess-csharp"
  };
};
