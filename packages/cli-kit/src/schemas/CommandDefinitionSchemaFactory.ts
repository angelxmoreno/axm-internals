import { z } from 'zod';
import { CommandActionSchemaFactory } from './CommandActionSchemaFactory';

const ZodObjectSchema = z.custom<z.ZodObject<z.ZodRawShape>>((value) => value instanceof z.ZodObject);

export const CommandDefinitionSchemaFactory = (
    argsSchema: z.ZodObject<z.ZodRawShape> = z.object({}),
    optionsSchema: z.ZodObject<z.ZodRawShape> = z.object({})
) =>
    z.object({
        name: z.string(),
        description: z.string(),
        argsSchema: ZodObjectSchema.optional(),
        optionsSchema: ZodObjectSchema.optional(),
        argPositions: z.array(z.string()).optional(),
        action: CommandActionSchemaFactory(argsSchema, optionsSchema),
    });

export type CommandDefinition = z.infer<ReturnType<typeof CommandDefinitionSchemaFactory>>;
