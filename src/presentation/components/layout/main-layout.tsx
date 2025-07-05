import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Flex, Drawer, useDisclosure } from '@chakra-ui/react';
import { Header } from './header';
import { Sidebar } from './sidebar';

export const MainLayout: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();
  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar (desktop) */}
      <Sidebar />
      {/* Drawer (mobile) */}
      <Drawer.Root placement="start" open={open} onOpenChange={(open) => !open && onClose()} >
                <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content p={0}>
          <Sidebar isDrawer />
                  </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
      
      {/* Main Content */}
      <Flex direction="column" flex="1" overflow="hidden">
        {/* Header */}
        <Header onOpenSidebar={onOpen} />
        
        {/* Page Content */}
        <Box
          flex="1"
          overflow="auto"
          p={6}
          bg="gray.50"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout; 