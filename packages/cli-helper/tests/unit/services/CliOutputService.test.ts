import { afterEach, describe, expect, it } from 'bun:test';
import chalk from 'chalk';
import { CliOutputService } from '../../../src';

describe('CliOutputService', () => {
    const service = new CliOutputService();

    const originalLog = console.log;
    const originalError = console.error;
    const originalExit = process.exit;

    afterEach(() => {
        console.log = originalLog;
        console.error = originalError;
        process.exit = originalExit;
    });

    it('logs a plain message', () => {
        const calls: string[] = [];
        console.log = (message: string) => {
            calls.push(message);
        };

        service.log('hello');

        expect(calls).toEqual(['hello']);
    });

    it('logs a success message in green', () => {
        const calls: string[] = [];
        console.log = (message: string) => {
            calls.push(message);
        };

        service.logSuccess('ok');

        expect(calls).toEqual([chalk.green('ok')]);
    });

    it('logs an error message to stderr', () => {
        const calls: string[] = [];
        console.error = (message: string) => {
            calls.push(message);
        };

        service.logError('boom');

        expect(calls).toEqual(['boom']);
    });

    it('logs and exits with default code', () => {
        const calls: string[] = [];
        const exitCodes: number[] = [];
        console.log = (message: string) => {
            calls.push(message);
        };
        process.exit = ((code?: number) => {
            exitCodes.push(code ?? 0);
            return undefined as never;
        }) as typeof process.exit;

        service.logAndExit('bye');

        expect(calls).toEqual(['bye']);
        expect(exitCodes).toEqual([0]);
    });

    it('logs and exits with provided code', () => {
        const calls: string[] = [];
        const exitCodes: number[] = [];
        console.log = (message: string) => {
            calls.push(message);
        };
        process.exit = ((code?: number) => {
            exitCodes.push(code ?? 0);
            return undefined as never;
        }) as typeof process.exit;

        service.logAndExit('bye', 2);

        expect(calls).toEqual(['bye']);
        expect(exitCodes).toEqual([2]);
    });

    it('logs error and exits with default code', () => {
        const calls: string[] = [];
        const exitCodes: number[] = [];
        console.error = (message: string) => {
            calls.push(message);
        };
        process.exit = ((code?: number) => {
            exitCodes.push(code ?? 1);
            return undefined as never;
        }) as typeof process.exit;

        service.errorAndExit('nope');

        expect(calls).toEqual(['nope']);
        expect(exitCodes).toEqual([1]);
    });

    it('logs error and exits with provided code', () => {
        const calls: string[] = [];
        const exitCodes: number[] = [];
        console.error = (message: string) => {
            calls.push(message);
        };
        process.exit = ((code?: number) => {
            exitCodes.push(code ?? 1);
            return undefined as never;
        }) as typeof process.exit;

        service.errorAndExit('nope', 3);

        expect(calls).toEqual(['nope']);
        expect(exitCodes).toEqual([3]);
    });
});
