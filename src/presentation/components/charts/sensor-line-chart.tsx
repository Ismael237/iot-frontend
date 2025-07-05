import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Text } from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'chartjs-adapter-luxon';
import { useColorModeValue } from '@ui/chakra/color-mode';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

interface SensorDataPoint {
  timestamp: string;
  value: number;
  quality?: string;
}

interface SensorLineChartProps {
  data: SensorDataPoint[];
  title?: string;
  unit?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  color?: string;
  isLoading?: boolean;
}

export const SensorLineChart: React.FC<SensorLineChartProps> = ({
  data,
  title,
  unit,
  height = 300,
  showGrid = true,
  showLegend = false,
  color = '#3182CE',
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
    labels: data.map((d) => d.timestamp),
    datasets: [
      {
        label: title || 'Value',
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: color,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
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
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'PPpp',
        },
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
      <Line key={JSON.stringify(chartData)} data={chartData} options={options} height={height} />
    </Box>
  );
}; 