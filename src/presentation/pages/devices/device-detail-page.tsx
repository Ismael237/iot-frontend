import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Stack, Spinner, Alert, Button, Badge } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@infrastructure/api/axios-client';
import type { Device } from '@shared/types/device.types';

export const DeviceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevice = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/devices/${id}`);
        setDevice(response);
      } catch (err: any) {
        setError(err?.message || 'Failed to load device');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDevice();
  }, [id]);

  if (loading) return <Spinner size="lg" />;
  if (error) return <Alert.Root status="error"><Alert.Description>{error}</Alert.Description></Alert.Root>;
  if (!device) return <Text>No device found.</Text>;

  return (
    <Box p={6}>
      <Button mb={4} onClick={() => navigate(-1)}>Back</Button>
      <Heading size="lg" mb={2}>{device.identifier}</Heading>
      <Stack direction="row" align="center" mb={2}>
        <Badge colorPalette={device.active ? 'green' : 'red'}>{device.active ? 'Active' : 'Inactive'}</Badge>
        <Text fontSize="sm" color="gray.500">{device.device_type}</Text>
      </Stack>
      <Text fontSize="sm" color="gray.600">Model: {device.model || 'N/A'}</Text>
      <Text fontSize="sm" color="gray.600">Last seen: {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}</Text>

      {/* Component deployments info if available */}
      {device.components && device.components.length > 0 && (
        <Box>
          <Heading size="md" mb={2}>Component Deployments</Heading>
          <Stack gap={2}>
            {device.components.map((c: any) => (
              <Box key={c.id} p={2} borderWidth={1} borderRadius="md">
                <Text fontWeight="bold">Type: {c.component_type?.name || c.component_type_id}</Text>
                <Text fontSize="sm">Active: {c.active ? 'Yes' : 'No'}</Text>
                <Text fontSize="sm">Status: {c.status}</Text>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}; 