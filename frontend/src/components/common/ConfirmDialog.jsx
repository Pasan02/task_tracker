import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import Button from './Button';

const DialogContainer = styled.div`
  text-align: center;
`;

const Message = styled.p`
  margin: 0 0 24px 0;
  color: #374151;
  font-size: 1rem;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

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
    >
      <DialogContainer>
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