
import React from 'react';
import { ApiKeyInput } from './ApiKeyInput';

interface ApiKeyModalProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onContinue: () => void;
  show: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ apiKey, onApiKeyChange, onContinue, show }) => {
  if (!show) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-lg m-4 transform transition-all duration-300 scale-100">
        <div className="p-6 sm:p-8">
          <ApiKeyInput apiKey={apiKey} onApiKeyChange={onApiKeyChange} />
          <div className="mt-6 text-center">
            <button
              onClick={onContinue}
              disabled={!apiKey}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3 font-semibold text-white bg-cyan-600 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
            >
              Продолжить
            </button>
             {!apiKey && (
              <p className="text-sm text-yellow-500 mt-3">
                Для продолжения необходимо ввести ваш API ключ.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
