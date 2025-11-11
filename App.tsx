
import React, { useState, useCallback, useEffect } from 'react';
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
import { PinValidation } from './components/PinValidation';
import { LogOutIcon } from './components/icons/LogOutIcon';
import { LegalDrawer } from './components/LegalDrawer';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { ShieldIcon } from './components/icons/ShieldIcon';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');
  const [botScript, setBotScript] = useLocalStorage<string>('bot_script', '');
  const [partnerProducts, setPartnerProducts] = useLocalStorage<string>('partner_products', '');
  const [temperature, setTemperature] = useLocalStorage<number>('generation_temperature', 0.5);
  
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [n8nJson, setN8nJson] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
  const [hasSeenLanding, setHasSeenLanding] = useLocalStorage<boolean>('has_seen_landing_v1', false);

  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  
  useEffect(() => {
    // If user is authenticated but has no API key, prompt them.
    if (isAuthenticated && !apiKey) {
      setShowApiKeyModal(true);
    }
  }, [isAuthenticated, apiKey]);

  const handleStart = () => {
    setHasSeenLanding(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // User will be redirected to PinValidation page on next render
    // because hasSeenLanding is still true.
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
        let jsonString = resultString.trim();
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.slice(7);
            if (jsonString.endsWith('```')) {
                jsonString = jsonString.slice(0, -3);
            }
            jsonString = jsonString.trim();
        }

        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No JSON object found in the AI response.");
        }
        const finalJsonString = jsonString.substring(firstBrace, lastBrace + 1);
        parsedResult = JSON.parse(finalJsonString);
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

  if (!isAuthenticated) {
    if (!hasSeenLanding) {
      return <LandingPage onStart={handleStart} />;
    }
    return <PinValidation onSuccess={handleLoginSuccess} />;
  }

  // Render main application if authenticated
  return (
    <>
      <ApiKeyModal 
        show={showApiKeyModal}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        onContinue={handleContinueFromModal}
      />
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <LegalDrawer isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} />
      
      <div className={`min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8 transition-filter duration-300 ${showApiKeyModal || isHelpOpen || isLegalOpen ? 'blur-sm' : ''} ${showApiKeyModal ? 'pointer-events-none' : ''}`}>
        <div className="max-w-7xl mx-auto relative">
          <Header />
          <button
            onClick={handleLogout}
            className="absolute top-2 right-2 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 z-10"
            aria-label="Выйти"
          >
              <LogOutIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Выйти</span>
          </button>

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
      
      {!showApiKeyModal && (
         <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4 z-40">
            <button
                onClick={() => setIsLegalOpen(true)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-slate-500 focus:ring-opacity-50"
                aria-label="Политика и Условия"
              >
                <ShieldIcon className="w-6 h-6" />
            </button>
             <button
                onClick={() => setShowApiKeyModal(true)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-slate-500 focus:ring-opacity-50"
                aria-label="Настройки API ключа"
              >
                <SettingsIcon className="w-6 h-6" />
            </button>
            <button
                onClick={() => setIsHelpOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50"
                aria-label="Открыть инструкцию"
              >
                <QuestionIcon className="w-7 h-7" />
            </button>
        </div>
      )}
    </>
  );
};

export default App;
