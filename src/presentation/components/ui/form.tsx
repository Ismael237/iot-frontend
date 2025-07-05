import React from 'react';
import {
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';
import { Field } from '@/presentation/components/ui/chakra/field';
import type { ButtonProps as ButtonPropsType } from '@chakra-ui/react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  helperText,
  isRequired = false,
  isInvalid = false
}) => {
  return (
    <Field
      label={label}
      errorText={error}
      helperText={helperText}
      required={isRequired}
      invalid={isInvalid}
    >
      {children}
    </Field>
  );
};

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  spacing?: number;
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'space-between';
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  spacing = 4,
  align = 'start',
  justify = 'start'
}) => {
  return (
    <form onSubmit={onSubmit}>
      <VStack gap={spacing} align={align} justify={justify} w="full">
        {children}
      </VStack>
    </form>
  );
};

interface FormActionsProps {
  children: React.ReactNode;
  spacing?: number;
  justify?: 'start' | 'center' | 'end' | 'space-between';
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  spacing = 3,
  justify = 'end'
}) => {
  return (
    <HStack gap={spacing} justify={justify} w="full">
      {children}
    </HStack>
  );
};

interface SubmitButtonProps extends ButtonPropsType {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Submitting...',
  ...props
}) => {
  return (
    <Button
      type="submit"
     colorPalette="blue"
      loading={isLoading}
      loadingText={loadingText}
      {...props}
    >
      {children}
    </Button>
  );
}; 