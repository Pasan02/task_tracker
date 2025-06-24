import React from 'react';
import styled from 'styled-components';
import { Button } from '../common';

const TasksCard = styled.div`
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
`;

const TaskCount = styled.span`
  background-color: ${props => props.$count > 0 ? 'var(--color-error-100)' : 'var(--color-success-100)'};
  color: ${props => props.$count > 0 ? 'var(--color-error-700)' : 'var(--color-success-700)'};
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-height: 400px;
  overflow-y: auto;
  padding-right: var(--space-2);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-surface);
    border-radius: var(--border-radius-full);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: var(--border-radius-full);
    
    &:hover {
      background: var(--color-gray-400);
    }
  }
`;

const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-4);
  border: 1px solid var(--color-error-200);
  border-radius: var(--border-radius-md);
  background-color: var(--color-error-50);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--color-error-300);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
`;

const TaskContent = styled.div`
  flex: 1;
  margin-right: var(--space-3);
`;

const TaskTitle = styled.h4`
  margin: 0 0 var(--space-1) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
`;

const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
`;

const MetaItem = styled.span`
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

const PriorityBadge = styled.span`
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  
  ${props => {
    switch (props.$priority) {
      case 'high':
        return `
          background-color: var(--color-error-100);
          color: var(--color-error-700);
        `;
      case 'medium':
        return `
          background-color: var(--color-warning-100);
          color: var(--color-warning-700);
        `;
      case 'low':
        return `
          background-color: var(--color-success-100);
          color: var(--color-success-700);
        `;
      default:
        return `
          background-color: var(--color-gray-200);
          color: var(--color-text-secondary);
        `;
    }
  }}
`;

const OverdueDate = styled.span`
  color: var(--color-error-700);
  font-weight: var(--font-weight-medium);
`;

const OverdueDays = styled.span`
  background-color: var(--color-error-700);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
`;

const TaskActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-10) var(--space-5);
  color: var(--color-text-secondary);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-3);
`;

const EmptyTitle = styled.h4`
  margin: 0 0 var(--space-2) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
`;

const UrgentAlert = styled.div`
  background-color: var(--color-warning-50);
  border: 1px solid var(--color-warning-200);
  border-radius: var(--border-radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const AlertIcon = styled.span`
  color: var(--color-warning-700);
  font-size: 1.25rem;
`;

const AlertText = styled.span`
  color: var(--color-warning-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
`;

const calculateDaysOverdue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = today - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const OverdueTasks = ({ tasks = [], onEdit, onDelete, onToggleStatus }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const overdueTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      return task.dueDate < today;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Oldest first

  const urgentTasks = overdueTasks.filter(task => {
    const daysOverdue = calculateDaysOverdue(task.dueDate);
    return daysOverdue >= 3 || task.priority === 'high';
  });

  const handleComplete = (task) => {
    onToggleStatus(task.id, 'done');
  };

  const handleExtendDeadline = (task) => {
    // This could open the edit modal or extend by a default period
    onEdit(task);
  };

  if (overdueTasks.length === 0) {
    return (
      <TasksCard>
        <CardHeader>
          <CardTitle>⚠️ Overdue Tasks</CardTitle>
          <TaskCount $count={0}>0</TaskCount>
        </CardHeader>
        <EmptyState>
          <EmptyIcon>✨</EmptyIcon>
          <EmptyTitle>No Overdue Tasks!</EmptyTitle>
          <EmptyMessage>Great job staying on top of your deadlines</EmptyMessage>
        </EmptyState>
      </TasksCard>
    );
  }

  return (
    <TasksCard>
      <CardHeader>
        <CardTitle>⚠️ Overdue Tasks</CardTitle>
        <TaskCount $count={overdueTasks.length}>{overdueTasks.length}</TaskCount>
      </CardHeader>

      {urgentTasks.length > 0 && (
        <UrgentAlert>
          <AlertIcon>🚨</AlertIcon>
          <AlertText>
            {urgentTasks.length} urgent task{urgentTasks.length > 1 ? 's' : ''} need{urgentTasks.length === 1 ? 's' : ''} immediate attention!
          </AlertText>
        </UrgentAlert>
      )}
      
      <TasksList>
        {overdueTasks.map(task => {
          const daysOverdue = calculateDaysOverdue(task.dueDate);
          const isUrgent = daysOverdue >= 3 || task.priority === 'high';
          
          return (
            <TaskItem key={task.id} $urgent={isUrgent}>
              <TaskContent>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskMeta>
                  {task.priority && (
                    <MetaItem>
                      <PriorityBadge $priority={task.priority}>
                        {task.priority} priority
                      </PriorityBadge>
                    </MetaItem>
                  )}
                  <MetaItem>
                    <OverdueDate>
                      📅 Due {new Date(task.dueDate).toLocaleDateString()}
                    </OverdueDate>
                  </MetaItem>
                  <MetaItem>
                    <OverdueDays>
                      {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue
                    </OverdueDays>
                  </MetaItem>
                  {task.category && (
                    <MetaItem>
                      🏷️ {task.category}
                    </MetaItem>
                  )}
                </TaskMeta>
              </TaskContent>
              
              <TaskActions>
                <Button
                  size="small"
                  variant="success"
                  onClick={() => handleComplete(task)}
                >
                  ✓ Complete
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => handleExtendDeadline(task)}
                >
                  📅 Extend
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </Button>
              </TaskActions>
            </TaskItem>
          );
        })}
      </TasksList>
    </TasksCard>
  );
};

export default OverdueTasks;