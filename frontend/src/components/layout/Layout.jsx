import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-surface);
`;

const MainContent = styled.main`
  transition: margin-left 0.3s ease;
  padding-top: var(--header-height, 64px);

  @media (min-width: 769px) {
    margin-left: var(--sidebar-width, 280px);
  }
`;

const ContentArea = styled.div`
  padding: var(--space-5);
  
  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorBoundary = styled.div`
  padding: var(--space-10) var(--space-5);
  text-align: center;
  background-color: var(--color-error-50);
  border: 1px solid var(--color-error-200);
  border-radius: var(--border-radius-lg);
  margin: var(--space-5);
`;

const ErrorTitle = styled.h2`
  color: var(--color-error-600);
  margin: 0 0 var(--space-3) 0;
  font-size: 1.25rem;
`;

const ErrorMessage = styled.p`
  color: var(--color-error-800);
  margin: 0 0 var(--space-5) 0;
`;

const RetryButton = styled.button`
  background-color: var(--color-error-600);
  color: white;
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: var(--color-error-700);
  }
`;

const Layout = ({ 
  children,
  activeRoute = 'dashboard',
  onNavigate,
  onCreateTask,
  onCreateHabit,
  onToggleTheme,
  isDarkMode = false,
  searchQuery = '',
  onSearchChange,
  loading = false,
  error = null,
  onRetry,
  stats = {
    totalTasks: 0,
    completedTasks: 0,
    totalHabits: 0,
    todayHabits: 0,
    overdueTasks: 0,
    upcomingTasks: 0,
    todayTasks: 0
  },
  userName = 'User'
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [activeRoute]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const pendingTasksCount = stats.overdueTasks + stats.todayTasks;

  if (error) {
    return (
      <LayoutContainer>
        <ErrorBoundary>
          <ErrorTitle>⚠️ Something went wrong</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          {onRetry && (
            <RetryButton onClick={onRetry}>
              Try Again
            </RetryButton>
          )}
        </ErrorBoundary>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      
      <Header
        onToggleSidebar={handleToggleSidebar}
        onToggleTheme={onToggleTheme}
        isDarkMode={isDarkMode}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onCreateTask={onCreateTask}
        onCreateHabit={onCreateHabit}
        pendingTasksCount={pendingTasksCount}
        userName={userName}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        onCreateTask={onCreateTask}
        onCreateHabit={onCreateHabit}
        stats={stats}
      />

      <MainContent>
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;