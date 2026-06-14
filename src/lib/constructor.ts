import { allScenarios } from '@/data/constructor';
import { enScenarios } from '@/data/en/constructor';
import type { Scenario, MetricKey, Impact, CapacityEstimate } from '@/data/constructor/types';
import type { Lang } from '@/i18n/strings';

const METRIC_KEYS: MetricKey[] = ['latency', 'scalability', 'consistency', 'complexity', 'cost'];
const BASE_VALUE = 5;
const MIN_VALUE = 0;
const MAX_VALUE = 10;

const scenarioSets: Record<Lang, Scenario[]> = {
  ru: allScenarios,
  en: enScenarios,
};

function scenarios(lang: Lang): Scenario[] {
  return scenarioSets[lang] ?? allScenarios;
}

export function getScenarios(lang: Lang = 'en'): Scenario[] {
  return scenarios(lang);
}

export function getScenarioById(id: string, lang: Lang = 'en'): Scenario | undefined {
  return scenarios(lang).find(s => s.id === id);
}

export function getScenariosByDifficulty(difficulty: 'middle' | 'senior', lang: Lang = 'en'): Scenario[] {
  return scenarios(lang).filter(s => s.difficulty === difficulty);
}

export function calculateMetrics(
  scenario: Scenario,
  selections: Record<string, string[]>,
): Record<MetricKey, number> {
  const metrics: Record<MetricKey, number> = {
    latency: BASE_VALUE,
    scalability: BASE_VALUE,
    consistency: BASE_VALUE,
    complexity: BASE_VALUE,
    cost: BASE_VALUE,
  };

  for (const step of scenario.steps) {
    for (const decision of step.decisions) {
      const selectedOptionIds = selections[decision.id];
      if (!selectedOptionIds) continue;

      for (const optionId of selectedOptionIds) {
        const option = decision.options.find(o => o.id === optionId);
        if (!option) continue;

        for (const key of METRIC_KEYS) {
          metrics[key] = clamp(metrics[key] + option.impact[key], MIN_VALUE, MAX_VALUE);
        }
      }
    }
  }

  return metrics;
}

export function calculateScore(
  scenario: Scenario,
  selections: Record<string, string[]>,
): number {
  const refDecisions = scenario.referenceSolution.decisions;
  const decisionIds = Object.keys(refDecisions);

  if (decisionIds.length === 0) return 0;

  let totalSimilarity = 0;

  for (const decisionId of decisionIds) {
    const refOptions = new Set(refDecisions[decisionId]);
    const userOptions = new Set(selections[decisionId] ?? []);

    const intersection = new Set([...refOptions].filter(x => userOptions.has(x)));
    const union = new Set([...refOptions, ...userOptions]);

    if (union.size === 0) {
      totalSimilarity += 1;
    } else {
      totalSimilarity += intersection.size / union.size;
    }
  }

  return Math.round((totalSimilarity / decisionIds.length) * 100);
}

export function resolveCapacity(
  scenario: Scenario,
  selections: Record<string, string[]>,
): CapacityEstimate[] {
  const base = scenario.capacityEstimates?.['default'] ?? [];
  const overrides = new Map<string, CapacityEstimate>();

  for (const est of base) {
    overrides.set(est.label, est);
  }

  for (const step of scenario.steps) {
    for (const decision of step.decisions) {
      const selectedOptionIds = selections[decision.id];
      if (!selectedOptionIds) continue;

      for (const optionId of selectedOptionIds) {
        const option = decision.options.find(o => o.id === optionId);
        if (!option?.capacityImpact) continue;

        for (const est of option.capacityImpact) {
          overrides.set(est.label, est);
        }
      }
    }
  }

  return Array.from(overrides.values());
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
