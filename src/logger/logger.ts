import { AppLoggerConfig } from '../types/app-logger-config';
// noinspection ES6PreferShortImport
import { LogLevelType } from '../enums/log-level.enum';
// noinspection ES6PreferShortImport
import { ComponentLoggerConfig } from '../types/component-logger-config';
// noinspection ES6PreferShortImport
import { FormatData } from '../types/format-data';
import { SeverityType } from '../enums/severity.enum';
import { InitAppLoggerConfig } from '../types/init-app-logger-config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Any = any;
declare type Args = Any[];

export class Logger {
    private static appLoggerConfig: InitAppLoggerConfig = {
        logLevel: LogLevelType.DEBUG,
        format: Logger.format
    };
    private componentConfig: ComponentLoggerConfig;

    constructor(config: ComponentLoggerConfig) {
        this.componentConfig = config;
    }

    static get appConfig(): AppLoggerConfig {
        return Logger.appLoggerConfig;
    }

    static set appConfig(config: AppLoggerConfig) {
        Logger.appLoggerConfig = { ...this.appLoggerConfig, ...config };
    }

    private static format(data: FormatData): string {
        const { date, severity, service, message, ...rest } = data;

        const keyPairsObject = { ...rest, msg: message };
        // @ts-ignore
        const keyPairs = Object.keys(keyPairsObject).map(key => `${key}=${keyPairsObject[key]}`);
        return [date, severity, service, ...keyPairs].join('; ');
    }

    // noinspection JSCommentMatchesSignature
    /**
     * Function that used in JSON.stringify method.
     * Applies replacers to the value recursively.
     *
     * Notes:
     * It could be configurable as format in logger.
     *
     * @param {any} this The whole object that is being processed.
     * @param {string} _key Current key of the object that is being processed recursively.
     * @param {any} value Current serialized value of the object that is being processed recursively.
     *      Each value mey not equal to real value because
     *      JSON.stringify() implicitly calls toJSON() serialization function if presented.
     * @returns {any} Either the processed value or not changed value.
     */
    private static stringifyReplacer(this: Any, _key: string, value: Any): Any {
        // We escape null and undefined values because the join() function replaces these values with empty string
        //
        // Example:
        // [1, null, 3].join('|') will return '1||3'
        if (value == null) {
            return `${value}`;
        }

        if (Logger.isBufferLike(value)) {
            return 'Buffer';
        }

        return value;
    }

    private static isBufferLike(obj: Any): boolean {
        return obj && typeof obj === 'object' && obj.type === 'Buffer' && Array.isArray(obj.data);
    }

    /**
     * Method wraps console.log() function.
     *
     * @param {string} action Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    debug(action: string, ...args: Args): void {
        this.invoke('log', LogLevelType.DEBUG, SeverityType.DEBUG, action, ...args);
    }

    /**
     * Method wraps console.info() function.
     *
     * @param {string} action Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    info(action: string, ...args: Args): void {
        this.invoke('info', LogLevelType.INFO, SeverityType.INFO, action, ...args);
    }

    /**
     * Method wraps console.warn() function.
     *
     * @param {string} action Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    warn(action: string, ...args: Args): void {
        this.invoke('warn', LogLevelType.WARNING, SeverityType.WARNING, action, ...args);
    }

    /**
     * Method wraps console.error() function.
     *
     * @param {string} action Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    error(action: string, ...args: Args): void {
        this.invoke('error', LogLevelType.ERROR, SeverityType.ERROR, action, ...args);
    }

    /**
     * Method wraps console.error() function.
     *
     * @param {string} action Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    critical(action: string, ...args: Args): void {
        this.invoke('error', LogLevelType.CRITICAL, SeverityType.CRITICAL, action, ...args);
    }

    private invoke(
        functionName: string,
        logLevel: LogLevelType,
        severity: SeverityType,
        action: string,
        ...args: Args
    ): void {
        if (Logger.appLoggerConfig.logLevel < logLevel) {
            return;
        }

        const stringArgs = this.stringifyArguments(args);
        const formatData = {
            date: new Date().toISOString(),
            severity,
            service: Logger.appLoggerConfig.service || 'undefined',
            traceId: this.componentConfig.traceId || 'undefined',
            component: this.componentConfig.component,
            action,
            message: stringArgs.join(' ')
        };
        const formattedOutput = Logger.appLoggerConfig.format(formatData);

        // @ts-ignore
        // eslint-disable-next-line no-console
        console[functionName](formattedOutput);
    }

    private stringifyArguments(args: Args): string[] {
        return args.map(arg => {
            if (typeof arg === 'string') {
                return arg;
            }

            return JSON.stringify(arg, Logger.stringifyReplacer, 4);
        });
    }
}
