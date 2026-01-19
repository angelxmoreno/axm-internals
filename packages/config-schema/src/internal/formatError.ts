import type { z } from 'zod';
import { inferEnvName } from './inferEnvName';
import type { InternalLeafNode, InternalNode } from './types';

type $ZodIssue = z.core.$ZodIssue;
type ZodError = z.ZodError;

export const formatError = (error: ZodError, root: InternalNode): Error => {
    const lines: string[] = [];
    lines.push('ConfigError: invalid configuration\n');

    for (const issue of error.issues) {
        lines.push(formatIssue(issue, root));
    }

    return new Error(lines.join('\n'));
};

const formatIssue = (issue: $ZodIssue, root: InternalNode): string => {
    const issuePath = issue.path.filter((segment): segment is string | number => {
        return typeof segment === 'string' || typeof segment === 'number';
    });
    const path = issuePath.join('.');
    const leaf = findLeaf(root, issuePath);

    const env = leaf?.env ? (leaf.env === 'auto' ? inferEnvName(leaf.path) : leaf.env) : undefined;

    const parts: string[] = [];

    parts.push(`- ${path || '<root>'}`);
    parts.push(`  ${issue.message}`);

    if (env) {
        parts.push(`  env: ${env}`);
    }

    if ('received' in issue) {
        parts.push(`  received: ${String((issue as { received?: unknown }).received)}`);
    }

    return parts.join('\n');
};

const findLeaf = (node: InternalNode, path: (string | number)[]): InternalLeafNode | undefined => {
    if (node.kind === 'leaf') {
        return node;
    }

    const [head, ...rest] = path;
    if (typeof head !== 'string') return;

    const child = node.children[head];
    if (!child) return;

    if (rest.length === 0) {
        return child.kind === 'leaf' ? child : undefined;
    }

    return findLeaf(child, rest);
};
