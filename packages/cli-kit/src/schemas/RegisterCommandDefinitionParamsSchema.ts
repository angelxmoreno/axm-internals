import { Command } from 'commander';
import { z } from 'zod';
import { ContainerSchema } from '../interfaces/ContainerInterface';
import { CommandDefinitionSchemaFactory } from './CommandDefinitionSchemaFactory';

export const RegisterCommandDefinitionParamsSchema = z.object({
    program: z.instanceof(Command),
    definition: CommandDefinitionSchemaFactory(),
    container: ContainerSchema,
});

export type RegisterCommandDefinitionParams = z.infer<typeof RegisterCommandDefinitionParamsSchema>;
