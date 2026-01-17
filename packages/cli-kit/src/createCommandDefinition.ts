import type { z } from 'zod';
import type { ContainerInterface } from './interfaces/ContainerInterface';
import type { CommandDefinition } from './schemas/CommandDefinitionSchemaFactory';

export type CommandContextForSchemas<
    ArgsSchema extends z.ZodObject<z.ZodRawShape>,
    OptionsSchema extends z.ZodObject<z.ZodRawShape>,
> = {
    args: z.infer<ArgsSchema>;
    options: z.infer<OptionsSchema>;
    container: ContainerInterface;
};

export function createCommandDefinition<
    ArgsSchema extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
    OptionsSchema extends z.ZodObject<z.ZodRawShape> = z.ZodObject<z.ZodRawShape>,
>(definition: {
    name: string;
    description: string;
    argsSchema?: ArgsSchema;
    optionsSchema?: OptionsSchema;
    argPositions?: string[];
    action: (ctx: CommandContextForSchemas<ArgsSchema, OptionsSchema>) => Promise<void>;
}): CommandDefinition {
    return definition as CommandDefinition;
}
