class Logger {
  // Determine the environment so logging can be disabled in production.
  private static readonly isProduction: boolean =
    process.env.NODE_ENV === 'production';

   log(...args: unknown[]): void {
    if (!Logger.isProduction) {
      console.log(...args);
    }
  }

  error(...args: unknown[]): void {
    // if (!Logger.isProduction) {
      console.error(...args);
    // }
  }

}

const logger = new Logger();
export default logger;