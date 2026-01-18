# @axm-internal/repo-cli

CLI task runner for this monorepo (prompt-driven workflows and other repo automation).

## Usage

```bash
bun dev prompt:checklist packages/zod-helpers
bun dev prompt:llms packages/zod-helpers
bun dev prompt:typedoc packages/zod-helpers
```

## Commands

- `prompt:checklist <package-path>` — Run the dev-complete checklist and write `checklist.md`.
- `prompt:llms <package-path>` — Generate or refresh `llms.txt`.
- `prompt:typedoc <package-path>` — Add or improve Typedoc/TSDoc docblocks.

## Docs

Generated documentation lives in `docs/` and can be updated with:

```bash
bun run docs
```
