import { dictionaries, type Lang } from '@/i18n/strings';

export interface EvaluateRequest {
  question: string;
  userAnswer: string;
  sampleAnswer: string;
  lang?: Lang;
}

export interface EvaluateResponse {
  source: 'openai' | 'fallback';
  score: number | null;
  feedback: string;
}

function fallbackResponse(lang: Lang): EvaluateResponse {
  return {
    source: 'fallback',
    score: null,
    feedback: dictionaries[lang].api.fallback,
  };
}

const PROMPTS: Record<Lang, { system: (q: string, sample: string, answer: string) => string; instruction: string }> = {
  en: {
    instruction: `You are an expert in system design and system analysis. Evaluate the user's answer to an interview question.

Give a score from 0 to 100 and detailed feedback in English.
Response format strictly JSON:
{"score": <number>, "feedback": "<text>"}`,
    system: (q, sample, answer) => `Question: ${q}

Reference answer: ${sample}

User answer: ${answer}`,
  },
  ru: {
    instruction: `Ты — эксперт по системному проектированию и системному анализу. Оцени ответ пользователя на вопрос собеседования.

Дай оценку от 0 до 100 и развёрнутый фидбэк на русском языке.
Формат ответа строго JSON:
{"score": <число>, "feedback": "<текст>"}`,
    system: (q, sample, answer) => `Вопрос: ${q}

Эталонный ответ: ${sample}

Ответ пользователя: ${answer}`,
  },
};

export async function evaluateAnswer(req: EvaluateRequest, userApiKey?: string): Promise<EvaluateResponse> {
  const apiKey = userApiKey || process.env.OPENAI_API_KEY;
  const lang: Lang = req.lang === 'ru' ? 'ru' : 'en';
  const prompt = PROMPTS[lang];

  if (!apiKey) {
    return fallbackResponse(lang);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompt.instruction,
          },
          {
            role: 'user',
            content: prompt.system(req.question, req.sampleAnswer, req.userAnswer),
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      return fallbackResponse(lang);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return fallbackResponse(lang);
    }

    const parsed = JSON.parse(content);

    return {
      source: 'openai',
      score: typeof parsed.score === 'number' ? parsed.score : null,
      feedback: typeof parsed.feedback === 'string' ? parsed.feedback : dictionaries[lang].api.fallback,
    };
  } catch {
    return fallbackResponse(lang);
  }
}
