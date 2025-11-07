
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface GenerateButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ isLoading, onClick, disabled }) => {
  const isButtonDisabled = isLoading || disabled;
  
  return (
    <button
      onClick={onClick}
      disabled={isButtonDisabled}
      className="inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-white bg-cyan-600 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
    >
      {isLoading ? (
        <>
          <LoadingSpinner className="w-6 h-6" />
          <span>Генерация...</span>
        </>
      ) : (
        <>
          <SparklesIcon className="w-6 h-6" />
          <span>Сгенерировать Рекомендации</span>
        </>
      )}
    </button>
  );
};
