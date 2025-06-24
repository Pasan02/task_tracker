import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TaskList from '../components/tasks/TaskList';
import TaskFilter from '../components/tasks/TaskFilter';
import TaskForm from '../components/tasks/TaskForm';
import useTasks from '../hooks/useTasks'; // Changed from named import to default import
import { useApp } from '../context/AppContext';
import { Button, Modal, Loading } from '../components/common';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TaskCount = styled.span`
  background-color: #dbeafe;
  color: #1d4ed8;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
  background-color: #f3f4f6;
  border-radius: 6px;
  padding: 2px;
`;

const ViewButton = styled.button`
  background: ${props => props.$active ? 'white' : 'transparent'};
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  color: ${props => props.$active ? '#111827' : '#6b7280'};
  font-weight: ${props => props.$active ? '500' : '400'};
  box-shadow: ${props => props.$active ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'};
  transition: all 0.2s ease;
  
  &:hover {
    color: #111827;
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
`;

const StatNumber = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.$color || '#111827'};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
`;

const EmptyMessage = styled.p`
  margin: 0 0 24px 0;
  color: #6b7280;
  font-size: 1rem;
`;

const ErrorContainer = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TasksPage = () => {
  const [currentView, setCurrentView] = useState('list');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const {
    tasks,
    allTasks,
    loading,
    error,
    stats,
    categories,
    filters,
    updateFilters,
    clearFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTasksByStatus,
    getTasksByPriority,
    categorizedTasks,
    clearError
  } = useTasks();

  const {
    setActiveRoute,
    openConfirmDialog,
    closeConfirmDialog
  } = useApp();

  // Set active route when component mounts
  useEffect(() => {
    setActiveRoute('tasks');
  }, [setActiveRoute]);

  // Event handlers
  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      handleCloseTaskForm();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDeleteTask = (taskId) => {
    const task = allTasks.find(t => t.id === taskId);
    openConfirmDialog({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task?.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteTask(taskId);
          closeConfirmDialog();
        } catch (error) {
          console.error('Failed to delete task:', error);
        }
      },
      onCancel: closeConfirmDialog
    });
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const statusMap = {
      'todo': 'in-progress',
      'in-progress': 'done',
      'done': 'todo'
    };
    
    const newStatus = statusMap[currentStatus] || 'todo';
    
    try {
      await toggleTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleRetry = () => {
    clearError();
  };

  // Calculate stats for display
  const taskStats = {
    total: allTasks.length,
    todo: getTasksByStatus('todo').length,
    inProgress: getTasksByStatus('in-progress').length,
    completed: getTasksByStatus('done').length,
    overdue: categorizedTasks.overdue.length,
    today: categorizedTasks.today.length
  };

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>
            📋 Tasks
            <TaskCount>{taskStats.total}</TaskCount>
          </PageTitle>
        </div>
        
        <HeaderActions>
          <ViewToggle>
            <ViewButton 
              $active={currentView === 'list'}
              onClick={() => setCurrentView('list')}
            >
              📄 List
            </ViewButton>
            <ViewButton 
              $active={currentView === 'board'}
              onClick={() => setCurrentView('board')}
            >
              📋 Board
            </ViewButton>
          </ViewToggle>
          
          <Button 
            variant="primary" 
            onClick={handleCreateTask}
          >
            ➕ Add Task
          </Button>
        </HeaderActions>
      </PageHeader>

      {error && (
        <ErrorContainer>
          <span>⚠️ {error}</span>
          <Button size="small" variant="secondary" onClick={handleRetry}>
            Retry
          </Button>
        </ErrorContainer>
      )}

      <StatsBar>
        <StatItem>
          <StatNumber $color="#6b7280">{taskStats.total}</StatNumber>
          <StatLabel>Total</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber $color="#dc2626">{taskStats.overdue}</StatNumber>
          <StatLabel>Overdue</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber $color="#d97706">{taskStats.today}</StatNumber>
          <StatLabel>Due Today</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber $color="#0369a1">{taskStats.inProgress}</StatNumber>
          <StatLabel>In Progress</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber $color="#16a34a">{taskStats.completed}</StatNumber>
          <StatLabel>Completed</StatLabel>
        </StatItem>
      </StatsBar>

      <ContentContainer>
        <TaskFilter
          filters={filters}
          categories={categories}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          taskCounts={taskStats}
        />

        {loading && tasks.length === 0 ? (
          <Loading message="Loading tasks..." />
        ) : tasks.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyTitle>No Tasks Found</EmptyTitle>
            <EmptyMessage>
              {allTasks.length === 0 
                ? "You haven't created any tasks yet. Create your first task to get started!"
                : "No tasks match your current filters. Try adjusting your filters or clearing them."
              }
            </EmptyMessage>
            {allTasks.length === 0 ? (
              <Button variant="primary" onClick={handleCreateTask}>
                Create Your First Task
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </EmptyState>
        ) : (
          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
            emptyMessage="No tasks match your current filters"
          />
        )}
      </ContentContainer>

      <Modal
        isOpen={showTaskForm}
        onClose={handleCloseTaskForm}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="medium"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={handleCloseTaskForm}
          loading={loading}
        />
      </Modal>
    </PageContainer>
  );
};

export default TasksPage;