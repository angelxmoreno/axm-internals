#!/usr/bin/env bun
import { CliApp } from '@axm-internal/cli-kit';
import { promptRunnerCommands } from './commands/prompt-runners';

const cliApp = new CliApp({
    config: {
        name: 'repo-cli',
        description: 'Run monorepo CLI workflows and automation tasks.',
        version: '0.2.0',
    },
    options: {
        pretty: true,
        commandDefinitions: [...promptRunnerCommands],
    },
});
const exitCode = await cliApp.start();
process.exit(exitCode);
