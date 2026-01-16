import { z } from 'zod';
import { CommandContextSchema } from './CommandContextSchema';

export const CommandActionSchema = <A, O>(
    argsSchema: z.ZodType<A> = z.unknown() as z.ZodType<A>,
    optionsSchema: z.ZodType<O> = z.unknown() as z.ZodType<O>
) =>
    z.function({
        input: z.tuple([CommandContextSchema(argsSchema, optionsSchema)]),
        output: z.promise(z.void()),
    });

export type CommandAction<A, O> = z.infer<ReturnType<typeof CommandActionSchema<A, O>>>;
