import { useCallback, useRef } from 'react';
import type { Board, SolverStats } from '../types';
import { isValidPlacement, findEmptyCell, cloneBoard } from '../utils/validator';

interface SolveStep {
  type: 'try' | 'backtrack' | 'success' | 'fail';
  row: number;
  col: number;
  value: number | null;
}

interface UseSudokuSolverProps {
  onStep: (step: SolveStep, board: Board, stats: SolverStats) => void;
  onComplete: (solved: boolean, board: Board, stats: SolverStats) => void;
  minDuration: number; // minimum duration in seconds
  maxDuration: number; // maximum duration in seconds
}

export function useSudokuSolver({ onStep, onComplete, minDuration, maxDuration }: UseSudokuSolverProps) {
  const abortRef = useRef(false);
  const stepsRef = useRef<SolveStep[]>([]);

  const collectSteps = useCallback((board: Board): boolean => {
    const stats = { nodesExplored: 0, backtracks: 0, elapsedTime: 0 };

    const solve = (b: Board): boolean => {
      if (abortRef.current) return false;

      const empty = findEmptyCell(b);
      if (!empty) {
        return true;
      }

      const [row, col] = empty;
      stats.nodesExplored++;

      for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(b, row, col, num)) {
          b[row][col] = num;
          stepsRef.current.push({ type: 'try', row, col, value: num });

          if (solve(b)) {
            return true;
          }

          b[row][col] = null;
          stats.backtracks++;
          stepsRef.current.push({ type: 'backtrack', row, col, value: null });
        }
      }

      return false;
    };

    return solve(board);
  }, []);

  const solve = useCallback(async (initialBoard: Board) => {
    abortRef.current = false;
    stepsRef.current = [];

    const board = cloneBoard(initialBoard);
    const startTime = Date.now();
    const stats: SolverStats = { nodesExplored: 0, backtracks: 0, elapsedTime: 0 };

    // First, collect all steps synchronously
    const solved = collectSteps(board);

    if (abortRef.current) return;

    const steps = stepsRef.current;
    const totalSteps = steps.length;

    if (totalSteps === 0) {
      // Already solved or unsolvable with no moves
      const empty = findEmptyCell(initialBoard);
      if (!empty) {
        onComplete(true, initialBoard, stats);
      } else {
        onComplete(false, initialBoard, stats);
      }
      return;
    }

    // Calculate delay per step to meet duration constraints
    const minDurationMs = minDuration * 1000;
    const maxDurationMs = maxDuration * 1000;

    // Reset board for animation
    const animBoard = cloneBoard(initialBoard);

    // Animate steps
    for (let i = 0; i < steps.length; i++) {
      if (abortRef.current) return;

      const step = steps[i];

      if (step.type === 'try') {
        animBoard[step.row][step.col] = step.value;
        stats.nodesExplored++;
      } else if (step.type === 'backtrack') {
        animBoard[step.row][step.col] = null;
        stats.backtracks++;
      }

      stats.elapsedTime = (Date.now() - startTime) / 1000;

      onStep(step, cloneBoard(animBoard), { ...stats });

      const elapsed = Date.now() - startTime;
      const remainingSteps = steps.length - i - 1;

      // Skip delay if we've exceeded max duration
      if (elapsed >= maxDurationMs) {
        continue;
      }

      let adjustedDelay: number;
      if (remainingSteps > 0) {
        // Calculate max allowed delay to not exceed max duration
        const remainingForMax = maxDurationMs - elapsed;
        const maxAllowedDelay = remainingForMax / remainingSteps;

        // Calculate target delay to meet minimum duration
        const remainingForMin = minDurationMs - elapsed;
        const targetDelay = remainingForMin / remainingSteps;

        // Use target delay but never exceed max allowed (prioritize max constraint)
        adjustedDelay = Math.min(Math.max(1, targetDelay), maxAllowedDelay);
      } else {
        adjustedDelay = 0;
      }

      if (adjustedDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, adjustedDelay));
      }
    }

    // Wait for minimum duration if we finished early (but don't exceed max)
    const elapsed = Date.now() - startTime;
    if (elapsed < minDurationMs && elapsed < maxDurationMs) {
      const waitTime = Math.min(minDurationMs - elapsed, maxDurationMs - elapsed);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    stats.elapsedTime = (Date.now() - startTime) / 1000;

    // Mark all cells as success if solved
    if (solved) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (initialBoard[row][col] === null) {
            onStep({ type: 'success', row, col, value: animBoard[row][col] }, animBoard, stats);
          }
        }
      }
    }

    onComplete(solved, animBoard, stats);
  }, [collectSteps, minDuration, maxDuration, onStep, onComplete]);

  const abort = useCallback(() => {
    abortRef.current = true;
  }, []);

  return { solve, abort };
}
