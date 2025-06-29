const ProgressRing = ({ progress, size }) => {
  const radius = size * 0.5 - 10; // Assume the stroke width is 10
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="10"
      /> */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#4ade80" // Tailwind CSS 'green-400'
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};
export default ProgressRing;