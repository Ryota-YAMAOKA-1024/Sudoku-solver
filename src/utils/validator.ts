import type { Board } from '../types';

export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) {
      return false;
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row && c !== col && board[r][c] === num) {
        return false;
      }
    }
  }

  return true;
}

export function isBoardValid(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== null) {
        // Temporarily remove the value to check if placement is valid
        board[row][col] = null;
        const valid = isValidPlacement(board, row, col, value);
        board[row][col] = value;
        if (!valid) {
          return false;
        }
      }
    }
  }
  return true;
}

export function findEmptyCell(board: Board): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        return [row, col];
      }
    }
  }
  return null;
}

export function getConflictingCells(
  board: Board,
  row: number,
  col: number,
  num: number
): [number, number][] {
  const conflicts: [number, number][] = [];

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) {
      conflicts.push([row, c]);
    }
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) {
      conflicts.push([r, col]);
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row && c !== col && board[r][c] === num) {
        conflicts.push([r, c]);
      }
    }
  }

  return conflicts;
}

export function createEmptyBoard(): Board {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}
