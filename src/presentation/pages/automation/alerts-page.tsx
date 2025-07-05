import React, { useEffect, useState } from 'react';
import { Box, Heading, Select, Spinner, Alert, Stack, createListCollection } from '@chakra-ui/react';
import { apiClient } from '@infrastructure/api/axios-client';
import AlertList from '@components/automation/alert-list';
import { AlertType } from '@shared/types/automation.types';

const SEVERITIES = [
  { label: 'All', value: '' },
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
  { label: 'Critical', value: 'critical' },
];

export const AlertsPage: React.FC = () => {
  const mockAlerts: AlertType[] = [
    {
      id: 'alert-001',
      title: 'Temperature Alert',
      message: 'Coop temperature has exceeded 85°F (29.4°C)',
      severity: 'warning',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      source: 'temperature-sensor-01',
      location: 'Chicken Coop',
      acknowledged: false,
      category: 'environmental',
      metadata: {
        currentTemp: 87,
        threshold: 85,
        unit: '°F'
      }
    },
    {
      id: 'alert-002',
      title: 'Humidity Alert',
      message: 'Humidity levels are too low for optimal chicken health',
      severity: 'error',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      source: 'humidity-sensor-01',
      location: 'Chicken Coop',
      acknowledged: true,
      category: 'environmental',
      metadata: {
        currentHumidity: 35,
        threshold: 40,
        unit: '%'
      }
    },
    {
      id: 'alert-003',
      title: 'Feed Level Low',
      message: 'Automatic feeder is running low on feed',
      severity: 'info',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      source: 'feeder-sensor-01',
      location: 'Chicken Coop',
      acknowledged: false,
      category: 'maintenance',
      metadata: {
        remainingFeed: 15,
        threshold: 20,
        unit: '%'
      }
    },
    {
      id: 'alert-004',
      title: 'Water System Failure',
      message: 'Automatic water dispenser is not functioning properly',
      severity: 'critical',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      source: 'water-sensor-01',
      location: 'Chicken Coop',
      acknowledged: false,
      category: 'system',
      metadata: {
        waterLevel: 0,
        threshold: 10,
        unit: '%'
      }
    },
    {
      id: 'alert-005',
      title: 'Door Status Alert',
      message: 'Coop door has been open for more than 30 minutes',
      severity: 'warning',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      source: 'door-sensor-01',
      location: 'Chicken Coop',
      acknowledged: false,
      category: 'security',
      metadata: {
        doorStatus: 'open',
        duration: 35,
        unit: 'minutes'
      }
    },
    {
      id: 'alert-006',
      title: 'Ventilation System Offline',
      message: 'Air circulation system is not responding',
      severity: 'error',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      source: 'ventilation-controller-01',
      location: 'Chicken Coop',
      acknowledged: true,
      category: 'system',
      metadata: {
        fanSpeed: 0,
        threshold: 1,
        unit: 'rpm'
      }
    }
  ];

  const [alerts, setAlerts] = useState<AlertType[]>(mockAlerts);
  const [severity, setSeverity] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const severityCollection = createListCollection({
    items: SEVERITIES,
  });

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = severity ? { severity: severity[0] } : {};
      const response = await apiClient.get('/automation/alerts', { params });
      setAlerts(response.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [severity]);

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Automation Alerts</Heading>
      <Stack direction={{ base: 'column', md: 'row' }} mb={4} gap={4} align="center">
        <Select.Root
          collection={severityCollection}
          value={severity}
          onValueChange={({ value }) => setSeverity(value)}
          width="full"
        >
          <Select.HiddenSelect />
          <Select.Label>Severity</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select severity" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {severityCollection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Stack>
      {loading ? (
        <Spinner size="lg" />
      ) : error && alerts.length === 0 ? (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      ) : (
        <AlertList alerts={alerts} />
      )}
    </Box>
  );
};

export default AlertsPage; 