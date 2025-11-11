import React, { useState } from 'react';
import { ApiKeyIcon } from './icons/ApiKeyIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';
import { XIcon } from './icons/XIcon';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  return (
    <div className="bg-slate-800/50 p-4 rounded-xl shadow-md border border-slate-700">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-cyan-900/50 p-2 rounded-lg">
          <ApiKeyIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">Ваш Gemini API Ключ</h2>
      </div>
      <p className="text-slate-400 mb-4 text-sm">
        Ваш ключ хранится локально в вашем браузере и используется только для отправки запросов к Gemini API.{' '}
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-cyan-400 hover:text-cyan-300 underline"
        >
          Получить ключ можно в Google AI Studio.
        </a>
      </p>
      <div className="relative">
        <input
          type={isKeyVisible ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Введите ваш API ключ..."
          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 pr-20 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
          {apiKey && (
             <button
              type="button"
              onClick={() => onApiKeyChange('')}
              className="p-1 hover:text-white"
              aria-label="Очистить API ключ"
            >
              <XIcon className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsKeyVisible(!isKeyVisible)}
            className="p-1 hover:text-white"
            aria-label={isKeyVisible ? "Скрыть API ключ" : "Показать API ключ"}
          >
            {isKeyVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};