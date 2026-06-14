import { NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/openai';
import type { EvaluateRequest } from '@/lib/openai';
import { dictionaries, type Lang } from '@/i18n/strings';

export async function POST(request: Request) {
  let lang: Lang = 'en';
  try {
    const body = await request.json();
    const { apiKey, ...evalRequest } = body as EvaluateRequest & { apiKey?: string };
    lang = evalRequest.lang === 'ru' ? 'ru' : 'en';

    if (!evalRequest.question || !evalRequest.userAnswer || !evalRequest.sampleAnswer) {
      return NextResponse.json(
        { source: 'fallback', score: null, feedback: dictionaries[lang].api.badRequest },
        { status: 200 }
      );
    }

    const result = await evaluateAnswer(evalRequest, apiKey);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { source: 'fallback', score: null, feedback: dictionaries[lang].api.fallback },
      { status: 200 }
    );
  }
}
