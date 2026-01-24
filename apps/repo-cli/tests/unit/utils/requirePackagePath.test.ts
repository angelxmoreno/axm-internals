import { describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import { findRepoRoot } from '../../../src/utils/findRepoRoot';
import { requirePackagePath } from '../../../src/utils/requirePackagePath';

describe('requirePackagePath', () => {
    it('throws when no package path is provided', () => {
        expect(() => requirePackagePath(undefined)).toThrow('Usage: <script> <package-path>');
    });

    it('throws when the path does not exist', () => {
        expect(() => requirePackagePath('packages/does-not-exist')).toThrow('Package directory not found:');
    });

    it('throws when the path is not under packages/ or apps/', () => {
        expect(() => requirePackagePath('monorepo-docs')).toThrow(
            'Package path must start with "packages/" or "apps/".'
        );
    });

    it('throws when the package exists but is not in the allowlist', () => {
        const repoRoot = findRepoRoot(process.cwd());
        const tempDir = path.join(repoRoot, 'packages', 'temp-not-allowed');
        fs.mkdirSync(tempDir, { recursive: true });

        try {
            expect(() => requirePackagePath('packages/temp-not-allowed')).toThrow(
                'Unknown package or app "packages/temp-not-allowed".'
            );
        } finally {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    it('throws when the path escapes the repo root', () => {
        expect(() => requirePackagePath('packages/../.git')).toThrow('Package path must stay within the repo root.');
    });

    it('returns the resolved package path for a valid package', () => {
        const result = requirePackagePath('packages/cli-kit');
        expect(result.packageName).toBe('packages/cli-kit');
        expect(result.packageFullPath).toBe(path.resolve(result.packageFullPath));
    });
});
