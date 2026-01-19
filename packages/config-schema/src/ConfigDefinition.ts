import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';
import { buildRawConfig } from './internal/buildRawConfig';
import { formatError } from './internal/formatError';
import type { InternalNode } from './internal/types';
import { RuntimeConfig } from './RuntimeConfig';

export interface BootOptions {
    envDir?: string;
}

export class ConfigDefinition<T> {
    public readonly schema: ZodType<T>;
    public readonly tree: InternalNode;

    constructor(schema: ZodType<T>, tree: InternalNode) {
        this.schema = schema;
        this.tree = tree;
    }

    boot(options?: BootOptions): RuntimeConfig<T> {
        if (options?.envDir) {
            this.loadEnv(options.envDir);
        }

        const raw = buildRawConfig(this.tree);

        try {
            const parsed = this.schema.parse(raw);
            return new RuntimeConfig(parsed);
        } catch (err) {
            if (err instanceof ZodError) {
                throw formatError(err, this.tree);
            }
            throw err;
        }
    }

    protected loadEnv(dir: string) {
        // Always load .env first
        const base = dotenv.config({ path: `${dir}/.env` });
        dotenvExpand.expand(base);

        const env = process.env.NODE_ENV;
        if (env) {
            const specific = dotenv.config({ path: `${dir}/.env.${env}`, override: true });
            dotenvExpand.expand(specific);
        }
    }
}
