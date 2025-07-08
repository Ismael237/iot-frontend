import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  SimpleGrid,
  Stat,
  Input,
  Select,
  createListCollection,
  Portal,
  Alert,
  Dialog,
  useDisclosure,
  Textarea,
  IconButton,
  Table,
  InputGroup,
  Icon,
} from '@chakra-ui/react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Building,
  Home,
  Factory,
  Warehouse,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Minus,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useZoneStore } from '@domain/store/zone-store';
import { ZoneStatus, type Zone, type CreateZoneRequest } from '@domain/entities/zone.entity';
import { Field } from '@presentation/components/ui/chakra/field';

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

export const ZoneManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    zones,
    isLoading,
    error,
    fetchZones,
    createZone,
    updateZone,
    deleteZone,
  } = useZoneStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CreateZoneRequest>({
    name: '',
    description: '',
    parentZoneId: undefined,
    metadata: {},
  });

  const { open: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { open: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { open: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Charger les zones au montage
  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  // Collections pour les filtres
  const statusCollection = createListCollection({
    items: [
      { label: 'All Status', value: 'all' },
      { label: 'Active', value: ZoneStatus.ACTIVE },
      { label: 'Inactive', value: ZoneStatus.INACTIVE },
      { label: 'Maintenance', value: ZoneStatus.MAINTENANCE },
      { label: 'Alert', value: ZoneStatus.ALERT },
    ],
  });

  const zoneTypeCollection = createListCollection({
    items: [
      { label: 'Building', value: 'building' },
      { label: 'Home', value: 'home' },
      { label: 'Factory', value: 'factory' },
      { label: 'Office', value: 'office' },
      { label: 'Warehouse', value: 'warehouse' },
    ],
  });

  // Calcul des statistiques
  const statsData = {
    total: zones.length,
    active: 2,
    inactive: zones.filter(z => z.status === ZoneStatus.INACTIVE).length,
    maintenance: zones.filter(z => z.status === ZoneStatus.MAINTENANCE).length,
    alert: zones.filter(z => z.status === ZoneStatus.ALERT).length,
  };

  // Filtrage des zones
  const filteredZones = zones.filter(zone => {
    const zoneName = zone.name || 'Unknown Zone';
    const zoneDescription = zone.description || '';

    const matchesSearch = zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zoneDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter.includes('all') ||
      statusFilter.includes(zone.status || ZoneStatus.ACTIVE);

    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    fetchZones();
  };

  const handleCreateZone = () => {
    setFormData({
      name: '',
      description: '',
      parentZoneId: undefined,
      metadata: { type: 'building', occupancy: 0 },
    });
    setIsEditing(false);
    onCreateOpen();
  };

  const handleEditZone = (zone: Zone) => {
    setSelectedZone(zone);
    setFormData({
      name: zone.name,
      description: zone.description || '',
      parentZoneId: zone.parentZoneId,
      metadata: zone.metadata || { type: 'building', occupancy: 0 },
    });
    setIsEditing(true);
    onEditOpen();
  };

  const handleDeleteZone = (zone: Zone) => {
    setSelectedZone(zone);
    onDeleteOpen();
  };

  const handleSaveZone = async () => {
    try {
      if (isEditing && selectedZone) {
        await updateZone(selectedZone.id, formData);
      } else {
        await createZone(formData);
      }
      
      if (isEditing) {
        onEditClose();
      } else {
        onCreateClose();
      }
      
      setFormData({
        name: '',
        description: '',
        parentZoneId: undefined,
        metadata: {},
      });
    } catch (error) {
      console.error('Failed to save zone:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedZone) return;
    
    try {
      await deleteZone(selectedZone.zoneId);
      onDeleteClose();
    } catch (error) {
      console.error('Failed to delete zone:', error);
    }
  };

  const handleViewZone = (zone: Zone) => {
    navigate(`/zones/${zone.zoneId}`);
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
    <Container maxW="container.xl" py={2} px={2}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1}>
            <Heading size="lg" color="gray.800">
              Zone Management
            </Heading>
            <Text color="gray.600">
              Create, edit, and manage IoT zones
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

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
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
            borderRadius="lg" p={4}
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
        <Card.Root>
          <Card.Body>
            <HStack gap={4}>
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

              <Text fontSize="sm" color="gray.500">
                {filteredZones.length} of {zones.length} zones
              </Text>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Zones Table */}
        <Card.Root>
          <Card.Header>
            <Heading size="md">Zones</Heading>
          </Card.Header>
          <Card.Body>
            {isLoading ? (
              <VStack gap={4} py={8}>
                <Text color="gray.500">Loading zones...</Text>
              </VStack>
            ) : filteredZones.length > 0 ? (
              <Box overflowX="auto">
                <Table.Root variant="outline" size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.Cell>Zone</Table.Cell>
                      <Table.Cell>Type</Table.Cell>
                      <Table.Cell>Status</Table.Cell>
                      <Table.Cell>Components</Table.Cell>
                      <Table.Cell>Created</Table.Cell>
                      <Table.Cell>Actions</Table.Cell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredZones.map((zone) => {
                      const zoneType = zone.metadata?.type || 'building';
                      return (
                        <Table.Row key={zone.id}>
                          <Table.Cell>
                            <HStack gap={3}>
                              <ZoneIcon type={zoneType} />
                              <VStack align="start" gap={1}>
                                <Text fontWeight="medium">{zone.name}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {zone.description || 'No description'}
                                </Text>
                              </VStack>
                            </HStack>
                          </Table.Cell>
                          <Table.Cell>
                            <Text textTransform="capitalize">{zoneType}</Text>
                          </Table.Cell>
                          <Table.Cell>
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
                          </Table.Cell>
                          <Table.Cell>
                            <Text>{zone.componentDeployments?.length || 0}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text fontSize="sm">
                              {new Date(zone.createdAt).toLocaleDateString()}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <HStack gap={2}>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewZone(zone)}
                              >
                                <Eye size={16} />
                              </IconButton>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditZone(zone)}
                              >
                                <Edit size={16} />
                              </IconButton>
                              <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteZone(zone)}
                                color="red.500"
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </HStack>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table.Root>
              </Box>
            ) : (
              <VStack gap={4} py={8}>
                <MapPin size={48} color="gray.300" />
                <Text color="gray.500" fontSize="lg">
                  No zones found
                </Text>
                <Text color="gray.400" fontSize="sm">
                  Create your first zone to get started
                </Text>
                <Button onClick={handleCreateZone}>
                  <Plus size={16} />
                  Create Zone
                </Button>
              </VStack>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>

      {/* Create/Edit Zone Modal */}
      <Dialog.Root open={isCreateOpen || isEditOpen} onOpenChange={isEditing ? onEditClose : onCreateClose} size="lg">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              {isEditing ? 'Edit Zone' : 'Create New Zone'}
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={6} align="stretch">
                <Field label="Zone Name">
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter zone name"
                  />
                </Field>

                <Field label="Description">
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter zone description..."
                  />
                </Field>

                <Field label="Zone Type">
                  <Select.Root
                    collection={zoneTypeCollection}
                    value={[formData.metadata?.type || 'building']}
                    onValueChange={({ value }) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, type: value[0] || 'building' }
                    })}
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

                <Field label="Occupancy (%)">
                  <Input
                    type="number"
                    value={formData.metadata?.occupancy || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, occupancy: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="Enter occupancy percentage"
                  />
                </Field>

                <HStack gap={4} justify="flex-end">
                  <Button variant="outline" onClick={isEditing ? onEditClose : onCreateClose}>
                    Cancel
                  </Button>
                  <Button colorPalette="blue" onClick={handleSaveZone}>
                    {isEditing ? 'Update Zone' : 'Create Zone'}
                  </Button>
                </HStack>
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
                
                {selectedZone && (
                  <Box>
                    <Text fontWeight="medium">Zone to delete:</Text>
                    <Text color="gray.600">{selectedZone.name}</Text>
                  </Box>
                )}
                
                <HStack gap={4} justify="flex-end">
                  <Button variant="outline" onClick={onDeleteClose}>
                    Cancel
                  </Button>
                  <Button colorPalette="red" onClick={handleConfirmDelete}>
                    Delete Zone
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

export default ZoneManagementPage; 