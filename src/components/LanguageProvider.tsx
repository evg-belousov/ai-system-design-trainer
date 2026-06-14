'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'ru';

const STORAGE_KEY = 'lang';
const DEFAULT_LANG: Lang = 'en';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  mounted: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === 'en' || stored === 'ru') {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, [lang, mounted]);

  const setLang = (next: Lang) => setLangState(next);

  return (
    <LanguageContext.Provider value={{ lang, setLang, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
