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
  Select,
  HStack,
  VStack,
  Icon,
  Progress,
  IconButton,
  Table,
  Stat,
  Portal,
  createListCollection,
  Tabs
} from '@chakra-ui/react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Thermometer,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Settings,
  MapPin,
  Zap,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useColorModeValue } from '@ui/chakra/color-mode';

interface SensorStats {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'offline' | 'error';
  uptime: number;
  accuracy: number;
  batteryLevel: number;
  signalStrength: number;
  totalReadings: number;
  goodReadings: number;
  averageValue: number;
  lastReading: string;
  trend: 'up' | 'down' | 'stable';
}

interface OverallStats {
  totalSensors: number;
  onlineSensors: number;
  offlineSensors: number;
  errorSensors: number;
  averageUptime: number;
  averageAccuracy: number;
  totalReadings: number;
  goodReadingsPercentage: number;
}

const mockSensorStats: SensorStats[] = [
  {
    id: 'sensor-001',
    name: 'Living Room Temperature',
    type: 'Temperature',
    location: 'Living Room',
    status: 'online',
    uptime: 99.8,
    accuracy: 98.5,
    batteryLevel: 85,
    signalStrength: 92,
    totalReadings: 2880,
    goodReadings: 2850,
    averageValue: 23.5,
    lastReading: '2 minutes ago',
    trend: 'stable',
  },
  {
    id: 'sensor-002',
    name: 'Kitchen Humidity',
    type: 'Humidity',
    location: 'Kitchen',
    status: 'online',
    uptime: 98.2,
    accuracy: 97.1,
    batteryLevel: 72,
    signalStrength: 88,
    totalReadings: 2880,
    goodReadings: 2800,
    averageValue: 45.2,
    lastReading: '1 minute ago',
    trend: 'up',
  },
  {
    id: 'sensor-003',
    name: 'Bedroom Air Quality',
    type: 'Air Quality',
    location: 'Bedroom',
    status: 'error',
    uptime: 85.5,
    accuracy: 75.2,
    batteryLevel: 45,
    signalStrength: 65,
    totalReadings: 2880,
    goodReadings: 2160,
    averageValue: 125,
    lastReading: '15 minutes ago',
    trend: 'down',
  },
  {
    id: 'sensor-004',
    name: 'Garage Motion',
    type: 'Motion',
    location: 'Garage',
    status: 'online',
    uptime: 99.1,
    accuracy: 99.8,
    batteryLevel: 95,
    signalStrength: 78,
    totalReadings: 2880,
    goodReadings: 2850,
    averageValue: 0.1,
    lastReading: '5 minutes ago',
    trend: 'stable',
  },
  {
    id: 'sensor-005',
    name: 'Office Light Level',
    type: 'Light',
    location: 'Office',
    status: 'online',
    uptime: 97.8,
    accuracy: 96.3,
    batteryLevel: 68,
    signalStrength: 85,
    totalReadings: 2880,
    goodReadings: 2770,
    averageValue: 450,
    lastReading: '3 minutes ago',
    trend: 'up',
  },
  {
    id: 'sensor-006',
    name: 'Basement CO2',
    type: 'CO2',
    location: 'Basement',
    status: 'offline',
    uptime: 0,
    accuracy: 0,
    batteryLevel: 0,
    signalStrength: 0,
    totalReadings: 2880,
    goodReadings: 0,
    averageValue: 0,
    lastReading: '2 hours ago',
    trend: 'down',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return CheckCircle;
    case 'offline':
      return WifiOff;
    case 'error':
      return AlertTriangle;
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
    default:
      return 'gray';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    case 'stable':
      return Activity;
    default:
      return Activity;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'green';
    case 'down':
      return 'red';
    case 'stable':
      return 'blue';
    default:
      return 'gray';
  }
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'temperature':
      return Thermometer;
    case 'humidity':
      return Zap;
    case 'air quality':
      return Activity;
    case 'motion':
      return Eye;
    case 'light':
      return Zap;
    case 'co2':
      return AlertTriangle;
    default:
      return Settings;
  }
};

const calculateOverallStats = (sensors: SensorStats[]): OverallStats => {
  const totalSensors = sensors.length;
  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const offlineSensors = sensors.filter(s => s.status === 'offline').length;
  const errorSensors = sensors.filter(s => s.status === 'error').length;

  const averageUptime = sensors.reduce((sum, s) => sum + s.uptime, 0) / totalSensors;
  const averageAccuracy = sensors.reduce((sum, s) => sum + s.accuracy, 0) / totalSensors;

  const totalReadings = sensors.reduce((sum, s) => sum + s.totalReadings, 0);
  const goodReadings = sensors.reduce((sum, s) => sum + s.goodReadings, 0);
  const goodReadingsPercentage = (goodReadings / totalReadings) * 100;

  return {
    totalSensors,
    onlineSensors,
    offlineSensors,
    errorSensors,
    averageUptime: Math.round(averageUptime * 100) / 100,
    averageAccuracy: Math.round(averageAccuracy * 100) / 100,
    totalReadings,
    goodReadingsPercentage: Math.round(goodReadingsPercentage * 100) / 100,
  };
};

