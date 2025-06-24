import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { TaskProvider } from './context/TaskContext';
import { HabitProvider } from './context/HabitContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import HabitsPage from './pages/HabitsPage';
import { useDarkMode } from './hooks/useDarkMode';
import { useApp } from './context/AppContext';


const AppContent = () => {
  const {
    activeRoute,
    setActiveRoute,
    searchQuery,
    setSearchQuery,
    isDarkMode
  } = useApp();

  const { toggle: toggleTheme } = useDarkMode();

  const handleNavigate = (route) => {
    setActiveRoute(route);
  };

  const handleCreateTask = () => {
    // Will be handled by context
  };

  const handleCreateHabit = () => {
    // Will be handled by context
  };

  return (
    <Router>
      <Layout
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onCreateTask={handleCreateTask}
        onCreateHabit={handleCreateHabit}
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/habits" element={<HabitsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <TaskProvider>
        <HabitProvider>
          <AppContent />
        </HabitProvider>
      </TaskProvider>
    </AppProvider>
  );
}

export default App;