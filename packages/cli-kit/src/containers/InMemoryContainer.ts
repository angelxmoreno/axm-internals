import type { ContainerInterface, InjectionToken } from '../interfaces/ContainerInterface';

export class InMemoryContainer implements ContainerInterface {
    public readonly store: Map<InjectionToken, unknown> = new Map<InjectionToken, unknown>();

    resolve<T = unknown>(token: InjectionToken<T>): T {
        const instance = this.store.get(token);
        if (!instance) {
            throw new Error(`No instance registered for token "${String(token)}"`);
        }
        return instance as T;
    }

    registerInstance<T>(token: InjectionToken<T>, instance: T): ContainerInterface {
        this.store.set(token, instance);
        return this;
    }
}
