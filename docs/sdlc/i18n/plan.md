# i18n — bilingual support (EN default, RU)

## Requirement
Add language support with a switcher at the top of the site. English is the default;
Russian already exists as the current content. Switching is instant (no reload).

## Scope
- UI chrome strings (nav, buttons, labels, modals, headings) — ~22 `.tsx` files.
- Content data (questions, options, explanations, sample answers, topic labels,
  constructor scenarios) — ~50 files in `src/data/`, ~2.9 MB, currently Russian. Full EN translation.

## Architecture
- **`LanguageProvider`** (`src/components/LanguageProvider.tsx`): React context mirroring
  `ThemeProvider`. `lang: 'en' | 'ru'`, default `'en'`, persisted in `localStorage` key `lang`,
  sets `document.documentElement.lang`. `mounted` guard for hydration safety.
- **UI strings**: `src/i18n/strings.ts` — `{ en: {...}, ru: {...} }` typed dictionary; `useT()`
  hook returns the active dictionary.
- **Content**: existing `src/data/{sa,sd,ai,constructor}/*` = RU dataset (unchanged).
  New `src/data/en/**` mirror with identical export names + identical `id`s. Loaders
  (`lib/questions.ts`, `lib/constructor.ts`) take `lang` and select the dataset.
- **Consumers**: read `lang` from context, pass to loaders. Home page converted to client component.

## Invariants for translation
- Preserve every `id`, `correctIndex`, `impact` numbers, `formula`, `diagram`, difficulty.
- Translate only human-readable text; keep technical terms in standard English.
- EN files import types via the `@/data/...` alias.

## Acceptance criteria
1. Switcher in header toggles EN/RU; choice persists across reloads; default EN on first visit.
2. All UI chrome renders in the selected language.
3. All quiz questions / open answers / constructor scenarios render in the selected language.
4. Session URLs (`?ids=`, scenario ids) resolve identically in both languages.
5. `npm run build`, `npm run lint`, `npm test` pass.

## Process: lightweight (per user). Tests cover provider + lang-aware loaders + fallback.
