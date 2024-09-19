import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react';

const FilteredTable = ({ data }) => {
    return (
        <Table variant="simple">
            <TableCaption>Filtered Results</TableCaption>
            <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Type</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map(item => (
                    <Tr key={item.id}>
                        <Td>{item.id}</Td>
                        <Td>{item.taskName || item.tagName || item.sectionName}</Td>
                        <Td>{item.taskName ? 'Task' : item.tagName ? 'Tag' : 'Section'}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default FilteredTable;
