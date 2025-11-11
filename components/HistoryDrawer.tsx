
import React from 'react';
import { XIcon } from './icons/XIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { GenerationResult } from '../services/geminiService';

export interface HistoryItem {
    id: string;
    botScript: string;
    partnerProducts: string;
    temperature: number;
    result: GenerationResult;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-labelledby="history-drawer-title"
      >
        <div className="h-full flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <HistoryIcon className="w-8 h-8 text-cyan-400" />
              <h2 id="history-drawer-title" className="text-xl font-bold text-white">
                История Генераций
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Закрыть историю"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="overflow-y-auto p-2 flex-grow">
            {history.length > 0 ? (
                <ul className="space-y-2">
                    {history.map(item => (
                        <li key={item.id}>
                            <button 
                                onClick={() => onSelect(item)}
                                className="w-full text-left p-3 rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
                            >
                                <p className="text-sm font-semibold text-slate-200 truncate">{item.result.botProfile.voiceTone}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {new Date(item.id).toLocaleString('ru-RU', {
                                        day: '2-digit',
                                        month: 'long',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-slate-500 h-full flex flex-col justify-center items-center">
                    <HistoryIcon className="w-16 h-16 mb-4" />
                    <p className="text-lg">История пуста</p>
                    <p className="text-sm mt-1">Ваши успешные генерации появятся здесь.</p>
                </div>
            )}
          </div>
          {history.length > 0 && (
            <div className="p-4 border-t border-slate-700 flex-shrink-0">
                <button
                    onClick={() => {
                        if (window.confirm('Вы уверены, что хотите очистить всю историю? Это действие необратимо.')) {
                            onClear();
                        }
                    }}
                    className="w-full py-2 px-4 bg-red-800/50 hover:bg-red-800 text-red-200 font-semibold rounded-lg transition-colors"
                >
                    Очистить историю
                </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
