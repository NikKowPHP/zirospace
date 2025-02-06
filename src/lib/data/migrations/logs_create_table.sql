CREATE TABLE public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, -- Unique ID for each log entry
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the log was recorded, with timezone
    level TEXT, -- Log level (e.g., 'error', 'log', 'info', 'debug')
    message TEXT -- The actual log message
);