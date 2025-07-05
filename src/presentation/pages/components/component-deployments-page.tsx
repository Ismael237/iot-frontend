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
  VStack,
  Icon,
  Flex,
  createListCollection,
  Stat,
  useDisclosure,
  Card,
  Table,
  Progress,
  Menu,
  IconButton,
  Dialog,
} from '@chakra-ui/react';
import {
  Search,
  Plus,
  Settings,
  Zap,
  Thermometer,
  Lightbulb,
  Fan,
  Lock,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
} from 'lucide-react';
import { useColorModeValue } from '@presentation/components/ui/chakra/color-mode';

interface ComponentDeployment {
  id: string;
  name: string;
  type: string;
  deviceId: string;
  deviceName: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  version: string;
  lastSeen: string;
  uptime: number;
  performance: number;
  location: string;
  capabilities: string[];
}

const mockDeployments: ComponentDeployment[] = [
  {
    id: '1',
    name: 'Living Room Temp Sensor',
    type: 'Temperature Sensor',
    deviceId: 'dev-001',
    deviceName: 'Smart Hub Living Room',
    status: 'online',
    version: '2.1.0',
    lastSeen: '2 minutes ago',
    uptime: 99.8,
    performance: 95,
    location: 'Living Room',
    capabilities: ['Temperature Reading', 'Humidity', 'Wireless'],
  },
  {
    id: '2',
    name: 'Kitchen Light',
    type: 'Smart Light Bulb',
    deviceId: 'dev-002',
    deviceName: 'Kitchen Hub',
    status: 'online',
    version: '1.8.2',
    lastSeen: '1 minute ago',
    uptime: 98.5,
    performance: 88,
    location: 'Kitchen',
    capabilities: ['RGB Control', 'Dimming', 'Scheduling'],
  },
  {
    id: '3',
    name: 'Front Door Motion',
    type: 'Motion Detector',
    deviceId: 'dev-003',
    deviceName: 'Security Hub',
    status: 'error',
    version: '1.5.1',
    lastSeen: '15 minutes ago',
    uptime: 85.2,
    performance: 45,
    location: 'Front Door',
    capabilities: ['Motion Detection', 'Night Vision'],
  },
  {
    id: '4',
    name: 'Garage Door Lock',
    type: 'Smart Lock',
    deviceId: 'dev-004',
    deviceName: 'Garage Hub',
    status: 'offline',
    version: '2.0.0',
    lastSeen: '2 hours ago',
    uptime: 0,
    performance: 0,
    location: 'Garage',
    capabilities: ['Keypad Access', 'App Control'],
  },
  {
    id: '5',
    name: 'Bedroom Air Quality',
    type: 'Air Quality Monitor',
    deviceId: 'dev-005',
    deviceName: 'Bedroom Hub',
    status: 'maintenance',
    version: '1.9.3',
    lastSeen: '30 minutes ago',
    uptime: 92.1,
    performance: 78,
    location: 'Master Bedroom',
    capabilities: ['PM2.5', 'CO2', 'VOC'],
  },
  {
    id: '6',
    name: 'Office Fan',
    type: 'Smart Fan',
    deviceId: 'dev-006',
    deviceName: 'Office Hub',
    status: 'online',
    version: '1.7.0',
    lastSeen: '5 minutes ago',
    uptime: 97.3,
    performance: 92,
    location: 'Home Office',
    capabilities: ['Speed Control', 'Timer'],
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

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'temperature sensor':
      return Thermometer;
    case 'smart light bulb':
      return Lightbulb;
    case 'motion detector':
      return Eye;
    case 'smart lock':
      return Lock;
    case 'air quality monitor':
      return Zap;
    case 'smart fan':
      return Fan;
    default:
      return Settings;
  }
};

