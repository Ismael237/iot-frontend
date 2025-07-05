import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Card,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  SimpleGrid,
  Spacer,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Cpu,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Stat } from '@/presentation/components/ui/stat';

export const DevicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data - in a real app, this would come from API
  const devices = [
    {
      id: '1',
      name: 'Temperature Sensor Hub',
      type: 'sensor_hub',
      status: 'online',
      location: 'Living Room',
      lastSeen: '2 minutes ago',
      components: 4,
      alerts: 0,
    },
    {
      id: '2',
      name: 'Smart Light Controller',
      type: 'actuator_hub',
      status: 'online',
      location: 'Kitchen',
      lastSeen: '1 minute ago',
      components: 6,
      alerts: 1,
    },
    {
      id: '3',
      name: 'Security Camera',
      type: 'camera',
      status: 'offline',
      location: 'Front Door',
      lastSeen: '15 minutes ago',
      components: 1,
      alerts: 2,
    },
    {
      id: '4',
      name: 'Humidity Monitor',
      type: 'sensor_hub',
      status: 'online',
      location: 'Bedroom',
      lastSeen: '30 seconds ago',
      components: 2,
      alerts: 0,
    },
  ];

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    alerts: devices.reduce((sum, d) => sum + d.alerts, 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle size={16} color="green" />;
      case 'offline':
        return <XCircle size={16} color="red" />;
      default:
        return <AlertTriangle size={16} color="orange" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'green';
      case 'offline':
        return 'red';
      default:
        return 'orange';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sensor_hub':
        return 'Sensor Hub';
      case 'actuator_hub':
        return 'Actuator Hub';
      case 'camera':
        return 'Camera';
      default:
        return type;
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesType = typeFilter === 'all' || device.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" gap={4} mb={8}>
        <HStack justify="space-between" w="full">
          <VStack align="start" gap={1}>
            <Heading size="lg" color="gray.800">
              Devices
            </Heading>
            <Text color="gray.600">
              Manage and monitor your IoT devices
            </Text>
          </VStack>
          <Button
            leftIcon={<Plus size={16} />}
           colorPalette="blue"
            onClick={() => navigate('/devices/new')}
          >
            Add Device
          </Button>
        </HStack>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={4} gap={6} mb={8}>
        <Card>
          <Card.Body>
            <Stat>
              <Stat.Label color="gray.600">Total Devices</Stat.Label>
              <Stat.Number fontSize="2xl" color="gray.800">
                {stats.total}
              </Stat.Number>
              <Stat.HelpText>
                <Stat.Arrow type="increase" />
                12.5%
              </Stat.HelpText>
            </Stat>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stat>
              <Stat.Label color="gray.600">Online</Stat.Label>
              <Stat.Number fontSize="2xl" color="green.600">
                {stats.online}
              </Stat.Number>
              <Stat.HelpText>
                <Stat.Arrow type="increase" />
                8.2%
              </Stat.HelpText>
            </Stat>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stat>
              <Stat.Label color="gray.600">Offline</Stat.Label>
              <Stat.Number fontSize="2xl" color="red.600">
                {stats.offline}
              </Stat.Number>
              <Stat.HelpText>
                <Stat.Arrow type="decrease" />
                3.1%
              </Stat.HelpText>
            </Stat>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stat>
              <Stat.Label color="gray.600">Active Alerts</Stat.Label>
              <Stat.Number fontSize="2xl" color="orange.600">
                {stats.alerts}
              </Stat.Number>
              <Stat.HelpText>
                <Stat.Arrow type="decrease" />
                15.4%
              </Stat.HelpText>
            </Stat>
          </Card.Body>
        </Card>
      </SimpleGrid>

      {/* Filters and Search */}
      <Card mb={6}>
        <Card.Body>
          <HStack gap={4}>
            <InputGroup maxW="400px">
              <InputLeftElement>
                <Search size={16} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="200px"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </Select>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              maxW="200px"
            >
              <option value="all">All Types</option>
              <option value="sensor_hub">Sensor Hub</option>
              <option value="actuator_hub">Actuator Hub</option>
              <option value="camera">Camera</option>
            </Select>
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              {filteredDevices.length} of {devices.length} devices
            </Text>
          </HStack>
        </Card.Body>
      </Card>

      {/* Devices Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {filteredDevices.map((device) => (
          <Card key={device.id} cursor="pointer" _hover={{ shadow: 'md' }}>
            <Card.Header pb={2}>
              <HStack justify="space-between">
                <HStack gap={3}>
                  <Box
                    p={2}
                    bg="blue.100"
                    color="blue.600"
                    borderRadius="lg"
                  >
                    <Cpu size={20} />
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {device.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {device.location}
                    </Text>
                  </VStack>
                </HStack>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MoreVertical size={16} />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem onClick={() => navigate(`/devices/${device.id}`)}>
                      View Details
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/devices/${device.id}/edit`)}>
                      Edit Device
                    </MenuItem>
                    <MenuItem color="red.500">
                      Delete Device
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Card.Header>
            <Card.Body pt={0}>
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Type
                  </Text>
                  <Badge colorPalette="blue" size="sm">
                    {getTypeLabel(device.type)}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Status
                  </Text>
                  <HStack gap={1}>
                    {getStatusIcon(device.status)}
                    <Badge colorPalette={getStatusColor(device.status)} size="sm">
                      {device.status}
                    </Badge>
                  </HStack>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Components
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {device.components}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Last Seen
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {device.lastSeen}
                  </Text>
                </HStack>
                {device.alerts > 0 && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Alerts
                    </Text>
                    <Badge colorPalette="red" size="sm">
                      {device.alerts}
                    </Badge>
                  </HStack>
                )}
              </VStack>
            </Card.Body>
          </Card>
        ))}
      </SimpleGrid>

      {filteredDevices.length === 0 && (
        <Card>
          <Card.Body>
            <VStack gap={4} py={8}>
              <Cpu size={48} color="gray.300" />
              <Text color="gray.500" fontSize="lg">
                No devices found
              </Text>
              <Text color="gray.400" fontSize="sm">
                Try adjusting your search or filters
              </Text>
            </VStack>
          </Card.Body>
        </Card>
      )}
    </Box>
  );
};

export default DevicesPage; 