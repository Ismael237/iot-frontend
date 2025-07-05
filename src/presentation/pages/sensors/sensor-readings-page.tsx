import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Button,
  Input,
  InputGroup,
  Select,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  useDisclosure,
  Progress,
  Table,
  Dialog,
  createListCollection,
  VStack,
  Card as ChakraCard,
} from '@chakra-ui/react';
import {
  Search,
  Download,
  BarChart3,
  Activity,
  Eye,
  MoreVertical,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Settings,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stat } from '@chakra-ui/react';
import { useColorModeValue } from '@ui/chakra/color-mode';


interface SensorReading {
  id: string;
  sensorId: string;
  sensorName: string;
  timestamp: string;
  value: number;
  unit: string;
  quality: 'good' | 'fair' | 'poor';
  location: string;
  type: string;
}

interface ReadingStats {
  total: number;
  good: number;
  fair: number;
  poor: number;
  average: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
}

const mockReadings: SensorReading[] = [
  {
    id: '1',
    sensorId: 'sensor-001',
    sensorName: 'Living Room Temperature',
    timestamp: '2024-01-15T14:30:00Z',
    value: 23.5,
    unit: '°C',
    quality: 'good',
    location: 'Living Room',
    type: 'Temperature',
  },
  {
    id: '2',
    sensorId: 'sensor-001',
    sensorName: 'Living Room Temperature',
    timestamp: '2024-01-15T14:29:30Z',
    value: 23.4,
    unit: '°C',
    quality: 'good',
    location: 'Living Room',
    type: 'Temperature',
  },
  {
    id: '3',
    sensorId: 'sensor-001',
    sensorName: 'Living Room Temperature',
    timestamp: '2024-01-15T14:29:00Z',
    value: 23.6,
    unit: '°C',
    quality: 'good',
    location: 'Living Room',
    type: 'Temperature',
  },
  {
    id: '4',
    sensorId: 'sensor-002',
    sensorName: 'Kitchen Humidity',
    timestamp: '2024-01-15T14:30:00Z',
    value: 45.2,
    unit: '%',
    quality: 'good',
    location: 'Kitchen',
    type: 'Humidity',
  },
  {
    id: '5',
    sensorId: 'sensor-003',
    sensorName: 'Bedroom Air Quality',
    timestamp: '2024-01-15T14:30:00Z',
    value: 125,
    unit: 'ppm',
    quality: 'fair',
    location: 'Bedroom',
    type: 'Air Quality',
  },
  {
    id: '6',
    sensorId: 'sensor-004',
    sensorName: 'Garage Motion',
    timestamp: '2024-01-15T14:30:00Z',
    value: 1,
    unit: 'detected',
    quality: 'good',
    location: 'Garage',
    type: 'Motion',
  },
  {
    id: '7',
    sensorId: 'sensor-005',
    sensorName: 'Office Light Level',
    timestamp: '2024-01-15T14:30:00Z',
    value: 450,
    unit: 'lux',
    quality: 'good',
    location: 'Office',
    type: 'Light',
  },
  {
    id: '8',
    sensorId: 'sensor-006',
    sensorName: 'Basement CO2',
    timestamp: '2024-01-15T14:30:00Z',
    value: 850,
    unit: 'ppm',
    quality: 'poor',
    location: 'Basement',
    type: 'CO2',
  },
];

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

const getQualityIcon = (quality: string) => {
  switch (quality) {
    case 'good':
      return CheckCircle;
    case 'fair':
      return AlertTriangle;
    case 'poor':
      return AlertTriangle;
    default:
      return Clock;
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    case 'stable':
      return Minus;
    default:
      return Minus;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'green';
    case 'down':
      return 'red';
    case 'stable':
      return 'gray';
    default:
      return 'gray';
  }
};

