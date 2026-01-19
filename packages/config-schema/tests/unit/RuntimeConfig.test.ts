import { describe, expect, it } from 'bun:test';
import { RuntimeConfig } from '../../src';

describe('RuntimeConfig', () => {
    it('returns the full config via get()', () => {
        const cfg = new RuntimeConfig({ port: 3000, name: 'app' });
        expect(cfg.get()).toEqual({ port: 3000, name: 'app' });
    });

    it('returns a slice via pick()', () => {
        const cfg = new RuntimeConfig({ port: 3000, name: 'app' });
        expect(cfg.pick('name')).toBe('app');
    });
});
