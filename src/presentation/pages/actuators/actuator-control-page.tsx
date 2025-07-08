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
  Card,
  Button,
  Slider,
  NumberInput,
  Separator,
  Flex,
  AlertRoot,
  AlertTitle,
  AlertDescription,
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
  Zap,
  Activity,
  MapPin,
  Battery,
  Signal,
  ArrowLeft,
  Play,
  Pause,
  Eye,
  Settings,
  Power,
  PowerOff,
  Sun,
  Volume2,
  X,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Fan,
  Lock,
  Gauge,
  Info,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Field } from '@/presentation/components/ui/chakra/field';
import { useColorModeValue } from '@presentation/components/ui/chakra/color-mode';
import { useActuatorStore } from '../../../domain/store/actuator-store';
import { ActuatorType, ActuatorState, CommandStatus, ConnStatus, type ActuatorDeployment } from '../../../domain/entities/actuator.entity';
import { actuatorApi, componentApi } from '@infrastructure/api';
import { getErrorMessage } from '@infrastructure/api/axios-client';
import type { AxiosError } from 'axios';

// Composant pour l'icône de l'actionneur
const ActuatorIcon: React.FC<{ type: ActuatorType; size?: number }> = ({ type, size = 20 }) => {
  const getIcon = () => {
    switch (type) {
      case ActuatorType.LIGHT:
        return <Lightbulb size={size} />;
      case ActuatorType.DC_MOTOR:
      case ActuatorType.AC_MOTOR:
        return <Fan size={size} />;
      case ActuatorType.RELAY:
        return <Power size={size} />;
      case ActuatorType.SERVO:
      case ActuatorType.STEPPER:
        return <Target size={size} />;
      case ActuatorType.HEATER:
        return <Settings size={size} />;
      case ActuatorType.COOLER:
        return <Fan size={size} />;
      case ActuatorType.VALVE:
      case ActuatorType.PUMP:
        return <Activity size={size} />;
      case ActuatorType.DISPLAY:
        return <Gauge size={size} />;
      case ActuatorType.BUZZER:
        return <Volume2 size={size} />;
      default:
        return <Zap size={size} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case ActuatorType.LIGHT:
        return 'yellow';
      case ActuatorType.DC_MOTOR:
      case ActuatorType.AC_MOTOR:
        return 'blue';
      case ActuatorType.RELAY:
        return 'purple';
      case ActuatorType.SERVO:
      case ActuatorType.STEPPER:
        return 'green';
      case ActuatorType.HEATER:
        return 'red';
      case ActuatorType.COOLER:
        return 'cyan';
      case ActuatorType.VALVE:
      case ActuatorType.PUMP:
        return 'orange';
      case ActuatorType.DISPLAY:
        return 'teal';
      case ActuatorType.BUZZER:
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

// Composant pour l'indicateur de statut
const StatusIndicator: React.FC<{ status: ConnStatus }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case ConnStatus.ONLINE:
        return 'green';
      case ConnStatus.OFFLINE:
        return 'red';
      case ConnStatus.CONNECTING:
        return 'yellow';
      case ConnStatus.ERROR:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case ConnStatus.ONLINE:
        return <Wifi size={16} />;
      case ConnStatus.OFFLINE:
        return <WifiOff size={16} />;
      case ConnStatus.CONNECTING:
        return <Activity size={16} />;
      case ConnStatus.ERROR:
        return <AlertTriangle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  return (
    <HStack gap={1}>
      {getStatusIcon()}
      <Badge colorPalette={getStatusColor()} size="sm" variant="subtle">
        {status}
      </Badge>
    </HStack>
  );
};

// Composant pour l'indicateur d'état
const StateIndicator: React.FC<{ state: ActuatorState }> = ({ state }) => {
  const getStateColor = () => {
    switch (state) {
      case ActuatorState.ON:
      case ActuatorState.OPEN:
      case ActuatorState.RUNNING:
      case ActuatorState.HEATING:
      case ActuatorState.COOLING:
        return 'green';
      case ActuatorState.OFF:
      case ActuatorState.CLOSED:
      case ActuatorState.STOPPED:
        return 'red';
      case ActuatorState.POSITION_0:
      case ActuatorState.POSITION_25:
      case ActuatorState.POSITION_50:
      case ActuatorState.POSITION_75:
      case ActuatorState.POSITION_100:
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStateIcon = () => {
    switch (state) {
      case ActuatorState.ON:
      case ActuatorState.OPEN:
      case ActuatorState.RUNNING:
        return <Play size={16} />;
      case ActuatorState.OFF:
      case ActuatorState.CLOSED:
      case ActuatorState.STOPPED:
        return <Pause size={16} />;
      case ActuatorState.HEATING:
      case ActuatorState.COOLING:
        return <Activity size={16} />;
      default:
        return <Target size={16} />;
    }
  };

  return (
    <HStack gap={1}>
      {getStateIcon()}
      <Badge colorPalette={getStateColor()} size="sm" variant="subtle">
        {state}
      </Badge>
    </HStack>
  );
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return CheckCircle;
    case 'offline':
      return WifiOff;
    case 'error':
      return AlertTriangle;
    case 'connecting':
      return Activity;
    default:
      return Info;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';
    case 'connecting':
      return 'yellow';
    case 'error':
      return 'red';
    default:
      return 'gray';
  }
};

export const ActuatorControlPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [controlValue, setControlValue] = useState(50);
  const [command, setCommand] = useState('');
  const [parameters, setParameters] = useState('');
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);
  const [selectedActuator, setSelectedActuator] = useState<any>(null);

  const {
    commands,
    isLoading: commandsLoading,
    error: commandsError,
    fetchCommands,
    clearError
  } = useActuatorStore();

  const [deployment, setDeployment] = useState<ActuatorDeployment | null>(null);

  const [deploymentError, setDeploymentError] = useState<string | null>(null);

  const [deploymentLoading, setDeploymentLoading] = useState<boolean>(false);

  const [state, setState] = useState<string | null>(null);

  const isLoading = commandsLoading || deploymentLoading;

  const error = commandsError || deploymentError;

  const fetchDeploymentDetails = async (deploymentId: number) => {
    try {
      setDeploymentLoading(true);
      const response = await componentApi.getDeploymentDetails(deploymentId);
      setDeployment(response);
      setDeploymentLoading(false);
      setState(getCurrentStateName(response, true));
    } catch (error) {
      setDeploymentError(getErrorMessage(error as AxiosError));
      console.error('Failed to fetch deployment details:', error);
    } finally {
      setDeploymentLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDeploymentDetails(Number(id));
      fetchCommands({ deploymentId: Number(id) });
    }
  }, [id, fetchCommands]);


  const fetchActuatorCommands = async (deploymentId: number, params = {}) => {
    try {
      await fetchCommands({ deploymentId, ...params });
    } catch (error) {
      console.error('Failed to fetch commands:', error);
    }
  };

  const getCurrentStateName = (deployment: ActuatorDeployment, min: boolean = false): string => {
    const value = deployment.lastValue || 0;
    const identifier = deployment.componentType.identifier;
    if (identifier === 'gate_servo') {
      if (value === 0) return min ? "closed" : "Closed";
      if (value === 180) return min ? "open" : "Open";
    }else{
      if (value === 0) return min ? "off" : "Off";
      if (value > 0) return min ? "on" : "On";
    }
    return min ? "off" : "Unknown";
  };

  const handleRefresh = () => {
    if (id) {
      fetchDeploymentDetails(Number(id));
      fetchCommands({ deploymentId: Number(id) });
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Mock save - in real app, this would call API
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Mock delete - in real app, this would call API
    navigate('/actuators');
  };

  const handleExport = () => {
    // Mock export - in real app, this would generate and download data
    console.log('Exporting actuator data...');
  };

  const handleSendCommand = async (incomingCommand?: string) => {
    const localCommand = incomingCommand || command;
    if (!id || !localCommand.trim()) return;

    try {
      const params = parameters ? JSON.parse(parameters) : {};
      await actuatorApi.sendCommand(Number(id), { command: localCommand, parameters: params });
      setCommand('');
      setParameters('');
      setIsControlModalOpen(false);
      setState(localCommand);
    } catch (error) {
      console.error('Failed to send command:', error);
    }
  };

  const handleServoCommand = (selectedActuator: ActuatorDeployment, incomingCommand?: string) => {
    const identifier = selectedActuator.componentType.identifier;
    if(identifier === 'gate_servo') {
      if(incomingCommand === 'on'){
        handleSendCommand('180');
      }else if(incomingCommand === 'off'){
        handleSendCommand('0');
      }
    }else{
      handleSendCommand(incomingCommand);
    }
  }

  const handleToggle = (selectedActuator: ActuatorDeployment) => {
    if (state === 'on') {
      handleServoCommand(selectedActuator, 'off');
    } else {
      handleServoCommand(selectedActuator, 'on');
    }
  };

  const handleOpenControl = (actuator: any) => {
    setSelectedActuator(actuator);
    setIsControlModalOpen(true);
  };

  const handleSaveControl = () => {
    // Mock save control - in real app, this would call API
    setIsControlModalOpen(false);
  };


  useEffect(() => {
    if (deployment) {
      setState(getCurrentStateName(deployment, true));
    }
  }, [deployment]);


  if(deploymentLoading){
    return (
      <Container maxW="container.xl" py={6} w="100%" alignItems="center" justifyContent="center">
        <Flex p={6} gap={2}>
          <Spinner />
          <Text>Loading actuator details...</Text>
        </Flex>
      </Container>
    );
  }


  if (!deployment) {
    return (
      <Box p={6}>
        <AlertRoot status="error">
          <AlertTitle>Actuator Not Found</AlertTitle>
          <AlertDescription>The requested actuator could not be found.</AlertDescription>
        </AlertRoot>
        <Button mt={4} onClick={() => navigate('/actuators')}>
          Back to Actuators
        </Button>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <AlertRoot status="error">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </AlertRoot>
        <Button mt={4} onClick={clearError}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header */}
      <VStack align="start" gap={4} mb={8}>
        <HStack justify="space-between" w="full">
          <HStack gap={4}>
            <IconButton
              aria-label="Back"
              onClick={() => navigate('/actuators')}
              variant="outline"
            >
              <ArrowLeft size={20} />
            </IconButton>
            <VStack align="start" gap={1}>
              <HStack gap={3}>
                <ActuatorIcon type={deployment.componentType?.identifier as ActuatorType} />
                <VStack align="start" gap={0}>
                  <Heading size="lg" color="gray.800">
                    {deployment.componentType?.name}
                  </Heading>
                  <Text color="gray.600">
                    {deployment.location || deployment.device?.identifier}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </HStack>
          <HStack gap={2}>
            <IconButton
              aria-label="Refresh"
              onClick={handleRefresh}
              loading={isLoading}
              variant="outline"
            >
              <RefreshCw size={20} />
            </IconButton>
            <Menu.Root>
              <Menu.Trigger>
                <IconButton
                  aria-label="More"
                  variant="outline"
                >
                  <MoreVertical size={20} />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Content>
                  <Menu.Item value="edit" onClick={handleEdit}>
                    <Edit size={16} />Edit
                  </Menu.Item>
                  <Menu.Item value="export" onClick={handleExport}>
                    <Download size={16} />Export Data
                  </Menu.Item>
                  <Menu.Item value="delete" onClick={handleDelete} color="red.500">
                    <Trash2 size={16} />Delete
                  </Menu.Item>
                </Menu.Content>
              </Portal>
            </Menu.Root>
          </HStack>
        </HStack>

        {/* Status Indicators */}
        <HStack gap={6} w="full">
          <StatusIndicator status={deployment.connectionStatus && deployment.active ? ConnStatus.ONLINE : ConnStatus.OFFLINE} />
          <StateIndicator state={getCurrentStateName(deployment, true)} />
        </HStack>
      </VStack>

      {/* Main Content */}
      <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="control">Control</Tabs.Trigger>
          <Tabs.Trigger value="commands">Commands</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
        {/* Overview Tab */}
        <Tabs.Content value="overview">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="full">
            <Card.Root p={6}>
              <Card.Body>
                <VStack align="start" gap={4}>
                  <HStack gap={2}>
                    <Icon as={MapPin} color="gray.500" />
                    <Text fontWeight="semibold">Location</Text>
                  </HStack>
                  <Text color="gray.600">
                    {deployment.location || deployment.device?.identifier || 'Unknown'}
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root p={6}>
              <Card.Body>
                <VStack align="start" gap={4}>
                  <HStack gap={2}>
                    <Icon as={Settings} color="gray.500" />
                    <Text fontWeight="semibold">Type</Text>
                  </HStack>
                  <Text color="gray.600">
                    {deployment.componentType?.name || 'Unknown Type'}
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root p={6}>
              <Card.Body>
                <VStack align="start" gap={4}>
                  <HStack gap={2}>
                    <Icon as={Wifi} color="gray.500" />
                    <Text fontWeight="semibold">Device Status</Text>
                  </HStack>
                  <StatusIndicator status={deployment.connectionStatus as ConnStatus} />
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root p={6}>
              <Card.Body>
                <VStack align="start" gap={4}>
                  <HStack gap={2}>
                    <Icon as={Zap} color="gray.500" />
                    <Text fontWeight="semibold">Current State</Text>
                  </HStack>
                  <StateIndicator state={state} />
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root p={6}>
              <Card.Body>
                <VStack align="start" gap={4}>
                  <HStack gap={2}>
                    <Icon as={Clock} color="gray.500" />
                    <Text fontWeight="semibold">Last Updated</Text>
                  </HStack>
                  <Text color="gray.600">
                    {deployment.updatedAt ? new Date(deployment.updatedAt).toLocaleString() : 'Unknown'}
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root p={6}>
              <Card.Body>
                <VStack align="start" gap={4}>
                  <HStack gap={2}>
                    <Icon as={Activity} color="gray.500" />
                    <Text fontWeight="semibold">Total Commands</Text>
                  </HStack>
                  <Text color="gray.600" fontSize="2xl" fontWeight="bold">
                    {commands.length}
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </Tabs.Content>

        {/* Control Tab */}
        <Tabs.Content value="control">
          <VStack align="start" gap={6} w="full">
            <Card.Root p={6} w="full">
              <Card.Body>
                <VStack align="start" gap={4}>
                  <Heading size="md">Quick Control</Heading>

                  <HStack gap={4} w="full">
                    <Button
                      colorPalette="green"
                      onClick={() => handleServoCommand(deployment, 'on')}
                      disabled={state === 'on' || state === 'open'}
                    >
                      <Play size={16} />Turn On
                    </Button>
                    <Button
                      colorPalette="red"
                      onClick={() => handleServoCommand(deployment, 'off')}
                      disabled={state === 'off' || state === 'closed'}
                    >
                      <Pause size={16} />Turn Off
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleToggle(deployment)}
                    >
                      <RefreshCw size={16} />Toggle
                    </Button>
                  </HStack>

                  <Separator />

                  <VStack align="start" gap={4} w="full">
                    <Text fontWeight="semibold">Custom Command</Text>
                    <HStack gap={4} w="full">
                      <Input
                        placeholder="Enter command (e.g., 'set_brightness', 'set_speed')"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        flex={1}
                      />
                      <Input
                        placeholder="Parameters (JSON)"
                        value={parameters}
                        onChange={(e) => setParameters(e.target.value)}
                        flex={1}
                      />
                      <Button
                        onClick={() => handleSendCommand()}
                        disabled={!command.trim()}
                      >
                        <Zap size={16} />Send
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </Tabs.Content>

        {/* Commands Tab */}
        <Tabs.Content value="commands">
          <VStack align="start" gap={6} w="full">
            <Card.Root p={6} w="full">
              <Card.Body>
                <VStack align="start" gap={4}>
                  <Heading size="md">Command History</Heading>

                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.Cell>Command</Table.Cell>
                        <Table.Cell>Parameters</Table.Cell>
                        <Table.Cell>Status</Table.Cell>
                        <Table.Cell>Executed At</Table.Cell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {commands.map((cmd) => (
                        <Table.Row key={cmd.actuatorCommandId}>
                          <Table.Cell>{cmd.command}</Table.Cell>
                          <Table.Cell>
                            {cmd.parameters && Object.keys(cmd.parameters).length > 0
                              ? JSON.stringify(cmd.parameters)
                              : '-'}
                          </Table.Cell>
                          <Table.Cell>
                            <Badge
                              colorPalette="green"
                              size="sm"
                            >
                              Completed
                            </Badge>
                          </Table.Cell>
                          <Table.Cell>
                            {cmd.timestamp
                              ? new Date(cmd.timestamp).toLocaleString()
                              : '-'}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </Tabs.Content>

        {/* Settings Tab */}
        <Tabs.Content value="settings">
          <VStack align="start" gap={6} w="full">
            <Card.Root p={6} w="full">
              <Card.Body>
                <VStack align="start" gap={4}>
                  <Heading size="md">Actuator Settings</Heading>

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
                    <Field label="Name">
                      <Input
                        value={deployment.name}
                        readOnly={!isEditing}
                        onChange={(e) => {
                          // Handle name change
                        }}
                      />
                    </Field>

                    <Field label="Description">
                      <Textarea
                        value={deployment.description || ''}
                        readOnly={!isEditing}
                        onChange={(e) => {
                          // Handle description change
                        }}
                      />
                    </Field>

                    <Field label="Location">
                      <Input
                        value={deployment.location || ''}
                        readOnly={!isEditing}
                        onChange={(e) => {
                          // Handle location change
                        }}
                      />
                    </Field>

                    <Field label="Active">
                      <Switch.Root
                        disabled={!isEditing}
                        checked={deployment.active}
                        onCheckedChange={(e) => {
                          // Handle active change
                        }}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>Active</Switch.Label>
                      </Switch.Root>
                    </Field>
                  </SimpleGrid>

                  {isEditing && (
                    <HStack gap={2}>
                      <Button onClick={handleSave} colorPalette="blue">
                        Save Changes
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline">
                        Cancel
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </Tabs.Content>
      </Tabs.Root>

      {/* Control Modal */}
      <Dialog.Root open={isControlModalOpen} onOpenChange={(details) => setIsControlModalOpen(details.open)}>
        <Dialog.Content>
          <Dialog.Header>
            <Heading size="md">Control Actuator</Heading>
          </Dialog.Header>
          <Dialog.Body>
            <VStack gap={4}>
              <Text>Control {selectedActuator?.name}</Text>

              <Field label="Value">
                <Slider.Root
                  min={0}
                  max={100}
                  step={1}
                  value={[controlValue]}
                  onValueChange={(e) => setControlValue(e.value[0] ?? 0)}
                >
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumbs />
                  </Slider.Control>
                </Slider.Root>
                <Text>{controlValue}%</Text>
              </Field>

              <HStack gap={2}>
                <Button onClick={handleSaveControl} colorPalette="blue">
                  Apply
                </Button>
                <Button onClick={() => setIsControlModalOpen(false)} variant="outline">
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </Container >
  );
}; 