import React from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.aside`
  width: var(--sidebar-width, 280px);
  height: 100vh;
  background: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-border);
  padding: var(--space-5);
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1100;
  transform: translateX(${props => (props.$isOpen ? '0' : '-100%')});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: var(--border-radius-full);
  }

  @media (min-width: 769px) {
    transform: none;
    height: calc(100vh - var(--header-height, 64px));
    top: var(--header-height, 64px);
    z-index: 900;
  }

  @media (max-width: 768px) {
    box-shadow: ${props => (props.$isOpen ? 'var(--shadow-lg)' : 'none')};
  }
`;

const SidebarOverlay = styled.div`
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-overlay);
  z-index: 40;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  animation: ${props => props.$isOpen ? 'fadeIn 0.3s forwards' : 'none'};
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) 0;
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, var(--color-primary-500), transparent);
    border-radius: var(--border-radius-full);
  }
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 40%;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  box-shadow: var(--shadow-md);
  border: 2px solid var(--color-surface);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05) rotate(5deg);
    box-shadow: var(--shadow-lg);
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
`;

const UserStatus = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-success-500);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const QuickActions = styled.div`
  margin-bottom: var(--space-6);
`;

const ActionsTitle = styled.h3`
  margin: 0 0 var(--space-3) 0;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 24px;
    height: 2px;
    background: var(--color-primary-500);
    border-radius: var(--border-radius-full);
  }
`;

const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: var(--space-2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.4s ease;
  }

  &:hover {
    border-color: var(--color-primary-500);
    background-color: var(--color-hover);
    color: var(--color-primary-500);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  &:hover::before {
    transform: translateX(100%);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-focus);
  }
`;

const ActionIcon = styled.span`
  font-size: 1.1rem;
  min-width: 20px;
  transition: transform 0.2s ease;
  
  ${ActionButton}:hover & {
    transform: scale(1.2);
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: var(--space-5);
  border-top: 1px solid var(--color-border);
`;

const VersionInfo = styled.div`
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-2);
`;

const SupportLink = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  padding: var(--space-2);
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background-color: var(--color-hover);
    color: var(--color-text-primary);
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
  const { setActiveRoute, openTaskForm, openHabitForm } = useApp();
  const navigate = useNavigate();

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

  const handleNavigate = (route) => {
    // Use navigate function for proper SPA routing
    navigate(route);
    
    if (setActiveRoute) {
      setActiveRoute(route);
    }
    
    // Call parent handler if provided
    if (onNavigate) {
      onNavigate(route);
    }
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      onClose && onClose();
    }
  };

  const handleCreateTask = () => {
    openTaskForm();
    if (window.innerWidth <= 768) {
      onClose && onClose();
    }
  };

  const handleCreateHabit = () => {
    openHabitForm();
    if (window.innerWidth <= 768) {
      onClose && onClose();
    }
  };

  return (
    <>
      <SidebarOverlay $isOpen={isOpen} onClick={onClose} />
      <SidebarContainer $isOpen={isOpen}>
        <ProfileSection>
          <Avatar>TF</Avatar>
          <UserInfo>
            <UserName>TaskFlow User</UserName>
            <UserStatus>Active</UserStatus>
          </UserInfo>
        </ProfileSection>

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