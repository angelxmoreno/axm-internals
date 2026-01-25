import { z } from 'zod';
import { PackageAppSchema } from './PackageAppSchema';

const CommitSchema = z.object({
    hash: z.string(),
    author_id: z.string(),
    date: z.string(),
    message: z.string(),
    body: z.string(),
    refs: z.string().nullable(),
    type: z.string().nullable(),
    scope: z.string().nullable(),
    is_breaking_change: z.boolean().nullable(),
});

export const ChangeSetBumpSchema = z.enum(['major', 'minor', 'patch']).nullable();
export type ChangeSetBump = z.infer<typeof ChangeSetBumpSchema>;

export const ChangeSetDraftSchema = z.object({
    scope: z.string(),
    packagePath: PackageAppSchema,
    latestTagName: z.string().nullable(),
    fromCommit: CommitSchema.nullable(),
    toCommit: CommitSchema.nullable(),
    commits: z.array(CommitSchema),
    suggestedBump: ChangeSetBumpSchema,
    summaryLines: z.array(z.string()),
});

export type ChangeSetDraft = z.infer<typeof ChangeSetDraftSchema>;
