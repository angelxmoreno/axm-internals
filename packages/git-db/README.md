# @axm-internal/git-db

SQLite-backed index of git commits and file changes.

## Usage

### Node

```ts
import { openNodeDb } from '@axm-internal/git-db';

const db = await openNodeDb('.git/git-db.sqlite');
```

### Bun

```ts
import { openBunDb } from '@axm-internal/git-db';

const db = await openBunDb('.git/git-db.sqlite');
```

### Bun (worker)

```ts
import { openBunWorkerDb } from '@axm-internal/git-db';

const db = await openBunWorkerDb('.git/git-db.sqlite');
```

Git commit history cached in SQLite for fast queries

## Install

```bash
bun add @axm-internal/git-db
```

## Usage

```ts
import { example } from "@axm-internal/git-db";

example();
```

## Notes

- Source-first, buildless package (Bun).
- Entry point: `src/index.ts`.
