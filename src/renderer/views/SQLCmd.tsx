import {
  IconButton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import db from '../sql';

export default function SQLCmd() {
  const [table, setTable] = useState([]);
  const [input, setInput] = useState('');
  const toast = useToast();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  function submit() {
    console.log(input);

    db.query(input).then((res) => {
      console.log(res);
      if (res.status === 'fail') {
        toast({
          description: 'Something went wrong',
          status: 'error',
          position: 'bottom-right',
          isClosable: true,
        });
      } else {
        setTable(res.data);
        toast({
          description: 'Success',
          position: 'bottom-right',
          isClosable: true,
        });
      }
    });
  }

  return (
    <Stack direction="column">
      <Stack direction="row">
        <Textarea
          backgroundColor="white"
          placeholder="Enter a SQL Command"
          onChange={handleInputChange}
        />
        <IconButton
          colorScheme="cyan"
          icon={<FaCheck color="white" />}
          size="md"
          aria-label="Execute"
          onClick={submit}
        />
      </Stack>
      <TableContainer bgColor="white" borderRadius="md">
        <Table>
          <Thead>
            <Tr>
              {table.length > 0
                ? Object.keys(table[0]).map((k) => <Th>{k}</Th>)
                : Object.keys(table).map((k) => <Th>{k}</Th>)}
            </Tr>
          </Thead>
          <Tbody>
            {table.map((row) => {
              const cells = [];
              const val = Object.values(row);
              console.log(row);
              for (let i = 0; i < val.length; i++) {
                console.log('push');
                cells.push(<Td>{val[i]}</Td>);
              }
              return <Tr> {cells} </Tr>;
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
