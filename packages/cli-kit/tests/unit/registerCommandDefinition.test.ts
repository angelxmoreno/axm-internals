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
                arguments: [{ name: '<first>' }, { name: '<last>' }],
                options: [{ flags: '-d, --debug', description: 'enable debug' }],
                argsSchema: z.tuple([z.string(), z.string()]),
                optionsSchema: z.object({ debug: z.boolean().optional() }),
                action: async (ctx) => {
                    received = ctx;
                },
            },
        });

        await program.parseAsync(['hello', 'Ada', 'Lovelace', '--debug'], { from: 'user' });

        expect(received).toEqual({
            args: ['Ada', 'Lovelace'],
            options: { debug: true },
            container,
        });
    });

    it('passes raw args and options when schemas are not provided', async () => {
        const program = new Command();
        const container = new InMemoryContainer();
        let received: unknown;

        registerCommandDefinition({
            program,
            container,
            definition: {
                name: 'echo',
                description: 'echoes input',
                arguments: [{ name: '<first>' }, { name: '<second>' }],
                action: async (ctx) => {
                    received = ctx;
                },
            },
        });

        await program.parseAsync(['echo', 'one', 'two'], { from: 'user' });

        expect(received).toEqual({
            args: ['one', 'two'],
            options: {},
            container,
        });
    });
});
