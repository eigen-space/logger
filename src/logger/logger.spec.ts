/* eslint-disable no-console */
import { Logger } from './logger';
import { LogLevelType } from '..';
import Mock = jest.Mock;

describe('Logger', () => {
    const defaultAppConfig = { ...Logger.appConfig, service: undefined };
    const setupAppConfig = { service: 'Logger' };
    const logger = new Logger({ component: 'LoggerSpec', traceId: 'traceId' });

    beforeEach(() => {
        Logger.appConfig = defaultAppConfig;
    });

    describe('#common', () => {

        it('should use default log level and format', () => {
            Logger.appConfig.service = 'Logger';
            setCurrentDate(new Date('2020-10-23T10:00:00.000Z'));

            logger.debug('action', 'log data');

            // eslint-disable-next-line max-len
            expect(console.log).toBeCalledWith('2020-10-23T10:00:00.000Z; DEBUG; Logger; traceId=traceId; component=LoggerSpec; action=action; msg=log data');
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

        it('should change log level on all instances', () => {
            const logger1 = new Logger({ component: 'LoggerSpec', traceId: 'traceId' });
            const logger2 = new Logger({ component: 'LoggerSpec', traceId: 'traceId' });
            Logger.appConfig.logLevel = LogLevelType.ERROR;

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
            Logger.appConfig.logLevel = LogLevelType.CRITICAL;
            Logger.appConfig.service = 'Some service';

            expect(Logger.appConfig.logLevel).toEqual(LogLevelType.CRITICAL);
            expect(Logger.appConfig.service).toEqual('Some service');
        });

        it('should update config with object data', () => {
            Logger.appConfig = { logLevel: LogLevelType.ERROR, service: 'Another service' };
            expect(Logger.appConfig.logLevel).toEqual(LogLevelType.ERROR);
            expect(Logger.appConfig.service).toEqual('Another service');
        });
    });

    const groups = [['debug', 'log'], ['info', 'info'], ['warn', 'warn'], ['error', 'error'], ['critical', 'error']];
    groups.forEach(group => {
        const [loggerFunction, consoleFunction] = group;
        describe(`#${loggerFunction}`, () => {

            it('should log critical errors', () => {
                Logger.appConfig.logLevel = LogLevelType.DEBUG;
                // @ts-ignore
                logger[loggerFunction]('action', 'log data');
                // @ts-ignore
                expect(console[consoleFunction]).toBeCalled();
            });
        });
    });
});
