import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgress } from '@/hooks/useProgress';

// Mock localStorage
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

describe('useProgress', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should start with empty progress', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.answers).toEqual({});
  });

  it('should record a correct answer', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAnswer('sa-modeling-001', true);
    });

    expect(result.current.answers['sa-modeling-001']).toBeDefined();
    expect(result.current.answers['sa-modeling-001'].correct).toBe(true);
  });

  it('should record an incorrect answer', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAnswer('sa-modeling-002', false);
    });

    expect(result.current.answers['sa-modeling-002'].correct).toBe(false);
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAnswer('sa-db-001', true);
    });

    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should calculate stats correctly', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAnswer('q1', true);
      result.current.recordAnswer('q2', false);
      result.current.recordAnswer('q3', true);
    });

    const stats = result.current.getStats();
    expect(stats.total).toBe(3);
    expect(stats.correct).toBe(2);
    expect(stats.percentage).toBe(Math.round((2 / 3) * 100));
  });

  it('should reset progress', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.recordAnswer('q1', true);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.answers).toEqual({});
  });
});
