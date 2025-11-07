
import React, { useState, useCallback, useEffect } from 'react';
import { generateRecommendations } from './services/geminiService';
import { Header } from './components/Header';
import { ApiKeyInput } from './components/ApiKeyInput';
import { BotScriptInput } from './components/BotScriptInput';
import { PartnerProductInput } from './components/PartnerProductInput';
import { ResultDisplay } from './components/ResultDisplay';
import { GenerateButton } from './components/GenerateButton';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [botScript, setBotScript] = useState<string>('');
  const [partnerProducts, setPartnerProducts] = useState<string>('');
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleBotFileLoad = (content: string) => {
    setBotScript(content);
  };
  
  const handlePartnerProductsFileLoad = (content: string) => {
    setPartnerProducts(content);
  };

  const handleGenerate = useCallback(async () => {
    if (!apiKey || !botScript || !partnerProducts) {
      const missingFields = [];
      if (!apiKey) missingFields.push('API ключ');
      if (!botScript) missingFields.push('сценарий бота');
      if (!partnerProducts) missingFields.push('информацию о продуктах');
      setError(`Пожалуйста, заполните все поля: ${missingFields.join(', ')}.`);
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedJson('');

    try {
      const result = await generateRecommendations(botScript, partnerProducts, apiKey);
      setGeneratedJson(result);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Произошла ошибка при генерации рекомендаций. Пожалуйста, проверьте консоль для получения подробной информации.');
    } finally {
      setIsLoading(false);
    }
  }, [botScript, partnerProducts, apiKey]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="mt-8 space-y-8">
          <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BotScriptInput
              value={botScript}
              onChange={setBotScript}
              onFileLoad={handleBotFileLoad}
            />
            <PartnerProductInput
              value={partnerProducts}
              onChange={setPartnerProducts}
              onFileLoad={handlePartnerProductsFileLoad}
            />
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

          {generatedJson && (
            <ResultDisplay jsonString={generatedJson} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
