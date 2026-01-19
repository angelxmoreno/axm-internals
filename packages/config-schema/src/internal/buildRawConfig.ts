import { inferEnvName } from './inferEnvName';
import type { InternalLeafNode, InternalNode, InternalObjectNode } from './types';

export const buildRawConfig = (root: InternalNode): Record<string, unknown> => {
    if (root.kind !== 'object') {
        throw new Error('Root node must be an object');
    }

    return buildObject(root);
};

const buildObject = (node: InternalObjectNode): Record<string, unknown> => {
    const out: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(node.children)) {
        if (child.kind === 'object') {
            out[key] = buildObject(child);
            continue;
        }

        const resolved = resolveLeaf(child);
        if (resolved.shouldSet) {
            out[key] = resolved.value;
        }
    }

    return out;
};

const resolveLeaf = (node: InternalLeafNode): { shouldSet: boolean; value: unknown } => {
    if (!node.env) {
        return { shouldSet: false, value: undefined };
    }

    const envName = node.env === 'auto' ? inferEnvName(node.path) : node.env;

    const raw = process.env[envName];
    if (raw === undefined) {
        return node.optional ? { shouldSet: false, value: undefined } : { shouldSet: true, value: undefined };
    }

    return { shouldSet: true, value: raw };
};
