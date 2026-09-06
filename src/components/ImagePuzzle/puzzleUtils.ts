/**
 * Image Puzzle Engine - Pure utility functions for sliding puzzle logic
 * Guarantees solvable puzzles by generating from solved state with valid moves
 */

export interface ConnectedBorders {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface PuzzleImage {
  id: string;
  name: string;
  src: string;
}

export interface Tile {
  id: number;           // Original correct index (0 to total-1)
  currentIndex: number; // Current board index
  isLocked?: boolean;   // Lock if completely in correct spot
  connections?: ConnectedBorders;
}

export interface PuzzleState {
  board: Tile[];
  emptyIndex: number;
  rows: number;
  cols: number;
  moves: number;
  startTime: number;
  elapsedTime: number;
  isCompleted: boolean;
  isPlaying: boolean;
}

export interface BestScore {
  time: number;
  moves: number;
}

export interface GridSize {
  rows: number;
  cols: number;
  label: string;
  difficulty: string;
}

// Predefined grid sizes (4x4 through 10x10)
export const GRID_SIZES: GridSize[] = [
  { rows: 4, cols: 4, label: '4×4', difficulty: 'Easy' },
  { rows: 5, cols: 5, label: '5×5', difficulty: 'Moderate' },
  { rows: 6, cols: 6, label: '6×6', difficulty: 'Challenging' },
  { rows: 7, cols: 7, label: '7×7', difficulty: 'Hard' },
  { rows: 8, cols: 8, label: '8×8', difficulty: 'Very Hard' },
  { rows: 9, cols: 9, label: '9×9', difficulty: 'Expert' },
  { rows: 10, cols: 10, label: '10×10', difficulty: 'Extreme' },
];

// Predefined puzzle images from project assets
export const PUZZLE_IMAGES: PuzzleImage[] = [
  { id: 'hsa', name: 'HSA Project', src: '/project_images/HSA.png' },
  { id: 'quizgen', name: 'Quizgen', src: '/project_images/Quizgen.png' },
  { id: 'bdm', name: 'BDM', src: '/project_images/BDM.png' },
  { id: 'engage2value', name: 'Engage2Value', src: '/project_images/Engage2Value.png' },
  { id: 'gradebook', name: 'Gradebook', src: '/project_images/Gradebook.png' },
  { id: 'har', name: 'HAR', src: '/project_images/HAR.png' },
  { id: 'circuit', name: 'Circuit Diagram', src: '/project_images/Circuit_Diagram.png' },
  { id: 'bearing', name: 'Bearing', src: '/project_images/Bearing.png' },
  { id: 'llm', name: 'LLM Backend', src: '/project_images/LLM_Backend.png' },
  { id: 'civichron', name: 'CiviChron', src: '/project_images/CiviChron.png' },
];

const STORAGE_KEY = 'portfolio.imagePuzzle.bestScores';

/**
 * Creates a solved board configuration
 */
export function createSolvedBoard(rows: number, cols: number): Tile[] {
  const board: Tile[] = [];
  const totalTiles = rows * cols;

  for (let i = 0; i < totalTiles; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const isEmpty = i === totalTiles - 1;

    board.push({
      id: i + 1,
      row,
      col,
      isEmpty,
      backgroundPosition: isEmpty
        ? undefined
        : `${(-col * 100) / (cols - 1)}% ${(-row * 100) / (rows - 1)}%`,
    });
  }

  return board;
}

/**
 * Gets valid neighbor indices for the empty tile
 */
export function getValidMoves(emptyIndex: number, rows: number, cols: number): number[] {
  const emptyRow = Math.floor(emptyIndex / cols);
  const emptyCol = emptyIndex % cols;
  const validMoves: number[] = [];

  // Up
  if (emptyRow > 0) {
    validMoves.push((emptyRow - 1) * cols + emptyCol);
  }
  // Down
  if (emptyRow < rows - 1) {
    validMoves.push((emptyRow + 1) * cols + emptyCol);
  }
  // Left
  if (emptyCol > 0) {
    validMoves.push(emptyRow * cols + (emptyCol - 1));
  }
  // Right
  if (emptyCol < cols - 1) {
    validMoves.push(emptyRow * cols + (emptyCol + 1));
  }

  return validMoves;
}

/**
 * Generates a solvable scrambled board by making valid random moves from solved state
 * Avoids immediate backtracking for better scrambling
 */
export function generateScrambledBoard(rows: number, cols: number): Tile[] {
  const totalTiles = rows * cols;
  const tiles: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
    id: i,
    currentIndex: i,
  }));

  // Shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  return calculateConnections(tiles, rows, cols);
}

