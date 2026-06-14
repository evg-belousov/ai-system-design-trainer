'use client';

import { useLang } from '@/components/LanguageProvider';
import { dictionaries, type Dict } from '@/i18n/strings';

/** Returns the active-language dictionary. */
export function useT(): Dict {
  const { lang } = useLang();
  return dictionaries[lang];
}
