import { describe, expect, it } from 'bun:test';
import { InMemoryContainer } from '../../../src/containers/InMemoryContainer';

describe('InMemoryContainer', () => {
    it('registers and resolves instances by string token', () => {
        const container = new InMemoryContainer();

        container.registerInstance('logger', { level: 'info' });

        expect(container.resolve<{ level: string }>('logger')).toEqual({ level: 'info' });
    });

    it('registers and resolves instances by symbol token', () => {
        const container = new InMemoryContainer();
        const token = Symbol('service');
        const instance = { ok: true };

        container.registerInstance(token, instance);

        expect(container.resolve<typeof instance>(token)).toBe(instance);
    });

    it('registers and resolves instances by constructor token', () => {
        class Service {
            public readonly name = 'svc';
        }

        const container = new InMemoryContainer();
        const instance = new Service();

        container.registerInstance(Service, instance);

        expect(container.resolve(Service)).toBe(instance);
    });

    it('throws a clear error when resolving missing tokens', () => {
        const container = new InMemoryContainer();

        expect(() => container.resolve('missing')).toThrow('No instance registered for token "missing"');
    });
});
