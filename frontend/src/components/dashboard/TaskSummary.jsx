import React from 'react';
import styled from 'styled-components';

const SummaryCard = styled.div`
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

const AddButton = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  color: #6b7280;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.$bgColor || '#f9fafb'};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.$color || '#111827'};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #10b981;
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
`;

const PriorityBreakdown = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const PriorityItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
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