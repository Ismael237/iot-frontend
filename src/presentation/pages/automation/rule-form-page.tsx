import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const RuleFormPage: React.FC = () => {
  return (
    <Box>
      <VStack align="stretch" gap={6}>
        <Heading size="lg">Add/Edit Automation Rule</Heading>
        <Text color="fg.muted">
          Create a new automation rule or edit an existing one.
        </Text>
      </VStack>
    </Box>
  );
}; 