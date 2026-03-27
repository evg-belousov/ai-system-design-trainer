'use client';

import { useCallback } from 'react';

const STORAGE_KEY = 'constructor-progress';

export interface ScenarioProgress {
  scenarioId: string;
  selections: Record<string, string[]>;
  score: number | null;
  completedAt: string | null;
}

export interface UseConstructorProgressReturn {
  getProgress: (scenarioId: string) => ScenarioProgress | null;
  getAllProgress: () => ScenarioProgress[];
  saveProgress: (progress: ScenarioProgress) => void;
  clearProgress: (scenarioId: string) => void;
}

function loadAll(): Record<string, ScenarioProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, ScenarioProgress>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useConstructorProgress(): UseConstructorProgressReturn {
  const getProgress = useCallback((scenarioId: string): ScenarioProgress | null => {
    const all = loadAll();
    return all[scenarioId] ?? null;
  }, []);

  const getAllProgress = useCallback((): ScenarioProgress[] => {
    return Object.values(loadAll());
  }, []);

  const saveProgress = useCallback((progress: ScenarioProgress): void => {
    const all = loadAll();
    all[progress.scenarioId] = progress;
    saveAll(all);
  }, []);

  const clearProgress = useCallback((scenarioId: string): void => {
    const all = loadAll();
    delete all[scenarioId];
    saveAll(all);
  }, []);

  return { getProgress, getAllProgress, saveProgress, clearProgress };
}
