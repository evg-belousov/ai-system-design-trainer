export type MetricKey = 'latency' | 'scalability' | 'consistency' | 'complexity' | 'cost';

export interface Impact {
  latency: number;
  scalability: number;
  consistency: number;
  complexity: number;
  cost: number;
}

export interface Option {
  id: string;
  label: string;
  description: string;
  pros: string[];
  cons: string[];
  bestWhen: string;
  impact: Impact;
  capacityImpact?: CapacityEstimate[];
}

export interface Decision {
  id: string;
  category: string;
  question: string;
  options: Option[];
  multiSelect?: boolean;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  decisions: Decision[];
  tip?: string;
}

export interface ReferenceSolution {
  decisions: Record<string, string[]>;
  explanation: string;
  diagram: string;
}

export interface CapacityEstimate {
  label: string;
  value: string;
  formula: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'middle' | 'senior';
  steps: Step[];
  referenceSolution: ReferenceSolution;
  capacityEstimates?: Record<string, CapacityEstimate[]>;
}
