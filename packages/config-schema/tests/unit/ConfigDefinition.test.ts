import { afterEach, describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';
import { ConfigDefinition, env } from '../../src';
import { walkSchema } from '../../src/internal/walkSchema';

const writeEnv = (dir: string, file: string, contents: string) => {
    fs.writeFileSync(path.join(dir, file), contents);
};

describe('ConfigDefinition', () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    it('boots and returns RuntimeConfig with parsed values', () => {
        const schema = z.object({
            port: env('PORT', z.coerce.number().default(3000)),
        });
        const tree = walkSchema(schema);
        const def = new ConfigDefinition(schema, tree);

        const runtime = def.boot();
        expect(runtime.get()).toEqual({ port: 3000 });
    });

    it('formats Zod errors through formatError', () => {
        const schema = z.object({
            port: env('PORT', z.coerce.number().min(1000)),
        });
        const tree = walkSchema(schema);
        const def = new ConfigDefinition(schema, tree);

        process.env.PORT = '1';

        expect(() => def.boot()).toThrow('ConfigError: invalid configuration');
    });

    it('loads .env and .env.{NODE_ENV} when envDir is provided', () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'config-schema-'));
        writeEnv(dir, '.env', 'PORT=3000\n');
        writeEnv(dir, '.env.test', 'PORT=4000\n');

        process.env.NODE_ENV = 'test';

        const schema = z.object({
            port: env('PORT', z.coerce.number()),
        });
        const tree = walkSchema(schema);
        const def = new ConfigDefinition(schema, tree);

        const runtime = def.boot({ envDir: dir });
        expect(runtime.get().port).toBe(4000);
    });
});
