import { NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/openai';
import type { EvaluateRequest } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey, ...evalRequest } = body as EvaluateRequest & { apiKey?: string };

    if (!evalRequest.question || !evalRequest.userAnswer || !evalRequest.sampleAnswer) {
      return NextResponse.json(
        { source: 'fallback', score: null, feedback: 'Некорректный запрос: отсутствуют обязательные поля.' },
        { status: 200 }
      );
    }

    const result = await evaluateAnswer(evalRequest, apiKey);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { source: 'fallback', score: null, feedback: 'Автоматическая оценка недоступна. Сравните свой ответ с эталонным.' },
      { status: 200 }
    );
  }
}
