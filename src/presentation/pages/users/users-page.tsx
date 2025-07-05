import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Stat,
  Switch,
  Flex,
  Spacer,
  InputGroup,
  Input,
  InputLeftElement,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import {
  Users,
  Search,
  MoreVertical,
  Plus,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in a real app, this would come from API
  const users = [
    {
      id: '1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      status: 'active',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      lastLogin: '2024-01-20T10:30:00Z',
      createdAt: '2023-01-15T00:00:00Z',
      twoFactorEnabled: true,
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'user',
      status: 'active',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      lastLogin: '2024-01-19T15:45:00Z',
      createdAt: '2023-03-20T00:00:00Z',
      twoFactorEnabled: false,
    },
    {
      id: '3',
      email: 'mike.johnson@example.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'user',
      status: 'inactive',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastLogin: '2024-01-10T09:20:00Z',
      createdAt: '2023-06-10T00:00:00Z',
      twoFactorEnabled: true,
    },
    {
      id: '4',
      email: 'sarah.wilson@example.com',
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'user',
      status: 'active',
      phone: '+1 (555) 456-7890',
      location: 'Los Angeles, CA',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastLogin: '2024-01-18T14:30:00Z',
      createdAt: '2023-08-05T00:00:00Z',
      twoFactorEnabled: false,
    },
  ];

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'user':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'user':
        return 'User';
      default:
        return role;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} color="green" />;
      case 'inactive':
        return <XCircle size={16} color="red" />;
      default:
        return <AlertTriangle size={16} color="orange" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      default:
        return 'orange';
    }
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    // Mock toggle - in real app, this would call API
    toast({
      title: 'User Status Updated',
      description: `Successfully ${currentStatus === 'active' ? 'deactivated' : 'activated'} user`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteUser = (userId: string) => {
    // Mock delete - in real app, this would call API
    toast({
      title: 'User Deleted',
      description: 'User has been successfully deleted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleCollection = createListCollection({
    items: [
      { label: 'All Roles', value: 'all' },
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ],
  });
  const statusCollection = createListCollection({
    items: [
      { label: 'All Status', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  });

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" gap={4} mb={8}>
        <HStack justify="space-between" w="full">
          <VStack align="start" gap={1}>
            <Heading size="lg" color="gray.800">
              User Management
            </Heading>
            <Text color="gray.600">
              Manage system users and permissions
            </Text>
          </VStack>
          <Button colorPalette="blue" onClick={() => navigate('/users/new')}>
            <UserPlus size={16} />
            Add User
          </Button>
        </HStack>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
        <Stat.Root>
          <Stat.Label>Total Users</Stat.Label>
          <Stat.ValueText>{stats.total}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root>
          <Stat.Label>Active Users</Stat.Label>
          <Stat.ValueText color="green.600">{stats.active}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root>
          <Stat.Label>Inactive Users</Stat.Label>
          <Stat.ValueText color="red.600">{stats.inactive}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
        <Stat.Root>
          <Stat.Label>Administrators</Stat.Label>
          <Stat.ValueText color="red.600">{stats.admins}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> since last month
          </Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      {/* Filters */}
      <Card.Root mb={6}>
        <Card.Body>
          <HStack gap={4}>
            <InputGroup maxW="400px">
              <InputLeftElement>
                <Search size={16} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Select.Root
              collection={roleCollection}
              value={[roleFilter]}
              onValueChange={({ value }) => setRoleFilter(value[0])}
              width="200px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Roles" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {roleCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            <Select.Root
              collection={statusCollection}
              value={[statusFilter]}
              onValueChange={({ value }) => setStatusFilter(value[0])}
              width="200px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="All Status" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {statusCollection.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            <Spacer />
            <Text fontSize="sm" color="gray.500">
              {filteredUsers.length} of {users.length} users
            </Text>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Users Table */}
      <Card.Root>
        <Card.Header>
          <Heading size="md">Users</Heading>
        </Card.Header>
        <Card.Body>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Contact</Th>
                  <Th>Last Login</Th>
                  <Th>2FA</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <HStack gap={3}>
                        <Avatar
                          size="sm"
                          src={user.avatar}
                          name={`${user.firstName} ${user.lastName}`}
                        />
                        <VStack align="start" gap={0}>
                          <Text fontWeight="medium">
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {user.email}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorPalette={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack gap={1}>
                        {getStatusIcon(user.status)}
                        <Badge colorPalette={getStatusColor(user.status)} size="sm">
                          {user.status}
                        </Badge>
                      </HStack>
                    </Td>
                    <Td>
                      <VStack align="start" gap={0}>
                        <HStack gap={1}>
                          <Phone size={12} color="gray.400" />
                          <Text fontSize="sm">{user.phone}</Text>
                        </HStack>
                        <HStack gap={1}>
                          <MapPin size={12} color="gray.400" />
                          <Text fontSize="sm">{user.location}</Text>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(user.lastLogin).toLocaleTimeString()}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorPalette={user.twoFactorEnabled ? 'green' : 'gray'} size="sm">
                        {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack gap={1}>
                        <Switch
                          isChecked={user.status === 'active'}
                          onChange={() => handleToggleStatus(user.id, user.status)}
                         colorPalette="green"
                          size="sm"
                        />
                        <Menu>
                          <MenuButton as={IconButton} variant="ghost" size="sm" aria-label="More actions">
                            <MoreVertical size={16} />
                          </MenuButton>
                          <MenuList>
                            <MenuItem onClick={() => navigate(`/users/${user.id}`)}>
                              View Profile
                            </MenuItem>
                            <MenuItem onClick={() => navigate(`/users/${user.id}/edit`)}>
                              Edit User
                            </MenuItem>
                            <MenuItem onClick={() => navigate(`/users/${user.id}/permissions`)}>
                              Manage Permissions
                            </MenuItem>
                            <MenuItem color="red.500" onClick={() => handleDeleteUser(user.id)}>
                              Delete User
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card.Body>
      </Card.Root>

      {filteredUsers.length === 0 && (
        <Card.Root>
          <Card.Body>
            <VStack gap={4} py={8}>
              <Users size={48} color="gray.300" />
              <Text color="gray.500" fontSize="lg">
                No users found
              </Text>
              <Text color="gray.400" fontSize="sm">
                Try adjusting your search or filters
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      )}
    </Box>
  );
};

export default UsersPage; 