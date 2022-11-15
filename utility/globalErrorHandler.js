// sending error in development env
function sendErrorDevelopment(error, response) {
    response.status(error.statusCode).json({
        status: error.status,
        error,
        message: error.message,
        stack: error.stack,
    });
}

// sending error in production env
function sendErrorProduction(error, response) {
    response.status(error.status).json({
        status: error.status,
        message: error.message,
    });
}

// global error handler middleware
module.exports = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'Internal Error';

    // error for developoment env
    if (process.env.NODE_ENV === 'development') {
        sendErrorDevelopment(error, response);
        // error for production env
    } else if (process.env.NODE_ENV === 'production') {
        if (error.isOperational) {
            sendErrorProduction(error, response);
        } else {
            // error for non operational error
            response.status(error.statusCode).json({
                message: 'Something Went Very Wrong',
            });
        }
    }
};
