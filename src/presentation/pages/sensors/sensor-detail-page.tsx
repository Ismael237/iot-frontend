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
  HStack,
  VStack,
  Icon,
  Stat,
  Tabs,
  Menu,
  Alert,
  useDisclosure,
  Input,
  Select,
  Switch,
  Textarea,
  IconButton,
  Table,
  Dialog,
  Portal,
  createListCollection,
  Spinner,
} from '@chakra-ui/react';
import {
  Edit,
  Trash2,
  MoreVertical,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  MapPin,
  Battery,
  Signal,
  ArrowLeft,
  Play,
  Pause,
  Eye,
  LineChart,
  AlertCircle,
  Info,
  Thermometer,
  Droplets,
  Lightbulb,
  Gauge,
  Zap,
  Target,
  Minus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Field } from '@/presentation/components/ui/chakra/field';
import { useColorModeValue } from '@presentation/components/ui/chakra/color-mode';
import { useSensorStore } from '../../../domain/store/sensor-store';
import { SensorType, SensorStatus, ReadingQuality, type SensorReading, type SensorStats, ConnStatus, type SensorDeployment } from '../../../domain/entities/sensor.entity';
import { SENSOR_UNITS, getSensorUnitInfo } from '../../../shared/constants/sensor-units';
import { SensorLineChart } from '../../components/charts/sensor-line-chart';
import { componentApi, sensorApi } from '@infrastructure/api';
import { getErrorMessage } from '@infrastructure/api/axios-client';
import type { AxiosError } from 'axios';

