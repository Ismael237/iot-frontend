import { useState, useCallback } from 'react';

interface ValidationRule<T> {
  validate: (value: T) => boolean | string;
  message?: string;
}

interface ValidationRules<T> {
  [K in keyof T]?: ValidationRule<T[K]>[];
}

interface ValidationErrors<T> {
  [K in keyof T]?: string;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((field: keyof T, value: T[keyof T]): string | null => {
    const fieldRules = validationRules[field];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      const result = rule.validate(value);
      if (result !== true) {
        return typeof result === 'string' ? result : rule.message || 'Invalid value';
      }
    }
    return null;
  }, [validationRules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const fieldKey = field as keyof T;
      const error = validateField(fieldKey, values[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setTouchedField = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field when it's touched
    const error = validateField(field, values[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  }, [values, validateField]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouchedField(field);
  }, [setTouchedField]);

  const handleChange = useCallback((field: keyof T, value: T[keyof T]) => {
    setValue(field, value);
  }, [setValue]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  }, [errors, touched]);

  const isFieldValid = useCallback((field: keyof T): boolean => {
    return !getFieldError(field);
  }, [getFieldError]);

  const isFormValid = useCallback((): boolean => {
    return Object.keys(validationRules).every(field => 
      isFieldValid(field as keyof T)
    );
  }, [validationRules, isFieldValid]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouchedField,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    getFieldError,
    isFieldValid,
    isFormValid
  };
}; 