export const SensorStatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<SensorStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string[]>(['24h']);
  const [selectedType, setSelectedType] = useState<string[]>(['all']);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const timeRangeCollection = createListCollection({
    items: [
      { label: '1h', value: '1h' },
      { label: '24h', value: '24h' },
      { label: '7d', value: '7d' },
      { label: '30d', value: '30d' },
    ],
  });

  const typeCollection = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Temperature', value: 'Temperature' },
      { label: 'Humidity', value: 'Humidity' },
      { label: 'Air Quality', value: 'Air Quality' },
      { label: 'Motion', value: 'Motion' },
      { label: 'Light', value: 'Light' },
      { label: 'CO2', value: 'CO2' },
    ],
  });

  useEffect(() => {
    // Simulate API call
    const loadStats = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSensors(mockSensorStats);
      setIsLoading(false);
    };

    loadStats();
  }, []);

  const overallStats = calculateOverallStats(sensors);

  const filteredSensors = selectedType.includes('all')
    ? sensors
    : sensors.filter(s => selectedType.includes(s.type));

  const handleRefresh = () => {
    // Refresh stats
    console.log('Refreshing stats...');
  };

  const handleExport = () => {
    // Export stats
    console.log('Exporting stats...');
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center" py={12}>
            <Icon as={RefreshCw} size="lg" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">Loading sensor statistics...</Text>
          </Box>
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
              <IconButton
                aria-label="Go back"
                variant="ghost"
                onClick={() => navigate('/sensors')}
              ><Icon as={Settings} /></IconButton>
              <Heading size="lg">Sensor Statistics</Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Performance analytics and trends for all sensors
            </Text>
          </Box>

          <HStack gap={2}>
            <Select.Root
              collection={timeRangeCollection}
              width="320px"
              value={timeRange}
              onValueChange={(e) => setTimeRange(e.value)}
            >
              <Select.HiddenSelect />
              <Select.Label>Select time range</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select time range" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {timeRangeCollection.items.map((timeRange) => (
                      <Select.Item item={timeRange} key={timeRange.value}>
                        {timeRange.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <Button
              variant="outline"
              onClick={handleRefresh}
            >
              <Icon as={RefreshCw} />Refresh
            </Button>
            <Button
              colorPalette="blue"
              onClick={handleExport}
            >
              <Icon as={Download} />Export
            </Button>
          </HStack>
        </HStack>

        {/* Overall Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <VStack gap={2}>
                <Icon as={Activity} color="blue.500" size="lg" />
                <Text fontSize="2xl" fontWeight="bold">{overallStats.totalSensors}</Text>
                <Text fontSize="sm" color="gray.600">Total Sensors</Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <VStack gap={2}>
                <Icon as={CheckCircle} color="green.500" size="lg" />
                <Text fontSize="2xl" fontWeight="bold" color="green.500">{overallStats.onlineSensors}</Text>
                <Text fontSize="sm" color="gray.600">Online</Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <VStack gap={2}>
                <Icon as={WifiOff} color="red.500" size="lg" />
                <Text fontSize="2xl" fontWeight="bold" color="red.500">{overallStats.offlineSensors}</Text>
                <Text fontSize="sm" color="gray.600">Offline</Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <VStack gap={2}>
                <Icon as={AlertTriangle} color="orange.500" size="lg" />
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">{overallStats.errorSensors}</Text>
                <Text fontSize="sm" color="gray.600">Errors</Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Performance Metrics */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Average Uptime</Stat.Label>
                <Stat.ValueText>{overallStats.averageUptime}%</Stat.ValueText>
                <Stat.HelpText>
                  <Progress.Root value={overallStats.averageUptime} size="sm" colorPalette="green" />
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Average Accuracy</Stat.Label>
                <Stat.ValueText>{overallStats.averageAccuracy}%</Stat.ValueText>
                <Stat.HelpText>
                  <Progress.Root value={overallStats.averageAccuracy} size="sm" colorPalette="blue" />
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Data Quality</Stat.Label>
                <Stat.ValueText>{overallStats.goodReadingsPercentage}%</Stat.ValueText>
                <Stat.HelpText>
                  <Progress.Root value={overallStats.goodReadingsPercentage} size="sm" colorPalette="purple" />
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Filters */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Body>
            <HStack gap={4} justify="space-between">
              <HStack gap={4}>
                <Text fontWeight="medium">Filter by Type:</Text>
                <Select.Root
                  collection={typeCollection}
                  width="320px"
                  value={selectedType}
                  onValueChange={(e) => setSelectedType(e.value)}
                >
                  <Select.HiddenSelect />
                  <Select.Label>Select type</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select type" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {typeCollection.items.map((type) => (
                          <Select.Item item={type} key={type.value}>
                            {type.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                {filteredSensors.length} sensors
              </Text>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Sensor Stats Table */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Header>
            <Heading size="md">Sensor Performance</Heading>
          </Card.Header>
          <Card.Body p={0}>
            <Box overflowX="auto">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Cell>Sensor</Table.Cell>
                    <Table.Cell>Type</Table.Cell>
                    <Table.Cell>Status</Table.Cell>
                    <Table.Cell>Uptime</Table.Cell>
                    <Table.Cell>Accuracy</Table.Cell>
                    <Table.Cell>Battery</Table.Cell>
                    <Table.Cell>Signal</Table.Cell>
                    <Table.Cell>Readings</Table.Cell>
                    <Table.Cell>Trend</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredSensors.map((sensor) => (
                    <Table.Row key={sensor.id}>
                      <Table.Cell>
                        <VStack align="start" gap={0}>
                          <Text fontWeight="medium">{sensor.name}</Text>
                          <HStack>
                            <Icon as={MapPin} size="sm" color="gray.400" />
                            <Text fontSize="sm" color="gray.500">{sensor.location}</Text>
                          </HStack>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack>
                          <Icon as={getTypeIcon(sensor.type)} color="blue.500" size="md" />
                          <Badge variant="outline" colorPalette="blue">
                            {sensor.type}
                          </Badge>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack>
                          <Icon as={getStatusIcon(sensor.status)} color={`${getStatusColor(sensor.status)}.500`} size="md" />
                          <Badge colorPalette={getStatusColor(sensor.status)} variant="subtle">
                            {sensor.status}
                          </Badge>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" gap={1}>
                          <Progress.Root value={sensor.uptime} size="sm" colorPalette="green" w="60px" >
                            <Progress.Track>
                              <Progress.Range />
                            </Progress.Track>
                            <Progress.Label />
                            <Progress.ValueText>{sensor.uptime}%</Progress.ValueText>
                          </Progress.Root>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" gap={1}>
                          <Progress.Root value={sensor.accuracy} size="sm" colorPalette="blue" w="60px" >
                            <Progress.Track>
                              <Progress.Range />
                            </Progress.Track>
                            <Progress.Label />
                            <Progress.ValueText>{sensor.accuracy}%</Progress.ValueText>
                          </Progress.Root>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" gap={1}>
                          <Progress.Root value={sensor.batteryLevel} size="sm" colorPalette="green" w="60px" >
                            <Progress.Track>
                              <Progress.Range />
                            </Progress.Track>
                            <Progress.Label />
                            <Progress.ValueText>{sensor.batteryLevel}%</Progress.ValueText>
                          </Progress.Root>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" gap={1}>
                          <Progress.Root value={sensor.signalStrength} size="sm" colorPalette="blue" w="60px" >
                            <Progress.Track>
                              <Progress.Range />
                            </Progress.Track>
                            <Progress.Label />
                            <Progress.ValueText>{sensor.signalStrength}%</Progress.ValueText>
                          </Progress.Root>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" gap={0}>
                          <Text fontSize="sm">{sensor.totalReadings}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {Math.round((sensor.goodReadings / sensor.totalReadings) * 100)}% good
                          </Text>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack>
                          <Icon as={getTrendIcon(sensor.trend)} color={`${getTrendColor(sensor.trend)}.500`} size="md" />
                          <Text fontSize="sm" color={`${getTrendColor(sensor.trend)}.500`}>
                            {sensor.trend}
                          </Text>
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card.Body>
        </Card.Root>

        {/* Analytics Charts Placeholder */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Header>
            <Heading size="md">Analytics & Trends</Heading>
          </Card.Header>
          <Card.Body>
            <Tabs.Root>
              <Tabs.List>
                <Tabs.Trigger value="uptime">Uptime Trends</Tabs.Trigger>
                <Tabs.Trigger value="accuracy">Accuracy Trends</Tabs.Trigger>
                <Tabs.Trigger value="battery">Battery Levels</Tabs.Trigger>
                <Tabs.Trigger value="signal">Signal Strength</Tabs.Trigger>
              </Tabs.List>

                <Tabs.Content value="uptime">
                  <Box textAlign="center" py={8}>
                    <Icon as={BarChart3} size="lg" color="gray.400" mb={4} />
                    <Text color="gray.500">Uptime trend charts will be displayed here</Text>
                  </Box>
                </Tabs.Content>
                <Tabs.Content value="accuracy">
                  <Box textAlign="center" py={8}>
                    <Icon as={BarChart3} size="lg" color="gray.400" mb={4} />
                    <Text color="gray.500">Accuracy trend charts will be displayed here</Text>
                  </Box>
                </Tabs.Content>
                <Tabs.Content value="battery">
                  <Box textAlign="center" py={8}>
                    <Icon as={BarChart3} size="lg" color="gray.400" mb={4} />
                    <Text color="gray.500">Battery level charts will be displayed here</Text>
                  </Box>
                </Tabs.Content>
                <Tabs.Content value="signal">
                  <Box textAlign="center" py={8}>
                    <Icon as={BarChart3} size="lg" color="gray.400" mb={4} />
                    <Text color="gray.500">Signal strength charts will be displayed here</Text>
                  </Box>
                </Tabs.Content>
            </Tabs.Root>
          </Card.Body>
        </Card.Root>

        {filteredSensors.length === 0 && (
          <Box textAlign="center" py={12}>
            <Icon as={BarChart3} size="lg" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">
              No sensors found matching your criteria
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default SensorStatsPage; 