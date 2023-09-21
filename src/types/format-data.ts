import { ComponentLoggerConfig, LogLevelType } from '..';

export interface FormatData extends ComponentLoggerConfig {
    date: string;
    logLevel: LogLevelType;
    service: string;
    traceId?: string;
    component: string;
    action: string;
    message: string;
}
