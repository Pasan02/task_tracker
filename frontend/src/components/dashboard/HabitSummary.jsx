import React from 'react';
import styled from 'styled-components';
import { Button } from '../common';

const SummaryCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const AddButton = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  color: #6b7280;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.$bgColor || '#f9fafb'};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.$color || '#111827'};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const TodayHabits = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`;

const HabitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HabitItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
`;

const HabitName = styled.span`
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
`;

const CheckButton = styled.button`
  width: 24px;
  height: 24px;
  border: 2px solid ${props => props.$completed ? '#10b981' : '#d1d5db'};
  border-radius: 50%;
  background: ${props => props.$completed ? '#10b981' : 'white'};
  color: ${props => props.$completed ? 'white' : '#6b7280'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #10b981;
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: #6b7280;
  font-size: 0.875rem;
`;

const StreakInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 12px;
  background-color: #fef3c7;
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