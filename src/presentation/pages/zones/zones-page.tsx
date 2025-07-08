import React, { useState, useEffect } from 'react';
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
  Portal,
  Alert,
  Skeleton,
  Icon,
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
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  RefreshCw,
  Minus,
  Activity,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useZoneStore } from '@domain/store/zone-store';
import { ZoneStatus, type Zone } from '@domain/entities/zone.entity';

// Validation utilities
const isValidZoneStatus = (status: any): status is ZoneStatus => {
  return Object.values(ZoneStatus).includes(status);
};

const getSafeZoneStatus = (status: any): ZoneStatus => {
  return isValidZoneStatus(status) ? status : ZoneStatus.ACTIVE;
};

// Composant pour l'indicateur de tendance
const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable'; value: number }> = ({ trend, value }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} color="green" />;
      case 'down':
        return <TrendingDown size={14} color="red" />;
      default:
        return <Minus size={14} color="gray" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'green.500';
      case 'down':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };

  return (
    <HStack gap={1}>
      {getTrendIcon()}
      <Text fontSize="xs" color={getTrendColor()} fontWeight="medium">
        {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </Text>
    </HStack>
  );
};

// Composant pour l'icône de la zone
const ZoneIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 20 }) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'building':
        return <Building size={size} />;
      case 'home':
        return <Home size={size} />;
      case 'factory':
        return <Building size={size} />;
      case 'office':
        return <Building size={size} />;
      case 'warehouse':
        return <Building size={size} />;
      default:
        return <MapPin size={size} />;
    }
  };

  const getColor = () => {
    switch (type.toLowerCase()) {
      case 'building':
        return 'blue';
      case 'home':
        return 'green';
      case 'factory':
        return 'orange';
      case 'office':
        return 'purple';
      case 'warehouse':
        return 'cyan';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      p={2}
      bg={`${getColor()}.100`}
      color={`${getColor()}.600`}
      borderRadius="lg"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {getIcon()}
    </Box>
  );
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return Activity;
    case 'inactive':
      return Minus;
    case 'maintenance':
      return Settings;
    case 'alert':
      return Info;
    default:
      return Activity;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'gray';
    case 'maintenance':
      return 'yellow';
    case 'alert':
      return 'red';
    default:
      return 'gray';
  }
};

const getOccupancyColor = (occupancy: number) => {
  if (occupancy >= 80) return 'red';
  if (occupancy >= 60) return 'orange';
  if (occupancy >= 40) return 'yellow';
  return 'green';
};

