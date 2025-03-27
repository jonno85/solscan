import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info', // Minimum level of logs to record
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }), // Log the stack trace for errors
    winston.format.splat(), // Support for %s, %d, etc. in log messages
    winston.format.json() // Log in JSON format (good for structured logging)
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add colors to console output
        winston.format.simple() // Use a simpler output format for console
      ),
    }),
    // You can add more transports here, like logging to a file:
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

export default logger;
