import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Button } from '../common';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeaderContainer = styled.header`
  background: var(--color-header-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-6);
  height: var(--header-height, 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--border-radius-full);
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  display: none; /* Hidden by default */
  position: relative;
  z-index: 1010; /* Ensure it's always clickable */
  
  &:hover {
    background-color: var(--color-hover);
    color: var(--color-text-primary);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
  
  /* Show the menu button only on mobile */
  @media (max-width: 768px) {
    display: flex;
  }
  
  /* Add a larger touch target for mobile */
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    margin-left: -8px; /* Offset to align visually */
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
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 2px 5px rgba(var(--color-primary-rgb), 0.3);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05) rotate(5deg);
  }
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  background: linear-gradient(to right, var(--color-primary-500), var(--color-primary-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const CenterSection = styled.div`
  flex: 1;
  max-width: 500px;
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
  padding: var(--space-3) var(--space-3) var(--space-3) 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  background-color: var(--color-input-bg);
  color: var(--color-text-primary);
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-text-tertiary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.15);
    transform: translateY(-1px);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: 1rem;
  transition: color 0.2s ease;
  
  ${SearchContainer}:focus-within & {
    color: var(--color-primary-500);
  }
`;

const MobileSearchContainer = styled.div`
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  padding: 12px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  z-index: 999;
  box-shadow: var(--shadow-md);
  display: ${props => props.$show ? 'block' : 'none'};
  animation: ${fadeIn} 0.3s ease-out;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: var(--border-radius-full);
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    background-color: var(--color-hover);
    border-color: var(--color-border);
    transform: translateY(-1px);
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: var(--border-radius-full);
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-700));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-surface);
  transition: all 0.2s ease;
  
  ${ProfileSection}:hover & {
    transform: scale(1.05);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.2;
`;

const UserStatus = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.2;
`;

const MobileSearchButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-hover);
    color: var(--color-text-primary);
    transform: rotate(15deg);
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  padding: 8px;
  border-radius: var(--border-radius-full);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: var(--color-hover);
    color: ${props => props.$isDarkMode ? 'var(--color-warning-400)' : 'var(--color-primary-400)'};
    transform: scale(1.05) rotate(15deg);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle, 
      ${props => props.$isDarkMode ? 
        'rgba(var(--color-warning-rgb), 0.2)' : 
        'rgba(var(--color-primary-rgb), 0.2)'
      } 0%, 
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 50%;
    z-index: -1;
  }
  
  &:hover::after {
    opacity: 1;
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
  const [searchValue, setSearchValue] = useState(searchQuery);
  const searchInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Update internal state when prop changes
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);
  
  // Focus search input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    // Only call the parent handler if provided
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Additional search submit functionality could go here
    console.log('Searching for:', searchValue);
  };

  // Handle theme toggle
  const handleToggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
    }
  };

  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    // Toggle local state for visual feedback
    setIsSidebarOpen(prev => !prev);
    // Call parent handler which actually controls the sidebar
    if (onToggleSidebar) {
      onToggleSidebar();
    }
  };

  return (
    <>
      <HeaderContainer>
        <LeftSection>
          <MenuButton 
            onClick={handleToggleSidebar} 
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {/* Using a more styled hamburger menu icon */}
            <span role="img" aria-hidden="true" style={{fontSize: '1.5rem'}}>☰</span>
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
                value={searchValue}
                onChange={handleSearchChange}
                aria-label="Search tasks and habits"
              />
              <SearchIcon>🔍</SearchIcon>
            </form>
          </SearchContainer>
        </CenterSection>

        <RightSection>
          <MobileSearchButton 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label="Toggle search"
          >
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

          <ThemeToggleButton 
            onClick={handleToggleTheme}
            $isDarkMode={isDarkMode}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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
        </RightSection>
      </HeaderContainer>

      {/* Mobile Search Overlay */}
      <MobileSearchContainer $show={showMobileSearch}>
        <SearchContainer>
          <form onSubmit={handleSearchSubmit}>
            <SearchInput
              ref={searchInputRef}
              type="text"
              placeholder="Search tasks and habits..."
              value={searchValue}
              onChange={handleSearchChange}
              aria-label="Search tasks and habits mobile"
            />
            <SearchIcon>🔍</SearchIcon>
          </form>
        </SearchContainer>
      </MobileSearchContainer>
    </>
  );
};

export default Header;