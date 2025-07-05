import React from 'react';
import { Stack, Input, Select, createListCollection } from '@chakra-ui/react';
import { Field } from '@ui/chakra/field';

const OPERATORS = ['>', '<', '>=', '<=', '=', '!='];

const operatorCollection = createListCollection({
  items: OPERATORS.map((op) => ({ label: op, value: op })),
});

interface Condition {
  sensor_deployment_id: number | string;
  operator: string;
  threshold_value: number | string;
}

interface ConditionBuilderProps {
  value: Condition;
  onChange: (value: Condition) => void;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ value, onChange }) => {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
      <Field label="Sensor Deployment ID" required>
        <Input
          type="number"
          value={value.sensor_deployment_id}
          onChange={(e) =>
            onChange({ ...value, sensor_deployment_id: e.currentTarget.value })
          }
        />
      </Field>
      <Field label="Operator" required>
        <Select.Root
          value={value.operator}
          onValueChange={(val) => onChange({ ...value, operator: val as string })}
          width="full"
          collection={operatorCollection}
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
                <Select.Item key={item.value} item={item}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Field>
      <Field label="Threshold Value" required>
        <Input
          type="number"
          value={value.threshold_value}
          onChange={(e) =>
            onChange({ ...value, threshold_value: e.currentTarget.value })
          }
        />
      </Field>
    </Stack>
  );
};

export default ConditionBuilder;