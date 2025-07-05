import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Icon,
  Heading,
  Stat,
  Progress,
  SimpleGrid,
  Card,
} from '@chakra-ui/react';
import {
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Settings,
  Eye,
  History,
  Zap,
} from 'lucide-react';
import { SensorLineChart } from '@components/charts/sensor-line-chart';

// Mock data toggle - set to false to use real API
const USE_MOCK_DATA = true;

interface GlobalStats {
  activeZones: number;
  totalDevices: number;
  uptime: number;
  measurementsCollected: number;
}

interface PerformanceMetrics {
  efficiency: number;
  energyConsumption: number;
  maintenanceRequired: number;
  automationSuccess: number;
}

interface AlertSummary {
  active: number;
  resolved: number;
  critical: number;
  warning: number;
}

export const ZoneDetailPage: React.FC = () => {
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    activeZones: 0,
    totalDevices: 0,
    uptime: 0,
    measurementsCollected: 0,
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    efficiency: 0,
    energyConsumption: 0,
    maintenanceRequired: 0,
    automationSuccess: 0,
  });

  const [alertSummary, setAlertSummary] = useState<AlertSummary>({
    active: 0,
    resolved: 0,
    critical: 0,
    warning: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setGlobalStats({
          activeZones: 12,
          totalDevices: 156,
          uptime: 99.8,
          measurementsCollected: 2847,
        });

        setPerformanceMetrics({
          efficiency: 87.5,
          energyConsumption: 23.4,
          maintenanceRequired: 12.8,
          automationSuccess: 94.2,
        });

        setAlertSummary({
          active: 3,
          resolved: 28,
          critical: 1,
          warning: 2,
        });
      } else {
        // TODO: Implement real API calls
        // const stats = await zoneApi.getGlobalStats();
        // const metrics = await zoneApi.getPerformanceMetrics();
        // const alerts = await zoneApi.getAlertSummary();
      }
      
      setIsLoading(false);
    };

    const updateData = () => {
      if (USE_MOCK_DATA) {
        // Simulate real-time updates
        setGlobalStats(prev => ({
          ...prev,
          measurementsCollected: prev.measurementsCollected + Math.floor(Math.random() * 10),
        }));
      }
    };

    loadData();
    
    // Set up polling for real-time updates
    const interval = setInterval(updateData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'green';
    if (value >= 60) return 'yellow';
    return 'red';
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color: string;
    showArrow?: boolean;
    change?: number;
  }> = ({ title, value, subtitle, icon, color, showArrow = false, change }) => (
    <Card.Root>
      <Card.Body>
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1}>
            <Text fontSize="sm" color="gray.600">
              {title}
            </Text>
            <Stat.Root>
              <Stat.ValueText fontSize="2xl" fontWeight="bold" color="gray.800">
                {value}
              </Stat.ValueText>
              {subtitle && (
                <Stat.HelpText>
                  {showArrow && change && (
                    (change > 0 ? <Stat.UpIndicator /> : <Stat.DownIndicator />)
                  )}
                  {subtitle}
                </Stat.HelpText>
              )}
            </Stat.Root>
          </VStack>
          <Icon as={icon} boxSize={6} color={`${color}.500`} />
        </HStack>
      </Card.Body>
    </Card.Root>
  );

  const PerformanceCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card.Root>
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600">
              {title}
            </Text>
            <Icon as={icon} boxSize={5} color={`${color}.500`} />
          </HStack>
          <Progress.Root
            value={value}
            colorPalette={getProgressColor(value)}
            size="lg"
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
            <Progress.Range />
          </Progress.Root>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            {value}%
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );

  const AlertSummaryCard: React.FC = () => (
    <Card.Root>
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              Alert Summary
            </Text>
            <Icon as={AlertTriangle} boxSize={5} color="orange.500" />
          </HStack>
          
          <SimpleGrid columns={2} gap={4}>
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600">Active</Text>
              <Text fontSize="xl" fontWeight="bold" color="red.600">
                {alertSummary.active}
              </Text>
            </VStack>
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600">Resolved</Text>
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                {alertSummary.resolved}
              </Text>
            </VStack>
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600">Critical</Text>
              <Text fontSize="xl" fontWeight="bold" color="red.700">
                {alertSummary.critical}
              </Text>
            </VStack>
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600">Warning</Text>
              <Text fontSize="xl" fontWeight="bold" color="orange.600">
                {alertSummary.warning}
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Card.Body>
    </Card.Root>
  );

  const QuickActionCard: React.FC<{
    title: string;
    icon: React.ComponentType<any>;
    color: string;
    onClick?: () => void;
  }> = ({ title, icon, color, onClick }) => (
    <Card.Root cursor="pointer" onClick={onClick} _hover={{ shadow: 'md' }}>
      <Card.Body>
        <VStack gap={3}>
          <Icon as={icon} boxSize={8} color={`${color}.500`} />
          <Text fontSize="sm" fontWeight="medium" color="gray.800" textAlign="center">
            {title}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center" py={12}>
            <Icon as={Activity} size="lg" color="gray.400" mb={4} />
            <Text fontSize="lg" color="gray.500">Loading zone details...</Text>
          </Box>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <VStack align="start" gap={2}>
          <Heading size="lg" color="gray.800">
            Zone Overview
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Monitor and manage your IoT zones and devices
          </Text>
        </VStack>

        {/* Global Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
          <StatCard
            title="Active Zones"
            value={globalStats.activeZones}
            subtitle="Currently operational"
            icon={Target}
            color="blue"
            showArrow
            change={2.5}
          />
          <StatCard
            title="Total Devices"
            value={globalStats.totalDevices}
            subtitle="Connected devices"
            icon={Zap}
            color="green"
            showArrow
            change={1.8}
          />
          <StatCard
            title="Uptime"
            value={globalStats.uptime}
            subtitle="System availability"
            icon={Clock}
            color="purple"
            showArrow
            change={0.2}
          />
          <StatCard
            title="Measurements"
            value={globalStats.measurementsCollected}
            subtitle="Data points collected"
            icon={BarChart3}
            color="orange"
            showArrow
            change={5.2}
          />
        </SimpleGrid>

        {/* Performance Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          <PerformanceCard
            title="System Efficiency"
            value={performanceMetrics.efficiency}
            icon={TrendingUp}
            color="green"
          />
          <PerformanceCard
            title="Energy Consumption"
            value={performanceMetrics.energyConsumption}
            icon={Activity}
            color="blue"
          />
          <PerformanceCard
            title="Maintenance Required"
            value={performanceMetrics.maintenanceRequired}
            icon={Settings}
            color="orange"
          />
          <PerformanceCard
            title="Automation Success"
            value={performanceMetrics.automationSuccess}
            icon={Target}
            color="purple"
          />
        </SimpleGrid>

        {/* Charts and Alerts */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          <Card.Root>
            <Card.Body>
              <VStack align="stretch" gap={4}>
                <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                  Sensor Readings
                </Text>
                <SensorLineChart data={[]} />
              </VStack>
            </Card.Body>
          </Card.Root>
          
          <AlertSummaryCard />
        </SimpleGrid>

        {/* Quick Actions */}
        <Card.Root>
          <Card.Body>
            <VStack align="stretch" gap={4}>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                Quick Actions
              </Text>
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                <QuickActionCard
                  title="View Details"
                  icon={Eye}
                  color="blue"
                  onClick={() => console.log('View details clicked')}
                />
                <QuickActionCard
                  title="View History"
                  icon={History}
                  color="green"
                  onClick={() => console.log('View history clicked')}
                />
                <QuickActionCard
                  title="Settings"
                  icon={Settings}
                  color="purple"
                  onClick={() => console.log('Settings clicked')}
                />
                <QuickActionCard
                  title="Analytics"
                  icon={BarChart3}
                  color="orange"
                  onClick={() => console.log('Analytics clicked')}
                />
              </SimpleGrid>
            </VStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
}; 