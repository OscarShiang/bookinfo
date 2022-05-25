import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, Center, Stack } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'

const Hello = () => {
  return (
    <Center>
    <Stack direction='row' spacing={4} align='center'>
      <Button colorScheme='teal' variant='solid'>
        Button
      </Button>
      <Button colorScheme='teal' variant='outline'>
        Button
      </Button>
      <Button colorScheme='teal' variant='ghost'>
        Button
      </Button>
      <Button colorScheme='teal' variant='link'>
        Button
      </Button>
    </Stack>
    </Center>
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
