import { memo } from 'react';
import type { SolverStats, SolverState } from '../types';

interface StatusDisplayProps {
  stats: SolverStats;
  state: SolverState;
}

export const StatusDisplay = memo(function StatusDisplay({
  stats,
  state,
}: StatusDisplayProps) {
  const getStateLabel = () => {
    switch (state) {
      case 'running':
        return { text: 'ANALYZING...', color: '#00fff5' };
      case 'solved':
        return { text: 'SOLVED', color: '#00ff88' };
      case 'unsolvable':
        return { text: 'NO SOLUTION', color: '#ff3366' };
      default:
        return { text: 'STANDBY', color: '#e0e0e0' };
    }
  };

  const stateInfo = getStateLabel();

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#0a0a0f]/80 rounded-lg border border-[#3a3a5c]">
      {/* State */}
      <div className="text-center">
        <span
          className="text-2xl font-bold tracking-widest"
          style={{ color: stateInfo.color, textShadow: `0 0 10px ${stateInfo.color}` }}
        >
          {stateInfo.text}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-[#888]">Nodes Explored</span>
          <span className="text-[#00fff5] font-mono text-glow-cyan">
            {stats.nodesExplored.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#888]">Backtracks</span>
          <span className="text-[#ff00ff] font-mono" style={{ textShadow: '0 0 10px #ff00ff' }}>
            {stats.backtracks.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#888]">Elapsed Time</span>
          <span className="text-[#39ff14] font-mono text-glow-green">
            {stats.elapsedTime.toFixed(2)}s
          </span>
        </div>
      </div>
    </div>
  );
});
