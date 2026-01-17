import { PinoInstanceSchema } from '@axm-internal/zod-helpers';
import { z } from 'zod';
import { ContainerSchema, InjectionTokenSchema } from '../interfaces/ContainerInterface';
import type { CommandDefinition } from './CommandDefinitionSchemaFactory';

export const CliConfigSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    version: z.string().optional(),
});

export const CliOptionsSchema = z.object({
    pretty: z.boolean().default(true),
    container: ContainerSchema.optional(),
    commandDefinitions: z.array(z.custom<CommandDefinition>()).optional(),
    logger: PinoInstanceSchema.optional(),
    loggerAliases: z.array(InjectionTokenSchema).optional(),
    onError: z
        .function({
            input: z.tuple([z.instanceof(Error)]),
            output: z.void(),
        })
        .optional(),
    onExit: z
        .function({
            input: z.tuple([z.number(), z.instanceof(Error).optional()]),
            output: z.void(),
        })
        .optional(),
});

export const CliAppParamsSchema = z.object({
    config: CliConfigSchema,
    options: CliOptionsSchema,
});

export type CliConfig = z.infer<typeof CliConfigSchema>;
export type CliOptions = z.infer<typeof CliOptionsSchema>;
export type CliAppParams = z.infer<typeof CliAppParamsSchema>;
