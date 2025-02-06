import { supabaseAdmin } from '@/lib/supabase'; // Import your supabaseAdmin client

export class Logger {
  private static readonly isProduction = process.env.NODE_ENV === 'production';

  static log(message: string) {
    if (!Logger.isProduction) {
      console.log(`[LOG]: ${message}`); // Keep console log in development
    }
    // In production, we will not log to console for 'log' level
  }

  static error(message: string) {
    console.error(`[ERROR]: ${message}`); // Always log errors to console in dev for visibility

    if (Logger.isProduction) {
      // In production, write errors to the database using supabaseAdmin
      Logger.writeErrorToDatabase(message).catch(error => {
        console.error("Error writing to database logger:", error); // Fallback console log if db write fails
      });
    }
  }

  private static async writeErrorToDatabase(message: string) {
    if (!supabaseAdmin) {
      console.error("supabaseAdmin is not initialized. Ensure it's set up for server-side usage.");
      return;
    }

    const { error } = await supabaseAdmin
      .from('logs') // Replace 'logs' with your actual table name
      .insert([
        {
          timestamp: new Date().toISOString(),
          level: 'error',
          message: message,
        },
      ]);

    if (error) {
      console.error("Failed to write error log to database:", error);
      throw error; // Re-throw to be caught in the error handler in Logger.error
    }
  }
}

export const logger = new Logger();
