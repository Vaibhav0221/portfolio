import { useState, useCallback, useEffect, useRef } from 'react';
import { ChessGame } from './ChessGame';
import { Button, Icon } from '../ui';
import './ChessChatbot.css';

interface DifficultyLevel {
  value: number;
  label: string;
  description: string;
}

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { value: 0, label: 'Beginner', description: 'Random moves only' },
  { value: 1, label: 'Novice', description: 'Mostly random moves' },
  { value: 2, label: 'Intermediate', description: 'Slightly strategic' },
  { value: 3, label: 'Amateur', description: 'Balanced play' },
  { value: 4, label: 'Club Player', description: 'Good tactics' },
  { value: 5, label: 'Medium', description: 'Solid club level' },
  { value: 6, label: 'Strong', description: 'Advanced tactics' },
  { value: 7, label: 'Expert', description: 'Deep calculation' },
  { value: 8, label: 'Master', description: 'Master level play' },
  { value: 9, label: 'Grandmaster', description: 'Grandmaster strength' },
  { value: 10, label: 'Stockfish', description: 'Engine strength' },
];

export function ChessChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(5);
  const [resetKey, setResetKey] = useState(0);
  const [gameResult, setGameResult] = useState<{ type: 'win' | 'loss' | 'draw'; message: string; subtitle: string } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const floatingButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getDifficultyName = useCallback((level: number): string => {
    const found = DIFFICULTY_LEVELS.find(d => d.value === level);
    return found?.label || 'Medium';
  }, []);

  const getDifficultyDescription = useCallback((level: number): string => {
    const found = DIFFICULTY_LEVELS.find(d => d.value === level);
    return found?.description || 'Solid club level';
  }, []);

  // Handle keyboard navigation for modal
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Trap focus within modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          toggleModal();
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
      // Focus the close button or first interactive element
      setTimeout(() => {
        modalRef.current?.querySelector('button')?.focus();
      }, 0);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen]);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      if (!next) {
        resetGame();
      } else {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }
      return next;
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setDifficulty(5);
    setGameResult(null);
    setResetKey(prev => prev + 1);
  }, []);

  const handleGameEnd = useCallback((result: { type: 'win' | 'loss' | 'draw'; message: string; subtitle: string }) => {
    setGameResult(result);
  }, []);

  const handleStartGame = useCallback(() => {
    setGameStarted(true);
    setGameResult(null);
  }, []);

  const handleRestart = useCallback(() => {
    setGameStarted(false);
    setGameResult(null);
    setResetKey(prev => prev + 1);
  }, []);

  return (
    <>
      {/* Floating chess button */}
      <button
        ref={floatingButtonRef}
        className="chess-chatbot__floating-button"
        onClick={toggleModal}
        aria-label={isOpen ? 'Close chess game' : 'Open chess game'}
        aria-expanded={isOpen}
        aria-controls="chess-chatbot-modal"
        title="Play Chess"
        type="button"
      >
        <span className="chess-chatbot__floating-icon" aria-hidden={true}>♟️</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="chess-chatbot__modal-overlay"
          onClick={toggleModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chess-chatbot-title"
          id="chess-chatbot-modal"
        >
          <div
            ref={modalRef}
            className={`chess-chatbot__modal ${isAnimating ? 'chess-chatbot__modal--animating' : ''}`}
            onClick={e => e.stopPropagation()}
            role="document"
          >
            <button
              className="chess-chatbot__close-button"
              onClick={toggleModal}
              aria-label="Close chess game"
              type="button"
            >
              <Icon name="x" size={20} aria-hidden={true} />
            </button>

            <div className="chess-chatbot__header">
              <h2 id="chess-chatbot-title" className="chess-chatbot__title">
                {gameStarted ? 'Play Your Move' : 'Welcome to ChessMate'}
              </h2>
              <p className="chess-chatbot__subtitle">
                {gameStarted ? `Playing as White • Difficulty: ${getDifficultyName(difficulty)}` : 'Challenge the AI at your chosen difficulty'}
              </p>
            </div>

            {/* Chessboard */}
            <div className="chess-chatbot__board-container">
              <ChessGame
                key={resetKey}
                isActive={gameStarted}
                difficulty={difficulty}
                onRestart={handleRestart}
                onGameEnd={handleGameEnd}
              />
            </div>

            {!gameStarted && (
              <div className="chess-chatbot__difficulty-selector" role="group" aria-label="Select difficulty level">
                <div className="chess-chatbot__difficulty-display">
                  <span className="chess-chatbot__difficulty-value">{difficulty}</span>
                  <span className="chess-chatbot__difficulty-name">{getDifficultyName(difficulty)}</span>
                  <p className="chess-chatbot__difficulty-description">{getDifficultyDescription(difficulty)}</p>
                </div>
                <div className="chess-chatbot__slider-wrapper">
                  <span className="chess-chatbot__slider-label">Easy</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value, 10))}
                    className="chess-chatbot__slider"
                    aria-label="Difficulty level"
                    aria-valuemin={0}
                    aria-valuemax={10}
                    aria-valuenow={difficulty}
                    aria-valuetext={getDifficultyName(difficulty)}
                  />
                  <span className="chess-chatbot__slider-label">Hard</span>
                </div>
              </div>
            )}

            {gameStarted && gameResult && (
              <div className="chess-chatbot__game-over">
                <div className={`chess-chatbot__game-over-badge chess-chatbot__game-over-badge--${gameResult.type}`}>
                  {gameResult.message}
                </div>
                <p className="chess-chatbot__game-over-subtitle">{gameResult.subtitle}</p>
              </div>
            )}

            <div className="chess-chatbot__actions">
              {!gameStarted && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartGame}
                  leftIcon={<Icon name="play" size={18} />}
                  className="chess-chatbot__start-button"
                  type="button"
                >
                  Start Game
                </Button>
              )}

              {gameStarted && (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleRestart}
                  leftIcon={<Icon name="rotateCcw" size={16} />}
                  className="chess-chatbot__restart-button"
                  type="button"
                >
                  New Game
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}