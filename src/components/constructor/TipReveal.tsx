'use client';

import { useState } from 'react';

interface TipRevealProps {
  tip: string;
}

export function TipReveal({ tip }: TipRevealProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mt-3">
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Показать подсказку
        </button>
      ) : (
        <div className="text-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-blue-800 dark:text-blue-300">
          {tip}
        </div>
      )}
    </div>
  );
}
