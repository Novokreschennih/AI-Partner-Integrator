
import React, { useRef } from 'react';
import { FileUploadIcon } from './icons/FileUploadIcon';
import { PasteIcon } from './icons/PasteIcon';

interface BotScriptInputProps {
  value: string;
  onChange: (value: string) => void;
  onFileLoad: (content: string) => void;
}

export const BotScriptInput: React.FC<BotScriptInputProps> = ({ value, onChange, onFileLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileLoad(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-md border border-slate-700 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-cyan-900/50 p-2 rounded-lg">
          <PasteIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">1. Анализ Голоса Бота</h2>
      </div>
      <p className="text-slate-400 mb-4 text-sm">Вставьте существующий сценарий чат-бота или загрузите файл (.json, .txt, .md). Это поможет ИИ понять стиль общения вашего бота.</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Вставьте сюда текст сценария вашего чат-бота..."
        className="w-full flex-grow bg-slate-900 border border-slate-600 rounded-lg p-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none min-h-[300px]"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json,.txt,.md"
      />
      <button
        onClick={handleUploadClick}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        <FileUploadIcon className="w-5 h-5" />
        Загрузить файл
      </button>
    </div>
  );
};
