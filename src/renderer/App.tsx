import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import SQLCmd from './views/SQLCmd';

import SimpleSidebar from './components/sidebar';
import Monitor from './views/Monitor';

const MainContent = () => {
  return (
    <Routes>
      <Route path="index.html" element={<Navigate replace to="/monitor" />} />
      <Route path="/monitor" element={<Monitor />} />
      <Route path="/sqlcmd" element={<SQLCmd />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <SimpleSidebar children={<MainContent />} />
      </BrowserRouter>
    </ChakraProvider>
  );
}
