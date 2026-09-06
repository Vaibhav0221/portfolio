import { useState, useEffect, useCallback } from 'react';
import { PuzzleTile } from './PuzzleTile';
import {
  Tile,
  isSolved,
  formatTime,
  GRID_SIZES,
  generateScrambledBoard,
  calculateConnections,
} from './puzzleUtils';
import './ImagePuzzle.css';

interface PuzzleBoardProps {
  imageSrc: string;
  rows: number;
  cols: number;
  onMove: (moves: number) => void;
  onComplete: (time: number, moves: number) => void;
  onRestart: () => void;
  onNewGame: () => void;
  onPreview: () => void;
  moves: number;
  elapsedTime: number;
  isPlaying: boolean;
  showPreview: boolean;
  previewImageSrc: string;
}

export function PuzzleBoard({
  imageSrc,
  rows,
  cols,
  onMove,
  onComplete,
  onRestart,
  onNewGame,
  onPreview,
  moves,
  elapsedTime,
  isPlaying,
  showPreview,
  previewImageSrc,
}: PuzzleBoardProps) {
  const [board, setBoard] = useState<Tile[]>(() => generateScrambledBoard(rows, cols));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setBoard(generateScrambledBoard(rows, cols));
    setSelectedIndex(null);
    setDraggingIndex(null);
    setDragOverIndex(null);
  }, [rows, cols]);

  const handleTileClick = useCallback(
    (clickedIndex: number) => {
      if (!isPlaying || showPreview || board[clickedIndex].isLocked) return;

      if (selectedIndex === null) {
        setSelectedIndex(clickedIndex);
        return;
      }

      if (selectedIndex === clickedIndex) {
        setSelectedIndex(null);
        return;
      }

      // Swap tiles
      const newBoard = [...board];
      [newBoard[selectedIndex], newBoard[clickedIndex]] = [
        newBoard[clickedIndex],
        newBoard[selectedIndex],
      ];

      // Recalculate border joining connections across the board
      const updatedBoard = calculateConnections(newBoard, rows, cols);

      setBoard(updatedBoard);
      setSelectedIndex(null);

      const nextMoves = moves + 1;
      onMove(nextMoves);

      if (isSolved(updatedBoard)) {
        onComplete(elapsedTime, nextMoves);
      }
    },
    [board, selectedIndex, isPlaying, showPreview, rows, cols, moves, elapsedTime, onMove, onComplete]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      if (!isPlaying || showPreview) return;
      setDraggingIndex(index);
      setSelectedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      // Set drag image to empty for custom styling
      const dragImg = document.createElement('div');
      dragImg.style.width = '1px';
      dragImg.style.height = '1px';
      e.dataTransfer.setDragImage(dragImg, 0, 0);
    },
    [isPlaying, showPreview]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      // Handled in tile component
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      if (!isPlaying || showPreview) return;

      const fromIndex = draggingIndex;
      if (fromIndex === null || fromIndex === dropIndex) {
        setDraggingIndex(null);
        setDragOverIndex(null);
        setSelectedIndex(null);
        return;
      }

      // Don't drop on locked tiles
      if (board[dropIndex].isLocked) {
        setDraggingIndex(null);
        setDragOverIndex(null);
        setSelectedIndex(null);
        return;
      }

      // Swap tiles
      const newBoard = [...board];
      [newBoard[fromIndex], newBoard[dropIndex]] = [
        newBoard[dropIndex],
        newBoard[fromIndex],
      ];

      // Recalculate border joining connections across the board
      const updatedBoard = calculateConnections(newBoard, rows, cols);

      setBoard(updatedBoard);
      setDraggingIndex(null);
      setDragOverIndex(null);
      setSelectedIndex(null);

      const nextMoves = moves + 1;
      onMove(nextMoves);

      if (isSolved(updatedBoard)) {
        onComplete(elapsedTime, nextMoves);
      }
    },
    [draggingIndex, board, isPlaying, showPreview, rows, cols, moves, elapsedTime, onMove, onComplete]
  );

  const gridSize = GRID_SIZES.find((g) => g.rows === rows && g.cols === cols);

  return (
    <div className="image-puzzle__board-container">
      {/* Preview overlay */}
      {showPreview && (
        <div className="image-puzzle__preview-overlay" onClick={onPreview}>
          <div className="image-puzzle__preview-content" onClick={(e) => e.stopPropagation()}>
            <img src={previewImageSrc} alt="Preview" className="image-puzzle__preview-image" />
            <button className="image-puzzle__preview-close" onClick={onPreview} type="button">✕</button>
          </div>
        </div>
      )}

      {/* Puzzle board */}
      <div
        className="image-puzzle__board"
        style={{
          '--puzzle-aspect-ratio': `${cols} / ${rows}`,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        } as React.CSSProperties}
      >
        {board.map((tile, index) => (
          <PuzzleTile
            key={tile.id}
            tile={tile}
            imageSrc={imageSrc}
            cols={cols}
            rows={rows}
            isSelected={selectedIndex === index}
            isDragging={draggingIndex === index}
            isDragOver={dragOverIndex === index}
            onClick={() => handleTileClick(index)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            index={index}
          />
        ))}
      </div>

      {/* Stats and controls */}
      <div className="image-puzzle__hud">
        <div className="image-puzzle__stats">
          <div className="image-puzzle__stat">
            <span className="image-puzzle__stat-label">Moves</span>
            <span className="image-puzzle__stat-value">{moves}</span>
          </div>
          <div className="image-puzzle__stat">
            <span className="image-puzzle__stat-label">Time</span>
            <span className="image-puzzle__stat-value">{formatTime(elapsedTime)}</span>
          </div>
          {gridSize && (
            <div className="image-puzzle__stat">
              <span className="image-puzzle__stat-label">Grid</span>
              <span className="image-puzzle__stat-value">{gridSize.label}</span>
            </div>
          )}
        </div>

        <div className="image-puzzle__controls">
          <button className="image-puzzle__control-btn" onClick={onPreview} type="button">👁 Preview</button>
          <button className="image-puzzle__control-btn image-puzzle__control-btn--primary" onClick={onRestart} type="button">↻ Restart</button>
          <button className="image-puzzle__control-btn" onClick={onNewGame} type="button">New Game</button>
        </div>
      </div>
    </div>
  );
}