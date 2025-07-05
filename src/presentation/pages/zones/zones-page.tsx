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
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Stat,
  Flex,
  Spacer,
  InputGroup,
  Input,
  InputLeftElement,
  useToast,
  Progress,
  IconButton,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import {
  MapPin,
  Search,
  MoreVertical,
  Plus,
  Home,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Cpu,
  BarChart3,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ZonesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const typeCollection = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Residential', value: 'residential' },
      { label: 'Utility', value: 'utility' },
      { label: 'Commercial', value: 'commercial' },
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
  const zones = [
    {
      id: '1',
      name: 'Living Room',
      type: 'residential',
      status: 'active',
      location: 'Ground Floor',
      area: 25,
      unit: 'm²',
      devices: 8,
      sensors: 12,
      actuators: 4,
      occupancy: 75,
      lastActivity: '2 minutes ago',
      description: 'Main living area with entertainment system and climate control',
    },
    {
      id: '2',
      name: 'Kitchen',
      type: 'residential',
      status: 'active',
      location: 'Ground Floor',
      area: 15,
      unit: 'm²',
      devices: 6,
      sensors: 8,
      actuators: 3,
      occupancy: 90,
      lastActivity: '5 minutes ago',
      description: 'Kitchen area with smart appliances and lighting',
    },
    {
      id: '3',
      name: 'Bedroom',
      type: 'residential',
      status: 'active',
      location: 'First Floor',
      area: 18,
      unit: 'm²',
      devices: 4,
      sensors: 6,
      actuators: 2,
      occupancy: 0,
      lastActivity: '1 hour ago',
      description: 'Master bedroom with climate and lighting control',
    },
    {
      id: '4',
      name: 'Garage',
      type: 'utility',
      status: 'inactive',
      location: 'Ground Floor',
      area: 30,
      unit: 'm²',
      devices: 2,
      sensors: 3,
      actuators: 1,
      occupancy: 0,
      lastActivity: '3 hours ago',
      description: 'Garage with door control and security sensors',
    },
  ];

  const stats = {
    total: zones.length,
    active: zones.filter(z => z.status === 'active').length,
    inactive: zones.filter(z => z.status === 'inactive').length,
    totalDevices: zones.reduce((sum, z) => sum + z.devices, 0),
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'residential':
        return <Home size={20} />;
      case 'utility':
        return <Building size={20} />;
      case 'commercial':
        return <Building size={20} />;
      default:
        return <MapPin size={20} />;
    }
  };

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'residential':
        return 'blue';
      case 'utility':
        return 'orange';
      case 'commercial':
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'orange';
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy > 80) return 'green';
    if (occupancy > 50) return 'yellow';
    return 'red';
  };

  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || zone.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || zone.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" gap={4} mb={8}>
        <HStack justify="space-between" w="full">
          <VStack align="start" gap={1}>
            <Heading size="lg" color="gray.800">
              Zones
            </Heading>
            <Text color="gray.600">
              Manage IoT zones and areas
            </Text>
          </VStack>
          <Button colorPalette="blue" onClick={() => navigate('/zones/new')}>
            <Plus size={16} />
            Add Zone
          </Button>
        </HStack>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
        <Stat.Root>
          <Stat.Label>Total Zones</Stat.Label>
          <Stat.ValueText>{stats.total}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root>
          <Stat.Label>Active Zones</Stat.Label>
          <Stat.ValueText color="green.600">{stats.active}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root>
          <Stat.Label>Inactive Zones</Stat.Label>
          <Stat.ValueText color="red.600">{stats.inactive}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root>
          <Stat.Label>Total Devices</Stat.Label>
          <Stat.ValueText color="blue.600">{stats.totalDevices}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      {/* Filters */}
      <Card.Root mb={6}>
        <Card.Body>
          <HStack gap={4}>
            <InputGroup maxW="400px">
              <InputLeftElement>
                <Search size={16} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Select.Root
              collection={typeCollection}
              value={[typeFilter]}
              onValueChange={({ value }) => setTypeFilter(value[0])}
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
              value={[statusFilter]}
              onValueChange={({ value }) => setStatusFilter(value[0])}
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
              {filteredZones.length} of {zones.length} zones
            </Text>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Zones Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {filteredZones.map((zone) => (
          <Card.Root key={zone.id} cursor="pointer" _hover={{ shadow: 'md' }}>
            <Card.Header pb={2}>
              <HStack justify="space-between">
                <HStack gap={3}>
                  <Box
                    p={2}
                    bg={`${getZoneColor(zone.type)}.100`}
                    color={`${getZoneColor(zone.type)}.600`}
                    borderRadius="lg"
                  >
                    {getZoneIcon(zone.type)}
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {zone.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {zone.location}
                    </Text>
                  </VStack>
                </HStack>
                <Menu>
                  <MenuButton as={IconButton} variant="ghost" size="sm" aria-label="More">
                    <MoreVertical size={16} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => navigate(`/zones/${zone.id}`)}>
                      View Details
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/zones/${zone.id}/devices`)}>
                      View Devices
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/zones/${zone.id}/edit`)}>
                      Edit Zone
                    </MenuItem>
                    <MenuItem color="red.500">
                      Delete Zone
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Card.Header>
            <Card.Body pt={0}>
              <VStack align="stretch" gap={4}>
                {/* Description */}
                <Text fontSize="sm" color="gray.600">
                  {zone.description}
                </Text>

                {/* Status and Area */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Status
                  </Text>
                  <HStack gap={1}>
                    {getStatusIcon(zone.status)}
                    <Badge colorPalette={getStatusColor(zone.status)} size="sm">
                      {zone.status}
                    </Badge>
                  </HStack>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Area
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {zone.area} {zone.unit}
                  </Text>
                </HStack>

                {/* Device Counts */}
                <SimpleGrid columns={3} gap={2}>
                  <VStack gap={1}>
                    <HStack gap={1}>
                      <Cpu size={12} color="blue.500" />
                      <Text fontSize="sm" fontWeight="medium">
                        {zone.devices}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      Devices
                    </Text>
                  </VStack>
                  <VStack gap={1}>
                    <HStack gap={1}>
                      <BarChart3 size={12} color="green.500" />
                      <Text fontSize="sm" fontWeight="medium">
                        {zone.sensors}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      Sensors
                    </Text>
                  </VStack>
                  <VStack gap={1}>
                    <HStack gap={1}>
                      <Zap size={12} color="orange.500" />
                      <Text fontSize="sm" fontWeight="medium">
                        {zone.actuators}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      Actuators
                    </Text>
                  </VStack>
                </SimpleGrid>

                {/* Occupancy */}
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.600">
                      Occupancy
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={`${getOccupancyColor(zone.occupancy)}.600`}>
                      {zone.occupancy}%
                    </Text>
                  </HStack>
                  <Progress
                    value={zone.occupancy}
                   colorPalette={getOccupancyColor(zone.occupancy)}
                    size="sm"
                  />
                </Box>

                {/* Last Activity */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Last Activity
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {zone.lastActivity}
                  </Text>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>

      {filteredZones.length === 0 && (
        <Card.Root>
          <Card.Body>
            <VStack gap={4} py={8}>
              <MapPin size={48} color="gray.300" />
              <Text color="gray.500" fontSize="lg">
                No zones found
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

export default ZonesPage; 