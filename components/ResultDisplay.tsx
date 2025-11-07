
import React, { useState, useEffect } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ResultDisplayProps {
  jsonString: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ jsonString }) => {
  const [formattedJson, setFormattedJson] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
    } catch (error) {
      setFormattedJson(jsonString); // Fallback to raw string if parsing fails
    }
  }, [jsonString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const syntaxHighlight = (json: string) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'text-green-400'; // number
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'text-pink-400'; // key
            } else {
                cls = 'text-yellow-400'; // string
            }
        } else if (/true|false/.test(match)) {
            cls = 'text-blue-400'; // boolean
        } else if (/null/.test(match)) {
            cls = 'text-slate-500'; // null
        }
        return `<span class="${cls}">${match}</span>`;
    });
  };

  return (
    <div className="bg-slate-950 p-6 rounded-xl shadow-lg border border-slate-700 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Результат: Готовый фрагмент для n8n</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-5 h-5 text-green-400" />
              <span>Скопировано!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-5 h-5" />
              <span>Копировать JSON</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm">
        <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(formattedJson) }} />
      </pre>
    </div>
  );
};
