import React from 'react';
import { CardRoot, CardBody, Stack, Text, Badge, Box } from '@chakra-ui/react';
import type { AutomationRule } from '@domain/entities/automation.entity';

interface RuleCardProps {
  rule: AutomationRule;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule }) => {
  return (
    <CardRoot variant="outline" borderColor={rule.isActive ? 'green.400' : 'gray.200'}>
      <CardBody>
        <Stack gap={2}>
          <Stack direction="row" align="center" justify="space-between">
            <Text fontWeight="bold">{rule.name}</Text>
            <Badge colorPalette={rule.isActive ? 'green' : 'gray'}>{rule.isActive ? 'Active' : 'Inactive'}</Badge>
          </Stack>
          {rule.description && <Text fontSize="sm" color="gray.600">{rule.description}</Text>}
          <Box>
            <Text fontSize="sm" fontWeight="semibold">Condition:</Text>
            <Text fontSize="sm">
              Sensor #{rule.sensorDeploymentId} {rule.operator} {rule.thresholdValue}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="semibold">Action:</Text>
            <Text fontSize="sm">
              {rule.actionType === 'create_alert' as const? (
                <>Create Alert: <b>{rule.alertTitle}</b> ({rule.alertSeverity})</>
              ) : rule.actionType === 'trigger_actuator' as const? (
                <>Trigger Actuator #{rule.targetDeploymentId} - Command: <b>{rule.actuatorCommand}</b></>
              ) : (
                <>Unknown</>
              )}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </CardRo>
  );
};

export default RuleCard; 