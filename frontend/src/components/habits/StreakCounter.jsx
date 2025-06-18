import React from 'react';
import styled from 'styled-components';

const StreakContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: #fef3c7;
  border-radius: 12px;
  font-size: 0.875rem;
`;

const StreakIcon = styled.span`
  font-size: 1rem;
`;

const StreakText = styled.span`
  font-weight: 500;
  color: #92400e;
`;

const StreakCounter = ({ completions = [], frequency = 'daily' }) => {
  const calculateCurrentStreak = () => {
    if (completions.length === 0) return 0;

    const today = new Date();
    const sortedCompletions = completions
      .map(date => new Date(date))
      .sort((a, b) => b - a);

    let streak = 0;
    let currentDate = new Date(today);
    
    // For daily habits, check consecutive days
    if (frequency === 'daily') {
      // Start checking from today, or yesterday if today isn't completed
      const todayString = today.toISOString().split('T')[0];
      const isTodayCompleted = completions.includes(todayString);
      
      if (!isTodayCompleted) {
        currentDate.setDate(currentDate.getDate() - 1);
      }

      while (currentDate >= sortedCompletions[sortedCompletions.length - 1]) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (completions.includes(dateString)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      // For weekly habits, check consecutive weeks
      const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
      };

      const currentWeekStart = getWeekStart(today);
      const weekCompletions = completions.map(date => {
        const weekStart = getWeekStart(new Date(date));
        return weekStart.toISOString().split('T')[0];
      });

      const uniqueWeeks = [...new Set(weekCompletions)].sort().reverse();

      let checkWeek = new Date(currentWeekStart);
      for (const weekString of uniqueWeeks) {
        const weekStart = new Date(weekString);
        if (weekStart.getTime() === checkWeek.getTime()) {
          streak++;
          checkWeek.setDate(checkWeek.getDate() - 7);
        } else {
          break;
        }
      }
    }

    return streak;
  };

  const currentStreak = calculateCurrentStreak();

  const getStreakIcon = () => {
    if (currentStreak === 0) return '⭕';
    if (currentStreak < 3) return '🔥';
    if (currentStreak < 7) return '🚀';
    if (currentStreak < 30) return '⭐';
    return '👑';
  };

  const getStreakText = () => {
    if (currentStreak === 0) {
      return 'No streak';
    }
    
    const unit = frequency === 'daily' ? 'day' : 'week';
    const unitPlural = currentStreak === 1 ? unit : `${unit}s`;
    
    return `${currentStreak} ${unitPlural}`;
  };

  return (
    <StreakContainer>
      <StreakIcon>{getStreakIcon()}</StreakIcon>
      <StreakText>{getStreakText()}</StreakText>
    </StreakContainer>
  );
};

export default StreakCounter;