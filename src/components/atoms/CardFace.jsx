export const CardFace = ({ 
  type = 'front', // 'front' (unflipped) | 'back' (flipped/concept)
  icon, 
  text, 
  isMatched = false,
  className = '' 
}) => {
  if (type === 'front') {
    return (
      <div className={`card-face card-front ${className}`} />
    );
  }

  // Flipped card face (showing content)
  return (
    <div className={`card-face card-back flex flex-col justify-center items-center p-1.5 text-center ${className}`}>
      {icon && (
        <span className="concept-icon block filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)] mb-0.5 select-none">
          {icon}
        </span>
      )}
      <span className="concept-text font-black text-slate-100 leading-tight max-w-full overflow-hidden text-ellipsis px-1 select-none">
        {text}
      </span>
      {isMatched && (
        <div className="card-match-badge absolute bg-emerald-500 rounded-full flex items-center justify-center text-white font-black shadow-[0_0_6px_#10b981] border border-emerald-400 select-none">
          ✓
        </div>
      )}
    </div>
  );
};
