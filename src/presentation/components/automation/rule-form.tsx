import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  NumberInput,
  NumberInputField,
  Textarea,
} from '@chakra-ui/react';
import { AutomationRule } from '../../../shared/types/automation.types';

interface RuleFormProps {
  rule?: AutomationRule;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const OPERATORS = ['>', '<', '>=', '<=', '=', '!='];
const ACTION_TYPES = [
  { label: 'Create Alert', value: 'create_alert' },
  { label: 'Trigger Actuator', value: 'trigger_actuator' },
];
const SEVERITIES = ['info', 'warning', 'error', 'critical'];

const RuleForm: React.FC<RuleFormProps> = ({ rule, onSubmit, onCancel }) => {
  const { handleSubmit, control, watch } = useForm({
    defaultValues: rule || {
      name: '',
      description: '',
      sensor_deployment_id: '',
      operator: '>',
      threshold_value: '',
      action_type: 'create_alert',
      alert_title: '',
      alert_message: '',
      alert_severity: 'warning',
      target_deployment_id: '',
      actuator_command: '',
      actuator_parameters: '',
      cooldown_minutes: 5,
    },
  });
  const actionType = watch('action_type');

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Controller name="name" control={control} render={({ field }) => <Input {...field} />} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Controller name="description" control={control} render={({ field }) => <Textarea {...field} />} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Sensor Deployment ID</FormLabel>
          <Controller name="sensor_deployment_id" control={control} render={({ field }) => <Input type="number" {...field} />} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Operator</FormLabel>
          <Controller name="operator" control={control} render={({ field }) => (
            <Select {...field}>
              {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
            </Select>
          )} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Threshold Value</FormLabel>
          <Controller name="threshold_value" control={control} render={({ field }) => <NumberInput min={0} {...field} onChange={val => field.onChange(Number(val))}><NumberInputField /></NumberInput>} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Action Type</FormLabel>
          <Controller name="action_type" control={control} render={({ field }) => (
            <Select {...field}>
              {ACTION_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </Select>
          )} />
        </FormControl>
        {actionType === 'create_alert' && (
          <>
            <FormControl isRequired>
              <FormLabel>Alert Title</FormLabel>
              <Controller name="alert_title" control={control} render={({ field }) => <Input {...field} />} />
            </FormControl>
            <FormControl>
              <FormLabel>Alert Message</FormLabel>
              <Controller name="alert_message" control={control} render={({ field }) => <Textarea {...field} />} />
            </FormControl>
            <FormControl>
              <FormLabel>Alert Severity</FormLabel>
              <Controller name="alert_severity" control={control} render={({ field }) => (
                <Select {...field}>
                  {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              )} />
            </FormControl>
          </>
        )}
        {actionType === 'trigger_actuator' && (
          <>
            <FormControl isRequired>
              <FormLabel>Target Deployment ID</FormLabel>
              <Controller name="target_deployment_id" control={control} render={({ field }) => <Input type="number" {...field} />} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Actuator Command</FormLabel>
              <Controller name="actuator_command" control={control} render={({ field }) => <Input {...field} />} />
            </FormControl>
            <FormControl>
              <FormLabel>Actuator Parameters (JSON)</FormLabel>
              <Controller name="actuator_parameters" control={control} render={({ field }) => <Textarea {...field} />} />
            </FormControl>
          </>
        )}
        <FormControl>
          <FormLabel>Cooldown Minutes</FormLabel>
          <Controller name="cooldown_minutes" control={control} render={({ field }) => <NumberInput min={1} {...field} onChange={val => field.onChange(Number(val))}><NumberInputField /></NumberInput>} />
        </FormControl>
        <Stack direction="row" gap={4} justify="flex-end">
          {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
          <Button colorPalette="blue" type="submit">Submit</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RuleForm; 