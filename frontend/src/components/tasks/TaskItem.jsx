import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button, ConfirmDialog } from '../common';
import TaskStatusBadge from './TaskStatusBadge';

const TaskCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  ${props => props.$completed && css`
    opacity: 0.7;
    background-color: #f9fafb;
  `}
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  
  ${props => props.$completed && css`
    text-decoration: line-through;
    color: #6b7280;
  `}
`;

const TaskDescription = styled.p`
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 0.875rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
`;

const PriorityBadge = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => props.$priority === 'high' && css`
    background-color: #fee2e2;
    color: #dc2626;
  `}
  
  ${props => props.$priority === 'medium' && css`
    background-color: #fef3c7;
    color: #d97706;
  `}
  
  ${props => props.$priority === 'low' && css`
    background-color: #dcfce7;
    color: #16a34a;
  `}
`;

const TaskActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    onToggleStatus(task.id, newStatus);
  };

  const overdue = isOverdue(task.dueDate) && task.status !== 'done';

  return (
    <>
      <TaskCard $completed={task.status === 'done'}>
        <TaskHeader>
          <TaskContent>
            <TaskTitle $completed={task.status === 'done'}>
              {task.title}
            </TaskTitle>
            
            {task.description && (
              <TaskDescription>{task.description}</TaskDescription>
            )}
            
            <TaskMeta>
              <MetaItem>
                <TaskStatusBadge status={task.status} />
              </MetaItem>
              
              {task.priority && (
                <MetaItem>
                  <PriorityBadge $priority={task.priority}>
                    {task.priority} priority
                  </PriorityBadge>
                </MetaItem>
              )}
              
              <MetaItem>
                <span style={{ color: overdue ? '#dc2626' : '#6b7280' }}>
                  📅 {formatDate(task.dueDate)}
                  {overdue && ' (Overdue)'}
                </span>
              </MetaItem>
              
              {task.category && (
                <MetaItem>
                  <span>🏷️ {task.category}</span>
                </MetaItem>
              )}
            </TaskMeta>
          </TaskContent>
        </TaskHeader>
        
        <TaskActions>
          <Button
            size="small"
            variant={task.status === 'done' ? 'secondary' : 'success'}
            onClick={handleStatusToggle}
          >
            {task.status === 'done' ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
          
          <Button
            size="small"
            variant="secondary"
            onClick={() => onEdit(task)}
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
        </TaskActions>
      </TaskCard>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
};

export default TaskItem;