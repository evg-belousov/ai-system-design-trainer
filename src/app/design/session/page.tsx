'use client';

import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { StepNavigator } from '@/components/constructor/StepNavigator';
import { StepCard } from '@/components/constructor/StepCard';
import { MetricsPanel } from '@/components/constructor/MetricsPanel';
import { CapacityPanel } from '@/components/constructor/CapacityPanel';
import { SummaryView } from '@/components/constructor/SummaryView';
import { useConstructorSession } from '@/hooks/useConstructorSession';
import { useConstructorProgress } from '@/hooks/useConstructorProgress';
import { getScenarioById, resolveCapacity } from '@/lib/constructor';

export default function DesignSessionPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    notFound();
  }

  const scenario = getScenarioById(id);

  if (!scenario) {
    notFound();
  }

  const {
    state,
    currentStep,
    metrics,
    selectOption,
    deselectOption,
    nextStep,
    prevStep,
    goToStep,
    finish,
    reset,
    score,
  } = useConstructorSession(scenario);

  const { saveProgress } = useConstructorProgress();

  const handleFinish = () => {
    finish();
  };

  const handleReset = () => {
    reset();
  };

  if (state.completed && score !== null) {
    saveProgress({
      scenarioId: scenario.id,
      selections: state.selections,
      score,
      completedAt: new Date().toISOString(),
    });
  }

  const isLastStep = state.currentStepIndex === scenario.steps.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{scenario.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{scenario.description}</p>
        </div>

        {!state.completed ? (
          <>
            <div className="mb-6">
              <StepNavigator
                steps={scenario.steps}
                currentIndex={state.currentStepIndex}
                onGoToStep={goToStep}
              />
            </div>

            <div className="grid md:grid-cols-[1fr_280px] gap-6">
              <div>
                <StepCard
                  step={currentStep}
                  selections={state.selections}
                  onSelect={selectOption}
                  onDeselect={deselectOption}
                />

                <div className="flex justify-between mt-6">
                  <button
                    onClick={prevStep}
                    disabled={state.currentStepIndex === 0}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Назад
                  </button>

                  {isLastStep ? (
                    <button
                      onClick={handleFinish}
                      className="px-6 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      Завершить
                    </button>
                  ) : (
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Далее
                    </button>
                  )}
                </div>
              </div>

              <div className="hidden md:block">
                <div className="sticky top-6 space-y-4">
                  <CapacityPanel estimates={resolveCapacity(scenario, state.selections)} />
                  <MetricsPanel metrics={metrics} />
                </div>
              </div>
            </div>
          </>
        ) : (
          score !== null && (
            <SummaryView
              scenario={scenario}
              selections={state.selections}
              score={score}
              onReset={handleReset}
            />
          )
        )}
      </main>
    </div>
  );
}
