import React from 'react';
import styled from 'styled-components';
import HabitItem from './HabitItem';
import { Loading } from '../common';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const HabitList = ({ 
  habits, 
  loading = false, 
  onEdit, 
  onDelete, 
  onToggleCompletion,
  emptyMessage = "No habits found" 
}) => {
  if (loading) {
    return <Loading message="Loading habits..." />;
  }

  if (!habits || habits.length === 0) {
    return (
      <EmptyState>
        <EmptyTitle>No Habits Yet</EmptyTitle>
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      </EmptyState>
    );
  }

  return (
    <ListContainer>
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
    </ListContainer>
  );
};

export default HabitList;