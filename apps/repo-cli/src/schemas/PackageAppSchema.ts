import { z } from 'zod';

const validPackageApps = {
    apps: ['repo-cli'],
    packages: ['cli-kit', 'config-schema', 'hono-kit', 'tooling-config', 'zod-helpers'],
};

export const ValidatePackageApp = (packageApp?: string): true => {
    if (!packageApp) {
        throw new Error('Package or app name is required');
    }

    if (!packageApp.startsWith('apps/') && !packageApp.startsWith('packages/')) {
        throw new Error('Package or app name must start with "apps/" or "packages/".');
    }

    const [type, name] = packageApp.split('/', 2);

    if (!type || !name) {
        throw new Error('Invalid package or app name.');
    }

    const allowed = validPackageApps[type as keyof typeof validPackageApps];
    if (!allowed?.includes(name)) {
        throw new Error(`Unknown ${type.slice(0, -1)} name "${name}".`);
    }

    return true;
};

export const isValidPackageApp = (packageApp?: string): boolean => {
    try {
        return ValidatePackageApp(packageApp);
    } catch (_e) {
        return false;
    }
};

export const PackageAppSchema = z.string().refine((value) => isValidPackageApp(value), {
    message: `Expected "apps/<name>" or "packages/<name>" for a known app/package.`,
});
