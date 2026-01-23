# @axm-internal/git-db

SQLite-backed index of git commits and file changes for fast queries.

## Install

```bash
bun add @axm-internal/git-db
```

## Runtime setup

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

## Query usage

```ts
import { findCommitsByMessage, openNodeDb } from '@axm-internal/git-db';

const db = await openNodeDb('.git/git-db.sqlite');
const commits = await findCommitsByMessage(db, 'feat');
```

Conventional commits note:
- The package name inside `feat(scope): ...` is the **scope**. Use the same scope text when doing message-based queries for a package.
- Example: if commits are written as `feat(cli-kit): add meta helpers`, then `cli-kit` is the scope to search for.

## CLI

```bash
git-db init --db .git/git-db.sqlite
git-db update --db .git/git-db.sqlite
git-db query --db .git/git-db.sqlite --message feat
```

## Notes

- Source-first, buildless package (Bun).
- Entry point: `src/index.ts`.
- Indexing APIs are currently internal; the public surface focuses on opening the DB and querying indexed data.
