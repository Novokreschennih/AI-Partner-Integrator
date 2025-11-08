
import React, { useState, useCallback } from 'react';
import { generateRecommendations, GenerationResult } from './services/geminiService';
import { Header } from './components/Header';
import { BotScriptInput } from './components/BotScriptInput';
import { PartnerProductInput } from './components/PartnerProductInput';
import { ResultDisplay } from './components/ResultDisplay';
import { GenerateButton } from './components/GenerateButton';
import { useLocalStorage } from './hooks/useLocalStorage';
import { botScriptExample, partnerProductsExample } from './lib/examples';
import { TemperatureSlider } from './components/TemperatureSlider';
import { LandingPage } from './components/LandingPage';
import { ApiKeyModal } from './components/ApiKeyModal';
import { HelpDrawer } from './components/HelpDrawer';
import { QuestionIcon } from './components/icons/QuestionIcon';
import { convertToN8nJson } from './lib/n8nConverter';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');
  const [botScript, setBotScript] = useLocalStorage<string>('bot_script', '');
  const [partnerProducts, setPartnerProducts] = useLocalStorage<string>('partner_products', '');
  const [temperature, setTemperature] = useLocalStorage<number>('generation_temperature', 0.5);
  
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [n8nJson, setN8nJson] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showLandingPage, setShowLandingPage] = useLocalStorage<boolean>('show_landing_page_v2', true);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(() => {
    const savedShowLanding = JSON.parse(localStorage.getItem('show_landing_page_v2') ?? 'true');
    const savedApiKey = JSON.parse(localStorage.getItem('gemini_api_key') ?? '""');
    return !savedShowLanding && !savedApiKey;
  });
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const handleStart = () => {
    setShowLandingPage(false);
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  };

  const handleContinueFromModal = () => {
    if (apiKey) {
      setShowApiKeyModal(false);
      if (error?.includes("API ключ")) {
        setError(null);
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      setError("Пожалуйста, введите ваш API ключ, чтобы продолжить.");
      setShowApiKeyModal(true);
      return;
    }
    
    if (!botScript || !partnerProducts) {
      const missingFields = [];
      if (!botScript) missingFields.push('сценарий бота');
      if (!partnerProducts) missingFields.push('информацию о продуктах');
      setError(`Пожалуйста, заполните все поля: ${missingFields.join(', ')}.`);
      return;
    }
    setError(null);
    setIsLoading(true);
    setGenerationResult(null);
    setN8nJson('');

    try {
      const resultString = await generateRecommendations(botScript, partnerProducts, apiKey, temperature);
      let parsedResult: GenerationResult;
      try {
        // Find the first and last curly brace to extract the JSON object
        const firstBrace = resultString.indexOf('{');
        const lastBrace = resultString.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) {
          throw new Error("No JSON object found in the AI response.");
        }
        const jsonString = resultString.substring(firstBrace, lastBrace + 1);
        parsedResult = JSON.parse(jsonString);
        setGenerationResult(parsedResult);
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError, "Raw response:", resultString);
        throw new Error("AI вернул некорректный формат данных (не JSON). Попробуйте изменить запрос или повторить попытку.");
      }

      if (parsedResult && Array.isArray(parsedResult.customizedScript)) {
        const n8nWorkflowJson = convertToN8nJson(parsedResult.customizedScript);
        setN8nJson(n8nWorkflowJson);
      } else {
         console.warn("AI result does not contain a valid script, cannot convert to n8n workflow.");
      }

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Произошла ошибка при генерации рекомендаций. Пожалуйста, проверьте консоль для получения подробной информации.');
    } finally {
      setIsLoading(false);
    }
  }, [botScript, partnerProducts, apiKey, temperature]);

  if (showLandingPage) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <>
      <ApiKeyModal 
        show={showApiKeyModal}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        onContinue={handleContinueFromModal}
      />
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <div className={`min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8 transition-filter duration-300 ${showApiKeyModal || isHelpOpen ? 'blur-sm' : ''} ${showApiKeyModal ? 'pointer-events-none' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <Header />

          <main className="mt-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BotScriptInput
                value={botScript}
                onChange={setBotScript}
                onFileLoad={setBotScript}
                onExampleLoad={() => setBotScript(botScriptExample)}
              />
              <PartnerProductInput
                value={partnerProducts}
                onChange={setPartnerProducts}
                onFileLoad={setPartnerProducts}
                onExampleLoad={() => setPartnerProducts(partnerProductsExample)}
              />
            </div>
            
            <div className="max-w-lg mx-auto">
              <TemperatureSlider value={temperature} onChange={setTemperature} />
            </div>

            <div className="text-center">
              <GenerateButton isLoading={isLoading} onClick={handleGenerate} disabled={!apiKey} />
              {!apiKey && (
                <p className="text-sm text-yellow-500 mt-2 animate-pulse">
                  Для генерации рекомендаций необходимо ввести ваш API ключ.
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                <strong className="font-bold">Ошибка: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {generationResult && (
              <ResultDisplay result={generationResult} n8nJsonString={n8nJson} />
            )}
          </main>
        </div>
      </div>
      
      {!showLandingPage && !showApiKeyModal && (
         <button
            onClick={() => setIsHelpOpen(true)}
            className="fixed bottom-6 right-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 z-40"
            aria-label="Открыть инструкцию"
          >
            <QuestionIcon className="w-7 h-7" />
          </button>
      )}
    </>
  );
};

export default App;
