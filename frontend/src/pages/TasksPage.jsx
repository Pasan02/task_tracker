import React, { useState, useEffect } from 'react';
import { 
  PageContainer, 
  PageHeader,
  PageTitle,
  CountBadge,
  HeaderActions,
  ViewToggle,
  ViewButton,
  StatsBar,
  StatItem,
  StatNumber,
  StatLabel,
  ContentContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyMessage,
  ErrorContainer
} from '../styles/PageStyles';
import TaskList from '../components/tasks/TaskList';
import TaskFilter from '../components/tasks/TaskFilter';
import useTasks from '../hooks/useTasks';
import { useApp } from '../context/AppContext';
import { Button, Loading } from '../components/common';

const TasksPage = ({ initialFilter }) => {
  const [currentView, setCurrentView] = useState('list');

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
    closeConfirmDialog,
    openTaskForm // Add openTaskForm to context methods
  } = useApp();

  // Set active route when component mounts
  useEffect(() => {
    // Log the received filter for debugging
    console.log('TasksPage initialFilter:', initialFilter);
    
    // Set active route based on filter
    let route = '/tasks';
    if (initialFilter) {
      route = `/tasks/${initialFilter}`;
    }
    setActiveRoute(route);
    
    // Apply initial filter
    if (initialFilter) {
      let filterObj = {};
      
      switch (initialFilter) {
        case 'today':
          filterObj = { dueDate: 'today' };
          break;
        case 'upcoming':
          filterObj = { upcoming: 'true' };
          break;
        case 'overdue':
          filterObj = { overdue: 'true' };
          break;
        default:
          filterObj = {};
      }
      
      updateFilters(filterObj);
    } else {
      // Clear filters for regular tasks page
      clearFilters();
    }
  }, [initialFilter, setActiveRoute]); // Add setActiveRoute to dependencies

  // Event handlers
  const handleCreateTask = () => {
    // Use the AppContext openTaskForm instead of local state
    openTaskForm();
  };

  const handleEditTask = (task) => {
    // Use the AppContext to open form with the task
    openTaskForm(task);
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
            <CountBadge>{taskStats.total}</CountBadge>
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
            size="small" // Change to small for consistency
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
    </PageContainer>
  );
};

export default TasksPage;