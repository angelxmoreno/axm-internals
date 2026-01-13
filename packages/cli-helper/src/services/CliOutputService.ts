import chalk from 'chalk';

/**
 * Lightweight console output helper for CLI apps.
 *
 * @remarks
 * This service wraps stdout/stderr and process exits without external side effects beyond logging.
 */
export class CliOutputService {
    /**
     * Log a plain message to stdout.
     *
     * @param message - The message to print.
     * @returns Nothing.
     * @remarks
     * Use for standard, non-styled output.
     */
    public log(message: string): void {
        console.log(message);
    }

    /**
     * Log a success message to stdout with green formatting.
     *
     * @param message - The success message to print.
     * @returns Nothing.
     * @remarks
     * Uses `chalk.green` to format the message.
     */
    public logSuccess(message: string): void {
        console.log(chalk.green(message));
    }

    /**
     * Log an error message to stderr.
     *
     * @param message - The error message to print.
     * @returns Nothing.
     * @remarks
     * Prefer this for error output to keep stderr separated.
     */
    public logError(message: string): void {
        console.error(message);
    }

    /**
     * Log a message and exit the process with the provided code.
     *
     * @param message - The message to print before exiting.
     * @param code - The process exit code. Defaults to 0.
     * @returns Nothing.
     * @remarks
     * This method terminates the process.
     */
    public logAndExit(message: string, code: number = 0): void {
        this.log(message);
        process.exit(code);
    }

    /**
     * Log an error message and exit the process with the provided code.
     *
     * @param message - The error message to print before exiting.
     * @param code - The process exit code. Defaults to 1.
     * @returns Nothing.
     * @remarks
     * This method terminates the process.
     */
    public errorAndExit(message: string, code: number = 1): void {
        this.logError(message);
        process.exit(code);
    }
}
