import React from 'react';
// Dialog component in Chakra v3 replaces Modal. Type definitions may lag, so we
// cast subcomponents to `any` to keep code compiling until upstream types are
// updated.
import { Dialog as ChakraDialogRaw } from '@chakra-ui/react';
const ChakraDialog: any = ChakraDialogRaw;
import { Button, type ButtonProps } from '@ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  
  showCloseButton?: boolean;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  
  showCloseButton = true,
  showFooter = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonProps = {},
  cancelButtonProps = {},
  isLoading = false
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <ChakraDialog.Root open={isOpen} onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}>

      <ChakraDialog.Content maxWidth="480px" className="chakra-dialog">
        <ChakraDialog.Title as="h2">{title}</ChakraDialog.Title>
        {showCloseButton && <ChakraDialog.CloseTrigger aria-label="Close dialog" />}
        
        <ChakraDialog.Description as="div">
          {children}
        </ChakraDialog.Description>

        {showFooter && (
          <ChakraDialog.Footer as="div" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <Button
              variant="ghost"
              mr={3}
              onClick={handleCancel}
              disabled={isLoading}
              {...cancelButtonProps}
            >
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
               colorPalette="blue"
                onClick={onConfirm}
                loading={isLoading}
                {...confirmButtonProps}
              >
                {confirmText}
              </Button>
            )}
          </ChakraDialog.Footer>
        )}
      </ChakraDialog.Content>
    </ChakraDialog.Root>
  );
}; 