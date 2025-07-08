import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Card, 
  Button,
  Input, 
  Textarea, 
  Select, 
  createListCollection,
  SimpleGrid,
  AlertRoot,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Dialog,
  Icon,
} from '@chakra-ui/react';
import { 
  Save, 
  ArrowLeft, 
  Zap, 
  Thermometer, 
  Bell, 
  Settings,
  Eye,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAutomationStore } from '@domain/store/automation-store';
import { type AutomationRule, type ComparisonOperator, type AutomationActionType, type AlertSeverity, AutomationActionTypeEnum } from '@domain/entities/automation.entity';
import { toaster } from '@/presentation/components/ui/chakra/toaster';
import { Field } from '@presentation/components/ui/chakra/field';

// Collections pour les sélecteurs
const operatorCollection = createListCollection({
  items: [
    { label: 'Greater than', value: '>' },
    { label: 'Less than', value: '<' },
    { label: 'Greater than or equal', value: '>=' },
    { label: 'Less than or equal', value: '<=' },
    { label: 'Equal to', value: '==' },
    { label: 'Not equal to', value: '!=' },
  ],
});

const actionTypeCollection = createListCollection({
  items: [
    { label: 'Send Notification', value: 'notification' },
    { label: 'Control Actuator', value: 'actuator' },
  ],
});

const severityCollection = createListCollection({
  items: [
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
    { label: 'Critical', value: 'critical' },
  ],
});

