export interface ValidationRule {
  validate: (value: any) => boolean | string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const required = (message = 'This field is required'): ValidationRule => ({
  validate: (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },
  message
});

export const minLength = (min: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    if (typeof value === 'string') return value.length >= min;
    if (Array.isArray(value)) return value.length >= min;
    return false;
  },
  message: message || `Minimum length is ${min} characters`
});

export const maxLength = (max: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    if (typeof value === 'string') return value.length <= max;
    if (Array.isArray(value)) return value.length <= max;
    return false;
  },
  message: message || `Maximum length is ${max} characters`
});

export const email = (message = 'Invalid email address'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  message
});

export const url = (message = 'Invalid URL'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  message
});

export const numeric = (message = 'Must be a number'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    return !isNaN(Number(value)) && isFinite(Number(value));
  },
  message
});

export const integer = (message = 'Must be an integer'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const num = Number(value);
    return Number.isInteger(num);
  },
  message
});

export const min = (minValue: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const num = Number(value);
    return !isNaN(num) && num >= minValue;
  },
  message: message || `Minimum value is ${minValue}`
});

export const max = (maxValue: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const num = Number(value);
    return !isNaN(num) && num <= maxValue;
  },
  message: message || `Maximum value is ${maxValue}`
});

export const range = (minValue: number, maxValue: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const num = Number(value);
    return !isNaN(num) && num >= minValue && num <= maxValue;
  },
  message: message || `Value must be between ${minValue} and ${maxValue}`
});

export const pattern = (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    return regex.test(value);
  },
  message
});

export const ipAddress = (message = 'Invalid IP address'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(value);
  },
  message
});

export const port = (message = 'Port must be between 1 and 65535'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const num = Number(value);
    return Number.isInteger(num) && num >= 1 && num <= 65535;
  },
  message
});

export const validate = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    const result = rule.validate(value);
    if (result !== true) {
      errors.push(typeof result === 'string' ? result : rule.message || 'Invalid value');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = <T extends Record<string, any>>(
  values: T,
  validationSchema: Record<keyof T, ValidationRule[]>
): Record<keyof T, ValidationResult> => {
  const results: Record<keyof T, ValidationResult> = {} as Record<keyof T, ValidationResult>;

  for (const field in validationSchema) {
    results[field] = validate(values[field], validationSchema[field]);
  }

  return results;
};

export const isFormValid = <T extends Record<string, any>>(
  validationResults: Record<keyof T, ValidationResult>
): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

// IoT-specific validations
export const deviceIdentifier = (message = 'Invalid device identifier'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const identifierRegex = /^[A-Z0-9_-]+$/;
    return identifierRegex.test(value) && value.length >= 3 && value.length <= 50;
  },
  message
});

export const sensorValue = (minValue = -1000, maxValue = 1000, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const num = Number(value);
    return !isNaN(num) && isFinite(num) && num >= minValue && num <= maxValue;
  },
  message: message || `Sensor value must be between ${minValue} and ${maxValue}`
});

export const actuatorCommand = (message = 'Invalid actuator command'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true; // Let required handle empty values
    const commandRegex = /^[a-zA-Z0-9_-]+$/;
    return commandRegex.test(value) && value.length >= 1 && value.length <= 50;
  },
  message
}); 