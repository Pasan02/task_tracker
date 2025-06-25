import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, matchPath } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';
import { useTasks } from '../../context/TaskContext';
import { useHabits } from '../../context/HabitContext';
import TaskForm from '../tasks/TaskForm';
import HabitForm from '../habits/HabitForm';
import Modal from '../common/Modal'; // Import the Modal component

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &.dark-mode {
    color: var(--color-text-primary);
  }
`;

const MainContent = styled.main`
  flex: 1;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding-top: var(--header-height, 64px);
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? 'var(--sidebar-width, 280px)' : '0')};
  position: relative;
  overflow-x: hidden;
  max-width: calc(100% - var(--sidebar-width, 280px));
  box-sizing: border-box;

  @media (min-width: 769px) {
    margin-left: var(--sidebar-width, 280px);
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding-left: 12px;
    padding-right: 12px;
  }
`;

const ContentArea = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 16px 8px;
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
  backdrop-filter: blur(4px);
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  
  @keyframes fadeIn {
    to { opacity: 1; }
  }
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(var(--color-primary-rgb), 0.2);
  border-top: 4px solid var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.05);

  @keyframes spin {
    0% { transform: rotate(0deg) scale(0.95); }
    50% { transform: rotate(180deg) scale(1); }
    100% { transform: rotate(360deg) scale(0.95); }
  }
`;

const ErrorBoundary = styled.div`
  padding: var(--space-10) var(--space-5);
  text-align: center;
  background-color: var(--color-error-50);
  border: 1px solid var(--color-error-100);
  border-radius: var(--border-radius-xl);
  margin: var(--space-8);
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.4s ease;
  
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ErrorTitle = styled.h2`
  color: var(--color-error-600);
  margin: 0 0 var(--space-4) 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
`;

const ErrorMessage = styled.p`
  color: var(--color-error-800);
  margin: 0 0 var(--space-8) 0;
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const RetryButton = styled.button`
  background-color: var(--color-error-600);
  color: white;
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  box-shadow: var(--shadow-md);

  &:hover {
    background-color: var(--color-error-700);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &:active {
    transform: translateY(0);
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
    getTodayTasks,
    updateTask,  // Add this
    createTask   // Add this
  } = useTasks();
  
  const { 
    habits,
    stats: habitStats,
    createHabit,
    updateHabit
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
    // Update active route based on current location
    const currentPath = location.pathname;
    
    // Normalize the path for consistency
    const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
    
    // Only update if the path actually changed
    if (normalizedPath !== activeRoute) {
      setActiveRoute(normalizedPath);
    }
  }, [location.pathname, activeRoute, setActiveRoute]);

  // Update the handleToggleSidebar function to properly toggle sidebar state
  const handleToggleSidebar = () => {
    // Instead of just calling toggleSidebar(), we need to toggle the current state
    toggleSidebar(!sidebarOpen);
  };

  // Add this function to handle task form submissions
  const handleSubmitTask = async (taskData) => {
    try {
      if (taskFormState.task) {
        await updateTask(taskFormState.task.id, taskData);
      } else {
        await createTask(taskData);
      }
      closeTaskForm();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  // Add the handleSubmitHabit function just after handleSubmitTask
  const handleSubmitHabit = async (habitData) => {
    try {
      if (habitFormState.habit) {
        await updateHabit(habitFormState.habit.id, habitData);
      } else {
        await createHabit(habitData);
      }
      closeHabitForm();
    } catch (error) {
      console.error('Failed to save habit:', error);
    }
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
    <LayoutContainer className={isDarkMode ? 'dark-mode' : ''}>
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
        <Modal
          isOpen={taskFormState.isOpen}
          onClose={closeTaskForm}
          title={taskFormState.task ? 'Edit Task' : 'Create New Task'}
          size="medium"
        >
          <TaskForm
            task={taskFormState.task}
            onSubmit={handleSubmitTask}
            onClose={closeTaskForm}
          />
        </Modal>
      )}

      {/* Habit Form Modal */}
      {habitFormState?.isOpen && (
        <Modal
          isOpen={habitFormState.isOpen}
          onClose={closeHabitForm}
          title={habitFormState.habit ? 'Edit Habit' : 'Create New Habit'}
          size="medium"
        >
          <HabitForm
            habit={habitFormState.habit}
            onSubmit={handleSubmitHabit}
            onClose={closeHabitForm}
          />
        </Modal>
      )}
    </LayoutContainer>
  );
};

export default Layout;