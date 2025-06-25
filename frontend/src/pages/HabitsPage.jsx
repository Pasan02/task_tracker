import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  CountBadge,
  HeaderActions,
  ViewToggle,
  ViewButton,
  StatsBar,
  StatItem,
  StatNumber,
  StatLabel,
  ContentContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyMessage,
  ErrorContainer
} from '../styles/PageStyles';
import HabitList from '../components/habits/HabitList';
import useHabits from '../hooks/useHabits';
import { useApp } from '../context/AppContext';
import { Button, Loading } from '../components/common';
import HabitForm from '../components/habits/HabitForm';
import { formatDateForInput } from '../utils/dateHelpers';

// Habit page specific styled components
const TodaySection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const TodayTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TodayHabits = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr; // Single column on very small screens
  }
`;

const TodayHabitCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
`;

const HabitName = styled.span`
  font-weight: 500;
`;

const CheckButton = styled.button`
  width: 32px;
  height: 32px;
  border: 2px solid ${props => props.$completed ? '#10b981' : 'rgba(255, 255, 255, 0.5)'};
  border-radius: 50%;
  background: ${props => props.$completed ? '#10b981' : 'transparent'};
  color: ${props => props.$completed ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #10b981;
    background: ${props => props.$completed ? '#059669' : 'rgba(16, 185, 129, 0.2)'};
  }
`;

const FilterContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    & > button {
      margin-top: 8px;
      width: 100%;
    }
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
  
  @media (max-width: 768px) {
    min-width: 100px;
  }
  
  @media (max-width: 480px) {
    flex-grow: 1;
    width: calc(50% - 4px);
  }
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
  transition: border-color 0.2s ease;
  
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
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const HabitsPage = ({ initialFilter }) => {
  const [currentView, setCurrentView] = useState('list');
  const [editingHabit, setEditingHabit] = useState(null);

  const {
    habits,
    allHabits,
    loading,
    error,
    stats,
    categories,
    filters,
    updateFilters,
    clearFilters,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getTodayCompletedHabits,
    getTodayPendingHabits,
    getHabitsByFrequency,
    clearError
  } = useHabits();

  const {
    setActiveRoute,
    openConfirmDialog,
    closeConfirmDialog,
    openHabitForm
  } = useApp();

  // Set active route when component mounts
  useEffect(() => {
    // Log the received filter for debugging
    console.log('HabitsPage initialFilter:', initialFilter);
    
    // Set active route based on filter
    const route = initialFilter === 'today' ? '/habits/today' : '/habits';
    setActiveRoute(route);
    
    // Apply initial filter if provided
    if (initialFilter === 'today') {
      // Apply filter to show only habits NOT completed today
      updateFilters({ completedToday: 'no' });
    } else {
      // Clear filters for regular habits page
      clearFilters();
    }
  }, [initialFilter, setActiveRoute]); // Add setActiveRoute to dependencies

  const today = formatDateForInput(new Date());
  const todayCompleted = getTodayCompletedHabits();
  const todayPending = getTodayPendingHabits();

  // Event handlers
  const handleCreateHabit = () => {
    // Use the AppContext openHabitForm instead of local state
    openHabitForm();
  };

  const handleEditHabit = (habit) => {
    // Use the AppContext to open form with the habit
    openHabitForm(habit);
  };

  const handleDeleteHabit = (habitId) => {
    const habit = allHabits.find(h => h.id === habitId);
    openConfirmDialog({
      title: 'Delete Habit',
      message: `Are you sure you want to delete "${habit?.title}"? This will also delete all completion records.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteHabit(habitId);
          closeConfirmDialog();
        } catch (error) {
          console.error('Failed to delete habit:', error);
        }
      },
      onCancel: closeConfirmDialog
    });
  };

  const handleToggleCompletion = async (habitId, dateString) => {
    try {
      await toggleHabitCompletion(habitId, dateString);
    } catch (error) {
      console.error('Failed to toggle habit completion:', error);
    }
  };

  const handleTodayToggle = (habitId) => {
    handleToggleCompletion(habitId, today);
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleRetry = () => {
    clearError();
  };

  // Calculate stats for display
  const habitStats = {
    total: allHabits.length,
    daily: getHabitsByFrequency('daily').length,
    weekly: getHabitsByFrequency('weekly').length,
    completedToday: todayCompleted.length,
    pendingToday: todayPending.length,
    completionRate: stats.completionRate
  };

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>
            🎯 Habits
            <CountBadge>{habitStats.total}</CountBadge>
          </PageTitle>
        </div>
        
        <HeaderActions>
          <ViewToggle>
            <ViewButton 
              $active={currentView === 'list'}
              onClick={() => setCurrentView('list')}
            >
              📄 List
            </ViewButton>
            <ViewButton 
              $active={currentView === 'calendar'}
              onClick={() => setCurrentView('calendar')}
            >
              📅 Calendar
            </ViewButton>
          </ViewToggle>
          
          <Button 
            variant="primary" 
            onClick={handleCreateHabit}
          >
            ➕ Add Habit
          </Button>
        </HeaderActions>
      </PageHeader>

      {error && (
        <ErrorContainer>
          <span>⚠️ {error}</span>
          <Button size="small" variant="secondary" onClick={handleRetry}>
            Retry
          </Button>
        </ErrorContainer>
      )}

      <StatsBar>
        <StatItem>
          <StatNumber $color="#6b7280">{habitStats.total}</StatNumber>
          <StatLabel>Total</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber $color="#16a34a">{habitStats.completedToday}</StatNumber>
          <StatLabel>Done Today</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber $color="#d97706">{habitStats.pendingToday}</StatNumber>
          <StatLabel>Pending</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber $color="#0369a1">{habitStats.daily}</StatNumber>
          <StatLabel>Daily</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber $color="#7c3aed">{habitStats.weekly}</StatNumber>
          <StatLabel>Weekly</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber $color="#dc2626">{habitStats.completionRate}%</StatNumber>
          <StatLabel>Success Rate</StatLabel>
        </StatItem>
      </StatsBar>

      {allHabits.length > 0 && (
        <TodaySection>
          <TodayTitle>Today's Habits</TodayTitle>
          {allHabits.length === 0 ? (
            <EmptyMessage style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              No habits created yet. Create your first habit to start tracking!
            </EmptyMessage>
          ) : (
            <TodayHabits>
              {allHabits.map(habit => {
                const isCompleted = habit.completions?.includes(today) || false;
                return (
                  <TodayHabitCard key={habit.id}>
                    <HabitName>{habit.title}</HabitName>
                    <CheckButton
                      $completed={isCompleted}
                      onClick={() => handleTodayToggle(habit.id)}
                    >
                      {isCompleted ? '✓' : ''}
                    </CheckButton>
                  </TodayHabitCard>
                );
              })}
            </TodayHabits>
          )}
        </TodaySection>
      )}

      <ContentContainer>
        <FilterContainer>
          <FilterRow>
            <FilterGroup>
              <Label>Frequency</Label>
              <Select
                value={filters.frequency}
                onChange={(e) => handleFilterChange({ frequency: e.target.value })}
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
                onChange={(e) => handleFilterChange({ category: e.target.value })}
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
                onChange={(e) => handleFilterChange({ completedToday: e.target.value })}
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
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
            </FilterGroup>

            <Button 
              variant="secondary" 
              size="small"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </FilterRow>
        </FilterContainer>

        {loading && habits.length === 0 ? (
          <Loading message="Loading habits..." />
        ) : habits.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🎯</EmptyIcon>
            <EmptyTitle>No Habits Found</EmptyTitle>
            <EmptyMessage>
              {allHabits.length === 0 
                ? "You haven't created any habits yet. Create your first habit to start tracking!"
                : "No habits match your current filters. Try adjusting your filters or clearing them."
              }
            </EmptyMessage>
            {allHabits.length === 0 ? (
              <Button variant="primary" onClick={handleCreateHabit}>
                Create Your First Habit
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </EmptyState>
        ) : (
          <HabitList
            habits={habits}
            loading={loading}
            onEdit={handleEditHabit}
            onDelete={handleDeleteHabit}
            onToggleCompletion={handleToggleCompletion}
            emptyMessage="No habits match your current filters"
          />
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default HabitsPage;