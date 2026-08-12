"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.AppError = exports.asyncHandler = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const globalErrorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    if (err.code === 'P2002') {
        return (0, apiResponse_1.errorResponse)(res, 'Resource already exists', 409, err.message);
    }
    if (err.code === 'P2025') {
        return (0, apiResponse_1.errorResponse)(res, 'Resource not found', 404, err.message);
    }
    return (0, apiResponse_1.errorResponse)(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
exports.globalErrorHandler = globalErrorHandler;
