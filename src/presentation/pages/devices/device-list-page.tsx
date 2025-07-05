import React, { useEffect, useState } from 'react';
import { Box, Heading, Button, Spinner, Alert, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@infrastructure/api/axios-client';
import type { Device } from '@shared/types/device.types';
import DeviceTable from '@components/devices/device-table';

export const DeviceListPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/devices?skip=0&limit=50');
      setDevices(response.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <Box p={6}>
      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" mb={4}>
        <Heading size="lg">Devices</Heading>
        <Button colorPalette="blue" onClick={() => navigate('/devices/new')}>Add Device</Button>
      </Stack>
      {loading ? (
        <Spinner size="lg" />
      ) : error ? (
        <Alert.Root status="error" mb={4}>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      ) : (
        <DeviceTable devices={devices} />
      )}
    </Box>
  );
}; 