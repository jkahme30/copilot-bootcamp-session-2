# Coding Guidelines for TODO App

This document summarizes the coding style, formatting, and quality principles for the project. All contributors should follow these guidelines to ensure maintainable, readable, and reliable code.

## General Principles
- **Consistency**: Use a consistent style throughout the codebase. Follow established conventions for naming, indentation, and structure.
- **Readability**: Write code that is easy to read and understand. Prefer clarity over cleverness.
- **DRY Principle**: "Don't Repeat Yourself"—avoid duplicating logic or code. Use functions, components, and utilities to share behavior.
- **Small Functions**: Break logic into small, focused functions and components. Each should do one thing well.
- **Single Responsibility**: Each module, function, or component should have a clear, single purpose.
- **Fail Fast**: Validate inputs and fail early with clear errors.

## Formatting Rules
- Use 2 spaces for indentation (no tabs).
- Limit lines to 100 characters where practical.
- Use trailing commas in multi-line objects, arrays, and imports.
- Prefer single quotes for strings in JS/TS, except in JSON files.
- Place opening braces on the same line as the statement.
- Add a blank line between top-level declarations and after import blocks.

## Import Organization
- Group imports: external libraries first, then internal modules, then styles/assets.
- Sort imports alphabetically within each group.
- Avoid unused imports; remove them as soon as possible.
- Use absolute imports for top-level modules when supported.

## Linter & Formatter Usage
- Use ESLint for JavaScript/TypeScript linting. Follow the recommended or project-specific config.
- Use Prettier for automatic code formatting. Run it before every commit.
- Fix all linter errors and warnings before merging code.

## Best Practices
- Prefer pure functions and stateless components where possible.
- Use descriptive names for variables, functions, and components.
- Avoid magic numbers and hard-coded values; use constants or config.
- Write comments for complex logic, but avoid redundant comments.
- Document public APIs and exported functions with JSDoc or TypeScript types.
- Use error boundaries and try/catch for error handling in React and Node.
- Avoid deep nesting; refactor complex logic into smaller units.
- Prefer immutability for state and data structures.

## Testing Expectations
- All new features must include appropriate unit and integration tests.
- Tests should be deterministic, maintainable, and easy to update.
- Use mocks and fixtures for external dependencies.
- Run tests locally before pushing code.

## Commit Messages
- Use clear, concise commit messages describing what changed and why.
- Reference issues or PRs when relevant.
- Use present tense ("Add feature" not "Added feature").

## Code Review
- All code must be reviewed before merging.
- Address review comments promptly and respectfully.
- Ask for clarification if feedback is unclear.

## Accessibility & Internationalization
- Follow accessibility best practices (see UI guidelines).
- Write code that supports localization and RTL layouts where possible.

## Automation & CI
- Use automated tools for linting, formatting, and testing in CI.
- Do not merge code with failing checks.

## Summary
Following these guidelines helps keep the codebase healthy, maintainable, and welcoming for all contributors. If in doubt, ask for feedback or refer to the project's documentation.
