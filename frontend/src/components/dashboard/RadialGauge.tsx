import React from 'react';

interface RadialGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  glowColor?: string;
  title: string;
  subtitle?: string;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  color,
  glowColor,
  title,
  subtitle,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center p-4 bg-[#181818] rounded-2xl border border-white/5 shadow-xl hover:border-white/20 transition-all duration-300 group">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#242424"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Value Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: glowColor ? `drop-shadow(0 0 8px ${glowColor})` : undefined,
            }}
          />
        </svg>

        {/* Center Display Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold font-heading text-white tracking-tight group-hover:scale-110 transition-transform">
            {score}
          </span>
          <span className="text-[10px] font-mono text-spotify-muted uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      <div className="mt-3 space-y-0.5">
        <h4 className="text-xs font-bold text-white group-hover:text-[#1DB954] transition-colors">{title}</h4>
        {subtitle && <p className="text-[10px] text-spotify-muted font-mono max-w-[160px] truncate">{subtitle}</p>}
      </div>
    </div>
  );
};