export const ZonesPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    zones,
    isLoading,
    error,
    totalZones,
    fetchZones,
    setSelectedZone,
  } = useZoneStore();

  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      { label: 'Active', value: ZoneStatus.ACTIVE },
      { label: 'Inactive', value: ZoneStatus.INACTIVE },
      { label: 'Maintenance', value: ZoneStatus.MAINTENANCE },
      { label: 'Alert', value: ZoneStatus.ALERT },
    ],
  });

  // Polling pour les données en temps réel
  useEffect(() => {
    fetchZones();

    // Polling toutes les 30 secondes
    const interval = setInterval(() => {
      fetchZones();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchZones]);

  const statsData = {
    total: zones.length,
    active: zones.filter(z => z.status === ZoneStatus.ACTIVE).length,
    inactive: zones.filter(z => z.status === ZoneStatus.INACTIVE).length,
    maintenance: zones.filter(z => z.status === ZoneStatus.MAINTENANCE).length,
    alert: zones.filter(z => z.status === ZoneStatus.ALERT).length,
  };

  const filteredZones = zones.filter(zone => {
    const zoneName = zone.name || 'Unknown Zone';
    const zoneDescription = zone.description || '';

    const matchesSearch = zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zoneDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter.includes('all') ||
      statusFilter.includes(zone.status || ZoneStatus.ACTIVE);

    return matchesSearch && matchesStatus;
  });

  // Calcul de la tendance (simulé pour l'exemple)
  const calculateTrend = (zoneId: number): { trend: 'up' | 'down' | 'stable'; value: number } => {
    // Simulation de tendance basée sur l'ID de la zone
    const trend = zoneId % 3 === 0 ? 'up' : zoneId % 3 === 1 ? 'down' : 'stable';
    const value = Math.random() * 10;
    return { trend, value };
  };

  const handleRefresh = () => {
    fetchZones();
  };

  const handleViewDetails = (zone: Zone) => {
    setSelectedZone(zone as any);
    navigate(`/zones/${zone.id}`);
  };

  const handleCreateZone = () => {
    navigate('/zones/create');
  };

  if (error) {
    return (
      <Alert.Root status="error" mb={4}>
        <Alert.Indicator />
        <Alert.Title>Error loading zones!</Alert.Title>
        <Alert.Description>{error}</Alert.Description>
      </Alert.Root>
    );
  }

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
              Manage and monitor IoT zones and their components
            </Text>
          </VStack>
          <HStack gap={2}>
            <Button variant="outline" onClick={handleRefresh} loading={isLoading}>
              <RefreshCw size={16} />
              Refresh
            </Button>
            <Button colorPalette="blue" onClick={handleCreateZone}>
              <Plus size={16} />
              Create Zone
            </Button>
          </HStack>
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
          <Stat.Label>Total Zones</Stat.Label>
          <Stat.ValueText>{statsData.total}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> {statsData.active} active
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
          <Stat.ValueText color="green.600">{statsData.active}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> operational
          </Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Maintenance</Stat.Label>
          <Stat.ValueText color="yellow.600">{statsData.maintenance}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator /> needs attention
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
          <Stat.ValueText color="red.600">{statsData.alert}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator /> critical issues
          </Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      {/* Filters */}
      <Card.Root mb={6}>
        <Card.Body>
          <VStack gap={4}>
            <HStack gap={4} w="full">
              <InputGroup maxW="400px" startElement={<Search size={16} color="gray.400" />}>
                <Input
                  placeholder="Search zones..."
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

              <HStack gap={2}>
                <Button
                  variant={viewMode === 'grid' ? 'solid' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <MapPin size={16} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'solid' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Activity size={16} />
                </Button>
              </HStack>

              <Spacer />
              <Text fontSize="sm" color="gray.500">
                {filteredZones.length} of {zones.length} zones
              </Text>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>

      {/* Zones Grid/List */}
      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card.Root key={i}>
              <Card.Body>
                <Skeleton height="200px" />
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {filteredZones.map((zone) => {
            const trend = calculateTrend(zone.id);
            const zoneType = zone.metadata?.type || 'building';
            const occupancy = zone.metadata?.occupancy || 0;

            return (
              <Card.Root key={zone.id} cursor="pointer" _hover={{ shadow: 'md' }}>
                <Card.Header pb={2} mb={4}>
                  <HStack justify="space-between">
                    <HStack gap={3}>
                      <ZoneIcon type={zoneType} />
                      <VStack align="start" gap={1}>
                        <Text fontWeight="semibold" color="gray.800">
                          {zone.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {zone.description || 'No description'}
                        </Text>
                      </VStack>
                    </HStack>
                    <IconButton variant="outline" size="sm" onClick={() => handleViewDetails(zone)}>
                      <Eye size={16} />
                    </IconButton>
                  </HStack>
                </Card.Header>

                <Card.Body pt={0}>
                  <VStack align="stretch" gap={4}>
                    {/* Status and Connection */}
                    <HStack justify="space-between">
                      <HStack gap={2}>
                        <Icon as={getStatusIcon(zone.status || ZoneStatus.ACTIVE)} 
                              color={`${getStatusColor(zone.status || ZoneStatus.ACTIVE)}.500`} />
                        <Badge
                          colorPalette={getStatusColor(zone.status || ZoneStatus.ACTIVE)}
                          size="sm"
                        >
                          {zone.status || ZoneStatus.ACTIVE}
                        </Badge>
                      </HStack>
                      <TrendIndicator trend={trend.trend} value={trend.value} />
                    </HStack>

                    {/* Zone Info */}
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" color="gray.600">
                          Components
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {zone.componentDeployments?.length || 0} devices
                        </Text>
                      </HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {zone.componentDeployments?.length || 0}
                      </Text>
                    </Box>

                    {/* Occupancy */}
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" color="gray.600">
                          Occupancy
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {occupancy}%
                        </Text>
                      </HStack>
                      <Box
                        w="full"
                        h="8px"
                        bg="gray.200"
                        borderRadius="full"
                        overflow="hidden"
                      >
                        <Box
                          h="full"
                          bg={`${getOccupancyColor(occupancy)}.500`}
                          w={`${occupancy}%`}
                          transition="width 0.3s ease"
                        />
                      </Box>
                    </Box>

                    {/* Zone Info */}
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Type
                      </Text>
                      <Text fontSize="sm" color="gray.500" textTransform="capitalize">
                        {zoneType}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Created
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(zone.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>

                    {/* Child Zones */}
                    {zone.childZones && zone.childZones.length > 0 && (
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">
                          Sub-zones
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {zone.childZones.length}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </Card.Body>
              </Card.Root>
            );
          })}
        </SimpleGrid>
      )}

      {!isLoading && filteredZones.length === 0 && (
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