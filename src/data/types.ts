export type Difficulty = 'junior' | 'middle' | 'senior';

export type Block = 'sa' | 'sd' | 'ai';

export interface BaseQuestion {
  id: string;
  block: Block;
  topic: string;
  topicLabel: string;
  difficulty: Difficulty;
  question: string;
  explanation: string;
}

export interface QuizQuestion extends BaseQuestion {
  type: 'quiz';
  options: string[];
  correctIndex: number;
}

export interface OpenQuestion extends BaseQuestion {
  type: 'open';
  sampleAnswer: string;
}

export type Question = QuizQuestion | OpenQuestion;
