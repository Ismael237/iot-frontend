import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Icon,
  Flex,
  Switch,
  Menu,
  Portal,
  Badge,
  InputGroup,
  Card,
  Button,
  IconButton,
  Skeleton,
  AlertRoot,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Dialog,
  createListCollection,
  Select,
  Input,
} from '@chakra-ui/react';
import {
  Search,
  Plus,
  Zap,
  Clock,
  Thermometer,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Play,
  Pause,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Timer,
  Gauge,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAutomationStore } from '@domain/store/automation-store';
import { type AutomationRule, type ComparisonOperator, AutomationActionTypeEnum } from '@domain/entities/automation.entity';
import { toaster } from '@/presentation/components/ui/chakra/toaster';

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

// Composant pour l'icône du type d'automation
const AutomationIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 20 }) => {
  const getIcon = () => {
    switch (type) {
      case 'sensor_based':
        return <Thermometer size={size} />;
      case 'schedule':
        return <Clock size={size} />;
      case 'motion_based':
        return <Activity size={size} />;
      case 'time_based':
        return <Timer size={size} />;
      case 'threshold':
        return <Gauge size={size} />;
      case 'condition':
        return <AlertTriangle size={size} />;
      default:
        return <Zap size={size} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'sensor_based':
        return 'blue';
      case 'schedule':
        return 'green';
      case 'motion_based':
        return 'orange';
      case 'time_based':
        return 'purple';
      case 'threshold':
        return 'cyan';
      case 'condition':
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

export const AutomationRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    rules,
    isLoading,
    error,
    fetchRules,
    activateRule,
    deleteRule,
    selectedRule,
    setSelectedRule,
  } = useAutomationStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { open: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
  const { open: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [ruleToDelete, setRuleToDelete] = useState<AutomationRule | null>(null);

  // Collections pour les filtres
  const statusCollection = createListCollection({
    items: [
      { label: 'All Status', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  });

  const priorityCollection = createListCollection({
    items: [
      { label: 'All Priorities', value: 'all' },
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
      { label: 'Low', value: 'low' },
    ],
  });

  // Polling pour les règles en temps réel
  useEffect(() => {
    fetchRules();

    // Polling toutes les 30 secondes
    const interval = setInterval(() => {
      fetchRules();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchRules]);

  // Filtrage des règles
  const filteredRules = rules.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rule.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? rule.isActive : !rule.isActive);

    // Pour l'instant, on simule la priorité basée sur le type d'action
    const getPriority = (rule: AutomationRule) => {
      if (rule.actionType === AutomationActionTypeEnum.CREATE_ALERT) return 'high';
      if (rule.actionType === AutomationActionTypeEnum.TRIGGER_ACTUATOR) return 'medium';
      return 'low';
    };

    const matchesPriority = priorityFilter === 'all' || 
      getPriority(rule) === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calcul des statistiques
  const stats = {
    total: rules.length,
    active: rules.filter(r => r.isActive).length,
    inactive: rules.filter(r => !r.isActive).length,
    triggered: rules.reduce((sum, r) => sum + (r.lastTriggered ? 1 : 0), 0),
  };

  // Calcul de la tendance (simulé)
  const calculateTrend = (): { trend: 'up' | 'down' | 'stable'; value: number } => {
    if (rules.length < 2) return { trend: 'stable', value: 0 };
    
    const recent = rules.slice(-5);
    const older = rules.slice(-10, -5);
    
    if (older.length === 0) return { trend: 'stable', value: 0 };
    
    const recentActive = recent.filter(r => r.isActive).length;
    const olderActive = older.filter(r => r.isActive).length;
    
    const change = ((recentActive - olderActive) / olderActive) * 100;
    
    if (Math.abs(change) < 5) return { trend: 'stable', value: 0 };
    return { trend: change > 0 ? 'up' : 'down', value: Math.abs(change) };
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'green' : 'red';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getPriority = (rule: AutomationRule) => {
    if (rule.actionType === AutomationActionTypeEnum.TRIGGER_ACTUATOR) return 'high';
    if (rule.actionType === AutomationActionTypeEnum.CREATE_ALERT) return 'medium';
    return 'low';
  };

  const handleViewDetails = (rule: AutomationRule) => {
    setSelectedRule(rule);
    onOpen();
  };

  const handleToggleStatus = async (ruleId: number, currentStatus: boolean) => {
    try {
      await activateRule(ruleId, !currentStatus);
      toaster.create({
        title: 'Rule Updated',
        description: `Successfully ${currentStatus ? 'disabled' : 'enabled'} rule`,
        type: 'success',
        duration: 3000,
        closable: true,
      });
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to update rule status',
        type: 'error',
        duration: 3000,
        closable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (!ruleToDelete) return;
    
    try {
      await deleteRule(ruleToDelete.ruleId);
      onDeleteClose();
      setRuleToDelete(null);
      toaster.create({
        title: 'Rule Deleted',
        description: 'Automation rule deleted successfully',
        type: 'success',
        duration: 3000,
        closable: true,
      });
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to delete automation rule',
        type: 'error',
        duration: 3000,
        closable: true,
      });
    }
  };

  const getTriggerDescription = (rule: AutomationRule) => {
    const operatorMap: Record<ComparisonOperator, string> = {
      '>': 'greater than',
      '<': 'less than',
      '>=': 'greater than or equal to',
      '<=': 'less than or equal to',
      '==': 'equal to',
      '!=': 'not equal to',
    };

    return `${rule.operator} ${rule.thresholdValue}`;
  };

  const getActionDescription = (rule: AutomationRule) => {
    switch (rule.actionType) {
      case AutomationActionTypeEnum.CREATE_ALERT:
        return `Send an alert: ${rule.alertTitle || 'Alert'}`;
      case AutomationActionTypeEnum.TRIGGER_ACTUATOR:
        return `Control an actuator: ${rule.actuatorCommand || 'Command'}`;
      default:
        return 'Custom action';
    }
  };

  const trend = calculateTrend();

  if (error) {
    return (
      <AlertRoot status="error" mb={4}>
        <AlertTitle>Error loading automation rules!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </AlertRoot>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Automation Rules</Heading>
          <Text color="gray.600" fontSize="lg">
            Create and manage intelligent automation rules for your IoT devices
          </Text>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
          <Card.Root p={2} bg="white" borderWidth="1px" borderColor="gray.200">
            <Card.Body>
              <VStack gap={2} p={4}>
                <Icon as={Zap} color="blue.500" />
                <Text fontSize="2xl" fontWeight="bold">{stats.total}</Text>
                <Text fontSize="sm" color="gray.600">Total Rules</Text>
                <TrendIndicator trend={trend.trend} value={trend.value} />
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root p={2} bg="white" borderWidth="1px" borderColor="gray.200">
            <VStack gap={2} p={4}>
              <Icon as={Play} color="green.500" />
              <Text fontSize="2xl" fontWeight="bold" color="green.500">{stats.active}</Text>
              <Text fontSize="sm" color="gray.600">Active</Text>
            </VStack>
          </Card.Root>

          <Card.Root p={2} bg="white" borderWidth="1px" borderColor="gray.200">
            <VStack gap={2} p={4}>
              <Icon as={Pause} color="gray.500" />
              <Text fontSize="2xl" fontWeight="bold" color="gray.500">{stats.inactive}</Text>
              <Text fontSize="sm" color="gray.600">Inactive</Text>
            </VStack>
          </Card.Root>

          <Card.Root p={2} bg="white" borderWidth="1px" borderColor="gray.200">
            <VStack gap={2} p={4}>
              <Icon as={AlertTriangle} color="red.500" />
              <Text fontSize="2xl" fontWeight="bold" color="red.500">{stats.triggered}</Text>
              <Text fontSize="sm" color="gray.600">Triggered</Text>
            </VStack>
          </Card.Root>
        </SimpleGrid>

        {/* Filters and Actions */}
        <HStack gap={4} justify="space-between" flexWrap="wrap">
          <HStack gap={4} flexWrap="wrap">
            <InputGroup maxW="300px" startElement={<Icon as={Search} color="gray.400" />}>
              <Input
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Select.Root
              collection={statusCollection}
              value={[statusFilter]}
              onValueChange={({ value }) => setStatusFilter(value?.[0] || 'all')}
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
              collection={priorityCollection}
              value={[priorityFilter]}
              onValueChange={({ value }) => setPriorityFilter(value?.[0] || 'all')}
              width="200px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Priorities" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {priorityCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </HStack>
          <HStack gap={2}>
            <Button variant="outline" onClick={() => fetchRules()} loading={isLoading}>
              <RefreshCw size={16} />
              Refresh
            </Button>
            <Button colorPalette="blue" onClick={() => navigate('/automation/new')}>
              <Plus size={16} />Create Rule
            </Button>
          </HStack>
        </HStack>

        {/* Rules Grid */}
        {isLoading ? (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card.Root key={i} p={6} bg="white" borderWidth="1px" borderColor="gray.200">
                <Skeleton height="200px" />
              </Card.Root>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            {filteredRules.map((rule) => (
              <Card.Root key={rule.ruleId} p={6} bg="white" borderWidth="1px" borderColor="gray.200">
                <Box pb={2}>
                  <Flex justify="space-between" align="start">
                    <VStack align="start" gap={2}>
                      <HStack>
                        <AutomationIcon type={rule.actionType} />
                        <Heading size="md">{rule.name}</Heading>
                      </HStack>
                      <HStack gap={2}>
                        <Badge colorPalette={getStatusColor(rule.isActive)} variant="subtle">
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge colorPalette={getPriorityColor(getPriority(rule))} variant="outline">
                          {getPriority(rule)}
                        </Badge>
                      </HStack>
                    </VStack>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <IconButton aria-label="More actions" variant="ghost" size="sm"><MoreVertical size={16} /></IconButton>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Menu.Item value="view" onClick={() => handleViewDetails(rule)}>
                              <Eye size={16} style={{ marginRight: 8 }} /> View Details
                            </Menu.Item>
                            <Menu.Item value="edit" onClick={() => navigate(`/automation/${rule.ruleId}/edit`)}>
                              <Edit size={16} style={{ marginRight: 8 }} /> Edit Rule
                            </Menu.Item>
                            <Menu.Item value="test" onClick={() => {
                              toaster.create({
                                title: 'Test Rule',
                                description: 'Rule test initiated',
                                type: 'info',
                                duration: 3000,
                                closable: true,
                              });
                            }}>
                              <Play size={16} style={{ marginRight: 8 }} /> Test Rule
                            </Menu.Item>
                            <Menu.Item value="delete" color="fg.error" onClick={() => {
                              setRuleToDelete(rule);
                              onDeleteOpen();
                            }}>
                              <Trash2 size={16} style={{ marginRight: 8 }} /> Delete Rule
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  </Flex>
                </Box>
                <Box pt={0}>
                  <VStack align="stretch" gap={4}>
                    {rule.description && (
                      <Text fontSize="sm" color="gray.600">
                        {rule.description}
                      </Text>
                    )}
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Trigger:
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {getTriggerDescription(rule)}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Actions:
                      </Text>
                      <VStack align="start" gap={2}>
                        <HStack p={2} bg="blue.50" borderRadius="md" w="full">
                          <Icon as={Zap} color="blue.500" boxSize="16px" />
                          <Text fontSize="sm">{getActionDescription(rule)}</Text>
                        </HStack>
                      </VStack>
                    </Box>
                    <Box as="hr" my={4} borderColor="gray.200" />
                    <HStack justify="space-between" fontSize="sm" color="gray.500" gap={2}>
                      <VStack align="start" gap={0}>
                        <Text>Last triggered: {rule.lastTriggered ? new Date(rule.lastTriggered).toLocaleString() : 'Never'}</Text>
                        <Text>Cooldown: {rule.cooldownMinutes} min</Text>
                      </VStack>
                      <VStack align="end" gap={2}>
                        <Switch.Root 
                          checked={rule.isActive} 
                          onCheckedChange={() => handleToggleStatus(rule.ruleId, rule.isActive)} 
                          size="sm"
                        >
                          <Switch.HiddenInput />
                          <Switch.Control />
                        </Switch.Root>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              </Card.Root>
            ))}
          </SimpleGrid>
        )}

        {!isLoading && filteredRules.length === 0 && (
          <Box textAlign="center" py={12}>
            <Icon as={Zap} size="lg" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">
              No automation rules found matching your criteria
            </Text>
          </Box>
        )}
      </VStack>

      {/* Rule Details Modal */}
      <Dialog.Root open={isOpen} onOpenChange={onClose} size="lg">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              Rule Details
            </Dialog.Header>
            <Dialog.Body pb={6}>
              {selectedRule && (
                <VStack gap={6} align="stretch">
                  <HStack justify="space-between">
                    <VStack align="start" gap={1}>
                      <HStack>
                        <AutomationIcon type={selectedRule.actionType} />
                        <Heading size="md">{selectedRule.name}</Heading>
                      </HStack>
                      <HStack gap={2}>
                        <Badge colorPalette={getStatusColor(selectedRule.isActive)} variant="subtle">
                          {selectedRule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge colorPalette={getPriorityColor(getPriority(selectedRule))} variant="outline">
                          {getPriority(selectedRule)} priority
                        </Badge>
                      </HStack>
                    </VStack>
                  </HStack>
                  {selectedRule.description && (
                    <Text color="gray.600">{selectedRule.description}</Text>
                  )}
                  <Box as="hr" my={4} borderColor="gray.200" />
                  <Box>
                    <Text fontWeight="medium" mb={2}>Trigger</Text>
                    <Card.Root variant="outline" p={3}>
                      <VStack align="start" gap={1}>
                        <HStack>
                          <AutomationIcon type={selectedRule.actionType} />
                          <Text fontWeight="medium" textTransform="capitalize">
                            {selectedRule.actionType} Trigger
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {getTriggerDescription(selectedRule)}
                        </Text>
                      </VStack>
                    </Card.Root>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" mb={2}>Actions</Text>
                    <VStack align="start" gap={2}>
                      <HStack p={2} bg="blue.50" borderRadius="md" w="full">
                        <Icon as={Zap} color="blue.500" boxSize="16px" />
                        <Text fontSize="sm">{getActionDescription(selectedRule)}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                  <Box as="hr" my={4} borderColor="gray.200" />
                  <SimpleGrid columns={2} gap={4}>
                    <Box>
                      <Text fontWeight="medium" mb={1}>Last Triggered</Text>
                      <Text fontSize="sm" color="gray.600">
                        {selectedRule.lastTriggered ? new Date(selectedRule.lastTriggered).toLocaleString() : 'Never'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" mb={1}>Cooldown</Text>
                      <Text fontSize="sm" color="gray.600">{selectedRule.cooldownMinutes} minutes</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" mb={1}>Created</Text>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(selectedRule.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" mb={1}>Updated</Text>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(selectedRule.updatedAt).toLocaleDateString()}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </VStack>
              )}
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
              Delete Automation Rule
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={4} align="stretch">
                <AlertRoot status="warning">
                  <AlertTitle>Are you sure?</AlertTitle>
                  <AlertDescription>
                    This action cannot be undone. This will permanently delete the automation rule.
                  </AlertDescription>
                </AlertRoot>
                
                <HStack gap={4} justify="flex-end">
                  <Button variant="outline" onClick={onDeleteClose}>
                    Cancel
                  </Button>
                  <Button colorPalette="red" onClick={handleDelete}>
                    Delete Rule
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

export default AutomationRulesPage; 