// Composant pour l'icône du type d'action
const ActionIcon: React.FC<{ type: AutomationActionType; size?: number }> = ({ type, size = 20 }) => {
  const getIcon = () => {
    switch (type) {
      case AutomationActionTypeEnum.Notification:
        return <Bell size={size} />;
      case AutomationActionTypeEnum.Actuator:
        return <Settings size={size} />;
      default:
        return <Zap size={size} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case AutomationActionTypeEnum.Notification:
        return 'blue';
      case AutomationActionTypeEnum.Actuator:
        return 'green';
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

export const RuleFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const {
    selectedRule,
    isLoading,
    error,
    fetchRules,
    createRule,
    updateRule,
    setSelectedRule,
    clearError,
  } = useAutomationStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sensorDeploymentId: 0,
    operator: '>' as ComparisonOperator,
    thresholdValue: 0,
    actionType: 'notification' as AutomationActionType,
    alertTitle: '',
    alertMessage: '',
    alertSeverity: 'warning' as AlertSeverity,
    targetDeploymentId: 0,
    actuatorCommand: '',
    actuatorParameters: {},
    cooldownMinutes: 5,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { open: isSaveOpen, onOpen: onSaveOpen, onClose: onSaveClose } = useDisclosure();

  // Charger les données de la règle si on est en mode édition
  useEffect(() => {
    if (isEditing && id) {
      fetchRules();
      // Dans un vrai projet, on aurait une fonction pour charger une règle spécifique
      // Pour l'instant, on simule avec des données par défaut
      setFormData({
        name: 'Temperature Alert Rule',
        description: 'Send notification when temperature exceeds threshold',
        sensorDeploymentId: 1,
        operator: '>',
        thresholdValue: 25,
        actionType: 'notification',
        alertTitle: 'High Temperature Alert',
        alertMessage: 'Temperature has exceeded the threshold',
        alertSeverity: 'warning',
        targetDeploymentId: 0,
        actuatorCommand: '',
        actuatorParameters: {},
        cooldownMinutes: 5,
      });
    }
  }, [isEditing, id, fetchRules]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (isEditing && id) {
        await updateRule(parseInt(id), formData);
        toaster.create({
          title: 'Rule Updated',
          description: 'Automation rule updated successfully',
          type: 'success',
          duration: 3000,
          closable: true,
        });
      } else {
        await createRule(formData);
        toaster.create({
          title: 'Rule Created',
          description: 'Automation rule created successfully',
          type: 'success',
          duration: 3000,
          closable: true,
        });
      }
      navigate('/automation');
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: isEditing ? 'Failed to update rule' : 'Failed to create rule',
        type: 'error',
        duration: 3000,
        closable: true,
      });
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const getTriggerDescription = () => {
    const operatorMap: Record<ComparisonOperator, string> = {
      '>': 'greater than',
      '<': 'less than',
      '>=': 'greater than or equal to',
      '<=': 'less than or equal to',
      '==': 'equal to',
      '!=': 'not equal to',
    };

    return `${operatorMap[formData.operator]} ${formData.thresholdValue}`;
  };

  const getActionDescription = () => {
    switch (formData.actionType) {
      case 'notification':
        return `Send notification: ${formData.alertTitle || 'Alert'}`;
      case 'actuator':
        return `Control actuator: ${formData.actuatorCommand || 'Command'}`;
      default:
        return 'Custom action';
    }
  };

  if (error) {
    return (
      <AlertRoot status="error" mb={4}>
        <AlertTitle>Error loading rule!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </AlertRoot>
    );
  }

  return (
    <Box p={6}>
      {/* Header */}
      <VStack align="start" gap={4} mb={8}>
        <HStack justify="space-between" w="full">
          <VStack align="start" gap={1}>
            <HStack>
              <Button variant="ghost" onClick={() => navigate('/automation')}>
                <ArrowLeft size={16} />
              </Button>
              <Heading size="lg" color="gray.800">
                {isEditing ? 'Edit Automation Rule' : 'Create Automation Rule'}
              </Heading>
            </HStack>
            <Text color="gray.600">
              {isEditing ? 'Modify the automation rule settings' : 'Create a new automation rule for your IoT devices'}
            </Text>
          </VStack>
          <HStack gap={2}>
            <Button variant="outline" onClick={handlePreview}>
              <Eye size={16} />
              Preview
            </Button>
            <Button colorPalette="blue" onClick={onSaveOpen} loading={isLoading}>
              <Save size={16} />
              {isEditing ? 'Update Rule' : 'Create Rule'}
            </Button>
          </HStack>
        </HStack>
      </VStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
        {/* Form */}
        <VStack align="stretch" gap={6}>
          <Card.Root>
            <Card.Header>
              <Heading size="md">Basic Information</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap={4}>
                <Field label="Rule Name">
                  <Input
                    placeholder="Enter rule name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </Field>

                <Field label="Description">
                  <Textarea
                    placeholder="Enter rule description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </Field>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Heading size="md">Trigger Conditions</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap={4}>
                <Field label="Sensor Deployment ID">
                  <Input
                    type="number"
                    placeholder="Enter sensor deployment ID"
                    value={formData.sensorDeploymentId}
                    onChange={(e) => handleInputChange('sensorDeploymentId', parseInt(e.target.value))}
                  />
                </Field>

                <Field label="Operator">
                  <Select.Root
                    collection={operatorCollection}
                    value={[formData.operator]}
                    onValueChange={({ value }) => handleInputChange('operator', value?.[0] || '>')}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select operator" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {operatorCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field>

                <Field label="Threshold Value">
                  <Input
                    type="number"
                    placeholder="Enter threshold value"
                    value={formData.thresholdValue}
                    onChange={(e) => handleInputChange('thresholdValue', parseFloat(e.target.value))}
                  />
                </Field>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Heading size="md">Actions</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap={4}>
                <Field label="Action Type">
                  <Select.Root
                    collection={actionTypeCollection}
                    value={[formData.actionType]}
                    onValueChange={({ value }) => handleInputChange('actionType', value?.[0] || 'notification')}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select action type" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {actionTypeCollection.items.map((item) => (
                          <Select.Item item={item} key={item.value}>
                            {item.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field>

                {formData.actionType === 'notification' && (
                  <>
                    <Field label="Alert Title">
                      <Input
                        placeholder="Enter alert title"
                        value={formData.alertTitle}
                        onChange={(e) => handleInputChange('alertTitle', e.target.value)}
                      />
                    </Field>

                    <Field label="Alert Message">
                      <Textarea
                        placeholder="Enter alert message"
                        value={formData.alertMessage}
                        onChange={(e) => handleInputChange('alertMessage', e.target.value)}
                        rows={3}
                      />
                    </Field>

                    <Field label="Alert Severity">
                      <Select.Root
                        collection={severityCollection}
                        value={[formData.alertSeverity]}
                        onValueChange={({ value }) => handleInputChange('alertSeverity', value?.[0] || 'warning')}
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select severity" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Select.Positioner>
                          <Select.Content>
                            {severityCollection.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Field>
                  </>
                )}

                {formData.actionType === 'actuator' && (
                  <>
                    <Field label="Target Deployment ID">
                      <Input
                        type="number"
                        placeholder="Enter target deployment ID"
                        value={formData.targetDeploymentId}
                        onChange={(e) => handleInputChange('targetDeploymentId', parseInt(e.target.value))}
                      />
                    </Field>

                    <Field label="Actuator Command">
                      <Input
                        placeholder="Enter actuator command"
                        value={formData.actuatorCommand}
                        onChange={(e) => handleInputChange('actuatorCommand', e.target.value)}
                      />
                    </Field>
                  </>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Heading size="md">Settings</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap={4}>
                <Field label="Cooldown (minutes)">
                  <Input
                    type="number"
                    placeholder="Enter cooldown in minutes"
                    value={formData.cooldownMinutes}
                    onChange={(e) => handleInputChange('cooldownMinutes', parseInt(e.target.value))}
                  />
                </Field>
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>

        {/* Preview */}
        <VStack align="stretch" gap={6}>
          <Card.Root>
            <Card.Header>
              <Heading size="md">Rule Preview</Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="stretch" gap={4}>
                <HStack gap={3}>
                  <ActionIcon type={formData.actionType} />
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {formData.name || 'Untitled Rule'}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {formData.description || 'No description'}
                    </Text>
                  </VStack>
                </HStack>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Trigger
                  </Text>
                  <HStack p={2} bg="gray.50" borderRadius="md">
                    <Icon as={Thermometer} color="blue.500" boxSize="16px" />
                    <Text fontSize="sm">{getTriggerDescription()}</Text>
                  </HStack>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Action
                  </Text>
                  <HStack p={2} bg="blue.50" borderRadius="md">
                    <Icon as={Zap} color="blue.500" boxSize="16px" />
                    <Text fontSize="sm">{getActionDescription()}</Text>
                  </HStack>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Settings
                  </Text>
                  <VStack align="start" gap={2}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" color="gray.600">Cooldown</Text>
                      <Text fontSize="sm" fontWeight="medium">{formData.cooldownMinutes} min</Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </VStack>
      </SimpleGrid>

      {/* Save Confirmation Modal */}
      <Dialog.Root open={isSaveOpen} onOpenChange={onSaveClose} size="md">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              {isEditing ? 'Update Rule' : 'Create Rule'}
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <VStack gap={4} align="stretch">
                <Text>
                  Are you sure you want to {isEditing ? 'update' : 'create'} this automation rule?
                </Text>
                
                <HStack gap={4} justify="flex-end">
                  <Button variant="outline" onClick={onSaveClose}>
                    Cancel
                  </Button>
                  <Button colorPalette="blue" onClick={handleSave}>
                    {isEditing ? 'Update Rule' : 'Create Rule'}
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

export default RuleFormPage; 