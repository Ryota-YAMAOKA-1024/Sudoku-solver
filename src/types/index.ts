export type CellValue = number | null;

export type Board = CellValue[][];

export type CellState = 'normal' | 'fixed' | 'highlight' | 'backtrack' | 'success' | 'error';

export interface Cell {
  value: CellValue;
  isFixed: boolean;
  state: CellState;
}

export type CellBoard = Cell[][];

export type SolverState = 'idle' | 'running' | 'solved' | 'unsolvable';

export interface SolverStats {
  nodesExplored: number;
  backtracks: number;
  elapsedTime: number;
}

export type Mode = 'idle' | 'manual-fill' | 'auto-fill' | 'running';
