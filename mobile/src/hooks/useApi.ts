import { useState, useEffect, useCallback } from 'react';

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  fallback?: T | (() => T),
  deps: any[] = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      const message = err?.message || 'Something went wrong';
      setError(message);
      // Use fallback on error
      if (fallback !== undefined) {
        const fallbackData = typeof fallback === 'function' ? (fallback as () => T)() : fallback;
        setData(fallbackData);
      }
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
