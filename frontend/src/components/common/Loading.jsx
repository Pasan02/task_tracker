import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const pulse = keyframes`
  0%, 100% { transform: scale(0.8); opacity: 0.4; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  ${props => props.$overlay && css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-overlay);
    backdrop-filter: blur(5px);
    z-index: 999;
  `}
  
  ${props => props.$size === 'small' && css`
    padding: 16px;
  `}
  
  ${props => props.$size === 'medium' && css`
    padding: 32px;
  `}
  
  ${props => props.$size === 'large' && css`
    padding: 48px;
  `}
`;

const SpinnerContainer = styled.div`
  display: flex;
  gap: 6px;
  
  ${props => props.$size === 'small' && css`
    gap: 4px;
  `}
  
  ${props => props.$size === 'large' && css`
    gap: 8px;
  `}
`;

const Dot = styled.div`
  border-radius: 50%;
  background: linear-gradient(to bottom, var(--color-primary-400), var(--color-primary-600));
  box-shadow: 0 2px 5px rgba(var(--color-primary-rgb), 0.3);
  animation: ${bounce} 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) infinite alternate;
  
  ${props => props.$size === 'small' && css`
    width: 8px;
    height: 8px;
  `}
  
  ${props => props.$size === 'medium' && css`
    width: 12px;
    height: 12px;
  `}
  
  ${props => props.$size === 'large' && css`
    width: 16px;
    height: 16px;
  `}
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
  
  &:nth-child(3) {
    animation-delay: 0s;
  }
  
  .dark-mode & {
    background: linear-gradient(to bottom, var(--color-primary-300), var(--color-primary-500));
  }
`;

const Message = styled.p`
  margin: 20px 0 0 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  animation: ${pulse} 2s ease infinite;
  
  ${props => props.$size === 'large' && css`
    font-size: 1.1rem;
    margin-top: 24px;
  `}
  
  .dark-mode & {
    color: var(--color-text-secondary);
  }
`;

const Loading = ({ 
  size = 'medium', 
  message = 'Loading...', 
  overlay = false,
  className = '' 
}) => {
  return (
    <LoadingContainer 
      $size={size} 
      $overlay={overlay}
      className={className}
    >
      <SpinnerContainer $size={size}>
        <Dot $size={size} />
        <Dot $size={size} />
        <Dot $size={size} />
      </SpinnerContainer>
      {message && <Message $size={size}>{message}</Message>}
    </LoadingContainer>
  );
};

export default Loading;