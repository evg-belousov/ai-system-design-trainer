import { describe, it, expect } from 'vitest';
import { allScenarios } from '@/data/constructor';
import type { Scenario } from '@/data/constructor/types';

describe('Constructor scenarios data', () => {
  it('all scenarios have required fields: id, title, description, difficulty, steps, referenceSolution', () => {
    for (const s of allScenarios) {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(['middle', 'senior']).toContain(s.difficulty);
      expect(s.steps.length).toBeGreaterThan(0);
      expect(s.referenceSolution).toBeDefined();
    }
  });

  it('scenario ids are unique', () => {
    const ids = allScenarios.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('scenario difficulty is middle or senior', () => {
    for (const s of allScenarios) {
      expect(['middle', 'senior']).toContain(s.difficulty);
    }
  });

  it('each scenario has 5-7 steps', () => {
    for (const s of allScenarios) {
      expect(s.steps.length).toBeGreaterThanOrEqual(5);
      expect(s.steps.length).toBeLessThanOrEqual(7);
    }
  });

  it('each step has id, title, description, and at least one decision', () => {
    for (const s of allScenarios) {
      for (const step of s.steps) {
        expect(step.id).toBeTruthy();
        expect(step.title).toBeTruthy();
        expect(step.description).toBeTruthy();
        expect(step.decisions.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('step ids are unique within scenario', () => {
    for (const s of allScenarios) {
      const ids = s.steps.map(st => st.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('each decision has id, category, question, and at least 2 options', () => {
    for (const s of allScenarios) {
      for (const step of s.steps) {
        for (const d of step.decisions) {
          expect(d.id).toBeTruthy();
          expect(d.category).toBeTruthy();
          expect(d.question).toBeTruthy();
          expect(d.options.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('decision ids are unique within scenario', () => {
    for (const s of allScenarios) {
      const ids = s.steps.flatMap(st => st.decisions.map(d => d.id));
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('each option has id, label, description, pros, cons, bestWhen, impact', () => {
    for (const s of allScenarios) {
      for (const step of s.steps) {
        for (const d of step.decisions) {
          for (const o of d.options) {
            expect(o.id).toBeTruthy();
            expect(o.label).toBeTruthy();
            expect(o.description).toBeTruthy();
            expect(o.pros.length).toBeGreaterThan(0);
            expect(o.cons.length).toBeGreaterThan(0);
            expect(o.bestWhen).toBeTruthy();
            expect(o.impact).toBeDefined();
          }
        }
      }
    }
  });

  it('option ids are unique within decision', () => {
    for (const s of allScenarios) {
      for (const step of s.steps) {
        for (const d of step.decisions) {
          const ids = d.options.map(o => o.id);
          expect(new Set(ids).size).toBe(ids.length);
        }
      }
    }
  });

  it('impact values are within range [-2, +2]', () => {
    const keys = ['latency', 'scalability', 'consistency', 'complexity', 'cost'] as const;
    for (const s of allScenarios) {
      for (const step of s.steps) {
        for (const d of step.decisions) {
          for (const o of d.options) {
            for (const key of keys) {
              expect(o.impact[key]).toBeGreaterThanOrEqual(-2);
              expect(o.impact[key]).toBeLessThanOrEqual(2);
            }
          }
        }
      }
    }
  });

  it('pros and cons arrays are non-empty for every option', () => {
    for (const s of allScenarios) {
      for (const step of s.steps) {
        for (const d of step.decisions) {
          for (const o of d.options) {
            expect(o.pros.length, `${s.id}/${d.id}/${o.id} pros empty`).toBeGreaterThan(0);
            expect(o.cons.length, `${s.id}/${d.id}/${o.id} cons empty`).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it('referenceSolution.decisions references only existing decision and option ids', () => {
    for (const s of allScenarios) {
      const allDecisions = s.steps.flatMap(st => st.decisions);
      const decisionMap = new Map(allDecisions.map(d => [d.id, d]));

      for (const [decId, optIds] of Object.entries(s.referenceSolution.decisions)) {
        expect(decisionMap.has(decId), `${s.id}: unknown decision ${decId}`).toBe(true);
        const decision = decisionMap.get(decId)!;
        const validOptionIds = new Set(decision.options.map(o => o.id));
        for (const optId of optIds) {
          expect(validOptionIds.has(optId), `${s.id}/${decId}: unknown option ${optId}`).toBe(true);
        }
      }
    }
  });

  it('referenceSolution has at least one selection per decision', () => {
    for (const s of allScenarios) {
      for (const optIds of Object.values(s.referenceSolution.decisions)) {
        expect(optIds.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('referenceSolution has explanation and diagram as non-empty strings', () => {
    for (const s of allScenarios) {
      expect(s.referenceSolution.explanation).toBeTruthy();
      expect(s.referenceSolution.diagram).toBeTruthy();
    }
  });

  it('multiSelect decisions in referenceSolution can have multiple option ids', () => {
    for (const s of allScenarios) {
      const allDecisions = s.steps.flatMap(st => st.decisions);
      const multiSelectDecisions = allDecisions.filter(d => d.multiSelect);

      for (const d of multiSelectDecisions) {
        const refOptions = s.referenceSolution.decisions[d.id];
        if (refOptions) {
          // multiSelect decisions are allowed to have multiple options (not required)
          expect(refOptions.length).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });
});
