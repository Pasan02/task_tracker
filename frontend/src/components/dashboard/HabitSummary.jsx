import React from 'react';
import styled from 'styled-components';
import { Button } from '../common';

const SummaryCard = styled.div`
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
`;

const AddButton = styled.button`
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-primary-500);
    color: var(--color-primary-500);
    background-color: var(--color-hover);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-5);
`;

const StatItem = styled.div`
  text-align: center;
  padding: var(--space-4);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.$bgColor || 'var(--color-surface)'};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatNumber = styled.div`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: ${props => props.$color || 'var(--color-text-primary)'};
  margin-bottom: var(--space-1);
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
`;

const TodayHabits = styled.div`
  margin-top: var(--space-5);
`;

const SectionTitle = styled.h4`
  margin: 0 0 var(--space-3) 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
`;

const HabitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const HabitItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-primary-300);
    background-color: var(--color-hover);
  }
`;

const HabitName = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
`;

const CheckButton = styled.button`
  width: 24px;
  height: 24px;
  border: 2px solid ${props => props.$completed ? 'var(--color-success)' : 'var(--color-border)'};
  border-radius: 50%;
  background: ${props => props.$completed ? 'var(--color-success)' : 'white'};
  color: ${props => props.$completed ? 'white' : 'var(--color-text-secondary)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-success);
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const StreakInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 12px;
  background-color: var(--color-warning);
  border-radius: 6px;
`;

const StreakItem = styled.div`
  text-align: center;
`;

const StreakNumber = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #92400e;
`;

const StreakLabel = styled.div`
  font-size: 0.75rem;
  color: #92400e;
  text-transform: uppercase;
`;

const HabitSummary = ({ habits = [], onCreateHabit, onToggleCompletion }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const totalHabits = habits.length;
  const activeHabits = habits.filter(habit => habit.frequency).length;
  
  const todayCompletions = habits.filter(habit => 
    habit.completions && habit.completions.includes(today)
  ).length;
  
  const todayCompletionRate = totalHabits > 0 
    ? Math.round((todayCompletions / totalHabits) * 100) 
    : 0;

  // Calculate best streak across all habits
  const calculateBestStreak = () => {
    let bestStreak = 0;
    
    habits.forEach(habit => {
      if (!habit.completions || habit.completions.length === 0) return;
      
      const sortedDates = habit.completions
        .map(date => new Date(date))
        .sort((a, b) => a - b);

      let currentStreak = 1;
      let maxStreak = 1;

      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = sortedDates[i - 1];
        const currentDate = sortedDates[i];
        const daysDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

        if (daysDiff === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }

      bestStreak = Math.max(bestStreak, maxStreak);
    });
    
    return bestStreak;
  };

  const bestStreak = calculateBestStreak();
  const totalCompletions = habits.reduce((sum, habit) => 
    sum + (habit.completions ? habit.completions.length : 0), 0
  );

  const handleHabitToggle = (habitId) => {
    onToggleCompletion(habitId, today);
  };

  return (
    <SummaryCard>
      <CardHeader>
        <CardTitle>🎯 Habit Tracker</CardTitle>
        <AddButton onClick={onCreateHabit}>
          + Add Habit
        </AddButton>
      </CardHeader>

      <StatsGrid>
        <StatItem $bgColor="#f0f9ff">
          <StatNumber $color="#0369a1">{totalHabits}</StatNumber>
          <StatLabel>Total Habits</StatLabel>
        </StatItem>
        
        <StatItem $bgColor="#dcfce7">
          <StatNumber $color="#16a34a">{todayCompletions}</StatNumber>
          <StatLabel>Done Today</StatLabel>
        </StatItem>
        
        <StatItem $bgColor="#fef3c7">
          <StatNumber $color="#d97706">{todayCompletionRate}%</StatNumber>
          <StatLabel>Today's Rate</StatLabel>
        </StatItem>
        
        <StatItem $bgColor="#fdf2f8">
          <StatNumber $color="#be185d">{bestStreak}</StatNumber>
          <StatLabel>Best Streak</StatLabel>
        </StatItem>
      </StatsGrid>

      {totalHabits > 0 && (
        <StreakInfo>
          <StreakItem>
            <StreakNumber>{totalCompletions}</StreakNumber>
            <StreakLabel>Total Completions</StreakLabel>
          </StreakItem>
          <StreakItem>
            <StreakNumber>{todayCompletions}/{totalHabits}</StreakNumber>
            <StreakLabel>Today Progress</StreakLabel>
          </StreakItem>
        </StreakInfo>
      )}

      <TodayHabits>
        <SectionTitle>Today's Habits</SectionTitle>
        {totalHabits === 0 ? (
          <EmptyState>
            No habits created yet. Create your first habit to start tracking!
          </EmptyState>
        ) : (
          <HabitsList>
            {habits.map(habit => {
              const isCompleted = habit.completions && habit.completions.includes(today);
              return (
                <HabitItem key={habit.id}>
                  <HabitName>{habit.title}</HabitName>
                  <CheckButton
                    $completed={isCompleted}
                    onClick={() => handleHabitToggle(habit.id)}
                  >
                    {isCompleted ? '✓' : ''}
                  </CheckButton>
                </HabitItem>
              );
            })}
          </HabitsList>
        )}
      </TodayHabits>
    </SummaryCard>
  );
};

export default HabitSummary;