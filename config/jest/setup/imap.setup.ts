export const MockImapClient = { setLabels: jest.fn() };
jest.mock('@eigenspace/web-imap-client', () => ({
    ImapClient: jest.fn(() => ({
        setLabels: MockImapClient.setLabels
    }))
}));
