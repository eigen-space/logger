import { LogLevelType } from '..';

export interface FormatData {
    date: string;
    logLevel: LogLevelType;
    service: string;
    traceId: string;
    component: string;
    action: string;
    message: string;
}
