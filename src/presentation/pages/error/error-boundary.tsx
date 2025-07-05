import { Component, type ErrorInfo, type ReactNode } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import { LuRefreshCw, LuHouse } from 'react-icons/lu';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
          p={4}
        >
          <Box
            bg="white"
            p={8}
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="xl"
            textAlign="center"
            maxW="500px"
            w="full"
          >
            <VStack gap={6}>
              <Heading size="lg" color="red.500">
                Something went wrong
              </Heading>
              <Text color="gray.600">
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </Text>
              
              {import.meta.env.VITE_APP_ENV === 'development' && this.state.error && (
                <Box
                  p={4}
                  bg="gray.100"
                  borderRadius="md"
                  textAlign="left"
                  w="full"
                >
                  <Text fontSize="sm" fontFamily="mono" color="gray.700">
                    {this.state.error.toString()}
                  </Text>
                </Box>
              )}
              
              <VStack gap={4} pt={4}>
                <Button
                 colorPalette="blue"
                  size="lg"
                  onClick={this.handleReload}
                ><LuRefreshCw />
                  Reload Page
                </Button>
                <Button
                  variant="ghost"
                  onClick={this.handleGoHome}
                ><LuHouse />
                  Go to Dashboard
                </Button>
              </VStack>
            </VStack>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
} 