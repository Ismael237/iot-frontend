import React from 'react';
import { Table, Button, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { Device } from '@shared/types/device.types';

interface DeviceTableProps {
  devices: Device[];
}

const DeviceTable: React.FC<DeviceTableProps> = ({ devices }) => {
  const navigate = useNavigate();
  if (!devices || devices.length === 0) {
    return <p>No devices found.</p>;
  }
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Cell>Name</Table.Cell>
          <Table.Cell>Type</Table.Cell>
          <Table.Cell>Status</Table.Cell>
          <Table.Cell>Last Seen</Table.Cell>
          <Table.Cell>Actions</Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {devices.map(device => (
          <Table.Row key={device.id}>
            <Table.Cell>{device.identifier}</Table.Cell>
            <Table.Cell>{device.device_type}</Table.Cell>
            <Table.Cell>
              <Badge colorPalette={device.active ? 'green' : 'red'}>
                {device.active ? 'Active' : 'Inactive'}
              </Badge>
            </Table.Cell>
            <Table.Cell>{device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}</Table.Cell>
            <Table.Cell>
              <Button size="sm" mr={2} onClick={() => navigate(`/devices/${device.id}`)}>View</Button>
              <Button size="sm" variant="outline" onClick={() => navigate(`/devices/${device.id}/edit`)}>Edit</Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default DeviceTable; 