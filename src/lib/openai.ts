export interface EvaluateRequest {
  question: string;
  userAnswer: string;
  sampleAnswer: string;
}

export interface EvaluateResponse {
  source: 'openai' | 'fallback';
  score: number | null;
  feedback: string;
}

const FALLBACK_RESPONSE: EvaluateResponse = {
  source: 'fallback',
  score: null,
  feedback: 'Автоматическая оценка недоступна. Сравните свой ответ с эталонным.',
};

export async function evaluateAnswer(req: EvaluateRequest, userApiKey?: string): Promise<EvaluateResponse> {
  const apiKey = userApiKey || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return FALLBACK_RESPONSE;
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
            content: `Ты — эксперт по системному проектированию и системному анализу. Оцени ответ пользователя на вопрос собеседования.

Дай оценку от 0 до 100 и развёрнутый фидбэк на русском языке.
Формат ответа строго JSON:
{"score": <число>, "feedback": "<текст>"}`,
          },
          {
            role: 'user',
            content: `Вопрос: ${req.question}

Эталонный ответ: ${req.sampleAnswer}

Ответ пользователя: ${req.userAnswer}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      return FALLBACK_RESPONSE;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return FALLBACK_RESPONSE;
    }

    const parsed = JSON.parse(content);

    return {
      source: 'openai',
      score: typeof parsed.score === 'number' ? parsed.score : null,
      feedback: typeof parsed.feedback === 'string' ? parsed.feedback : FALLBACK_RESPONSE.feedback,
    };
  } catch {
    return FALLBACK_RESPONSE;
  }
}
