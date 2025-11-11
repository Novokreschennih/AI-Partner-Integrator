
import React, { useState, useMemo, FC } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { GenerationResult } from '../services/geminiService';
import { ScriptBlock } from '../lib/n8nConverter';
import { ImageGenerationCard } from './ImageGenerationCard';
import { RefreshIcon } from './icons/RefreshIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { WandIcon } from './icons/WandIcon';

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

// Helper to convert script to a plain text string (for Markdown and TXT)
const scriptToPlainText = (script: ScriptBlock[]): string => {
    return script.map(block => {
        const header = `--- TRIGGER: ${block.trigger} ---`;
        const messagesText = block.messages.map(message => {
            let txt = message.text;
            if (message.buttons) {
                txt += '\n';
                message.buttons.forEach(row => {
                    txt += row.map(btn => `[ ${btn.text} ]`).join(' ');
                    txt += '\n';
                });
            }
            return txt;
        }).join('\n\n');
        return `${header}\n${messagesText}`;
    }).join('\n\n====================\n\n');
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

interface ResultDisplayProps {
  result: GenerationResult;
  n8nJsonString: string;
  apiKey: string;
  onRegenerateAll: () => void;
  onRegenerateMessage: (blockId: string, messageIndex: number) => void;
  isRegeneratingAll: boolean;
  regeneratingMessage: { blockId: string; messageIndex: number } | null;
}

type ExportFormat = 'n8n' | 'simple' | 'markdown' | 'txt';

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
    result, 
    n8nJsonString, 
    apiKey,
    onRegenerateAll,
    onRegenerateMessage,
    isRegeneratingAll,
    regeneratingMessage
}) => {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('n8n');
    const [isScriptCopied, copyScript] = useCopyToClipboard();
    const [copiedInfo, setCopiedInfo] = useState<{ type: 'message' | 'button', messageIndex: number, buttonIndex?: number } | null>(null);

    const handleCopy = (textToCopy: string, messageIndex: number, type: 'message' | 'button', buttonIndex?: number) => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedInfo({ type, messageIndex, buttonIndex });
            setTimeout(() => {
                setCopiedInfo(null);
            }, 2000);
        });
    };

    const formattedScript = useMemo(() => {
        if (!result.customizedScript) return '';
        switch(selectedFormat) {
            case 'n8n':
                return n8nJsonString;
            case 'simple':
                return JSON.stringify(result.customizedScript, null, 2);
            case 'markdown':
            case 'txt':
                return scriptToPlainText(result.customizedScript);
        }
    }, [selectedFormat, n8nJsonString, result.customizedScript]);

    const handleDownload = () => {
        if (!formattedScript) return;
        const extensionMap: Record<ExportFormat, string> = {
            n8n: 'json',
            simple: 'json',
            markdown: 'md',
            txt: 'txt',
        };
        const mimeMap: Record<ExportFormat, string> = {
            n8n: 'application/json',
            simple: 'application/json',
            markdown: 'text/markdown',
            txt: 'text/plain',
        };

        const extension = extensionMap[selectedFormat];
        const mimeType = mimeMap[selectedFormat];

        const blob = new Blob([formattedScript], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bot_script_${selectedFormat}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!result.botProfile) {
        return null; // Or a loading state if preferred
    }

    return (
        <div className="bg-slate-950 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700 mt-8 animate-fade-in">
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
                        <h3 className="text-lg font-bold text-white mb-3">Визуализация</h3>
                        {result.visualizationPrompts?.scenario && (
                            <ImageGenerationCard 
                                prompt={result.visualizationPrompts.scenario}
                                apiKey={apiKey}
                            />
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-2">
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-white">Предпросмотр и Экспорт Сценария</h3>
                        <button 
                            onClick={onRegenerateAll}
                            disabled={isRegeneratingAll}
                            className="flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 disabled:bg-slate-600/50 disabled:cursor-not-allowed"
                        >
                            {isRegeneratingAll ? (
                                <LoadingSpinner className="w-5 h-5"/>
                            ) : (
                                <RefreshIcon className="w-5 h-5"/>
                            )}
                            <span>Перегенерировать весь сценарий</span>
                        </button>
                     </div>
                     <p className="text-sm text-slate-400 mb-2">Вы можете скопировать сообщения и кнопки прямо из окна предпросмотра, нажав на них.</p>
                     
                     {/* Chat Preview */}
                     <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 max-h-[400px] overflow-y-auto mb-4">
                        {result.customizedScript?.length > 0 ? (
                            <div className="space-y-4">
                                {result.customizedScript.map((block) => 
                                    block.messages.map((message, messageIndex) => {
                                        const isRegeneratingThis = regeneratingMessage?.blockId === block.id && regeneratingMessage?.messageIndex === messageIndex;
                                        const messageKey = `${block.id}-${messageIndex}`;

                                        return (
                                            <div key={messageKey} className="flex flex-col items-start group">
                                                <div 
                                                    className="bg-cyan-600 text-white rounded-lg rounded-bl-sm px-4 py-2 max-w-lg cursor-pointer transition-all duration-200 hover:bg-cyan-500 relative"
                                                    onClick={() => !isRegeneratingThis && handleCopy(message.text, messageIndex, 'message')}
                                                >
                                                    {isRegeneratingThis ? (
                                                        <div className="flex items-center justify-center h-full py-1">
                                                            <LoadingSpinner className="w-5 h-5" />
                                                        </div>
                                                    ) : (
                                                        <p>{parseTelegramMarkdown(message.text)}</p>
                                                    )}
                                                    
                                                    {copiedInfo?.type === 'message' && copiedInfo.messageIndex === messageIndex && (
                                                        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-white font-semibold text-sm animate-fade-in-out backdrop-blur-sm">
                                                            <CheckIcon className="w-5 h-5 mr-2 text-green-400" />
                                                            Скопировано!
                                                        </div>
                                                    )}
                                                     <button 
                                                        title="Перегенерировать это сообщение"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRegenerateMessage(block.id, messageIndex);
                                                        }}
                                                        className="absolute -right-2 -top-2 p-1.5 bg-slate-700 rounded-full text-slate-300 hover:bg-cyan-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                                        disabled={!!regeneratingMessage}
                                                     >
                                                         <WandIcon className="w-4 h-4"/>
                                                     </button>
                                                </div>
                                                {message.buttons && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {message.buttons.flat().map((button, btnIndex) => (
                                                            <div 
                                                                key={btnIndex}
                                                                className="bg-slate-700 text-slate-200 text-sm rounded-full px-3 py-1.5 shadow-sm cursor-pointer hover:bg-slate-600 transition-colors duration-200 relative"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCopy(button.text, messageIndex, 'button', btnIndex);
                                                                }}
                                                            >
                                                                {button.text}
                                                                {copiedInfo?.type === 'button' && copiedInfo.messageIndex === messageIndex && copiedInfo.buttonIndex === btnIndex && (
                                                                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white font-semibold text-xs animate-fade-in-out backdrop-blur-sm">
                                                                        <CheckIcon className="w-4 h-4 mr-1 text-green-400" />
                                                                        Скопировано!
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <p>Сценарий не содержит сообщений.</p>
                            </div>
                        )}
                     </div>

                    {/* Export Controls & Code Viewer */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <div className="flex items-center gap-1 border border-slate-600 rounded-lg p-1 bg-slate-900 flex-wrap">
                                {(['n8n', 'simple', 'markdown', 'txt'] as ExportFormat[]).map(format => (
                                    <button
                                        key={format}
                                        onClick={() => setSelectedFormat(format)}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 ${selectedFormat === format ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                                    >
                                        {format === 'n8n' && 'n8n Workflow'}
                                        {format === 'simple' && 'Simple JSON'}
                                        {format === 'markdown' && 'Markdown'}
                                        {format === 'txt' && 'TXT'}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button onClick={handleDownload} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                                    <DownloadIcon className="w-4 h-4" />
                                    <span>Скачать</span>
                                </button>
                                <button onClick={() => copyScript(formattedScript)} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                                    {isScriptCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                                    <span>{isScriptCopied ? 'Скопировано!' : 'Копировать'}</span>
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
