import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const BuildEntryTable = ({ build }) => {
    return (
        <>
            <style>
                {`
                    .table-container {
                        overflow-x: auto;
                    }
                    .styled_table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .styled_table th, 
                    .styled_table td {
                        padding: 8px;
                        text-align: left;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        border: 1px solid #EFFFFD; 
                    }
                    .styled_table th {
                        background-color: #ECF9FF;
                    }
                `}
            </style>
            <div className="table-container">
                <Table className="styled_table" variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Application ID</Th>
                            <Th>Deployed On</Th>
                            <Th>Version</Th>
                            <Th>Media</Th>
                            <Th>Updated At</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>{build.appId}</Td>
                            <Td>{build.deployedOn}</Td>
                            <Td>{build.versionName}</Td>
                            <Td>{build.mediaLink}</Td>
                            <Td>{new Date(build.updatedAt).toLocaleDateString()}</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </div>
        </>
    );
};

export default BuildEntryTable;
