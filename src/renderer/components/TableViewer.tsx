import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';

export default function TableViewer(props) {
  return (
    <TableContainer bgColor="white" borderRadius="md">
      <Table>
        <Thead>
          <Tr>
            {props.table.length > 0
              ? Object.keys(props.table[0]).map((k) => <Th>{k}</Th>)
              : Object.keys(props.table).map((k) => <Th>{k}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {props.table.map((row) => {
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
  );
}
