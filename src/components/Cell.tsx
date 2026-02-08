import { memo } from 'react';
import type { CellState, CellValue } from '../types';

interface CellProps {
  value: CellValue;
  isFixed: boolean;
  state: CellState;
  row: number;
  col: number;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Cell = memo(function Cell({
  value,
  isFixed,
  state,
  row,
  col,
  isSelected,
  onClick,
  disabled,
}: CellProps) {
  const isRightBorder = col === 2 || col === 5;
  const isBottomBorder = row === 2 || row === 5;

  const getStateClass = () => {
    switch (state) {
      case 'highlight':
        return 'cell-highlight';
      case 'backtrack':
        return 'cell-backtrack';
      case 'success':
        return 'cell-success';
      case 'error':
        return 'bg-[#ff3366]/30';
      default:
        return '';
    }
  };

  const getTextColor = () => {
    if (isFixed) {
      return 'text-[#00fff5]';
    }
    if (state === 'success') {
      return 'text-[#00ff88]';
    }
    return 'text-[#e0e0e0]';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isFixed}
      className={`
        w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
        flex items-center justify-center
        text-xl sm:text-2xl font-bold
        bg-[#1a1a2e] hover:bg-[#252542]
        border border-[#3a3a5c]
        transition-colors duration-150
        ${isRightBorder ? 'border-r-2 border-r-[#00fff5]/50' : ''}
        ${isBottomBorder ? 'border-b-2 border-b-[#00fff5]/50' : ''}
        ${isSelected ? 'ring-2 ring-[#00fff5] ring-inset' : ''}
        ${isFixed ? 'cursor-default' : 'cursor-pointer'}
        ${disabled ? 'cursor-not-allowed' : ''}
        ${getStateClass()}
        ${getTextColor()}
        ${isFixed ? 'text-glow-cyan' : ''}
      `}
    >
      {value !== null ? value : ''}
    </button>
  );
});
