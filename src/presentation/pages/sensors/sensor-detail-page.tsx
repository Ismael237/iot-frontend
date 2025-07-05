import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  Badge,
  Button,
  HStack,
  VStack,
  Icon,
  Progress,
  Stat,
  Tabs,
  Menu,
  Alert,
  useDisclosure,
  Input,
  Select,
  Switch,
  Textarea,
  IconButton,
  Table,
  Dialog,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import {
  Settings,
  Edit,
  Trash2,
  MoreVertical,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  MapPin,
  Battery,
  Signal,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Field } from '@/presentation/components/ui/chakra/field';
import { useColorModeValue } from '@presentation/components/ui/chakra/color-mode';

interface SensorReading {
  id: string;
  timestamp: string;
  value: number;
  unit: string;
  quality: 'good' | 'fair' | 'poor';
}

interface SensorDetail {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  lastReading: {
    value: number;
    unit: string;
    timestamp: string;
  };
  specifications: {
    manufacturer: string;
    model: string;
    accuracy: string;
    range: string;
    resolution: string;
  };
  configuration: {
    samplingRate: string;
    threshold: number;
    alerts: boolean;
    calibration: string;
  };
  performance: {
    uptime: number;
    accuracy: number;
    batteryLevel: number;
    signalStrength: number;
  };
  readings: SensorReading[];
}

const mockSensorDetail: SensorDetail = {
  id: 'sensor-001',
  name: 'Living Room Temperature Sensor',
  type: 'Temperature Sensor',
  location: 'Living Room',
  status: 'online',
  lastReading: {
    value: 23.5,
    unit: '°C',
    timestamp: '2024-01-15T14:30:00Z',
  },
  specifications: {
    manufacturer: 'IoT Solutions Inc.',
    model: 'TS-2000',
    accuracy: '±0.5°C',
    range: '-40°C to +85°C',
    resolution: '0.1°C',
  },
  configuration: {
    samplingRate: 'Every 30 seconds',
    threshold: 25.0,
    alerts: true,
    calibration: '2024-01-01',
  },
  performance: {
    uptime: 99.8,
    accuracy: 98.5,
    batteryLevel: 85,
    signalStrength: 92,
  },
  readings: [
    { id: '1', timestamp: '2024-01-15T14:30:00Z', value: 23.5, unit: '°C', quality: 'good' },
    { id: '2', timestamp: '2024-01-15T14:29:30Z', value: 23.4, unit: '°C', quality: 'good' },
    { id: '3', timestamp: '2024-01-15T14:29:00Z', value: 23.6, unit: '°C', quality: 'good' },
    { id: '4', timestamp: '2024-01-15T14:28:30Z', value: 23.3, unit: '°C', quality: 'good' },
    { id: '5', timestamp: '2024-01-15T14:28:00Z', value: 23.7, unit: '°C', quality: 'good' },
    { id: '6', timestamp: '2024-01-15T14:27:30Z', value: 23.2, unit: '°C', quality: 'fair' },
    { id: '7', timestamp: '2024-01-15T14:27:00Z', value: 23.8, unit: '°C', quality: 'good' },
    { id: '8', timestamp: '2024-01-15T14:26:30Z', value: 23.1, unit: '°C', quality: 'good' },
    { id: '9', timestamp: '2024-01-15T14:26:00Z', value: 23.9, unit: '°C', quality: 'good' },
    { id: '10', timestamp: '2024-01-15T14:25:30Z', value: 23.0, unit: '°C', quality: 'good' },
  ],
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return CheckCircle;
    case 'offline':
      return WifiOff;
    case 'error':
      return AlertTriangle;
    case 'maintenance':
      return Clock;
    default:
      return Wifi;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';
    case 'error':
      return 'orange';
    case 'maintenance':
      return 'yellow';
    default:
      return 'gray';
  }
};

const getQualityColor = (quality: string) => {
  switch (quality) {
    case 'good':
      return 'green';
    case 'fair':
      return 'yellow';
    case 'poor':
      return 'red';
    default:
      return 'gray';
  }
};

