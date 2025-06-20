class Logger {
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
      console.log('[LOG]', ...args)
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

