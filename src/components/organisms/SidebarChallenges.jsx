import { StreakTracker } from '../molecules/StreakTracker';
import { ProgressBar } from '../atoms/ProgressBar';

export const SidebarChallenges = ({ 
  pairsCount = 12, 
  playerLevel = 1,
  playerXP = 0, 
  maxXP = 1000, 
  streakCount = 0,
  weeklyActivity = [false, false, false, false, false, false, false],
  challengesState = { ch3: false, chHalf: false, chAll: false },
  t
}) => {
  // Determine dynamically the requirements for challenges based on pairsCount
  const ch3Req = 3;
  const chHalfReq = Math.floor(pairsCount / 2);
  const chAllReq = pairsCount;

  // Ranks based on Level
  const getRank = (lvl) => {
    if (lvl === 1) return { title: t('rankNovice'), color: 'text-cyan-400' };
    if (lvl <= 3) return { title: t('rankProgrammer'), color: 'text-indigo-400' };
    if (lvl <= 5) return { title: t('rankDeveloper'), color: 'text-pink-400' };
    if (lvl <= 7) return { title: t('rankSenior'), color: 'text-emerald-400' };
    return { title: t('rankMaster'), color: 'text-amber-400' };
  };

  const rank = getRank(playerLevel);

  return (
    <div className="flex flex-col gap-4 w-full animate-fade-in">
      
      {/* Challenges Panel */}
      <div className="glass-panel w-full p-4">
        <h3 className="text-yellow-400 font-bold flex items-center gap-2 mb-4 font-title text-sm sm:text-base select-none">
          <span className="text-xl drop-shadow-[0_2px_5px_rgba(234,179,8,0.5)]">🏆</span> 
          {t('challengesTitle')}
        </h3>
        <div className="flex flex-col gap-3">
          {/* Challenge 1 */}
          <div className={`flex items-center justify-between border-b border-indigo-950/40 pb-2.5 transition-all duration-300 ${challengesState.ch3 ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-2">
              <span className={`rounded-full w-4.5 h-4.5 flex items-center justify-center text-[0.6rem] font-bold border transition-all duration-300 ${
                challengesState.ch3 
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_8px_#10b981]' 
                  : 'bg-slate-950 border-slate-700 text-slate-500'
              }`}>
                {challengesState.ch3 ? '✓' : '•'}
              </span>
              <span className={`text-xs ${challengesState.ch3 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                {t('challengePairs3')}
              </span>
            </div>
            <span className="text-xs text-yellow-500 font-black">+10 pts</span>
          </div>

          {/* Challenge 2 */}
          <div className={`flex items-center justify-between border-b border-indigo-950/40 pb-2.5 transition-all duration-300 ${challengesState.chHalf ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-2">
              <span className={`rounded-full w-4.5 h-4.5 flex items-center justify-center text-[0.6rem] font-bold border transition-all duration-300 ${
                challengesState.chHalf 
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_8px_#10b981]' 
                  : 'bg-slate-950 border-slate-700 text-slate-500'
              }`}>
                {challengesState.chHalf ? '✓' : '•'}
              </span>
              <span className={`text-xs ${challengesState.chHalf ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                {t('challengePairsHalf')} ({chHalfReq})
              </span>
            </div>
            <span className="text-xs text-yellow-500 font-black">+20 pts</span>
          </div>

          {/* Challenge 3 */}
          <div className={`flex items-center justify-between transition-all duration-300 ${challengesState.chAll ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-2">
              <span className={`rounded-full w-4.5 h-4.5 flex items-center justify-center text-[0.6rem] font-bold border transition-all duration-300 ${
                challengesState.chAll 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_8px_rgba(168,85,247,0.6)]' 
                  : 'bg-slate-950 border-slate-700 text-slate-500'
              }`}>
                {challengesState.chAll ? '✓' : '•'}
              </span>
              <span className={`text-xs ${challengesState.chAll ? 'text-purple-400 font-bold' : 'text-slate-300'}`}>
                {t('challengePairsAll')}
              </span>
            </div>
            <span className="text-xs text-purple-400 font-black">+50 pts</span>
          </div>
        </div>
      </div>

      {/* Progress Panel */}
      <div className="glass-panel w-full p-4">
        <h3 className="text-cyan-400 font-bold flex items-center gap-2 mb-4 font-title text-sm sm:text-base select-none">
          <span className="text-xl">📈</span> 
          {t('progressTitle')}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="bg-indigo-950 text-indigo-300 text-[0.65rem] px-1.5 py-0.5 rounded font-black border border-indigo-900/50">
                Lvl {playerLevel}
              </span>
              <span className="font-bold text-[0.65rem] text-slate-300">
                {playerXP} / {maxXP} XP
              </span>
            </div>
            <ProgressBar value={playerXP} max={maxXP} size="sm" color="cyan" />
          </div>

          {/* Hexagonal Badge for Rank */}
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-950 to-slate-950 border-2 border-indigo-500/60 rounded-xl rotate-45 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.3)] shrink-0 select-none hover:border-indigo-400 transition-colors">
            <div className="-rotate-45 text-center leading-none text-[0.45rem] font-bold px-1 w-full truncate">
              <span className="text-white text-xs">&lt;/&gt;</span>
              <br />
              <span className={`font-black uppercase text-[0.4rem] tracking-tighter ${rank.color}`}>
                {rank.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Tracker */}
      <StreakTracker streakCount={streakCount} weeklyActivity={weeklyActivity} t={t} />
    </div>
  );
};

