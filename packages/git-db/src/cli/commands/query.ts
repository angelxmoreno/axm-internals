import { createCommandDefinition } from '@axm-internal/cli-kit';
import { z } from 'zod';
import { openBunDb } from '../../db/client';
import {
    findAuthors,
    findCommitsBetween,
    findCommitsByAuthorEmail,
    findCommitsByMessage,
} from '../../queries/commitQueries';
import { findCommitsByPath } from '../../queries/fileQueries';
import { findCommitsByPackage } from '../../queries/packageQueries';

export const queryCommand = createCommandDefinition({
    name: 'query',
    description: 'Query indexed commits.',
    optionsSchema: z
        .object({
            db: z.string().meta({ description: 'Path to the SQLite db file.' }).default('.git/git-db.sqlite'),
            message: z.string().meta({ description: 'Search commit messages.' }).optional(),
            path: z.string().meta({ description: 'Search by path prefix.' }).optional(),
            package: z.string().meta({ description: 'Search by package path.' }).optional(),
            author: z.string().meta({ description: 'Search by author email.' }).optional(),
            between: z.string().meta({ description: 'Two commit hashes separated by "..".' }).optional(),
            authors: z.boolean().meta({ description: 'Query authors instead of commits.' }).default(false),
        })
        .refine(
            (value) =>
                Boolean(value.message || value.path || value.package || value.author || value.between || value.authors),
            { message: 'Provide at least one query option.' }
        ),
    action: async ({ options }) => {
        const db = await openBunDb(options.db);
        try {
            if (options.authors) {
                const authors = await findAuthors(db, options.message ?? '');
                console.log(JSON.stringify(authors, null, 2));
                return;
            }

            if (options.message) {
                const commits = await findCommitsByMessage(db, options.message);
                console.log(JSON.stringify(commits, null, 2));
                return;
            }

            if (options.path) {
                const commits = await findCommitsByPath(db, options.path);
                console.log(JSON.stringify(commits, null, 2));
                return;
            }

            if (options.package) {
                const commits = await findCommitsByPackage(db, options.package);
                console.log(JSON.stringify(commits, null, 2));
                return;
            }

            if (options.author) {
                const commits = await findCommitsByAuthorEmail(db, options.author);
                console.log(JSON.stringify(commits, null, 2));
                return;
            }

            if (options.between) {
                const [fromHash, toHash] = options.between.split('..');
                if (!fromHash || !toHash) {
                    throw new Error('between must be in the form <hash>..<hash>');
                }
                const commits = await findCommitsBetween(db, fromHash, toHash);
                console.log(JSON.stringify(commits, null, 2));
                return;
            }
        } finally {
            await db.destroy();
        }
    },
});
