
import React from 'react';
import { Header } from './Header';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900 text-slate-200">
      <div className="text-center max-w-4xl">
        <Header />

        <div className="mt-12 text-left bg-slate-800/50 p-8 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Как это работает?</h2>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-4">
              <CheckCircleIcon className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
              <span>
                <strong>Анализ стиля:</strong> Загрузите сценарий вашего чат-бота, и наш ИИ проанализирует его тон, стиль и лексику, чтобы понять его "голос".
              </span>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircleIcon className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
              <span>
                <strong>Информация о продуктах:</strong> Добавьте описание и ссылки на партнёрские продукты, которые вы хотите порекомендовать.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircleIcon className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
              <span>
                <strong>Магия генерации:</strong> Искусственный интеллект создаст новый диалоговый блок, который нативно и органично впишется в ваш сценарий, сохраняя оригинальный стиль бота.
              </span>
            </li>
             <li className="flex items-start gap-4">
              <CheckCircleIcon className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
              <span>
                <strong>Готовый результат:</strong> Получите готовый к использованию JSON-фрагмент для простой интеграции в платформы типа n8n, Integromat или ваши собственные системы.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 font-semibold text-white bg-cyan-600 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            <SparklesIcon className="w-7 h-7" />
            <span className="text-xl">Начать работу</span>
          </button>
        </div>
      </div>
    </div>
  );
};
