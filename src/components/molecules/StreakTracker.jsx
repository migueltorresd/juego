export const StreakTracker = ({ 
  streakCount = 0, 
  weeklyActivity = [false, false, false, false, false, false, false] // L, M, M, J, V, S, D
}) => {
  const daysOfWeek = [
    { label: 'L', name: 'Lunes' },
    { label: 'M', name: 'Martes' },
    { label: 'M', name: 'Miércoles' },
    { label: 'J', name: 'Jueves' },
    { label: 'V', name: 'Viernes' },
    { label: 'S', name: 'Sábado' },
    { label: 'D', name: 'Domingo' }
  ];

  // Get current day index (0 = Monday, ..., 6 = Sunday)
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="glass-panel w-full p-4 flex flex-col gap-3">
      {/* Title & Count */}
      <div className="flex justify-between items-center">
        <span className="text-orange-400 font-bold flex items-center gap-1.5 text-xs select-none">
          <span className="text-base drop-shadow-[0_0_5px_rgba(251,146,60,0.6)] animate-pulse">🔥</span> 
          Racha actual
        </span>
        <span className="text-yellow-400 font-title text-sm drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
          {streakCount} {streakCount === 1 ? 'día' : 'días'}
        </span>
      </div>

      {/* Week row */}
      <div className="flex justify-between w-full mt-1">
        {daysOfWeek.map((day, index) => {
          const isPlayed = weeklyActivity[index];
          const isToday = index === todayIndex;

          const dayCircleClass = isPlayed
            ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_8px_#10b981]'
            : isToday
              ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300 shadow-[0_0_8px_rgba(234,179,8,0.5)] animate-pulse'
              : 'bg-slate-950 border-slate-700 text-slate-500';

          const content = isPlayed ? '✓' : isToday ? '⭐' : '•';

          return (
            <div key={day.label} className="flex flex-col items-center gap-1 shrink-0">
              {/* Circle */}
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[0.65rem] font-black transition-all duration-300 ${dayCircleClass}`}>
                {content}
              </div>
              
              {/* Day Label */}
              <span className={`text-[0.6rem] font-black select-none ${isToday ? 'text-yellow-400 drop-shadow-md' : 'text-slate-500'}`}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
