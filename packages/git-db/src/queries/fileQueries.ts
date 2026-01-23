import type { DbClient } from '../db/client';
import type { Commit } from '../db/types';

export const findCommitsByPath = async (db: DbClient, pathPrefix: string): Promise<Commit[]> => {
    return db
        .selectFrom('commits')
        .innerJoin('commit_files', 'commit_files.hash', 'commits.hash')
        .select([
            'commits.hash',
            'commits.author_id',
            'commits.date',
            'commits.message',
            'commits.body',
            'commits.refs',
        ])
        .where('commit_files.path', 'like', `${pathPrefix}%`)
        .orderBy('commits.date', 'desc')
        .execute();
};