/**
 * Attempts to move a tile at the given index
 * Returns new board state if move is valid, null otherwise
 */
export function moveTile(
  board: Tile[],
  emptyIndex: number,
  tileIndex: number,
  rows: number,
  cols: number
): { board: Tile[]; emptyIndex: number } | null {
  const validMoves = getValidMoves(emptyIndex, rows, cols);

  if (!validMoves.includes(tileIndex)) {
    return null;
  }

  const newBoard = [...board];
  [newBoard[emptyIndex], newBoard[tileIndex]] = [newBoard[tileIndex], newBoard[emptyIndex]];

  return { board: newBoard, emptyIndex: tileIndex };
}

/**
 * Checks if the current board is in solved state
 */
export function isSolved(board: Tile[]): boolean {
  return board.every((tile, index) => tile.id === index + 1);
}

/**
 * Formats time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Gets best score for a specific grid size from localStorage
 */
export function getBestScore(rows: number, cols: number): BestScore | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const scores: Record<string, BestScore> = JSON.parse(stored);
    const key = `${rows}x${cols}`;
    return scores[key] || null;
  } catch {
    return null;
  }
}

/**
 * Saves best score for a specific grid size to localStorage
 */
export function saveBestScore(rows: number, cols: number, time: number, moves: number): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const scores: Record<string, BestScore> = stored ? JSON.parse(stored) : {};
    const key = `${rows}x${cols}`;
    const existing = scores[key];

    if (!existing || time < existing.time || (time === existing.time && moves < existing.moves)) {
      scores[key] = { time, moves };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    }
  } catch {
    // Ignore localStorage errors
  }
}


export function calculateConnections(board: Tile[], rows: number, cols: number): Tile[] {
  return board.map((tile, idx) => {
    const row = Math.floor(idx / cols);
    const col = idx % cols;

    const topIdx = row > 0 ? (row - 1) * cols + col : -1;
    const rightIdx = col < cols - 1 ? row * cols + (col + 1) : -1;
    const bottomIdx = row < rows - 1 ? (row + 1) * cols + col : -1;
    const leftIdx = col > 0 ? row * cols + (col - 1) : -1;

    // A connection exists if the neighbor's original ID matches the relative offset
    const connections: ConnectedBorders = {
      top: topIdx !== -1 && board[topIdx].id === tile.id - cols,
      right: rightIdx !== -1 && board[rightIdx].id === tile.id + 1,
      bottom: bottomIdx !== -1 && board[bottomIdx].id === tile.id + cols,
      left: leftIdx !== -1 && board[leftIdx].id === tile.id - 1,
    };

    return {
      ...tile,
      currentIndex: idx,
      isLocked: tile.id === idx,
      connections,
    };
  });
}

/**
 * Calculates background position for a tile based on grid size
 */
export function calculateBackgroundPosition(row: number, col: number, rows: number, cols: number): string {
  if (rows === 1 && cols === 1) return '0% 0%';

  const x = cols > 1 ? (-col * 100) / (cols - 1) : 0;
  const y = rows > 1 ? (-row * 100) / (rows - 1) : 0;

  return `${x}% ${y}%`;
}

/**
 * Creates tile objects with correct background positions for a given image
 */
export function createTilesWithImage(
  rows: number,
  cols: number,
  imageSrc: string
): Tile[] {
  const totalTiles = rows * cols;
  const tiles: Tile[] = [];

  for (let i = 0; i < totalTiles; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const isEmpty = i === totalTiles - 1;

    tiles.push({
      id: i + 1,
      row,
      col,
      isEmpty,
      backgroundPosition: isEmpty
        ? undefined
        : calculateBackgroundPosition(row, col, rows, cols),
    });
  }

  return tiles;
}

/**
 * Validates if a file is a supported image type
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Creates an object URL for an image file
 */
export function createImageObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes an object URL to prevent memory leaks
 */
export function revokeImageObjectUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Game state enum for puzzle flow
 */
export enum GamePhase {
  IMAGE_SELECTION = 'image-selection',
  GRID_SELECTION = 'grid-selection',
  PLAYING = 'playing',
  COMPLETED = 'completed',
}