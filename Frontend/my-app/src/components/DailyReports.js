import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Table, Th, Tbody, Thead, Tr, Td } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import AddDailyReportModal from './AddDailyReportModal';
import { getAllReports } from '../Services/DailyReportsService';

const DailyReports = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [reports, setReports] = useState([]);

    const fetchReports = async () => {
        try {
            const data = await getAllReports();
            setReports(data);
        } catch (error) {
            console.error('Error fetching daily reports:', error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (

        <Box p={5}>
            <Heading as='h2' size='xl' paddingLeft={3} color={'#086F83'}>
                Daily Reports
            </Heading>
            <br />
            <Button onClick={onOpen} colorScheme='teal' variant='outline' mt={3} mb={4}>
                Add Daily Report
            </Button>
            <AddDailyReportModal
                isOpen={isOpen}
                onClose={onClose}
            />

            <Box mt={6} width="100%">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th  width='50%' >Task</Th>
                            <Th width='25%'>Status</Th>
                            <Th width='25%'>Ceated at</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {reports.map((report,index) => (
                            <Tr key={report.id} 
                            style={{
                                backgroundColor: index %2 === 0 ? '#EDF2F7' : '#d7f2ff'
                            }}>
                                <Td>{report.taskName}</Td>
                                <Td>{report.status}</Td>
                                <Td>{report.CeatedAt}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default DailyReports;