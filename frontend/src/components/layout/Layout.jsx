import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 769px) {
    margin-left: 280px;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  margin-top: 64px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorBoundary = styled.div`
  padding: 40px 20px;
  text-align: center;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin: 20px;
`;

const ErrorTitle = styled.h2`
  color: #dc2626;
  margin: 0 0 12px 0;
  font-size: 1.25rem;
`;

const ErrorMessage = styled.p`
  color: #7f1d1d;
  margin: 0 0 20px 0;
`;

const RetryButton = styled.button`
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #b91c1c;
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