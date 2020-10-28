/* eslint-disable no-console */
import { Logger } from './logger';
import { LogLevelType } from '../enums/log-level.enum';
import Mock = jest.Mock;

describe('Logger', () => {
    const defaultAppConfig = { ...Logger.appConfig };
    const setupAppConfig = { service: 'Logger' };
    const logger = new Logger({ component: 'LoggerSpec', traceId: 'traceId' });

    beforeEach(() => {
        Logger.appConfig = { ...defaultAppConfig, ...setupAppConfig };
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
            expect(isLogOutputContainsString(output, 'status: 200 data: data')).toBeTruthy();
        });

        it('should format buffer by default', () => {
            const objectWithBuffer = { id: 1, data: Buffer.from('data') };

            logger.debug('action', 'plain:', Buffer.from('plain'), 'in object:', objectWithBuffer);

            const output = (console.log as Mock).mock.calls[0][0];
            const convertedObject = JSON.stringify({ id: 1, data: 'Buffer' }, null, 4);
            expect(isLogOutputContainsString(output, `plain: "Buffer" in object: ${convertedObject}`)).toBeTruthy();
        });

        it('should use default log level and format', () => {
            Logger.appConfig.service = 'Logger';
            setCurrentDate(new Date('2020-10-23T10:00:00.000Z'));
            logger.debug('action', 'response', { status: 200, data: Buffer.from('stream') });
            // eslint-disable-next-line max-len
            expect(console.log).toBeCalledWith('2020-10-23T10:00:00.000Z; DEBUG; Logger; traceId=traceId; component=LoggerSpec; action=action; msg=log data');
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

        function isLogOutputContainsString(output: string, str: string): boolean {
            return output.includes(str);
        }
    });

    describe('#invoke', () => {

        beforeAll(() => {
            Logger.appConfig.logLevel = LogLevelType.DEBUG;
        });

        it('should log debug info', () => {
            logger.debug('action', 'log data');
            expect(console.log).toBeCalled();
        });

        it('should log base info', () => {
            logger.info('action', 'log data');
            expect(console.info).toBeCalled();
        });

        it('should log warning', () => {
            logger.warn('action', 'log data');
            expect(console.warn).toBeCalled();
        });

        it('should log error', () => {
            logger.error('action', 'log data');
            expect(console.error).toBeCalled();
        });

        it('should log critical error', () => {
            Logger.appConfig.logLevel = LogLevelType.CRITICAL;
            logger.critical('action', 'log data');
            expect(console.error).toBeCalled();
        });
    });
});
