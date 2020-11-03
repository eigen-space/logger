import { LogLevelType } from '..';
import { FormatData } from './format-data';

export interface InitAppLoggerConfig {
    logLevel: LogLevelType;
    format: (data: FormatData) => string;
    service?: string;
}
