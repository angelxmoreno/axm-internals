import { z } from 'zod';
import { ContainerSchema } from '../interfaces/ContainerInterface';

export const CommandContextSchema = <A, O>(
    argsSchema: z.ZodType<A> = z.unknown() as z.ZodType<A>,
    optionsSchema: z.ZodType<O> = z.unknown() as z.ZodType<O>
) =>
    z.object({
        args: argsSchema.optional(),
        options: optionsSchema.optional(),
        container: ContainerSchema,
    });

export type CommandContext<A, O> = z.infer<ReturnType<typeof CommandContextSchema<A, O>>>;
