import { FormatData, LogLevelType } from '..';

export interface AppLoggerConfig {
    /**
     * The threshold of log levels that will be printed.
     * Set up by default.
     * @default DEBUG
     */
    logLevelThreshold?: LogLevelType;

    /**
     * Function that transform log data in desired format.
     * Set up by default.
     * @default Default formatter with [] symbols as a delimiter
     */
    format?: (data: FormatData) => string;

    /**
     * Name of the whole service.
     * Mostly this equals to project name.
     */
    service?: string;

    /**
     * A symbol that divides context to parts.
     */
    contextDelimiter?: string;
}
