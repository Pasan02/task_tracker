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

const HelpText = styled.span`
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  margin-top: var(--space-1);
  font-style: italic;
  line-height: 1.4;
`;

const Required = styled.span`
  color: var(--color-error-500);
  margin-left: var(--space-1);
`;

const HabitForm = ({ 
  isOpen = false,
  habit = null, 
  onSubmit,
  onClose,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    category: '',
    targetCount: 1
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (habit) {
      setFormData({
        title: habit.title || '',
        description: habit.description || '',
        frequency: habit.frequency || 'daily',
        category: habit.category || '',
        targetCount: habit.targetCount || 1
      });
    }
  }, [habit]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.targetCount < 1) {
      newErrors.targetCount = 'Target count must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
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
    
    const habitData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      completions: habit?.completions || []
    };
    
    onSubmit(habitData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="title">
          Habit Name <Required>*</Required>
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Drink 8 glasses of water"
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
          placeholder="Add details about your habit (optional)"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="frequency">Frequency</Label>
        <Select
          id="frequency"
          name="frequency"
          value={formData.frequency}
          onChange={handleInputChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </Select>
        <HelpText>
          {formData.frequency === 'daily' 
            ? 'Track this habit every day' 
            : 'Track this habit once per week'
          }
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="targetCount">Target Count</Label>
        <Input
          id="targetCount"
          name="targetCount"
          type="number"
          min="1"
          max="100"
          value={formData.targetCount}
          onChange={handleInputChange}
        />
        <HelpText>
          How many times per {formData.frequency === 'daily' ? 'day' : 'week'} do you want to complete this habit?
        </HelpText>
        {errors.targetCount && <ErrorMessage>{errors.targetCount}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          type="text"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="e.g., Health, Productivity, Learning"
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
          {habit ? 'Update Habit' : 'Create Habit'}
        </Button>
      </FormActions>
    </Form>
  );
};

export default HabitForm;