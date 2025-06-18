import React from 'react';
import styled from 'styled-components';
import { Button } from '../common';

const TasksCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const TaskCount = styled.span`
  background-color: ${props => props.$count > 0 ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$count > 0 ? '#dc2626' : '#16a34a'};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
`;

const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background-color: #fef2f2;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #f87171;
    background-color: #fee2e2;
  }
`;

const TaskContent = styled.div`
  flex: 1;
  margin-right: 12px;
`;

const TaskTitle = styled.h4`
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  font-size: 0.875rem;
`;

const MetaItem = styled.span`
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PriorityBadge = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.$priority) {
      case 'high':
        return `
          background-color: #fee2e2;
          color: #dc2626;
        `;
      case 'medium':
        return `
          background-color: #fef3c7;
          color: #d97706;
        `;
      case 'low':
        return `
          background-color: #dcfce7;
          color: #16a34a;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const OverdueDate = styled.span`
  color: #dc2626;
  font-weight: 500;
`;

const OverdueDays = styled.span`
  background-color: #dc2626;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const TaskActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
`;

const EmptyTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 1.125rem;
  font-weight: 500;
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

const UrgentAlert = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AlertIcon = styled.span`
  color: #dc2626;
  font-size: 1.25rem;
`;

const AlertText = styled.span`
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
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