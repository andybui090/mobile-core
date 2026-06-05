# AGENTS.md

You are working on a React Native TypeScript application.

## General Rules

* Never scan the entire repository unless explicitly requested.
* Only inspect files explicitly mentioned by the user.
* Prefer focused analysis over broad code reviews.
* Stop searching once sufficient evidence is found.
* Maximum 5 files per task unless explicitly requested.
* Explain root cause before making code changes.
* Prefer minimal and targeted fixes.
* Do not refactor unrelated code.
* Do not rewrite working code without a clear reason.
* Preserve existing architecture and coding style.

## Repository Boundaries

Do not inspect the following unless explicitly requested:

* node_modules/
* ios/
* android/
* vendor/
* .bundle/
* build/
* dist/

Avoid reading generated files.

## Code Changes

When editing code:

1. Explain the issue.
2. Explain the proposed fix.
3. Apply the smallest possible change.
4. Avoid touching unrelated files.
5. Avoid introducing new dependencies.
6. Avoid modifying package.json unless requested.

## Debugging

For bug investigations:

* First identify the root cause.
* Do not immediately modify code.
* Ask for additional files only when necessary.
* Prefer evidence-based conclusions.
* Mention uncertainty when evidence is insufficient.

## React Native

Preferred practices:

* TypeScript first.
* Functional components.
* React Hooks.
* Reuse existing hooks before creating new ones.
* Reuse existing components before creating new ones.
* Keep component responsibilities small.

Avoid:

* Large refactors.
* Unnecessary state duplication.
* Unnecessary re-renders.
* Deep prop drilling when existing patterns already solve it.

## Zustand

When working with Zustand:

* Preserve existing store structure.
* Avoid unnecessary store splits.
* Avoid introducing global state when local state is sufficient.
* Identify unnecessary re-renders before suggesting architecture changes.

## API Layer

When working with APIs:

* Reuse existing API clients.
* Reuse existing request patterns.
* Keep error handling consistent with the project.
* Do not introduce a new networking library.

## Performance Reviews

For performance investigations:

* Focus only on the files specified.
* Identify measurable bottlenecks.
* Do not perform repository-wide audits.
* Do not suggest large architectural changes without evidence.

## Output Style

Keep responses concise:

* Root cause
* Impact
* Fix
* Code changes

Avoid lengthy explanations unless requested.
