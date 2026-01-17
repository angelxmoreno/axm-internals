import { z } from 'zod';
import { ContainerSchema } from '../interfaces/ContainerInterface';

export const CommandContextSchemaFactory = (
    argsSchema: z.ZodObject<z.ZodRawShape> = z.object({}),
    optionsSchema: z.ZodObject<z.ZodRawShape> = z.object({})
) =>
    z.object({
        args: argsSchema,
        options: optionsSchema,
        container: ContainerSchema,
    });

export type CommandContext = z.infer<ReturnType<typeof CommandContextSchemaFactory>>;
