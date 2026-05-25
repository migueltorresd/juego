export const Badge = ({ 
  children, 
  variant = 'cyan', // 'cyan' | 'gold' | 'pink' | 'purple' | 'slate'
  className = '',
  icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider select-none';

  const variants = {
    cyan: 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]',
    gold: 'bg-yellow-950/60 text-yellow-400 border border-yellow-500/40 shadow-[0_0_8px_rgba(234,179,8,0.2)]',
    pink: 'bg-pink-950/60 text-pink-400 border border-pink-500/40 shadow-[0_0_8px_rgba(236,72,153,0.2)]',
    purple: 'bg-purple-950/60 text-purple-400 border border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.2)]',
    slate: 'bg-slate-900/60 text-slate-400 border border-slate-700/50 shadow-inner'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {icon && <span className="text-sm shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
