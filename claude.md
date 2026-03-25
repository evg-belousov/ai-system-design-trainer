# Project Rules

## SDLC Process

All tasks MUST follow the Software Development Life Cycle. No code is written until the preceding stages are completed and their artifacts are approved.

### Stages

#### 1. Requirements Definition
- Gather and document functional and non-functional requirements.
- Clarify ambiguities with the user via AskUserQuestion before proceeding.
- **Artifact:** `docs/sdlc/<task-id>/01-requirements.md`

#### 2. Planning
- Break down requirements into scope, milestones, risks, and dependencies.
- Define acceptance criteria for each requirement.
- **Artifact:** `docs/sdlc/<task-id>/02-planning.md`

#### 3. Architecture Selection & Approval
- Propose architectural approach: components, data flow, technology choices.
- Present alternatives with trade-offs.
- Wait for user approval before proceeding.
- **Artifact:** `docs/sdlc/<task-id>/03-architecture.md`

#### 4. Test Writing (TDD)
- Write tests BEFORE implementation code.
- Cover unit tests for each component and edge cases.
- Tests must initially fail (red phase).
- **Artifact:** `docs/sdlc/<task-id>/04-test-plan.md` (test strategy and coverage map)

#### 5. Task Breakdown
- Split implementation into granular tasks using TaskCreate.
- **Rule: each task modifies no more than 1 file.**
- Tasks must have clear subject, description, and dependencies (blockedBy/blocks).
- **Artifact:** `docs/sdlc/<task-id>/05-tasks.md` (task list with file mapping)

#### 6. Implementation
- Write code task-by-task, following the task breakdown order.
- Each task: mark in_progress → implement → run tests → mark completed.
- All tests from stage 4 must pass (green phase).
- Refactor only within scope (refactor phase).

#### 7. E2E Testing
- Run end-to-end tests covering full user scenarios.
- Document test results and any issues found.
- **Artifact:** `docs/sdlc/<task-id>/06-e2e-results.md`

### Artifact Structure

```
docs/
  sdlc/
    <task-id>/
      01-requirements.md
      02-planning.md
      03-architecture.md
      04-test-plan.md
      05-tasks.md
      06-e2e-results.md
```

### Rules

- Never skip stages. Each stage produces an artifact before the next begins.
- Never modify more than 1 file per task during implementation.
- Tests are written before code (TDD: red → green → refactor).
- Architecture must be explicitly approved by the user.
- All artifacts are saved in `docs/sdlc/<task-id>/` relative to project root.
