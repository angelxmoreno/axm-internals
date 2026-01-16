import { z } from 'zod';

type constructor<T> = {
    new (...args: unknown[]): T;
};

export type InjectionToken<T = unknown> = constructor<T> | string | symbol;

export const InjectionTokenSchema: z.ZodType<InjectionToken> = z.custom<InjectionToken>(
    (value) => typeof value === 'string' || typeof value === 'symbol' || typeof value === 'function'
);

export interface ContainerInterface {
    registerInstance<T>(token: InjectionToken<T>, instance: T): ContainerInterface;
    resolve<T>(token: InjectionToken<T>): T;
}

export const ContainerSchema: z.ZodType<ContainerInterface> = z.custom<ContainerInterface>(
    (value) =>
        typeof value === 'object' &&
        value !== null &&
        typeof (value as ContainerInterface).resolve === 'function' &&
        typeof (value as ContainerInterface).registerInstance === 'function'
);
