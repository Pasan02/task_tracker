import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
  position: relative;
  
  /* Size variants */
  ${props => props.$size === 'small' && css`
    padding: 6px 12px;
    font-size: 0.875rem;
    min-height: 32px;
  `}
  
  ${props => props.$size === 'medium' && css`
    padding: 8px 16px;
    font-size: 1rem;
    min-height: 40px;
  `}
  
  ${props => props.$size === 'large' && css`
    padding: 12px 24px;
    font-size: 1.125rem;
    min-height: 48px;
  `}
  
  /* Variant styles */
  ${props => props.$variant === 'primary' && css`
    background-color: var(--color-primary-500);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--color-primary-600);
    }
  `}
  
  ${props => props.$variant === 'secondary' && css`
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    border-color: var(--color-border);
    
    &:hover:not(:disabled) {
      background-color: var(--color-hover);
    }
  `}
  
  ${props => props.$variant === 'danger' && css`
    background-color: var(--color-error-500);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--color-error-600);
    }
  `}
  
  ${props => props.$variant === 'success' && css`
    background-color: var(--color-success-500);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--color-success-600);
    }
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Loading state */
  ${props => props.$loading && css`
    cursor: not-allowed;
    color: transparent;
  `}
`;

const Spinner = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </StyledButton>
  );
};

export default Button;