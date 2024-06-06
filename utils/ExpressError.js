class ExpressError extends Error {
    constructor(statusCode=400 , message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;