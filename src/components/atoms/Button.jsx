import { sound } from '../../services/sound';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'neon', // 'neon' | 'secondary' | 'ghost' | 'icon' | 'danger' | 'success'
  className = '', 
  disabled = false,
  ...props 
}) => {
  const handleClick = (e) => {
    sound.playClick();
    if (onClick) onClick(e);
  };

  const baseStyles = 'font-bold transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 rounded-xl cursor-pointer select-none';
  
  const variants = {
    neon: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 px-5 text-base border-2 border-indigo-500/50 shadow-[0_0_12px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 py-2.5 px-5 text-sm hover:scale-[1.02] active:scale-[0.98]',
    danger: 'bg-slate-900/80 text-red-400 hover:text-red-300 border border-red-500/50 hover:bg-red-950/20 py-2 px-4 text-sm active:scale-[0.98]',
    success: 'bg-slate-900/80 text-green-400 hover:text-green-300 border border-green-500/50 hover:bg-green-950/20 py-2 px-4 text-sm active:scale-[0.98]',
    ghost: 'bg-indigo-950/40 border border-indigo-700/30 text-indigo-300 px-4 py-2 hover:bg-indigo-900/50 text-sm active:scale-[0.98]',
    icon: 'bg-indigo-950/60 border border-indigo-900/50 hover:bg-indigo-900/70 text-indigo-300 p-2.5 rounded-xl shadow-inner active:scale-[0.95] disabled:opacity-50'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
