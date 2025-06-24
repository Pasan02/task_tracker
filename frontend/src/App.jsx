import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { TaskProvider } from './context/TaskContext';
import { HabitProvider } from './context/HabitContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import HabitsPage from './pages/HabitsPage';
import './styles/themes.css';

function App() {
  return (
    <Router>
      <AppProvider>
        <TaskProvider>
          <HabitProvider>
            <AppContent />
          </HabitProvider>
        </TaskProvider>
      </AppProvider>
    </Router>
  );
}

const AppContent = () => {
  const { theme, toggleTheme } = useApp();
  const isDarkMode = theme === 'dark';
  
  // Ensure body class is synchronized with theme on every render
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  
  return (
    <Routes>
      {/* Public routes - accessible without login */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <Layout isDarkMode={isDarkMode} onToggleTheme={toggleTheme}>
          <DashboardPage />
        </Layout>
      } />
      <Route path="/tasks" element={
        <Layout isDarkMode={isDarkMode} onToggleTheme={toggleTheme}>
          <TasksPage />
        </Layout>
      } />
      <Route path="/habits" element={
        <Layout isDarkMode={isDarkMode} onToggleTheme={toggleTheme}>
          <HabitsPage />
        </Layout>
      } />
    </Routes>
  );
};

export default App;