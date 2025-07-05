import React from 'react';
import 'chartjs-adapter-luxon';
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

interface SensorBarData {
  label: string;
  value: number;
  category?: string;
}

interface SensorBarChartProps {
  data: SensorBarData[];
  title?: string;
  unit?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  colors?: string[];
  isLoading?: boolean;
}

export const SensorBarChart: React.FC<SensorBarChartProps> = ({
  data,
  title,
  unit,
  height = 300,
  showGrid = true,
  showLegend = false,
  colors = ['#3182CE', '#38A169', '#D69E2E', '#E53E3E'],
  isLoading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const gridColor = useColorModeValue('gray.200', 'gray.600');

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
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: title || 'Value',
        data: data.map((d) => d.value),
        backgroundColor: colors[0],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: showLegend,
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
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${value.toFixed(2)}${unit ? ` ${unit}` : ''}`;
          },
        },
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
          callback: function (tickValue: string | number) {
            const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
            return `${value.toFixed(2)}${unit ? ` ${unit}` : ''}`;
          },
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
      <Bar key={JSON.stringify(chartData)} data={chartData} options={options} height={height} />
    </Box>
  );
}; 