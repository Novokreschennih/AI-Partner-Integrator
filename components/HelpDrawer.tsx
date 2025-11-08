
import React from 'react';
import { XIcon } from './icons/XIcon';
import { BotIcon } from './icons/BotIcon';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-drawer-title"
      >
        <div className="h-full flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <BotIcon className="w-8 h-8 text-cyan-400" />
              <h2 id="help-drawer-title" className="text-xl font-bold text-white">
                Как пользоваться приложением
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Закрыть инструкцию"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="overflow-y-auto p-6 text-slate-300 space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">1. API Ключ</h3>
              <p>Для работы с ИИ вам понадобится Gemini API ключ. Это бесплатно для базового использования.</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Вы можете получить ключ в <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">Google AI Studio</a>.</li>
                <li>Ключ хранится <strong className="text-white">только в вашем браузере</strong> и никуда не передается, кроме как для прямых запросов к Google API.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">2. Анализ Голоса Бота</h3>
              <p>В левое поле вставьте или загрузите файл со сценарием вашего чат-бота. Чем больше текста вы предоставите, тем точнее ИИ сможет имитировать стиль общения.</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li><strong className="text-white">Что вставлять:</strong> Идеально подойдут логи диалогов, JSON-структуры сценариев (как в примере) или просто текстовые файлы с репликами бота.</li>
                <li><strong className="text-white">Совет:</strong> Используйте характерный фрагмент, где хорошо виден тон голоса: формальный, дружелюбный, юмористический и т.д.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">3. Партнёрские Продукты</h3>
              <p>В правое поле добавьте информацию о продуктах, которые нужно порекомендовать. Используйте простой и понятный формат, как показано в примере.</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li><strong className="text-white">Название:</strong> Четкое и короткое имя продукта.</li>
                <li><strong className="text-white">Описание:</strong> Ключевые преимущества, которые помогут ИИ составить релевантную рекомендацию.</li>
                <li><strong className="text-white">Ссылка:</strong> Ваша партнёрская ссылка.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">4. Уровень Креативности</h3>
              <p>Слайдер "температуры" контролирует, насколько творческим будет ответ ИИ.</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li><strong className="text-white">Низкие значения (0.1 - 0.3):</strong> Более предсказуемые и точные ответы, строго по тексту.</li>
                <li><strong className="text-white">Средние значения (0.4 - 0.7):</strong> Сбалансированный вариант между точностью и креативностью (рекомендуется).</li>
                <li><strong className="text-white">Высокие значения (0.8 - 1.0):</strong> Более творческие, неожиданные, но иногда менее релевантные ответы.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">5. Генерация и Результат</h3>
              <p>Нажмите кнопку "Сгенерировать Рекомендации". ИИ проанализирует данные и создаст новый блок диалога.</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li><strong className="text-white">Формат:</strong> Результат будет представлен в виде JSON-массива, готового для использования в системах автоматизации типа <strong className="text-white">n8n</strong>.</li>
                <li><strong className="text-white">Использование:</strong> Скопируйте JSON и вставьте его в нужный узел вашего сценария. Вы можете редактировать текст и ссылки по своему усмотрению.</li>
              </ul>
            </section>

             <div className="text-center pt-4">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 font-semibold text-white bg-cyan-600 rounded-full shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50 transition-colors"
                >
                    Все понятно!
                </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
