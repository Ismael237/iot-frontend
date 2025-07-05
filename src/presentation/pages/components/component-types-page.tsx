import React, { useState } from 'react';
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
  Flex,
  createListCollection,
  Card,
} from '@chakra-ui/react';
import {
  Search,
  Plus,
  Settings,
  Zap,
  Thermometer,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { useColorModeValue } from '@ui/chakra/color-mode';
import { Field } from '@presentation/components/ui/chakra/field';

interface ComponentType {
  id: string;
  name: string;
  category: string;
  description: string;
  capabilities: string[];
  version: string;
  status: 'active' | 'deprecated' | 'beta';
  usageCount: number;
  lastUpdated: string;
}

const mockComponentTypes: ComponentType[] = [
  {
    id: '1',
    name: 'Temperature Sensor',
    category: 'Sensor',
    description: 'High-precision temperature sensor with wireless connectivity',
    capabilities: ['Temperature Reading', 'Humidity', 'Wireless'],
    version: '2.1.0',
    status: 'active',
    usageCount: 45,
    lastUpdated: '2024-01-15',
  },
  {
    id: '2',
    name: 'Smart Light Bulb',
    category: 'Actuator',
    description: 'RGB LED bulb with dimming and scheduling capabilities',
    capabilities: ['RGB Control', 'Dimming', 'Scheduling', 'Voice Control'],
    version: '1.8.2',
    status: 'active',
    usageCount: 32,
    lastUpdated: '2024-01-10',
  },
  {
    id: '3',
    name: 'Motion Detector',
    category: 'Sensor',
    description: 'PIR motion sensor with night vision',
    capabilities: ['Motion Detection', 'Night Vision', 'Alerts'],
    version: '1.5.1',
    status: 'active',
    usageCount: 28,
    lastUpdated: '2024-01-12',
  },
  {
    id: '4',
    name: 'Smart Lock',
    category: 'Actuator',
    description: 'Electronic door lock with keypad and app control',
    capabilities: ['Keypad Access', 'App Control', 'Access Logs', 'Auto-lock'],
    version: '2.0.0',
    status: 'active',
    usageCount: 15,
    lastUpdated: '2024-01-08',
  },
  {
    id: '5',
    name: 'Air Quality Monitor',
    category: 'Sensor',
    description: 'Multi-parameter air quality sensor',
    capabilities: ['PM2.5', 'PM10', 'CO2', 'VOC', 'Temperature'],
    version: '1.9.3',
    status: 'beta',
    usageCount: 8,
    lastUpdated: '2024-01-14',
  },
  {
    id: '6',
    name: 'Smart Fan',
    category: 'Actuator',
    description: 'WiFi-enabled ceiling fan with speed control',
    capabilities: ['Speed Control', 'Timer', 'Voice Control', 'App Control'],
    version: '1.7.0',
    status: 'active',
    usageCount: 22,
    lastUpdated: '2024-01-05',
  },
];

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'sensor':
      return Thermometer;
    case 'actuator':
      return Zap;
    default:
      return Settings;
  }
};

export const ComponentTypesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>(['all']);
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const filteredTypes = mockComponentTypes.filter((type) => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) || type.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter.includes('all') || categoryFilter.includes(type.category);
    const matchesStatus = statusFilter.includes('all') || statusFilter.includes(type.status);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categoryCollection = createListCollection({
    items: [
      { label: 'All', value: 'all' },
      { label: 'Sensor', value: 'Sensor' },
      { label: 'Actuator', value: 'Actuator' },
    ],
  });

  const statusCollection = createListCollection({
    items: [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Beta', value: 'beta' },
      { label: 'Deprecated', value: 'deprecated' },
    ],
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Box>
        <Heading size="lg" mb={2}>Component Types</Heading>
        <Text color="gray.600" fontSize="lg">
          Manage and explore available IoT component types
        </Text>
      </Box>

      <HStack gap={4} justify="space-between" flexWrap="wrap">
        <HStack gap={4} flexWrap="wrap">
          <InputGroup maxW="300px" startElement={<Icon as={Search} color="gray.400" />}>
            <Input
              placeholder="Search component types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>


          <Field label="Categories">
            <Select.Root
              collection={categoryCollection}
              value={statusFilter}
              onValueChange={({ value }) => setCategoryFilter(value)}
              width="full"
            >
              <Select.HiddenSelect />
              <Select.Label>Categories</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select category" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {categoryCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Field>

          <Field label="Status">
            <Select.Root
              collection={statusCollection}
              value={statusFilter}
              onValueChange={({ value }) => setStatusFilter(value)}
              width="full"
            >
              <Select.HiddenSelect />
              <Select.Label>Status</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select status" />
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
          </Field>
        </HStack>

        <Button colorPalette="blue">
          <Icon as={Plus} />Add Component Type
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {filteredTypes.map((type) => (
          <Card.Root key={type.id} bg={cardBg} border="1px" borderColor={borderColor}>
            <Card.Header pb={2}>
              <Flex justify="space-between" align="start">
                <HStack align="start" gap={1}>
                  <Icon as={getCategoryIcon(type.category)} color="blue.500" />
                  <Heading size="md">{type.name}</Heading>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  v{type.version}
                </Text>
              </Flex>
            </Card.Header>

            <Card.Body pt={0}>
              <HStack align="stretch" gap={4}>
                <Text fontSize="sm" color="gray.600">
                  {type.description}
                </Text>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Capabilities:
                  </Text>
                  <Flex wrap="wrap" gap={1}>
                    {type.capabilities.map((capability, index) => (
                      <Badge key={index} size="sm" variant="outline" colorPalette="gray">
                        {capability}
                      </Badge>
                    ))}
                  </Flex>
                </Box>


                <HStack justify="space-between" fontSize="sm" color="gray.500">
                  <Text>Used by {type.usageCount} devices</Text>
                  <Text>Updated {type.lastUpdated}</Text>
                </HStack>

                <HStack gap={2}>
                  <Button size="sm" variant="outline">
                    <Icon as={Eye} />View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Icon as={Edit} />Edit
                  </Button>
                  <Button size="sm" variant="outline" colorPalette="red">
                    <Icon as={Trash2} />Delete
                  </Button>
                </HStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>

      {filteredTypes.length === 0 && (
        <Box textAlign="center" py={12}>
          <Icon as={Settings} size="lg" color="gray.400" mb={4} />
          <Text fontSize="lg" color="gray.500">
            No component types found matching your criteria
          </Text>
        </Box>
      )}
    </Container>
  );
};