import type { ZodType } from 'zod';

export function env<T extends ZodType>(name: string, schema: T): T {
    return schema.meta({ env: name });
}

export function autoEnv<T extends ZodType>(schema: T): T {
    return schema.meta({ env: 'auto' });
}
