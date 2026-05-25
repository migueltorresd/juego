import mascotImage from '../../assets/pyt.png';

export const RobotDialog = ({ 
  title = '¡Hola, futuro programador! 🦎', 
  message = 'Para empezar, ingresa el nombre de los jugadores y elige un nivel de dificultad.',
  expression = 'happy' // 'happy' | 'neutral' | 'sad' | 'thinking'
}) => {
  
  return (
    <div className="w-full flex flex-row items-center gap-3 py-2 px-3 sm:px-4 bg-slate-900/60 border border-slate-700/35 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300">
      
      {/* Dynamic Animated Mascot */}
      <div className="shrink-0 flex items-center justify-center bg-indigo-950/40 p-1 rounded-xl border border-indigo-900/30 overflow-hidden w-16 h-16 sm:w-20 sm:h-20 select-none">
        <img 
          src={mascotImage} 
          alt="Mascota" 
          className="w-full h-full object-contain animate-bounce-custom"
        />
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
