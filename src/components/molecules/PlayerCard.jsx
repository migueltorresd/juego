export const PlayerCard = ({ 
  player, 
  isActive = false, 
  isLeader = false 
}) => {
  const { name, score, avatar, colorClass } = player;

  // Active state border and shadow styles
  const activeClass = isActive 
    ? 'active scale-105' 
    : 'scale-95 opacity-60 hover:opacity-95';

  return (
    <div className={`relative player-card ${colorClass} flex items-center gap-3 px-3 py-1.5 rounded-2xl min-w-[125px] sm:min-w-[150px] border-2 backdrop-blur-md transition-all duration-300 ${activeClass}`}>
      
      {/* Crown Badge for Leader */}
      {isLeader && score > 0 && (
        <span 
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-bounce select-none z-20"
          title="¡Líder de la partida!"
        >
          👑
        </span>
      )}

      {/* Avatar Box */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 rounded-xl w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0 select-none">
        {avatar}
      </div>

      {/* Details Box */}
      <div className="flex flex-col text-left overflow-hidden">
        <span className="p-name text-[0.65rem] sm:text-xs font-black tracking-widest text-slate-300 uppercase truncate">
          {name}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-white font-title text-xl sm:text-2xl drop-shadow-sm leading-tight">
            {score}
          </span>
          <span className="text-slate-400 text-[0.65rem] sm:text-xs font-bold mt-1">pts</span>
          
          {/* Active Star Badge */}
          {isActive && (
            <span className="text-xs ml-1 drop-shadow-[0_0_5px_gold] animate-pulse select-none">
              ⭐
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
