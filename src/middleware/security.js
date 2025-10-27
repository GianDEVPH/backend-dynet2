// Security middleware providing rate limiting, input validation, request sanitization, and XSS protection.

const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            error: message,
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};
const rateLimits = {
    auth: createRateLimiter(15 * 60 * 1000, 5, 'Too many authentication attempts'),
    api: createRateLimiter(15 * 60 * 1000, 100, 'Too many API requests'),
    upload: createRateLimiter(60 * 60 * 1000, 10, 'Too many file uploads'),
    general: createRateLimiter(15 * 60 * 1000, 1000, 'Too many requests')
};
const validationSchemas = {
    user: [
        body('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name must be 2-100 characters and contain only letters'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 8 })
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character')
    ],
    location: [
        body('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .matches(/^[a-zA-Z0-9\s\-_]+$/)
            .withMessage('Name must be 2-100 characters and contain only letters, numbers, spaces, hyphens, and underscores')
    ],
    objectId: [
        body('id')
            .isMongoId()
            .withMessage('Invalid ID format')
    ]
};
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.param,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};
const sanitizeRequest = (req, res, next) => {
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
    };
    const sanitizeObject = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = sanitizeString(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
    next();
};
module.exports = {
    rateLimits,
    validationSchemas,
    handleValidationErrors,
    sanitizeRequest
};
