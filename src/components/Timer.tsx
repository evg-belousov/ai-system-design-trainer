'use client';

interface TimerProps {
  timeLeft: number;
  isExpired: boolean;
}

export function Timer({ timeLeft, isExpired }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <span className={`font-mono text-lg ${isExpired ? 'text-red-600 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
      {formatted}
    </span>
  );
}
