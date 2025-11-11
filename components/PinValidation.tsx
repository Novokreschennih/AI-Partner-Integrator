import React, { useState } from 'react';
import { BotIcon } from './icons/BotIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { PIN_AUTH_SERVICE_URL, APP_ID } from '../lib/constants';

interface PinValidationProps {
  onSuccess: () => void;
}

export const PinValidation: React.FC<PinValidationProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const triggerError = (errorMessage: string) => {
    setError(errorMessage);
    setPin('');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 820);
    setIsVerifying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;
    setError('');
    setIsVerifying(true);

    try {
      const response = await fetch(PIN_AUTH_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin, appId: APP_ID }),
      });

      if (response.ok) {
        setTimeout(() => {
            onSuccess();
        }, 300);
      } else {
         if (response.status === 404) {
             triggerError('PIN-код не найден или уже был использован.');
         } else {
             triggerError('Произошла ошибка при проверке PIN-кода.');
         }
      }
    } catch (err) {
      console.error('PIN validation network error:', err);
      triggerError('Ошибка сети. Проверьте подключение к интернету.');
    }
  };

  const isSubmitDisabled = pin.length < 4 || isVerifying;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-slate-200 p-4">
      <div className="w-full max-w-sm text-center">
        <BotIcon className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2">Подтверждение Доступа</h1>
        <p className="text-slate-400 mb-8">Пожалуйста, введите ваш PIN-код для продолжения.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={isShaking ? 'animate-shake' : ''}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="********"
              className="form-input w-full bg-slate-800 border-2 border-slate-700 rounded-lg text-center text-2xl tracking-[0.5em] py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              maxLength={8}
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 disabled:bg-cyan-800/50 disabled:text-slate-400 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            {isVerifying ? (
              <>
                <LoadingSpinner className="w-5 h-5 mr-2" />
                <span>Проверка...</span>
              </>
            ) : (
              <span>Подтвердить</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};