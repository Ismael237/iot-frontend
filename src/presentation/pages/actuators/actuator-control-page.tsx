import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  HStack,
  VStack,
  Icon,
  Flex,
  Slider,
  Menu,
  Portal,
  useDisclosure,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  NumberInput,
  Separator,
  Card,
} from '@chakra-ui/react';
import { Button, IconButton } from '@ui/button';
import {
  Lightbulb,
  Fan,
  Lock,
  Settings,
  Power,
  PowerOff,
  Pause,
  Clock,
  MapPin,
  Battery,
  Signal,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  MoreVertical,
  RefreshCw,
  Zap,
  Sun,
  Volume2,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useColorModeValue } from '@ui/chakra/color-mode';

interface Actuator {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'lock' | 'speaker' | 'thermostat' | 'blind';
  location: string;
  status: 'online' | 'offline' | 'error';
  powerState: 'on' | 'off' | 'standby';
  currentValue: number;
  targetValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
  batteryLevel: number;
  signalStrength: number;
  lastCommand: string;
  lastUpdated: string;
  capabilities: string[];
  schedule?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: string[];
  };
}

const mockActuators: Actuator[] = [
  {
    id: 'actuator-001',
    name: 'Living Room Light',
    type: 'light',
    location: 'Living Room',
    status: 'online',
    powerState: 'on',
    currentValue: 75,
    targetValue: 75,
    minValue: 0,
    maxValue: 100,
    unit: '%',
    batteryLevel: 85,
    signalStrength: 92,
    lastCommand: 'Set brightness to 75%',
    lastUpdated: '2 minutes ago',
    capabilities: ['Dimmer', 'Color Control', 'Scheduling', 'Voice Control'],
  },
  {
    id: 'actuator-002',
    name: 'Kitchen Fan',
    type: 'fan',
    location: 'Kitchen',
    status: 'online',
    powerState: 'on',
    currentValue: 60,
    targetValue: 60,
    minValue: 0,
    maxValue: 100,
    unit: '%',
    batteryLevel: 72,
    signalStrength: 88,
    lastCommand: 'Set speed to 60%',
    lastUpdated: '5 minutes ago',
    capabilities: ['Speed Control', 'Timer', 'Auto Mode'],
  },
  {
    id: 'actuator-003',
    name: 'Front Door Lock',
    type: 'lock',
    location: 'Front Door',
    status: 'online',
    powerState: 'on',
    currentValue: 1,
    targetValue: 1,
    minValue: 0,
    maxValue: 1,
    unit: 'locked',
    batteryLevel: 95,
    signalStrength: 78,
    lastCommand: 'Lock door',
    lastUpdated: '1 hour ago',
    capabilities: ['Keypad Access', 'App Control', 'Access Logs'],
  },
  {
    id: 'actuator-004',
    name: 'Bedroom Speaker',
    type: 'speaker',
    location: 'Bedroom',
    status: 'offline',
    powerState: 'off',
    currentValue: 0,
    targetValue: 0,
    minValue: 0,
    maxValue: 100,
    unit: '%',
    batteryLevel: 0,
    signalStrength: 0,
    lastCommand: 'Turn off',
    lastUpdated: '2 hours ago',
    capabilities: ['Volume Control', 'Bluetooth', 'Multi-room'],
  },
  {
    id: 'actuator-005',
    name: 'Office Thermostat',
    type: 'thermostat',
    location: 'Office',
    status: 'online',
    powerState: 'on',
    currentValue: 22,
    targetValue: 22,
    minValue: 16,
    maxValue: 30,
    unit: '°C',
    batteryLevel: 68,
    signalStrength: 85,
    lastCommand: 'Set temperature to 22°C',
    lastUpdated: '10 minutes ago',
    capabilities: ['Temperature Control', 'Scheduling', 'Energy Saving'],
  },
  {
    id: 'actuator-006',
    name: 'Living Room Blind',
    type: 'blind',
    location: 'Living Room',
    status: 'online',
    powerState: 'on',
    currentValue: 50,
    targetValue: 50,
    minValue: 0,
    maxValue: 100,
    unit: '%',
    batteryLevel: 45,
    signalStrength: 65,
    lastCommand: 'Set position to 50%',
    lastUpdated: '30 minutes ago',
    capabilities: ['Position Control', 'Auto Close', 'Sun Tracking'],
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'light':
      return Lightbulb;
    case 'fan':
      return Fan;
    case 'lock':
      return Lock;
    case 'speaker':
      return Volume2;
    case 'thermostat':
      return Settings;
    case 'blind':
      return Sun;
    default:
      return Zap;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';
    case 'error':
      return 'orange';
    default:
      return 'gray';
  }
};

