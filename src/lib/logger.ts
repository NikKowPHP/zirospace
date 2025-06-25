class Logger {
  private isPlainObject(value:unknown) {
    
  return Object.prototype.toString.call(value) === '[object Object]';

  }
  private jsonStringify(obj: unknown) {
    JSON.stringify(obj, null, 2);
  }
  warn(...args: unknown[]) {
    if (!Logger.isProduction) {
      console.warn('[WARN]', ...args)
    }
  }
  // Determine the environment so logging can be disabled in production.
  private static readonly isProduction: boolean =false
    // process.env.NODE_ENV === 'production' 

  log(...args: unknown[]): void {
    if (!Logger.isProduction) {
      // If the first argument is a plain object, pretty-print it
      if (args.length === 1 && this.isPlainObject(args[0])) {
        console.log('[LOG]', this.jsonStringify(args[0]));
      } else {
        // Otherwise, log all arguments as they are
        console.log('[LOG]', ...args);
      }
    }
  }

  error(...args: unknown[]): void {
    if (!Logger.isProduction) {
      console.error('[ERROR]', ...args)
    }
  }
}

const logger = new Logger()
export default logger

