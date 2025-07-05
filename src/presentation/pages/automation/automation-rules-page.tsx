import React, { useState } from 'react';
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
  chakra,
  NativeSelect,
  Switch,
  Menu,
  Portal,
  Badge,
  InputGroup,
  Card,
} from '@chakra-ui/react';
import { Button } from '@/presentation/components/ui/button';
import { IconButton } from '@/presentation/components/ui/button';
import { Modal } from '@/presentation/components/ui/modal';
import { Input } from '@/presentation/components/ui/input';
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
  CheckCircle,
  Settings,
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'sensor' | 'time' | 'manual' | 'condition';
    sensor?: string;
    condition?: string;
    time?: string;
  };
  conditions: string[];
  actions: string[];
  status: 'active' | 'inactive' | 'error';
  priority: 'high' | 'medium' | 'low';
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
  createdAt: string;
  tags: string[];
}

const mockRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Temperature Control',
    description: 'Automatically adjust HVAC based on temperature readings',
    trigger: {
      type: 'sensor',
      sensor: 'Living Room Temperature Sensor',
      condition: 'Temperature > 25°C',
    },
    conditions: ['Time between 6:00 AM and 10:00 PM', 'Home occupied'],
    actions: ['Turn on AC', 'Set temperature to 22°C', 'Send notification'],
    status: 'active',
    priority: 'high',
    lastExecuted: '2 minutes ago',
    executionCount: 45,
    successRate: 98.5,
    createdAt: '2024-01-10',
    tags: ['climate', 'energy-saving'],
  },
  {
    id: '2',
    name: 'Security Mode',
    description: 'Activate security system when no one is home',
    trigger: {
      type: 'condition',
      condition: 'All occupants left home',
    },
    conditions: ['Time after 8:00 PM', 'Motion detected'],
    actions: ['Lock all doors', 'Turn on security cameras', 'Activate alarm system'],
    status: 'active',
    priority: 'high',
    lastExecuted: '1 hour ago',
    executionCount: 12,
    successRate: 100,
    createdAt: '2024-01-08',
    tags: ['security', 'automation'],
  },
  {
    id: '3',
    name: 'Morning Routine',
    description: 'Gradual wake-up sequence with lights and music',
    trigger: {
      type: 'time',
      time: '6:30 AM',
    },
    conditions: ['Weekdays only', 'Home occupied'],
    actions: ['Gradual light increase', 'Play morning playlist', 'Start coffee maker'],
    status: 'active',
    priority: 'medium',
    lastExecuted: 'Today at 6:30 AM',
    executionCount: 28,
    successRate: 95.2,
    createdAt: '2024-01-05',
    tags: ['routine', 'comfort'],
  },
  {
    id: '4',
    name: 'Energy Saving',
    description: 'Turn off unused devices during sleep hours',
    trigger: {
      type: 'time',
      time: '11:00 PM',
    },
    conditions: ['No motion detected for 30 minutes', 'Lights off'],
    actions: ['Turn off entertainment devices', 'Dim hallway lights', 'Set thermostat to sleep mode'],
    status: 'active',
    priority: 'medium',
    lastExecuted: 'Yesterday at 11:00 PM',
    executionCount: 35,
    successRate: 97.1,
    createdAt: '2024-01-03',
    tags: ['energy', 'sleep'],
  },
  {
    id: '5',
    name: 'Weather Response',
    description: 'Adjust home settings based on weather conditions',
    trigger: {
      type: 'condition',
      condition: 'Rain detected',
    },
    conditions: ['Windows open', 'Outdoor temperature < 15°C'],
    actions: ['Close windows', 'Turn on dehumidifier', 'Adjust lighting'],
    status: 'error',
    priority: 'low',
    lastExecuted: '3 hours ago',
    executionCount: 8,
    successRate: 75.0,
    createdAt: '2024-01-12',
    tags: ['weather', 'maintenance'],
  },
  {
    id: '6',
    name: 'Guest Mode',
    description: 'Special settings for when guests are present',
    trigger: {
      type: 'manual',
    },
    conditions: ['Guest mode activated', 'Time between 6:00 PM and 12:00 AM'],
    actions: ['Adjust lighting for ambiance', 'Play background music', 'Set comfortable temperature'],
    status: 'inactive',
    priority: 'low',
    executionCount: 5,
    successRate: 100,
    createdAt: '2024-01-15',
    tags: ['guest', 'entertainment'],
  },
];