const calculateStats = (readings: SensorReading[]): ReadingStats => {
  const values = readings.map(r => r.value);
  const good = readings.filter(r => r.quality === 'good').length;
  const fair = readings.filter(r => r.quality === 'fair').length;
  const poor = readings.filter(r => r.quality === 'poor').length;

  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Simple trend calculation
  const recent = values.slice(0, 3);
  const older = values.slice(-3);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (recentAvg > olderAvg + 0.5) trend = 'up';
  else if (recentAvg < olderAvg - 0.5) trend = 'down';

  return {
    total: readings.length,
    good,
    fair,
    poor,
    average: Math.round(average * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    trend,
  };
};

export const SensorReadingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [filteredReadings, setFilteredReadings] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [qualityFilter, setQualityFilter] = useState<string[]>(['all']);
  const [typeFilter, setTypeFilter] = useState<string[]>(['all']);
  const [dateRange, setDateRange] = useState<string[]>(['24h']);
  const { open: isOpen, onOpen } = useDisclosure();
  const [selectedReading, setSelectedReading] = useState<SensorReading | null>(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const qualityCollection = createListCollection({
    items: [
      { label: 'All Quality', value: 'all' },
      { label: 'Good', value: 'good' },
      { label: 'Fair', value: 'fair' },
      { label: 'Poor', value: 'poor' },
    ],
  });

  const typeCollection = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Temperature', value: 'temperature' },
      { label: 'Humidity', value: 'humidity' },
      { label: 'Air Quality', value: 'air-quality' },
      { label: 'Motion', value: 'motion' },
      { label: 'Light', value: 'light' },
      { label: 'CO2', value: 'co2' },
    ],
  });

  const dateRangeCollection = createListCollection({
    items: [
      { label: 'Last Hour', value: '1h' },
      { label: 'Last 24 Hours', value: '24h' },
      { label: 'Last 7 Days', value: '7d' },
      { label: 'Last 30 Days', value: '30d' },
    ],
  });

  useEffect(() => {
    // Simulate API call
    const loadReadings = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReadings(mockReadings);
      setFilteredReadings(mockReadings);
      setIsLoading(false);
    };

    loadReadings();
  }, [id]);

  useEffect(() => {
    const filtered = readings.filter((reading) => {
      const matchesSearch = reading.sensorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesQuality = qualityFilter.includes('all') || qualityFilter.includes(reading.quality);
      const matchesType = typeFilter.includes('all') || typeFilter.includes(reading.type);

      return matchesSearch && matchesQuality && matchesType;
    });

    setFilteredReadings(filtered);
  }, [readings, searchTerm, qualityFilter, typeFilter]);

  const stats = calculateStats(filteredReadings);

  const handleViewDetails = (reading: SensorReading) => {
    setSelectedReading(reading);
    onOpen();
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting readings...');
  };

  const handleRefresh = () => {
    // Refresh data
    console.log('Refreshing readings...');
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <HStack gap={8} align="stretch">
          <Box textAlign="center" py={12}>
            <Icon as={RefreshCw} size="xl" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">Loading sensor readings...</Text>
          </Box>
        </HStack>
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
              <Heading size="lg">Sensor Readings</Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Historical data and readings from all sensors
            </Text>
          </Box>

          <HStack gap={2}>
            <Button
              variant="outline"
              onClick={handleRefresh}
            ><Icon as={RefreshCw} />
              Refresh
            </Button>
            <Button
             colorPalette="blue"
              onClick={handleExport}
            ><Icon as={Download} />
              Export Data
            </Button>
          </HStack>
        </HStack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <ChakraCard.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <ChakraCard.Body>
              <Stat.Root>
                <Stat.Label>Total Readings</Stat.Label>
                <Stat.ValueText>{stats.total}</Stat.ValueText>
                <Stat.HelpText>Last 24 hours</Stat.HelpText>
              </Stat.Root>
            </ChakraCard.Body>
          </ChakraCard.Root>
          <ChakraCard.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <ChakraCard.Body>
              <Stat.Root>
                <Stat.Label>Average Value</Stat.Label>
                <Stat.ValueText>{stats.average}</Stat.ValueText>
                <Stat.HelpText>
                  <HStack gap={2}>
                    <Icon as={getTrendIcon(stats.trend)} color={`${getTrendColor(stats.trend)}.500`} size="sm" />
                    <Text fontSize="xs">{stats.trend}</Text>
                  </HStack>
                </Stat.HelpText>
              </Stat.Root>
            </ChakraCard.Body>
          </ChakraCard.Root>
          <ChakraCard.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <ChakraCard.Body>
              <Stat.Root>
                <Stat.Label>Good Quality</Stat.Label>
                <Stat.ValueText color="green.500">{stats.good}</Stat.ValueText>
                <Stat.HelpText>
                  <Progress.Root value={(stats.good / stats.total) * 100} size="sm"colorPalette="green" >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                    <Progress.ValueText>{stats.good}</Progress.ValueText>
                  </Progress.Root>
                </Stat.HelpText>
              </Stat.Root>
            </ChakraCard.Body>
          </ChakraCard.Root>
          <ChakraCard.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <ChakraCard.Body>
              <Stat.Root>
                <Stat.Label>Range</Stat.Label>
                <Stat.ValueText>{stats.min} - {stats.max}</Stat.ValueText>
                <Stat.HelpText>Min to Max</Stat.HelpText>
              </Stat.Root>
            </ChakraCard.Body>
          </ChakraCard.Root>
        </SimpleGrid>

        {/* Filters */}
        <ChakraCard.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <ChakraCard.Body>
            <HStack gap={4} justify="space-between" flexWrap="wrap">
              <HStack gap={4} flexWrap="wrap">
                <InputGroup maxW="300px" startElement={<Icon as={Search} color="gray.400" />}>
                  <Input
                    placeholder="Search sensors or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                <Select.Root
                  collection={qualityCollection}
                  value={qualityFilter}
                  onValueChange={({ value }) => setQualityFilter(value ?? [])}
                  width="200px"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="All Quality" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {qualityCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>

                <Select.Root
                  collection={typeCollection}
                  value={typeFilter}
                  onValueChange={({ value }) => setTypeFilter(value ?? [])}
                  width="200px"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="All Types" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {typeCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>

                <Select.Root
                  collection={dateRangeCollection}
                  value={dateRange}
                  onValueChange={({ value }) => setDateRange(value ?? [])}
                  width="200px"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="All Date Ranges" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {dateRangeCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </HStack>

              <Text fontSize="sm" color="gray.500">
                {filteredReadings.length} readings found
              </Text>
            </HStack>
          </ChakraCard.Body>
        </ChakraCard.Root>

        {/* Readings Table */}
        <ChakraCard.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <ChakraCard.Header>
            <Heading size="md">Recent Readings</Heading>
          </ChakraCard.Header>
          <ChakraCard.Body p={0}>
            <Box overflowX="auto">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Cell>Sensor</Table.Cell>
                    <Table.Cell>Location</Table.Cell>
                    <Table.Cell>Type</Table.Cell>
                    <Table.Cell>Value</Table.Cell>
                    <Table.Cell>Quality</Table.Cell>
                    <Table.Cell>Timestamp</Table.Cell>
                    <Table.Cell>Actions</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredReadings.map((reading) => (
                    <Table.Row key={reading.id}>
                      <Table.Cell>
                        <HStack align="start" gap={2}>
                          <Text fontWeight="medium">{reading.sensorName}</Text>
                          <Text fontSize="sm" color="gray.500">ID: {reading.sensorId}</Text>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack>
                          <Icon as={MapPin} size="md" color="gray.400" />
                          <Text>{reading.location}</Text>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="outline"colorPalette="blue">
                          {reading.type}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontWeight="bold" fontSize="lg">
                          {reading.value} {reading.unit}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack>
                          <Icon as={getQualityIcon(reading.quality)} color={`${getQualityColor(reading.quality)}.500`} size="md" />
                          <Badge colorPalette={getQualityColor(reading.quality)} variant="subtle">
                            {reading.quality}
                          </Badge>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack align="start" gap={2}>
                          <Text fontSize="sm">
                            {new Date(reading.timestamp).toLocaleDateString()}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(reading.timestamp).toLocaleTimeString()}
                          </Text>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <Menu.Root>
                          <Menu.Trigger>
                            <IconButton variant="ghost" size="sm" >
                              <Icon as={MoreVertical} />
                            </IconButton>
                          </Menu.Trigger>
                          <Menu.Content>
                            <MenuItem value="view-details" onClick={() => handleViewDetails(reading)}>
                              <Eye />View Details
                            </MenuItem>
                            <MenuItem value="view-trends">
                              <BarChart3 />View Trends
                            </MenuItem>
                            <MenuItem value="export-reading">
                              <Download />Export Reading
                            </MenuItem>
                          </Menu.Content>
                        </Menu.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </ChakraCard.Body>
        </ChakraCard.Root>

        {filteredReadings.length === 0 && (
          <Box textAlign="center" py={12}>
            <Icon as={Activity} size="xl" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">
              No readings found matching your criteria
            </Text>
          </Box>
        )}
      </VStack>

      {/* Reading Details Modal */}
      <Dialog.Root open={isOpen} onOpenChange={onOpen}>
        <Dialog.Content>
          <Dialog.Header>Reading Details</Dialog.Header>
          <Dialog.Body pb={6}>
            {selectedReading && (
              <HStack gap={6} align="stretch">
                <HStack justify="space-between">
                  <HStack align="start" gap={1}>
                    <Heading size="md">{selectedReading.sensorName}</Heading>
                    <HStack>
                      <Badge colorPalette="blue" variant="outline">
                        {selectedReading.type}
                      </Badge>
                      <Badge colorPalette={getQualityColor(selectedReading.quality)} variant="subtle">
                        {selectedReading.quality}
                      </Badge>
                    </HStack>
                  </HStack>
                </HStack>

                <SimpleGrid columns={2} gap={4}>
                  <Box>
                    <Text fontWeight="medium" mb={1}>Value</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      {selectedReading.value} {selectedReading.unit}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={1}>Location</Text>
                    <HStack>
                      <Icon as={MapPin} size="md" />
                      <Text>{selectedReading.location}</Text>
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={1}>Sensor ID</Text>
                    <Text fontSize="sm" color="gray.600">{selectedReading.sensorId}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={1}>Timestamp</Text>
                    <Text fontSize="sm" color="gray.600">
                      {new Date(selectedReading.timestamp).toLocaleString()}
                    </Text>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontWeight="medium" mb={2}>Quality Assessment</Text>
                  <HStack p={3} bg={`${getQualityColor(selectedReading.quality)}.50`} borderRadius="md">
                    <Icon as={getQualityIcon(selectedReading.quality)} color={`${getQualityColor(selectedReading.quality)}.500`} />
                    <Text>
                      {selectedReading.quality === 'good' && 'Reading is within normal parameters'}
                      {selectedReading.quality === 'fair' && 'Reading is slightly outside normal range'}
                      {selectedReading.quality === 'poor' && 'Reading indicates potential issue'}
                    </Text>
                  </HStack>
                </Box>
              </HStack>
            )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </Container>
  );
};

export default SensorReadingsPage; 