import fs from 'node:fs';
import path from 'node:path';
import { type ChangeSetDraft, ChangeSetDraftSchema } from '../schemas/ChangeSetDraftSchema';
import { findRepoRoot } from '../utils/findRepoRoot';

export interface ChangeSetWriterOptions {
    draftDir?: string;
    repoRoot?: string;
}

export interface ChangeSetWriteResult {
    draft: ChangeSetDraft;
    filePath: string;
}

export class ChangeSetWriter {
    protected readonly draftDir: string;

    constructor(options: ChangeSetWriterOptions = {}) {
        const repoRoot = options.repoRoot ?? findRepoRoot(process.cwd());
        const draftDir = options.draftDir ?? path.join(repoRoot, '.changeset-drafts');
        this.draftDir = draftDir;
    }

    async writeDraft(input: ChangeSetDraft): Promise<ChangeSetWriteResult> {
        const draft = ChangeSetDraftSchema.parse(input);
        const filePath = path.join(this.draftDir, this.buildFileName(draft));
        this.ensureDraftDir();
        await Bun.write(Bun.file(filePath), `${JSON.stringify(draft, null, 2)}\n`);
        return { draft, filePath };
    }

    async writeDrafts(inputs: ChangeSetDraft[]): Promise<ChangeSetWriteResult[]> {
        const results: ChangeSetWriteResult[] = [];
        for (const draft of inputs) {
            results.push(await this.writeDraft(draft));
        }
        return results;
    }

    protected ensureDraftDir(): void {
        if (!fs.existsSync(this.draftDir)) {
            fs.mkdirSync(this.draftDir, { recursive: true });
        }
    }

    protected buildFileName(draft: ChangeSetDraft): string {
        const scopeSlug = draft.scope.replace(/[^a-z0-9-_]/gi, '_');
        const fromHash = draft.fromCommit?.hash?.slice(0, 7) ?? 'none';
        const toHash = draft.toCommit?.hash?.slice(0, 7) ?? 'none';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return `${scopeSlug}-${fromHash}-${toHash}-${timestamp}.json`;
    }
}
