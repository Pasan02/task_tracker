import React from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import { useApp } from '../../context/AppContext';

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
  z-index: 1100; /* Ensure sidebar is above content but below header overlay */
  transform: translateX(${props => (props.$isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;

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
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary-500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--color-text-primary);
`;

const UserStatus = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const QuickActions = styled.div`
  margin-bottom: var(--space-6);
`;

const ActionsTitle = styled.h3`
  margin: 0 0 var(--space-3) 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-card);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: var(--space-2);

  &:hover {
    border-color: var(--color-primary-500);
    background-color: var(--color-hover);
    color: var(--color-primary-500);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-focus);
  }
`;

const ActionIcon = styled.span`
  font-size: 1rem;
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
    setActiveRoute(route);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      onClose && onClose();
    }
  };

  const handleCreateTask = () => {
    openTaskForm();
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      onClose && onClose();
    }
  };

  const handleCreateHabit = () => {
    openHabitForm();
    // Close sidebar on mobile
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