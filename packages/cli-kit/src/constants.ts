import type { Logger } from 'pino';
import type { InjectionToken } from './interfaces/ContainerInterface';

export const CliLogger: InjectionToken<Logger> = 'CliLogger';
