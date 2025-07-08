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
  MenuItem,
  SimpleGrid,
  Stat,
  Spacer,
  InputGroup,
  Input,
  IconButton,
  Select,
  createListCollection,
  AlertTitle,
  AlertDescription,
  Skeleton,
  AlertRoot,
} from '@chakra-ui/react';
import {
  BarChart3,
  Search,
  MoreVertical,
  Thermometer,
  Droplets,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Settings,
  RefreshCw,
  Wifi,
  WifiOff,
  Gauge,
  Info,
  BarChart,
  LineChart,
  AlertCircle,
  Minus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSensorStore } from '@domain/store/sensor-store';
import { SensorType, SensorStatus, ReadingQuality, ConnStatus, type SensorReading } from '@domain/entities/sensor.entity';
import { getSensorUnitInfo, type SensorUnit } from '@shared/constants/sensor-units';
import { sensorApi } from '@infrastructure/api';

// Validation utilities
const isValidSensorType = (type: any): type is SensorType => {
  return Object.values(SensorType).includes(type);
};

const isValidReadingQuality = (quality: any): quality is ReadingQuality => {
  return Object.values(ReadingQuality).includes(quality);
};

const getSafeSensorType = (type: any): SensorType => {
  return isValidSensorType(type) ? type : SensorType.TEMPERATURE;
};

const getSafeReadingQuality = (quality: any): ReadingQuality => {
  return isValidReadingQuality(quality) ? quality : ReadingQuality.GOOD;
};

const getSafeUnit = (unit: any): SensorUnit => {
  if (!unit) return '°C' as SensorUnit;
  return (unit as SensorUnit) || '°C' as SensorUnit;
};

