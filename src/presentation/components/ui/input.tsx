import React from 'react';
import { Input as ChakraInput } from '@chakra-ui/react';
import type { InputProps as ChakraInputProps } from '@chakra-ui/react';
import { Field } from '@/presentation/components/ui/chakra/field';

export interface InputProps extends ChakraInputProps {
  label?: string;
  errorText?: string;
  optionalText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  errorText,
  optionalText,
  ...props
}) => {
  if (label || errorText || optionalText) {
    return (
      <Field label={label} errorText={errorText} optionalText={optionalText}>
        <ChakraInput {...props} />
      </Field>
    );
  }
  return <ChakraInput {...props} />;
};

// Specialized input types
export interface EmailInputProps extends Omit<InputProps, 'type'> {
  validateEmail?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ validateEmail = true, ...props }) => {
  const validateEmailFormat = (email: string) => {
    if (!validateEmail) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && !emailRegex.test(email) ? 'Please enter a valid email address' : '';
  };

  return (
    <Input
      type="email"
      placeholder="Enter your email"
      onChange={(value) => {
        if (props.onChange) {
          props.onChange(value);
        }
        if (validateEmail) {
          const error = validateEmailFormat(value);
          // You might want to handle this error state differently
        }
      }}
      {...props}
    />
  );
};

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  showToggle?: boolean;
  strengthIndicator?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showToggle = true,
  strengthIndicator = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    if (strengthIndicator) {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'red';
    if (passwordStrength <= 3) return 'orange';
    if (passwordStrength <= 4) return 'yellow';
    return 'green';
  };

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      placeholder="Enter your password"
      onChange={handlePasswordChange}
      {...props}
    />
  );
};

export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({ min, max, step, ...props }) => {
  return (
    <Input
      type="number"
      min={min}
      max={max}
      step={step}
      {...props}
    />
  );
};

export interface SearchInputProps extends Omit<InputProps, 'type'> {
  onSearch?: (query: string) => void;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  debounceMs = 300,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout>();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (onSearch) {
      debounceTimeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    }

    if (props.onChange) {
      props.onChange(value);
    }
  };

  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Input
      type="search"
      placeholder="Search..."
      value={searchTerm}
      onChange={handleSearchChange}
      {...props}
    />
  );
};

export default Input; 