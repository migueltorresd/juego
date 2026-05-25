export const ProgressBar = ({ 
  value, 
  max = 100, 
  color = 'indigo', // 'indigo' | 'emerald' | 'cyan' | 'pink'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorStyles = {
    indigo: 'bg-indigo-500 shadow-[0_0_10px_#6366f1]',
    emerald: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
    cyan: 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]',
    pink: 'bg-pink-500 shadow-[0_0_10px_#ec4899]',
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full bg-slate-950 rounded-full overflow-hidden shadow-inner border border-slate-800 ${sizeStyles[size]} ${className}`}>
      <div 
        className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
