import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { Card } from '@ui/card';

export const ActuatorHistoryPage: React.FC = () => {
  return (
    <Box>
      <VStack align="stretch" gap={6}>
        <Heading size="lg">Actuator History</Heading>
        <Text color="fg.muted">
          View command history for actuators.
        </Text>
        
        <Card>
          <Card.Body>
            <VStack gap={4} py={8}>
              <Text color="gray.500" fontSize="lg">
                Command history will be displayed here
              </Text>
              <Text color="gray.400" fontSize="sm">
                This feature is coming soon
              </Text>
            </VStack>
          </Card.Body>
        </Card>
      </VStack>
    </Box>
  );
}; 