import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Settings,
  BarChart3,
  Zap,
  MapPin,
  Users,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { useAuthStore } from '@domain/store/auth-store';
import { useColorModeValue } from '../ui/chakra/color-mode';
import { Button } from '@ui/button';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
  requiresAdmin?: boolean;
}

const navItems: NavItem[] = [
  // {
  //   label: 'Dashboard',
  //   path: '/dashboard',
  //   icon: LayoutDashboard,
  // },
  // {
  //   label: 'Devices',
  //   path: '/devices',
  //   icon: Cpu,
  // },
  // {
  //   label: 'Components',
  //   path: '/components',
  //   icon: Settings,
  // },
  {
    label: 'Sensors',
    path: '/sensors',
    icon: BarChart3,
  },
  {
    label: 'Actuators',
    path: '/actuators',
    icon: Zap,
  },
  {
    label: 'Zones',
    path: '/zones',
    icon: MapPin,
  },
  {
    label: 'Automation',
    path: '/automation',
    icon: Activity,
  },
  {
    label: 'Alerts',
    path: '/automation/alerts',
    icon: AlertTriangle,
  },
  // {
  //   label: 'Users',
  //   path: '/users',
  //   icon: Users,
  //   requiresAdmin: true,
  // },
];

interface SidebarNavButtonProps { item: NavItem }

const SidebarNavButton: React.FC<SidebarNavButtonProps> = ({ item }) => {
  const hoverBg = useColorModeValue('blue.50', 'blue.900');
  const activeBg = useColorModeValue('blue.500', 'blue.600');
  const inactiveColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <NavLink to={item.path} end>
      {({ isActive }) => (
        <Button
          as="div"
          w="full"
          justifyContent="flex-start"
          variant="ghost"
          bg={isActive ? activeBg : 'transparent'}
          color={isActive ? 'white' : inactiveColor}
          _hover={{ bg: isActive ? activeBg : hoverBg }}
          leftIcon={<Icon as={item.icon} boxSize={5} />}
          px={4}
          py={3}
          borderRadius="lg"
        >
          <Text flex="1" fontWeight="medium">
            {item.label}
          </Text>
          {item.badge && (
            <Box
              bg={isActive ? 'white' : 'blue.500'}
              color={isActive ? 'blue.500' : 'white'}
              px={2}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
              minW="20px"
              textAlign="center"
            >
              {item.badge}
            </Box>
          )}
        </Button>
      )}
    </NavLink>
  );
};

interface SidebarProps { isDrawer?: boolean }
export const Sidebar: React.FC<SidebarProps> = ({ isDrawer = false }) => {
  const { user } = useAuthStore();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresAdmin || user?.isAdmin
  );

  return (
    <Box
      w={isDrawer ? 'full' : { base: 'full', md: '280px' }}
      display={isDrawer ? 'block' : { base: 'none', md: 'block' }}
      bg={bgColor}
      borderRightWidth={isDrawer ? 'none' : { base: 'none', md: '1px' }}
      borderColor={borderColor}
      py={6}
      overflowY="auto"
    >
      <VStack gap={2} align="stretch">
        {/* Logo */}
        <Box px={6} mb={6}>
          <HStack gap={3}>
            <Box
              w="40px"
              h="40px"
              bg="blue.500"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Zap size={24} color="white" />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                IoT Dashboard
              </Text>
              <Text fontSize="xs" color="gray.500">
                Smart Management
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Navigation Items */}
        <VStack gap={1} align="stretch" px={3}>
          {filteredNavItems.map((item) => (
            <SidebarNavButton key={item.path} item={item} />
          ))}
        </VStack>

        {/* User Info */}
        <Box px={6} pt={4}>
          <VStack gap={2} align="start">
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {user?.displayName}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {user?.role === 'admin' ? 'Administrator' : 'User'}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar; 