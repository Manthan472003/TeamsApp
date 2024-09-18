import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaRegFilePdf } from "react-icons/fa";

const ExportToPDF = ({ data = [], columns, fileName, header }) => {
    const handleExport = () => {
        const doc = new jsPDF();

        // Add header if provided
        if (header) {
            doc.setFontSize(18);
            doc.text(header, 14, 15); 
            doc.setFontSize(10);
            doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 25);
        }

        const tableRows = data.map(item => 
            columns.map(column => item[column.key] || 'Unknown')
        );

        doc.autoTable(columns.map(col => col.label), tableRows, { startY: header ? 40 : 20 });
        doc.save(fileName || 'document.pdf');
    };

    return (
        <Button 
            onClick={handleExport} 
            colorScheme="blue" 
            variant="outline"
            leftIcon={<FaRegFilePdf />}
        >
            Export to PDF
        </Button>
    );
};

ExportToPDF.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    fileName: PropTypes.string,
    header: PropTypes.string,
};

export default ExportToPDF;
