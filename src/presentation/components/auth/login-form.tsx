import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Alert,
  VStack,
  Checkbox,
  Text,
  Link as ChakraLink,
  Input,
} from '@chakra-ui/react';
import { useAuthStore } from '@domain/store/auth-store';
import { Field } from '@ui/chakra/field';
import { toaster } from '@ui/chakra/toaster';
import { Button } from '@ui/button';
import { PasswordInput } from '@ui/chakra/password-input';
import { Link } from 'react-router-dom';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  redirectTo,
}) => {
  const { login, isLoading, error } = useAuthStore();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      toaster.success({
        title: 'Login successful',
        description: 'Welcome back!',
        duration: 3000,
        closable: true,
      });

      onSuccess?.();

      // Redirect if specified
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      onError?.(errorMessage);

      toaster.error({
        title: 'Login failed',
        description: errorMessage,
        duration: 5000,
        closable: true,
      });
    }
  };

  return (
    <VStack gap={6} width="100%" maxWidth="400px">
      {/* Header */}
      <VStack gap={2} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          Welcome Back
        </Text>
        <Text fontSize="sm" color="gray.600">
          Sign in to your account to continue
        </Text>
      </VStack>

      {/* Error Alert */}
      {error && (
        <Alert.Root status="error" borderRadius="md">
          <VStack align="start" gap={1}>
            <Text fontWeight="bold">Login Failed</Text>
            <Text>{error}</Text>
          </VStack>
        </Alert.Root>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack gap={4} width="100%">
          {/* Email Field */}
          <Field label="Email Address" errorText={errors.email?.message} invalid={!!errors.email}>
            <Input
              id="email"
              placeholder="Enter your email"
              value={watchedValues.email}
              disabled={isLoading}
              {...register("email")} />
          </Field>

          {/* Password Field */}
          <Field label="Password" errorText={errors.password?.message} invalid={!!errors.password}>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              {...register("password")}
            />
          </Field>

          {/* Remember Me & Forgot Password */}
          <VStack gap={3} width="100%" align="start">
            <Controller
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <Field label="Remember me for 30 days" errorText={errors.rememberMe?.message} invalid={!!errors.rememberMe} disabled={isLoading}>
                  <Checkbox.Root
                    colorPalette="blue"
                    checked={field.value}
                    onCheckedChange={({ checked }) => field.onChange(checked)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Checkbox</Checkbox.Label>
                  </Checkbox.Root>
                </Field>
              )}
            />

            <ChakraLink
              asChild
              fontSize="sm"
              color="blue.500"
              _hover={{ textDecoration: 'underline' }}
            >
              <Link to="/forgot-password">Forgot password?</Link>
            </ChakraLink>
          </VStack>

          <Button
            type="submit"
            colorPalette="blue"
            loading={isSubmitting}
            fullWidth
            disabled={isLoading}
          >
            Sign In
          </Button>
        </VStack>
      </form>

      {/* Demo Credentials */}
      <VStack gap={2} width="100%" p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="sm" fontWeight="medium" color="gray.700">
          Demo Credentials
        </Text>
        <Text fontSize="xs" color="gray.600" textAlign="center">
          Email: admin@example.com<br />
          Password: password123
        </Text>
      </VStack>

      {/* Sign Up Link */}
      <VStack gap={1}>
        <Text fontSize="sm" color="gray.600">
          Don't have an account?
        </Text>
        <ChakraLink
          asChild
          fontSize="sm"
          color="blue.500"
          fontWeight="medium"
          _hover={{ textDecoration: 'underline' }}
        >
          <Link to="/signup">Sign up for free</Link>
        </ChakraLink>
      </VStack>
    </VStack>
  );
};

export default LoginForm; 