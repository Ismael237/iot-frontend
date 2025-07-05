import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Select,
  Button,
  Badge,
  IconButton,
  SimpleGrid,
  Alert,
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useColorModeValue } from '@ui/chakra/color-mode';
import { Card } from '@chakra-ui/react';
import { Field } from '@ui/chakra/field';
import { createListCollection } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

const componentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  category: z.enum(['Sensor', 'Actuator'], { required_error: 'Category is required' }),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  version: z.string().regex(/^[0-9]+\.[0-9]+\.[0-9]+$/, 'Version must be in format x.y.z'),
  status: z.enum(['active', 'beta', 'deprecated']),
  capabilities: z.array(z.object({
    name: z.string().min(1, 'Capability name is required'),
    description: z.string().optional(),
  })).min(1, 'At least one capability is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  model: z.string().min(1, 'Model is required'),
  specifications: z.object({
    powerConsumption: z.string().optional(),
    operatingTemperature: z.string().optional(),
    connectivity: z.string().optional(),
    dimensions: z.string().optional(),
  }),
});

type ComponentFormData = z.infer<typeof componentSchema>;

export const ComponentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ComponentFormData>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      name: '',
      category: 'Sensor',
      description: '',
      version: '1.0.0',
      status: 'active',
      capabilities: [{ name: '', description: '' }],
      manufacturer: '',
      model: '',
      specifications: {
        powerConsumption: '',
        operatingTemperature: '',
        connectivity: '',
        dimensions: '',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'capabilities',
  });

  const watchedCategory = watch('category');

  const categoryCollection = createListCollection({
    items: [
      { label: 'Sensor', value: 'Sensor' },
      { label: 'Actuator', value: 'Actuator' },
    ],
  });

  const statusCollection = createListCollection({
    items: [
      { label: 'Active', value: 'active' },
      { label: 'Beta', value: 'beta' },
      { label: 'Deprecated', value: 'deprecated' },
    ],
  });

  const onSubmit = async (data: ComponentFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Component data:', data);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/components/types');
      }, 2000);
    } catch (error) {
      console.error('Error saving component:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setSubmitSuccess(false);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <Box>
            <HStack mb={2}>
              <IconButton
                aria-label="Go back"
                variant="ghost"
                onClick={() => navigate('/components/types')}
              >
                <ArrowLeft />
              </IconButton>
              <Heading size="lg">Add Component Type</Heading>
            </HStack>
            <Text color="gray.600">
              Create a new IoT component type with specifications and capabilities
            </Text>
          </Box>
          <Badge colorPalette="blue" variant="subtle" p={2}>
            {watchedCategory}
          </Badge>
        </HStack>

        {submitSuccess && (
          <Alert.Root status="success">
            <Alert.Indicator />
            <Alert.Title>Success!</Alert.Title>
            <Alert.Description>
              Component type saved successfully! Redirecting...
            </Alert.Description>
          </Alert.Root>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={6} align="stretch">
            {/* Basic Information */}
            <Card.Root bg={cardBg} border="1px" borderColor={borderColor}>
              <Card.Body>
                <VStack gap={6} align="stretch">
                  <Heading size="md">Basic Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    <Field label="Component Name" errorText={errors.name?.message}>
                      <Input
                        placeholder="e.g., Temperature Sensor"
                        {...register('name')}
                      />
                    </Field>
                    <Field label="Category" errorText={errors.category?.message}>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select.Root
                            collection={categoryCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={({ value }) => field.onChange(value[0])}
                            width="full"
                          >
                            <Select.HiddenSelect />
                            <Select.Label>Category</Select.Label>
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select category" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Select.Positioner>
                              <Select.Content>
                                {categoryCollection.items.map((item) => (
                                  <Select.Item item={item} key={item.value}>
                                    {item.label}
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                        )}
                      />
                    </Field>
                  </SimpleGrid>
                  <Field label="Description" errorText={errors.description?.message}>
                    <Textarea
                      placeholder="Describe the component's purpose and features..."
                      rows={3}
                      {...register('description')}
                    />
                  </Field>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    <Field label="Version" errorText={errors.version?.message}>
                      <Input
                        placeholder="1.0.0"
                        {...register('version')}
                      />
                    </Field>
                    <Field label="Status" errorText={errors.status?.message}>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select.Root
                            collection={statusCollection}
                            value={field.value ? [field.value] : []}
                            onValueChange={({ value }) => field.onChange(value[0])}
                            width="full"
                          >
                            <Select.HiddenSelect />
                            <Select.Label>Status</Select.Label>
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Select status" />
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
                        )}
                      />
                    </Field>
                  </SimpleGrid>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Manufacturer Information */}
            <Card.Root bg={cardBg} border="1px" borderColor={borderColor}>
              <Card.Body>
                <VStack gap={6} align="stretch">
                  <Heading size="md">Manufacturer Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    <Field label="Manufacturer" errorText={errors.manufacturer?.message}>
                      <Input
                        placeholder="e.g., IoT Solutions Inc."
                        {...register('manufacturer')}
                      />
                    </Field>
                    <Field label="Model" errorText={errors.model?.message}>
                      <Input
                        placeholder="e.g., TS-2000"
                        {...register('model')}
                      />
                    </Field>
                  </SimpleGrid>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Capabilities */}
            <Card.Root bg={cardBg} border="1px" borderColor={borderColor}>
              <Card.Body>
                <VStack gap={6} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md">Capabilities</Heading>
                    <Button
                      size="sm"
                      onClick={() => append({ name: '', description: '' })}
                      type="button"
                    >
                      <Plus />
                      Add Capability
                    </Button>
                  </HStack>
                  {errors.capabilities && (
                    <Text color="red.500" fontSize="sm">
                      {errors.capabilities.message}
                    </Text>
                  )}
                  <VStack gap={4} align="stretch">
                    {fields.map((field, index) => (
                      <Box key={field.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                        <HStack gap={4} align="start">
                          <VStack flex={1} gap={3} align="stretch">
                            <Field label="Capability Name" errorText={errors.capabilities?.[index]?.name?.message}>
                              <Input
                                placeholder="e.g., Temperature Reading"
                                {...register(`capabilities.${index}.name` as const)}
                              />
                            </Field>
                            <Field label="Description (Optional)" optionalText="Optionnel">
                              <Input
                                placeholder="Brief description of the capability"
                                {...register(`capabilities.${index}.description` as const)}
                              />
                            </Field>
                          </VStack>
                          {fields.length > 1 && (
                            <IconButton
                              aria-label="Remove capability"
                              variant="ghost"
                             colorPalette="red"
                              onClick={() => remove(index)}
                            >
                              <X />
                            </IconButton>
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Technical Specifications */}
            <Card.Root bg={cardBg} border="1px" borderColor={borderColor}>
              <Card.Body>
                <VStack gap={6} align="stretch">
                  <Heading size="md">Technical Specifications</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    <Field label="Power Consumption" optionalText="Optionnel">
                      <Input
                        placeholder="e.g., 5W"
                        {...register('specifications.powerConsumption')}
                      />
                    </Field>
                    <Field label="Operating Temperature" optionalText="Optionnel">
                      <Input
                        placeholder="e.g., -40°C to +85°C"
                        {...register('specifications.operatingTemperature')}
                      />
                    </Field>
                    <Field label="Connectivity" optionalText="Optionnel">
                      <Input
                        placeholder="e.g., WiFi, Bluetooth, Zigbee"
                        {...register('specifications.connectivity')}
                      />
                    </Field>
                    <Field label="Dimensions" optionalText="Optionnel">
                      <Input
                        placeholder="e.g., 50mm x 30mm x 15mm"
                        {...register('specifications.dimensions')}
                      />
                    </Field>
                  </SimpleGrid>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Form Actions */}
            <HStack gap={4} justify="flex-end">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                type="button"
              >
                Reset
              </Button>
              <Button
                type="submit"
               colorPalette="blue"
                loading={isSubmitting}
                disabled={!isDirty}
              >
                <Save />
                Save Component Type
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default ComponentFormPage; 