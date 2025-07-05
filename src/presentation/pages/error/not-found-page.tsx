import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import { LuHouse, LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useColorModeValue } from '@presentation/components/ui/chakra/color-mode';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Box
        bg={cardBg}
        p={12}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="xl"
        textAlign="center"
        maxW="500px"
        w="full"
        mx={4}
      >
        <VStack gap={6}>
          <Heading size="2xl" color="gray.500">
            404
          </Heading>
          <Heading size="lg" color="fg.default">
            Page Not Found
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            The page you're looking for doesn't exist or has been moved.
          </Text>
          
          <VStack gap={4} pt={4}>
            <Button
             colorPalette="blue"
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              <LuHouse />Go to Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <LuArrowLeft />Go Back
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}; 