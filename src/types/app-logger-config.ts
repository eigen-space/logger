import { LogLevelType } from '../enums/log-level.enum';
import { FormatData } from './format-data';

export interface AppLoggerConfig {
    logLevel?: LogLevelType;
    service: string;
    format?: (data: FormatData) => string;
}
