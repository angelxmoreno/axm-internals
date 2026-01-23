#!/usr/bin/env bun
import { CliApp } from '@axm-internal/cli-kit';
import { initCommand, queryCommand, updateCommand } from './commands';

const cliApp = new CliApp({
    config: {
        name: 'git-db',
        description: 'SQLite-backed git commit index.',
        version: process.env.npm_package_version ?? '0.1.0',
    },
    options: {
        pretty: true,
        commandDefinitions: [initCommand, updateCommand, queryCommand],
    },
});
const exitCode = await cliApp.start();
process.exit(exitCode);
