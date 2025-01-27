"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Bad Request',
            details: err.details,
        });
    }
    // Respuesta estándar para otros tipos de error
    return res.status(500).json({
        message: err.message || 'Internal Server Error',
        stack: err.stack || null,
    });
};
exports.default = errorHandler;
