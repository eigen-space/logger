import * as fetchPolyfill from 'whatwg-fetch';

declare global {
    namespace NodeJS {
        interface Global {
            fetch: typeof fetchPolyfill.fetch;
            Request: typeof fetchPolyfill.Request;
            Headers: typeof fetchPolyfill.Headers;
            Response: typeof fetchPolyfill.Response;
        }
    }
}

global.fetch = fetchPolyfill.fetch;
global.Request = fetchPolyfill.Request;
global.Headers = fetchPolyfill.Headers;
global.Response = fetchPolyfill.Response;