// Composant pour le graphique miniature
const MiniChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <Box h="40px" w="100%" position="relative">
      <svg width="100%" height="100%" viewBox={`0 0 ${data.length * 4} 40`}>
        <path
          d={data.map((value, index) => {
            const x = index * 4;
            const y = 40 - ((value - min) / range) * 35;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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

// Composant pour l'indicateur de qualité
const QualityIndicator: React.FC<{ quality: ReadingQuality }> = ({ quality }) => {
  const safeQuality = getSafeReadingQuality(quality);

  const getQualityColor = () => {
    switch (safeQuality) {
      case ReadingQuality.EXCELLENT:
        return 'green';
      case ReadingQuality.GOOD:
        return 'blue';
      case ReadingQuality.FAIR:
        return 'yellow';
      case ReadingQuality.POOR:
        return 'orange';
      case ReadingQuality.INVALID:
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Badge colorPalette={getQualityColor()} size="sm" variant="subtle">
      {safeQuality}
    </Badge>
  );
};

// Composant pour l'icône du capteur
const SensorIcon: React.FC<{ type: SensorType; size?: number }> = ({ type, size = 20 }) => {
  const safeType = getSafeSensorType(type);

  const getIcon = () => {
    switch (safeType) {
      case SensorType.TEMPERATURE:
        return <Thermometer size={size} />;
      case SensorType.HUMIDITY:
        return <Droplets size={size} />;
      case SensorType.LIGHT:
        return <Lightbulb size={size} />;
      case SensorType.MOTION:
        return <Activity size={size} />;
      case SensorType.PRESSURE:
        return <Gauge size={size} />;
      case SensorType.SOUND:
        return <AlertTriangle size={size} />;
      case SensorType.GAS:
        return <AlertCircle size={size} />;
      default:
        return <BarChart3 size={size} />;
    }
  };

  const getColor = () => {
    switch (safeType) {
      case SensorType.TEMPERATURE:
        return 'red';
      case SensorType.HUMIDITY:
        return 'blue';
      case SensorType.LIGHT:
        return 'yellow';
      case SensorType.MOTION:
        return 'purple';
      case SensorType.PRESSURE:
        return 'cyan';
      case SensorType.SOUND:
        return 'orange';
      case SensorType.GAS:
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

export const SensorsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    deployments,
    isLoading,
    error,
    fetchSensorDeployments,
    setSelectedDeployment,
  } = useSensorStore();

  const [typeFilter, setTypeFilter] = useState<string[]>(['all']);
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [readings, setReadings] = useState<{ deploymentId: number, data: SensorReading[] }[]>([]);

  const fetchReadings = async (deploymentId: number) => {
    const sensorReadings = await sensorApi.getSensorReadings(deploymentId);
    if (sensorReadings && sensorReadings.length > 0) {
      setReadings((prev) => [...prev, { deploymentId, data: sensorReadings }]);
    }
  };

  // Polling pour les données en temps réel
  useEffect(() => {
    fetchSensorDeployments({ activeOnly: true });
  }, [fetchSensorDeployments]);

  useEffect(() => {
    const fetchAllReadingsData = async () => {
      await Promise.all(
        deployments.map(async (deployment) => {
          await fetchReadings(deployment.deploymentId);
        })
      );
    };
  
    // Premier fetch immédiat
    fetchAllReadingsData();
  
    // Ensuite toutes les 30 secondes
    const interval = setInterval(() => {
      fetchAllReadingsData();
    }, 30000);
  
    return () => clearInterval(interval);
  }, [deployments]);
  

  // Collections pour les filtres
  const typeCollection = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Temperature', value: SensorType.TEMPERATURE },
      { label: 'Humidity', value: SensorType.HUMIDITY },
      { label: 'Light', value: SensorType.LIGHT },
      { label: 'Motion', value: SensorType.MOTION },
      { label: 'Pressure', value: SensorType.PRESSURE },
      { label: 'Sound', value: SensorType.SOUND },
      { label: 'Gas', value: SensorType.GAS },
    ],
  });

  const statusCollection = createListCollection({
    items: [
      { label: 'All Status', value: 'all' },
      { label: 'Online', value: SensorStatus.ONLINE },
      { label: 'Offline', value: SensorStatus.OFFLINE },
      { label: 'Error', value: SensorStatus.ERROR },
      { label: 'Maintenance', value: SensorStatus.MAINTENANCE },
    ],
  });

  // Calcul des statistiques
  const statsData = {
    total: deployments.length,
    active: deployments.filter(d => d.active).length,
    inactive: deployments.filter(d => !d.active).length,
    online: deployments.filter(d => d.connectionStatus === ConnStatus.ONLINE).length,
    offline: deployments.filter(d => d.connectionStatus === ConnStatus.OFFLINE || d.connectionStatus === ConnStatus.UNKNOWN).length,
    error: deployments.filter(d => d.connectionStatus === ConnStatus.ERROR).length,
  };

  // Filtrage des capteurs
  const filteredDeployments = deployments.filter(deployment => {
    const deploymentName = deployment.name || deployment.componentType?.name || 'Unknown Sensor';
    const deploymentLocation = deployment.location || deployment.device?.identifier || '';
    const deploymentDescription = deployment.description || deployment.componentType?.description || '';

    const matchesSearch = deploymentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deploymentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deploymentDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter.includes('all') ||
      typeFilter.includes(deployment.componentType?.identifier || '');

    const matchesStatus = statusFilter.includes('all') ||
        statusFilter.includes(deployment.connectionStatus || 'unknown');

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calcul de la tendance (simulé pour l'exemple)
  const calculateTrend = (deploymentId: number): { trend: 'up' | 'down' | 'stable'; value: number } => {
    const deploymentReadings = getChartData(deploymentId);
    if (!deploymentReadings || deploymentReadings.length < 2) return { trend: 'stable', value: 0 };

    const recent = deploymentReadings.slice(-5);
    const older = deploymentReadings.slice(-10, -5);

    const recentAvg = recent.reduce((sum, r) => sum + r, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (Math.abs(change) < 1) return { trend: 'stable', value: 0 };
    return { trend: change > 0 ? 'up' : 'down', value: Math.abs(change) };
  };

  // Données simulées pour les graphiques miniatures
  const getChartData = (deploymentId: number): number[] => {
    if(!readings || readings.length === 0) return [];
    const sensorReadings = readings.find(r => r.deploymentId === deploymentId)?.data;
    if (!sensorReadings || sensorReadings.length === 0) return [];

    const chartData = sensorReadings.slice(-10).map(r => r.value);
    return chartData;
  };

  const handleRefresh = () => {
    fetchSensorDeployments({ activeOnly: true });
  };

  const handleViewDetails = (deployment: any) => {
    setSelectedDeployment(deployment);
    navigate(`/sensors/${deployment.deploymentId}`);
  };


  if (error) {
    return (
      <AlertRoot status="error" mb={4}>
        <AlertTitle>Error loading sensors!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </AlertRoot>
    );
  }

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
              Monitor sensor readings and data in real-time
            </Text>
          </VStack>
          <HStack gap={2}>
            <Button variant="outline" onClick={handleRefresh} loading={isLoading}>
              <RefreshCw size={16} />
              Refresh
            </Button>
            {/* <Button colorPalette="blue" onClick={() => navigate('/sensors/readings')}>
              <BarChart3 size={16} />
              View All Readings
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
          <Stat.Label>Total Sensors</Stat.Label>
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
          <Stat.Label>Online</Stat.Label>
          <Stat.ValueText color="green.600">{statsData.online}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> connected
          </Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Offline</Stat.Label>
          <Stat.ValueText color="red.600">{statsData.offline}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator /> disconnected
          </Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Errors</Stat.Label>
          <Stat.ValueText color="orange.600">{statsData.error}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator /> needs attention
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

              <HStack gap={2}>
                <Button
                  variant={viewMode === 'grid' ? 'solid' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <BarChart3 size={16} />
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
                {filteredDeployments.length} of {deployments.length} sensors
              </Text>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>

      {/* Sensors Grid/List */}
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
            const unitInfo = getSensorUnitInfo(getSafeUnit(deployment.unit));
            const chartData = getChartData(deployment.deploymentId);

            return (
              <Card.Root key={deployment.deploymentId} cursor="pointer" _hover={{ shadow: 'md' }}>
                <Card.Header pb={2} mb={4}>
                  <HStack justify="space-between">
                    <HStack gap={3}>
                      <SensorIcon type={(deployment.componentType?.identifier || 'temperature') as SensorType} />
                      <VStack align="start" gap={1}>
                        <Text fontWeight="semibold" color="gray.800">
                          {deployment.name || deployment.componentType?.name || 'Unknown Sensor'}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {deployment.location || deployment.device?.identifier || 'Unknown location'}
                        </Text>
                      </VStack>
                    </HStack>
                    <IconButton variant="outline" size="sm" onClick={() => handleViewDetails(deployment)}>
                      <Eye size={16} />
                    </IconButton>
                  </HStack>
                </Card.Header>

                <Card.Body pt={0}>
                  <VStack align="stretch" gap={4}>
                    {/* Status and Connection */}
                    <HStack justify="space-between">
                      <HStack gap={2}>
                        {deployment.connectionStatus === ConnStatus.ONLINE ? (
                          <Wifi size={16} color="green" />
                        ) : (
                          <WifiOff size={16} color="red" />
                        )}
                        <Badge
                          colorPalette={deployment.connectionStatus === ConnStatus.ONLINE ? 'green' : 'red'}
                          size="sm"
                        >
                          {deployment.connectionStatus === ConnStatus.ONLINE ? 'Online' : 'Offline' }
                        </Badge>
                      </HStack>
                      <QualityIndicator quality={ReadingQuality.GOOD} />
                    </HStack>

                    {/* Current Value */}
                    {deployment.lastValue ? (
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="sm" color="gray.600">
                            Current Value
                          </Text>
                          <TrendIndicator trend={trend.trend} value={trend.value} />
                        </HStack>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                          {deployment.componentType?.identifier === 'pir_sensor' ? (deployment.lastValue === 0 ? 'No Movement' : 'Movement') : unitInfo.format(deployment.lastValue)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Last updated: {deployment.lastValueTs && new Date(deployment.lastValueTs).toLocaleTimeString()}
                        </Text>
                      </Box>
                    ) : (
                      <Box>
                        <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                          <Info size={16} style={{ display: 'inline', marginRight: '8px' }} />
                          No readings available yet
                        </Text>
                      </Box>
                    )}

                    {/* Mini Chart */}
                    {chartData && chartData.length > 0 && (
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Recent trend
                        </Text>
                        <MiniChart
                          data={chartData}
                          color={deployment.connectionStatus === ConnStatus.ONLINE ? '#38A169' : '#E53E3E'}
                        />
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

                    {/* Unit */}
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Unit
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {unitInfo.label} ({unitInfo.symbol})
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