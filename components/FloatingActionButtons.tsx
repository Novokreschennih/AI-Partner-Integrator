
import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';
import { LegalDrawer } from './LegalDrawer';
import { ShieldIcon } from './icons/ShieldIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { QuestionIcon } from './icons/QuestionIcon';

interface FloatingActionButtonsProps {
    onHistoryClick: () => void;
    onLegalClick: () => void;
    onSettingsClick: () => void;
    onHelpClick: () => void;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
    onHistoryClick,
    onLegalClick,
    onSettingsClick,
    onHelpClick
}) => {
    return (
        <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4 z-40">
            <button
                onClick={onHistoryClick}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-slate-500 focus:ring-opacity-50"
                aria-label="История генераций"
              >
                <HistoryIcon className="w-6 h-6" />
            </button>
            <button
                onClick={onLegalClick}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-slate-500 focus:ring-opacity-50"
                aria-label="Политика и Условия"
              >
                <ShieldIcon className="w-6 h-6" />
            </button>
             <button
                onClick={onSettingsClick}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-slate-500 focus:ring-opacity-50"
                aria-label="Настройки API ключа"
              >
                <SettingsIcon className="w-6 h-6" />
            </button>
            <button
                onClick={onHelpClick}
                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50"
                aria-label="Открыть инструкцию"
              >
                <QuestionIcon className="w-7 h-7" />
            </button>
        </div>
    );
};
