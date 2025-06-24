import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { TaskProvider } from './context/TaskContext';
import { HabitProvider } from './context/HabitContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import HabitsPage from './pages/HabitsPage';

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
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/habits" element={<HabitsPage />} />
      </Routes>
    </Layout>
  );
};

export default App;