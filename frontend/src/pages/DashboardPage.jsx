import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Dashboard from '../components/dashboard/Dashboard';
import useTasks from '../hooks/useTasks';
import useHabits from '../hooks/useHabits';
import { useApp } from '../context/AppContext';
import { Loading } from '../components/common';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
  position: relative;
`;

const PageContent = styled.div`
  animation: fadeInUp 0.4s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  text-align: center;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-xl);
  border: 1px solid var(--color-error-200);
  box-shadow: var(--shadow-lg), 0 0 0 1px rgba(var(--color-error-rgb), 0.05);
  animation: bounceIn 0.5s cubic-bezier(0.5, 1.5, 0.5, 1.2);
  
  @keyframes bounceIn {
    0% { transform: scale(0.95); opacity: 0; }
    70% { transform: scale(1.03); }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const ErrorTitle = styled.h2`
  color: var(--color-error-600);
  margin: 0 0 16px 0;
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '⚠️';
    font-size: 2rem;
    animation: shake 1s ease-in-out;
    display: inline-block;
    
    @keyframes shake {
      0%, 100% { transform: rotate(0deg); }
      20%, 60% { transform: rotate(-6deg); }
      40%, 80% { transform: rotate(6deg); }
    }
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-text-secondary);
  margin: 0 0 30px 0;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 500px;
`;

const RetryButton = styled.button`
  background: linear-gradient(to bottom, var(--color-primary-500), var(--color-primary-600));
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: var(--border-radius-full);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md), 0 4px 6px rgba(var(--color-primary-rgb), 0.25);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: var(--shadow-lg), 0 6px 12px rgba(var(--color-primary-rgb), 0.3);
    background: linear-gradient(to bottom, var(--color-primary-600), var(--color-primary-700));
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: var(--shadow-sm), 0 2px 4px rgba(var(--color-primary-rgb), 0.2);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
`;

const LoadingText = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  margin: 0;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
`;

const DashboardPage = () => {
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    refreshTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    clearError: clearTasksError
  } = useTasks();

  const {
    habits,
    loading: habitsLoading,
    error: habitsError,
    refreshHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    clearError: clearHabitsError
  } = useHabits();

  const {
    openTaskForm,
    openHabitForm,
    setActiveRoute
  } = useApp();

  const hasSetRoute = useRef(false);

  // Set active route when component mounts
  useEffect(() => {
    // Only set the route once when the component mounts
    if (!hasSetRoute.current) {
      hasSetRoute.current = true;
      setActiveRoute('/dashboard');
    }
  }, []); // Remove setActiveRoute from dependency array

  // Handle loading states
  const loading = tasksLoading || habitsLoading;
  const error = tasksError || habitsError;

  // Event handlers
  const handleCreateTask = () => {
    openTaskForm();
  };

  const handleCreateHabit = () => {
    openHabitForm();
  };

  const handleEditTask = (task) => {
    openTaskForm(task);
  };

  const handleEditHabit = (habit) => {
    openHabitForm(habit);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteHabit(habitId);
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const handleToggleTaskStatus = async (taskId, newStatus) => {
    try {
      await toggleTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    }
  };

  const handleToggleHabitCompletion = async (habitId, dateString) => {
    try {
      await toggleHabitCompletion(habitId, dateString);
    } catch (error) {
      console.error('Failed to toggle habit completion:', error);
    }
  };

  const handleRetry = async () => {
    clearTasksError();
    clearHabitsError();
    
    try {
      await Promise.all([
        refreshTasks(),
        refreshHabits()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  // Show loading state
  if (loading && tasks.length === 0 && habits.length === 0) {
    return (
      <PageContainer>
        <LoadingContainer>
          <Loading message="Loading dashboard..." size="large" />
          <LoadingText>Please wait while we load your tasks and habits.</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  // Show error state
  if (error && tasks.length === 0 && habits.length === 0) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorTitle>⚠️ Unable to Load Dashboard</ErrorTitle>
          <ErrorMessage>
            We're having trouble loading your tasks and habits. 
            Please check your connection and try again.
          </ErrorMessage>
          <RetryButton onClick={handleRetry}>
            🔄 Try Again
          </RetryButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageContent>
        <Dashboard
          tasks={tasks}
          habits={habits}
          loading={loading}
          error={error}
          onCreateTask={handleCreateTask}
          onCreateHabit={handleCreateHabit}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onToggleTaskStatus={handleToggleTaskStatus}
          onEditHabit={handleEditHabit}
          onDeleteHabit={handleDeleteHabit}
          onToggleHabitCompletion={handleToggleHabitCompletion}
        />
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;