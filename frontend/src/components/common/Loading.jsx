import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
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
    background-color: rgba(255, 255, 255, 0.8);
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
  gap: 4px;
  
  ${props => props.$size === 'small' && css`
    gap: 2px;
  `}
  
  ${props => props.$size === 'large' && css`
    gap: 6px;
  `}
`;

const Dot = styled.div`
  border-radius: 50%;
  background-color: #3b82f6;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  
  ${props => props.$size === 'small' && css`
    width: 6px;
    height: 6px;
  `}
  
  ${props => props.$size === 'medium' && css`
    width: 8px;
    height: 8px;
  `}
  
  ${props => props.$size === 'large' && css`
    width: 12px;
    height: 12px;
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
`;

const Message = styled.p`
  margin: 16px 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
  
  ${props => props.$size === 'large' && css`
    font-size: 1rem;
    margin-top: 20px;
  `}
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