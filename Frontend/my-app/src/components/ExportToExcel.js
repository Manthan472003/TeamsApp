import React from 'react';
import { Button } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaRegFileExcel } from "react-icons/fa";


const ExportToExcel = ({ reports }) => {
    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(reports);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'daily_reports.xlsx');
    };

    return (
        <Button onClick={handleExport} 
        colorScheme="blue" 
        variant="outline"
        leftIcon={<FaRegFileExcel />}>
            Export to Excel
        </Button>
    );
};

export default ExportToExcel;
