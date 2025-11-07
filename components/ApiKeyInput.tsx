
import React from 'react';
import { ApiKeyIcon } from './icons/ApiKeyIcon';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
  return (
    <div className="bg-slate-800/50 p-4 rounded-xl shadow-md border border-slate-700">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-cyan-900/50 p-2 rounded-lg">
          <ApiKeyIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">Ваш Gemini API Ключ</h2>
      </div>
      <p className="text-slate-400 mb-4 text-sm">
        Ваш ключ хранится локально в вашем браузере и используется только для отправки запросов к Gemini API.
      </p>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="Введите ваш API ключ..."
        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
      />
    </div>
  );
};
