import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {  FaRegFilePdf } from "react-icons/fa";


const ExportToPdf = ({ reports, users = [] }) => {
    const getUserNameById = (userId) => {
        if (!users) return 'Unknown'; // Add a safeguard in case users is undefined
        const user = users.find(user => user.id === userId);
        return user ? user.userName : 'Unknown';
    };

    const handleExport = () => {
        const doc = new jsPDF();
        const tableColumn = ["Task", "Created By", "Status", "Created At"];
        const tableRows = reports.map(report => [
            report.taskName,
            getUserNameById(report.userId),
            report.status,
            new Date(report.createdAt).toLocaleDateString(),
        ]);

        doc.autoTable(tableColumn, tableRows, { startY: 20 });
        doc.save('daily_reports.pdf');
    };

    return (
        <Button onClick={handleExport} 
        colorScheme="blue" 
        variant="outline"
        leftIcon={<FaRegFilePdf />}>
            Export to PDF
        </Button>
    );
};

// Adding PropTypes for validation
ExportToPdf.propTypes = {
    reports: PropTypes.array.isRequired,
    users: PropTypes.array 
};

export default ExportToPdf;
