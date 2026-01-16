import type { z } from 'zod';
import {
    type RegisterCommandDefinitionParams,
    RegisterCommandDefinitionParamsSchema,
} from './schemas/RegisterCommandDefinitionParamsSchema';

export const registerCommandDefinition = (options: RegisterCommandDefinitionParams) => {
    const { program, definition, container } = RegisterCommandDefinitionParamsSchema.parse(options);

    const cmd = program.command(definition.name).description(definition.description);
    cmd.allowExcessArguments(true);

    if (definition.options) {
        for (const option of definition.options) {
            cmd.option(option.flags, option.description, option.defaultValue);
        }
    }

    if (definition.arguments) {
        for (const arg of definition.arguments) {
            cmd.argument(arg.name, arg.description, arg.defaultValue);
        }
    }

    cmd.action((...args: unknown[]) => {
        const commandArgs = args.slice(0, -2);
        const options = args.at(-2) as Record<string, unknown>;

        const argsSchema = definition.argsSchema as z.ZodTypeAny | undefined;
        const optionsSchema = definition.optionsSchema as z.ZodTypeAny | undefined;

        const parsedArgs = argsSchema ? argsSchema.parse(commandArgs) : commandArgs;
        const parsedOptions = optionsSchema ? optionsSchema.parse(options) : options;

        return definition.action({
            args: parsedArgs,
            options: parsedOptions,
            container,
        });
    });
};
