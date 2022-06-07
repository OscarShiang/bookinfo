import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Link, VStack, Text, Flex, Box } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'

import SimpleSidebar from './components/sidebar'

const MainContent = () => {
  return (
    <Flex>
    <VStack spacing={4} align='center'>
      <Link>
        <Text>
          Icon
        </Text>
      </Link>
      <Link>
        <Text>
          SQL Commander
        </Text>
      </Link>
    </VStack><Box flex='1'>
        Text here
      </Box>
    </Flex>
  );
};

const Hello = () => {
  return (
    <Flex>
      <SimpleSidebar children={<MainContent />} />
    </Flex>
  );
};

export default function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
