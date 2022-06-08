import { IconButton, Stack, Table, TableContainer, Tbody, Td, Textarea, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { FaCheck } from 'react-icons/fa';

export default function SQLCmd() {
    const [labels, setLabels] = useState(['test', 'data']);

    const toast = useToast();
    function addInfo() {
        setLabels([...labels, 'test']);
        toast({ description: 'test content' });
    };

    return <Stack direction='column'>
        <Stack direction='row'>
            <Textarea backgroundColor='white' placeholder='Enter a SQL Command' />
            <IconButton colorScheme='cyan' icon={<FaCheck color="white" />} size='md' aria-label='Execute' onClick={ addInfo } />
        </Stack>
        <TableContainer bgColor='white' borderRadius='md'>
        <Table>
            <Thead>
            <Tr>
                {labels.map((c) => (
                <Th>{c}</Th>
                ))}
            </Tr>
            </Thead>
            <Tbody>
            <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
                <Td>feet</Td>
                <Td>centimetres (cm)</Td>
                <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
                <Td>yards</Td>
                <Td>metres (m)</Td>
                <Td isNumeric>0.91444</Td>
            </Tr>
            </Tbody>
        </Table>
        </TableContainer>
    </Stack>
};