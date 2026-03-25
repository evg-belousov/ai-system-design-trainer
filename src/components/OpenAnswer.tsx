'use client';

import { useState } from 'react';

interface OpenAnswerProps {
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function OpenAnswer({ onSubmit, disabled }: OpenAnswerProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg resize-y min-h-32 text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-blue-400"
        placeholder="Введите ваш ответ..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        rows={6}
      />
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
      >
        Ответить
      </button>
    </div>
  );
}
