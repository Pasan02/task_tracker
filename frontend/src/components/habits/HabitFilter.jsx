import React from 'react';
import styled from 'styled-components';
import { Button } from '../common';

const FilterContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 120px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: white;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
`;

const HabitFilter = ({ 
  filters, 
  categories = [], 
  onFilterChange, 
  onClearFilters 
}) => {
  return (
    <FilterContainer>
      <FilterRow>
        <FilterGroup>
          <Label>Frequency</Label>
          <Select
            value={filters.frequency}
            onChange={(e) => onFilterChange({ frequency: e.target.value })}
          >
            <option value="all">All Frequencies</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Category</Label>
          <Select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Completed Today</Label>
          <Select
            value={filters.completedToday}
            onChange={(e) => onFilterChange({ completedToday: e.target.value })}
          >
            <option value="all">All Habits</option>
            <option value="yes">Completed Today</option>
            <option value="no">Not Completed</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Search</Label>
          <Input
            type="text"
            placeholder="Search habits..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </FilterGroup>

        <Button 
          variant="secondary" 
          size="small"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </FilterRow>
    </FilterContainer>
  );
};

export default HabitFilter;