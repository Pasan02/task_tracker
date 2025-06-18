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
  background-color: #dbeafe;
  color: #1d4ed8;
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
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #fafafa;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #d1d5db;
    background-color: #f9fafb;
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

const DueDate = styled.span`
  color: ${props => {
    if (props.$isToday) return '#d97706';
    if (props.$isTomorrow) return '#0369a1';
    return '#6b7280';
  }};
  font-weight: ${props => (props.$isToday || props.$isTomorrow) ? '500' : '400'};
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

const formatDueDate = (dueDate) => {
  if (!dueDate) return null;
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const due = new Date(dueDate);
  const todayStr = today.toDateString();
  const tomorrowStr = tomorrow.toDateString();
  const dueStr = due.toDateString();
  
  if (dueStr === todayStr) {
    return { text: 'Due Today', isToday: true, isTomorrow: false };
  } else if (dueStr === tomorrowStr) {
    return { text: 'Due Tomorrow', isToday: false, isTomorrow: true };
  } else {
    return { 
      text: `Due ${due.toLocaleDateString()}`, 
      isToday: false, 
      isTomorrow: false 
    };
  }
};

const UpcomingTasks = ({ tasks = [], onEdit, onDelete, onToggleStatus }) => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingTasks = tasks
    .filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5); // Show only first 5

  const handleComplete = (task) => {
    onToggleStatus(task.id, 'done');
  };

  if (upcomingTasks.length === 0) {
    return (
      <TasksCard>
        <CardHeader>
          <CardTitle>📅 Upcoming Tasks</CardTitle>
          <TaskCount>0</TaskCount>
        </CardHeader>
        <EmptyState>
          <EmptyIcon>🎉</EmptyIcon>
          <EmptyTitle>All Caught Up!</EmptyTitle>
          <EmptyMessage>No upcoming tasks in the next 7 days</EmptyMessage>
        </EmptyState>
      </TasksCard>
    );
  }

  return (
    <TasksCard>
      <CardHeader>
        <CardTitle>📅 Upcoming Tasks</CardTitle>
        <TaskCount>{upcomingTasks.length}</TaskCount>
      </CardHeader>
      
      <TasksList>
        {upcomingTasks.map(task => {
          const dueDateInfo = formatDueDate(task.dueDate);
          
          return (
            <TaskItem key={task.id}>
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
                  {dueDateInfo && (
                    <MetaItem>
                      <DueDate 
                        $isToday={dueDateInfo.isToday}
                        $isTomorrow={dueDateInfo.isTomorrow}
                      >
                        📅 {dueDateInfo.text}
                      </DueDate>
                    </MetaItem>
                  )}
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
                  onClick={() => onEdit(task)}
                >
                  Edit
                </Button>
              </TaskActions>
            </TaskItem>
          );
        })}
      </TasksList>
    </TasksCard>
  );
};

export default UpcomingTasks;