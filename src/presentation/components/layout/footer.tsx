import React from 'react';
import {
  Box,
  Container,
  Text,
  HStack,
  Link,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { Heart, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      as="footer"
      bg={bgColor}
      borderTop="1px solid"
      borderColor={borderColor}
      py={6}
      mt="auto"
    >
      <Container maxW="container.xl">
        <HStack justify="space-between" align="center">
          <Text color={textColor} fontSize="sm">
            © 2024 IoT Management System. Made with{' '}
            <Icon as={Heart} color="red.500" mx={1} />
            by DevTeam
          </Text>
          
          <HStack gap={4}>
            <Link
              href="https://github.com/your-repo"
              isExternal
              color={textColor}
              _hover={{ color: 'blue.500' }}
              fontSize="sm"
            >
              <HStack gap={1}>
                <Icon as={Github} size={16} />
                <Text>GitHub</Text>
                <Icon as={ExternalLink} size={12} />
              </HStack>
            </Link>
            
            <Link
              href="/docs"
              color={textColor}
              _hover={{ color: 'blue.500' }}
              fontSize="sm"
            >
              Documentation
            </Link>
            
            <Link
              href="/support"
              color={textColor}
              _hover={{ color: 'blue.500' }}
              fontSize="sm"
            >
              Support
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}; 