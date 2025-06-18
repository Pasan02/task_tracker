import React from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';

const SidebarContainer = styled.aside`
  width: 280px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 20px;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 64px;
  z-index: 50;
  transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  
  @media (min-width: 769px) {
    position: static;
    transform: none;
    transition: none;
  }
  
  @media (max-width: 768px) {
    box-shadow: ${props => props.$isOpen ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const SidebarOverlay = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const QuickStats = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  color: white;
`;

const StatsTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const QuickActions = styled.div`
  margin-bottom: 24px;
`;

const ActionsTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  
  &:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
    color: #3b82f6;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const ActionIcon = styled.span`
  font-size: 1rem;
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

const VersionInfo = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 8px;
`;

const SupportLink = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.75rem;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const Sidebar = ({ 
  isOpen = false,
  onClose,
  activeRoute = 'dashboard',
  onNavigate,
  onCreateTask,
  onCreateHabit,
  stats = {
    totalTasks: 0,
    completedTasks: 0,
    totalHabits: 0,
    todayHabits: 0,
    overdueTasks: 0,
    upcomingTasks: 0,
    todayTasks: 0
  }
}) => {
  const taskCounts = {
    total: stats.totalTasks,
    overdue: stats.overdueTasks,
    today: stats.todayTasks,
    upcoming: stats.upcomingTasks
  };

  const habitCounts = {
    total: stats.totalHabits,
    today: stats.todayHabits
  };

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  const handleNavigate = (route) => {
    onNavigate && onNavigate(route);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      onClose && onClose();
    }
  };

  const handleCreateTask = () => {
    onCreateTask && onCreateTask();
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      onClose && onClose();
    }
  };

  const handleCreateHabit = () => {
    onCreateHabit && onCreateHabit();
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      onClose && onClose();
    }
  };

  return (
    <>
      <SidebarOverlay $isOpen={isOpen} onClick={onClose} />
      <SidebarContainer $isOpen={isOpen}>
        <QuickStats>
          <StatsTitle>📈 Progress Overview</StatsTitle>
          <StatsGrid>
            <StatItem>
              <StatNumber>{stats.totalTasks}</StatNumber>
              <StatLabel>Total Tasks</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{completionRate}%</StatNumber>
              <StatLabel>Completed</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{stats.totalHabits}</StatNumber>
              <StatLabel>Habits</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{stats.todayHabits}</StatNumber>
              <StatLabel>Today Done</StatLabel>
            </StatItem>
          </StatsGrid>
        </QuickStats>

        <QuickActions>
          <ActionsTitle>Quick Actions</ActionsTitle>
          <ActionButton onClick={handleCreateTask}>
            <ActionIcon>➕</ActionIcon>
            Create New Task
          </ActionButton>
          <ActionButton onClick={handleCreateHabit}>
            <ActionIcon>🎯</ActionIcon>
            Create New Habit
          </ActionButton>
        </QuickActions>

        <Navigation
          activeRoute={activeRoute}
          onNavigate={handleNavigate}
          taskCounts={taskCounts}
          habitCounts={habitCounts}
        />

        <Footer>
          <VersionInfo>TaskFlow v1.0.0</VersionInfo>
          <SupportLink>
            💬 Help & Support
          </SupportLink>
        </Footer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;