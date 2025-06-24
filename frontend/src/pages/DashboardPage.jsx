import React, { useEffect } from 'react';
import styled from 'styled-components';
import Dashboard from '../components/dashboard/Dashboard';
import useTasks from '../hooks/useTasks'; // Changed from named import to default import
import useHabits from '../hooks/useHabits';
import { useApp } from '../context/AppContext';
import { Loading } from '../components/common';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #dc2626;
  margin: 0 0 16px 0;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: #6b7280;
  margin: 0 0 24px 0;
  font-size: 1rem;
  max-width: 500px;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

  // Set active route when component mounts
  useEffect(() => {
    setActiveRoute('dashboard');
  }, [setActiveRoute]);

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
        <Loading message="Loading dashboard..." size="large" />
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
    </PageContainer>
  );
};

export default DashboardPage;