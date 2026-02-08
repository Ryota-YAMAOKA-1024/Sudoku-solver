import { memo, useMemo } from 'react';
import type { SolverState } from '../types';

interface CircuitAnimationProps {
  isActive: boolean;
  state: SolverState;
}

interface CircuitPath {
  id: number;
  d: string;
  delay: number;
}

interface CircuitNode {
  id: number;
  cx: number;
  cy: number;
  delay: number;
}

export const CircuitAnimation = memo(function CircuitAnimation({
  isActive,
  state,
}: CircuitAnimationProps) {
  const paths = useMemo<CircuitPath[]>(() => {
    const generatedPaths: CircuitPath[] = [];
    const width = 400;
    const height = 600;

    // Generate horizontal lines
    for (let i = 0; i < 15; i++) {
      const y = 40 + i * 40;
      const startX = Math.random() * 50;
      const endX = width - Math.random() * 50;
      const midX1 = startX + (endX - startX) * 0.3;
      const midX2 = startX + (endX - startX) * 0.7;
      const offsetY = (Math.random() - 0.5) * 30;

      generatedPaths.push({
        id: i,
        d: `M ${startX} ${y} L ${midX1} ${y} L ${midX1} ${y + offsetY} L ${midX2} ${y + offsetY} L ${midX2} ${y} L ${endX} ${y}`,
        delay: Math.random() * 2,
      });
    }

    // Generate vertical connections
    for (let i = 0; i < 10; i++) {
      const x = 30 + i * 40;
      const startY = Math.random() * 100;
      const endY = height - Math.random() * 100;

      generatedPaths.push({
        id: 100 + i,
        d: `M ${x} ${startY} L ${x} ${endY}`,
        delay: Math.random() * 2,
      });
    }

    // Generate diagonal connections
    for (let i = 0; i < 8; i++) {
      const startX = Math.random() * width * 0.3;
      const startY = Math.random() * height;
      const endX = width * 0.7 + Math.random() * width * 0.3;
      const endY = Math.random() * height;

      generatedPaths.push({
        id: 200 + i,
        d: `M ${startX} ${startY} L ${endX} ${endY}`,
        delay: Math.random() * 2,
      });
    }

    return generatedPaths;
  }, []);

  const nodes = useMemo<CircuitNode[]>(() => {
    const generatedNodes: CircuitNode[] = [];
    for (let i = 0; i < 30; i++) {
      generatedNodes.push({
        id: i,
        cx: 20 + Math.random() * 360,
        cy: 20 + Math.random() * 560,
        delay: Math.random() * 2,
      });
    }
    return generatedNodes;
  }, []);

  const getColor = () => {
    switch (state) {
      case 'running':
        return '#00fff5';
      case 'solved':
        return '#00ff88';
      case 'unsolvable':
        return '#ff3366';
      default:
        return '#3a3a5c';
    }
  };

  const color = getColor();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${color}22 1px, transparent 1px),
            linear-gradient(90deg, ${color}22 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Circuit SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Paths */}
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity={isActive ? 0.8 : 0.2}
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: isActive ? 0 : 1000,
              animation: isActive
                ? `circuit-flow ${3 + path.delay}s linear infinite`
                : 'none',
              animationDelay: `${path.delay}s`,
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill={color}
              opacity={isActive ? 1 : 0.3}
              style={{
                animation: isActive
                  ? `circuit-pulse ${1 + node.delay * 0.5}s ease-in-out infinite`
                  : 'none',
                animationDelay: `${node.delay}s`,
              }}
            />
            {isActive && (
              <circle
                cx={node.cx}
                cy={node.cy}
                r="8"
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity="0.5"
                style={{
                  animation: `circuit-pulse ${1.5 + node.delay * 0.5}s ease-in-out infinite`,
                  animationDelay: `${node.delay}s`,
                }}
              />
            )}
          </g>
        ))}
      </svg>

      {/* Glow overlay */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${color}11 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Scanline effect */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${color}11 2px,
              ${color}11 4px
            )`,
            animation: 'scanline 8s linear infinite',
          }}
        />
      )}
    </div>
  );
});
