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
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SearchInput = styled(Input)`
  min-width: 200px;
  
  @media (max-width: 480px) {
    min-width: 100%;
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 8px;
  }
`;

const TaskFilter = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  categories = [] 
}) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'all'
  );

  return (
    <FilterContainer>
      <FilterRow>
        <FilterGroup>
          <Label htmlFor="search">Search</Label>
          <SearchInput
            id="search"
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            value={filters.priority || 'all'}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </FilterGroup>

        {categories.length > 0 && (
          <FilterGroup>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={filters.category || 'all'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FilterGroup>
        )}
      </FilterRow>

      <FilterRow>
        <FilterGroup>
          <Label htmlFor="sortBy">Sort By</Label>
          <Select
            id="sortBy"
            value={filters.sortBy || 'dueDate'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
            <option value="createdAt">Created Date</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label htmlFor="sortOrder">Order</Label>
          <Select
            id="sortOrder"
            value={filters.sortOrder || 'asc'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </FilterGroup>

        <FilterActions>
          {hasActiveFilters && (
            <Button
              size="small"
              variant="secondary"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </FilterActions>
      </FilterRow>
    </FilterContainer>
  );
};

export default TaskFilter;