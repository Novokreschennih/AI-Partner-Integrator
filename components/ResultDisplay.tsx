
import React, { useState, useMemo, FC } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { GenerationResult } from '../services/geminiService';
import { BotIcon } from './icons/BotIcon';
import { WandIcon } from './icons/WandIcon';
import { SimpleMessage } from '../lib/n8nConverter';

// Helper to parse Telegram's simple Markdown
const parseTelegramMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(\*.*?\*|__.*?__|_.*?_)/g);
    return parts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*')) {
            return <strong key={index}>{part.slice(1, -1)}</strong>;
        }
        if (part.startsWith('__') && part.endsWith('__')) {
            return <u key={index}>{part.slice(2, -2)}</u>;
        }
        if (part.startsWith('_') && part.endsWith('_')) {
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return part;
    });
};

// Helper to convert script to Markdown string
const scriptToMarkdown = (script: SimpleMessage[]): string => {
    return script.map(message => {
        let md = message.text;
        if (message.buttons) {
            md += '\n';
            message.buttons.forEach(row => {
                md += row.map(btn => `[ ${btn.text} ]`).join(' ');
                md += '\n';
            });
        }
        return md;
    }).join('\n\n---\n\n');
};

const useCopyToClipboard = (): [boolean, (text: string) => void] => {
    const [isCopied, setIsCopied] = useState(false);
    const copy = (text: string) => {
        if(!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    return [isCopied, copy];
};

const PromptCard: FC<{ title: string, prompt: string, icon: React.ReactNode }> = ({ title, prompt, icon }) => {
    const [isCopied, copy] = useCopyToClipboard();
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 bg-cyan-900/50 p-2 rounded-lg text-cyan-400">{icon}</div>
                <h4 className="font-semibold text-white">{title}</h4>
            </div>
            <p className="text-sm text-slate-400 mb-3">{prompt}</p>
            <button
                onClick={() => copy(prompt)}
                className="w-full text-xs flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-1.5 px-3 rounded-md transition-colors duration-200"
            >
                {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                {isCopied ? 'Скопировано!' : 'Копировать промпт'}
            </button>
        </div>
    );
}

interface ResultDisplayProps {
  result: GenerationResult;
  n8nJsonString: string;
}

type ExportFormat = 'n8n' | 'simple' | 'markdown';

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, n8nJsonString }) => {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('n8n');
    const [isScriptCopied, copyScript] = useCopyToClipboard();

    const formattedScript = useMemo(() => {
        switch(selectedFormat) {
            case 'n8n':
                return n8nJsonString;
            case 'simple':
                return JSON.stringify(result.customizedScript, null, 2);
            case 'markdown':
                return scriptToMarkdown(result.customizedScript);
        }
    }, [selectedFormat, n8nJsonString, result.customizedScript]);

    const handleDownload = () => {
        if (!formattedScript) return;
        const extension = selectedFormat === 'markdown' ? 'md' : 'json';
        const blob = new Blob([formattedScript], { type: selectedFormat === 'markdown' ? 'text/markdown' : 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bot_script_${selectedFormat}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-slate-950 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Sidebar */}
                <aside className="lg:col-span-1 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Профиль Бота</h3>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3 text-sm">
                           <div>
                             <p className="text-slate-400 font-semibold">Тон голоса:</p>
                             <p className="text-slate-200">{result.botProfile.voiceTone}</p>
                           </div>
                           <div>
                             <p className="text-slate-400 font-semibold">Ключевые черты:</p>
                             <ul className="list-disc list-inside text-slate-300 mt-1">
                                {result.botProfile.keyCharacteristics.map((char, i) => <li key={i}>{char}</li>)}
                             </ul>
                           </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-white mb-3">Промпты для Визуализации</h3>
                        <div className="space-y-4">
                            <PromptCard title="Аватар Бота" prompt={result.visualizationPrompts.avatar} icon={<BotIcon className="w-5 h-5"/>} />
                            <PromptCard title="Иллюстрация Сценария" prompt={result.visualizationPrompts.scenario} icon={<WandIcon className="w-5 h-5"/>} />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-2">
                     <h3 className="text-lg font-bold text-white mb-3">Предпросмотр и Экспорт Сценария</h3>
                     
                     {/* Chat Preview */}
                     <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 max-h-[400px] overflow-y-auto mb-4">
                        <div className="space-y-4">
                            {result.customizedScript.map((message, index) => (
                                <div key={index} className="flex flex-col items-start">
                                    <div className="bg-cyan-600 text-white rounded-lg rounded-bl-sm px-4 py-2 max-w-lg">
                                        <p>{parseTelegramMarkdown(message.text)}</p>
                                    </div>
                                    {message.buttons && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {message.buttons.flat().map((button, btnIndex) => (
                                                <div key={btnIndex} className="bg-slate-700 text-slate-200 text-sm rounded-full px-3 py-1.5 shadow-sm">
                                                    {button.text}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                     </div>

                    {/* Export Controls & Code Viewer */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <div className="flex items-center gap-1 border border-slate-600 rounded-lg p-1 bg-slate-900">
                                {(['n8n', 'simple', 'markdown'] as ExportFormat[]).map(format => (
                                    <button
                                        key={format}
                                        onClick={() => setSelectedFormat(format)}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 ${selectedFormat === format ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                                    >
                                        {format === 'n8n' && 'n8n Workflow'}
                                        {format === 'simple' && 'Simple JSON'}
                                        {format === 'markdown' && 'Markdown'}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button onClick={handleDownload} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                                    <DownloadIcon className="w-4 h-4" />
                                    <span>Download</span>
                                </button>
                                <button onClick={() => copyScript(formattedScript)} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                                    {isScriptCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                                    <span>{isScriptCopied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                         <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-xs max-h-[300px]">
                            <code>{formattedScript}</code>
                        </pre>
                    </div>
                </main>
            </div>
        </div>
    );
};
