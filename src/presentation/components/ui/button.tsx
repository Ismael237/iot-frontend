import React from 'react';
import { Button as ChakraButton, type ButtonProps as ChakraButtonProps, type IconProps } from '@chakra-ui/react';

export interface ButtonProps extends Omit<ChakraButtonProps, "leftIcon" | "rightIcon" | "loading"> {
  /**
   * Variant styles
   */
  variant?: 'solid' | 'outline' | 'ghost' | 'subtle' | 'surface' | 'plain';
  colorScheme?: 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'purple' | 'pink' | 'gray';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: React.ReactElement<IconProps>;
  rightIcon?: React.ReactElement<IconProps>;
  /** New prop name in Chakra v3 (preferred). */
  loading?: boolean;
  /** Legacy alias kept for backward-compatibility. */
  isLoading?: boolean;
  loadingText?: string;
  /** Legacy alias renamed to `isDisabled` in Chakra v3. Wrapper keeps both. */
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  colorScheme = 'blue',
  size = 'md',
  leftIcon,
  rightIcon,
  loading: _loadingProp,
  isLoading: _isLoadingProp,
  
  loadingText,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  ...props
}) => {
  const loading = _loadingProp ?? _isLoadingProp ?? false;

  return (
    <ChakraButton
      variant={variant}
     colorPalette={colorScheme}
      size={size}
      loading={loading}
      loadingText={loadingText}
      disabled={disabled || loading}
      width={fullWidth ? '100%' : undefined}
      onClick={onClick}
      {...props}
    >
      {leftIcon && <span>{leftIcon}</span>}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </ChakraButton>
  );
};

// Predefined button variants for common use cases
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant' | 'colorScheme'>> = (props) => (
  <Button variant="solid"colorPalette="blue" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant' | 'colorScheme'>> = (props) => (
  <Button variant="outline"colorPalette="gray" {...props} />
);

export const SuccessButton: React.FC<Omit<ButtonProps, 'variant' | 'colorScheme'>> = (props) => (
  <Button variant="solid"colorPalette="green" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant' | 'colorScheme'>> = (props) => (
  <Button variant="solid"colorPalette="red" {...props} />
);

export const WarningButton: React.FC<Omit<ButtonProps, 'variant' | 'colorScheme'>> = (props) => (
  <Button variant="solid"colorPalette="orange" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant' | 'colorScheme'>> = (props) => (
  <Button variant="ghost"colorPalette="gray" {...props} />
);

export const LinkButton: React.FC<Omit<ButtonProps, 'variant' | 'colorScheme'>> = (props) => (
  <Button variant="ghost"colorPalette="blue" {...props} />
);

// Icon button wrapper
export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactElement<IconProps>;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, ...props }) => (
  <ChakraButton
    variant="ghost"
   colorPalette="gray"
    size="md"
    {...props}
  >
    {icon}
  </ChakraButton>
);

export default Button; 