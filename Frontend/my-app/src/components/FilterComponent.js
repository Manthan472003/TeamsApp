import React, { useState } from 'react';
import { Box, Select, FormControl, FormLabel, Button, Flex, HStack, Input } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaFilter, } from "react-icons/fa";
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
                <HStack mb={3} >
                    <FormControl >
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="YYYY-MM-DD"
                            customInput={<Input {...datePickerStyle} />}
                        />
                    </FormControl>
                    <FormControl mr={1200}>
                        <FormLabel>End Date</FormLabel>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="YYYY-MM-DD"
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
                        placeholderText="YYYY-MM-DD"
                        customInput={<Input {...datePickerStyle} />}
                    />
                </FormControl>
            )}

            {selectedFilter === 'month' && (
                <FormControl mb={3}>
                    <FormLabel>Select Month and Year</FormLabel>
                    <Flex>
                        <Select
                            value={startDate ? startDate.getMonth() + 1 : ''}
                            onChange={(e) => {
                                const month = parseInt(e.target.value, 10);
                                setStartDate(new Date(startDate ? startDate.getFullYear() : new Date().getFullYear(), month - 1));
                            }}
                            placeholder="Select month"
                            mr={3}
                        >
                            {Array.from({ length: 12 }, (_, index) => (
                                <option key={index} value={index + 1}>
                                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </Select>
                        <Select
                        mr={1165}
                            value={startDate ? startDate.getFullYear() : ''}
                            onChange={(e) => {
                                const year = parseInt(e.target.value, 10);
                                setStartDate(new Date(year, startDate ? startDate.getMonth() : 0));
                            }}
                            placeholder="Select year"
                        >
                            {Array.from({ length: 10 }, (_, index) => {
                                const year = new Date().getFullYear() - index;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            }).reverse()} 
                        </Select>
                    </Flex>
                </FormControl>
            )}

        </Box>
    );
};

export default FilterComponent;
