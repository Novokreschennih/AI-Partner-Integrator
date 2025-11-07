
import React from 'react';
import { WandIcon } from './icons/WandIcon';

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ value, onChange }) => {
  const getLabel = (val: number) => {
    if (val <= 0.2) return 'Точный';
    if (val <= 0.6) return 'Сбалансированный';
    if (val <= 0.9) return 'Креативный';
    return 'Экспериментальный';
  };
  
  return (
    <div className="bg-slate-800/50 p-4 rounded-xl shadow-md border border-slate-700">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
            <div className="bg-cyan-900/50 p-2 rounded-lg">
              <WandIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <label htmlFor="temperature" className="font-semibold text-white">Уровень креативности</label>
        </div>
        <span className="text-sm font-medium text-cyan-300 bg-cyan-900/70 px-2 py-1 rounded-md">
          {getLabel(value)}
        </span>
      </div>
      <p className="text-slate-400 mb-4 text-sm">
        Более низкие значения делают ответ более предсказуемым, высокие — более творческим.
      </p>
      <div className="flex items-center gap-4">
        <input
          id="temperature"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <span className="font-mono text-lg text-slate-300 w-10 text-center">{value.toFixed(1)}</span>
      </div>
    </div>
  );
};
