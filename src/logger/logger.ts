import { AppLoggerConfig, ComponentLoggerConfig, FormatData, LogLevelType } from '..';
import { LOG_LEVEL_PRIORITY } from '../consts/log-level-priority';
import { StringifiedError } from '../entities/stringified-error';
import { LOG_LEVEL_TO_FUNCTION_NAME } from '../consts/log-level-to-function-name';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Any = any;
declare type Args = Any[];

export class Logger<C extends ComponentLoggerConfig = ComponentLoggerConfig> {
    private static appLoggerConfig: AppLoggerConfig = {
        logLevelThreshold: LogLevelType.DEBUG,
        format: Logger.format,
        contextDelimiter: '/'
    };
    private componentConfig: C;

    constructor(config: C = {} as C) {
        this.componentConfig = config;
    }

    static get appConfig(): AppLoggerConfig {
        return Logger.appLoggerConfig;
    }

    static set appConfig(config: AppLoggerConfig) {
        Logger.appLoggerConfig = { ...this.appLoggerConfig, ...config };
    }

    private static format(data: FormatData): string {
        const { date, logLevel, service, component, action, message, ...other } = data;
        const prefixes = [date, logLevel, service, component, action].map(prefix => `[${prefix}]`);
        const customPrefixes = Object.entries(other).map(([key, value]) => `[${key} = ${value}]`);
        const messageDelimiter = ' ';
        return [...prefixes, ...customPrefixes, messageDelimiter, message].join('');
    }

    /**
     * Function that used in JSON.stringify method.
     * Applies replacers to the value recursively.
     *
     * Notes:
     * It could be configurable as format in logger.
     *
     * @this {any} The whole object that is being processed.
     * @param {string} _key Current key of the object that is being processed recursively.
     * @param {any} value Current serialized value of the object that is being processed recursively.
     *      Each value may not equal to real value because
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

    private static validateAppConfig(): void {
        const invalidKeys = Object.keys(Logger.appLoggerConfig)
            .filter(key => Logger.appLoggerConfig[key as keyof AppLoggerConfig] == null);

        if (!invalidKeys.length) {
            return;
        }

        const unspecifiedFields = invalidKeys.join(', ');
        throw new Error(`You have no set these fields in app configuration: ${unspecifiedFields}`);
    }

    private static stringifyArguments(args: Args): string[] {
        return args.map(arg => {
            if (typeof arg === 'string') {
                return arg;
            }

            let formattedArg = arg;
            if (arg instanceof Error) {
                formattedArg = new StringifiedError(arg);
            }

            return JSON.stringify(formattedArg, Logger.stringifyReplacer, 4);
        });
    }

    updateConfig(config: Partial<C>): void {
        this.componentConfig = { ...this.componentConfig, ...config };
    }

    /**
     * Method wraps console.log() function.
     *
     * @param {string} context Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    debug(context: string, message: string, ...args: Args): void {
        this.log({ logLevel: LogLevelType.DEBUG, context, message, args });
    }

    /**
     * Method wraps console.info() function.
     *
     * @param {string} context Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    info(context: string, message: string, ...args: Args): void {
        this.log({ logLevel: LogLevelType.INFO, context, message, args });
    }

    /**
     * Method wraps console.warn() function.
     *
     * @param {string} context Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    warn(context: string, message: string, ...args: Args): void {
        this.log({ logLevel: LogLevelType.WARNING, context, message, args });
    }

    /**
     * Method wraps console.error() function.
     *
     * @param {string} context Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    error(context: string, message: string, ...args: Args): void {
        this.log({ logLevel: LogLevelType.ERROR, context, message, args });
    }

    /**
     * Method wraps console.error() function.
     *
     * @param {string} context Closest activity that called the logger.
     * @param {string} message Message.
     * @param {any[]} args Array of arguments to log.
     */
    critical(context: string, message: string, ...args: Args): void {
        this.log({ logLevel: LogLevelType.CRITICAL, context, message, args });
    }

    log<T extends LogParams>(data: T): void {
        Logger.validateAppConfig();

        const {
            logLevel,
            context,
            message,
            args = [],
            ...other
        } = data;

        const appConfig = Logger.appLoggerConfig as Required<AppLoggerConfig>;

        const appLogLevelPriority = LOG_LEVEL_PRIORITY[appConfig.logLevelThreshold];
        const logLevelPriority = LOG_LEVEL_PRIORITY[logLevel];
        if (appLogLevelPriority < logLevelPriority) {
            return;
        }

        const [action, component] = context.split(appConfig.contextDelimiter).reverse();

        const stringArgs = Logger.stringifyArguments([message, ...args]);
        const formatData = {
            ...this.componentConfig,
            component: component || this.componentConfig.component || 'unknown',
            date: new Date().toISOString(),
            logLevel,
            service: appConfig.service,
            action,
            message: stringArgs.join(' '),
            ...other
        };

        const formattedOutput = appConfig.format(formatData);
        const functionName = LOG_LEVEL_TO_FUNCTION_NAME[logLevel];
        // @ts-ignore
        // eslint-disable-next-line no-console
        console[functionName](formattedOutput);
    }
}

export interface LogParams {
    logLevel: LogLevelType;
    context: string;
    message: string;
    args?: Args[];
}
