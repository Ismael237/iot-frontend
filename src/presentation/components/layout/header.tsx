import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Avatar,
  Menu,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { Bell, Settings, LogOut, User, Search, Menu as MenuIcon } from 'lucide-react';
import { useAuthStore } from '@domain/store/auth-store';
import { useColorModeValue } from '@ui/chakra/color-mode';
import { useNavigate } from 'react-router-dom';

interface HeaderProps { onOpenSidebar?: () => void }
export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      px={6} py={4}
    >
      <Flex justify="space-between" align="center">
        {/* Hamburger (mobile) */}
          <IconButton
            aria-label="Open menu"
            variant="ghost"
            size="md"
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={onOpenSidebar}
            mr={2}
          >
            <MenuIcon size={20} />
          </IconButton>

        {/* Left side - Search */}
        <Box flex="1" maxW="400px">
          <HStack
            bg="gray.100"
            borderRadius="lg"
            px={4}
            py={2}
            gap={3}
          >
            <Search size={20} color="gray.500" />
            <Text color="gray.500" fontSize="sm">
              Search devices, sensors, or users...
            </Text>
          </HStack>
        </Box>

        {/* Right side - User menu and notifications */}
        <HStack gap={4}>
          {/* Notifications */}
          <IconButton
            aria-label="Notifications"
            variant="ghost"
            size="md"
            position="relative"
          ><Bell size={20} />
            <Badge
              position="absolute"
              top="1"
              right="1"
             colorPalette="red"
              size="sm"
              borderRadius="full"
            >
              3
            </Badge>
          </IconButton>

          {/* Settings */}
          <IconButton
            aria-label="Settings"
            variant="ghost"
            size="md"
          >
            <Settings size={20} />
          </IconButton>

          {/* User Menu */}
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton
                aria-label="User menu"
                variant="ghost"
                size="md"
              >
              <Avatar.Root
                size="sm"
                bg="brand.500"
                color="white"
              >
                <Avatar.Fallback name={user?.displayName} />
              </Avatar.Root>
              </IconButton>
            </Menu.Trigger>
            <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="profile">
                <User size={16} /><VStack align="start" gap={0}>
                  <Text fontWeight="medium">{user?.displayName}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {user?.email}
                  </Text>
                </VStack>
              </Menu.Item>
              <Menu.Item
                value="logout"
                onClick={handleLogout}
                color="red.500"
                cursor="pointer"
              >
                <LogOut size={16} />Sign Out
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
          </Menu.Root>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header; 