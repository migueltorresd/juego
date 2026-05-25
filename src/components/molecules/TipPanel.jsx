export const TipPanel = ({ tipText, t }) => {
  return (
    <div className="glass-panel w-full p-5 relative overflow-hidden transition-all duration-300 hover:border-indigo-400/60">
      {/* Title */}
      <h3 className="text-yellow-400 font-bold flex items-center gap-2 mb-3 font-title text-sm sm:text-base select-none">
        <span className="text-xl drop-shadow-[0_2px_5px_rgba(234,179,8,0.5)]">💡</span> 
        {t('tipPanelTitle')}
      </h3>
      
      {/* Body text */}
      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-1 pr-12 min-h-[3.5rem] flex items-center">
        {tipText || '...'}
      </p>

      {/* Decorative brackets absolute positioning */}
      <div className="absolute right-4 bottom-4 bg-indigo-950/60 rounded-xl px-2 py-1 text-indigo-300 text-xs font-bold border border-indigo-700/50 shadow-inner select-none font-mono">
        {'{ }'}
      </div>
    </div>
  );
};
