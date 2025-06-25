import styled from 'styled-components';

// Common styled components for both TasksPage and HabitsPage
export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
  padding: 0;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  
  @media (max-width: 768px) {
    padding: 0 12px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, 
      transparent, 
      var(--color-border), 
      transparent
    );
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 60px;
    height: 3px;
    background: var(--color-primary-500);
    border-radius: var(--border-radius-full);
    transition: width 0.3s ease;
  }
  
  &:hover::before {
    width: 100px;
  }
`;

export const CountBadge = styled.span`
  background: linear-gradient(to bottom right, var(--color-primary-400), var(--color-primary-600));
  color: white;
  padding: 6px 16px;
  border-radius: var(--border-radius-full);
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: var(--shadow-sm), 0 2px 6px rgba(var(--color-primary-rgb), 0.15);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md), 0 4px 8px rgba(var(--color-primary-rgb), 0.2);
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  gap: 2px;
  background-color: var(--color-surface-secondary);
  border-radius: var(--border-radius-full);
  padding: 3px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
`;

export const ViewButton = styled.button`
  background: ${props => props.$active ? 'var(--color-surface)' : 'transparent'};
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius-full);
  font-size: 0.875rem;
  cursor: pointer;
  color: ${props => props.$active ? 'var(--color-primary-600)' : 'var(--color-text-secondary)'};
  font-weight: ${props => props.$active ? '600' : '500'};
  box-shadow: ${props => props.$active ? 'var(--shadow-sm)' : 'none'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: ${props => props.$active ? 'var(--color-primary-700)' : 'var(--color-text-primary)'};
    background-color: ${props => props.$active ? 'var(--color-surface)' : 'var(--color-hover)'};
  }
`;

export const StatsBar = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  margin-bottom: 24px;
  flex-wrap: wrap;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
    
    & > * {
      flex-basis: calc(50% - 6px);
    }
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
  flex: 1;
  padding: 12px;
  border-radius: var(--border-radius-lg);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: var(--color-surface-secondary);
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 2px;
    background-color: ${props => props.$color || 'var(--color-text-primary)'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 0.7;
  }
`;

export const StatNumber = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.$color || 'var(--color-text-primary)'};
  margin-bottom: 4px;
  position: relative;
  transition: transform 0.3s ease;
  
  ${StatItem}:hover & {
    transform: scale(1.1);
  }
`;

export const StatLabel = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.4s ease-out;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, var(--color-info-300), var(--color-info-500));
  }
`;

export const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 24px;
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

export const EmptyTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

export const EmptyMessage = styled.p`
  margin: 0 0 32px 0;
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

export const ErrorContainer = styled.div`
  padding: var(--space-4);
  background: var(--color-error-50);
  border: 1px solid var(--color-error-200);
  border-radius: var(--border-radius-md);
  color: var(--color-error-700);
  margin-bottom: var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Add responsive layout to FilterContainer
export const FilterContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;