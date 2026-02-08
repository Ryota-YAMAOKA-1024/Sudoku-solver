import { useState, useCallback, useEffect } from 'react';
import { SudokuGrid } from './components/SudokuGrid';
import { ControlPanel } from './components/ControlPanel';
import { StatusDisplay } from './components/StatusDisplay';
import { CircuitAnimation } from './components/CircuitAnimation';
import { useSudokuSolver } from './hooks/useSudokuSolver';
import { generatePuzzle } from './utils/sudokuGenerator';
import { isValidPlacement, createEmptyBoard, cloneBoard } from './utils/validator';
import type { Board, CellBoard, Mode, SolverState, SolverStats, CellState } from './types';

function App() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [fixedCells, setFixedCells] = useState<boolean[][]>(
    Array(9).fill(null).map(() => Array(9).fill(false))
  );
  const [cellStates, setCellStates] = useState<CellState[][]>(
    Array(9).fill(null).map(() => Array(9).fill('normal' as CellState))
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [mode, setMode] = useState<Mode>('idle');
  const [solverState, setSolverState] = useState<SolverState>('idle');
  const [stats, setStats] = useState<SolverStats>({
    nodesExplored: 0,
    backtracks: 0,
    elapsedTime: 0,
  });
  const [minDuration, setMinDuration] = useState(5);
  const [maxDuration, setMaxDuration] = useState(30);

  const cellBoard: CellBoard = board.map((row, rowIndex) =>
    row.map((value, colIndex) => ({
      value,
      isFixed: fixedCells[rowIndex][colIndex],
      state: cellStates[rowIndex][colIndex],
    }))
  );

  const onStep = useCallback((
    step: { type: string; row: number; col: number; value: number | null },
    newBoard: Board,
    newStats: SolverStats
  ) => {
    setBoard(newBoard);
    setStats(newStats);

    setCellStates(prev => {
      const newStates = prev.map(row => [...row]);
      // Reset previous highlights
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (newStates[r][c] === 'highlight' || newStates[r][c] === 'backtrack') {
            newStates[r][c] = 'normal';
          }
        }
      }
      // Set current cell state
      if (step.type === 'try') {
        newStates[step.row][step.col] = 'highlight';
      } else if (step.type === 'backtrack') {
        newStates[step.row][step.col] = 'backtrack';
      } else if (step.type === 'success') {
        newStates[step.row][step.col] = 'success';
      }
      return newStates;
    });
  }, []);

  const onComplete = useCallback((solved: boolean, finalBoard: Board, finalStats: SolverStats) => {
    setBoard(finalBoard);
    setStats(finalStats);
    setSolverState(solved ? 'solved' : 'unsolvable');
    setMode('idle');

    // Mark all cells as success if solved
    if (solved) {
      setCellStates(prev => {
        const newStates = prev.map((row, rowIndex) =>
          row.map((state, colIndex) =>
            !fixedCells[rowIndex][colIndex] && finalBoard[rowIndex][colIndex] !== null
              ? 'success' as CellState
              : state
          )
        );
        return newStates;
      });
    }
  }, [fixedCells]);

  const { solve, abort } = useSudokuSolver({
    onStep,
    onComplete,
    minDuration,
    maxDuration,
  });

  const handleCellClick = useCallback((row: number, col: number) => {
    if (mode !== 'manual-fill' || fixedCells[row][col]) return;
    setSelectedCell([row, col]);
  }, [mode, fixedCells]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (mode !== 'manual-fill' || !selectedCell) return;

    const [row, col] = selectedCell;

    if (e.key >= '1' && e.key <= '9') {
      const num = parseInt(e.key);
      // Check if placement is valid
      const testBoard = cloneBoard(board);
      testBoard[row][col] = null; // Clear current for validation
      if (isValidPlacement(testBoard, row, col, num)) {
        setBoard(prev => {
          const newBoard = cloneBoard(prev);
          newBoard[row][col] = num;
          return newBoard;
        });
        setCellStates(prev => {
          const newStates = prev.map(r => [...r]);
          newStates[row][col] = 'normal';
          return newStates;
        });
      } else {
        // Show error briefly
        setCellStates(prev => {
          const newStates = prev.map(r => [...r]);
          newStates[row][col] = 'error';
          return newStates;
        });
        setTimeout(() => {
          setCellStates(prev => {
            const newStates = prev.map(r => [...r]);
            newStates[row][col] = 'normal';
            return newStates;
          });
        }, 500);
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      setBoard(prev => {
        const newBoard = cloneBoard(prev);
        newBoard[row][col] = null;
        return newBoard;
      });
    } else if (e.key === 'ArrowUp' && row > 0) {
      setSelectedCell([row - 1, col]);
    } else if (e.key === 'ArrowDown' && row < 8) {
      setSelectedCell([row + 1, col]);
    } else if (e.key === 'ArrowLeft' && col > 0) {
      setSelectedCell([row, col - 1]);
    } else if (e.key === 'ArrowRight' && col < 8) {
      setSelectedCell([row, col + 1]);
    }
  }, [mode, selectedCell, board]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleModeChange = useCallback((newMode: Mode) => {
    if (newMode === 'auto-fill') {
      // Generate puzzle
      const puzzle = generatePuzzle(30);
      setBoard(puzzle);
      setFixedCells(puzzle.map(row => row.map(cell => cell !== null)));
      setCellStates(Array(9).fill(null).map(() => Array(9).fill('normal' as CellState)));
      setSolverState('idle');
      setMode('idle');
    } else {
      setMode(newMode);
    }
    setSelectedCell(null);
  }, []);

  const handleRun = useCallback(() => {
    setMode('running');
    setSolverState('running');
    setStats({ nodesExplored: 0, backtracks: 0, elapsedTime: 0 });
    setCellStates(Array(9).fill(null).map(() => Array(9).fill('normal' as CellState)));
    solve(board);
  }, [board, solve]);

  const handleClear = useCallback(() => {
    abort();
    setBoard(createEmptyBoard());
    setFixedCells(Array(9).fill(null).map(() => Array(9).fill(false)));
    setCellStates(Array(9).fill(null).map(() => Array(9).fill('normal' as CellState)));
    setSelectedCell(null);
    setMode('idle');
    setSolverState('idle');
    setStats({ nodesExplored: 0, backtracks: 0, elapsedTime: 0 });
  }, [abort]);

  // Check if there's at least one number to solve
  const canRun = board.some(row => row.some(cell => cell !== null)) && mode !== 'running';

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left Panel - Circuit Animation */}
      <div className="flex-1 relative overflow-hidden">
        <CircuitAnimation isActive={mode === 'running'} state={solverState} />

        {/* Status overlay */}
        <div className="absolute bottom-8 left-8 right-8">
          <StatusDisplay stats={stats} state={solverState} />
        </div>

        {/* Title */}
        <div className="absolute top-8 left-8">
          <h1 className="text-3xl font-bold text-[#00fff5] text-glow-cyan tracking-wider">
            SUDOKU
          </h1>
          <p className="text-[#888] text-sm mt-1">DFS SOLVER v1.0</p>
          <p className="text-[#666] text-xs mt-3">Developed by Ryota Yamaoka</p>
        </div>
      </div>

      {/* Right Panel - Sudoku Grid & Controls */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0a0f]/50">
        <div className="flex flex-col gap-8">
          <SudokuGrid
            board={cellBoard}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
            disabled={mode === 'running'}
          />

          <ControlPanel
            mode={mode}
            minDuration={minDuration}
            maxDuration={maxDuration}
            onModeChange={handleModeChange}
            onMinDurationChange={setMinDuration}
            onMaxDurationChange={setMaxDuration}
            onRun={handleRun}
            onClear={handleClear}
            canRun={canRun}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
