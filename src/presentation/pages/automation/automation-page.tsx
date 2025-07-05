import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { Card } from '@/presentation/components/ui/card';
import { Stat } from '@/presentation/components/ui/stat';
import { Button as CustomButton } from '@/presentation/components/ui/button';
import { toaster } from '@/presentation/components/ui/chakra/toaster';
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AutomationPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in a real app, this would come from API
  const automations = [
    {
      id: '1',
      name: 'High Temperature Alert',
      type: 'sensor_based',
      status: 'active',
      trigger: {
        type: 'threshold',
        sensor: 'Living Room Temperature',
        condition: '>',
        value: 25,
        unit: '°C',
      },
      actions: [
        {
          type: 'notification',
          target: 'user',
          message: 'Temperature is too high in living room',
        },
        {
          type: 'actuator',
          target: 'Kitchen Fan',
          action: 'turn_on',
        },
      ],
      lastTriggered: '2 hours ago',
      triggerCount: 3,
      isEnabled: true,
    },
    {
      id: '2',
      name: 'Morning Routine',
      type: 'schedule',
      status: 'active',
      trigger: {
        type: 'schedule',
        time: '07:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      },
      actions: [
        {
          type: 'actuator',
          target: 'Living Room Light',
          action: 'turn_on',
        },
        {
          type: 'actuator',
          target: 'Coffee Maker',
          action: 'turn_on',
        },
      ],
      lastTriggered: '1 day ago',
      triggerCount: 5,
      isEnabled: true,
    },
    {
      id: '3',
      name: 'Security Mode',
      type: 'motion_based',
      status: 'inactive',
      trigger: {
        type: 'motion',
        sensor: 'Front Door Motion',
        condition: 'detected',
      },
      actions: [
        {
          type: 'notification',
          target: 'user',
          message: 'Motion detected at front door',
        },
        {
          type: 'actuator',
          target: 'Security Camera',
          action: 'start_recording',
        },
      ],
      lastTriggered: '3 days ago',
      triggerCount: 12,
      isEnabled: false,
    },
    {
      id: '4',
      name: 'Energy Saving',
      type: 'time_based',
      status: 'active',
      trigger: {
        type: 'schedule',
        time: '23:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      actions: [
        {
          type: 'actuator',
          target: 'All Lights',
          action: 'turn_off',
        },
        {
          type: 'actuator',
          target: 'Kitchen Fan',
          action: 'turn_off',
        },
      ],
      lastTriggered: '12 hours ago',
      triggerCount: 7,
      isEnabled: true,
    },
  ];

  const stats = {
    total: automations.length,
    active: automations.filter(a => a.isEnabled).length,
    inactive: automations.filter(a => !a.isEnabled).length,
    triggered: automations.reduce((sum, a) => sum + a.triggerCount, 0),
  };

  const getAutomationIcon = (type: string) => {
    switch (type) {
      case 'sensor_based':
        return <Activity size={20} />;
      case 'schedule':
        return <Clock size={20} />;
      case 'motion_based':
        return <AlertTriangle size={20} />;
      case 'time_based':
        return <Timer size={20} />;
      default:
        return <Zap size={20} />;
    }
  };

  const getAutomationColor = (type: string) => {
    switch (type) {
      case 'sensor_based':
        return 'blue';
      case 'schedule':
        return 'green';
      case 'motion_based':
        return 'orange';
      case 'time_based':
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

  const handleToggle = (automationId: string, currentStatus: boolean) => {
    // Mock toggle - in real app, this would call API
    toaster.create({
      title: 'Automation Updated',
      description: `Successfully ${currentStatus ? 'disabled' : 'enabled'} automation`,
      type: 'success',
      duration: 3000,
      closable: true,
    });
  };

  const getTriggerDescription = (trigger: any) => {
    switch (trigger.type) {
      case 'threshold':
        return `${trigger.sensor} ${trigger.condition} ${trigger.value}${trigger.unit}`;
      case 'schedule':
        return `Daily at ${trigger.time}`;
      case 'motion':
        return `Motion detected on ${trigger.sensor}`;
      default:
        return 'Custom trigger';
    }
  };

  const filteredAutomations = automations.filter(automation => {
    const matchesSearch = automation.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || automation.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || automation.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
          <CustomButton
            leftIcon={<Plus size={16} />}
            colorScheme="blue"
            onClick={() => navigate('/automation/new')}
          >
            Create Rule
          </CustomButton>
        </HStack>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={4} gap={6} mb={8}>
        <Card>
          <Card.Body>
            <Stat.Root>
              <Stat.Label color="gray.600">Total Rules</Stat.Label>
              <Stat.ValueText fontSize="2xl" color="gray.800">
                {stats.total}
              </Stat.ValueText>
              <Stat.HelpText>
                <Stat.UpIndicator />
                15.2%
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stat.Root>
              <Stat.Label color="gray.600">Active</Stat.Label>
              <Stat.ValueText fontSize="2xl" color="green.600">
                {stats.active}
              </Stat.ValueText>
              <Stat.HelpText>
                <Stat.UpIndicator />
                8.7%
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stat.Root>
              <Stat.Label color="gray.600">Inactive</Stat.Label>
              <Stat.ValueText fontSize="2xl" color="red.600">
                {stats.inactive}
              </Stat.ValueText>
              <Stat.HelpText>
                <Stat.DownIndicator />
                3.4%
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stat.Root>
              <Stat.Label color="gray.600">Total Triggers</Stat.Label>
              <Stat.ValueText fontSize="2xl" color="blue.600">
                {stats.triggered}
              </Stat.ValueText>
              <Stat.HelpText>
                <Stat.UpIndicator />
                22.1%
              </Stat.HelpText>
            </Stat.Root>
          </Card.Body>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Card mb={6}>
        <Card.Body>
          <HStack gap={4}>
            <InputGroup maxW="400px" startElement={<Search size={16} color="gray.400" />}>
              <Input
                placeholder="Search automations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.currentTarget.value)}
              />
            </InputGroup>
            <NativeSelect.Root size="sm" width="200px">
              <NativeSelect.Field
                value={typeFilter}
                onChange={e => setTypeFilter(e.currentTarget.value)}
              >
                <option value="all">All Types</option>
                <option value="sensor_based">Sensor Based</option>
                <option value="schedule">Schedule</option>
                <option value="motion_based">Motion Based</option>
                <option value="time_based">Time Based</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <NativeSelect.Root size="sm" width="200px">
              <NativeSelect.Field
                value={statusFilter}
                onChange={e => setStatusFilter(e.currentTarget.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              {filteredAutomations.length} of {automations.length} rules
            </Text>
          </HStack>
        </Card.Body>
      </Card>

      {/* Automations Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {filteredAutomations.map((automation) => (
          <Card key={automation.id}>
            <Card.Header pb={2}>
              <HStack justify="space-between">
                <HStack gap={3}>
                  <Box
                    p={2}
                    bg={`${getAutomationColor(automation.type)}.100`}
                    color={`${getAutomationColor(automation.type)}.600`}
                    borderRadius="lg"
                  >
                    {getAutomationIcon(automation.type)}
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {automation.name}
                    </Text>
                    <Badge colorPalette={getAutomationColor(automation.type)} size="sm">
                      {automation.type.replace('_', ' ')}
                    </Badge>
                  </VStack>
                </HStack>
                <HStack gap={2}>
                  <Switch.Root checked={automation.isEnabled} onCheckedChange={({ checked }) => handleToggle(automation.id, checked)}>
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
                          <Menu.Item value="edit" onClick={() => navigate(`/automation/${automation.id}/edit`)}>
                            Edit Rule
                          </Menu.Item>
                          <Menu.Item value="history" onClick={() => navigate(`/automation/${automation.id}/history`)}>
                            View History
                          </Menu.Item>
                          <Menu.Item value="delete" color="fg.error" onClick={() => {
                            // Mock delete - in real app, this would call API
                            toaster.create({
                              title: 'Automation Deleted',
                              description: 'Automation rule deleted successfully',
                              type: 'success',
                              duration: 3000,
                              closable: true,
                            });
                          }}>
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
                {/* Trigger */}
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Trigger
                  </Text>
                  <Text fontSize="sm" color="gray.800">
                    {getTriggerDescription(automation.trigger)}
                  </Text>
                </Box>

                {/* Actions */}
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Actions ({automation.actions.length})
                  </Text>
                  <VStack align="stretch" gap={2}>
                    {automation.actions.map((action, index) => (
                      <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                        <Text fontSize="sm" color="gray.700">
                          {action.type === 'notification' ? 'Send notification' : `${action.action} ${action.target}`}
                        </Text>
                        <Badge colorPalette={action.type === 'notification' ? 'blue' : 'green'} size="sm">
                          {action.type}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Stats */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Last Triggered
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {automation.lastTriggered}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Trigger Count
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {automation.triggerCount}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Status
                  </Text>
                  <HStack gap={1}>
                    {getStatusIcon(automation.status)}
                    <Badge colorPalette={getStatusColor(automation.status)} size="sm">
                      {automation.status}
                    </Badge>
                  </HStack>
                </HStack>
              </VStack>
            </Card.Body>
          </Card>
        ))}
      </SimpleGrid>

      {filteredAutomations.length === 0 && (
        <Card>
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
        </Card>
      )}
    </Box>
  );
};

export default AutomationPage; 