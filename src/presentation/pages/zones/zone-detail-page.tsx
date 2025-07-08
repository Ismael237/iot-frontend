import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Icon,
  Heading,
  Stat,
  SimpleGrid,
  Card,
  Badge,
  Button,
  Menu,
  Alert,
  useDisclosure,
  Input,
  Select,
  Textarea,
  IconButton,
  Table,
  Dialog,
  Portal,
  createListCollection,
  Tabs,
} from '@chakra-ui/react';
import {
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Settings,
  Eye,
  History,
  Zap,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Building,
  Home,
  Factory,
  Warehouse,
  CheckCircle,
  ArrowLeft,
  Play,
  Pause,
  Minus,
  Info,
  Plus,
  TrendingDown,
  Cpu,
  AlertCircle,
  RefreshCw,
  Download,
  LineChart,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Field } from '@/presentation/components/ui/chakra/field';
import { useColorModeValue } from '@presentation/components/ui/chakra/color-mode';
import { useZoneStore } from '@domain/store/zone-store';
import { ZoneStatus } from '@domain/entities/zone.entity';

// Mock data toggle - set to false to use real API
const USE_MOCK_DATA = true;

interface GlobalStats {
  activeZones: number;
  totalDevices: number;
  uptime: number;
  measurementsCollected: number;
}

interface PerformanceMetrics {
  efficiency: number;
  energyConsumption: number;
  maintenanceRequired: number;
  automationSuccess: number;
}

interface AlertSummary {
  active: number;
  resolved: number;
  critical: number;
  warning: number;
}

// Composant pour l'icône de la zone
const ZoneIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 20 }) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'building':
        return <Building size={size} />;
      case 'home':
        return <Home size={size} />;
      case 'factory':
        return <Factory size={size} />;
      case 'warehouse':
        return <Warehouse size={size} />;
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return CheckCircle;
    case 'inactive':
      return Minus;
    case 'maintenance':
      return Clock;
    case 'alert':
      return AlertCircle;
    default:
      return Activity;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'green';
    case 'inactive':
      return 'gray';
    case 'maintenance':
      return 'yellow';
    case 'offline':
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

