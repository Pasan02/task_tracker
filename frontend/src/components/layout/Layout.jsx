import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';
import { useTasks } from '../../context/TaskContext';
import { useHabits } from '../../context/HabitContext';
import TaskForm from '../tasks/TaskForm';
import HabitForm from '../habits/HabitForm';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-surface);
`;

const MainContent = styled.main`
  transition: margin-left 0.3s ease;
  padding-top: var(--header-height, 64px);
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? 'var(--sidebar-width, 280px)' : '0')};

  @media (min-width: 769px) {
    margin-left: var(--sidebar-width, 280px);
  }
`;

const ContentArea = styled.div`
  padding: var(--space-5);
  
  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorBoundary = styled.div`
  padding: var(--space-10) var(--space-5);
  text-align: center;
  background-color: var(--color-error-50);
  border: 1px solid var(--color-error-200);
  border-radius: var(--border-radius-lg);
  margin: var(--space-5);
`;

const ErrorTitle = styled.h2`
  color: var(--color-error-600);
  margin: 0 0 var(--space-3) 0;
  font-size: 1.25rem;
`;

const ErrorMessage = styled.p`
  color: var(--color-error-800);
  margin: 0 0 var(--space-5) 0;
`;

const RetryButton = styled.button`
  background-color: var(--color-error-600);
  color: white;
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: var(--color-error-700);
  }
`;

const Layout = ({ 
  children,
  onToggleTheme,
  isDarkMode = false,
  searchQuery = '',
  onSearchChange,
  loading = false,
  error = null,
  onRetry,
  userName = 'User'
}) => {
  const location = useLocation();
  const { 
    sidebarOpen, 
    toggleSidebar, 
    activeRoute, 
    setActiveRoute,
    openTaskForm,
    openHabitForm,
    taskFormState,
    habitFormState,
    closeTaskForm,
    closeHabitForm
  } = useApp();

  // Get task and habit stats for sidebar
  const { 
    tasks, 
    getOverdueTasks, 
    getUpcomingTasks,
    getTodayTasks
  } = useTasks();
  
  const { 
    habits,
    stats: habitStats
  } = useHabits();

  // Calculate sidebar stats (renamed to avoid conflict)
  const sidebarStats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'done').length,
    totalHabits: habits.length,
    todayHabits: habitStats.completedToday || 0, // Use stats instead of getTodaysHabits()
    overdueTasks: getOverdueTasks().length,
    upcomingTasks: getUpcomingTasks(7).length,
    todayTasks: getTodayTasks().length
  };

  // Sync route when location changes - in a separate effect
  useEffect(() => {
    const handleLocationChange = () => {
      if (location.pathname !== activeRoute) {
        setActiveRoute(location.pathname);
      }
    };
    
    handleLocationChange(); // Call once on mount
    
  }, [location.pathname, activeRoute, setActiveRoute]);

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  if (error) {
    return (
      <LayoutContainer>
        <ErrorBoundary>
          <ErrorTitle>⚠️ Something went wrong</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          {onRetry && (
            <RetryButton onClick={onRetry}>
              Try Again
            </RetryButton>
          )}
        </ErrorBoundary>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => toggleSidebar(false)}
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        onCreateTask={openTaskForm}
        onCreateHabit={openHabitForm}
        stats={sidebarStats}
      />
      <MainContent $sidebarOpen={sidebarOpen}>
        <Header 
          onToggleSidebar={handleToggleSidebar}
          onToggleTheme={onToggleTheme}
          isDarkMode={isDarkMode}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onCreateTask={openTaskForm}
          onCreateHabit={openHabitForm}
          pendingTasksCount={sidebarStats.overdueTasks + sidebarStats.todayTasks}
          userName={userName}
        />
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>

      {/* Task Form Modal */}
      {taskFormState?.isOpen && (
        <TaskForm
          isOpen={taskFormState.isOpen}
          onClose={closeTaskForm}
          task={taskFormState.task}
        />
      )}

      {/* Habit Form Modal */}
      {habitFormState?.isOpen && (
        <HabitForm
          isOpen={habitFormState.isOpen}
          onClose={closeHabitForm}
          habit={habitFormState.habit}
        />
      )}
    </LayoutContainer>
  );
};

export default Layout;