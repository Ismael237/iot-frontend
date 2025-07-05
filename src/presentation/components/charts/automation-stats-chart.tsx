import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Text } from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useColorModeValue } from '../ui/chakra/color-mode';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AutomationStatsData {
  period: string;
  rulesTriggered: number;
  alertsGenerated: number;
  actionsExecuted: number;
}

interface AutomationStatsChartProps {
  data: AutomationStatsData[];
  title?: string;
  height?: number;
  showGrid?: boolean;
  isLoading?: boolean;
}

export const AutomationStatsChart: React.FC<AutomationStatsChartProps> = ({
  data,
  title,
  height = 300,
  showGrid = true,
  isLoading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const gridColor = useColorModeValue('gray.200', 'gray.600');

  const colors = {
    rulesTriggered: '#3182CE',
    alertsGenerated: '#E53E3E',
    actionsExecuted: '#38A169',
  };

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        p={4}
        borderRadius="lg"
        border="1px solid"
        borderColor={gridColor}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color={textColor}>Loading chart...</Text>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box
        bg={bgColor}
        p={4}
        borderRadius="lg"
        border="1px solid"
        borderColor={gridColor}
        height={height}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color={textColor}>No data available</Text>
      </Box>
    );
  }

  const chartData = {
    labels: data.map((d) => d.period),
    datasets: [
      {
        label: 'Rules Triggered',
        data: data.map((d) => d.rulesTriggered),
        backgroundColor: colors.rulesTriggered,
        borderRadius: 4,
      },
      {
        label: 'Alerts Generated',
        data: data.map((d) => d.alertsGenerated),
        backgroundColor: colors.alertsGenerated,
        borderRadius: 4,
      },
      {
        label: 'Actions Executed',
        data: data.map((d) => d.actionsExecuted),
        backgroundColor: colors.actionsExecuted,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: textColor,
        font: { size: 18, weight: 'bold' },
      },
      tooltip: {
        backgroundColor: bgColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        borderRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        grid: {
          display: showGrid,
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  } as const;

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={gridColor}
    >
      <Bar data={chartData} options={options} height={height} />
    </Box>
  );
}; 