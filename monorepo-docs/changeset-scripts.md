# Changeset Scripts Plan

This document defines the work needed to make Changesets support manual, per-package releases with per-package and global changelogs while preserving the option to automate later. It describes the current state, the target state, and the scripts we plan to build under `apps/repo-cli`.

## What We Have Today

- Changesets is installed and configured in `.changeset/config.json`.
- Release workflow runs on every push to `main` and runs:
  - `bunx changeset version`
  - `bunx changeset publish`
- This means:
  - If changesets exist, versions/changelogs are generated and publish occurs.
  - If no changesets exist, already-published packages do not release; unpublished packages may be published.
- No per-package `CHANGELOG.md` files currently exist in the repo.
- No monorepo `CHANGELOG.md` exists.
- There is no tooling to aggregate or validate changesets from commit history.

## What We Want

- Manual releases per package (operator-controlled).
- Per-package changelogs (`packages/<name>/CHANGELOG.md`).
- A monorepo-wide `CHANGELOG.md`.
- Changelogs for all packages, including non-publishable packages.
- Ability to switch to automated releases later without re-architecting.
- Tag format stays as-is (e.g., `@axm-internal/cli-kit@0.1.0`).
- One release PR per package (when we later automate).

## Proposed Script Set (apps/repo-cli)

These scripts are intended to be implemented in `apps/repo-cli`. Names are suggestions and can be adjusted.

### 1) `changeset:status`

Purpose:
- Summarize pending changesets and which packages will be released.

Inputs:
- Optional package filter (single package).

Output:
- List of packages with pending changesets and highest bump.
- Whether any unpublished packages would be published by the current workflow.

Notes:
- This is informational only.

### 2) `changeset:scaffold`

Purpose:
- Create a new changeset for a specific package with a guided prompt.

Inputs:
- Package name (required).
- Bump type (patch/minor/major).
- Summary text.

Output:
- A single `.changeset/*.md` file.

Notes:
- This replaces manual `bunx changeset` when focused on a single package.

### 3) `changeset:from-commits:package`

Purpose:
- Generate a single changeset for a specific package by scanning commits from the last package tag to `HEAD`.

Inputs:
- Package name (required).
- Optional production branch (default `main`).
- Optional commit range override.
- Optional conventional commit scope mapping.

Output:
- One `.changeset/*.md` for that package.

Rules:
- Commit selection is based on:
  - Files under `packages/<name>/`, and/or
  - Conventional commit scope matching the package name.
- Bump is determined by:
  - `feat` -> minor
  - `fix` -> patch
  - `!` or `BREAKING CHANGE` -> major
- Summary concatenates or groups commit messages.

Notes:
- Only for a single package; not intended for global changeset generation.

### 4) `changeset:validate`

Purpose:
- Ensure changesets match repository expectations before release.

Checks:
- Every changeset references valid package names.
- Each package has at most one pending changeset (if we want to enforce one-per-package).
- Changesets exist for changes in `packages/<name>` if policy requires.
- No changeset uses `none` unless explicitly allowed.

Output:
- Exit non-zero on validation failure.

### 5) `changeset:version:manual`

Purpose:
- Run `changeset version` plus changelog generation steps in a controlled/manual fashion.

Behavior:
- Runs `bunx changeset version`.
- Ensures per-package `CHANGELOG.md` files are created/updated.
- Appends to root `CHANGELOG.md` using the new changeset entries.

Notes:
- This is the manual release preparation step.

### 6) `changeset:publish:manual`

Purpose:
- Publish only the packages affected by pending changesets.

Behavior:
- Runs `bunx changeset publish`.
- Optionally supports a package filter to publish only a single package.

Notes:
- Keeps manual control in place.

## Workflow Implications

Short-term (manual):
- CI should not auto-publish on every `main` merge.
- Releases occur when a maintainer runs `changeset:version:manual` and `changeset:publish:manual`.

Long-term (automated):
- Re-enable automatic release workflows using the same scripts.
- Optionally open release PRs per package as a stepping stone.

## Policy (Draft)

- `none` changesets are allowed for docs-only updates.
- Root `CHANGELOG.md` should be grouped by package.

## Open Questions

- Should `changeset:validate` be required in `bun validate`?
- Do we want to enforce "one changeset per package per release window"?
