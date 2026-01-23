import { Kysely } from 'kysely';
import { BunWorkerDialect } from 'kysely-bun-worker';
import type { Database as DbSchema } from './types';

export const createBunWorkerDb = (dbPath: string): Kysely<DbSchema> =>
    new Kysely<DbSchema>({
        dialect: new BunWorkerDialect({
            url: dbPath,
        }),
    });
