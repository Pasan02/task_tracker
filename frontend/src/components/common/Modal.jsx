import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: ${slideUp} 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  border: 1px solid var(--color-border);
  
  ${props => props.$size === 'small' && css`
    width: 100%;
    max-width: 420px;
  `}
  
  ${props => props.$size === 'medium' && css`
    width: 100%;
    max-width: 600px;
  `}
  
  ${props => props.$size === 'large' && css`
    width: 100%;
    max-width: 800px;
  `}
  
  .dark-mode & {
    border-color: var(--color-border-light);
  }
  
  @media (max-width: 640px) {
    width: 95%;
    max-height: 85vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(to right, var(--color-surface), var(--color-surface-secondary));
  border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  
  .dark-mode & {
    background: var(--color-surface);
    border-color: var(--color-border-light);
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-hover);
    color: var(--color-text-primary);
    transform: rotate(90deg);
  }
`;

const ModalContent = styled.div`
  padding: 24px;
  color: var(--color-text-primary);
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true 
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer $size={size}>
        {(title || showCloseButton) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            {showCloseButton && (
              <CloseButton 
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </CloseButton>
            )}
          </ModalHeader>
        )}
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </Overlay>,
    document.body
  );
};

export default Modal;