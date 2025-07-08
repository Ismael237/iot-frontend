import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  IconButton,
  SimpleGrid,
  Spacer,
  InputGroup,
  Input,
  NativeSelect,
  Switch,
  Menu,
  Portal,
  Card,
  Stat,
  Button,
  Icon,
  Skeleton,
  AlertRoot,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Dialog,
  Textarea,
  Field,
  createListCollection,
  Select,
} from '@chakra-ui/react';
import {
  Zap,
  Search,
  MoreVertical,
  Plus,
  Play,
  Pause,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Activity,
  Timer,
  Bell,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Thermometer,
  Droplets,
  Lightbulb,
  Gauge,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAutomationStore } from '@domain/store/automation-store';
import { AutomationRule, ComparisonOperator, AutomationActionType } from '@domain/entities/automation.entity';
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

export const AutomationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    rules,
    isLoading,
    error,
    totalRules,
    fetchRules,
    activateRule,
    deleteRule,
    setSelectedRule,
    clearError,
  } = useAutomationStore();

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { open: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [ruleToDelete, setRuleToDelete] = useState<AutomationRule | null>(null);

  // Collections pour les filtres
  const typeCollection = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Sensor Based', value: 'sensor_based' },
      { label: 'Schedule', value: 'schedule' },
      { label: 'Motion Based', value: 'motion_based' },
      { label: 'Time Based', value: 'time_based' },
      { label: 'Threshold', value: 'threshold' },
      { label: 'Condition', value: 'condition' },
    ],
  });

  const statusCollection = createListCollection({
    items: [
      { label: 'All Status', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
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

  // Filtrage des automations
  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rule.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || 
      rule.actionType === typeFilter || 
      rule.operator === typeFilter;

    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? rule.isActive : !rule.isActive);

    return matchesSearch && matchesType && matchesStatus;
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

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle size={16} color="green" /> : <XCircle size={16} color="red" />;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'green' : 'red';
  };

  const handleToggle = async (ruleId: number, currentStatus: boolean) => {
    try {
      await activateRule(ruleId, !currentStatus);
      toaster.create({
        title: 'Automation Updated',
        description: `Successfully ${currentStatus ? 'disabled' : 'enabled'} automation`,
        type: 'success',
        duration: 3000,
        closable: true,
      });
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to update automation status',
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
        title: 'Automation Deleted',
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
      case 'notification':
        return `Send notification: ${rule.alertTitle || 'Alert'}`;
      case 'actuator':
        return `Control actuator: ${rule.actuatorCommand || 'Command'}`;
      default:
        return 'Custom action';
    }
  };

  const trend = calculateTrend();

  if (error) {
    return (
      <AlertRoot status="error" mb={4}>
        <AlertTitle>Error loading automations!</AlertTitle>
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
              Automation
            </Heading>
            <Text color="gray.600">
              Create and manage automation rules
            </Text>
          </VStack>
          <HStack gap={2}>
            <Button variant="outline" onClick={() => fetchRules()} loading={isLoading}>
              <RefreshCw size={16} />
              Refresh
            </Button>
            <Button
              colorPalette="blue"
              onClick={() => navigate('/automation/rules/new')}
            >
              <Plus size={16} />New Rule
            </Button>
          </HStack>
        </HStack>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={4} gap={6} mb={8}>
        <Card.Root>
          <Card.Body>
            <Stat.Root>
              <Stat.Label color="gray.600">Total Rules</Stat.Label>
              <Stat.ValueText fontSize="2xl" color="gray.800">
                {stats.total}
              </Stat.ValueText>
              <Stat.HelpText>
                <Stat.UpIndicator />
                {trend.value.toFixed(1)}%
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Body>
            <Stat.Root>
              <Stat.Label color="gray.600">Active</Stat.Label>
              <Stat.ValueText fontSize="2xl" color="green.600">
                {stats.active}
              </Stat.ValueText>
              <Stat.HelpText>
                <Stat.UpIndicator />
                {((stats.active / stats.total) * 100).toFixed(1)}%
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Body>
            <Stat.Root>
              <Stat.Label color="gray.600">Inactive</Stat.Label>
              <Stat.ValueText fontSize="2xl" color="red.600">
                {stats.inactive}
              </Stat.ValueText>
              <Stat.HelpText>
                <Stat.DownIndicator />
                {((stats.inactive / stats.total) * 100).toFixed(1)}%
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Body>
            <Stat.Root>
              <Stat.Label color="gray.600">Triggered</Stat.Label>
              <Stat.ValueText fontSize="2xl" color="blue.600">
                {stats.triggered}
              </Stat.ValueText>
              <Stat.HelpText>
                <Stat.UpIndicator />
                Last 24 hours
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      {/* Filters */}
      <Card.Root mb={6}>
        <Card.Body>
          <HStack gap={4}>
            <InputGroup maxW="400px" startElement={<Search size={16} color="gray.400" />}>
              <Input
                placeholder="Search automations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.currentTarget.value)}
              />
            </InputGroup>
            <Select.Root
              collection={typeCollection}
              value={[typeFilter]}
              onValueChange={({ value }) => setTypeFilter(value?.[0] || 'all')}
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
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              {filteredRules.length} of {rules.length} rules
            </Text>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Automations Grid */}
      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
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
          {filteredRules.map((rule) => (
            <Card.Root key={rule.ruleId}>
              <Card.Header mb={4}>
                <HStack justify="space-between">
                  <HStack gap={3}>
                    <AutomationIcon type={rule.actionType} />
                    <VStack align="start" gap={1}>
                      <Text fontWeight="semibold" color="gray.800">
                        {rule.name}
                      </Text>
                      <Badge colorPalette={getStatusColor(rule.isActive)} size="sm">
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </VStack>
                  </HStack>
                  <HStack gap={2}>
                    <Switch.Root 
                      checked={rule.isActive} 
                      onCheckedChange={() => handleToggle(rule.ruleId, rule.isActive)}
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                    </Switch.Root>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <IconButton
                          aria-label="More actions"
                          variant="ghost"
                          size="sm"
                        >
                          <MoreVertical size={16} />
                        </IconButton>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Menu.Item value="edit" onClick={() => navigate(`/automation/rules/${rule.ruleId}/edit`)}>
                              <Edit size={16} style={{ marginRight: 8 }} />
                              Edit Rule
                            </Menu.Item>
                            <Menu.Item value="history" onClick={() => navigate(`/automation/rules/${rule.ruleId}/history`)}>
                              <Eye size={16} style={{ marginRight: 8 }} />
                              View History
                            </Menu.Item>
                            <Menu.Item 
                              value="delete" 
                              color="fg.error" 
                              onClick={() => {
                                setRuleToDelete(rule);
                                onDeleteOpen();
                              }}
                            >
                              <Trash2 size={16} style={{ marginRight: 8 }} />
                              Delete Rule
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  </HStack>
                </HStack>
              </Card.Header>
              <Card.Body pt={0}>
                <VStack align="stretch" gap={4}>
                  {/* Description */}
                  {rule.description && (
                    <Text fontSize="sm" color="gray.600">
                      {rule.description}
                    </Text>
                  )}

                  {/* Trigger */}
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Trigger
                    </Text>
                    <Text fontSize="sm" color="gray.800">
                      {getTriggerDescription(rule)}
                    </Text>
                  </Box>

                  {/* Actions */}
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Actions
                    </Text>
                    <HStack justify="space-between" p={2} bg="gray.50" borderRadius="md">
                      <Text fontSize="sm" color="gray.700">
                        {getActionDescription(rule)}
                      </Text>
                      <Badge colorPalette="blue" size="sm">
                        {rule.actionType}
                      </Badge>
                    </HStack>
                  </Box>

                  {/* Stats */}
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Last Triggered
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {rule.lastTriggered ? new Date(rule.lastTriggered).toLocaleString() : 'Never'}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Cooldown
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {rule.cooldownMinutes} min
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Status
                    </Text>
                    <HStack gap={1}>
                      {getStatusIcon(rule.isActive)}
                      <Badge colorPalette={getStatusColor(rule.isActive)} size="sm">
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </HStack>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}

      {!isLoading && filteredRules.length === 0 && (
        <Card.Root>
          <Card.Body>
            <VStack gap={4} py={8}>
              <Zap size={48} color="gray.300" />
              <Text color="gray.500" fontSize="lg">
                No automation rules found
              </Text>
              <Text color="gray.400" fontSize="sm">
                Try adjusting your search or filters
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      )}

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
    </Box>
  );
};

export default AutomationPage; 