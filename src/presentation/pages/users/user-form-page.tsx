import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const UserFormPage: React.FC = () => {
  return (
    <Box>
      <VStack align="stretch" gap={6}>
        <Heading size="lg">Add/Edit User</Heading>
        <Text color="fg.muted">
          Create a new user or edit an existing one.
        </Text>
      </VStack>
    </Box>
  );
}; 