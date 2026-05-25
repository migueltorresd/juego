import { sound } from '../../services/sound';

export const Slider = ({ 
  min = 7, 
  max = 16, 
  value, 
  onChange, 
  label = 'Cantidad de parejas',
  className = ''
}) => {
  const handleChange = (e) => {
    sound.playClick();
    if (onChange) onChange(Number(e.target.value));
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <div className="flex justify-between items-center text-sm font-bold">
        <span className="text-indigo-300">{label}:</span>
        <span className="text-glow-cyan text-base font-black font-title bg-slate-950 px-3 py-1 rounded-lg border border-indigo-900/60 shadow-inner">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-slate-700/60 outline-none"
      />
      <div className="flex justify-between text-[0.65rem] text-slate-400 font-bold px-1 select-none">
        <span>Min: {min}</span>
        <span>Máx: {max}</span>
      </div>
    </div>
  );
};
