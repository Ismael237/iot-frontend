import { Box, Text, Stack, Badge, CardRoot, CardBody } from '@chakra-ui/react';
import type { Alert as AlertType } from '@domain/entities/automation.entity';

interface AlertListProps {
  alerts: AlertType[];
}

const severityColor: Record<string, string> = {
  info: 'blue',
  warning: 'yellow',
  error: 'red',
  critical: 'purple',
};

const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return <Text>No alerts found.</Text>;
  }
  return (
    <Stack gap={4}>
      {alerts.map(alert => (
        <CardRoot key={alert.id} variant="outline" borderColor={severityColor[alert.severity] || 'gray.200'} shadow="xs">
          <CardBody>
            <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold">{alert.title}</Text>
                <Text fontSize="sm" color="gray.600">{alert.message}</Text>
              </Box>
              <Stack direction="row" align="center">
                <Badge colorPalette={severityColor[alert.severity] || 'gray'}>{alert.severity}</Badge>
                <Text fontSize="xs" color="gray.500">{new Date(alert.createdAt).toLocaleString()}</Text>
              </Stack>
            </Stack>
          </CardBody>
        </CardRoot>
      ))}
    </Stack>
  );
};

export default AlertList; 