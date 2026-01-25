import { PackageAppSchema } from '../schemas/PackageAppSchema';

export const listPackageApps = (): string[] => {
    return [...PackageAppSchema.options];
};
