import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const ProfilePage: React.FC = () => {
  return (
    <Box>
      <VStack align="stretch" gap={6}>
        <Heading size="lg">Profile</Heading>
        <Text color="fg.muted">
          Manage your user profile and account settings.
        </Text>
      </VStack>
    </Box>
  );
}; 