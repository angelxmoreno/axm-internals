# CLI Runner Wrapper (Design)

Goal: a minimal wrapper around `execa` that feels as simple as `Bun.$`, supports optional streaming, and is easy to mock in tests.

## Requirements

- Simple API: `run(cmd, args?, { stream?: boolean })`.
- Optional streaming of stdout/stderr for long‑running commands.
- Safe default: avoid shell parsing by default.
- Test helper that replaces the runner with predictable outputs.

## Proposed API

```ts
type RunOptions = {
  stream?: boolean;
};

type RunResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

export async function run(
  cmd: string,
  args?: string[],
  options?: RunOptions
): Promise<RunResult>;
```

Optional convenience (secondary):

```ts
// Convenience for simple commands. Uses a shell, so it is opt‑in.
export async function runShell(commandLine: string, options?: RunOptions): Promise<RunResult>;
```

## Streaming Behavior

- If `stream: true`, attach listeners to `proc.stdout` and `proc.stderr` to pipe chunks to the terminal.
- Always return the buffered `stdout`/`stderr` in the result for programmatic use.
- If `stream: false` (default), do not attach listeners; return buffered output.

## Error Handling

- Use `execa(..., { reject: false })` and check `exitCode`.
- If `exitCode !== 0`, throw an error that includes `stderr` (or a generic message).
- Return `RunResult` when `exitCode === 0`.

## Why `run(cmd, args)` is the default

Passing `cmd` and `args` separately avoids shell parsing and quoting issues:

- **Spaces in paths**: `run('git', ['add', 'My Project/file.txt'])` works without quoting.
- **Glob expansion**: `run('rm', ['src/*.test.ts'])` does not expand `*` unless you opt in.
- **Injection risk**: user input in args is passed verbatim, not interpreted as shell syntax.
- **Literal characters**: `$`, `;`, `&`, `|`, `>` are not treated as shell operators.

When a single string is necessary, `runShell()` can be used explicitly.

## Testing Helper

Provide a small mock factory to avoid real process execution:

```ts
type MockRun = (result: RunResult) => typeof run;
```

Example:

```ts
const run = mockRun({ stdout: 'ok', stderr: '', exitCode: 0 });
const result = await run('git', ['status']);
```

Implementation idea:

- Create a `tests/helpers/mockRun.ts` that returns a function with the same signature as `run`.
- In tests, replace the real runner via module mocking (`mock.module`) or dependency injection.

## Adoption Plan (Later)

- Create `packages/tooling-config` entry for shared runner config if needed.
- Replace direct `execa`/`Bun.spawn` usage in repo scripts with the wrapper.
