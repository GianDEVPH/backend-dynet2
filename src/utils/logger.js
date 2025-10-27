// Logging utility providing structured logging with different levels and request tracking.

const fs = require('fs');
const path = require('path');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};
class Logger {
    constructor(level = LOG_LEVELS.INFO) {
        this.level = level;
        this.logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
        this.errorFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);
    }
    formatMessage(level, message, metadata = {}) {
        const timestamp = new Date().toISOString();
        const logObject = {
            timestamp,
            level,
            message,
            ...metadata
        };
        return JSON.stringify(logObject) + '\n';
    }
    writeToFile(filename, content) {
        try {
            fs.appendFileSync(filename, content);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }
    log(level, message, metadata = {}) {
        if (level > this.level) return;
        const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
        const levelName = levelNames[level];
        const formattedMessage = this.formatMessage(levelName, message, metadata);
        const colors = {
ERROR: '\x1b[31m',
WARN: '\x1b[33m',
INFO: '\x1b[36m',
DEBUG: '\x1b[35m'
        };
        const reset = '\x1b[0m';
        console.log(`${colors[levelName]}[${levelName}]${reset} ${message}`, metadata);
        this.writeToFile(this.logFile, formattedMessage);
        if (level === LOG_LEVELS.ERROR) {
            this.writeToFile(this.errorFile, formattedMessage);
        }
    }
    error(message, metadata = {}) {
        this.log(LOG_LEVELS.ERROR, message, metadata);
    }
    warn(message, metadata = {}) {
        this.log(LOG_LEVELS.WARN, message, metadata);
    }
    info(message, metadata = {}) {
        this.log(LOG_LEVELS.INFO, message, metadata);
    }
    debug(message, metadata = {}) {
        this.log(LOG_LEVELS.DEBUG, message, metadata);
    }
    requestLogger() {
        return (req, res, next) => {
            const start = Date.now();
            const originalSend = res.send;
            res.send = function(data) {
                const duration = Date.now() - start;
                const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
                const reset = '\x1b[0m';
                logger.info(`${req.method} ${req.originalUrl}`, {
                    method: req.method,
                    url: req.originalUrl,
                    statusCode: res.statusCode,
                    duration: `${duration}ms`,
                    userAgent: req.get('User-Agent'),
                    ip: req.ip || req.connection.remoteAddress
                });
                console.log(`${statusColor}${res.statusCode}${reset} ${req.method} ${req.originalUrl} - ${duration}ms`);
                return originalSend.call(this, data);
            };
            next();
        };
    }
    errorLogger() {
        return (err, req, res, next) => {
            this.error('Unhandled error occurred', {
                error: err.message,
                stack: err.stack,
                method: req.method,
                url: req.originalUrl,
                body: req.body,
                query: req.query,
                params: req.params,
                userAgent: req.get('User-Agent'),
                ip: req.ip || req.connection.remoteAddress
            });
            next(err);
        };
    }
    performance(label, fn) {
        return async (...args) => {
            const start = process.hrtime.bigint();
            try {
                const result = await fn(...args);
                const end = process.hrtime.bigint();
const duration = Number(end - start) / 1000000;
if (duration > 1000) {
                    this.warn(`Slow operation detected: ${label}`, {
                        duration: `${duration.toFixed(2)}ms`,
                        operation: label
                    });
                }
                return result;
            } catch (error) {
                const end = process.hrtime.bigint();
                const duration = Number(end - start) / 1000000;
                this.error(`Operation failed: ${label}`, {
                    duration: `${duration.toFixed(2)}ms`,
                    operation: label,
                    error: error.message
                });
                throw error;
            }
        };
    }
}
const logger = new Logger(
    process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO
);
module.exports = logger;