// Composant pour l'icône du capteur
const SensorIcon: React.FC<{ type: SensorType; size?: number }> = ({ type, size = 20 }) => {
  const getIcon = () => {
    switch (type) {
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
    switch (type) {
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
  const getQualityColor = () => {
    switch (quality) {
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
      {quality}
    </Badge>
  );
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case ConnStatus.ONLINE:
      return CheckCircle;
    case ConnStatus.OFFLINE || ConnStatus.UNKNOWN:
      return WifiOff;
    case ConnStatus.ERROR:
      return AlertTriangle;
    case ConnStatus.CONNECTING:
      return Clock;
    default:
      return Wifi;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case ConnStatus.ONLINE:
      return 'green';
    case ConnStatus.OFFLINE || ConnStatus.UNKNOWN:
      return 'red';
    case ConnStatus.ERROR:
      return 'orange';
    case ConnStatus.CONNECTING:
      return 'yellow';
    default:
      return 'gray';
  }
};

export const SensorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isChartPaused, setIsChartPaused] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const { open: isConfigOpen, onOpen: onConfigOpen, onClose: onConfigClose } = useDisclosure();
  const { open: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [stats, setStats] = useState<SensorStats[]>([]);
  const [isLoadingReadings, setIsLoadingReadings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deployment, setDeployment] = useState<SensorDeployment | null>(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const samplingRateCollection = createListCollection({
    items: [
      { label: 'Every 10 seconds', value: '10s' },
      { label: 'Every 30 seconds', value: '30s' },
      { label: 'Every minute', value: '1m' },
      { label: 'Every 5 minutes', value: '5m' },
    ],
  });

  const fetchSensorReadings = async (deploymentId: number, params = {}) => {
    setIsLoadingReadings(true);
    try {
      const response = await sensorApi.getSensorReadings(deploymentId, params);
      setReadings(response);
    } catch (error) {
      setError(getErrorMessage(error as AxiosError));
      console.error('Failed to fetch sensor readings:', error);
    } finally {
      setIsLoadingReadings(false);
    }
  };

  const fetchDeploymentDetails = async (deploymentId: number) => {
    try {
      const response = await componentApi.getDeploymentDetails(deploymentId);
      setDeployment(response);
    } catch (error) {
      setError(getErrorMessage(error as AxiosError));
      console.error('Failed to fetch deployment details:', error);
    }
  };

  const fetchSensorStats = async (deploymentId: number, params = {}) => {
    setIsLoadingReadings(true);
    try {
      const response = await sensorApi.getSensorStats(deploymentId, params);
      setStats(response);
    } catch (error) {
      setError(getErrorMessage(error as AxiosError));
      console.error('Failed to fetch sensor stats:', error);
    } finally {
      setIsLoadingReadings(false);
    }
  };
  
  // Polling pour les données en temps réel
  useEffect(() => {
    if (!id) return;
    
    const deploymentId = parseInt(id);
    fetchDeploymentDetails(deploymentId);
    fetchSensorReadings(deploymentId, { limit: 100 });
    fetchSensorStats(deploymentId, { limit: 100 });

    // Polling toutes les 10 secondes pour les données en temps réel
    const interval = setInterval(() => {
      if (!isChartPaused) {
        fetchDeploymentDetails(deploymentId);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [id, isChartPaused]);

  // Préparation des données pour le graphique
  useEffect(() => {
    if (!id) return;

    const deploymentReadings = readings;
    
    if (deploymentReadings.length > 0) {
      const chartDataPoints = deploymentReadings
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(reading => ({
          timestamp: reading.timestamp,
          value: reading.value,
        }));
      
      setChartData(chartDataPoints);
    }
  }, [readings, id]);

  // Calcul de la tendance
  const calculateTrend = (): { trend: 'up' | 'down' | 'stable'; value: number } => {
    if (chartData.length < 2) return { trend: 'stable', value: 0 };
    
    const recent = chartData.slice(-5);
    const older = chartData.slice(-10, -5);
    
    if (older.length === 0) return { trend: 'stable', value: 0 };
    
    const recentAvg = recent.reduce((sum, r) => sum + r.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.value, 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (Math.abs(change) < 1) return { trend: 'stable', value: 0 };
    return { trend: change > 0 ? 'up' : 'down', value: Math.abs(change) };
  };

  const handleRefresh = () => {
    if (id) {
      const deploymentId = parseInt(id);
      fetchDeploymentDetails(deploymentId);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    onConfigOpen();
  };

  const handleSave = () => {
    // Save sensor configuration
    console.log('Saving sensor configuration...');
    setIsEditing(false);
    onConfigClose();
  };

  const handleDelete = () => {
    // Delete sensor
    console.log('Deleting sensor...');
    onDeleteClose();
    navigate('/sensors');
  };

  const handleExport = () => {
    // Export sensor data
    const csvContent = chartData.map(point => 
      `${point.timestamp},${point.value}`
    ).join('\n');
    
    const blob = new Blob([`timestamp,value\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-${id}-data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoadingReadings) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center" py={12}>
            <Spinner size="lg" colorPalette="blue" />
            <Text fontSize="lg" color="gray.500">Loading sensor details...</Text>
          </Box>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>Error loading sensor!</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        </VStack>
      </Container>
    );
  }

  if (!deployment) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>Sensor not found</Alert.Title>
            <Alert.Description>Please select a sensor from the sensors list.</Alert.Description>
          </Alert.Root>
        </VStack>
      </Container>
    );
  }

  const trend = calculateTrend();
  const unitInfo = getSensorUnitInfo(deployment.componentType.unit || '°C');

  return (
    <Container px={2} maxW="container.xl" py={4}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <Box>
            <HStack mb={2}>
              <IconButton variant="ghost" onClick={() => navigate('/sensors')}>
                <ArrowLeft size={16} />
              </IconButton>
              <HStack gap={3}>
                <SensorIcon type={deployment.componentType.identifier as SensorType} />
                <Heading size="lg">{deployment.componentType.name}</Heading>
              </HStack>
            </HStack>
            <HStack gap={4}>
              <Badge colorPalette={getStatusColor(deployment.connectionStatus)} variant="subtle">
                {deployment.connectionStatus}
              </Badge>
              <Text color="gray.600">{deployment.componentType.name}</Text>
              <HStack>
                <Icon as={MapPin} size="sm" />
                <Text fontSize="sm" color="gray.500">
                  {deployment.location || 'Unknown location'}
                </Text>
              </HStack>
            </HStack>
          </Box>

          <HStack gap={2}>
            <Button
              variant="outline"
              onClick={() => setIsChartPaused(!isChartPaused)}
              colorPalette={isChartPaused ? 'red' : 'green'}
            >
              {isChartPaused ? <Pause size={16} /> : <Play size={16} />}
              {isChartPaused ? 'Paused' : 'Live'}
            </Button>
            <Button variant="outline" onClick={handleRefresh} loading={isLoadingReadings}>
              <RefreshCw size={16} />
              Refresh
            </Button>
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton variant="ghost" size="sm" aria-label="More">
                  <MoreVertical />
                </IconButton>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="edit" onClick={handleEdit}>
                    <Edit size={16} />
                    Edit Configuration
                  </Menu.Item>
                  <Menu.Item value="export" onClick={handleExport}>
                    <Download size={16} />
                    Export Data
                  </Menu.Item>
                  <Menu.Item value="delete" onClick={onDeleteOpen} color="red.500">
                    <Trash2 size={16} />
                    Delete Sensor
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </HStack>
        </HStack>

        {/* Current Reading */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Header>
            <HStack justify="space-between">
              <Heading size="md">Current Reading</Heading>
              <HStack gap={2}>
                <Icon as={getStatusIcon(deployment.connectionStatus)} 
                      color={`${getStatusColor(deployment.connectionStatus)}.500`} />
                <QualityIndicator quality={ReadingQuality.GOOD} />
                {deployment && (
                  <Text fontSize="sm" color="gray.500">
                    Last updated: {new Date(deployment.lastValueTs).toLocaleTimeString()}
                  </Text>
                )}
              </HStack>
            </HStack>
          </Card.Header>
          <Card.Body>
            {deployment ? (
              <HStack justify="center" gap={8}>
                <VStack>
                  <Text fontSize="6xl" fontWeight="bold" color="blue.500">
                    {deployment.lastValue.toFixed(1)}
                  </Text>
                  <Text fontSize="xl" color="gray.600">{unitInfo.symbol}</Text>
                  <TrendIndicator trend={trend.trend} value={trend.value} />
                </VStack>
              </HStack>
            ) : (
              <VStack gap={4} py={8}>
                <Info size={48} color="gray.300" />
                <Text color="gray.500" fontSize="lg">
                  No readings available yet
                </Text>
                <Text color="gray.400" fontSize="sm">
                  The sensor will start sending data once connected
                </Text>
              </VStack>
            )}
          </Card.Body>
        </Card.Root>

        {/* Performance Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Total Readings</Stat.Label>
                <Stat.ValueText>{chartData.length}</Stat.ValueText>
                <Stat.HelpText>
                  <Stat.UpIndicator /> Last 24 hours
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Average Value</Stat.Label>
                <Stat.ValueText>
                  {chartData.length > 0 
                    ? (chartData.reduce((sum, point) => sum + point.value, 0) / chartData.length).toFixed(1)
                    : '0'
                  }
                </Stat.ValueText>
                <Stat.HelpText>
                  <Stat.UpIndicator /> {unitInfo.symbol}
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Min Value</Stat.Label>
                <Stat.ValueText>
                  {chartData.length > 0 
                    ? Math.min(...chartData.map(point => point.value)).toFixed(1)
                    : '0'
                  }
                </Stat.ValueText>
                <Stat.HelpText>
                  <Stat.DownIndicator /> {unitInfo.symbol}
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Max Value</Stat.Label>
                <Stat.ValueText>
                  {chartData.length > 0 
                    ? Math.max(...chartData.map(point => point.value)).toFixed(1)
                    : '0'
                  }
                </Stat.ValueText>
                <Stat.HelpText>
                  <Stat.UpIndicator /> {unitInfo.symbol}
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Real-time Chart */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Header>
            <HStack justify="space-between">
              <Heading size="md">Real-time Readings</Heading>
              <HStack gap={2}>
                <Badge colorPalette={isChartPaused ? 'red' : 'green'} variant="subtle">
                  {isChartPaused ? 'Paused' : 'Live'}
                </Badge>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download size={16} />
                  Export
                </Button>
              </HStack>
            </HStack>
          </Card.Header>
          <Card.Body>
            <SensorLineChart
              data={chartData}
              title={`${deployment.componentType.name} - Real-time Data`}
              unit={unitInfo.symbol}
              height={400}
              showGrid={true}
              showLegend={true}
              color={deployment.connectionStatus === 'connected' ? '#38A169' : '#E53E3E'}
              isLoading={isLoadingReadings}
            />
          </Card.Body>
        </Card.Root>

        {/* Tabs */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Body p={0}>
            <Tabs.Root>
              <Tabs.List px={6} pt={6}>
                <Tabs.Trigger value="recent-readings">Recent Readings</Tabs.Trigger>
                <Tabs.Trigger value="specifications">Specifications</Tabs.Trigger>
                <Tabs.Trigger value="configuration">Configuration</Tabs.Trigger>
                <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="recent-readings">
                <VStack align="stretch" gap={4} p={6}>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Recent Readings</Text>
                    <Text fontSize="sm" color="gray.500">
                      {chartData.length} readings
                    </Text>
                  </HStack>

                  {chartData.length > 0 ? (
                    <Box overflowX="auto">
                      <Table.Root variant="outline" size="sm">
                        <Table.Header>
                          <Table.Row>
                            <Table.Cell>Timestamp</Table.Cell>
                            <Table.Cell>Value</Table.Cell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {chartData.slice(-10).reverse().map((reading, index) => (
                            <Table.Row key={index}>
                              <Table.Cell fontSize="sm">
                                {new Date(reading.timestamp).toLocaleString()}
                              </Table.Cell>
                              <Table.Cell fontWeight="medium">
                                {reading.value.toFixed(2)} {unitInfo.symbol}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </Box>
                  ) : (
                    <VStack gap={4} py={8}>
                      <Info size={48} color="gray.300" />
                      <Text color="gray.500">No readings available</Text>
                    </VStack>
                  )}
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="specifications">
                <VStack align="stretch" gap={6} p={6}>
                  <Box>
                    <Text fontWeight="medium" mb={3}>Device Information</Text>
                    <SimpleGrid columns={2} gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Device ID</Text>
                        <Text>{deployment.device.identifier}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Model</Text>
                        <Text>{deployment.device.model || 'Unknown'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Type</Text>
                        <Text>{deployment.componentType.name}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Unit</Text>
                        <Text>{unitInfo.label} ({unitInfo.symbol})</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Location</Text>
                        <Text>{deployment.location || 'Unknown'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Status</Text>
                        <Text>{deployment.device.status}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="configuration">
                <VStack align="stretch" gap={6} p={6}>
                  <Box>
                    <Text fontWeight="medium" mb={3}>Current Configuration</Text>
                    <SimpleGrid columns={2} gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Active</Text>
                        <Text>{deployment.active ? 'Yes' : 'No'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Created</Text>
                        <Text>{new Date(deployment.createdAt).toLocaleDateString()}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Last Updated</Text>
                        <Text>{new Date(deployment.updatedAt).toLocaleDateString()}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Description</Text>
                        <Text>{deployment.description || 'No description'}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Button variant="outline" onClick={handleEdit}>
                    <Edit size={16} />
                    Edit Configuration
                  </Button>
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="analytics">
                <VStack align="stretch" gap={4} p={6}>
                  <Text fontWeight="medium">Analytics & Trends</Text>
                  <Box textAlign="center" py={8} gap={2}>
                    <LineChart size={48} color="gray.400"/>
                    <Text color="gray.500">Advanced analytics will be displayed here</Text>
                  </Box>
                </VStack>
              </Tabs.Content>
            </Tabs.Root>
          </Card.Body>
        </Card.Root>
      </VStack>

      {/* Configuration Modal */}
      <Dialog.Root open={isConfigOpen} onOpenChange={onConfigClose} size="lg">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              {isEditing ? 'Edit Configuration' : 'Sensor Configuration'}
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={6} align="stretch">
                <Field label="Sensor Name">
                  <Input
                    defaultValue={deployment.componentType.name}
                    placeholder="Enter sensor name"
                  />
                </Field>

                <Field label="Description">
                  <Textarea 
                    defaultValue={deployment.description || ''}
                    placeholder="Enter sensor description..."
                  />
                </Field>

                <Field label="Location">
                  <Input
                    defaultValue={deployment.location || ''}
                    placeholder="Enter sensor location"
                  />
                </Field>

                <Field label="Sampling Rate">
                  <Select.Root
                    collection={samplingRateCollection}
                    defaultValue={['30s']}
                  >
                    <Select.HiddenSelect />
                    <Select.Label>Select sampling rate</Select.Label>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select sampling rate" />
                    </Select.Trigger>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {samplingRateCollection.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Field>

                <Field label="Enable Sensor">
                  <Switch.Root defaultChecked={deployment.active} >
                  <Switch.Label>Enable sensor</Switch.Label>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  </Switch.Root>
                </Field>

                {isEditing && (
                  <HStack gap={4} justify="flex-end">
                    <Button variant="outline" onClick={onConfigClose}>
                      Cancel
                    </Button>
                    <Button colorPalette="blue" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </HStack>
                )}
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={isDeleteOpen} onOpenChange={onDeleteClose} size="md">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              Delete Sensor
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={4} align="stretch">
                <Alert.Root status="warning">
                  <Alert.Indicator />
                  <Alert.Title>Are you sure?</Alert.Title>
                  <Alert.Description>
                    This action cannot be undone. This will permanently delete the sensor and all its data.
                  </Alert.Description>
                </Alert.Root>
                
                <HStack gap={4} justify="flex-end">
                  <Button variant="outline" onClick={onDeleteClose}>
                    Cancel
                  </Button>
                  <Button colorPalette="red" onClick={handleDelete}>
                    Delete Sensor
                  </Button>
                </HStack>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Container>
  );
};

export default SensorDetailPage; 