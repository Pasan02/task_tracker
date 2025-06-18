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
  gap: 24px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 2rem;
  font-weight: 700;
`;

const WelcomeSubtitle = styled.p`
  margin: 0;
  font-size: 1.125rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TasksSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
`;

const QuickActionsContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
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

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
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
      <WelcomeSection>
        <WelcomeTitle>
          {isFirstTime ? 'Welcome to Task & Habit Tracker!' : 'Dashboard'}
        </WelcomeTitle>
        <WelcomeSubtitle>
          {isFirstTime 
            ? 'Start by creating your first task or habit below' 
            : formatDate()
          }
        </WelcomeSubtitle>
      </WelcomeSection>

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