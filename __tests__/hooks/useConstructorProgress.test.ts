import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConstructorProgress } from '@/hooks/useConstructorProgress';
import type { ScenarioProgress } from '@/hooks/useConstructorProgress';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockProgress: ScenarioProgress = {
  scenarioId: 'url-shortener',
  selections: { 'dec-1': ['opt-a'] },
  score: 85,
  completedAt: '2026-03-26T12:00:00Z',
};

describe('useConstructorProgress', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('getProgress returns null for unknown scenario', () => {
    const { result } = renderHook(() => useConstructorProgress());
    expect(result.current.getProgress('nonexistent')).toBeNull();
  });

  it('saveProgress stores data in localStorage', () => {
    const { result } = renderHook(() => useConstructorProgress());
    act(() => result.current.saveProgress(mockProgress));
    const raw = localStorage.getItem('constructor-progress');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed['url-shortener']).toBeDefined();
  });

  it('getProgress returns saved data', () => {
    const { result } = renderHook(() => useConstructorProgress());
    act(() => result.current.saveProgress(mockProgress));
    const progress = result.current.getProgress('url-shortener');
    expect(progress).toEqual(mockProgress);
  });

  it('getAllProgress returns all saved scenarios', () => {
    const { result } = renderHook(() => useConstructorProgress());
    const second: ScenarioProgress = { ...mockProgress, scenarioId: 'rate-limiter', score: 70 };
    act(() => {
      result.current.saveProgress(mockProgress);
      result.current.saveProgress(second);
    });
    const all = result.current.getAllProgress();
    expect(all).toHaveLength(2);
  });

  it('saveProgress overwrites existing progress for same scenario', () => {
    const { result } = renderHook(() => useConstructorProgress());
    act(() => result.current.saveProgress(mockProgress));
    const updated = { ...mockProgress, score: 95 };
    act(() => result.current.saveProgress(updated));
    const progress = result.current.getProgress('url-shortener');
    expect(progress!.score).toBe(95);
  });

  it('clearProgress removes scenario data', () => {
    const { result } = renderHook(() => useConstructorProgress());
    act(() => result.current.saveProgress(mockProgress));
    act(() => result.current.clearProgress('url-shortener'));
    expect(result.current.getProgress('url-shortener')).toBeNull();
  });
});
