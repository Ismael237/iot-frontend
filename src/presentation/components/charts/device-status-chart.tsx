import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Box, Text } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/chakra/color-mode';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Device connection status types (from sensor.entity.ts)
export enum ConnStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  ERROR = 'error',
  UNKNOWN = 'unknown',
}

interface DeviceStatusChartProps {
  data?: Record<ConnStatus, number>;
  height?: number;
  isLoading?: boolean;
}

const STATUS_LABELS: Record<ConnStatus, string> = {
  [ConnStatus.CONNECTED]: 'Connected',
  [ConnStatus.DISCONNECTED]: 'Disconnected',
  [ConnStatus.CONNECTING]: 'Connecting',
  [ConnStatus.ERROR]: 'Error',
  [ConnStatus.UNKNOWN]: 'Unknown',
};

const STATUS_COLORS: Record<ConnStatus, string> = {
  [ConnStatus.CONNECTED]: '#38A169', // green
  [ConnStatus.DISCONNECTED]: '#E53E3E', // red
  [ConnStatus.CONNECTING]: '#3182CE', // blue
  [ConnStatus.ERROR]: '#D69E2E', // yellow
  [ConnStatus.UNKNOWN]: '#A0AEC0', // gray
};

// Mock data example
const MOCK_DATA: Record<ConnStatus, number> = {
  [ConnStatus.CONNECTED]: 12,
  [ConnStatus.DISCONNECTED]: 3,
  [ConnStatus.CONNECTING]: 2,
  [ConnStatus.ERROR]: 1,
  [ConnStatus.UNKNOWN]: 1,
};

export const DeviceStatusChart: React.FC<DeviceStatusChartProps> = ({
  data = MOCK_DATA,
  height = 250,
  isLoading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const chartData = {
    labels: Object.values(ConnStatus).map((status) => STATUS_LABELS[status]),
    datasets: [
      {
        data: Object.values(ConnStatus).map((status) => data[status] || 0),
        backgroundColor: Object.values(ConnStatus).map((status) => STATUS_COLORS[status]),
        borderColor: borderColor,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: bgColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 8,
      },
    },
    cutout: '70%',
  };

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        p={4}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color={textColor}>Loading chart...</Text>
      </Box>
    );
  }

  const total = Object.values(data).reduce((sum, v) => sum + v, 0);
  if (!total) {
    return (
      <Box
        bg={bgColor}
        p={4}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color={textColor}>No data available</Text>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
    >
      <Doughnut key={JSON.stringify(chartData)} data={chartData} options={options} height={height} />
    </Box>
  );
}; 