export const SensorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState<SensorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const samplingRateCollection = createListCollection({
    items: [
      { label: 'Every 10 seconds', value: '10s' },
      { label: 'Every 30 seconds', value: '30s' },
      { label: 'Every minute', value: '1m' },
      { label: 'Every 5 minutes', value: '5m' },
    ],
  });

  useEffect(() => {
    // Simulate API call
    const loadSensor = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSensor(mockSensorDetail);
      setIsLoading(false);
    };

    loadSensor();
  }, [id]);

  const handleRefresh = () => {
    // Refresh sensor data
    console.log('Refreshing sensor data...');
  };

  const handleEdit = () => {
    setIsEditing(true);
    onOpen();
  };

  const handleSave = () => {
    // Save sensor configuration
    console.log('Saving sensor configuration...');
    setIsEditing(false);
    onClose();
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center" py={12}>
            <Icon as={RefreshCw} size="lg" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">Loading sensor details...</Text>
          </Box>
        </VStack>
      </Container>
    );
  }

  if (!sensor) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>Sensor not found</Alert.Title>
          </Alert.Root>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <Box>
            <HStack mb={2}>
              <IconButton variant="ghost" onClick={() => navigate('/sensors')}>
                <Icon as={Settings} />
              </IconButton>
              <Heading size="lg">{sensor.name}</Heading>
            </HStack>
            <HStack gap={4}>
              <Badge colorPalette={getStatusColor(sensor.status)} variant="subtle">
                {sensor.status}
              </Badge>
              <Text color="gray.600">{sensor.type}</Text>
              <HStack>
                <Icon as={MapPin} size="sm" />
                <Text fontSize="sm" color="gray.500">{sensor.location}</Text>
              </HStack>
            </HStack>
          </Box>

          <HStack gap={2}>
            <Button
              variant="outline"
              onClick={handleRefresh}
            >
              <Icon as={RefreshCw} />Refresh
            </Button>
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton variant="ghost" size="sm" aria-label="More">
                  <MoreVertical />
                </IconButton>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="edit" onClick={handleEdit}>
                    <Edit />Edit Configuration
                  </Menu.Item>
                  <Menu.Item value="analytics">
                    <BarChart3 />View Analytics
                  </Menu.Item>
                  <Menu.Item value="export-data">
                    <Download />Export Data
                  </Menu.Item>
                  <Menu.Item value="delete-sensor" color="red.500">
                    <Trash2 />Delete Sensor
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </HStack>
        </HStack>

        {/* Current Reading */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Header>
            <HStack justify="space-between">
              <Heading size="md">Current Reading</Heading>
              <HStack>
                <Icon as={getStatusIcon(sensor.status)} color={`${getStatusColor(sensor.status)}.500`} />
                <Text fontSize="sm" color="gray.500">
                  Last updated: {new Date(sensor.lastReading.timestamp).toLocaleTimeString()}
                </Text>
              </HStack>
            </HStack>
          </Card.Header>
          <Card.Body>
            <HStack justify="center" gap={8}>
              <VStack>
                <Text fontSize="6xl" fontWeight="bold" color="blue.500">
                  {sensor.lastReading.value}
                </Text>
                <Text fontSize="xl" color="gray.600">{sensor.lastReading.unit}</Text>
              </VStack>
              <VStack align="start" gap={4}>
                <HStack>
                  <Icon as={Battery} color="green.500" />
                  <Text>Battery: {sensor.performance.batteryLevel}%</Text>
                </HStack>
                <HStack>
                  <Icon as={Signal} color="blue.500" />
                  <Text>Signal: {sensor.performance.signalStrength}%</Text>
                </HStack>
                <HStack>
                  <Icon as={Activity} color="purple.500" />
                  <Text>Uptime: {sensor.performance.uptime}%</Text>
                </HStack>
              </VStack>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Performance Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Uptime</Stat.Label>
                <Stat.ValueText>{sensor.performance.uptime}%</Stat.ValueText>
                <Stat.HelpText>
                  <Progress.Root value={sensor.performance.uptime} size="sm" colorPalette="green" >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Accuracy</Stat.Label>
                <Stat.ValueText>{sensor.performance.accuracy}%</Stat.ValueText>
                <Stat.HelpText>
                  <Progress.Root value={sensor.performance.accuracy} size="sm" colorPalette="blue" >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Battery</Stat.Label>
                <Stat.ValueText>{sensor.performance.batteryLevel}%</Stat.ValueText>
                <Stat.HelpText>
                  <Progress.Root value={sensor.performance.batteryLevel} size="sm" colorPalette="green" >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Signal</Stat.Label>
                <Stat.ValueText>{sensor.performance.signalStrength}%</Stat.ValueText>
                <Stat.HelpText>
                  <Progress.Root value={sensor.performance.signalStrength} size="sm" colorPalette="blue" >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Tabs */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Body p={0}>
            <Tabs.Root>
              <Tabs.List px={6} pt={6}>
                <Tabs.Trigger value="recent-readings">Recent Readings</Tabs.Trigger>
                <Tabs.Trigger value="specifications">Specifications</Tabs.Trigger>
                <Tabs.Trigger value="configuration">Configuration</Tabs.Trigger>
                <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="recent-readings">
                <VStack align="stretch" gap={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Recent Readings</Text>
                    <Button size="sm" variant="outline">
                      <Icon as={Download} />Export
                    </Button>
                  </HStack>

                  <Box overflowX="auto">
                    <Table.Root variant="outline" size="sm">
                      <Table.Header>
                        <Table.Row>
                          <Table.Cell>Timestamp</Table.Cell>
                          <Table.Cell>Value</Table.Cell>
                          <Table.Cell>Quality</Table.Cell>
                          <Table.Cell>Status</Table.Cell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {sensor.readings.map((reading) => (
                          <Table.Row key={reading.id}>
                            <Table.Cell fontSize="sm">
                              {new Date(reading.timestamp).toLocaleString()}
                            </Table.Cell>
                            <Table.Cell fontWeight="medium">
                              {reading.value} {reading.unit}
                            </Table.Cell>
                            <Table.Cell>
                              <Badge colorPalette={getQualityColor(reading.quality)} variant="subtle">
                                {reading.quality}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell>
                              <Icon
                                as={reading.quality === 'good' ? CheckCircle : AlertTriangle}
                                color={`${getQualityColor(reading.quality)}.500`}
                                size="md"
                              />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="specifications">
                <VStack align="stretch" gap={6}>
                  <Box>
                    <Text fontWeight="medium" mb={3}>Device Information</Text>
                    <SimpleGrid columns={2} gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Manufacturer</Text>
                        <Text>{sensor.specifications.manufacturer}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Model</Text>
                        <Text>{sensor.specifications.model}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Accuracy</Text>
                        <Text>{sensor.specifications.accuracy}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Range</Text>
                        <Text>{sensor.specifications.range}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Resolution</Text>
                        <Text>{sensor.specifications.resolution}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="configuration">
                <VStack align="stretch" gap={6}>
                  <Box>
                    <Text fontWeight="medium" mb={3}>Current Configuration</Text>
                    <SimpleGrid columns={2} gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Sampling Rate</Text>
                        <Text>{sensor.configuration.samplingRate}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Alert Threshold</Text>
                        <Text>{sensor.configuration.threshold} {sensor.lastReading.unit}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Alerts Enabled</Text>
                        <Text>{sensor.configuration.alerts ? 'Yes' : 'No'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Last Calibration</Text>
                        <Text>{sensor.configuration.calibration}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Button variant="outline" onClick={handleEdit}>
                    <Icon as={Edit} />Edit Configuration
                  </Button>
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="analytics">
                <VStack align="stretch" gap={4}>
                  <Text fontWeight="medium">Analytics & Trends</Text>
                  <Box textAlign="center" py={8}>
                    <Icon as={BarChart3} size="xl" color="gray.400" mb={4} />
                    <Text color="gray.500">Analytics charts will be displayed here</Text>
                  </Box>
                </VStack>
              </Tabs.Content>
            </Tabs.Root>
          </Card.Body>
        </Card.Root>
      </VStack>

      {/* Configuration Modal */}
      <Dialog.Root open={isOpen} onOpenChange={onClose} size="lg">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              {isEditing ? 'Edit Configuration' : 'Sensor Configuration'}
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={6} align="stretch">
                <Field label="Sampling Rate">
                  <Select.Root
                    collection={samplingRateCollection}
                    defaultValue={[sensor.configuration.samplingRate]}
                  >
                    <Select.HiddenSelect />
                    <Select.Label>Select sampling rate</Select.Label>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select sampling rate" />
                    </Select.Trigger>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {samplingRateCollection.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Field>

                <Field label="Alert Threshold">
                  <Input
                    type="number"
                    defaultValue={sensor.configuration.threshold}
                    placeholder="Enter threshold value"
                  />
                </Field>

                <Field label="Enable Alerts">
                  <Switch.Root defaultChecked={sensor.configuration.alerts} />
                  <Switch.Label>Enable Alerts</Switch.Label>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Field>

                <Field label="Notes">
                  <Textarea placeholder="Add any notes about this sensor..." />
                </Field>

                {isEditing && (
                  <HStack gap={4} justify="flex-end">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorPalette="blue" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </HStack>
                )}
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Container>
  );
};

export default SensorDetailPage; 