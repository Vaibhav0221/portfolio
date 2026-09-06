import { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Icon } from '../ui';
import { PuzzleBoard } from './PuzzleBoard';
import { PuzzleSetup } from './PuzzleSetup';
import {
  PuzzleImage,
  GridSize,
  GamePhase,
  formatTime,
  getBestScore,
  saveBestScore,
} from './puzzleUtils';
import './ImagePuzzle.css';

interface ImagePuzzleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImagePuzzle({ isOpen, onClose }: ImagePuzzleProps) {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.IMAGE_SELECTION);
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | { id: string; name: string; src: string; isUpload: boolean } | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<GridSize | null>(null);
  const [moves, setMoves] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [completionStats, setCompletionStats] = useState<{ time: number; moves: number } | null>(null);
  const [bestScore, setBestScore] = useState<{ time: number; moves: number } | null>(null);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Calculate preview image src (original image without slicing)
  const previewImageSrc = selectedImage?.src || '';

  // Handle modal open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      setTimeout(() => {
        modalRef.current?.querySelector('button')?.focus();
      }, 0);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      };
    } else {
      // Reset game state when modal closes
      resetGame();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Timer logic
  useEffect(() => {
    if (isPlaying && !gameCompleted) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      timerRef.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, gameCompleted, elapsedTime]);

  const resetGame = useCallback(() => {
    setPhase(GamePhase.IMAGE_SELECTION);
    setSelectedImage(null);
    setSelectedGrid(null);
    setMoves(0);
    setElapsedTime(0);
    setIsPlaying(false);
    setShowPreview(false);
    setGameCompleted(false);
    setCompletionStats(null);
    setBestScore(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleImageSelect = useCallback(
    (image: PuzzleImage | { id: string; name: string; src: string; isUpload: boolean } | null) => {
      setSelectedImage(image);
      if (image) {
        // Preload the image
        const img = new Image();
        img.src = image.src;
      }
    },
    []
  );

  const handleGridSelect = useCallback((grid: GridSize) => {
    setSelectedGrid(grid);
  }, []);

  const handleStepChange = useCallback((step: 'image' | 'grid') => {
    setPhase(step === 'image' ? GamePhase.IMAGE_SELECTION : GamePhase.GRID_SELECTION);
  }, []);

  const handleStartGame = useCallback(() => {
    if (selectedImage && selectedGrid) {
      setPhase(GamePhase.PLAYING);
      setIsPlaying(true);
      setMoves(0);
      setElapsedTime(0);
      setGameCompleted(false);
      setCompletionStats(null);

      // Load best score for this grid size
      const best = getBestScore(selectedGrid.rows, selectedGrid.cols);
      setBestScore(best);
    }
  }, [selectedImage, selectedGrid]);

  const handleMove = useCallback((newMoves: number) => {
    setMoves(newMoves);
  }, []);

  const handleComplete = useCallback(
    (time: number, finalMoves: number) => {
      setIsPlaying(false);
      setGameCompleted(true);
      setCompletionStats({ time, moves: finalMoves });

      if (selectedGrid) {
        saveBestScore(selectedGrid.rows, selectedGrid.cols, time, finalMoves);
        const best = getBestScore(selectedGrid.rows, selectedGrid.cols);
        setBestScore(best);
      }
    },
    [selectedGrid]
  );

  const handleRestart = useCallback(() => {
    if (selectedImage && selectedGrid) {
      setPhase(GamePhase.PLAYING);
      setIsPlaying(true);
      setMoves(0);
      setElapsedTime(0);
      setGameCompleted(false);
      setShowPreview(false);
      setCompletionStats(null);
    }
  }, [selectedImage, selectedGrid]);

  const handleNewGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handlePreview = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    if (isPlaying && !gameCompleted) {
      if (window.confirm('Leave Puzzle?\n\nYour current progress will be lost.')) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [isPlaying, gameCompleted, onClose]);

  const handleBackToSetup = useCallback(() => {
    if (phase === GamePhase.PLAYING) {
      if (window.confirm('Leave Puzzle?\n\nYour current progress will be lost.')) {
        resetGame();
      }
    } else {
      resetGame();
    }
  }, [phase, resetGame]);

  // Render content based on phase
  const renderContent = () => {
    switch (phase) {
      case GamePhase.IMAGE_SELECTION:
      case GamePhase.GRID_SELECTION:
        return (
          <PuzzleSetup
            onImageSelect={handleImageSelect}
            onGridSelect={handleGridSelect}
            onStartGame={handleStartGame}
            selectedImage={selectedImage}
            selectedGrid={selectedGrid}
            step={phase === GamePhase.IMAGE_SELECTION ? 'image' : 'grid'}
            onStepChange={handleStepChange}
            onBack={handleBackToSetup}
          />
        );

      case GamePhase.PLAYING:
        return (
          <PuzzleBoard
            imageSrc={selectedImage?.src || ''}
            rows={selectedGrid?.rows || 4}
            cols={selectedGrid?.cols || 4}
            onMove={handleMove}
            onComplete={handleComplete}
            onRestart={handleRestart}
            onNewGame={handleNewGame}
            onPreview={handlePreview}
            moves={moves}
            elapsedTime={elapsedTime}
            isPlaying={isPlaying}
            showPreview={showPreview}
            previewImageSrc={previewImageSrc}
          />
        );

      case GamePhase.COMPLETED:
        return (
          <div
            className="image-puzzle__completion image-puzzle__completion-banner"
            role="dialog"
            aria-modal="true"
            aria-labelledby="completion-title"
          >
            <div className="image-puzzle__completion-icon" aria-hidden="true">
              🎉🥳
            </div>
            <h2 id="completion-title" className="image-puzzle__completion-title">
              Hurrah! Congratulations!
            </h2>
            <p className="image-puzzle__completion-subtitle">
              You successfully solved the puzzle!
            </p>

            <div className="image-puzzle__completion-stats">
              <div className="image-puzzle__completion-stat">
                <span className="image-puzzle__completion-stat-value">
                  {formatTime(completionStats?.time || 0)}
                </span>
                <span className="image-puzzle__completion-stat-label">Time</span>
              </div>
              <div className="image-puzzle__completion-stat">
                <span className="image-puzzle__completion-stat-value">
                  {completionStats?.moves || 0}
                </span>
                <span className="image-puzzle__completion-stat-label">Moves</span>
              </div>
              <div className="image-puzzle__completion-stat">
                <span className="image-puzzle__completion-stat-value">
                  {selectedGrid?.rows}×{selectedGrid?.cols}
                </span>
                <span className="image-puzzle__completion-stat-label">Grid</span>
              </div>
            </div>

            <div className="image-puzzle__completion-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={handleRestart}
                leftIcon={<Icon name="rotateCcw" size={18} />}
                type="button"
              >
                Play Again
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleNewGame}
                leftIcon={<Icon name="image" size={18} />}
                type="button"
              >
                Change Image
              </Button>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="image-puzzle__modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-puzzle-title"
      id="image-puzzle-modal"
    >
      <div
        ref={modalRef}
        className="image-puzzle__modal"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <button
          className="image-puzzle__close-button"
          onClick={handleClose}
          aria-label="Close image puzzle"
          type="button"
        >
          <Icon name="x" size={20} aria-hidden={true} />
        </button>

        <div className="image-puzzle__header">
          <h2 id="image-puzzle-title" className="image-puzzle__title">
            🧩 Image Puzzle
          </h2>
          <p className="image-puzzle__subtitle">
            {phase === GamePhase.IMAGE_SELECTION
              ? 'Choose an image to start'
              : phase === GamePhase.GRID_SELECTION
              ? `Selected: ${selectedImage?.name} • Pick a grid size`
              : phase === GamePhase.PLAYING
              ? `Playing: ${selectedImage?.name} • ${selectedGrid?.rows}×${selectedGrid?.cols}`
              : 'Puzzle completed!'}
          </p>
        </div>

        <div className="image-puzzle__content">{renderContent()}</div>
      </div>
    </div>
  );
}