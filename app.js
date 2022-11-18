const express = require('express');
const dotenv = require('dotenv');
const app = express();
const userRouter = require('./routes/userRoute');
const postRouter = require('./routes/postRoute');
const globalErrorHandler = require('./utility/globalErrorHandler');
const AppError = require('./utility/AppError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// environment variables configuration
dotenv.config();

const limiter = rateLimit({
    max: 20,
    windowMs: 5 * 60 * 1000,
    message: 'Too Many Request Try Again Later',
});

// middlewares
app.use(sanitize());
app.use(xss);
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use('/api/v1/post', postRouter);
app.use('/api/v1', userRouter);

// unhandled routes
app.use('*', (request, response, next) => {
    return next(new AppError('Couldnot found this route on server ', 404));
});

// global error handler middleware
app.use(globalErrorHandler);

// exporting app
module.exports = app;
