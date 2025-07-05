import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Badge,
  SimpleGrid,
  Icon,
  Heading,
  Stat,
} from '@chakra-ui/react';
import {
  Cpu,
  BarChart3,
  Zap,
  AlertTriangle,
  Thermometer,
  Droplets,
  Sun,
  Shield,
  Gauge,
} from 'lucide-react';
import { Card } from '@ui/card';
import { SensorLineChart } from '@components/charts/sensor-line-chart';
import { SensorBarChart } from '@components/charts/sensor-bar-chart';
import { AutomationStatsChart } from '@components/charts/automation-stats-chart';
import { useColorModeValue } from '@presentation/components/ui/chakra/color-mode';

// Mock data toggle - set to false to use real API
const USE_MOCK_DATA = true;

interface RealTimeMetric {
  name: string;
  value: number;
  unit: string;
  optimalRange: [number, number];
  status: 'optimal' | 'attention' | 'critical';
  icon: React.ComponentType<any>;
  color: string;
}

interface AlertSummary {
  active: number;
  resolved: number;
  critical: number;
  warning: number;
}

export const DashboardPage: React.FC = () => {
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetric[]>([]);
  const [alertSummary] = useState<AlertSummary>({
    active: 2,
    resolved: 5,
    critical: 1,
    warning: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

  const textColor = useColorModeValue('gray.800', 'white');

  // Mock real-time data generator
  const generateMockMetrics = (): RealTimeMetric[] => [
    {
      name: 'Temperature',
      value: 28,
      unit: '°C',
      optimalRange: [26, 30],
      status: 'optimal',
      icon: Thermometer,
      color: 'green',
    },
    {
      name: 'Humidity',
      value: 65,
      unit: '%',
      optimalRange: [60, 70],
      status: 'optimal',
      icon: Droplets,
      color: 'green',
    },
    {
      name: 'Light Level',
      value: 450,
      unit: 'lux',
      optimalRange: [400, 500],
      status: 'optimal',
      icon: Sun,
      color: 'green',
    },
    {
      name: 'Water Level',
      value: 80,
      unit: '%',
      optimalRange: [70, 90],
      status: 'optimal',
      icon: Gauge,
      color: 'green',
    },
    {
      name: 'Security Status',
      value: 100,
      unit: '%',
      optimalRange: [100, 100],
      status: 'optimal',
      icon: Shield,
      color: 'green',
    },
    {
      name: 'Equipment Status',
      value: 60,
      unit: '%',
      optimalRange: [80, 100],
      status: 'attention',
      icon: Cpu,
      color: 'orange',
    },
  ];

  // Mock sensor data for charts
  const mockSensorData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: 25 + Math.sin(i / 3) * 5 + Math.random() * 2,
  }));

  const mockAutomationData = [
    { period: 'Mon', rulesTriggered: 12, alertsGenerated: 3, actionsExecuted: 8 },
    { period: 'Tue', rulesTriggered: 15, alertsGenerated: 5, actionsExecuted: 10 },
    { period: 'Wed', rulesTriggered: 8, alertsGenerated: 2, actionsExecuted: 6 },
    { period: 'Thu', rulesTriggered: 20, alertsGenerated: 7, actionsExecuted: 15 },
    { period: 'Fri', rulesTriggered: 18, alertsGenerated: 4, actionsExecuted: 12 },
    { period: 'Sat', rulesTriggered: 10, alertsGenerated: 3, actionsExecuted: 7 },
    { period: 'Sun', rulesTriggered: 14, alertsGenerated: 6, actionsExecuted: 9 },
  ];

  const mockBarData = [
    { label: 'Zone A', value: 85 },
    { label: 'Zone B', value: 92 },
    { label: 'Zone C', value: 78 },
    { label: 'Zone D', value: 88 },
  ];

  // Real-time polling effect
  useEffect(() => {
    const updateMetrics = () => {
      if (USE_MOCK_DATA) {
        setRealTimeMetrics(generateMockMetrics());
      } else {
        // TODO: Fetch real data from API
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          setRealTimeMetrics(generateMockMetrics());
          setIsLoading(false);
        }, 1000);
      }
    };

    // Initial load
    updateMetrics();

    // Poll every 10 seconds
    const interval = setInterval(updateMetrics, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'green';
      case 'attention':
        return 'orange';
      case 'critical':
        return 'red';
      default:
        return 'gray';
    }
  };

  const RealTimeMetricCard: React.FC<{ metric: RealTimeMetric }> = ({ metric }) => (
    <Card>
      <Card.Body>
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1}>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {metric.name}
            </Text>
            <Stat.Root>
              <Stat.ValueText fontSize="2xl" fontWeight="bold" color="gray.800">
                {metric.value}{metric.unit}
              </Stat.ValueText>
              <Stat.HelpText fontSize="xs" color="gray.500">
                Optimal: {metric.optimalRange[0]}-{metric.optimalRange[1]}{metric.unit}
              </Stat.HelpText>
            </Stat.Root>
          </VStack>
          <Box
            p={3}
            bg={`${metric.color}.100`}
            color={`${metric.color}.600`}
            borderRadius="lg"
          >
            <Icon as={metric.icon} boxSize={6} />
          </Box>
        </HStack>
        <Badge
          colorScheme={getStatusColor(metric.status)}
          variant="subtle"
          mt={2}
          fontSize="xs"
        >
          {metric.status.toUpperCase()}
        </Badge>
      </Card.Body>
    </Card>
  );

  const AlertSummaryCard: React.FC = () => (
    <Card>
      <Card.Header>
        <Heading size="md">Alert Summary</Heading>
      </Card.Header>
      <Card.Body>
        <VStack gap={4}>
          <HStack justify="space-between" w="full">
            <Text fontSize="sm" color="gray.600">
              Active Alerts
            </Text>
            <Badge colorScheme="red" variant="subtle">
              {alertSummary.active}
            </Badge>
          </HStack>
          <HStack justify="space-between" w="full">
            <Text fontSize="sm" color="gray.600">
              Resolved Today
            </Text>
            <Badge colorScheme="green" variant="subtle">
              {alertSummary.resolved}
            </Badge>
          </HStack>
          <HStack justify="space-between" w="full">
            <Text fontSize="sm" color="gray.600">
              Critical
            </Text>
            <Badge colorScheme="red" variant="subtle">
              {alertSummary.critical}
            </Badge>
          </HStack>
          <HStack justify="space-between" w="full">
            <Text fontSize="sm" color="gray.600">
              Warning
            </Text>
            <Badge colorScheme="orange" variant="subtle">
              {alertSummary.warning}
            </Badge>
          </HStack>
        </VStack>
      </Card.Body>
    </Card>
  );

  return (
    <Box>
      {/* Page Header */}
      <VStack align="start" gap={4} mb={8}>
        <Heading size="lg" color={textColor}>
          Real-Time Dashboard
        </Heading>
        <Text color="gray.600">
          Live monitoring of your IoT system with real-time metrics and alerts.
        </Text>
      </VStack>

      {/* Real-Time Metrics Grid */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
        {realTimeMetrics.map((metric, index) => (
          <GridItem key={index}>
            <RealTimeMetricCard metric={metric} />
          </GridItem>
        ))}
      </Grid>

      {/* Charts and Alerts Section */}
      <Grid templateColumns="2fr 1fr" gap={6} mb={8}>
        <GridItem>
          <Card>
            <Card.Header>
              <Heading size="md">Temperature Trend (24h)</Heading>
            </Card.Header>
            <Card.Body>
              <SensorLineChart
                data={mockSensorData}
                title=""
                unit="°C"
                height={300}
                color="#3182CE"
                isLoading={isLoading}
              />
            </Card.Body>
          </Card>
        </GridItem>
        <GridItem>
          <AlertSummaryCard />
        </GridItem>
      </Grid>

      {/* Additional Charts */}
      <Grid templateColumns="1fr 1fr" gap={6} mb={8}>
        <GridItem>
          <Card>
            <Card.Header>
              <Heading size="md">Zone Performance</Heading>
            </Card.Header>
            <Card.Body>
              <SensorBarChart
                data={mockBarData}
                title=""
                unit="%"
                height={300}
                isLoading={isLoading}
              />
            </Card.Body>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <Card.Header>
              <Heading size="md">Automation Statistics</Heading>
            </Card.Header>
            <Card.Body>
              <AutomationStatsChart
                data={mockAutomationData}
                title=""
                height={300}
                isLoading={isLoading}
              />
            </Card.Body>
          </Card>
        </GridItem>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Heading size="md">Quick Actions</Heading>
        </Card.Header>
        <Card.Body>
          <SimpleGrid columns={4} gap={6}>
            <VStack
              p={4}
              bg="blue.50"
              borderRadius="lg"
              cursor="pointer"
              _hover={{ bg: 'blue.100' }}
              transition="all 0.2s"
            >
              <Icon as={Cpu} boxSize={6} color="blue.500" />
              <Text fontSize="sm" fontWeight="medium" color="blue.700">
                Add Device
              </Text>
            </VStack>
            <VStack
              p={4}
              bg="green.50"
              borderRadius="lg"
              cursor="pointer"
              _hover={{ bg: 'green.100' }}
              transition="all 0.2s"
            >
              <Icon as={BarChart3} boxSize={6} color="green.500" />
              <Text fontSize="sm" fontWeight="medium" color="green.700">
                View Sensors
              </Text>
            </VStack>
            <VStack
              p={4}
              bg="orange.50"
              borderRadius="lg"
              cursor="pointer"
              _hover={{ bg: 'orange.100' }}
              transition="all 0.2s"
            >
              <Icon as={Zap} boxSize={6} color="orange.500" />
              <Text fontSize="sm" fontWeight="medium" color="orange.700">
                Control Actuators
              </Text>
            </VStack>
            <VStack
              p={4}
              bg="red.50"
              borderRadius="lg"
              cursor="pointer"
              _hover={{ bg: 'red.100' }}
              transition="all 0.2s"
            >
              <Icon as={AlertTriangle} boxSize={6} color="red.500" />
              <Text fontSize="sm" fontWeight="medium" color="red.700">
                View Alerts
              </Text>
            </VStack>
          </SimpleGrid>
        </Card.Body>
      </Card>
    </Box>
  );
};

export default DashboardPage; 