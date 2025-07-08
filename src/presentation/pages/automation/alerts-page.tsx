import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Select, 
  Spinner, 
  Alert, 
  Stack, 
  createListCollection,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  SimpleGrid,
  Stat,
  Icon,
  IconButton,
  Menu,
  Portal,
  Button,
  InputGroup,
  Input,
  useDisclosure,
  Dialog,
  Textarea,
  Switch,
  Field,
  Spacer,
  Skeleton,
  AlertRoot,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { 
  Bell, 
  Search, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  RefreshCw,
  Filter,
  Download,
  Settings,
  Clock,
  MapPin,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { useAutomationStore } from '@domain/store/automation-store';
import { AlertType, AlertSeverity } from '@shared/types/automation.types';
import { AlertList } from '@components/automation/alert-list';

const SEVERITIES = [
  { label: 'All Severities', value: '' },
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
  { label: 'Critical', value: 'critical' },
];

// Composant pour l'indicateur de tendance
const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable'; value: number }> = ({ trend, value }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} color="green" />;
      case 'down':
        return <TrendingDown size={14} color="red" />;
      default:
        return <Minus size={14} color="gray" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'green.500';
      case 'down':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };

  return (
    <HStack gap={1}>
      {getTrendIcon()}
      <Text fontSize="xs" color={getTrendColor()} fontWeight="medium">
        {value > 0 ? '+' : ''}{value.toFixed(1)}%
      </Text>
    </HStack>
  );
};

// Composant pour l'icône de sévérité
const SeverityIcon: React.FC<{ severity: AlertSeverity; size?: number }> = ({ severity, size = 20 }) => {
  const getIcon = () => {
    switch (severity) {
      case 'info':
        return <Info size={size} />;
      case 'warning':
        return <AlertTriangle size={size} />;
      case 'error':
        return <XCircle size={size} />;
      case 'critical':
        return <AlertTriangle size={size} />;
      default:
        return <Bell size={size} />;
    }
  };

  const getColor = () => {
    switch (severity) {
      case 'info':
        return 'blue';
      case 'warning':
        return 'yellow';
      case 'error':
        return 'orange';
      case 'critical':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      p={2}
      bg={`${getColor()}.100`}
      color={`${getColor()}.600`}
      borderRadius="lg"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {getIcon()}
    </Box>
  );
};

export const AlertsPage: React.FC = () => {
  const {
    alerts,
    isLoading,
    error,
    totalAlerts,
    fetchAlerts,
    acknowledgeAlert,
    setSelectedAlert,
    clearError,
  } = useAutomationStore();

  const [severityFilter, setSeverityFilter] = useState<string[]>(['']);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { open: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();

  const severityCollection = createListCollection({
    items: SEVERITIES,
  });

  // Polling pour les alertes en temps réel
  useEffect(() => {
    fetchAlerts();

    // Polling toutes les 30 secondes
    const interval = setInterval(() => {
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Filtrage des alertes
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.location || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter.includes('') || 
      severityFilter.includes(alert.severity);

    return matchesSearch && matchesSeverity;
  });

  // Calcul des statistiques
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    error: alerts.filter(a => a.severity === 'error').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
  };

  const handleRefresh = () => {
    fetchAlerts();
  };

  const handleViewDetails = (alert: AlertType) => {
    setSelectedAlert(alert);
    onDetailsOpen();
  };


  if (error) {
    return (
      <AlertRoot status="error" mb={4}>
        <AlertTitle>Error loading alerts!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </AlertRoot>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" gap={4} mb={8}>
        <HStack justify="space-between" w="full">
          <VStack align="start" gap={1}>
            <Heading size="lg" color="gray.800">
              Automation Alerts
            </Heading>
            <Text color="gray.600">
              Monitor and manage automation alerts in real-time
            </Text>
          </VStack>
          <HStack gap={2}>
            <Button variant="outline" onClick={handleRefresh} loading={isLoading}>
              <RefreshCw size={16} />
              Refresh
            </Button>
          </HStack>
        </HStack>
      </VStack>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={6} mb={8}>
        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Total Alerts</Stat.Label>
          <Stat.ValueText>{stats.total}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> unacknowledged
          </Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Critical</Stat.Label>
          <Stat.ValueText color="red.600">{stats.critical}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> needs immediate attention
          </Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Errors</Stat.Label>
          <Stat.ValueText color="orange.600">{stats.error}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.DownIndicator /> system issues
          </Stat.HelpText>
        </Stat.Root>

        <Stat.Root
          bg="white"
          borderRadius="lg"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Stat.Label>Warnings</Stat.Label>
          <Stat.ValueText color="yellow.600">{stats.warning}</Stat.ValueText>
          <Stat.HelpText>
            <Stat.UpIndicator /> monitoring required
          </Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      {/* Filters */}
      <Card.Root mb={6}>
        <Card.Body>
          <VStack gap={4}>
            <HStack gap={4} w="full">
              <InputGroup maxW="400px" startElement={<Search size={16} color="gray.400" />}>
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Select.Root
                collection={severityCollection}
                value={severityFilter}
                onValueChange={({ value }) => setSeverityFilter(value ?? [])}
                width="200px"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="All Severities" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {severityCollection.items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>

              <HStack gap={2}>
                <Button
                  variant={viewMode === 'list' ? 'solid' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Activity size={16} />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'solid' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Bell size={16} />
                </Button>
              </HStack>

              <Spacer />
              <Text fontSize="sm" color="gray.500">
                {filteredAlerts.length} of {alerts.length} alerts
              </Text>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>

      {/* Alerts List/Grid */}
      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card.Root key={i}>
              <Card.Body>
                <Skeleton height="200px" />
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {filteredAlerts.map((alert) => (
            <Card.Root key={alert.id} cursor="pointer" _hover={{ shadow: 'md' }}>
              <Card.Header pb={2}>
                <HStack justify="space-between">
                  <HStack gap={3}>
                    <SeverityIcon severity={alert.severity} />
                    <VStack align="start" gap={1}>
                      <Text fontWeight="semibold" color="gray.800">
                        {alert.title}
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>
              </Card.Header>
              <Card.Body pt={0}>
                <VStack align="stretch" gap={4}>
                  {/* Alert Message */}
                  <Text fontSize="sm" color="gray.700" noOfLines={2}>
                    {alert.message}
                  </Text>

                  {/* Alert Info */}
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <Icon as={Clock} size="sm" color="gray.400" />
                      <Text fontSize="xs" color="gray.500">
                        {new Date(alert.createdAt).toLocaleString()}
                      </Text>
                    </HStack>
                  </HStack>

                  {/* Source and Category */}
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Severity
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      <Badge colorPalette={alert.severity}>{alert.severity}</Badge>
                    </Text>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}

      {!isLoading && filteredAlerts.length === 0 && (
        <Card.Root>
          <Card.Body>
            <VStack gap={4} py={8}>
              <Bell size={48} color="gray.300" />
              <Text color="gray.500" fontSize="lg">
                No alerts found
              </Text>
              <Text color="gray.400" fontSize="sm">
                Try adjusting your search or filters
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      )}

      {/* Alert Details Modal */}
      <Dialog.Root open={isDetailsOpen} onOpenChange={onDetailsClose} size="lg">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              Alert Details
            </Dialog.Header>
            <Dialog.Body pb={6}>
              {/* Alert details content would go here */}
              <Text>Alert details modal content</Text>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};

export default AlertsPage; 