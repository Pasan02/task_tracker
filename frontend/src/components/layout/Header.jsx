import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../common';

const HeaderContainer = styled.header`
  background: var(--color-header-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-5);
  height: var(--header-height, 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-hover);
    color: var(--color-text-primary);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: inherit;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: var(--color-primary-500);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const CenterSection = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 var(--space-5);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--space-2) var(--space-3) var(--space-2) 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background-color: var(--color-input-bg);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: var(--color-text-tertiary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px var(--color-focus);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ThemeToggle = styled.button`
  background: none;
  border: 1px solid #e5e7eb;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.125rem;
  color: #6b7280;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #d1d5db;
    background-color: #f9fafb;
    color: #374151;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  line-height: 1.2;
`;

const UserStatus = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.2;
`;

const NotificationBadge = styled.div`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    background-color: #ef4444;
    border-radius: 50%;
    border: 2px solid white;
    display: ${props => props.$hasNotifications ? 'block' : 'none'};
  }
`;

const MobileSearchButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: #6b7280;
  font-size: 1.125rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  margin-left: 8px;
  padding: 8px;
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-hover);
    color: var(--color-text-primary);
  }
`;

const Header = ({ 
  onToggleSidebar,
  onToggleTheme,
  isDarkMode = false,
  searchQuery = '',
  onSearchChange,
  onCreateTask,
  onCreateHabit,
  pendingTasksCount = 0,
  userName = 'User'
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search functionality
  };

  // Handle theme toggle with logging to verify it's working
  const handleToggleTheme = () => {
    console.log('Toggling theme from', isDarkMode ? 'dark' : 'light');
    if (onToggleTheme) {
      onToggleTheme();
    }
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onToggleSidebar}>
          ☰
        </MenuButton>
        
        <Logo>
          <LogoIcon>📋</LogoIcon>
          <LogoText>TaskFlow</LogoText>
        </Logo>
      </LeftSection>

      <CenterSection>
        <SearchContainer>
          <form onSubmit={handleSearchSubmit}>
            <SearchInput
              type="text"
              placeholder="Search tasks and habits..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
            <SearchIcon>🔍</SearchIcon>
          </form>
        </SearchContainer>
      </CenterSection>

      <RightSection>
        <MobileSearchButton onClick={() => setShowMobileSearch(!showMobileSearch)}>
          🔍
        </MobileSearchButton>

        <QuickActions>
          <Button 
            size="small" 
            variant="primary"
            onClick={onCreateTask}
          >
            + Task
          </Button>
          <Button 
            size="small" 
            variant="secondary"
            onClick={onCreateHabit}
          >
            + Habit
          </Button>
        </QuickActions>

        {/* Keep ONLY this theme toggle button */}
        <ThemeToggleButton 
          onClick={handleToggleTheme} 
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </ThemeToggleButton>

        <ProfileSection>
          <Avatar>
            {getUserInitials(userName)}
          </Avatar>
          <UserInfo>
            <UserName>{userName}</UserName>
            <UserStatus>
              {pendingTasksCount > 0 
                ? `${pendingTasksCount} pending` 
                : 'All caught up!'
              }
            </UserStatus>
          </UserInfo>
        </ProfileSection>

        {/* Remove the second theme toggle button that was here */}
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;