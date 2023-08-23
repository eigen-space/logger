/* eslint-disable no-console */
import { Logger } from './logger';
import { LogLevelType } from '..';
import Mock = jest.Mock;

describe('Logger', () => {
    const defaultAppConfig = { ...Logger.appConfig, service: undefined };
    const setupAppConfig = { service: 'Logger' };
    let logger: Logger;

    beforeEach(() => {
        Logger.appConfig = { ...defaultAppConfig, ...setupAppConfig };
        logger = new Logger({ component: 'LoggerSpec', traceId: 'traceId' });
    });

    describe('#common', () => {

        it('should use default log level and format', () => {
            setCurrentDate(new Date('2020-10-23T10:00:00.000Z'));
            Logger.appConfig.service = 'Logger';

            logger.debug('action', 'data');

            const expected = '[2020-10-23T10:00:00.000Z][DEBUG][Logger][LoggerSpec][action][trace id = traceId] data';
            expect(console.log).toBeCalledWith(expected);
        });

        it('should not display trace id if not presented by default', () => {
            const loggerWithoutTraceId = new Logger({ component: 'LoggerSpec' });
            setCurrentDate(new Date('2020-10-23T10:00:00.000Z'));
            Logger.appConfig.service = 'Logger';

            loggerWithoutTraceId.debug('action', 'log data');

            const expected = '[2020-10-23T10:00:00.000Z][DEBUG][Logger][LoggerSpec][action] log data';
            expect(console.log).toBeCalledWith(expected);
        });

        it('should throw error if some fields are not specified in app config', () => {
            Logger.appConfig.service = undefined;

            try {
                logger.debug('action', 'log data');
            } catch (e) {
                expect(e.message).toContain('service');
            }
        });

        it('should concat log arguments in one string', () => {
            logger.debug('action', 'status:', 200, 'data:', 'data');
            const output = (console.log as Mock).mock.calls[0][0];
            expect(output).toContain('status: 200 data: data');
        });

        it('should display undefined arguments', () => {
            logger.debug('action', 'data:', undefined);
            const output = (console.log as Mock).mock.calls[0][0];
            expect(output).toContain('data: "undefined"');
        });

        it('should display arrays', () => {
            logger.debug('action', 'data:', [1, 2, 3]);

            const output = (console.log as Mock).mock.calls[0][0];
            const convertedObject = stringify([1, 2, 3]);
            expect(output).toContain(`data: ${convertedObject}`);
        });

        it('should format buffer by default', () => {
            const objectWithBuffer = { id: 1, data: [Buffer.from('data')] };

            logger.debug('action', 'plain:', Buffer.from('plain'), 'in object:', objectWithBuffer);

            const output = (console.log as Mock).mock.calls[0][0];
            const convertedObject = stringify({ id: 1, data: ['Buffer'] });
            expect(output).toContain(`plain: "Buffer" in object: ${convertedObject}`);
        });

        it('should display error', () => {
            const customError = new Error('Promise rejected');
            customError.stack = 'at index.js:15:3';

            logger.debug('action', 'error occurred:', customError);

            const output = (console.log as Mock).mock.calls[0][0];
            expect(output).toContain('Promise rejected');
            expect(output).toContain('at index.js:15:3');
        });

        it('should change log level on all instances', () => {
            const logger1 = new Logger({ component: 'LoggerSpec', traceId: 'traceId' });
            const logger2 = new Logger({ component: 'LoggerSpec', traceId: 'traceId' });
            Logger.appConfig.logLevelThreshold = LogLevelType.ERROR;

            logger1.info('action', 'log data');
            logger2.error('action', 'log data');

            expect(console.info).toHaveBeenCalledTimes(0);
            expect(console.error).toHaveBeenCalledTimes(1);
        });

        it('should change output format on all instances', () => {
            const logger1 = new Logger({ component: 'LoggerSpec', traceId: 'traceId' });
            const logger2 = new Logger({ component: 'LoggerSpec', traceId: 'traceId' });
            Logger.appConfig.format = (_) => 'formatted output';

            logger1.info('action', 'log data');
            logger2.error('action', 'log data');

            expect(console.info).toHaveBeenCalledWith('formatted output');
            expect(console.error).toHaveBeenCalledWith('formatted output');
        });

        it('should use default component placeholder if it is not defined', () => {
            logger = new Logger();
            Logger.appConfig.format = data => data.component;

            logger.info('action', 'log data');

            expect(console.info).toHaveBeenCalledWith('unknown');
        });

        it('should parse context info to get component and action using the default delimiter', () => {
            logger = new Logger();
            Logger.appConfig.format = ({ component, action }) => `${component}-${action}`;

            logger.info('component/action', 'log data');

            expect(console.info).toHaveBeenCalledWith('component-action');
        });

        it('should parse context info to get component and action using the custom delimiter', () => {
            logger = new Logger();
            Logger.appConfig.format = ({ component, action }) => `${component}-${action}`;
            Logger.appConfig.contextDelimiter = '@';

            logger.info('component@action', 'log data');

            expect(console.info).toHaveBeenCalledWith('component-action');
        });

        function setCurrentDate(date: Date): void {
            // @ts-ignore
            global.Date = jest.fn(() => date);
        }

        function stringify(obj: Object): string {
            return JSON.stringify(obj, null, 4);
        }
    });

    describe('#get appConfig', () => {

        it('should return config without any transformations', () => {
            const config = { ...defaultAppConfig, ...setupAppConfig };
            Logger.appConfig = config;
            expect(Logger.appConfig).toEqual(config);
        });
    });

    describe('#set appConfig', () => {

        it('should set field in config one by one', () => {
            Logger.appConfig.logLevelThreshold = LogLevelType.CRITICAL;
            Logger.appConfig.service = 'Some service';

            expect(Logger.appConfig.logLevelThreshold).toEqual(LogLevelType.CRITICAL);
            expect(Logger.appConfig.service).toEqual('Some service');
        });

        it('should update config with object data', () => {
            Logger.appConfig = { logLevelThreshold: LogLevelType.ERROR, service: 'Another service' };
            expect(Logger.appConfig.logLevelThreshold).toEqual(LogLevelType.ERROR);
            expect(Logger.appConfig.service).toEqual('Another service');
        });
    });

    const groups = [['debug', 'log'], ['info', 'info'], ['warn', 'warn'], ['error', 'error'], ['critical', 'error']];
    groups.forEach(group => {
        const [loggerFunction, consoleFunction] = group;
        describe(`#${loggerFunction}`, () => {

            it('should log critical errors', () => {
                Logger.appConfig.logLevelThreshold = LogLevelType.DEBUG;
                // @ts-ignore
                logger[loggerFunction]('action', 'log data');
                // @ts-ignore
                expect(console[consoleFunction]).toBeCalled();
            });
        });
    });
});
