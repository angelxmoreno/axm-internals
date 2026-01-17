import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { CliApp } from '../../src/CliApp';
import { createCommandDefinition } from '../../src/createCommandDefinition';

describe('CliApp', () => {
    it('passes parsed args and options to the command action', async () => {
        const originalArgv = process.argv;
        process.argv = ['bun', 'script', 'hello', 'bob', '--yell'];

        let received: unknown;

        try {
            const helloCommand = createCommandDefinition({
                name: 'hello',
                description: 'says hello',
                argsSchema: z.object({
                    name: z.string().default('World'),
                }),
                optionsSchema: z.object({
                    yell: z.boolean().default(false),
                }),
                action: async (ctx) => {
                    received = ctx;
                },
            });

            const app = new CliApp({
                config: { name: 'test-cli' },
                options: { commandDefinitions: [helloCommand], pretty: false },
            });

            await app.start();

            const ctx = received as { args: unknown; options: unknown; container?: unknown };
            expect(ctx.args).toEqual({ name: 'bob' });
            expect(ctx.options).toEqual({ yell: true });
            expect(ctx.container).toBeDefined();
        } finally {
            process.argv = originalArgv;
        }
    });
});
