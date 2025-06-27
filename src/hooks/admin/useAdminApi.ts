import logger from '@/lib/logger';
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseAdminApiOptions {
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

const useAdminApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = useCallback(
    async <T>(
      url: string,
      options: RequestInit,
      messages: UseAdminApiOptions = {}
    ): Promise<T> => {
      const { loadingMessage, successMessage, errorMessage } = messages;

      setLoading(true);
      setError(null);

      try {
        if (loadingMessage) {
          toast.loading(loadingMessage, { id: 'apiCall' });
        }

        const response = await fetch(url, options);
        

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'API call failed' }));
          throw new Error(errorData.details || errorData.error || errorMessage || 'API call failed');
        }

        const data: T = await response.json();

        if (successMessage) {
          toast.success(successMessage, { id: 'apiCall' });
        }

        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : errorMessage || 'An unexpected error occurred';
        setError(message);
        logger.error(err);
        toast.error(message, { id: 'apiCall' });
        throw err; // Re-throw to allow component-level handling
      } finally {
        setLoading(false);
        toast.dismiss('apiCall');
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { loading, error, callApi, clearError };
};

export default useAdminApi;