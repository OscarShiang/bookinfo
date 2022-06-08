import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'

import BookViewer from './views/BookViewer';
import SQLCmd from './views/SQLCmd';

import SimpleSidebar from './components/sidebar'

const MainContent = () => {
  return (
    <Routes>
      <Route path='index.html' element={<Navigate replace to='/bookviewer' />} />
      <Route path="/bookviewer" element={<BookViewer />} />
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
