import { useStore } from "../state/store.js";

export function Canvas(): JSX.Element {
  const agents = useStore((s) => s.agents);

  return (
    <main className="canvas">
      <svg className="canvas-grid" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1c1f24" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {agents.map((a, i) => {
          const x = 120 + (i % 3) * 220;
          const y = 120 + Math.floor(i / 3) * 200;
          return (
            <g key={a.id} transform={`translate(${x},${y})`}>
              <polygon
                points="0,-44 31,-31 44,0 31,31 0,44 -31,31 -44,0 -31,-31"
                fill={a.avatarColor}
                fillOpacity="0.18"
                stroke={a.avatarColor}
                strokeOpacity="0.6"
                strokeWidth="1.5"
              />
              <text
                y={4}
                textAnchor="middle"
                fontSize="16"
                fontWeight="600"
                fill={a.avatarColor}
                fontFamily="DM Sans, sans-serif"
              >
                {a.name[0]}
              </text>
              <text
                y={68}
                textAnchor="middle"
                fontSize="12"
                fill="#d4d9e1"
                fontFamily="DM Sans, sans-serif"
              >
                {a.name}
              </text>
              <text
                y={84}
                textAnchor="middle"
                fontSize="10"
                fill="#848a93"
                fontFamily="DM Sans, sans-serif"
              >
                {a.role}
              </text>
            </g>
          );
        })}
      </svg>
    </main>
  );
}
