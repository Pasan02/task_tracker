import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid transparent;
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  /* Add the ripple effect container */
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform .5s, opacity 0.8s;
  }
  
  &:active::after {
    transform: scale(0, 0);
    opacity: .3;
    transition: 0s;
  }
  
  /* Size variants */
  ${props => props.$size === 'small' && css`
    padding: 6px 14px;
    font-size: 0.875rem;
    min-height: 32px;
  `}
  
  ${props => props.$size === 'medium' && css`
    padding: 8px 18px;
    font-size: 1rem;
    min-height: 40px;
  `}
  
  ${props => props.$size === 'large' && css`
    padding: 12px 28px;
    font-size: 1.125rem;
    min-height: 48px;
  `}
  
  /* Variant styles */
  ${props => props.$variant === 'primary' && css`
    background: linear-gradient(to right, var(--color-primary-500), var(--color-primary-600));
    color: white;
    box-shadow: var(--shadow-sm), 0 1px 3px rgba(var(--color-primary-rgb), 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(to right, var(--color-primary-400), var(--color-primary-500));
      transform: translateY(-2px);
      box-shadow: var(--shadow-md), 0 6px 12px rgba(var(--color-primary-rgb), 0.4);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      background: linear-gradient(to right, var(--color-primary-600), var(--color-primary-700));
      box-shadow: var(--shadow-sm), 0 2px 4px rgba(var(--color-primary-rgb), 0.4);
    }
    
    /* Primary button shimmer effect */
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg, 
        transparent, 
        rgba(255, 255, 255, 0.2), 
        transparent
      );
      animation: ${shimmer} 2s infinite;
    }
    
    /* Dark mode adjustments */
    .dark-mode & {
      box-shadow: var(--shadow-sm), 0 1px 3px rgba(var(--color-primary-rgb), 0.5);
      
      &:hover:not(:disabled) {
        box-shadow: var(--shadow-md), 0 6px 12px rgba(var(--color-primary-rgb), 0.6);
      }
    }
  `}
  
  ${props => props.$variant === 'secondary' && css`
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    border-color: var(--color-border);
    
    &:hover:not(:disabled) {
      background-color: var(--color-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm), 0 2px 4px rgba(0, 0, 0, 0.05);
      border-color: var(--color-primary-300);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
    
    .dark-mode & {
      background-color: var(--color-surface-secondary);
      
      &:hover:not(:disabled) {
        background-color: var(--color-hover);
      }
    }
  `}
  
  ${props => props.$variant === 'danger' && css`
    background: linear-gradient(to right, var(--color-error-500), var(--color-error-600));
    color: white;
    box-shadow: var(--shadow-sm), 0 1px 2px rgba(var(--color-error-rgb), 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(to right, var(--color-error-400), var(--color-error-500));
      transform: translateY(-2px);
      box-shadow: var(--shadow-md), 0 4px 8px rgba(var(--color-error-rgb), 0.4);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      background: linear-gradient(to right, var(--color-error-600), var(--color-error-700));
      box-shadow: var(--shadow-sm), 0 2px 4px rgba(var(--color-error-rgb), 0.4);
    }
  `}
  
  ${props => props.$variant === 'success' && css`
    background: linear-gradient(to right, var(--color-success-500), var(--color-success-600));
    color: white;
    box-shadow: var(--shadow-sm), 0 1px 2px rgba(var(--color-success-rgb), 0.3);
    
    &:hover:not(:disabled) {
      background: linear-gradient(to right, var(--color-success-400), var(--color-success-500));
      transform: translateY(-2px);
      box-shadow: var(--shadow-md), 0 4px 8px rgba(var(--color-success-rgb), 0.4);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      background: linear-gradient(to right, var(--color-success-600), var(--color-success-700));
      box-shadow: var(--shadow-sm), 0 2px 4px rgba(var(--color-success-rgb), 0.4);
    }
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  /* Loading state */
  ${props => props.$loading && css`
    cursor: not-allowed;
    color: transparent !important;
    position: relative;
  `}
`;

const Spinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  
  ${props => props.$size === 'small' && css`
    width: 14px;
    height: 14px;
    border-width: 2px;
  `}
  
  ${props => props.$size === 'large' && css`
    width: 20px;
    height: 20px;
    border-width: 2px;
  `}
  
  .dark-mode & {
    border-color: rgba(0, 0, 0, 0.2);
    border-top-color: white;
  }
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
      {loading && <Spinner $size={size} />}
      {children}
    </StyledButton>
  );
};

export default Button;