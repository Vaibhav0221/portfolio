import { useState, useEffect, useRef, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useStockfishWorker } from '../../hooks/useStockfishWorker';
import { Button, Icon } from '../ui';
import './ChessGame.css';

interface ChessGameProps {
  isActive: boolean;
  difficulty?: number;
  onRestart?: () => void;
  onGameEnd?: (result: { type: 'win' | 'loss' | 'draw'; message: string; subtitle: string }) => void;
}

export function ChessGame({ isActive, difficulty = 5, onRestart, onGameEnd }: ChessGameProps) {
  const [game, setGame] = useState(() => new Chess());
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [gameResult, setGameResult] = useState<{
    type: 'win' | 'loss' | 'draw';
    message: string;
    subtitle: string;
  } | null>(null);
  const { getBestMove } = useStockfishWorker();
  const aiThinkingRef = useRef(false);
  const gameRef = useRef(game);
  const turnRef = useRef(turn);
  const gameResultRef = useRef(gameResult);
  const isActiveRef = useRef(isActive);
  const difficultyRef = useRef(difficulty);

  // Keep refs in sync
  useEffect(() => { gameRef.current = game; }, [game]);
  useEffect(() => { turnRef.current = turn; }, [turn]);
  useEffect(() => { gameResultRef.current = gameResult; }, [gameResult]);
  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);

  const checkGameEnd = useCallback((g: Chess): boolean => {
    if (g.isCheckmate()) {
      const winner = g.turn() === 'w' ? 'Black' : 'White';
      const result = {
        type: winner === 'White' ? 'win' : 'loss',
        message: winner === 'White' ? 'You Won!' : `Checkmate! ${winner} wins!`,
        subtitle: winner === 'White' ? 'Great job!' : 'Better luck next time',
      } as const;
      setGameResult(result);
      onGameEnd?.(result);
      return true;
    }
    if (g.isStalemate() || g.isInsufficientMaterial() || g.isThreefoldRepetition()) {
      const result = {
        type: 'draw',
        message: 'Draw!',
        subtitle: 'Well played!',
      } as const;
      setGameResult(result);
      onGameEnd?.(result);
      return true;
    }
    return false;
  }, [onGameEnd]);

  const restartGame = useCallback(() => {
    onRestart?.();
    setGame(new Chess());
    setTurn('w');
    setGameResult(null);
    aiThinkingRef.current = false;
  }, [onRestart]);

  const handlePieceDrop = useCallback((source: string, target: string) => {
    if (!isActiveRef.current || gameResultRef.current || turnRef.current !== 'w') return false;

    const g = new Chess(gameRef.current.fen());
    const move = g.move({ from: source, to: target, promotion: 'q' });
    if (!move) return false;

    setGame(g);
    if (!checkGameEnd(g)) setTurn('b');
    return true;
  }, [checkGameEnd]);

  // AI move effect
  useEffect(() => {
    if (!isActiveRef.current || turnRef.current !== 'b' || gameResultRef.current || aiThinkingRef.current) return;
    aiThinkingRef.current = true;

    const makeAIMove = async () => {
      try {
        const moves = gameRef.current.moves({ verbose: true });
        if (!moves.length) return;

        let moveObj: typeof moves[0] | null = null;
        const aiDepth = difficultyRef.current + 1;

        // Determine weak vs strong AI probability
        let weakProbability: number;
        switch (difficultyRef.current) {
          case 0: weakProbability = 1.0; break;
          case 1: weakProbability = 0.7; break;
          case 2: weakProbability = 0.6; break;
          case 3: weakProbability = 0.5; break;
          case 4: weakProbability = 0.4; break;
          case 5: weakProbability = 0.3; break;
          case 6: weakProbability = 0.2; break;
          default: weakProbability = 0;
        }

        const useWeakMove = Math.random() < weakProbability;

        if (useWeakMove) {
          // Weak AI: random move
          moveObj = moves[Math.floor(Math.random() * moves.length)];
        } else {
          // Strong AI: Stockfish best move
          const bestMoveUCI = await getBestMove(gameRef.current.fen(), aiDepth);
          if (bestMoveUCI) {
            const g = new Chess(gameRef.current.fen());
            // Use chess.js to make the move which will return the proper Move object
            g.move(bestMoveUCI);
            const history = g.history({ verbose: true });
            moveObj = history[history.length - 1];
          } else {
            moveObj = moves[Math.floor(Math.random() * moves.length)];
          }
        }

        if (moveObj) {
          const g = new Chess(gameRef.current.fen());
          g.move(moveObj);
          setGame(g);
          if (!checkGameEnd(g)) setTurn('w');
        }
      } catch (err) {
        console.error('[AI] Error making move:', err);
      } finally {
        aiThinkingRef.current = false;
      }
    };

    const timer = setTimeout(makeAIMove, 500);
    return () => clearTimeout(timer);
  }, [game, turn, isActive, gameResult, getBestMove, difficulty, checkGameEnd]);

  return (
    <div className="chess-game" role="region" aria-label="Chess game">
      {gameResult && (
        <div
          className={`chess-game__result chess-game__result--${gameResult.type}`}
          role="status"
          aria-live="polite"
        >
          <div className="chess-game__result-message">{gameResult.message}</div>
          <div className="chess-game__result-subtitle">{gameResult.subtitle}</div>
        </div>
      )}

      <div className="chess-game__board">
        <Chessboard
          position={game.fen()}
          onPieceDrop={handlePieceDrop}
          arePiecesDraggable={isActive && turn === 'w' && !gameResult}
          boardOrientation="white"
        />
      </div>

      {(isActive && !gameResult) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={restartGame}
          leftIcon={<Icon name="rotateCcw" size={14} />}
          className="chess-game__restart"
        >
          Restart
        </Button>
      )}
    </div>
  );
}