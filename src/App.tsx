import AppRoutes from './presentation/routes/app-routes';
import { Provider as ChakraProvider } from '@ui/chakra/provider';
import { Toaster } from '@ui/chakra/toaster';

function App() {
  return (
    <ChakraProvider>
      <AppRoutes />
      <Toaster />
    </ChakraProvider>
  );
}

export default App;
