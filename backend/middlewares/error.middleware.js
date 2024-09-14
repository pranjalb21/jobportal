class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || `Internal server error.`;

    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, err.statusCode);
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Invalid token. Try again.`;
        err = new ErrorHandler(message, err.statusCode);
    }
    if (err.name === "TokenExpiredError") {
        const message = `Token expired. Please login.`;
        err = new ErrorHandler(message, err.statusCode);
    }
    if (err.code === 110000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
        err = new ErrorHandler(message, err.statusCode);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        err,
    });
};

export default ErrorHandler;
