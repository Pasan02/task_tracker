import React, { useState } from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: #6b7280;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MonthTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  min-width: 120px;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  background-color: #f9fafb;
  padding: 8px 4px;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
`;

const DayCell = styled.button`
  background-color: ${props => {
    if (props.$isToday) return '#dbeafe';
    if (props.$isCompleted) return '#dcfce7';
    if (props.$isCurrentMonth) return 'white';
    return '#f9fafb';
  }};
  border: none;
  padding: 8px 4px;
  min-height: 36px;
  cursor: ${props => props.$isCurrentMonth ? 'pointer' : 'default'};
  color: ${props => {
    if (!props.$isCurrentMonth) return '#d1d5db';
    if (props.$isToday) return '#1d4ed8';
    if (props.$isCompleted) return '#16a34a';
    return '#374151';
  }};
  font-size: 0.875rem;
  font-weight: ${props => props.$isToday ? '600' : '400'};
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: ${props => {
      if (!props.$isCurrentMonth) return '#f9fafb';
      if (props.$isCompleted) return '#bbf7d0';
      return '#f3f4f6';
    }};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const CompletionDot = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #16a34a;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 12px;
  font-size: 0.75rem;
  color: #6b7280;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: ${props => props.$color};
`;

const HabitCalendar = ({ habit, onToggleDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const completions = new Set(habit.completions || []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day)
      });
    }

    // Next month's days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day)
      });
    }

    return days;
  };

  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    return formatDateForComparison(date) === formatDateForComparison(today);
  };

  const isCompleted = (date) => {
    return completions.has(formatDateForComparison(date));
  };

  const isFutureDate = (date) => {
    return date > today;
  };

  const handleDateClick = (day) => {
    if (!day.isCurrentMonth || isFutureDate(day.fullDate)) {
      return;
    }
    
    const dateString = formatDateForComparison(day.fullDate);
    onToggleDate(habit.id, dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const canNavigateNext = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    return nextMonth <= today;
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthNavigation>
          <NavButton onClick={() => navigateMonth(-1)}>
            ‹
          </NavButton>
          <MonthTitle>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </MonthTitle>
          <NavButton 
            onClick={() => navigateMonth(1)}
            disabled={!canNavigateNext()}
          >
            ›
          </NavButton>
        </MonthNavigation>
      </CalendarHeader>

      <CalendarGrid>
        {dayNames.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        
        {days.map((day, index) => (
          <DayCell
            key={index}
            $isCurrentMonth={day.isCurrentMonth}
            $isToday={isToday(day.fullDate)}
            $isCompleted={isCompleted(day.fullDate)}
            onClick={() => handleDateClick(day)}
            disabled={!day.isCurrentMonth || isFutureDate(day.fullDate)}
          >
            {day.date}
            {isCompleted(day.fullDate) && <CompletionDot />}
          </DayCell>
        ))}
      </CalendarGrid>

      <Legend>
        <LegendItem>
          <LegendDot $color="#dcfce7" />
          <span>Completed</span>
        </LegendItem>
        <LegendItem>
          <LegendDot $color="#dbeafe" />
          <span>Today</span>
        </LegendItem>
        <LegendItem>
          <LegendDot $color="white" />
          <span>Available</span>
        </LegendItem>
      </Legend>
    </CalendarContainer>
  );
};

export default HabitCalendar;