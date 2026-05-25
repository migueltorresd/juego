import { Button } from '../atoms/Button';
import { ProgressBar } from '../atoms/ProgressBar';
import { Music, Volume2, VolumeX, RotateCcw, Sun, Moon, Home } from 'lucide-react';

export const GameHeader = ({ 
  levelName = 'Básico', 
  playerXP = 0, 
  maxXP = 1000, 
  musicEnabled = false, 
  sfxEnabled = false, 
  theme = 'dark',
  language = 'es',
  onToggleLanguage,
  onToggleTheme,
  onToggleMusic,
  onToggleSFX,
  onRestart,
  onExitToSetup,
  t
}) => {
  return (
    <header className="w-full flex flex-col lg:flex-row items-center justify-between gap-3 py-2 px-4 lg:px-6 relative border-b border-indigo-950/30">
      
      {/* Left side: Level and XP progress */}
      <div className="glass-panel px-3.5 py-1.5 flex items-center gap-3 shrink-0 w-full lg:w-auto max-w-xs">
        <span className="text-2xl sm:text-3xl drop-shadow-[0_0_8px_gold] animate-pulse select-none">
          ⭐
        </span>
        <div className="flex flex-col flex-1 gap-0.5">
          <div className="flex justify-between items-baseline gap-2">
            <span className="text-slate-400 font-bold text-[0.6rem] uppercase tracking-widest">
              {t('headerLevel')}
            </span>
            <span className="text-[0.6rem] text-slate-300 font-bold">
              {playerXP}/{maxXP} XP
            </span>
          </div>
          <span className="text-xs sm:text-sm font-title text-indigo-300 leading-none">
            {levelName}
          </span>
          <ProgressBar value={playerXP} max={maxXP} size="xs" color="indigo" className="mt-0.5" />
        </div>
      </div>

      {/* Center: Title & subtitle */}
      <div className="text-center flex-1 z-10 pointer-events-none select-none my-2 lg:my-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-title drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          {t('headerTitle')} <span className="text-glow-cyan">{t('headerTitleSpan')}</span> <span className="text-emerald-400 font-black">&lt;/&gt;</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">
          {t('headerSubtitle')}
        </p>
      </div>

      {/* Right side: Audio controls, language toggle & reset button */}
      <div className="flex gap-2 shrink-0 justify-end w-full lg:w-auto">
        {/* Language Toggle Button */}
        <Button 
          variant="icon" 
          onClick={onToggleLanguage} 
          title={language === 'es' ? "Switch to English" : "Cambiar a Español"}
          className="text-indigo-400 border-indigo-900/50 hover:text-indigo-300 hover:border-indigo-500/50"
        >
          <span className="text-[11px] font-black tracking-wider">🌐 {language.toUpperCase()}</span>
        </Button>

        {/* Theme Toggle Button */}
        <Button 
          variant="icon" 
          onClick={onToggleTheme} 
          title={theme === 'light' ? t('themeToggleDark') : t('themeToggleLight')}
          className={theme === 'light' ? "text-amber-500 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "text-violet-400 border-indigo-900/50"}
        >
          {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        {/* Music button */}
        <Button 
          variant="icon" 
          onClick={onToggleMusic} 
          title={musicEnabled ? t('headerMuteMusic') : t('headerUnmuteMusic')}
          className={musicEnabled ? "text-cyan-400 border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.4)]" : ""}
        >
          <Music size={18} className={musicEnabled ? "animate-spin-slow" : ""} />
        </Button>

        {/* SFX button */}
        <Button 
          variant="icon" 
          onClick={onToggleSFX} 
          title={sfxEnabled ? t('headerMuteSFX') : t('headerUnmuteSFX')}
          className={sfxEnabled ? "text-emerald-400 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : ""}
        >
          {sfxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </Button>

        {/* Reset button */}
        <Button 
          variant="ghost" 
          onClick={onRestart}
          title={t('headerRestartGameTitle')}
          className="border border-indigo-500/40 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)] hover:shadow-[0_0_18px_rgba(99,102,241,0.6)]"
        >
          <RotateCcw size={14} />
          <span>{t('headerRestartBtn')}</span>
        </Button>

        {/* Home/Exit button */}
        <Button 
          variant="ghost" 
          onClick={onExitToSetup}
          title={t('headerExitSetupTitle')}
          className="border border-indigo-500/40 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)] hover:shadow-[0_0_18px_rgba(99,102,241,0.6)]"
        >
          <Home size={14} />
          <span>{t('headerHomeBtn')}</span>
        </Button>
      </div>

      {/* CSS slow spin for music note */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </header>
  );
};