export const ComponentDeploymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [typeFilter, setTypeFilter] = useState<string[]>(['all']);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDeployment, setSelectedDeployment] = useState<ComponentDeployment | null>(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const typeCollection = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Temperature Sensor', value: 'Temperature Sensor' },
      { label: 'Smart Light Bulb', value: 'Smart Light Bulb' },
      { label: 'Motion Detector', value: 'Motion Detector' },
      { label: 'Smart Lock', value: 'Smart Lock' },
      { label: 'Air Quality Monitor', value: 'Air Quality Monitor' },
      { label: 'Smart Fan', value: 'Smart Fan' },
    ],
  });
  const statusCollection = createListCollection({
    items: [
      { label: 'All Status', value: 'all' },
      { label: 'Online', value: 'online' },
      { label: 'Offline', value: 'offline' },
      { label: 'Error', value: 'error' },
      { label: 'Maintenance', value: 'maintenance' },
    ],
  });

  const filteredDeployments = mockDeployments.filter((deployment) => {
    const matchesSearch = deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deployment.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deployment.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.includes('all') || statusFilter.includes(deployment.status);
    const matchesType = typeFilter.includes('all') || typeFilter.includes(deployment.type);

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: mockDeployments.length,
    online: mockDeployments.filter(d => d.status === 'online').length,
    offline: mockDeployments.filter(d => d.status === 'offline').length,
    error: mockDeployments.filter(d => d.status === 'error').length,
  };

  const handleViewDetails = (deployment: ComponentDeployment) => {
    setSelectedDeployment(deployment);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Component Deployments</Heading>
          <Text color="gray.600" fontSize="lg">
            Monitor and manage deployed IoT components across your network
          </Text>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
          <Card.Root bg={cardBg} border="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Total Deployments</Stat.Label>
                <Stat.ValueText>{stats.total}</Stat.ValueText>
                <Stat.HelpText>Across all devices</Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} border="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Online</Stat.Label>
                <Stat.ValueText color="green.500">{stats.online}</Stat.ValueText>
                <Stat.HelpText>Active components</Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} border="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Offline</Stat.Label>
                <Stat.ValueText color="red.500">{stats.offline}</Stat.ValueText>
                <Stat.HelpText>Disconnected</Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} border="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Errors</Stat.Label>
                <Stat.ValueText color="orange.500">{stats.error}</Stat.ValueText>
                <Stat.HelpText>Needs attention</Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Filters and Actions */}
        <HStack gap={4} justify="space-between" flexWrap="wrap">
          <HStack gap={4} flexWrap="wrap">
            <InputGroup maxW="300px" startElement={<Icon as={Search} color="gray.400" />}>
              <Input
                placeholder="Search deployments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

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
          </HStack>

          <Button colorPalette="blue">
            <Icon as={Plus} />
            Deploy Component
          </Button>
        </HStack>

        {/* Deployments Table */}
        <Card.Root bg={cardBg} border="1px" borderColor={borderColor}>
          <Card.Body>
            <Heading size="md">Active Deployments</Heading>
          </Card.Body>
          <Card.Body>
            <Box overflowX="auto">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Cell>Component</Table.Cell>
                    <Table.Cell>Device</Table.Cell>
                    <Table.Cell>Status</Table.Cell>
                    <Table.Cell>Location</Table.Cell>
                    <Table.Cell>Uptime</Table.Cell>
                    <Table.Cell>Performance</Table.Cell>
                    <Table.Cell>Last Seen</Table.Cell>
                    <Table.Cell>Actions</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredDeployments.map((deployment) => (
                    <Table.Row key={deployment.id}>
                      <Table.Cell>
                        <HStack>
                          <Icon as={getTypeIcon(deployment.type)} color="blue.500" />
                          <VStack align="start" gap={0}>
                            <Text fontWeight="medium">{deployment.name}</Text>
                            <Text fontSize="sm" color="gray.500">{deployment.type}</Text>
                          </VStack>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" gap={0}>
                          <Text fontWeight="medium">{deployment.deviceName}</Text>
                          <Text fontSize="sm" color="gray.500">ID: {deployment.deviceId}</Text>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack>
                          <Icon as={getStatusIcon(deployment.status)} color={`${getStatusColor(deployment.status)}.500`} />
                          <Badge colorPalette={getStatusColor(deployment.status)} variant="subtle">
                            {deployment.status}
                          </Badge>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>{deployment.location}</Table.Cell>
                      <Table.Cell>
                        <VStack align="start" gap={1}>
                          <Progress.Root value={deployment.uptime} size="sm"colorPalette="green" w="60px" >
                            <Progress.Track>
                              <Progress.Range color="green.500" />
                            </Progress.Track>
                            <Progress.ValueText color="green.500" fontSize="xs">
                              {deployment.uptime}%
                            </Progress.ValueText>
                          </Progress.Root>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" gap={1}>
                          <Progress.Root value={deployment.performance} size="sm"colorPalette="blue" w="60px" >
                            <Progress.Track>
                              <Progress.Range color="blue.500" />
                            </Progress.Track>
                            <Progress.ValueText color="blue.500" fontSize="xs">
                              {deployment.performance}%
                            </Progress.ValueText>
                          </Progress.Root>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <VStack align="start" gap={1}>
                          <Text fontSize="sm">{deployment.lastSeen}</Text>
                          <Text fontSize="xs" color="gray.500">v{deployment.version}</Text>
                        </VStack>
                      </Table.Cell>
                      <Table.Cell>
                        <Menu.Root>
                          <Menu.Trigger asChild>
                            <IconButton variant="ghost" size="sm" aria-label="More">
                              <MoreVertical />
                            </IconButton>
                          </Menu.Trigger>
                          <Menu.Positioner>
                            <Menu.Content>
                              <Menu.Item value="view-details" onClick={() => handleViewDetails(deployment)}>
                                <Eye style={{ marginRight: 8 }} />
                                View Details
                              </Menu.Item>
                              <Menu.Item value="edit-deployment">
                                <Edit style={{ marginRight: 8 }} />
                                Edit Deployment
                              </Menu.Item>
                              <Menu.Item value="update-firmware">
                                <Download style={{ marginRight: 8 }} />
                                Update Firmware
                              </Menu.Item>
                              <Menu.Item value="configure">
                                <Upload style={{ marginRight: 8 }} />
                                Configure
                              </Menu.Item>
                              <Menu.Item value="remove-deployment" color="red.500">
                                <Trash2 style={{ marginRight: 8 }} />
                                Remove Deployment
                              </Menu.Item>
                            </Menu.Content>
                          </Menu.Positioner>
                        </Menu.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Card.Body>
        </Card.Root>

        {filteredDeployments.length === 0 && (
          <Box textAlign="center" py={12}>
            <Icon as={Settings} size="lg" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">
              No deployments found matching your criteria
            </Text>
          </Box>
        )}
      </VStack>

      {/* Deployment Details Modal */}
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Content>
          <Dialog.Header>Deployment Details</Dialog.Header>
          <Dialog.Body pb={6}>
            {selectedDeployment && (
              <VStack gap={6} align="stretch">
                <HStack justify="space-between">
                  <VStack align="start" gap={1}>
                    <HStack>
                      <Icon as={getTypeIcon(selectedDeployment.type)} color="blue.500" />
                      <Heading size="md">{selectedDeployment.name}</Heading>
                    </HStack>
                    <Text color="gray.600">{selectedDeployment.type}</Text>
                  </VStack>
                  <Badge colorPalette={getStatusColor(selectedDeployment.status)} variant="subtle">
                    {selectedDeployment.status}
                  </Badge>
                </HStack>

                <SimpleGrid columns={2} gap={4}>
                  <Box>
                    <Text fontWeight="medium" mb={1}>Device</Text>
                    <Text fontSize="sm" color="gray.600">{selectedDeployment.deviceName}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={1}>Location</Text>
                    <Text fontSize="sm" color="gray.600">{selectedDeployment.location}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={1}>Version</Text>
                    <Text fontSize="sm" color="gray.600">{selectedDeployment.version}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={1}>Last Seen</Text>
                    <Text fontSize="sm" color="gray.600">{selectedDeployment.lastSeen}</Text>
                  </Box>
                </SimpleGrid>


                <Box>
                  <Text fontWeight="medium" mb={2}>Capabilities</Text>
                  <Flex wrap="wrap" gap={2}>
                    {selectedDeployment.capabilities.map((capability, index) => (
                      <Badge key={index} variant="outline"colorPalette="gray">
                        {capability}
                      </Badge>
                    ))}
                  </Flex>
                </Box>


                <VStack gap={4} align="stretch">
                  <Box>
                    <Text fontWeight="medium" mb={2}>Uptime</Text>
                    <HStack>
                      <Progress.Root value={selectedDeployment.uptime} flex={1}colorPalette="green" >
                        <Progress.Track>
                          <Progress.Range color="green.500" />
                        </Progress.Track>
                        <Progress.ValueText color="green.500" fontSize="xs">
                          {selectedDeployment.uptime}%
                        </Progress.ValueText>
                      </Progress.Root>
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontWeight="medium" mb={2}>Performance</Text>
                    <HStack>
                      <Progress.Root value={selectedDeployment.performance} flex={1}colorPalette="blue" >
                        <Progress.Track>
                          <Progress.Range color="blue.500" />
                        </Progress.Track>
                        <Progress.ValueText color="blue.500" fontSize="xs">
                          {selectedDeployment.performance}%
                        </Progress.ValueText>
                      </Progress.Root>
                    </HStack>
                  </Box>
                </VStack>
              </VStack>
            )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </Container>
  );
};

export default ComponentDeploymentsPage; 