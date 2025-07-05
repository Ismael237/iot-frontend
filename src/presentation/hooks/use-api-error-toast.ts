import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

interface UseApiErrorToastProps {
  error: string | null;
  clearError: () => void;
  title?: string;
}

export const useApiErrorToast = ({ 
  error, 
  clearError, 
  title = 'Error' 
}: UseApiErrorToastProps) => {
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title,
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      clearError();
    }
  }, [error, clearError, toast, title]);
}; 