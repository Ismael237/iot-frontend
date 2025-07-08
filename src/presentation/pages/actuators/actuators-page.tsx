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
  SimpleGrid,
  Stat,
  InputGroup,
  Input,
  IconButton,
  Select,
  Portal,
  Alert,
  AlertTitle,
  AlertDescription,
  Skeleton,
  AlertRoot,
  createListCollection,
  Spacer,
} from '@chakra-ui/react';
import {
  Zap,
  Search,
  MoreVertical,
  Lightbulb,
  Fan,
  Power,
  AlertTriangle,
  Settings,
  RefreshCw,
  Eye,
  Edit,
  TrendingUp,
  TrendingDown,
  Activity,
  Wifi,
  WifiOff,
  Gauge,
  Info,
  Minus,
  Play,
  Pause,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActuatorStore } from '@domain/store/actuator-store';
import { ActuatorType, ActuatorState, CommandStatus, ConnStatus, type ActuatorDeployment } from '@domain/entities/actuator.entity';

// Validation utilities
const isValidActuatorType = (type: any): type is ActuatorType => {
  return Object.values(ActuatorType).includes(type);
};

const isValidActuatorState = (state: any): state is ActuatorState => {
  return Object.values(ActuatorState).includes(state);
};

const getSafeActuatorType = (type: any): ActuatorType => {
  return isValidActuatorType(type) ? type : ActuatorType.RELAY;
};

const getSafeActuatorState = (state: any): ActuatorState => {
  return isValidActuatorState(state) ? state : ActuatorState.OFF;
};

