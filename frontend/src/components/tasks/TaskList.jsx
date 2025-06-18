import React from 'react';
import styled from 'styled-components';
import TaskItem from './TaskItem';
import { Loading } from '../common';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.125rem;
  font-weight: 500;
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

const TaskList = ({ 
  tasks, 
  loading = false, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  emptyMessage = "No tasks found" 
}) => {
  if (loading) {
    return <Loading message="Loading tasks..." />;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState>
        <EmptyTitle>No Tasks Yet</EmptyTitle>
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      </EmptyState>
    );
  }

  return (
    <ListContainer>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </ListContainer>
  );
};

export default TaskList;