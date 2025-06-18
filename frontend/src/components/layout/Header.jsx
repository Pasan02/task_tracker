import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../common';

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: #6b7280;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const CenterSection = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
  
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
  padding: 8px 12px 8px 40px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 0.875rem;
  background-color: #f9fafb;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
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

        <NotificationBadge $hasNotifications={pendingTasksCount > 0}>
          <ThemeToggle onClick={onToggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
          </ThemeToggle>
        </NotificationBadge>

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
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;