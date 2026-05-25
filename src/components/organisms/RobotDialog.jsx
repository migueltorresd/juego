export const RobotDialog = ({ 
  title = '¡Hola, futuro programador! 🤖', 
  message = 'Para empezar, ingresa el nombre de los jugadores y elige un nivel de dificultad.',
  expression = 'happy' // 'happy' | 'neutral' | 'sad' | 'thinking'
}) => {
  
  // Custom SVG faces based on expression
  const renderRobotSVG = () => {
    let eyeClass = 'fill-cyan-400';
    let mouthSVG = <path d="M 28 36 Q 35 41 42 36" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
    
    if (expression === 'happy') {
      eyeClass = 'fill-cyan-400 shadow-glow';
      mouthSVG = <path d="M 27 34 Q 35 42 43 34" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" />;
    } else if (expression === 'sad') {
      eyeClass = 'fill-cyan-500';
      mouthSVG = <path d="M 28 38 Q 35 32 42 38" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" />;
    } else if (expression === 'thinking') {
      eyeClass = 'fill-yellow-400';
      mouthSVG = <line x1="28" y1="36" x2="42" y2="36" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />;
    } else if (expression === 'surprised') {
      eyeClass = 'fill-pink-400';
      mouthSVG = <circle cx="35" cy="36" r="3.5" stroke="#f472b6" strokeWidth="2.5" fill="none" />;
    }

    return (
      <svg width="65" height="65" viewBox="0 0 70 70" className="shrink-0 animate-bounce-custom">
        {/* Antenna */}
        <line x1="35" y1="12" x2="35" y2="4" stroke="#38bdf8" strokeWidth="3" />
        <circle cx="35" cy="4" r="3.5" fill="#22d3ee" className="animate-pulse" />
        
        {/* Ears */}
        <rect x="8" y="24" width="6" height="12" rx="2" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
        <rect x="56" y="24" width="6" height="12" rx="2" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
        
        {/* Head */}
        <rect x="14" y="14" width="42" height="34" rx="10" fill="#0f172a" stroke="#4f46e5" strokeWidth="2" />
        {/* Screen inside Head */}
        <rect x="18" y="18" width="34" height="26" rx="6" fill="#020617" stroke="#1e1b4b" strokeWidth="1.5" />
        
        {/* Eyes */}
        {expression === 'happy' ? (
          <>
            {/* Curved happy eyes */}
            <path d="M 22 26 Q 26 21 30 26" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 40 26 Q 44 21 48 26" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : expression === 'sad' ? (
          <>
            {/* Sad / slanted eyes */}
            <path d="M 22 23 L 30 27" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <path d="M 48 23 L 40 27" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Round glowing eyes */}
            <circle cx="26" cy="26" r="3.5" className={eyeClass} />
            <circle cx="44" cy="26" r="3.5" className={eyeClass} />
          </>
        )}
        
        {/* Mouth */}
        {mouthSVG}
        
        {/* Neck */}
        <rect x="30" y="48" width="10" height="6" rx="1" fill="#334155" />
        
        {/* Body (partial) */}
        <path d="M 20 54 L 50 54 L 54 70 L 16 70 Z" fill="#1e293b" stroke="#4f46e5" strokeWidth="1.5" />
        {/* Chest details */}
        <rect x="28" y="58" width="14" height="6" rx="1" fill="#020617" />
        <circle cx="32" cy="61" r="1.5" fill="#22c55e" />
        <circle cx="38" cy="61" r="1.5" fill="#ef4444" />
      </svg>
    );
  };

  return (
    <div className="w-full flex flex-row items-center gap-3 py-2 px-3 sm:px-4 bg-slate-900/60 border border-slate-700/35 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300">
      
      {/* Dynamic Animated Vector Robot */}
      <div className="shrink-0 flex items-center justify-center bg-indigo-950/40 p-1.5 rounded-xl border border-indigo-900/30">
        {renderRobotSVG()}
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 text-left relative bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl shadow-inner">
        {/* Triangle arrow for bubble pointing to the left */}
        <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 border-y-8 border-y-transparent border-r-8 border-r-slate-950/70 drop-shadow-[-1px_0_0_rgba(30,41,59,0.5)]" />
        
        <h4 className="text-white font-black text-xs sm:text-sm mb-0.5 tracking-wide">
          {title}
        </h4>
        <p className="text-slate-300 text-[0.7rem] sm:text-xs font-medium leading-normal">
          {message}
        </p>
      </div>

    </div>
  );
};
