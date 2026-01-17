import { Command } from 'commander';
import { z } from 'zod';
import { ContainerSchema } from '../interfaces/ContainerInterface';
import type { CommandDefinition } from './CommandDefinitionSchemaFactory';

export const RegisterCommandDefinitionParamsSchema = z.object({
    program: z.instanceof(Command),
    definition: z.custom<CommandDefinition>(),
    container: ContainerSchema,
});

export type RegisterCommandDefinitionParams = z.infer<typeof RegisterCommandDefinitionParamsSchema>;
