import { Tile } from './puzzleUtils';
import { useRef, useCallback } from 'react';
import './ImagePuzzle.css';

interface PuzzleTileProps {
  tile: Tile;
  imageSrc: string;
  cols: number;
  rows: number;
  isSelected: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  index: number;
}

export function PuzzleTile({
  tile,
  imageSrc,
  cols,
  rows,
  isSelected,
  isDragging,
  isDragOver,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  index,
}: PuzzleTileProps) {
  const tileRef = useRef<HTMLButtonElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (tile.isLocked) {
      e.preventDefault();
      return;
    }
    tileRef.current?.focus();
    onDragStart(e, index);
  }, [tile.isLocked, index, onDragStart]);

  const handleDragEnd = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';
    onDragOver(e);
  }, [onDragOver]);

  const handleDragLeave = useCallback(() => {
    onDragLeave();
  }, [onDragLeave]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, index);
  }, [index, onDrop]);

  // Calculate background position based on the tile's original position in the solved image
  const targetRow = Math.floor(tile.id / cols);
  const targetCol = tile.id % cols;

  const posX = cols > 1 ? (targetCol / (cols - 1)) * 100 : 0;
  const posY = rows > 1 ? (targetRow / (rows - 1)) * 100 : 0;

  const connections = tile.connections || { top: false, right: false, bottom: false, left: false };

  const connectionClasses = [
    connections.top ? 'connect-top' : '',
    connections.right ? 'connect-right' : '',
    connections.bottom ? 'connect-bottom' : '',
    connections.left ? 'connect-left' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={tileRef}
      className={[
        'image-puzzle__tile',
        isSelected ? 'image-puzzle__tile--selected' : '',
        tile.isLocked ? 'image-puzzle__tile--locked' : '',
        isDragging ? 'image-puzzle__tile--dragging' : '',
        isDragOver ? 'image-puzzle__tile--drag-over' : '',
        connectionClasses,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
      }}
      onClick={onClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={!tile.isLocked}
      disabled={tile.isLocked}
      aria-label={`Tile ${tile.id + 1}`}
      aria-grabbed={isDragging}
      type="button"
      tabIndex={0}
    />
  );
}