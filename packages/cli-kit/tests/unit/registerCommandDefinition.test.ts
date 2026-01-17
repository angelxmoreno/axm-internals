import { describe, expect, it } from 'bun:test';
import { Command } from 'commander';
import { z } from 'zod';
import { InMemoryContainer } from '../../src/containers/InMemoryContainer';
import { registerCommandDefinition } from '../../src/registerCommandDefinition';

describe('registerCommandDefinition', () => {
    it('parses args and options with schemas before calling action', async () => {
        const program = new Command();
        const container = new InMemoryContainer();
        let received: unknown;

        registerCommandDefinition({
            program,
            container,
            definition: {
                name: 'hello',
                description: 'says hello',
                argsSchema: z.object({
                    first: z.string(),
                    last: z.string(),
                }),
                argPositions: ['first', 'last'],
                optionsSchema: z.object({ debug: z.boolean().optional() }),
                action: async (ctx) => {
                    received = ctx;
                },
            },
        });

        await program.parseAsync(['hello', 'Ada', 'Lovelace', '--debug'], { from: 'user' });

        expect(received).toEqual({
            args: { first: 'Ada', last: 'Lovelace' },
            options: { debug: true },
            container,
        });
    });

    it('infers argPositions when a single arg is defined', async () => {
        const program = new Command();
        const container = new InMemoryContainer();
        let received: unknown;

        registerCommandDefinition({
            program,
            container,
            definition: {
                name: 'echo',
                description: 'echoes input',
                argsSchema: z.object({
                    message: z.string(),
                }),
                action: async (ctx) => {
                    received = ctx;
                },
            },
        });

        await program.parseAsync(['echo', 'hello'], { from: 'user' });

        expect(received).toEqual({
            args: { message: 'hello' },
            options: {},
            container,
        });
    });

    it('throws when multiple args are defined without argPositions', () => {
        const program = new Command();
        const container = new InMemoryContainer();

        expect(() =>
            registerCommandDefinition({
                program,
                container,
                definition: {
                    name: 'multi',
                    description: 'multi args',
                    argsSchema: z.object({
                        first: z.string(),
                        second: z.string(),
                    }),
                    action: async () => undefined,
                },
            })
        ).toThrow('argPositions is required when argsSchema has multiple keys.');
    });
});
