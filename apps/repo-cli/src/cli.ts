#!/usr/bin/env bun
import { CliApp } from '@axm-internal/cli-kit';
import { checklistCommand } from './commands/prompt-runners/checklistCommand';
import { llmsCommand } from './commands/prompt-runners/llmsCommand';
import { typedocCommand } from './commands/prompt-runners/typedocCommand';

const cliApp = new CliApp({
    config: {
        name: 'repo-cli',
        description: 'Run monorepo CLI workflows and automation tasks.',
        version: '0.2.0',
    },
    options: {
        pretty: true,
        commandDefinitions: [checklistCommand, llmsCommand, typedocCommand],
    },
});
const exitCode = await cliApp.start();
process.exit(exitCode);