export const ZoneDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedZone,
    isLoading,
    error,
    fetchZoneById,
    updateZone,
    deleteZone,
    removeComponentFromZone,
  } = useZoneStore();

  const [isChartPaused, setIsChartPaused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { open: isConfigOpen, onOpen: onConfigOpen, onClose: onConfigClose } = useDisclosure();
  const { open: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { open: isAddComponentOpen, onOpen: onAddComponentOpen, onClose: onAddComponentClose } = useDisclosure();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const zoneTypeCollection = createListCollection({
    items: [
      { label: 'Building', value: 'building' },
      { label: 'Home', value: 'home' },
      { label: 'Factory', value: 'factory' },
      { label: 'Office', value: 'office' },
      { label: 'Warehouse', value: 'warehouse' },
    ],
  });

  // Charger les données de la zone
  useEffect(() => {
    if (!id) return;
    
    const zoneId = parseInt(id);
    fetchZoneById(zoneId);

    // Polling toutes les 30 secondes pour les données en temps réel
    const interval = setInterval(() => {
      if (!isChartPaused) {
        fetchZoneById(zoneId);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [id, isChartPaused, fetchZoneById]);

  // Calcul de la tendance
  const calculateTrend = (): { trend: 'up' | 'down' | 'stable'; value: number } => {
    if (!selectedZone) return { trend: 'stable', value: 0 };
    
    // Simulation de tendance basée sur l'ID de la zone
    const trend = selectedZone.id % 3 === 0 ? 'up' : selectedZone.id % 3 === 1 ? 'down' : 'stable';
    const value = Math.random() * 10;
    return { trend, value };
  };

  const handleRefresh = () => {
    if (id) {
      const zoneId = parseInt(id);
      fetchZoneById(zoneId);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    onConfigOpen();
  };

  const handleSave = async () => {
    if (!selectedZone) return;
    
    try {
      await updateZone(selectedZone.id, {
        name: selectedZone.name,
        description: selectedZone.description,
        metadata: selectedZone.metadata,
      });
      setIsEditing(false);
      onConfigClose();
    } catch (error) {
      console.error('Failed to update zone:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedZone) return;
    
    try {
      await deleteZone(selectedZone.id);
      onDeleteClose();
      navigate('/zones');
    } catch (error) {
      console.error('Failed to delete zone:', error);
    }
  };

  const handleExport = () => {
    if (!selectedZone) return;
    
    // Export zone data
    const csvContent = selectedZone.componentDeployments?.map(component => 
      `${component.id},${component.name || 'Unknown'},${component.componentType?.name || 'Unknown'},${component.device?.status || 'unknown'}`
    ).join('\n') || '';
    
    const blob = new Blob([`id,name,type,status\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zone-${id}-components.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center" py={12}>
            <Icon as={RefreshCw} size="lg" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">Loading zone details...</Text>
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
            <Alert.Title>Error loading zone!</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        </VStack>
      </Container>
    );
  }

  if (!selectedZone) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>Zone not found</Alert.Title>
            <Alert.Description>Please select a zone from the zones list.</Alert.Description>
          </Alert.Root>
        </VStack>
      </Container>
    );
  }

  const trend = calculateTrend();
  const zoneType = selectedZone.metadata?.type || 'building';
  const occupancy = selectedZone.metadata?.occupancy || 0;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <Box>
            <HStack mb={2}>
              <IconButton variant="ghost" onClick={() => navigate('/zones')}>
                <ArrowLeft size={16} />
              </IconButton>
              <HStack gap={3}>
                <ZoneIcon type={zoneType} />
                <Heading size="lg">{selectedZone.name}</Heading>
              </HStack>
            </HStack>
            <HStack gap={4}>
              <Badge colorPalette={getStatusColor(selectedZone.status)} variant="subtle">
                {selectedZone.status}
              </Badge>
              <Text color="gray.600">{selectedZone.description || 'No description'}</Text>
              <HStack>
                <Icon as={MapPin} size="sm" />
                <Text fontSize="sm" color="gray.500">
                  Zone ID: {selectedZone.id}
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
            <Button variant="outline" onClick={handleRefresh} loading={isLoading}>
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
                    Delete Zone
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </HStack>
        </HStack>

        {/* Current Status */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Header>
            <HStack justify="space-between">
              <Heading size="md">Zone Status</Heading>
              <HStack gap={2}>
                <Icon as={getStatusIcon(selectedZone.status)} 
                      color={`${getStatusColor(selectedZone.status)}.500`} />
                <Text fontSize="sm" color="gray.500">
                  Last updated: {new Date(selectedZone.updatedAt).toLocaleTimeString()}
                </Text>
              </HStack>
            </HStack>
          </Card.Header>
          <Card.Body>
            <HStack justify="center" gap={8}>
              <VStack>
                <Text fontSize="6xl" fontWeight="bold" color="blue.500">
                  {selectedZone.componentDeployments?.length || 0}
                </Text>
                <Text fontSize="xl" color="gray.600">Components</Text>
                <TrendIndicator trend={trend.trend} value={trend.value} />
              </VStack>
              <VStack align="start" gap={4}>
                <HStack>
                  <Icon as={Cpu} color="green.500" />
                  <Text>Devices: {selectedZone.deviceCount}</Text>
                </HStack>
                <HStack>
                  <Icon as={BarChart3} color="blue.500" />
                  <Text>Sensors: {selectedZone.sensorCount}</Text>
                </HStack>
                <HStack>
                  <Icon as={Zap} color="purple.500" />
                  <Text>Actuators: {selectedZone.actuatorCount}</Text>
                </HStack>
              </VStack>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Performance Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Total Components</Stat.Label>
                <Stat.ValueText>{selectedZone.componentDeployments?.length || 0}</Stat.ValueText>
                <Stat.HelpText>
                  <Stat.UpIndicator /> Active devices
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Occupancy</Stat.Label>
                <Stat.ValueText>{occupancy}%</Stat.ValueText>
                <Stat.HelpText>
                  <Stat.UpIndicator /> Current capacity
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Sub-zones</Stat.Label>
                <Stat.ValueText>{selectedZone.childZones?.length || 0}</Stat.ValueText>
                <Stat.HelpText>
                  <Stat.UpIndicator /> Child zones
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <Stat.Root>
                <Stat.Label>Uptime</Stat.Label>
                <Stat.ValueText>99.8%</Stat.ValueText>
                <Stat.HelpText>
                  <Stat.UpIndicator /> Last 24 hours
                </Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Components List */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Header>
            <HStack justify="space-between">
              <Heading size="md">Zone Components</Heading>
              <HStack gap={2}>
                <Button size="sm" variant="outline" onClick={onAddComponentOpen}>
                  <Plus size={16} />
                  Add Component
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download size={16} />
                  Export
                </Button>
              </HStack>
            </HStack>
          </Card.Header>
          <Card.Body>
            {selectedZone.componentDeployments && selectedZone.componentDeployments.length > 0 ? (
              <Box overflowX="auto">
                <Table.Root variant="outline" size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.Cell>Name</Table.Cell>
                      <Table.Cell>Type</Table.Cell>
                      <Table.Cell>Device</Table.Cell>
                      <Table.Cell>Status</Table.Cell>
                      <Table.Cell>Actions</Table.Cell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {selectedZone.componentDeployments.map((component) => (
                      <Table.Row key={component.id}>
                        <Table.Cell fontWeight="medium">
                          {component.deployment.componentType.name || 'Unknown Component'}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                          size="sm"
                          colorPalette={(component.deployment.componentType?.category || '') === 'sensor' ? 'yellow' : 'blue'}
                          >
                          {component.deployment.componentType?.category || 'Unknown Type'}

                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          {component.deployment.device?.model || component.deployment.device?.identifier || 'Unknown Device'}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            colorPalette={getStatusColor(component.deployment.connectionStatus || 'unknown')}
                            size="sm"
                          >
                            {component.deployment.connectionStatus || 'unknown'}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <HStack gap={2}>
                            <IconButton
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/${component.deployment.componentType.category}s/${component.deployment.deploymentId}`)}
                            >
                              <Eye size={16} />
                            </IconButton>
                            {/* <IconButton
                              variant="ghost"
                              size="sm"
                              onClick={() => removeComponentFromZone(selectedZone.id, component.id)}
                            >
                              <Minus size={16} />
                            </IconButton> */}
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            ) : (
              <VStack gap={4} py={8}>
                <Info size={48} color="gray.300" />
                <Text color="gray.500" fontSize="lg">
                  No components in this zone
                </Text>
                <Text color="gray.400" fontSize="sm">
                  Add components to start monitoring this zone
                </Text>
                <Button onClick={onAddComponentOpen}>
                  <Plus size={16} />
                  Add Component
                </Button>
              </VStack>
            )}
          </Card.Body>
        </Card.Root>

        {/* Tabs */}
        <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <Card.Body p={0}>
            <Tabs.Root>
              <Tabs.List px={6} pt={6}>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="components">Components</Tabs.Trigger>
                <Tabs.Trigger value="configuration">Configuration</Tabs.Trigger>
                <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="overview">
                <VStack align="stretch" gap={6} p={6}>
                  <Box>
                    <Text fontWeight="medium" mb={3}>Zone Information</Text>
                    <SimpleGrid columns={2} gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Zone ID</Text>
                        <Text>{selectedZone.id}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Type</Text>
                        <Text textTransform="capitalize">{zoneType}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Status</Text>
                        <Text>{selectedZone.status}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Occupancy</Text>
                        <Text>{occupancy}%</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Created</Text>
                        <Text>{new Date(selectedZone.createdAt).toLocaleDateString()}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Last Updated</Text>
                        <Text>{new Date(selectedZone.updatedAt).toLocaleDateString()}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  {selectedZone.description && (
                    <Box>
                      <Text fontWeight="medium" mb={3}>Description</Text>
                      <Text color="gray.600">{selectedZone.description}</Text>
                    </Box>
                  )}
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="components">
                <VStack align="stretch" gap={4} p={6}>
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Component Details</Text>
                    <Button size="sm" onClick={onAddComponentOpen}>
                      <Plus size={16} />
                      Add Component
                    </Button>
                  </HStack>

                  {selectedZone.componentDeployments && selectedZone.componentDeployments.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      {selectedZone.componentDeployments.map((component) => (
                        <Card.Root key={component.deployment.deploymentId} variant="outline">
                          <Card.Body>
                            <VStack align="start" gap={2}>
                              <HStack justify="space-between" w="full">
                                <Text fontWeight="medium">
                                  {component.deployment.componentType?.name || 'Unknown Component'}
                                </Text>
                                <Badge
                                  colorPalette={getStatusColor(component.device?.status || 'unknown')}
                                  size="sm"
                                >
                                  {component.deployment.status || 'unknown'}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                {component.deployment.componentType?.name || 'Unknown Type'}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                Device: {component.deployment.device?.model || component.deployment.device?.identifier || 'Unknown'}
                              </Text>
                            </VStack>
                          </Card.Body>
                        </Card.Root>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <VStack gap={4} py={8}>
                      <Info size={48} color="gray.300" />
                      <Text color="gray.500">No components available</Text>
                    </VStack>
                  )}
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="configuration">
                <VStack align="stretch" gap={6} p={6}>
                  <Box>
                    <Text fontWeight="medium" mb={3}>Current Configuration</Text>
                    <SimpleGrid columns={2} gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Active</Text>
                        <Text>{selectedZone.status === ZoneStatus.ACTIVE ? 'Yes' : 'No'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Created</Text>
                        <Text>{new Date(selectedZone.createdAt).toLocaleDateString()}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Last Updated</Text>
                        <Text>{new Date(selectedZone.updatedAt).toLocaleDateString()}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Description</Text>
                        <Text>{selectedZone.description || 'No description'}</Text>
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
              {isEditing ? 'Edit Configuration' : 'Zone Configuration'}
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={6} align="stretch">
                <Field label="Zone Name">
                  <Input
                    defaultValue={selectedZone.name}
                    placeholder="Enter zone name"
                  />
                </Field>

                <Field label="Description">
                  <Textarea 
                    defaultValue={selectedZone.description || ''}
                    placeholder="Enter zone description..."
                  />
                </Field>

                <Field label="Zone Type">
                  <Select.Root
                    collection={zoneTypeCollection}
                    defaultValue={[zoneType]}
                  >
                    <Select.HiddenSelect />
                    <Select.Label>Select zone type</Select.Label>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select zone type" />
                    </Select.Trigger>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {zoneTypeCollection.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Field>

                <Field label="Occupancy">
                  <Input
                    type="number"
                    defaultValue={occupancy.toString()}
                    placeholder="Enter occupancy percentage"
                  />
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
              Delete Zone
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={4} align="stretch">
                <Alert.Root status="warning">
                  <Alert.Indicator />
                  <Alert.Title>Are you sure?</Alert.Title>
                  <Alert.Description>
                    This action cannot be undone. This will permanently delete the zone and all its components.
                  </Alert.Description>
                </Alert.Root>
                
                <HStack gap={4} justify="flex-end">
                  <Button variant="outline" onClick={onDeleteClose}>
                    Cancel
                  </Button>
                  <Button colorPalette="red" onClick={handleDelete}>
                    Delete Zone
                  </Button>
                </HStack>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Add Component Modal */}
      <Dialog.Root open={isAddComponentOpen} onOpenChange={onAddComponentClose} size="md">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              Add Component to Zone
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={4} align="stretch">
                <Text color="gray.600">
                  Select a component to add to this zone. This will associate the component with the zone for monitoring and management.
                </Text>
                
                <HStack gap={4} justify="flex-end">
                  <Button variant="outline" onClick={onAddComponentClose}>
                    Cancel
                  </Button>
                  <Button colorPalette="blue" onClick={onAddComponentClose}>
                    Add Component
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

export default ZoneDetailPage; 