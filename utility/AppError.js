class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 403;
        this.status = `${statusCode}`.startsWith('4')
            ? 'Error Occured'
            : 'Failed';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