// Composant pour l'icône de l'actionneur
const ActuatorIcon: React.FC<{ type: ActuatorType; size?: number }> = ({ type, size = 20 }) => {
  const safeType = getSafeActuatorType(type);

  const getIcon = () => {
    switch (safeType) {
      case ActuatorType.LIGHT:
        return <Lightbulb size={size} />;
      case ActuatorType.DC_MOTOR:
      case ActuatorType.AC_MOTOR:
        return <Fan size={size} />;
      case ActuatorType.RELAY:
        return <Power size={size} />;
      case ActuatorType.SERVO:
      case ActuatorType.STEPPER:
        return <Target size={size} />;
      case ActuatorType.HEATER:
        return <Settings size={size} />;
      case ActuatorType.COOLER:
        return <Fan size={size} />;
      case ActuatorType.VALVE:
      case ActuatorType.PUMP:
        return <Activity size={size} />;
      case ActuatorType.DISPLAY:
        return <Gauge size={size} />;
      case ActuatorType.BUZZER:
        return <Gauge size={size} />;
      default:
        return <Zap size={size} />;
    }
  };

  const getColor = () => {
    switch (safeType) {
      case ActuatorType.LIGHT:
        return 'yellow';
      case ActuatorType.DC_MOTOR:
      case ActuatorType.AC_MOTOR:
        return 'blue';
      case ActuatorType.RELAY:
        return 'purple';
      case ActuatorType.SERVO:
      case ActuatorType.STEPPER:
        return 'green';
      case ActuatorType.HEATER:
        return 'red';
      case ActuatorType.COOLER:
        return 'cyan';
      case ActuatorType.VALVE:
      case ActuatorType.PUMP:
        return 'orange';
      case ActuatorType.DISPLAY:
        return 'teal';
      case ActuatorType.BUZZER:
        return 'pink';
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

// Composant pour l'indicateur de statut
const StatusIndicator: React.FC<{ status: ConnStatus }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case ConnStatus.ONLINE:
        return 'green';
      case ConnStatus.OFFLINE:
        return 'red';
      case ConnStatus.CONNECTING:
        return 'yellow';
      case ConnStatus.ERROR:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case ConnStatus.ONLINE:
        return <Wifi size={16} />;
      case ConnStatus.OFFLINE:
        return <WifiOff size={16} />;
      case ConnStatus.CONNECTING:
        return <Activity size={16} />;
      case ConnStatus.ERROR:
        return <AlertTriangle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  return (
    <HStack gap={1}>
      {getStatusIcon()}
      <Badge colorPalette={getStatusColor()} size="sm" variant="subtle">
        {status}
      </Badge>
    </HStack>
  );
};

// Composant pour l'indicateur d'état
const StateIndicator: React.FC<{ state: ActuatorState }> = ({ state }) => {
  const safeState = getSafeActuatorState(state);

  const getStateColor = () => {
    switch (safeState) {
      case ActuatorState.ON:
      case ActuatorState.OPEN:
      case ActuatorState.RUNNING:
      case ActuatorState.HEATING:
      case ActuatorState.COOLING:
        return 'green';
      case ActuatorState.OFF:
      case ActuatorState.CLOSED:
      case ActuatorState.STOPPED:
        return 'red';
      case ActuatorState.POSITION_0:
      case ActuatorState.POSITION_25:
      case ActuatorState.POSITION_50:
      case ActuatorState.POSITION_75:
      case ActuatorState.POSITION_100:
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStateIcon = () => {
    switch (safeState) {
      case ActuatorState.ON:
      case ActuatorState.OPEN:
      case ActuatorState.RUNNING:
        return <Play size={16} />;
      case ActuatorState.OFF:
      case ActuatorState.CLOSED:
      case ActuatorState.STOPPED:
        return <Pause size={16} />;
      case ActuatorState.HEATING:
      case ActuatorState.COOLING:
        return <Activity size={16} />;
      default:
        return <Target size={16} />;
    }
  };

  return (
    <HStack gap={1}>
      {getStateIcon()}
      <Badge colorPalette={getStateColor()} size="sm" variant="subtle">
        {safeState}
      </Badge>
    </HStack>
  );
};

export const ActuatorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>(['all']);
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [stateFilter, setStateFilter] = useState<string[]>(['all']);

  const {
    deployments,
    isLoading,
    error,
    fetchActuatorDeployments,
    clearError
  } = useActuatorStore();

  useEffect(() => {
    fetchActuatorDeployments();
  }, [fetchActuatorDeployments]);

  // Collections pour les filtres
  const typeCollection = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Relay', value: ActuatorType.RELAY },
      { label: 'Servo', value: ActuatorType.SERVO },
      { label: 'Motor', value: ActuatorType.DC_MOTOR },
      { label: 'Light', value: ActuatorType.LIGHT },
      { label: 'Heater', value: ActuatorType.HEATER },
      { label: 'Cooler', value: ActuatorType.COOLER },
    ],
  });

  const statusCollection = createListCollection({
    items: [
      { label: 'All Status', value: 'all' },
      { label: 'Online', value: ConnStatus.ONLINE },
      { label: 'Offline', value: ConnStatus.OFFLINE },
      { label: 'Connecting', value: ConnStatus.CONNECTING },
      { label: 'Error', value: ConnStatus.ERROR },
    ],
  });

  const stateCollection = createListCollection({
    items: [
      { label: 'All States', value: 'all' },
      { label: 'On', value: ActuatorState.ON },
      { label: 'Off', value: ActuatorState.OFF },
      { label: 'Open', value: ActuatorState.OPEN },
      { label: 'Closed', value: ActuatorState.CLOSED },
      { label: 'Running', value: ActuatorState.RUNNING },
      { label: 'Stopped', value: ActuatorState.STOPPED },
    ],
  });

  const calculateTrend = (deploymentId: number): { trend: 'up' | 'down' | 'stable'; value: number } => {
    // Mock trend calculation - in real app, this would be based on historical data
    const random = Math.random();
    if (random > 0.6) {
      return { trend: 'up', value: Math.random() * 20 };
    } else if (random > 0.3) {
      return { trend: 'down', value: Math.random() * 15 };
    } else {
      return { trend: 'stable', value: 0 };
    }
  };

  const getChartData = (deploymentId: number): number[] => {
    // Mock chart data - in real app, this would come from API
    return Array.from({ length: 10 }, () => Math.random() * 100);
  };

  const getCurrentStateName = (deployment: ActuatorDeployment, min: boolean = false): string => {
    const value = deployment.lastValue;
    if (value === null) return min ? "off" : "Off";
    if (value === 0) return min ? "off" : "Off";
    if (value === 1) return min ? "on" : "On";
    if (deployment.componentType.identifier === 'gate_servo' && value === 0) return min ? "closed" : "Closed";
    if (deployment.componentType.identifier === 'gate_servo' && value > 1) return min ? "open" : "Open";
    return min ? "unknown" : "Unknown";
  };

  const handleRefresh = () => {
    fetchActuatorDeployments();
  };

  const handleViewDetails = (deployment: any) => {
    navigate(`/actuators/${deployment.deploymentId}`);
  };

  const handleControl = (deployment: any) => {
    navigate(`/actuators/${deployment.deploymentId}/control`);
  };

  const filteredDeployments = deployments.filter(deployment => {
    const matchesSearch = deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deployment.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deployment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter.includes('all') || 
                       typeFilter.includes(deployment.componentType?.identifier);
    const matchesStatus = statusFilter.includes('all') || 
                         statusFilter.includes(deployment.connectionStatus);
    const matchesState = stateFilter.includes('all') || 
                        stateFilter.includes(getCurrentStateName(deployment));
    
    return matchesSearch && matchesType && matchesStatus && matchesState;
  });

  const stats = {
    total: deployments.length,
    active: deployments.filter(d => d.active).length,
    connected: deployments.filter(d => d.connectionStatus === ConnStatus.ONLINE).length,
    controllable: deployments.filter(d => d.componentType?.category === 'actuator').length,
  };

  if (error) {
    return (
      <Box>
        <AlertRoot status="error" mb={4}>
          <AlertTitle>Error loading actuators!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </AlertRoot>
        <Button mt={4} onClick={clearError}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" gap={4} mb={8}>
        <HStack justify="space-between" w="full">
          <VStack align="start" gap={1}>
            <Heading size="lg" color="gray.800">
              Actuators
            </Heading>
            <Text color="gray.600">
              Manage and control your IoT actuators
            </Text>
          </VStack>
          <HStack gap={2}>
            <Button variant="outline" onClick={handleRefresh} loading={isLoading}>
              <RefreshCw size={16} />
              Refresh
            </Button>
            {/* <Button colorPalette="blue" onClick={() => navigate('/actuators/control')}>
              <Zap size={16} />
              Control Center
            </Button> */}
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
          <Stat.Label>Total Actuators</Stat.Label>
          <Stat.ValueText>{stats.total}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> {stats.active} active
          </Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Connected</Stat.Label>
          <Stat.ValueText color="green.600">{stats.connected}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> online
          </Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Controllable</Stat.Label>
          <Stat.ValueText color="blue.600">{stats.controllable}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> available
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
          <Stat.ValueText color="orange.600">{stats.active}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> running
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
                  placeholder="Search actuators..."
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

              <Select.Root
                collection={stateCollection}
                value={stateFilter}
                onValueChange={({ value }) => setStateFilter(value ?? [])}
                width="200px"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="All States" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {stateCollection.items.map((item) => (
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
                {filteredDeployments.length} of {deployments.length} actuators
              </Text>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>

      {/* Actuators Grid */}
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
          {filteredDeployments.map((deployment) => {
            const trend = calculateTrend(deployment.deploymentId);
            const chartData = getChartData(deployment.deploymentId);

            return (
              <Card.Root key={deployment.deploymentId} cursor="pointer" _hover={{ shadow: 'md' }}>
                <Card.Header pb={2} mb={4}>
                  <HStack justify="space-between">
                    <HStack gap={3}>
                      <ActuatorIcon type={(deployment.componentType?.identifier || 'relay') as ActuatorType} />
                      <VStack align="start" gap={1}>
                        <Text fontWeight="semibold" color="gray.800">
                          {deployment.name || 'Unknown Actuator'}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {deployment.location || deployment.device?.identifier || 'Unknown location'}
                        </Text>
                      </VStack>
                    </HStack>
                    <IconButton variant="outline" size="sm" onClick={() => handleControl(deployment)}>
                      <Zap size={14} />
                    </IconButton>
                  </HStack>
                </Card.Header>

                <Card.Body pt={0}>
                  <VStack align="stretch" gap={4}>
                    {/* Status and State */}
                    <HStack justify="space-between">
                      <StatusIndicator status={deployment.connectionStatus as ConnStatus} />
                      <StateIndicator state={getCurrentStateName(deployment, true)} />
                    </HStack>

                    {/* Current Value */}
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" color="gray.600">
                          Current State
                        </Text>
                        <TrendIndicator trend={trend.trend} value={trend.value} />
                      </HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {getCurrentStateName(deployment) || 'Unknown'}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Last updated: {new Date(deployment.lastValueTs || Date.now()).toLocaleTimeString()}
                      </Text>
                    </Box>

                    {/* Mini Chart */}
                    {chartData.length > 0 && (
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Activity trend
                        </Text>
                        <Box h="40px" w="100%" position="relative">
                          <svg width="100%" height="100%" viewBox={`0 0 ${chartData.length * 4} 40`}>
                            <path
                              d={chartData.map((value, index) => {
                                const x = index * 4;
                                const y = 40 - (value / 100) * 35;
                                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                              }).join(' ')}
                              stroke={deployment.connectionStatus === ConnStatus.ONLINE ? '#38A169' : '#E53E3E'}
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Box>
                      </Box>
                    )}

                    {/* Device Info */}
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Device
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {deployment.device?.model || deployment.device?.identifier || 'Unknown Device'}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Type
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {deployment.componentType?.name || 'Unknown Type'}
                      </Text>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            );
          })}
        </SimpleGrid>
      )}

      {!isLoading && filteredDeployments.length === 0 && (
        <Card.Root>
          <Card.Body>
            <VStack gap={4} py={8}>
              <Zap size={48} color="gray.300" />
              <Text color="gray.500" fontSize="lg">
                No actuators found
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

export default ActuatorsPage; 