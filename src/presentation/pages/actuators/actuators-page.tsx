import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Switch,
  Progress,
  Flex,
  Spacer,
  Select,
  InputGroup,
  Input,
  useToast,
} from '@chakra-ui/react';
import {
  Zap,
  Search,
  MoreVertical,
  Lightbulb,
  Fan,
  Lock,
  Unlock,
  Power,
  PowerOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@ui/card';

export const ActuatorsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in a real app, this would come from API
  const actuators = [
    {
      id: '1',
      name: 'Living Room Light',
      type: 'light',
      status: 'on',
      location: 'Living Room',
      device: 'Smart Light Controller',
      lastAction: '2 minutes ago',
      powerConsumption: 45,
      maxPower: 100,
      isControllable: true,
    },
    {
      id: '2',
      name: 'Kitchen Fan',
      type: 'fan',
      status: 'off',
      location: 'Kitchen',
      device: 'Smart Fan Controller',
      lastAction: '5 minutes ago',
      powerConsumption: 0,
      maxPower: 75,
      isControllable: true,
    },
    {
      id: '3',
      name: 'Front Door Lock',
      type: 'lock',
      status: 'locked',
      location: 'Front Door',
      device: 'Smart Lock Hub',
      lastAction: '1 hour ago',
      powerConsumption: 2,
      maxPower: 5,
      isControllable: true,
    },
    {
      id: '4',
      name: 'Garage Door',
      type: 'door',
      status: 'closed',
      location: 'Garage',
      device: 'Garage Door Controller',
      lastAction: '30 minutes ago',
      powerConsumption: 0,
      maxPower: 500,
      isControllable: false,
    },
  ];

  const stats = {
    total: actuators.length,
    active: actuators.filter(a => a.status === 'on' || a.status === 'unlocked' || a.status === 'open').length,
    inactive: actuators.filter(a => a.status === 'off' || a.status === 'locked' || a.status === 'closed').length,
    controllable: actuators.filter(a => a.isControllable).length,
  };

  const getActuatorIcon = (type: string) => {
    switch (type) {
      case 'light':
        return <Lightbulb size={20} />;
      case 'fan':
        return <Fan size={20} />;
      case 'lock':
        return <Lock size={20} />;
      case 'door':
        return <Power size={20} />;
      default:
        return <Zap size={20} />;
    }
  };

  const getActuatorColor = (type: string) => {
    switch (type) {
      case 'light':
        return 'yellow';
      case 'fan':
        return 'blue';
      case 'lock':
        return 'purple';
      case 'door':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on':
      case 'unlocked':
      case 'open':
        return <CheckCircle size={16} color="green" />;
      case 'off':
      case 'locked':
      case 'closed':
        return <XCircle size={16} color="red" />;
      default:
        return <AlertTriangle size={16} color="orange" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on':
      case 'unlocked':
      case 'open':
        return 'green';
      case 'off':
      case 'locked':
      case 'closed':
        return 'red';
      default:
        return 'orange';
    }
  };

  const handleToggle = (actuatorId: string, currentStatus: string) => {
    // Mock toggle - in real app, this would call API
    toast({
      title: 'Actuator Updated',
      description: `Successfully toggled actuator ${actuatorId}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredActuators = actuators.filter(actuator => {
    const matchesSearch = actuator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actuator.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || actuator.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || actuator.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
              Control and monitor your IoT actuators
            </Text>
          </VStack>
          <Button
            leftIcon={<Zap size={16} />}
            colorPalette="blue"
            onClick={() => navigate('/actuators/automation')}
          >
            Automation Rules
          </Button>
        </HStack>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={4} gap={6} mb={8}>
        <Card>
          <Card.Body>
            <Stat>
              <StatLabel color="gray.600">Total Actuators</StatLabel>
              <StatNumber fontSize="2xl" color="gray.800">
                {stats.total}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                6.8%
              </StatHelpText>
            </Stat>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stat>
              <StatLabel color="gray.600">Active</StatLabel>
              <StatNumber fontSize="2xl" color="green.600">
                {stats.active}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                4.2%
              </StatHelpText>
            </Stat>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stat>
              <StatLabel color="gray.600">Inactive</StatLabel>
              <StatNumber fontSize="2xl" color="red.600">
                {stats.inactive}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                2.1%
              </StatHelpText>
            </Stat>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Stat>
              <StatLabel color="gray.600">Controllable</StatLabel>
              <StatNumber fontSize="2xl" color="blue.600">
                {stats.controllable}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8.5%
              </StatHelpText>
            </Stat>
          </Card.Body>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Card mb={6}>
        <Card.Body>
          <HStack gap={4}>
            <InputGroup maxW="400px">
              <Input
                placeholder="Search actuators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                pl={10}
              />
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
                <Search size={16} color="gray.400" />
              </Box>
            </InputGroup>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              maxW="200px"
            >
              <option value="all">All Types</option>
              <option value="light">Light</option>
              <option value="fan">Fan</option>
              <option value="lock">Lock</option>
              <option value="door">Door</option>
            </Select>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="200px"
            >
              <option value="all">All Status</option>
              <option value="on">On</option>
              <option value="off">Off</option>
              <option value="locked">Locked</option>
              <option value="unlocked">Unlocked</option>
            </Select>
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              {filteredActuators.length} of {actuators.length} actuators
            </Text>
          </HStack>
        </Card.Body>
      </Card>

      {/* Actuators Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {filteredActuators.map((actuator) => (
          <Card key={actuator.id}>
            <Card.Header pb={2}>
              <HStack justify="space-between">
                <HStack gap={3}>
                  <Box
                    p={2}
                    bg={`${getActuatorColor(actuator.type)}.100`}
                    color={`${getActuatorColor(actuator.type)}.600`}
                    borderRadius="lg"
                  >
                    {getActuatorIcon(actuator.type)}
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {actuator.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {actuator.location}
                    </Text>
                  </VStack>
                </HStack>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MoreVertical size={16} />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem onClick={() => navigate(`/actuators/${actuator.id}`)}>
                      View Details
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/actuators/${actuator.id}/schedule`)}>
                      Set Schedule
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/actuators/${actuator.id}/history`)}>
                      View History
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Card.Header>
            <Card.Body pt={0}>
              <VStack align="stretch" gap={4}>
                {/* Status and Control */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Status
                  </Text>
                  <HStack gap={2}>
                    {getStatusIcon(actuator.status)}
                    <Badge colorPalette={getStatusColor(actuator.status)} size="sm">
                      {actuator.status}
                    </Badge>
                  </HStack>
                </HStack>

                {/* Power Consumption */}
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.600">
                      Power Consumption
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {actuator.powerConsumption}W
                    </Text>
                  </HStack>
                  <Progress
                    value={(actuator.powerConsumption / actuator.maxPower) * 100}
                    colorPalette="blue"
                    size="sm"
                  />
                </Box>

                {/* Device and Last Action */}
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Device
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {actuator.device}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Last Action
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {actuator.lastAction}
                  </Text>
                </HStack>

                {/* Control Switch */}
                {actuator.isControllable && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Control
                    </Text>
                    <Switch
                      isChecked={actuator.status === 'on' || actuator.status === 'unlocked' || actuator.status === 'open'}
                      onChange={() => handleToggle(actuator.id, actuator.status)}
                      colorPalette="blue"
                    />
                  </HStack>
                )}
              </VStack>
            </Card.Body>
          </Card>
        ))}
      </SimpleGrid>

      {filteredActuators.length === 0 && (
        <Card>
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
        </Card>
      )}
    </Box>
  );
};

export default ActuatorsPage; 