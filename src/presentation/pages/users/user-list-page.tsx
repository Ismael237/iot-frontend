import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const UserListPage: React.FC = () => {
  return (
    <Box>
      <VStack align="stretch" gap={6}>
        <Heading size="lg">Users</Heading>
        <Text color="fg.muted">
          Manage system users and their permissions.
        </Text>
      </VStack>
    </Box>
  );
}; 