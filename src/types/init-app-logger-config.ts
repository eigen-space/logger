// noinspection ES6PreferShortImport
import { LogLevelType } from '../enums/log-level.enum';
import { FormatData } from './format-data';

export interface InitAppLoggerConfig {
    logLevel: LogLevelType;
    format: (data: FormatData) => string;
    service?: string;
}
