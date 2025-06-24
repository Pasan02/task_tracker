import React from 'react';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';

const NavContainer = styled.nav`
  margin-bottom: var(--space-8);
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$active ? '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background-color: ${props => props.$active ? '#2563eb' : '#f3f4f6'};
    color: ${props => props.$active ? 'white' : '#374151'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const NavIcon = styled.span`
  font-size: 1.125rem;
  min-width: 20px;
  text-align: center;
`;

const NavLabel = styled.span`
  flex: 1;
`;

const NavBadge = styled.span`
  background-color: ${props => props.$variant === 'danger' ? '#ef4444' : '#6b7280'};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

const NavSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Navigation = ({ 
  activeRoute = 'dashboard',
  onNavigate,
  taskCounts = {
    total: 0,
    overdue: 0,
    today: 0,
    upcoming: 0
  },
  habitCounts = {
    total: 0,
    today: 0
  }
}) => {
  const { setActiveRoute } = useApp();
  
  const navItems = [
    {
      id: 'dashboard',
      icon: '📊',
      label: 'Dashboard',
      route: '/dashboard'
    },
    {
      id: 'tasks',
      icon: '📋',
      label: 'All Tasks',
      badge: taskCounts.total > 0 ? taskCounts.total : null,
      route: '/tasks'
    },
    {
      id: 'tasks-today',
      icon: '📅',
      label: 'Today',
      badge: taskCounts.today > 0 ? taskCounts.today : null,
      route: '/tasks/today'
    },
    {
      id: 'tasks-upcoming',
      icon: '⏰',
      label: 'Upcoming',
      badge: taskCounts.upcoming > 0 ? taskCounts.upcoming : null,
      route: '/tasks/upcoming'
    },
    {
      id: 'tasks-overdue',
      icon: '⚠️',
      label: 'Overdue',
      badge: taskCounts.overdue > 0 ? taskCounts.overdue : null,
      badgeVariant: taskCounts.overdue > 0 ? 'danger' : 'default',
      route: '/tasks/overdue'
    },
    {
      id: 'habits',
      icon: '🎯',
      label: 'All Habits',
      badge: habitCounts.total > 0 ? habitCounts.total : null,
      route: '/habits'
    },
    {
      id: 'habits-today',
      icon: '✅',
      label: 'Today\'s Habits',
      badge: habitCounts.today > 0 ? habitCounts.today : null,
      route: '/habits/today'
    }
  ];

  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  const sectionTitles = {
    main: 'Overview',
    tasks: 'Tasks',
    habits: 'Habits'
  };

  const handleNavigation = (route) => {
    setActiveRoute(route);
    if (onNavigate) {
      onNavigate(route);
    }
  };

  return (
    <NavContainer>
      {Object.entries(groupedItems).map(([section, items]) => (
        <NavSection key={section}>
          <SectionTitle>{sectionTitles[section]}</SectionTitle>
          {items.map(item => (
            <NavItem
              key={item.id}
              $active={activeRoute === item.route}
              onClick={() => handleNavigation(item.route)}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavLabel>{item.label}</NavLabel>
              {item.badge && (
                <NavBadge $variant={item.badgeVariant}>
                  {item.badge}
                </NavBadge>
              )}
            </NavItem>
          ))}
        </NavSection>
      ))}
    </NavContainer>
  );
};

export default Navigation;