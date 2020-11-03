export class StringifiedError implements Error {
    name: string;
    message: string;
    stack?: string;

    constructor(error: Error) {
        this.name = error.name;
        this.message = error.message;
        this.stack = error.stack;
    }
}
