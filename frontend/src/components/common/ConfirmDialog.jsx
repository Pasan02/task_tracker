import React from 'react';
import styled, { keyframes } from 'styled-components';
import Modal from './Modal';
import Button from './Button';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DialogContainer = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Message = styled.p`
  margin: 0 0 28px 0;
  color: var(--color-text-primary);
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  
  ${props => props.$variant === 'danger' && `
    background-color: var(--color-error-100);
    color: var(--color-error-600);
  `}
  
  ${props => props.$variant === 'primary' && `
    background-color: var(--color-primary-100);
    color: var(--color-primary-600);
  `}
  
  ${props => props.$variant === 'success' && `
    background-color: var(--color-success-100);
    color: var(--color-success-600);
  `}
`;

const getIconForVariant = (variant) => {
  switch (variant) {
    case 'danger':
      return '⚠️';
    case 'success':
      return '✅';
    default:
      return '❓';
  }
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      closeOnOverlayClick={!loading}
      showCloseButton={!loading}
    >
      <DialogContainer>
        <IconContainer $variant={variant}>
          {getIconForVariant(variant)}
        </IconContainer>
        <Message>{message}</Message>
        <Actions>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </Actions>
      </DialogContainer>
    </Modal>
  );
};

export default ConfirmDialog;