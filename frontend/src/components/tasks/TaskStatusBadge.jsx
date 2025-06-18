import React from 'react';
import styled, { css } from 'styled-components';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => props.$status === 'todo' && css`
    background-color: #f3f4f6;
    color: #374151;
  `}
  
  ${props => props.$status === 'in-progress' && css`
    background-color: #dbeafe;
    color: #1d4ed8;
  `}
  
  ${props => props.$status === 'done' && css`
    background-color: #dcfce7;
    color: #16a34a;
  `}
`;

const StatusIcon = styled.span`
  font-size: 0.875rem;
`;

const getStatusIcon = (status) => {
  switch (status) {
    case 'todo':
      return '⏳';
    case 'in-progress':
      return '🔄';
    case 'done':
      return '✅';
    default:
      return '📝';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in-progress':
      return 'In Progress';
    case 'done':
      return 'Done';
    default:
      return status;
  }
};

const TaskStatusBadge = ({ status }) => {
  return (
    <Badge $status={status}>
      <StatusIcon>{getStatusIcon(status)}</StatusIcon>
      {getStatusLabel(status)}
    </Badge>
  );
};

export default TaskStatusBadge;