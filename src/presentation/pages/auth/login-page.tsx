import React from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Container,
  Heading,
  ListItem,
  ListRoot,
  ListIndicator,
} from '@chakra-ui/react';
import { CheckCircle, Shield, Zap, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@components/auth/login-form';
import { useColorModeValue } from '@ui/chakra/color-mode';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
  };

  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* Left Side - Login Form */}
      <Flex
        flex="1"
        align="center"
        justify="center"
        p={8}
        bg={cardBg}
        borderRight="1px"
        borderColor={borderColor}
      >
        <Container maxW="md">
          <VStack gap={8} align="stretch">
            {/* Logo and Brand */}
            <VStack gap={4} textAlign="center">
              <Box
                w="60px"
                h="60px"
                bg="blue.500"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Zap size={32} color="white" />
              </Box>
              <Heading size="lg" color="gray.800">
                IoT Dashboard
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Smart device management platform
              </Text>
            </VStack>

            {/* Login Form */}
            <LoginForm
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              redirectTo="/dashboard"
            />
          </VStack>
        </Container>
      </Flex>

      {/* Right Side - Hero Section */}
      <Flex
        flex="1"
        direction="column"
        justify="center"
        align="center"
        p={12}
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        position="relative"
        overflow="hidden"
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.1"
          backgroundImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        />

        <VStack gap={8} align="center" position="relative" zIndex={1}>
          {/* Hero Content */}
          <VStack gap={6} textAlign="center" maxW="lg">
            <Heading size="2xl" fontWeight="bold">
              Welcome to IoT Dashboard
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Monitor, control, and automate your smart devices from a single, powerful dashboard.
              Get real-time insights and manage your IoT ecosystem with ease.
            </Text>
          </VStack>

          {/* Features List */}
          <VStack gap={4} align="start" maxW="md">
            <Text fontSize="lg" fontWeight="semibold" mb={2}>
              Key Features:
            </Text>
            <ListRoot gap={3}>
              <ListItem>
                <HStack gap={3}>
                  <ListIndicator asChild color="green.300" >
                  <CheckCircle />
                  </ListIndicator>
                  <Text>Real-time device monitoring</Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack gap={3}>
                  <ListIndicator asChild color="blue.300" >
                  <Shield />
                  </ListIndicator>
                  <Text>Secure authentication & authorization</Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack gap={3}>
                  <ListIndicator asChild color="yellow.300" >
                  <Zap />
                  </ListIndicator>
                  <Text>Automated device control</Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack gap={3}>
                  <ListIndicator asChild color="purple.300" >
                  <BarChart3 />
                  </ListIndicator>
                  <Text>Advanced analytics & reporting</Text>
                </HStack>
              </ListItem>
            </ListRoot>
          </VStack>

          {/* Demo Info */}
          <Box
            bg="rgba(255, 255, 255, 0.1)"
            p={6}
            borderRadius="lg"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255, 255, 255, 0.2)"
          >
            <VStack gap={3} textAlign="center">
              <Text fontSize="sm" fontWeight="medium" opacity={0.9}>
                🚀 Demo Mode
              </Text>
              <Text fontSize="xs" opacity={0.8}>
                Use the demo credentials to explore the platform
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default LoginPage; 