import { LogLevelType } from '..';

export const LOG_LEVEL_TO_FUNCTION_NAME: Record<LogLevelType, keyof typeof console> = {
    [LogLevelType.CRITICAL]: 'error',
    [LogLevelType.ERROR]: 'error',
    [LogLevelType.WARNING]: 'warn',
    [LogLevelType.INFO]: 'info',
    [LogLevelType.DEBUG]: 'log'
};
