'use client';

import { useT } from '@/i18n/useT';
import { OwlMark } from './OwlMark';

/**
 * Studio attribution — System Design Trainer is built by Owlary.
 * Mirrors the KOSMOSIGN footer credit: "Made in / Сделано в" + owl mark + Owlary,
 * linking to owlary.com. Carries the mark only; inherits the trainer's palette.
 */
export function StudioCredit() {
  const t = useT();
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
      <a
        href="https://owlary.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
      >
        <span>{t.madeBy}</span>
        <OwlMark className="h-4 w-4" />
        <span className="font-medium">Owlary</span>
      </a>
    </footer>
  );
}
