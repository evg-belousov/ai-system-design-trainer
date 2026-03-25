'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

const API_KEY_STORAGE_KEY = 'openai-api-key';

export function Header() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
      setHasKey(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      setHasKey(true);
    }
    setShowModal(false);
  };

  const handleClear = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setHasKey(false);
    setShowModal(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            System Design Trainer
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              disabled={!mounted}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
            >
              {!mounted || theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className={`p-2 rounded-lg border ${hasKey ? 'border-green-500 text-green-600' : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'} hover:bg-gray-50 dark:hover:bg-gray-800`}
              title={hasKey ? 'API ключ настроен' : 'Настроить API ключ'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </button>
            <Link
              href="/quiz"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Начать тренировку
            </Link>
          </div>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Настройки OpenAI API</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Введите ваш OpenAI API ключ для AI-оценки открытых ответов. Ключ хранится только в вашем браузере.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder:text-gray-400 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Сохранить
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Очистить
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
