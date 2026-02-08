import { memo } from 'react';
import type { Mode } from '../types';

interface ControlPanelProps {
  mode: Mode;
  minDuration: number;
  maxDuration: number;
  onModeChange: (mode: Mode) => void;
  onMinDurationChange: (duration: number) => void;
  onMaxDurationChange: (duration: number) => void;
  onRun: () => void;
  onClear: () => void;
  canRun: boolean;
}

export const ControlPanel = memo(function ControlPanel({
  mode,
  minDuration,
  maxDuration,
  onModeChange,
  onMinDurationChange,
  onMaxDurationChange,
  onRun,
  onClear,
  canRun,
}: ControlPanelProps) {
  const isRunning = mode === 'running';

  return (
    <div className="flex flex-col gap-6">
      {/* Main Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          className={`cyber-button ${mode === 'manual-fill' ? 'glow-cyan' : ''}`}
          onClick={() => onModeChange(mode === 'manual-fill' ? 'idle' : 'manual-fill')}
          disabled={isRunning}
        >
          Manual-Fill
        </button>
        <button
          type="button"
          className={`cyber-button ${mode === 'auto-fill' ? 'glow-cyan' : ''}`}
          onClick={() => onModeChange('auto-fill')}
          disabled={isRunning}
        >
          Auto-Fill
        </button>
        <button
          type="button"
          className="cyber-button"
          style={{
            borderColor: canRun ? '#39ff14' : undefined,
            color: canRun ? '#39ff14' : undefined,
          }}
          onClick={onRun}
          disabled={!canRun || isRunning}
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>

      {/* Clear Button */}
      <div className="flex justify-center">
        <button
          type="button"
          className="cyber-button"
          style={{ borderColor: '#ff3366', color: '#ff3366' }}
          onClick={onClear}
          disabled={isRunning}
        >
          Clear
        </button>
      </div>

      {/* Number Pad for Manual Fill */}
      {mode === 'manual-fill' && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-[#e0e0e0] text-sm">Select a cell, then press a number</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                className="w-10 h-10 bg-[#1a1a2e] border border-[#00fff5]/50 text-[#00fff5] rounded hover:bg-[#252542] transition-colors"
                onClick={() => {
                  document.dispatchEvent(
                    new KeyboardEvent('keydown', { key: String(num) })
                  );
                }}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              className="w-10 h-10 bg-[#1a1a2e] border border-[#ff3366]/50 text-[#ff3366] rounded hover:bg-[#252542] transition-colors text-xs"
              onClick={() => {
                document.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'Backspace' })
                );
              }}
            >
              DEL
            </button>
          </div>
        </div>
      )}

      {/* Duration Sliders */}
      <div className="flex flex-col gap-4">
        {/* Min Duration */}
        <div className="flex flex-col gap-2">
          <label className="text-[#e0e0e0] text-sm flex justify-between">
            <span>Min Duration</span>
            <span className="text-[#00fff5]">{minDuration}s</span>
          </label>
          <input
            type="range"
            min="5"
            max="120"
            value={minDuration}
            onChange={(e) => {
              const value = Number(e.target.value);
              onMinDurationChange(Math.min(value, maxDuration));
            }}
            disabled={isRunning}
            className="w-full h-2 bg-[#1a1a2e] rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#00fff5]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-[0_0_10px_#00fff5]
            "
          />
        </div>

        {/* Max Duration */}
        <div className="flex flex-col gap-2">
          <label className="text-[#e0e0e0] text-sm flex justify-between">
            <span>Max Duration</span>
            <span className="text-[#ff00ff]">{maxDuration}s</span>
          </label>
          <input
            type="range"
            min="5"
            max="120"
            value={maxDuration}
            onChange={(e) => {
              const value = Number(e.target.value);
              onMaxDurationChange(Math.max(value, minDuration));
            }}
            disabled={isRunning}
            className="w-full h-2 bg-[#1a1a2e] rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#ff00ff]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-[0_0_10px_#ff00ff]
            "
          />
        </div>
      </div>
    </div>
  );
});
