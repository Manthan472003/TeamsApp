import React, { useState } from 'react';
import { Box, Select, FormControl, FormLabel, Button } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

  return (
    <Box mb={4}>
      <FormControl mb={3}>
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

      {selectedFilter === 'dateRange' && (
        <Box mb={3}>
          <FormControl mb={3}>
            <FormLabel>Start Date</FormLabel>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
            />
          </FormControl>
          <FormControl>
            <FormLabel>End Date</FormLabel>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
            />
          </FormControl>
        </Box>
      )}

      {selectedFilter === 'day' && (
        <FormControl mb={3}>
          <FormLabel>Select Date</FormLabel>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
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
          />
        </FormControl>
      )}

      <Button colorScheme="blue" onClick={handleFilterChange}>
        Apply Filter
      </Button>
    </Box>
  );
};

export default FilterComponent;