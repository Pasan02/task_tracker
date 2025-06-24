import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Modal } from '../common';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:invalid {
    border-color: #ef4444;
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
`;

const HelpText = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
  font-style: italic;
`;

const HabitForm = ({ 
  isOpen = false,  // Added isOpen prop
  habit = null, 
  onSubmit,
  onClose,  // Changed from onCancel to onClose for consistency
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

  // Wrap the form with Modal component, just like TaskForm
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={habit ? 'Edit Habit' : 'Create New Habit'}
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Habit Name *</Label>
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
            onClick={onClose}  // Changed from onCancel to onClose
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
    </Modal>
  );
};

export default HabitForm;