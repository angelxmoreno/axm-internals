import type { DbClient } from '../db/client';
import type { Author, Commit } from '../db/types';

export const findCommitsByMessage = async (db: DbClient, query: string): Promise<Commit[]> => {
    return db
        .selectFrom('commits')
        .selectAll()
        .where('message', 'like', `%${query}%`)
        .orderBy('date', 'desc')
        .execute();
};

export const findCommitsBetween = async (db: DbClient, fromHash: string, toHash: string): Promise<Commit[]> => {
    const [fromRow, toRow] = await Promise.all([
        db.selectFrom('commits').select(['date']).where('hash', '=', fromHash).executeTakeFirst(),
        db.selectFrom('commits').select(['date']).where('hash', '=', toHash).executeTakeFirst(),
    ]);

    if (!fromRow?.date || !toRow?.date) {
        return [];
    }

    const [start, end] = fromRow.date <= toRow.date ? [fromRow.date, toRow.date] : [toRow.date, fromRow.date];

    return db
        .selectFrom('commits')
        .selectAll()
        .where('date', '>=', start)
        .where('date', '<=', end)
        .orderBy('date', 'desc')
        .execute();
};

export const findCommitsByAuthorEmail = async (db: DbClient, email: string): Promise<Commit[]> => {
    return db
        .selectFrom('commits')
        .innerJoin('authors', 'authors.id', 'commits.author_id')
        .select([
            'commits.hash',
            'commits.author_id',
            'commits.date',
            'commits.message',
            'commits.body',
            'commits.refs',
        ])
        .where('authors.email', '=', email)
        .orderBy('commits.date', 'desc')
        .execute();
};

export const findAuthors = async (db: DbClient, query: string): Promise<Author[]> => {
    return db
        .selectFrom('authors')
        .selectAll()
        .where((eb) => eb.or([eb('authors.name', 'like', `%${query}%`), eb('authors.email', 'like', `%${query}%`)]))
        .orderBy('authors.email', 'asc')
        .execute();
};
