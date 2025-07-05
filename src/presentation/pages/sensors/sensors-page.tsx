import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  Menu,
  MenuItem,
  SimpleGrid,
  Stat,
  Progress,
  Spacer,
  InputGroup,
  Input,
  IconButton,
  Select,
  createListCollection,
  Portal,
} from '@chakra-ui/react';
import {
  BarChart3,
  Search,
  MoreVertical,
  Thermometer,
  Droplets,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SensorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string[]>(['all']);
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [searchTerm, setSearchTerm] = useState('');

  

  const typeCollection = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Temperature', value: 'temperature' },
      { label: 'Humidity', value: 'humidity' },
      { label: 'Light', value: 'light' },
      { label: 'Motion', value: 'motion' },
    ],
  });
  const statusCollection = createListCollection({
    items: [
      { label: 'All Status', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  });

  // Mock data - in a real app, this would come from API
  const sensors = [
    {
      id: '1',
      name: 'Living Room Temperature',
      type: 'temperature',
      status: 'active',
      location: 'Living Room',
      currentValue: 22.5,
      unit: '°C',
      threshold: { min: 18, max: 26 },
      lastReading: '2 minutes ago',
      device: 'Temperature Sensor Hub',
      trend: 'stable',
    },
    {
      id: '2',
      name: 'Kitchen Humidity',
      type: 'humidity',
      status: 'active',
      location: 'Kitchen',
      currentValue: 65,
      unit: '%',
      threshold: { min: 40, max: 70 },
      lastReading: '1 minute ago',
      device: 'Humidity Monitor',
      trend: 'increasing',
    },
    {
      id: '3',
      name: 'Bedroom Light Level',
      type: 'light',
      status: 'active',
      location: 'Bedroom',
      currentValue: 450,
      unit: 'lux',
      threshold: { min: 0, max: 1000 },
      lastReading: '30 seconds ago',
      device: 'Light Sensor Hub',
      trend: 'decreasing',
    },
    {
      id: '4',
      name: 'Garage Motion',
      type: 'motion',
      status: 'inactive',
      location: 'Garage',
      currentValue: 0,
      unit: '',
      threshold: { min: 0, max: 1 },
      lastReading: '5 minutes ago',
      device: 'Security Camera',
      trend: 'stable',
    },
  ];

  const stats = {
    total: sensors.length,
    active: sensors.filter(s => s.status === 'active').length,
    inactive: sensors.filter(s => s.status === 'inactive').length,
    alerts: sensors.filter(s => {
      const value = s.currentValue;
      return value < s.threshold.min || value > s.threshold.max;
    }).length,
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <Thermometer size={20} />;
      case 'humidity':
        return <Droplets size={20} />;
      case 'light':
        return <Lightbulb size={20} />;
      case 'motion':
        return <AlertTriangle size={20} />;
      default:
        return <BarChart3 size={20} />;
    }
  };

  const getSensorColor = (type: string) => {
    switch (type) {
      case 'temperature':
        return 'red';
      case 'humidity':
        return 'blue';
      case 'light':
        return 'yellow';
      case 'motion':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} color="green" />;
      case 'inactive':
        return <XCircle size={16} color="red" />;
      default:
        return <AlertTriangle size={16} color="orange" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp size={16} color="green" />;
      case 'decreasing':
        return <TrendingDown size={16} color="red" />;
      default:
        return null;
    }
  };

  const isValueInRange = (value: number, threshold: { min: number; max: number }) => {
    return value >= threshold.min && value <= threshold.max;
  };

  const getValueColor = (sensor: any) => {
    if (!isValueInRange(sensor.currentValue, sensor.threshold)) {
      return 'red.500';
    }
    return 'gray.800';
  };

  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) || sensor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter.includes('all') || typeFilter.includes(sensor.type);
    const matchesStatus = statusFilter.includes('all') || statusFilter.includes(sensor.status);

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" gap={4} mb={8}>
        <HStack justify="space-between" w="full">
          <VStack align="start" gap={1}>
            <Heading size="lg" color="gray.800">
              Sensors
            </Heading>
            <Text color="gray.600">
              Monitor sensor readings and data
            </Text>
          </VStack>
          <Button colorPalette="blue" onClick={() => navigate('/sensors/readings')}>
            <BarChart3 size={16} />
            View Readings
          </Button>
        </HStack>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={6} mb={6}>
        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Total Sensors</Stat.Label>
          <Stat.ValueText>{stats.total}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Active</Stat.Label>
          <Stat.ValueText color="green.600">{stats.active}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Inactive</Stat.Label>
          <Stat.ValueText color="red.600">{stats.inactive}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Alerts</Stat.Label>
          <Stat.ValueText color="orange.600">{stats.alerts}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      {/* Filters */}
      <Card.Root mb={6}>
        <Card.Body>
          <HStack gap={4}>
            <InputGroup maxW="400px" startElement={<Search size={16} color="gray.400" />}>
              <Input
                placeholder="Search sensors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
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
              collection={statusCollection}
              value={statusFilter}
              onValueChange={({ value }) => setStatusFilter(value ?? [])}
              width="200px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Status" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {statusCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              {filteredSensors.length} of {sensors.length} sensors
            </Text>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Sensors Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {filteredSensors.map((sensor) => (
          <Card.Root key={sensor.id} cursor="pointer" _hover={{ shadow: 'md' }}>
            <Card.Header pb={2}>
              <HStack justify="space-between">
                <HStack gap={3}>
                  <Box
                    p={2}
                    bg={`${getSensorColor(sensor.type)}.100`}
                    color={`${getSensorColor(sensor.type)}.600`}
                    borderRadius="lg"
                  >
                    {getSensorIcon(sensor.type)}
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {sensor.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {sensor.location}
                    </Text>
                  </VStack>
                </HStack>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <IconButton variant="ghost" size="sm">
                      <MoreVertical size={16} />
                    </IconButton>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <MenuItem value="view-details" onClick={() => navigate(`/sensors/${sensor.id}`)}>
                          View Details
                        </MenuItem>
                        <MenuItem value="view-readings" onClick={() => navigate(`/sensors/${sensor.id}/readings`)}>
                          View Readings
                        </MenuItem>
                        <MenuItem value="view-statistics" onClick={() => navigate(`/sensors/${sensor.id}/stats`)}>
                          View Statistics
                        </MenuItem>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </HStack>
            </Card.Header>
            <Card.Body pt={0}>
              <VStack align="stretch" gap={4}>
                {/* Current Value */}
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.600">
                      Current Value
                    </Text>
                    <HStack gap={1}>
                      {getTrendIcon(sensor.trend)}
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={getValueColor(sensor)}
                      >
                        {sensor.currentValue}{sensor.unit}
                      </Text>
                    </HStack>
                  </HStack>
                  <Progress.Root
                    value={
                      ((sensor.currentValue - sensor.threshold.min) /
                        (sensor.threshold.max - sensor.threshold.min)) *
                      100
                    }
                   colorPalette={
                      isValueInRange(sensor.currentValue, sensor.threshold)
                        ? 'green'
                        : 'red'
                    }
                    size="sm">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                    <Progress.ValueText>{sensor.currentValue} {sensor.unit}</Progress.ValueText>
                  </Progress.Root>
                </Box>

                {/* Status and Device */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Status
                  </Text>
                  <HStack gap={1}>
                    {getStatusIcon(sensor.status)}
                    <Badge
                     colorPalette={sensor.status === 'active' ? 'green' : 'red'}
                      size="sm"
                    >
                      {sensor.status}
                    </Badge>
                  </HStack>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Device
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {sensor.device}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Last Reading
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {sensor.lastReading}
                  </Text>
                </HStack>

                {/* Threshold Range */}
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Threshold Range
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {sensor.threshold.min} - {sensor.threshold.max} {sensor.unit}
                  </Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>

      {filteredSensors.length === 0 && (
        <Card.Root>
          <Card.Body>
            <VStack gap={4} py={8}>
              <BarChart3 size={48} color="gray.300" />
              <Text color="gray.500" fontSize="lg">
                No sensors found
              </Text>
              <Text color="gray.400" fontSize="sm">
                Try adjusting your search or filters
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      )}
    </Box>
  );
};

export default SensorsPage; 