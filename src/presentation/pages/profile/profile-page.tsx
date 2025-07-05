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
  Divider,
  SimpleGrid,
  Input,
  Select,
  Switch,
  Textarea,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  User,
  Settings,
  Bell,
  Shield,
  Key,
  Mail,
  Phone,
  MapPin,
  Save,
  Edit,
  Camera,
} from 'lucide-react';
import { Field } from '@/presentation/components/ui/chakra/field';
import { CardRoot } from '@/presentation/components/ui/card';

export const ProfilePage: React.FC = () => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Mock user data - in a real app, this would come from auth store
  const [userData, setUserData] = useState({
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      darkMode: false,
      language: 'en',
      timezone: 'America/Los_Angeles',
    },
    security: {
      twoFactorEnabled: true,
      lastPasswordChange: '2024-01-15',
      lastLogin: '2024-01-20T10:30:00Z',
      loginHistory: [
        { date: '2024-01-20T10:30:00Z', location: 'San Francisco, CA', device: 'Chrome on Mac' },
        { date: '2024-01-19T15:45:00Z', location: 'San Francisco, CA', device: 'Mobile Safari' },
        { date: '2024-01-18T09:20:00Z', location: 'New York, NY', device: 'Chrome on Windows' },
      ],
    },
  });

  const handleSave = () => {
    // Mock save - in real app, this would call API
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
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

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" gap={4} mb={8}>
        <Heading size="lg" color="gray.800">
          Profile Settings
        </Heading>
        <Text color="gray.600">
          Manage your account settings and preferences
        </Text>
      </VStack>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList mb={6}>
          <Tab>
            <HStack gap={2}>
              <User size={16} />
              <Text>Profile</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack gap={2}>
              <Bell size={16} />
              <Text>Notifications</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack gap={2}>
              <Shield size={16} />
              <Text>Security</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Profile Tab */}
          <TabPanel p={0}>
            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
              {/* Profile Card */}
              <Card>
                <CardRoot>
                  <Card.Header>
                    <VStack gap={4}>
                      <Avatar
                        size="xl"
                        src={userData.avatar}
                        name={`${userData.firstName} ${userData.lastName}`}
                      />
                      <VStack gap={1}>
                        <Heading size="md">
                          {userData.firstName} {userData.lastName}
                        </Heading>
                        <Text color="gray.600">{userData.email}</Text>
                        <Badge colorPalette={getRoleColor(userData.role)}>
                          {getRoleLabel(userData.role)}
                        </Badge>
                      </VStack>
                      <Button
                        leftIcon={<Camera size={16} />}
                        variant="outline"
                        size="sm"
                      >
                        Change Photo
                      </Button>
                    </VStack>
                  </Card.Header>
                </CardRoot>
              </Card>

              {/* Profile Form */}
              <Box gridColumn={{ lg: 'span 2' }}>
                <Card>
                  <CardRoot>
                    <Card.Header>
                      <HStack justify="space-between">
                        <Heading size="md">Personal Information</Heading>
                        <Button
                          leftIcon={isEditing ? <Save size={16} /> : <Edit size={16} />}
                         colorPalette={isEditing ? 'green' : 'blue'}
                          onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        >
                          {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </Button>
                      </HStack>
                    </Card.Header>
                    <Card.Body>
                      <VStack gap={6}>
                        <SimpleGrid columns={2} gap={4} w="full">
                          <Field label="First Name">
                            <Input
                              value={userData.firstName}
                              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                              isDisabled={!isEditing}
                            />
                          </Field>
                          <Field label="Last Name">
                            <Input
                              value={userData.lastName}
                              onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                              isDisabled={!isEditing}
                            />
                          </Field>
                        </SimpleGrid>

                        <Field label="Email">
                          <Input
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            isDisabled={!isEditing}
                            type="email"
                          />
                        </Field>

                        <Field label="Phone">
                          <Input
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                            isDisabled={!isEditing}
                          />
                        </Field>

                        <Field label="Location">
                          <Input
                            value={userData.location}
                            onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                            isDisabled={!isEditing}
                          />
                        </Field>

                        {isEditing && (
                          <HStack gap={4} w="full" justify="end">
                            <Button variant="ghost" onClick={handleCancel}>
                              Cancel
                            </Button>
                            <Button colorPalette="green" onClick={handleSave}>
                              Save Changes
                            </Button>
                          </HStack>
                        )}
                      </VStack>
                    </Card.Body>
                  </CardRoot>
                </Card>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel p={0}>
            <Card>
              <CardRoot>
                <Card.Header>
                  <Heading size="md">Notification Preferences</Heading>
                </Card.Header>
                <Card.Body>
                  <VStack gap={6} align="stretch">
                    <HStack justify="space-between">
                      <VStack align="start" gap={1}>
                        <Text fontWeight="medium">Email Notifications</Text>
                        <Text fontSize="sm" color="gray.600">
                          Receive notifications via email
                        </Text>
                      </VStack>
                      <Switch
                        isChecked={userData.preferences.emailNotifications}
                        onChange={(e) => setUserData({
                          ...userData,
                          preferences: {
                            ...userData.preferences,
                            emailNotifications: e.target.checked,
                          },
                        })}
                       colorPalette="blue"
                      />
                    </HStack>

                    <Divider />

                    <HStack justify="space-between">
                      <VStack align="start" gap={1}>
                        <Text fontWeight="medium">Push Notifications</Text>
                        <Text fontSize="sm" color="gray.600">
                          Receive push notifications in browser
                        </Text>
                      </VStack>
                      <Switch
                        isChecked={userData.preferences.pushNotifications}
                        onChange={(e) => setUserData({
                          ...userData,
                          preferences: {
                            ...userData.preferences,
                            pushNotifications: e.target.checked,
                          },
                        })}
                       colorPalette="blue"
                      />
                    </HStack>

                    <Divider />

                    <HStack justify="space-between">
                      <VStack align="start" gap={1}>
                        <Text fontWeight="medium">SMS Notifications</Text>
                        <Text fontSize="sm" color="gray.600">
                          Receive notifications via SMS
                        </Text>
                      </VStack>
                      <Switch
                        isChecked={userData.preferences.smsNotifications}
                        onChange={(e) => setUserData({
                          ...userData,
                          preferences: {
                            ...userData.preferences,
                            smsNotifications: e.target.checked,
                          },
                        })}
                       colorPalette="blue"
                      />
                    </HStack>

                    <Divider />

                    <SimpleGrid columns={2} gap={4}>
                      <Field label="Language">
                        <Select
                          value={userData.preferences.language}
                          onChange={(e) => setUserData({
                            ...userData,
                            preferences: {
                              ...userData.preferences,
                              language: e.target.value,
                            },
                          })}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </Select>
                      </Field>

                      <Field label="Timezone">
                        <Select
                          value={userData.preferences.timezone}
                          onChange={(e) => setUserData({
                            ...userData,
                            preferences: {
                              ...userData.preferences,
                              timezone: e.target.value,
                            },
                          })}
                        >
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="Europe/London">London</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                        </Select>
                      </Field>
                    </SimpleGrid>
                  </VStack>
                </Card.Body>
              </CardRoot>
            </Card>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel p={0}>
            <VStack gap={6} align="stretch">
              {/* Security Status */}
              <Card>
                <CardRoot>
                  <Card.Header>
                    <Heading size="md">Security Settings</Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={4} align="stretch">
                      <HStack justify="space-between">
                        <VStack align="start" gap={1}>
                          <Text fontWeight="medium">Two-Factor Authentication</Text>
                          <Text fontSize="sm" color="gray.600">
                            Add an extra layer of security to your account
                          </Text>
                        </VStack>
                        <Badge colorPalette={userData.security.twoFactorEnabled ? 'green' : 'red'}>
                          {userData.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </HStack>

                      <Divider />

                      <HStack justify="space-between">
                        <VStack align="start" gap={1}>
                          <Text fontWeight="medium">Last Password Change</Text>
                          <Text fontSize="sm" color="gray.600">
                            {new Date(userData.security.lastPasswordChange).toLocaleDateString()}
                          </Text>
                        </VStack>
                        <Button leftIcon={<Key size={16} />} variant="outline" size="sm">
                          Change Password
                        </Button>
                      </HStack>

                      <Divider />

                      <HStack justify="space-between">
                        <VStack align="start" gap={1}>
                          <Text fontWeight="medium">Last Login</Text>
                          <Text fontSize="sm" color="gray.600">
                            {new Date(userData.security.lastLogin).toLocaleString()}
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Card.Body>
                </CardRoot>
              </Card>

              {/* Login History */}
              <Card>
                <CardRoot>
                  <Card.Header>
                    <Heading size="md">Recent Login Activity</Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={3} align="stretch">
                      {userData.security.loginHistory.map((login, index) => (
                        <HStack key={index} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                          <VStack align="start" gap={1}>
                            <Text fontSize="sm" fontWeight="medium">
                              {login.device}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {login.location} • {new Date(login.date).toLocaleString()}
                            </Text>
                          </VStack>
                          <Badge colorPalette="green" size="sm">
                            Successful
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>
                  </Card.Body>
                </CardRoot>
              </Card>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProfilePage; 