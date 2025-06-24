import React from 'react';
import styled from 'styled-components';

const SummaryCard = styled.div`
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
`;

const AddButton = styled.button`
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-primary-500);
    color: var(--color-primary-500);
    background-color: var(--color-hover);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-5);
`;

const StatItem = styled.div`
  text-align: center;
  padding: var(--space-4);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.$bgColor || 'var(--color-surface)'};
`;

const StatNumber = styled.div`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: ${props => props.$color || 'var(--color-text-primary)'};
  margin-bottom: var(--space-1);
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: var(--space-2);
  background-color: var(--color-border-light);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  margin-bottom: var(--space-2);
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: var(--color-success-500);
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
`;

const PriorityBreakdown = styled.div`
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
`;

const PriorityItem = styled.div`
  flex: 1;
  text-align: center;
  padding: var(--space-3);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.$bgColor};
  border: 1px solid ${props => props.$borderColor};
`;

const PriorityCount = styled.div`
  font-weight: 600;
  color: ${props => props.$color};
`;

const PriorityLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.$color};
  text-transform: uppercase;
  margin-top: 2px;
`;

const TaskSummary = ({ tasks = [], onCreateTask }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(task => 
    task.dueDate && 
    task.dueDate < today && 
    task.status !== 'done'
  ).length;

  const highPriorityTasks = tasks.filter(task => 
    task.priority === 'high' && task.status !== 'done'
  ).length;
  
  const mediumPriorityTasks = tasks.filter(task => 
    task.priority === 'medium' && task.status !== 'done'
  ).length;
  
  const lowPriorityTasks = tasks.filter(task => 
    task.priority === 'low' && task.status !== 'done'
  ).length;

  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <SummaryCard>
      <CardHeader>
        <CardTitle>📋 Task Overview</CardTitle>
        <AddButton onClick={onCreateTask}>
          + Add Task
        </AddButton>
      </CardHeader>

      <StatsGrid>
        <StatItem $bgColor="#dbeafe">
          <StatNumber $color="#1d4ed8">{totalTasks}</StatNumber>
          <StatLabel>Total Tasks</StatLabel>
        </StatItem>
        
        <StatItem $bgColor="#dcfce7">
          <StatNumber $color="#16a34a">{completedTasks}</StatNumber>
          <StatLabel>Completed</StatLabel>
        </StatItem>
        
        <StatItem $bgColor="#fef3c7">
          <StatNumber $color="#d97706">{inProgressTasks}</StatNumber>
          <StatLabel>In Progress</StatLabel>
        </StatItem>
        
        <StatItem $bgColor="#fee2e2">
          <StatNumber $color="#dc2626">{overdueTasks}</StatNumber>
          <StatLabel>Overdue</StatLabel>
        </StatItem>
      </StatsGrid>

      <div>
        <ProgressBar>
          <ProgressFill $percentage={completionPercentage} />
        </ProgressBar>
        <ProgressText>
          {completionPercentage}% Complete ({completedTasks} of {totalTasks})
        </ProgressText>
      </div>

      {(highPriorityTasks > 0 || mediumPriorityTasks > 0 || lowPriorityTasks > 0) && (
        <PriorityBreakdown>
          <PriorityItem 
            $bgColor="#fee2e2" 
            $borderColor="#fecaca"
          >
            <PriorityCount $color="#dc2626">{highPriorityTasks}</PriorityCount>
            <PriorityLabel $color="#dc2626">High</PriorityLabel>
          </PriorityItem>
          
          <PriorityItem 
            $bgColor="#fef3c7" 
            $borderColor="#fed7aa"
          >
            <PriorityCount $color="#d97706">{mediumPriorityTasks}</PriorityCount>
            <PriorityLabel $color="#d97706">Medium</PriorityLabel>
          </PriorityItem>
          
          <PriorityItem 
            $bgColor="#dcfce7" 
            $borderColor="#bbf7d0"
          >
            <PriorityCount $color="#16a34a">{lowPriorityTasks}</PriorityCount>
            <PriorityLabel $color="#16a34a">Low</PriorityLabel>
          </PriorityItem>
        </PriorityBreakdown>
      )}
    </SummaryCard>
  );
};

export default TaskSummary;