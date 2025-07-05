import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const ZoneManagementPage: React.FC = () => {
  return (
    <Box>
      <VStack align="stretch" gap={6}>
        <Heading size="lg">Zone Management</Heading>
        <Text color="fg.muted">
          Organize devices and components into zones.
        </Text>
      </VStack>
    </Box>
  );
}; 