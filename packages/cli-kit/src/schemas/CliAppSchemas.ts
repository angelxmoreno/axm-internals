import { PinoInstanceSchema } from '@axm-internal/zod-helpers';
import { z } from 'zod';
import { ContainerSchema, InjectionTokenSchema } from '../interfaces/ContainerInterface';
import { CommandDefinitionSchemaFactory } from './CommandDefinitionSchemaFactory';

export const CliAppOptionsSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    version: z.string().optional(),
    pretty: z.boolean().optional(),
});

export const CliAppParamsSchema = z.object({
    container: ContainerSchema.optional(),
    commands: z.array(CommandDefinitionSchemaFactory()).optional(),
    logger: PinoInstanceSchema.optional(),
    loggerAliases: z.array(InjectionTokenSchema).optional(),
});

export type CliAppOptions = z.infer<typeof CliAppOptionsSchema>;
export type CliAppParams = CliAppOptions & z.infer<typeof CliAppParamsSchema>;
