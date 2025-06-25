import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Modal } from '../common';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  max-height: 70vh;
  overflow-y: auto;
  padding-right: var(--space-3);
  
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: var(--border-radius-full);
    margin: var(--space-2) 0;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    border-radius: var(--border-radius-full);
    
    &:hover {
      background-color: var(--color-text-tertiary);
    }
  }
  
  .dark-mode & {
    scrollbar-color: var(--color-border-light) transparent;
    
    &::-webkit-scrollbar-thumb {
      background-color: var(--color-border-light);
      
      &:hover {
        background-color: var(--color-text-tertiary);
      }
    }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  position: relative;
  transition: all 0.2s ease;
  
  &:focus-within {
    transform: translateY(-2px);
  }
`;

const Label = styled.label`
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: color 0.2s ease;
  
  ${FormGroup}:focus-within & {
    color: var(--color-primary-500);
  }
`;

const inputStyles = `
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  background-color: var(--color-input-bg);
  color: var(--color-text-primary);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px var(--color-focus);
  }
  
  &:hover:not(:focus):not(:disabled) {
    border-color: var(--color-primary-300);
    background-color: var(--color-hover);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .dark-mode & {
    border-color: var(--color-border-light);
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const TextArea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.5;
`;

const Select = styled.select`
  ${inputStyles}
  cursor: pointer;
  
  option {
    background-color: var(--color-input-bg);
    color: var(--color-text-primary);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  margin-top: var(--space-3);
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.span`
  color: var(--color-error-500);
  font-size: var(--font-size-xs);
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  
  &::before {
    content: '⚠️';
    font-size: 0.75rem;
  }
  
  animation: fadeIn 0.2s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Required = styled.span`
  color: var(--color-error-500);
  margin-left: var(--space-1);
`;

const TaskForm = ({ 
  isOpen = false,
  task = null, 
  onSubmit, 
  onClose,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    category: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        category: task.category || ''
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      dueDate: formData.dueDate || null
    };
    
    onSubmit(taskData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="title">
          Title <Required>*</Required>
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter task title"
          required
        />
        {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter task description (optional)"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleInputChange}
        />
        {errors.dueDate && <ErrorMessage>{errors.dueDate}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="priority">Priority</Label>
        <Select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleInputChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Enter category (optional)"
        />
      </FormGroup>

      <FormActions>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </FormActions>
    </Form>
  );
};

export default TaskForm;