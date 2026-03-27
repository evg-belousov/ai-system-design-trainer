'use client';

import type { Step } from '@/data/constructor/types';
import { OptionCard } from './OptionCard';
import { TipReveal } from './TipReveal';

interface StepCardProps {
  step: Step;
  selections: Record<string, string[]>;
  onSelect: (decisionId: string, optionId: string) => void;
  onDeselect: (decisionId: string, optionId: string) => void;
}

export function StepCard({ step, selections, onSelect, onDeselect }: StepCardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
      </div>

      {step.decisions.map(decision => {
        const selected = selections[decision.id] ?? [];

        return (
          <div key={decision.id} className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {decision.question}
              </h3>
              {decision.multiSelect && (
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Можно выбрать несколько
                </span>
              )}
            </div>

            <div className="grid gap-2">
              {decision.options.map(option => (
                <OptionCard
                  key={option.id}
                  option={option}
                  selected={selected.includes(option.id)}
                  onToggle={() => {
                    if (selected.includes(option.id)) {
                      onDeselect(decision.id, option.id);
                    } else {
                      onSelect(decision.id, option.id);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {step.tip && <TipReveal tip={step.tip} />}
    </div>
  );
}
