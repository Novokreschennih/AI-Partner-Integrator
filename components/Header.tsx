
import React from 'react';
import { BotIcon } from './icons/BotIcon';

export const Header: React.FC = () => (
  <header className="text-center">
    <div className="inline-flex items-center gap-4 bg-slate-800 px-6 py-3 rounded-full shadow-lg">
      <BotIcon className="w-10 h-10 text-cyan-400" />
      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
        Интегратор Партнёрских Рекомендаций
      </h1>
    </div>
    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
      Бесшовно интегрируйте партнёрские продукты в ваш чат-бот, сохраняя его уникальный стиль и тон голоса.
    </p>
  </header>
);
