import { z } from 'zod';
import { CommandActionSchema } from './CommandActionSchema';

export const CommandDefinitionSchemaFactory = <A, O>(
    argsSchema: z.ZodType<A> = z.unknown() as z.ZodType<A>,
    optionsSchema: z.ZodType<O> = z.unknown() as z.ZodType<O>
) =>
    z.object({
        name: z.string(),
        description: z.string(),
        arguments: z
            .array(
                z.object({
                    name: z.string(),
                    description: z.string().optional(),
                    defaultValue: z.unknown().optional(),
                })
            )
            .optional(),
        options: z
            .array(
                z.object({
                    flags: z.string(),
                    description: z.string().optional(),
                    defaultValue: z.union([z.string(), z.boolean(), z.array(z.string())]).optional(),
                })
            )
            .optional(),
        argsSchema: argsSchema.optional(),
        optionsSchema: optionsSchema.optional(),
        action: CommandActionSchema(argsSchema, optionsSchema),
    });

export type CommandDefinition<A, O> = z.infer<ReturnType<typeof CommandDefinitionSchemaFactory<A, O>>>;
