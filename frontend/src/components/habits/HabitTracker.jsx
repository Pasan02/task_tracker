import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../common';

const TrackerContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
`;

const TrackerHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
`;

const TrackerTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  background-color: #f3f4f6;
  border-radius: 6px;
  padding: 2px;
`;

const ToggleButton = styled.button`
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  color: ${props => props.$active ? '#111827' : '#6b7280'};
  font-weight: ${props => props.$active ? '500' : '400'};
  box-shadow: ${props => props.$active ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'};
  transition: all 0.2s ease;
  
  &:hover {
    color: #111827;
  }
`;

const WeeklyView = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

const DayColumn = styled.div`
  text-align: center;
`;

const DayLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const DayDate = styled.div`
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 8px;
`;

const CheckButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid ${props => props.$completed ? '#10b981' : '#d1d5db'};
  border-radius: 50%;
  background: ${props => props.$completed ? '#10b981' : 'white'};
  color: ${props => props.$completed ? 'white' : '#6b7280'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #10b981;
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StreakInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 6px;
  margin-top: 16px;
`;

const StreakItem = styled.div`
  text-align: center;
`;

const StreakNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const StreakLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const HabitTracker = ({ habit, onToggleCompletion, view = 'weekly' }) => {
  const [currentView, setCurrentView] = useState(view);
  
  const today = new Date();
  const completions = new Set(habit.completions || []);

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isCompleted = (date) => {
    return completions.has(formatDateForComparison(date));
  };

  const isFutureDate = (date) => {
    return date > today;
  };

  const handleToggle = (date) => {
    if (isFutureDate(date)) return;
    
    const dateString = formatDateForComparison(date);
    onToggleCompletion(habit.id, dateString);
  };

  const calculateCurrentStreak = () => {
    const sortedCompletions = Array.from(completions)
      .map(date => new Date(date))
      .sort((a, b) => b - a);

    if (sortedCompletions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date(today);
    
    // Check if today is completed, if not start from yesterday
    if (!isCompleted(currentDate)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (currentDate >= sortedCompletions[sortedCompletions.length - 1]) {
      if (isCompleted(currentDate)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateBestStreak = () => {
    if (completions.size === 0) return 0;

    const sortedDates = Array.from(completions)
      .map(date => new Date(date))
      .sort((a, b) => a - b);

    let bestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currentDate = sortedDates[i];
      const daysDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

      if (daysDiff === 1) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return bestStreak;
  };

  const weekDays = getWeekDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentStreak = calculateCurrentStreak();
  const bestStreak = calculateBestStreak();

  if (currentView === 'weekly') {
    return (
      <TrackerContainer>
        <TrackerHeader>
          <TrackerTitle>Weekly Progress</TrackerTitle>
          <ViewToggle>
            <ToggleButton 
              $active={currentView === 'weekly'}
              onClick={() => setCurrentView('weekly')}
            >
              Week
            </ToggleButton>
            <ToggleButton 
              $active={currentView === 'monthly'}
              onClick={() => setCurrentView('monthly')}
            >
              Month
            </ToggleButton>
          </ViewToggle>
        </TrackerHeader>

        <WeeklyView>
          {weekDays.map((day, index) => (
            <DayColumn key={index}>
              <DayLabel>{dayNames[index]}</DayLabel>
              <DayDate>{day.getDate()}</DayDate>
              <CheckButton
                $completed={isCompleted(day)}
                onClick={() => handleToggle(day)}
                disabled={isFutureDate(day)}
              >
                {isCompleted(day) ? '✓' : ''}
              </CheckButton>
            </DayColumn>
          ))}
        </WeeklyView>

        <StreakInfo>
          <StreakItem>
            <StreakNumber>{currentStreak}</StreakNumber>
            <StreakLabel>Current Streak</StreakLabel>
          </StreakItem>
          <StreakItem>
            <StreakNumber>{bestStreak}</StreakNumber>
            <StreakLabel>Best Streak</StreakLabel>
          </StreakItem>
          <StreakItem>
            <StreakNumber>{completions.size}</StreakNumber>
            <StreakLabel>Total Days</StreakLabel>
          </StreakItem>
        </StreakInfo>
      </TrackerContainer>
    );
  }

  // Monthly view would return a calendar component
  return (
    <TrackerContainer>
      <TrackerHeader>
        <TrackerTitle>Monthly Progress</TrackerTitle>
        <ViewToggle>
          <ToggleButton 
            $active={currentView === 'weekly'}
            onClick={() => setCurrentView('weekly')}
          >
            Week
          </ToggleButton>
          <ToggleButton 
            $active={currentView === 'monthly'}
            onClick={() => setCurrentView('monthly')}
          >
            Month
          </ToggleButton>
        </ViewToggle>
      </TrackerHeader>
      
      <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
        Monthly view - Use the calendar in habit details for full monthly view
      </div>
    </TrackerContainer>
  );
};

export default HabitTracker;