
import React from 'react';
import { XIcon } from './icons/XIcon';
import { ShieldIcon } from './icons/ShieldIcon';

interface LegalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDrawer: React.FC<LegalDrawerProps> = ({ isOpen, onClose }) => {
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
        aria-labelledby="legal-drawer-title"
      >
        <div className="h-full flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <ShieldIcon className="w-8 h-8 text-cyan-400" />
              <h2 id="legal-drawer-title" className="text-xl font-bold text-white">
                Политика и Условия
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="overflow-y-auto p-6 text-slate-300 space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Главный принцип: Всё происходит на вашем компьютере</h3>
              <p>
                Ключевая идея, заложенная в основу этих правил, — <strong className="text-white">полная локальная обработка данных</strong>. Это означает, что приложение работает исключительно в вашем браузере. Ваши файлы, API-ключи и любая другая информация <strong className="text-white">не загружаются на наши серверы</strong> и не передаются третьим лицам (за исключением прямого запроса к API Google, который делаете вы сами через свой ключ).
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Политика конфиденциальности: Ваша информация остаётся вашей</h3>
              <p className="mb-2">Эта часть объясняет, с какими данными работает приложение и что с ними происходит.</p>
              <div className="space-y-2 pl-4 border-l-2 border-slate-700">
                  <h4 className="font-semibold text-white">Какие данные собираются?</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong className="text-slate-200">API-ключ Google Gemini:</strong> Он нужен, чтобы приложение могло от вашего имени отправить запрос к искусственному интеллекту Google.</li>
                      <li><strong className="text-slate-200">Содержимое ваших полей ввода:</strong> Приложение читает текст сценария и продуктов для анализа и генерации рекомендаций.</li>
                  </ul>

                  <h4 className="font-semibold text-white mt-4">Как и где хранятся данные?</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong className="text-slate-200">API-ключ:</strong> Он сохраняется в <code className="bg-slate-800 px-1 rounded-sm text-xs">localStorage</code> вашего браузера. Это безопасное хранилище на вашем компьютере, к которому есть доступ только у вас.</li>
                      <li><strong className="text-slate-200">Данные полей ввода:</strong> Они также сохраняются в <code className="bg-slate-800 px-1 rounded-sm text-xs">localStorage</code> для вашего удобства.</li>
                      <li><strong className="text-slate-200">Файлы:</strong> Если вы загружаете файлы, они обрабатываются "на лету" в оперативной памяти браузера и не сохраняются.</li>
                  </ul>

                  <h4 className="font-semibold text-white mt-4">Ключевой вывод</h4>
                  <p className="text-sm">Мы, как разработчики, <strong className="text-white">не имеем доступа</strong> ни к вашему API-ключу, ни к содержимому ваших данных. Вся работа происходит на вашей стороне, что обеспечивает максимальный уровень конфиденциальности.</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Условия использования: Разграничение ответственности</h3>
              <div className="space-y-2 pl-4 border-l-2 border-slate-700">
                <p className="text-sm"><strong className="text-slate-200">Приложение "Как есть" ("As Is"):</strong> Вы получаете инструмент в том виде, в котором он есть. Разработчики не дают гарантий, что он будет работать идеально без ошибок.</p>
                <p className="text-sm"><strong className="text-slate-200">Ответственность за API-ключ:</strong> Поскольку вы используете свой собственный ключ от Google Gemini, вся ответственность за его использование (включая возможную оплату) лежит на вас.</p>
                <p className="text-sm"><strong className="text-slate-200">Качество работы ИИ:</strong> Приложение использует сторонний сервис (Google Gemini). Качество и релевантность предложенных рекомендаций не могут гарантироваться разработчиками приложения.</p>
                <p className="text-sm"><strong className="text-slate-200">Ограничение ответственности:</strong> Разработчики не несут ответственности за возможные убытки в результате использования приложения. Вы используете его на свой страх и риск.</p>
              </div>
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
