import { Command } from 'commander';
import pino, { type Logger } from 'pino';
import pinoPretty from 'pino-pretty';
import { CliLogger } from './constants';
import { InMemoryContainer } from './containers/InMemoryContainer';
import type { ContainerInterface } from './interfaces/ContainerInterface';
import { registerCommandDefinition } from './registerCommandDefinition';
import { type CliAppParams, CliAppParamsSchema, type CliConfig } from './schemas/CliAppSchemas';
import type { CommandDefinition } from './schemas/CommandDefinitionSchemaFactory';

export class CliApp {
    protected program: Command;
    protected config: CliConfig;
    protected container: ContainerInterface;
    protected commandDefinitions: CommandDefinition[];
    protected logger: Logger;
    protected initialized = false;
    protected lastError?: Error;
    protected onError?: (error: Error) => void;
    protected onExit?: (code: number, error?: Error) => void;

    constructor(params: CliAppParams) {
        const { config, options } = CliAppParamsSchema.parse(params);
        const { commandDefinitions = [], container, logger, loggerAliases, pretty, onError, onExit } = options;

        this.config = config;
        this.commandDefinitions = commandDefinitions;
        this.container = container ?? new InMemoryContainer();
        this.logger = this.createLogger(config.name, pretty, logger);
        this.onError = onError;
        this.onExit = onExit;
        const tokens = [CliLogger, ...(loggerAliases ?? [])];
        for (const token of tokens) {
            this.container.registerInstance(token, this.logger);
        }
        this.program = new Command();
    }

    protected createLogger(appName: string, pretty: boolean, baseLogger?: Logger): Logger {
        const logger = baseLogger ?? pino(pretty ? pinoPretty() : undefined);
        return logger.child({ module: appName });
    }

    getProgram(): Command {
        return this.program;
    }

    getLastError(): Error | undefined {
        return this.lastError;
    }

    clearLastError(): void {
        this.lastError = undefined;
    }

    setCommands(commandDefinitions: CommandDefinition[]) {
        this.commandDefinitions = commandDefinitions;
    }

    addCommand(commandDefinition: CommandDefinition) {
        this.commandDefinitions.push(commandDefinition);
    }

    protected registerCommand(commandDefinition: CommandDefinition) {
        registerCommandDefinition({
            program: this.program,
            definition: commandDefinition,
            container: this.container,
        });
    }

    protected init() {
        this.program.name(this.config.name).option('-d, --debug', 'output extra debugging information');

        if (this.config.description) {
            this.program.description(this.config.description);
        }

        if (this.config.version) {
            this.program.version(this.config.version);
        }

        this.program.hook('preAction', () => {
            if (this.program.opts().debug) {
                this.container.resolve(CliLogger).level = 'debug';
            }
        });

        for (const command of this.commandDefinitions) {
            this.registerCommand(command);
        }

        // Error handling
        this.program.exitOverride();
        this.initialized = true;
    }

    async start(): Promise<number> {
        if (!this.initialized) {
            this.init();
        }

        try {
            await this.program.parseAsync(process.argv);
            this.lastError = undefined;
            this.onExit?.(0);
            return 0;
        } catch (error: unknown) {
            // Resolve logger here, after parseAsync/preAction has run
            const logger = this.container.resolve(CliLogger);
            const normalizedError = error instanceof Error ? error : new Error(String(error));
            this.lastError = normalizedError;
            this.onError?.(normalizedError);

            if (error instanceof Error && 'code' in error) {
                if (error.code === 'commander.help' || error.code === 'commander.helpDisplayed') {
                    this.onExit?.(0, normalizedError);
                    return 0;
                }
                if (error.code === 'commander.version') {
                    this.onExit?.(0, normalizedError);
                    return 0;
                }
                if (String(error.code).startsWith('commander.')) {
                    this.onExit?.(1, normalizedError);
                    return 1;
                }
            }

            logger.error(error, '❌ CLI Error:');
            this.onExit?.(1, normalizedError);
            return 1;
        }
    }
}
