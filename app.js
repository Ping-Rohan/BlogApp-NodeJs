const express = require('express');
const dotenv = require('dotenv');
const app = express();
const userRouter = require('./routes/userRoute');
const postRouter = require('./routes/postRoute');
const globalErrorHandler = require('./utility/globalErrorHandler');
const AppError = require('./utility/AppError');

// environment variables configuration
dotenv.config();

// middlewares
app.use(express.json());
app.use('/api/v1', userRouter);
app.use('/api/v1/post', postRouter);

// unhandled routes
app.use('*', (request, response, next) => {
    return next(new AppError('Couldnot found this route on server ', 404));
});

// global error handler middleware
app.use(globalErrorHandler);

// exporting app
module.exports = app;
