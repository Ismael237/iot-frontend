import { useEffect, useRef } from 'react';

interface UsePollingOptions {
  enabled?: boolean;
  interval?: number;
  onError?: (error: Error) => void;
}

export const usePolling = (
  callback: () => Promise<void> | void,
  options: UsePollingOptions = {}
) => {
  const { enabled = true, interval = 5000, onError } = options;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const executeCallback = async () => {
      try {
        await callback();
      } catch (error) {
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    };

    // Execute immediately
    executeCallback();

    // Set up interval
    intervalRef.current = setInterval(executeCallback, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [callback, enabled, interval, onError]);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startPolling = () => {
    if (!intervalRef.current && enabled) {
      intervalRef.current = setInterval(callback, interval);
    }
  };

  return {
    stopPolling,
    startPolling
  };
}; 