const getPowerIcon = (powerState: string) => {
  switch (powerState) {
    case 'on':
      return Power;
    case 'off':
      return PowerOff;
    case 'standby':
      return Pause;
    default:
      return PowerOff;
  }
};

const getPowerColor = (powerState: string) => {
  switch (powerState) {
    case 'on':
      return 'green';
    case 'off':
      return 'red';
    case 'standby':
      return 'yellow';
    default:
      return 'gray';
  }
};

export const ActuatorControlPage: React.FC = () => {
  const navigate = useNavigate();
  const [actuators, setActuators] = useState<Actuator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActuator, setSelectedActuator] = useState<Actuator | null>(null);
  const [controlValue, setControlValue] = useState<number[]>([0]);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Simulate API call
    const loadActuators = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActuators(mockActuators);
      setIsLoading(false);
    };

    loadActuators();
  }, []);

  const handleControl = (actuatorId: string, command: string, value?: number) => {
    // Send control command
    console.log(`Sending command to ${actuatorId}: ${command}${value ? ` with value ${value}` : ''}`);
    
    // Update local state
    setActuators(prev => prev.map(actuator => {
      if (actuator.id === actuatorId) {
        return {
          ...actuator,
          powerState: command === 'turnOn' ? 'on' : command === 'turnOff' ? 'off' : actuator.powerState,
          currentValue: value !== undefined ? value : actuator.currentValue,
          targetValue: value !== undefined ? value : actuator.targetValue,
          lastCommand: command,
          lastUpdated: 'Just now',
        };
      }
      return actuator;
    }));
  };

  const handleOpenControl = (actuator: Actuator) => {
    setSelectedActuator(actuator);
    setControlValue([actuator.currentValue]);
    onOpen();
  };

  const handleSaveControl = () => {
    if (selectedActuator) {
      handleControl(selectedActuator.id, `Set ${selectedActuator.type} to ${controlValue[0]}${selectedActuator.unit}`, controlValue[0]);
      onClose();
    }
  };

  const stats = {
    total: actuators.length,
    online: actuators.filter(a => a.status === 'online').length,
    offline: actuators.filter(a => a.status === 'offline').length,
    error: actuators.filter(a => a.status === 'error').length,
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center" py={12}>
            <Icon as={RefreshCw} boxSize={12} color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">Loading actuators...</Text>
          </Box>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <Box>
            <HStack mb={2}>
              <IconButton
                aria-label="Go back"
                icon={<Icon as={Settings} />}
                variant="ghost"
                onClick={() => navigate('/actuators')}
              />
              <Heading size="lg">Actuator Control</Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Control and monitor your IoT actuators in real-time
            </Text>
          </Box>
          
          <Button
            leftIcon={<Icon as={RefreshCw} />}
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </HStack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <VStack gap={2}>
                <Icon as={Zap} color="blue.500" boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold">{stats.total}</Text>
                <Text fontSize="sm" color="gray.600">Total Actuators</Text>
              </VStack>
            </Card.Body>
          </Card.Root>
          
          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <VStack gap={2}>
                <Icon as={CheckCircle} color="green.500" boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold" color="green.500">{stats.online}</Text>
                <Text fontSize="sm" color="gray.600">Online</Text>
              </VStack>
            </Card.Body>
          </Card.Root>
          
          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <VStack gap={2}>
                <Icon as={WifiOff} color="red.500" boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold" color="red.500">{stats.offline}</Text>
                <Text fontSize="sm" color="gray.600">Offline</Text>
              </VStack>
            </Card.Body>
          </Card.Root>
          
          <Card.Root bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <Card.Body>
              <VStack gap={2}>
                <Icon as={AlertTriangle} color="orange.500" boxSize={6} />
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">{stats.error}</Text>
                <Text fontSize="sm" color="gray.600">Errors</Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Actuators Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {actuators.map((actuator) => (
            <Card.Root key={actuator.id} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <Card.Header pb={2}>
                <Flex justify="space-between" align="start">
                  <VStack align="start" gap={1}>
                    <HStack>
                      <Icon as={getTypeIcon(actuator.type)} color="blue.500" />
                      <Heading size="md">{actuator.name}</Heading>
                    </HStack>
                    <HStack gap={2}>
                      <Badge colorPalette={getStatusColor(actuator.status)} variant="subtle">
                        {actuator.status}
                      </Badge>
                      <Badge colorPalette={getPowerColor(actuator.powerState)} variant="outline">
                        {actuator.powerState}
                      </Badge>
                    </HStack>
                  </VStack>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <IconButton 
                        icon={<MoreVertical />} 
                        variant="ghost" 
                        size="sm"
                        aria-label="More options"
                      />
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item value="control" onClick={() => handleOpenControl(actuator)}>
                            <Eye />
                            <Box flex="1">Control</Box>
                          </Menu.Item>
                          <Menu.Item value="schedule">
                            <Clock />
                            <Box flex="1">Schedule</Box>
                          </Menu.Item>
                          <Menu.Item value="settings">
                            <Edit />
                            <Box flex="1">Settings</Box>
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Flex>
              </Card.Header>
              
              <Card.Body pt={0}>
                <VStack align="stretch" gap={4}>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">Current Value</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.500">
                      {actuator.currentValue} {actuator.unit}
                    </Text>
                  </HStack>
                  
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="gray.600">Control</Text>
                      <Text fontSize="sm" color="gray.500">
                        {actuator.minValue} - {actuator.maxValue} {actuator.unit}
                      </Text>
                    </HStack>
                    <Slider.Root
                      value={[actuator.currentValue]}
                      min={actuator.minValue}
                      max={actuator.maxValue}
                      step={actuator.type === 'light' || actuator.type === 'fan' ? 1 : 0.5}
                      onValueChange={(e) => handleControl(actuator.id, `Set ${actuator.type} to ${e.value[0] || 0}${actuator.unit}`, e.value[0] || 0)}
                      disabled={actuator.status !== 'online'}
                    >
                      <Slider.Control>
                        <Box bg="gray.200" h="2px" borderRadius="full" />
                      </Slider.Control>
                      <Slider.Thumb index={0} />
                    </Slider.Root>
                  </Box>
                  
                  <HStack justify="space-between">
                    <Button
                      size="sm"
                      leftIcon={<Icon as={getPowerIcon(actuator.powerState === 'on' ? 'off' : 'on')} />}
                      colorPalette={actuator.powerState === 'on' ? 'red' : 'green'}
                      variant="outline"
                      onClick={() => handleControl(actuator.id, actuator.powerState === 'on' ? 'turnOff' : 'turnOn')}
                      disabled={actuator.status !== 'online'}
                    >
                      {actuator.powerState === 'on' ? 'Turn Off' : 'Turn On'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenControl(actuator)}
                      disabled={actuator.status !== 'online'}
                    >
                      Advanced
                    </Button>
                  </HStack>
                  
                  <Separator />
                  
                  <VStack align="start" gap={2}>
                    <HStack justify="space-between" w="full">
                      <HStack>
                        <Icon as={Battery} color="green.500" boxSize={4} />
                        <Text fontSize="sm">Battery</Text>
                      </HStack>
                      <Text fontSize="sm">{actuator.batteryLevel}%</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <HStack>
                        <Icon as={Signal} color="blue.500" boxSize={4} />
                        <Text fontSize="sm">Signal</Text>
                      </HStack>
                      <Text fontSize="sm">{actuator.signalStrength}%</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <HStack>
                        <Icon as={MapPin} color="gray.500" boxSize={4} />
                        <Text fontSize="sm">Location</Text>
                      </HStack>
                      <Text fontSize="sm">{actuator.location}</Text>
                    </HStack>
                  </VStack>
                  
                  <Text fontSize="xs" color="gray.500">
                    Last command: {actuator.lastCommand}
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>

        {actuators.length === 0 && (
          <Box textAlign="center" py={12}>
            <Icon as={Zap} size="lg" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">
              No actuators found
            </Text>
          </Box>
        )}
      </VStack>

      {/* Control Dialog */}
      <Dialog.Root open={isOpen} onOpenChange={onClose} size="lg">
        <DialogContent>
          <DialogHeader>
            <HStack justify="space-between" w="full">
              <Text>{selectedActuator && `Control ${selectedActuator.name}`}</Text>
              <IconButton
                aria-label="Close"
                icon={<X />}
                variant="ghost"
                size="sm"
                onClick={onClose}
              />
            </HStack>
          </DialogHeader>
          <DialogBody pb={6}>
            {selectedActuator && (
              <VStack gap={6} align="stretch">
                <HStack justify="space-between">
                  <VStack align="start" gap={1}>
                    <HStack>
                      <Icon as={getTypeIcon(selectedActuator.type)} color="blue.500" />
                      <Heading size="md">{selectedActuator.name}</Heading>
                    </HStack>
                    <HStack gap={2}>
                      <Badge colorPalette={getStatusColor(selectedActuator.status)} variant="subtle">
                        {selectedActuator.status}
                      </Badge>
                      <Badge colorPalette={getPowerColor(selectedActuator.powerState)} variant="outline">
                        {selectedActuator.powerState}
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>

                <Separator />

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Value Control</Text>
                  <HStack gap={4}>
                    <NumberInput.Root
                      value={controlValue[0]?.toString() || '0'}
                      onValueChange={(e) => setControlValue([Number(e.value)])}
                      min={selectedActuator.minValue}
                      max={selectedActuator.maxValue}
                      step={selectedActuator.type === 'light' || selectedActuator.type === 'fan' ? 1 : 0.5}
                    >
                      <NumberInput.Input />
                    </NumberInput.Root>
                    <Text fontSize="lg" fontWeight="bold">
                      {selectedActuator.unit}
                    </Text>
                  </HStack>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2}>Range: {selectedActuator.minValue} - {selectedActuator.maxValue} {selectedActuator.unit}</Text>
                  <Slider.Root
                    value={controlValue}
                    min={selectedActuator.minValue}
                    max={selectedActuator.maxValue}
                    step={selectedActuator.type === 'light' || selectedActuator.type === 'fan' ? 1 : 0.5}
                    onValueChange={(e) => setControlValue(e.value)}
                  >
                    <Slider.Control>
                      <Slider.Track>
                        <Slider.Range />
                      </Slider.Track>
                    </Slider.Control>
                    <Slider.Thumbs />
                  </Slider.Root>
                </Box>

                <Separator />

                <HStack gap={4} justify="flex-end">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorPalette="blue" onClick={handleSaveControl}>
                    Apply
                  </Button>
                </HStack>
              </VStack>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog.Root>
    </Container>
  );
};

export default ActuatorControlPage; 