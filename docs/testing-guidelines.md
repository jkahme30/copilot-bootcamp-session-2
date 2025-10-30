# Testing Guidelines for TODO App

This document describes the testing principles and expectations for the TODO application. The goal is to ensure features are reliable, maintainable, accessible, and safe to change.

## High-level principles
- Test early and often: Developers should write tests as they implement features (TDD encouraged where practical).
- Fast feedback: Keep unit tests fast so they run locally and in CI on every push.
- Maintainability: Tests should be clear, deterministic, and easy to update as behavior evolves.
- Ownership: Every feature author is responsible for adding and maintaining its tests.

## Types of tests (required)
1. Unit tests
   - Scope: Small, focused tests for individual functions, reducers, hooks, and pure components.
   - Tools: Jest + testing-library for JS/React (or project-preferred equivalents).
   - Characteristics: Fast (<20ms each ideally), no network or DB access, use mocks for external dependencies.

2. Integration tests
   - Scope: Test interactions between multiple modules (e.g., component + store + API layer mocked), and verify important flows.
   - Tools: Jest + React Testing Library; lightweight mocked API layers.
   - Characteristics: Slower than unit tests but still run in CI; should exercise DOM interactions and state updates.

3. End-to-end (E2E) tests
   - Scope: Validate full user flows against a running app/environment (create task, edit, complete, delete, filters, etc.).
   - Tools: Playwright or Cypress (team decision). Prefer Playwright for cross-browser testing by default.
   - Characteristics: Run in CI on schedules and blocking pipelines for major branches; keep E2E suite focused on high-value user journeys to limit flakiness and runtime.

4. Accessibility tests
   - Scope: Automated checks for WCAG issues on key pages and components (task editor, task list, dialogs).
   - Tools: axe (jest-axe for unit/integration checks and axe-playwright for E2E checks).
   - Characteristics: Fail build if critical accessibility regressions are introduced.

5. Performance & regression tests (optional / targeted)
   - Scope: Track rendering perf for large task lists and critical interactions (virtualization effectiveness).
   - Tools: Lighthouse, custom perf harnesses, or lightweight scripts measuring render times.
   - Characteristics: Run on demand or in scheduled CI jobs for major releases.

## Test quality expectations
- All new features should include unit tests and at least one integration test for the main flow. Critical user journeys must have E2E coverage.
- Tests must be deterministic and avoid timing-dependent assertions; prefer event-driven assertions (waitFor, findBy) over arbitrary timeouts.
- Mock external services (auth, third-party APIs) in unit/integration tests. Use a controlled test fixture/environment for E2E.
- Keep test fixtures small and explicit. Avoid large, brittle fixture objects.
- Tests should assert meaningful behavior (state changes, side effects, UI updates) rather than implementation details.

## CI and coverage
- Run unit and integration tests on every push/PR. Run the E2E suite on PRs for major branches or via scheduled jobs depending on time budget.
- Define a minimum coverage target for lines/branches/functions (e.g., 80% coverage across the repo) and track it; lower thresholds can be set per package with justification.
- Use coverage artifacts in CI to identify hotspots. Coverage is a guide — focus on meaningful tests rather than chasing numbers alone.

## Flaky tests and reliability
- Treat flaky tests as defects: flaky tests must be fixed or quarantined quickly (use flaky-test labels or a quarantine folder with clear notes).
- Keep E2E suites focused to reduce surface area for flakiness (limit to essential flows).
- Capture logs, screenshots, and traces on CI failures to make triage faster.

## Test organization & naming
- Mirror the source file structure when possible (co-locate tests with components or under `__tests__`).
- Name tests and suites clearly (e.g., `TaskEditor.spec.js` with `describe('TaskEditor')` and `it('saves edited title and updates list')`).
- Use descriptive test names; avoid numeric or vague names.

## Test data and fixtures
- Use factories or builders to create test data rather than large static JSON blobs.
- Provide a small set of canonical fixtures (e.g., `taskFactory`) that can be extended per test.
- Keep fixtures deterministic and easy to read.

## Mocking & dependency boundaries
- Mock network calls in unit/integration tests. For E2E tests prefer a test backend or a deterministic mock server (e.g., MSW for frontend-E2E or a dedicated test API service).
- Avoid over-mocking behavior that hides real integration issues for critical flows.

## PR requirements and review
- Every PR that adds behavior must include tests for the new behavior and update or add fixtures as needed.
- Tests are part of the review: reviewers should run tests locally for changes that affect core flows.
- Add a short note in PR descriptions about where tests live and how to run them locally if non-obvious.

## Tooling suggestions
- Unit/Integration: Jest + React Testing Library + jest-axe for accessibility checks.
- E2E: Playwright (recommended) or Cypress for cross-browser user-flow testing.
- Mocking: MSW (Mock Service Worker) for predictable API mocks in integration/E2E where appropriate.
- CI: GitHub Actions configured to run unit/integration on push, and E2E on scheduled runs or PRs for major branches.

## Handling accessibility and internationalization tests
- Include `axe` checks in key component tests and at least one E2E run verifying accessible task editor and list.
- Add simple RTL smoke tests to ensure components can render and layout correctly in RTL mode.

## Documentation and training
- Document how to run tests locally (package scripts) and common troubleshooting steps in `README.md` of each package (`packages/frontend/README.md`, `packages/backend/README.md`).
- Provide a short guide for writing tests, common utilities (factories, custom render helpers), and anti-patterns to avoid.

## Acceptance criteria summary
- Unit and integration tests run on every PR and must be included with new features.
- E2E tests cover critical user journeys and run in CI on a defined cadence.
- Automated accessibility checks run and block merges for critical regressions.
- Tests are deterministic, maintainable, and the team treats flaky tests as first-class issues to fix.

## Next steps
- Add test scripts to `package.json` in the root and packages if not present.
- Add a basic testing setup (Jest config, RTL setup, example test) in `packages/frontend` and `packages/backend`.
- Configure GitHub Actions to run tests and publish coverage artifacts.
