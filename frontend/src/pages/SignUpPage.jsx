import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-100), var(--color-primary-50));
`;

const SignUpCard = styled.div`
  background-color: var(--color-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 480px;
  padding: var(--space-8);
  
  @media (max-width: 480px) {
    padding: var(--space-6);
    max-width: 90%;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--color-primary-500);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const Title = styled.h2`
  margin: 0 0 var(--space-6) 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const FormRow = styled.div`
  display: flex;
  gap: var(--space-4);
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--space-5);
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px var(--color-focus);
  }
`;

const HelperText = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  margin-top: var(--space-1);
`;

const ErrorMessage = styled.div`
  color: var(--color-error-600);
  background-color: var(--color-error-100);
  border: 1px solid var(--color-error-200);
  border-radius: var(--border-radius-md);
  padding: var(--space-3);
  font-size: 0.875rem;
  margin-bottom: var(--space-4);
`;

const FieldError = styled.div`
  color: var(--color-error-600);
  font-size: 0.75rem;
  margin-top: var(--space-1);
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: var(--space-2);
  align-items: flex-start;
  margin-top: var(--space-2);
`;

const Checkbox = styled.input`
  margin-top: 3px;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
`;

const SignUpButton = styled(Button)`
  margin-top: var(--space-2);
`;

const SignInPrompt = styled.div`
  text-align: center;
  margin-top: var(--space-6);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const SignInLink = styled(Link)`
  color: var(--color-primary-600);
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useApp();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Here you would typically call your registration API
      // For demo purposes, let's simulate a successful registration
      setTimeout(() => {
        // Mock user data
        const userData = {
          id: 'user-' + Math.floor(Math.random() * 10000),
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email
        };
        
        // Store user data in context
        setUser(userData);
        
        // Store a token in localStorage (in a real app)
        localStorage.setItem('authToken', 'mock-token-' + Math.random());
        
        // Redirect to dashboard
        navigate('/dashboard');
        
        setLoading(false);
      }, 1500);
    } catch (err) {
      setGeneralError('There was an error creating your account. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <SignUpCard>
        <Logo>
          <LogoIcon>📋</LogoIcon>
          <LogoText>TaskFlow</LogoText>
        </Logo>
        
        <Title>Create your account</Title>
        
        {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
              />
              {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
              {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <HelperText>Password must be at least 8 characters</HelperText>
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
          </FormGroup>
          
          <FormGroup>
            <CheckboxGroup>
              <Checkbox
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
              />
              <CheckboxLabel htmlFor="acceptTerms">
                I accept the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </CheckboxLabel>
            </CheckboxGroup>
            {errors.acceptTerms && <FieldError>{errors.acceptTerms}</FieldError>}
          </FormGroup>
          
          <SignUpButton 
            type="submit" 
            variant="primary" 
            fullWidth
            loading={loading}
          >
            Create Account
          </SignUpButton>
        </Form>
        
        <SignInPrompt>
          Already have an account? <SignInLink to="/login">Log in</SignInLink>
        </SignInPrompt>
      </SignUpCard>
    </PageContainer>
  );
};

export default SignUpPage;