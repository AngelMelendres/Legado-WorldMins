export default function ProgressCircle({ percentage }: { percentage: number }) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-circle"
        />
      </svg>
      <div className="absolute text-sm font-medium">{percentage}%</div>
    </div>
  )
}
