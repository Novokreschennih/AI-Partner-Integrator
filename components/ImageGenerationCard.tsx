
import React, { useState, useCallback, FC } from 'react';
import { generateVisualizationImage } from '../services/geminiService';
import { ImageIcon } from './icons/ImageIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { WandIcon } from './icons/WandIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface ImageGenerationCardProps {
    prompt: string;
    apiKey: string;
}

export const ImageGenerationCard: FC<ImageGenerationCardProps> = ({ prompt, apiKey }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isPromptCopied, setIsPromptCopied] = useState(false);

    const handleGenerateImage = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const base64Data = await generateVisualizationImage(prompt, apiKey);
            setImageUrl(`data:image/png;base64,${base64Data}`);
        } catch (e: any) {
            setError(e.message || "Не удалось сгенерировать изображение.");
        } finally {
            setIsLoading(false);
        }
    }, [prompt, apiKey]);

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(prompt);
        setIsPromptCopied(true);
        setTimeout(() => setIsPromptCopied(false), 2000);
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
                <p className="text-sm text-slate-400 flex-1 pr-2">{prompt}</p>
                <button
                    onClick={handleCopyPrompt}
                    className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
                    aria-label="Копировать промпт"
                >
                    {isPromptCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
            
            {imageUrl && !isLoading && (
                 <div className="relative group">
                    <img src={imageUrl} alt="Сгенерированная визуализация" className="rounded-lg w-full object-cover" />
                    <button onClick={handleGenerateImage} className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <RefreshIcon className="w-6 h-6 mr-2"/>
                        Сгенерировать заново
                    </button>
                </div>
            )}
            
            {!imageUrl && !isLoading && (
                 <button
                    onClick={handleGenerateImage}
                    disabled={isLoading || !apiKey}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-600/80 hover:bg-cyan-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    <ImageIcon className="w-5 h-5" />
                    <span>Сгенерировать изображение</span>
                </button>
            )}

            {isLoading && (
                <div className="w-full h-32 flex flex-col items-center justify-center bg-slate-700/50 rounded-lg">
                    <LoadingSpinner className="w-8 h-8 text-cyan-400" />
                    <p className="text-sm text-slate-300 mt-2">Создание изображения...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-900/50 text-red-300 text-xs p-2 rounded-md text-center">
                    {error}
                </div>
            )}
        </div>
    );
};
