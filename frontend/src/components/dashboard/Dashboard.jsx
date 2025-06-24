import React from 'react';
import styled from 'styled-components';
import TaskSummary from './TaskSummary';
import HabitSummary from './HabitSummary';
import UpcomingTasks from './UpcomingTasks';
import OverdueTasks from './OverdueTasks';
import { Loading } from '../common';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-5);
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  margin-bottom: var(--space-4);
`;

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1) 0;
`;

const Subtitle = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-5);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TasksSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-5);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
`;

const QuickActionsContainer = styled.div`
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-5);
`;

const QuickActions = styled.div`
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background-color: var(--color-primary-500);
  color: white;
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-primary-600);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: var(--space-4);
  border-radius: 8px;
  margin-bottom: var(--space-5);
`;

const formatDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Dashboard = ({ 
  tasks = [], 
  habits = [], 
  loading = false, 
  error = null,
  onCreateTask,
  onCreateHabit,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
  onEditHabit,
  onDeleteHabit,
  onToggleHabitCompletion
}) => {
  if (loading) {
    return <Loading message="Loading dashboard..." size="large" />;
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorMessage>
          <strong>Error loading dashboard:</strong> {error}
        </ErrorMessage>
      </DashboardContainer>
    );
  }

  const isFirstTime = tasks.length === 0 && habits.length === 0;

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>
          {isFirstTime ? 'Welcome to Task & Habit Tracker!' : 'Dashboard'}
        </Title>
        <Subtitle>
          {isFirstTime 
            ? 'Start by creating your first task or habit below' 
            : formatDate()
          }
        </Subtitle>
      </DashboardHeader>

      {isFirstTime ? (
        <QuickActionsContainer>
          <SectionHeader>
            <SectionTitle>Get Started</SectionTitle>
          </SectionHeader>
          <QuickActions>
            <ActionButton onClick={onCreateTask}>
              ➕ Create Your First Task
            </ActionButton>
            <ActionButton onClick={onCreateHabit}>
              🎯 Create Your First Habit
            </ActionButton>
          </QuickActions>
        </QuickActionsContainer>
      ) : (
        <>
          <StatsGrid>
            <TaskSummary 
              tasks={tasks}
              onCreateTask={onCreateTask}
            />
            <HabitSummary 
              habits={habits}
              onCreateHabit={onCreateHabit}
              onToggleCompletion={onToggleHabitCompletion}
            />
          </StatsGrid>

          <TasksSection>
            <UpcomingTasks 
              tasks={tasks}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleStatus={onToggleTaskStatus}
            />
            <OverdueTasks 
              tasks={tasks}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleStatus={onToggleTaskStatus}
            />
          </TasksSection>

          <QuickActionsContainer>
            <SectionHeader>
              <SectionTitle>Quick Actions</SectionTitle>
            </SectionHeader>
            <QuickActions>
              <ActionButton onClick={onCreateTask}>
                ➕ Add Task
              </ActionButton>
              <ActionButton onClick={onCreateHabit}>
                🎯 Add Habit
              </ActionButton>
            </QuickActions>
          </QuickActionsContainer>
        </>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;