const getTriggerIcon = (type: string) => {
  switch (type) {
    case 'sensor':
      return Thermometer;
    case 'time':
      return Clock;
    case 'manual':
      return Settings;
    case 'condition':
      return AlertTriangle;
    default:
      return Zap;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'gray';
    case 'error':
      return 'red';
    default:
      return 'gray';
  }
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

export const AutomationRulesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  const cardBg = 'white';
  const borderColor = 'gray.200';

  const filteredRules = mockRules.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || rule.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: mockRules.length,
    active: mockRules.filter(r => r.status === 'active').length,
    inactive: mockRules.filter(r => r.status === 'inactive').length,
    error: mockRules.filter(r => r.status === 'error').length,
  };

  const handleViewDetails = (rule: AutomationRule) => {
    setSelectedRule(rule);
    setIsOpen(true);
  };

  const handleToggleStatus = (ruleId: string) => {
    // Toggle rule status logic would go here
    console.log('Toggle status for rule:', ruleId);
  };

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
          <Card.Root p={2} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <VStack gap={2} p={4}>
                <Icon as={Zap} color="blue.500" />
                <Text fontSize="2xl" fontWeight="bold">{stats.total}</Text>
                <Text fontSize="sm" color="gray.600">Total Rules</Text>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root p={2} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <VStack gap={2} p={4}>
              <Icon as={Play} color="green.500" />
              <Text fontSize="2xl" fontWeight="bold" color="green.500">{stats.active}</Text>
              <Text fontSize="sm" color="gray.600">Active</Text>
            </VStack>
          </Card.Root>

          <Card.Root p={2} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <VStack gap={2} p={4}>
              <Icon as={Pause} color="gray.500" />
              <Text fontSize="2xl" fontWeight="bold" color="gray.500">{stats.inactive}</Text>
              <Text fontSize="sm" color="gray.600">Inactive</Text>
            </VStack>
          </Card.Root>

          <Card.Root p={2} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <VStack gap={2} p={4}>
              <Icon as={AlertTriangle} color="red.500" />
              <Text fontSize="2xl" fontWeight="bold" color="red.500">{stats.error}</Text>
              <Text fontSize="sm" color="gray.600">Errors</Text>
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
            <NativeSelect.Root size="sm" width="200px">
              <NativeSelect.Field value={statusFilter} onChange={e => setStatusFilter(e.currentTarget.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
            <NativeSelect.Root size="sm" width="200px">
              <NativeSelect.Field value={priorityFilter} onChange={e => setPriorityFilter(e.currentTarget.value)}>
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </HStack>
          <Button leftIcon={<Plus size={16} />} colorPalette="blue">
            Create Rule
          </Button>
        </HStack>

        {/* Rules Grid */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          {filteredRules.map((rule) => (
            <Card.Root key={rule.id} p={6} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <Box pb={2}>
                <Flex justify="space-between" align="start">
                  <VStack align="start" gap={2}>
                    <HStack>
                      <Icon as={getTriggerIcon(rule.trigger.type)} color="blue.500" />
                      <Heading size="md">{rule.name}</Heading>
                    </HStack>
                    <HStack gap={2}>
                      <Badge colorPalette={getStatusColor(rule.status)} variant="subtle">
                        {rule.status}
                      </Badge>
                      <Badge colorPalette={getPriorityColor(rule.priority)} variant="outline">
                        {rule.priority}
                      </Badge>
                    </HStack>
                  </VStack>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <IconButton aria-label="More actions" variant="ghost" size="sm" icon={<MoreVertical size={16} />} />
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item value="view" onClick={() => handleViewDetails(rule)}>
                            <Eye size={16} style={{ marginRight: 8 }} /> View Details
                          </Menu.Item>
                          <Menu.Item value="edit">
                            <Edit size={16} style={{ marginRight: 8 }} /> Edit Rule
                          </Menu.Item>
                          <Menu.Item value="test">
                            <Play size={16} style={{ marginRight: 8 }} /> Test Rule
                          </Menu.Item>
                          <Menu.Item value="delete" color="fg.error">
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
                  <Text fontSize="sm" color="gray.600">
                    {rule.description}
                  </Text>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                      Trigger:
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {rule.trigger.type === 'sensor' && `${rule.trigger.sensor} - ${rule.trigger.condition}`}
                      {rule.trigger.type === 'time' && `Daily at ${rule.trigger.time}`}
                      {rule.trigger.type === 'condition' && rule.trigger.condition}
                      {rule.trigger.type === 'manual' && 'Manual activation'}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                      Actions ({rule.actions.length}):
                    </Text>
                    <VStack align="start" gap={2}>
                      {rule.actions.slice(0, 2).map((action, index) => (
                        <Text key={index} fontSize="sm" color="gray.600">
                          • {action}
                        </Text>
                      ))}
                      {rule.actions.length > 2 && (
                        <Text fontSize="sm" color="gray.500">
                          +{rule.actions.length - 2} more actions
                        </Text>
                      )}
                    </VStack>
                  </Box>
                  <Box as="hr" my={4} borderColor="gray.200" />
                  <HStack justify="space-between" fontSize="sm" color="gray.500" gap={2}>
                    <VStack align="start" gap={0}>
                      <Text>Executed {rule.executionCount} times</Text>
                      <Text>{rule.successRate}% success rate</Text>
                    </VStack>
                    <VStack align="end" gap={2}>
                      <Text>Last: {rule.lastExecuted || 'Never'}</Text>
                      <Switch.Root checked={rule.status === 'active'} onCheckedChange={() => handleToggleStatus(rule.id)} size="sm">
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </VStack>
                  </HStack>
                  <Flex wrap="wrap" gap={2}>
                    {rule.tags.map((tag, index) => (
                      <Badge key={index} size="sm" variant="outline" colorPalette="gray">
                        {tag}
                      </Badge>
                    ))}
                  </Flex>
                </VStack>
              </Box>
            </Card.Root>
          ))}
        </SimpleGrid>
        {filteredRules.length === 0 && (
          <Box textAlign="center" py={12}>
            <Icon as={Zap} size="lg" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">
              No automation rules found matching your criteria
            </Text>
          </Box>
        )}
      </VStack>
      {/* Rule Details Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Rule Details">
        {selectedRule && (
          <VStack gap={6} align="stretch">
            <HStack justify="space-between">
              <VStack align="start" gap={1}>
                <HStack>
                  <Icon as={getTriggerIcon(selectedRule.trigger.type)} color="blue.500" />
                  <Heading size="md">{selectedRule.name}</Heading>
                </HStack>
                <HStack gap={2}>
                  <Badge colorPalette={getStatusColor(selectedRule.status)} variant="subtle">
                    {selectedRule.status}
                  </Badge>
                  <Badge colorPalette={getPriorityColor(selectedRule.priority)} variant="outline">
                    {selectedRule.priority} priority
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
            <Text color="gray.600">{selectedRule.description}</Text>
            <Box as="hr" my={4} borderColor="gray.200" />
            <Box>
              <Text fontWeight="medium" mb={2}>Trigger</Text>
              <Card.Root variant="outline" p={3}>
                <VStack align="start" gap={1}>
                  <HStack>
                    <Icon as={getTriggerIcon(selectedRule.trigger.type)} color="blue.500" />
                    <Text fontWeight="medium" textTransform="capitalize">
                      {selectedRule.trigger.type} Trigger
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    {selectedRule.trigger.type === 'sensor' && `${selectedRule.trigger.sensor} - ${selectedRule.trigger.condition}`}
                    {selectedRule.trigger.type === 'time' && `Daily at ${selectedRule.trigger.time}`}
                    {selectedRule.trigger.type === 'condition' && selectedRule.trigger.condition}
                    {selectedRule.trigger.type === 'manual' && 'Manual activation'}
                  </Text>
                </VStack>
              </Card.Root>
            </Box>
            <Box>
              <Text fontWeight="medium" mb={2}>Conditions ({selectedRule.conditions.length})</Text>
              <VStack align="start" gap={2}>
                {selectedRule.conditions.map((condition, index) => (
                  <HStack key={index} p={2} bg="gray.50" borderRadius="md" w="full">
                    <Icon as={CheckCircle} color="green.500" boxSize="16px" />
                    <Text fontSize="sm">{condition}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
            <Box>
              <Text fontWeight="medium" mb={2}>Actions ({selectedRule.actions.length})</Text>
              <VStack align="start" gap={2}>
                {selectedRule.actions.map((action, index) => (
                  <HStack key={index} p={2} bg="blue.50" borderRadius="md" w="full">
                    <Icon as={Zap} color="blue.500" boxSize="16px" />
                    <Text fontSize="sm">{action}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
            <Box as="hr" my={4} borderColor="gray.200" />
            <SimpleGrid columns={2} gap={4}>
              <Box>
                <Text fontWeight="medium" mb={1}>Execution Count</Text>
                <Text fontSize="lg" fontWeight="bold">{selectedRule.executionCount}</Text>
              </Box>
              <Box>
                <Text fontWeight="medium" mb={1}>Success Rate</Text>
                <Text fontSize="lg" fontWeight="bold" color="green.500">{selectedRule.successRate}%</Text>
              </Box>
              <Box>
                <Text fontWeight="medium" mb={1}>Last Executed</Text>
                <Text fontSize="sm" color="gray.600">{selectedRule.lastExecuted || 'Never'}</Text>
              </Box>
              <Box>
                <Text fontWeight="medium" mb={1}>Created</Text>
                <Text fontSize="sm" color="gray.600">{selectedRule.createdAt}</Text>
              </Box>
            </SimpleGrid>
            <Box>
              <Text fontWeight="medium" mb={2}>Tags</Text>
              <Flex wrap="wrap" gap={2}>
                {selectedRule.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" colorPalette="blue">
                    {tag}
                  </Badge>
                ))}
              </Flex>
            </Box>
          </VStack>
        )}
      </Modal>
    </Container>
  );
};

export default AutomationRulesPage; 