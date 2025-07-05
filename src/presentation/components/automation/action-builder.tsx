import React from 'react';
import {
  Stack,
  Input,
  Textarea,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import { Field } from '@ui/chakra/field';

const ACTION_TYPES = [
  { label: 'Create Alert', value: 'create_alert' },
  { label: 'Trigger Actuator', value: 'trigger_actuator' },
];

const SEVERITIES = ['info', 'warning', 'error', 'critical'];

const actionTypeCollection = createListCollection({items: ACTION_TYPES});
const severityCollection = createListCollection({items:SEVERITIES.map((s) => ({ label: s, value: s }))});

export interface Action {
  action_type: string;
  alert_title?: string;
  alert_message?: string;
  alert_severity?: string;
  target_deployment_id?: number | string;
  actuator_command?: string;
  actuator_parameters?: string;
}

export interface ActionBuilderProps {
  value: Action;
  onChange: (value: Action) => void;
}

export const ActionBuilder: React.FC<ActionBuilderProps> = ({ value, onChange }) => {
  return (
    <Stack gap={4}>
      {/* Action type */}
      <Field label="Action Type" required>
        <Select.Root
          value={value.action_type}
          onValueChange={(val) =>
            onChange({ ...value, action_type: val as string })
          }
          width="full"
          collection={actionTypeCollection}
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
                <Select.Item key={item.value} item={item}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Field>

      {/* Alert fields */}
      {value.action_type === 'create_alert' && (
        <>
          <Field label="Alert Title" required>
            <Input
              value={value.alert_title || ''}
              onChange={(e) =>
                onChange({ ...value, alert_title: e.currentTarget.value })
              }
            />
          </Field>
          <Field label="Alert Message">
            <Textarea
              value={value.alert_message || ''}
              onChange={(e) =>
                onChange({ ...value, alert_message: e.currentTarget.value })
              }
            />
          </Field>
          <Field label="Alert Severity">
            <Select.Root
              value={value.alert_severity || 'warning'}
              onValueChange={(val) =>
                onChange({ ...value, alert_severity: val as string })
              }
              width="full"
              collection={severityCollection}
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
                    <Select.Item key={item.value} item={item}>
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

      {/* Actuator fields */}
      {value.action_type === 'trigger_actuator' && (
        <>
          <Field label="Target Deployment ID" required>
            <Input
              type="number"
              value={value.target_deployment_id || ''}
              onChange={(e) =>
                onChange({ ...value, target_deployment_id: e.currentTarget.value })
              }
            />
          </Field>
          <Field label="Actuator Command" required>
            <Input
              value={value.actuator_command || ''}
              onChange={(e) =>
                onChange({ ...value, actuator_command: e.currentTarget.value })
              }
            />
          </Field>
          <Field label="Actuator Parameters (JSON)">
            <Textarea
              value={value.actuator_parameters || ''}
              onChange={(e) =>
                onChange({ ...value, actuator_parameters: e.currentTarget.value })
              }
            />
          </Field>
        </>
      )}
    </Stack>
  );
};

export default ActionBuilder;