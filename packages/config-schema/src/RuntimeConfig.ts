export class RuntimeConfig<T> {
    protected readonly value: T;

    constructor(value: T) {
        this.value = value;
    }

    get(): T {
        return this.value;
    }

    pick<K extends keyof T>(key: K): T[K] {
        return this.value[key];
    }
}
