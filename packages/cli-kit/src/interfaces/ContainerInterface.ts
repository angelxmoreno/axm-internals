type constructor<T> = {
    new (...args: unknown[]): T;
};

export type InjectionToken<T = unknown> = constructor<T> | string | symbol;

export interface ContainerInterface {
    registerInstance<T>(token: InjectionToken<T>, instance: T): ContainerInterface;
    resolve<T>(token: InjectionToken<T>): T;
}
