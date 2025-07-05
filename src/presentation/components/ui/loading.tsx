import React from 'react';
import {
  Center,
  Spinner,
  Text,
  VStack,
  Box,
  Skeleton,
  SkeletonText,
  SkeletonCircle
} from '@chakra-ui/react';

interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullHeight?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  fullHeight = false
}) => {
  const content = (
    <VStack gap={4}>
      <Spinner size={size} />
      {text && <Text color="gray.500">{text}</Text>}
    </VStack>
  );

  if (fullHeight) {
    return (
      <Center h="100vh">
        {content}
      </Center>
    );
  }

  return (
    <Center py={8}>
      {content}
    </Center>
  );
};

interface SkeletonCardProps {
  height?: string;
  showText?: boolean;
  showAvatar?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  height = '200px',
  showText = true,
  showAvatar = false
}) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <VStack align="start" gap={4}>
        {showAvatar && <SkeletonCircle size="10" />}
        <Skeleton height={height} width="100%" />
        {showText && (
          <VStack align="start" gap={2} width="100%">
            <SkeletonText noOfLines={2} gap={2} />
            <SkeletonText noOfLines={1} width="60%" />
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4
}) => {
  return (
    <Box>
      {/* Header */}
      <HStack gap={4} mb={4}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="20px" flex={1} />
        ))}
      </HStack>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <HStack key={rowIndex} gap={4} mb={2}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="16px" flex={1} />
          ))}
        </HStack>
      ))}
    </Box>
  );
};

// Import HStack for SkeletonTable
import { HStack } from '@chakra-ui/react'; 