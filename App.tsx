
import React, { useState, useCallback } from 'react';
import { generateRecommendations } from './services/geminiService';
import { Header } from './components/Header';
import { ApiKeyInput } from './components/ApiKeyInput';
import { BotScriptInput } from './components/BotScriptInput';
import { PartnerProductInput } from './components/PartnerProductInput';
import { ResultDisplay } from './components/ResultDisplay';
import { GenerateButton } from './components/GenerateButton';
import { useLocalStorage } from './hooks/useLocalStorage';
import { botScriptExample, partnerProductsExample } from './lib/examples';
import { TemperatureSlider } from './components/TemperatureSlider';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');
  const [botScript, setBotScript] = useLocalStorage<string>('bot_script', '');
  const [partnerProducts, setPartnerProducts] = useLocalStorage<string>('partner_products', '');
  const [temperature, setTemperature] = useLocalStorage<number>('generation_temperature', 0.5);
  
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      const result = await generateRecommendations(botScript, partnerProducts, apiKey, temperature);
      // Validate if the result is a valid JSON before setting the state
      try {
        JSON.parse(result);
        setGeneratedJson(result);
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        throw new Error("AI вернул некорректный формат данных (не JSON). Попробуйте изменить запрос или повторить попытку.");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Произошла ошибка при генерации рекомендаций. Пожалуйста, проверьте консоль для получения подробной информации.');
    } finally {
      setIsLoading(false);
    }
  }, [botScript, partnerProducts, apiKey, temperature]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="mt-8 space-y-8">
          <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />

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

          {generatedJson && (
            <ResultDisplay jsonString={generatedJson} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
