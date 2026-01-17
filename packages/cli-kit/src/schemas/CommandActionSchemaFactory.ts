import { z } from 'zod';
import { CommandContextSchemaFactory } from './CommandContextSchemaFactory';

export const CommandActionSchemaFactory = (
    argsSchema: z.ZodObject<z.ZodRawShape> = z.object({}),
    optionsSchema: z.ZodObject<z.ZodRawShape> = z.object({})
) =>
    z.function({
        input: z.tuple([CommandContextSchemaFactory(argsSchema, optionsSchema)]),
        output: z.promise(z.void()),
    });

export type CommandAction = z.infer<ReturnType<typeof CommandActionSchemaFactory>>;
