import type { Board } from '../types';
import { isValidPlacement, createEmptyBoard, cloneBoard, findEmptyCell } from './validator';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function fillBoard(board: Board): boolean {
  const empty = findEmptyCell(board);
  if (!empty) {
    return true; // Board is complete
  }

  const [row, col] = empty;
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of numbers) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;
      if (fillBoard(board)) {
        return true;
      }
      board[row][col] = null;
    }
  }

  return false;
}

function countSolutions(board: Board, limit: number = 2): number {
  const empty = findEmptyCell(board);
  if (!empty) {
    return 1;
  }

  const [row, col] = empty;
  let count = 0;

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;
      count += countSolutions(board, limit);
      board[row][col] = null;
      if (count >= limit) {
        return count;
      }
    }
  }

  return count;
}

export function generatePuzzle(cluesCount: number = 30): Board {
  // Create a complete valid board
  const completeBoard = createEmptyBoard();
  fillBoard(completeBoard);

  // Create puzzle by removing numbers
  const puzzle = cloneBoard(completeBoard);
  const positions: [number, number][] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }

  const shuffledPositions = shuffleArray(positions);
  let currentClues = 81;

  for (const [row, col] of shuffledPositions) {
    if (currentClues <= cluesCount) {
      break;
    }

    const backup = puzzle[row][col];
    puzzle[row][col] = null;

    // Check if puzzle still has unique solution
    const testBoard = cloneBoard(puzzle);
    if (countSolutions(testBoard, 2) !== 1) {
      // Restore the cell if removing it creates multiple solutions
      puzzle[row][col] = backup;
    } else {
      currentClues--;
    }
  }

  return puzzle;
}

export function generateCompletedBoard(): Board {
  const board = createEmptyBoard();
  fillBoard(board);
  return board;
}
