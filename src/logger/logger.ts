import { AppLoggerConfig } from '../types/app-logger-config';
import { LogLevelType } from '../enums/log-level.enum';
import { ComponentLoggerConfig } from '../types/component-logger-config';
import { FormatData } from '../types/format-data';
import { SeverityType } from '../enums/severity.enum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Any = any;
declare type Args = Any[];

export class Logger {
    private static appLoggerConfig: AppLoggerConfig = {
        logLevel: LogLevelType.DEBUG,
        format: Logger.format
    } as AppLoggerConfig;
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

    // It could be configurable as format in logger
    private static stringifyReplacer(this: Any, _: string, value: Any): Any {
        if (!value) {
            return `${value}`;
        }

        // This function can be moved into transformers
        if (Logger.isBufferLike(value)) {
            return 'Buffer';
        }

        return value;
    }

    private static isBufferLike(obj: Any): boolean {
        if (typeof obj !== 'object') {
            return false;
        }

        return obj.type === 'Buffer' && Array.isArray(obj.data);
    }

    /**
     * Method wraps console.log() function.
     *
     * @param {string} action - closest activity that called the logger.
     * @param {any[]} args - Array of arguments to log.
     */
    debug(action: string, ...args: Args): void {
        this.invoke('log', LogLevelType.DEBUG, SeverityType.DEBUG, action, ...args);
    }

    /**
     * Method wraps console.info() function.
     *
     * @param {string} action - closest activity that called the logger.
     * @param {any[]} args - Array of arguments to log.
     */
    info(action: string, ...args: Args): void {
        this.invoke('info', LogLevelType.INFO, SeverityType.INFO, action, ...args);
    }

    /**
     * Method wraps console.warn() function.
     *
     * @param {string} action - closest activity that called the logger.
     * @param {any[]} args - Array of arguments to log.
     */
    warn(action: string, ...args: Args): void {
        this.invoke('warn', LogLevelType.WARNING, SeverityType.WARNING, action, ...args);
    }

    /**
     * Method wraps console.error() function.
     *
     * @param {string} action - closest activity that called the logger.
     * @param {any[]} args - Array of arguments to log.
     */
    error(action: string, ...args: Args): void {
        this.invoke('error', LogLevelType.ERROR, SeverityType.ERROR, action, ...args);
    }

    /**
     * Method wraps console.error() function.
     *
     * @param {string} action - closest activity that called the logger.
     * @param {any[]} args - Array of arguments to log.
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
        if (Logger.appLoggerConfig.logLevel! < logLevel) {
            return;
        }

        const stringArgs = this.stringifyArguments(args);
        const formatData = {
            date: new Date().toISOString(),
            severity,
            service: Logger.appLoggerConfig.service,
            traceId: this.componentConfig.traceId!,
            component: this.componentConfig.component,
            action,
            message: stringArgs.join(' ')
        };
        const formattedOutput = Logger.appLoggerConfig.format!(formatData);

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
