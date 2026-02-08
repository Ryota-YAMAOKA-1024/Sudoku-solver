import { memo } from 'react';
import { Cell } from './Cell';
import type { CellBoard } from '../types';

interface SudokuGridProps {
  board: CellBoard;
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
}

export const SudokuGrid = memo(function SudokuGrid({
  board,
  selectedCell,
  onCellClick,
  disabled,
}: SudokuGridProps) {
  return (
    <div className="p-1 bg-[#0a0a0f] rounded-lg border-2 border-[#00fff5]/30 glow-cyan">
      <div className="grid grid-cols-9 gap-0">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              isFixed={cell.isFixed}
              state={cell.state}
              row={rowIndex}
              col={colIndex}
              isSelected={
                selectedCell !== null &&
                selectedCell[0] === rowIndex &&
                selectedCell[1] === colIndex
              }
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  );
});
