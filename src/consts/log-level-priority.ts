import { LogLevelType } from '..';

export const LOG_LEVEL_PRIORITY = {
    [LogLevelType.CRITICAL]: 0,
    [LogLevelType.ERROR]: 1,
    [LogLevelType.WARNING]: 2,
    [LogLevelType.INFO]: 3,
    [LogLevelType.DEBUG]: 4
};
