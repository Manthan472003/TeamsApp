import React, { useState } from 'react';
import { Box, Select, FormControl, FormLabel, Button, HStack, Input } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFilter } from "react-icons/fa";
import { useColorModeValue } from '@chakra-ui/react';

const FilterComponent = ({ filter, onFilterChange }) => {
    const [selectedFilter, setSelectedFilter] = useState(filter.type || '');
    const [startDate, setStartDate] = useState(filter.startDate || null);
    const [endDate, setEndDate] = useState(filter.endDate || null);

    const handleFilterChange = () => {
        onFilterChange({
            type: selectedFilter,
            startDate,
            endDate
        });
    };

    // Define styling for the DatePicker input using Chakra UI's theme
    const datePickerStyle = {
        as: Input,
        border: '1px solid',
        borderColor: useColorModeValue('gray.300', 'gray.600'),
        padding: '0.4rem',
        borderRadius: 'md',
        _hover: {
            borderColor: useColorModeValue('blue.400', 'blue.600'),
        },
        _focus: {
            outline: 'none',
            borderColor: useColorModeValue('blue.500', 'blue.700'),
            boxShadow: useColorModeValue('0 0 0 1px blue.500', '0 0 0 1px blue.700'),
        }
    };

    return (
        <Box mb={4}>
            <HStack mb={3} spacing={4}>
                <FormControl>
                    <FormLabel>Filter By</FormLabel>
                    <Select
                        placeholder="Select filter type"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="day">Day Wise</option>
                        <option value="month">Month Wise</option>
                        <option value="dateRange">Date Range</option>
                    </Select>
                </FormControl>

<Button
    px={10}
    mt={7}  
    colorScheme="blue"
    onClick={handleFilterChange}
    leftIcon={<FaFilter />}
>
    Apply Filter
</Button>

            </HStack>

            {selectedFilter === 'dateRange' && (
                <HStack mb={3} > {/* Reduced spacing */}
                    <FormControl >
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select start date"
                            customInput={<Input {...datePickerStyle} />}
                        />
                    </FormControl>
                    <FormControl mr={1200}>
                        <FormLabel>End Date</FormLabel>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select end date"
                            customInput={<Input {...datePickerStyle} />}
                        />
                    </FormControl>
                </HStack>
            )}

            {selectedFilter === 'day' && (
                <FormControl mb={3}>
                    <FormLabel>Select Date</FormLabel>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select date"
                        customInput={<Input {...datePickerStyle} />}
                    />
                </FormControl>
            )}

            {selectedFilter === 'month' && (
                <FormControl mb={3}>
                    <FormLabel>Select Month</FormLabel>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM"
                        showMonthYearPicker
                        placeholderText="Select month"
                        customInput={<Input {...datePickerStyle} />}
                    />
                </FormControl>
            )}
        </Box>
    );
};

export default FilterComponent;
