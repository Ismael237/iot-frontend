import React from 'react';
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Spinner,
  Center
} from '@chakra-ui/react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  hoverable?: boolean;
  striped?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  hoverable = false,
  striped = false,
  size = 'md'
}: TableProps<T>) => {
  const getCellValue = (column: Column<T>, row: T, index: number) => {
    if (column.render) {
      return column.render(row[column.key as keyof T], row, index);
    }
    return row[column.key as keyof T];
  };

  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (data.length === 0) {
    return (
      <Center py={8}>
        <Text color="gray.500">{emptyMessage}</Text>
      </Center>
    );
  }

  return (
    <TableContainer>
      <ChakraTable size={size} variant={striped ? 'striped' : 'simple'}>
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th
                key={String(column.key)}
                width={column.width}
                textAlign={column.align || 'left'}
              >
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => (
            <Tr
              key={index}
              onClick={() => onRowClick?.(row, index)}
              cursor={onRowClick ? 'pointer' : 'default'}
              _hover={hoverable ? { bg: 'gray.50' } : undefined}
            >
              {columns.map((column) => (
                <Td
                  key={String(column.key)}
                  textAlign={column.align || 'left'}
                >
                  {getCellValue(column, row, index)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
}; 