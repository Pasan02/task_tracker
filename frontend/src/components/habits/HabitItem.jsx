import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button, ConfirmDialog } from '../common';
import StreakCounter from './StreakCounter';
import HabitCalendar from './HabitCalendar';

const HabitCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const HabitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const HabitContent = styled.div`
  flex: 1;
`;

const HabitTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const HabitDescription = styled.p`
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const HabitMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 0.875rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
`;

const FrequencyBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #dbeafe;
  color: #1d4ed8;
  text-transform: capitalize;
`;

const TodaySection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background-color: #f9fafb;
`;

const TodayLabel = styled.span`
  font-weight: 500;
  color: #374151;
`;

const TodayButton = styled(Button)`
  ${props => props.$completed && css`
    background-color: #10b981;
    border-color: #10b981;
    
    &:hover {
      background-color: #059669;
    }
  `}
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const ExpandedContent = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const HabitActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HabitItem = ({ habit, onEdit, onDelete, onToggleCompletion }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isTodayCompleted = habit.completions?.includes(today) || false;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(habit.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting habit:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTodayToggle = () => {
    onToggleCompletion(habit.id, today);
  };

  return (
    <>
      <HabitCard>
        <HabitHeader>
          <HabitContent>
            <HabitTitle>{habit.title}</HabitTitle>
            
            {habit.description && (
              <HabitDescription>{habit.description}</HabitDescription>
            )}
            
            <HabitMeta>
              <MetaItem>
                <FrequencyBadge>{habit.frequency}</FrequencyBadge>
              </MetaItem>
              
              <MetaItem>
                <StreakCounter 
                  completions={habit.completions || []} 
                  frequency={habit.frequency}
                />
              </MetaItem>
              
              {habit.category && (
                <MetaItem>
                  <span>🏷️ {habit.category}</span>
                </MetaItem>
              )}
            </HabitMeta>
          </HabitContent>
          
          <HabitActions>
            <Button
              size="small"
              variant="secondary"
              onClick={() => onEdit(habit)}
            >
              Edit
            </Button>
            
            <Button
              size="small"
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          </HabitActions>
        </HabitHeader>

        <TodaySection>
          <TodayLabel>Today's Progress</TodayLabel>
          <TodayButton
            size="small"
            variant={isTodayCompleted ? "success" : "primary"}
            $completed={isTodayCompleted}
            onClick={handleTodayToggle}
          >
            {isTodayCompleted ? "✓ Completed" : "Mark Complete"}
          </TodayButton>
        </TodaySection>

        <ExpandButton onClick={() => setExpanded(!expanded)}>
          {expanded ? "Hide Calendar ▲" : "Show Calendar ▼"}
        </ExpandButton>

        {expanded && (
          <ExpandedContent>
            <HabitCalendar 
              habit={habit}
              onToggleDate={onToggleCompletion}
            />
          </ExpandedContent>
        )}
      </HabitCard>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Habit"
        message={`Are you sure you want to delete "${habit.title}"? This will also delete all completion records.`}
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
};

export default HabitItem;