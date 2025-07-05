import React, { useEffect, useState } from 'react';
import { Box, Heading, Button, Stack, Input, Switch, Alert } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '@infrastructure/api/axios-client';
import type { Device } from '@shared/types/device.types';
import { DEVICE_TYPES } from '@shared/constants/device-types';
import { Field } from '@/presentation/components/ui/chakra/field';
import { Select, createListCollection } from '@chakra-ui/react';

export const DeviceFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { control, register, handleSubmit, setValue, formState: { errors } } = useForm<Device>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deviceTypeCollection = createListCollection({
    items: Object.values(DEVICE_TYPES).map((type) => ({
      value: type,
      label: type,
    })),
  });

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      apiClient.get(`/devices/${id}`)
        .then((device) => {
          Object.entries(device).forEach(([key, value]) => setValue(key as any, value));
        })
        .catch((err) => setError(err?.message || 'Failed to load device'))
        .finally(() => setLoading(false));
    }
  }, [isEdit, id, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (isEdit && id) {
        await apiClient.patch(`/devices/${id}`, data);
      } else {
        await apiClient.post('/devices', data);
      }
      setSuccess(true);
      navigate('/devices');
    } catch (err: any) {
      setError(err?.message || 'Failed to save device');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6}>
      <Button mb={4} onClick={() => navigate(-1)}>Back</Button>
      <Heading size="lg" mb={4}>{isEdit ? 'Edit Device' : 'Add Device'}</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4} maxW="md">
          <Field label="Identifier" errorText={errors.identifier?.message}>
            <Input {...register('identifier')} />
          </Field>
          <Field label="Device Type" errorText={errors.device_type?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select.Root
                  collection={deviceTypeCollection}
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
                      {deviceTypeCollection.items.map((item) => (
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
          <Field label="Model" errorText={errors.model?.message}>
            <Input {...register('model')} />
          </Field>
          <Field label="IP Address" errorText={errors.ip_address?.message}>
            <Input {...register('ip_address')} />
          </Field>
          <Field label="Port" errorText={errors.port?.message}>
            <Input type="number" {...register('port')} />
          </Field>
          <Field label="Active" display="flex" alignItems="center">
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Field invalid={!!errors.active} errorText={errors.active?.message}>
                  <Switch.Root
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={({ checked }) => field.onChange(checked)}
                  >
                    <Switch.HiddenInput onBlur={field.onBlur} />
                    <Switch.Control />
                    <Switch.Label>Activate Chakra</Switch.Label>
                  </Switch.Root>
                </Field>
              )}
            />
          </Field>
          <Stack direction="row" gap={4} justify="flex-end">
            <Button variant="ghost" onClick={() => navigate('/devices')}>Cancel</Button>
            <Button colorPalette="blue" type="submit" loading={loading}>{isEdit ? 'Update' : 'Create'}</Button>
          </Stack>
          {error && <Alert.Root status="error"><Alert.Description>{error}</Alert.Description></Alert.Root>}
          {success && <Alert.Root status="success"><Alert.Description>Device saved successfully!</Alert.Description></Alert.Root>}
        </Stack>
      </form>
    </Box>
  );
}; 