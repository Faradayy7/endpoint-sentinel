/**
 * Utilidad simple para logging con diferentes niveles
 */
export class Logger {
  constructor(context) {
    this.context = context;
    this.logLevel = this.getLogLevel();
  }

  getLogLevel() {
    const level = process.env.LOG_LEVEL?.toLowerCase() || 'info';
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    return levels[level] || levels.info;
  }

  log(level, message, ...args) {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    if (levels[level] <= this.logLevel) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`;
      console.log(formattedMessage, ...args);
    }
  }

  error(message, ...args) {
    this.log('error', message, ...args);
  }

  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  info(message, ...args) {
    this.log('info', message, ...args);
  }

  debug(message, ...args) {
    this.log('debug', message, ...args);
  }
}
