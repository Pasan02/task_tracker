import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-background), var(--color-surface));
  padding: var(--space-5);
  position: relative;
  overflow: hidden;
`;

const SignUpWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 1000px;
  min-height: 650px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out;
  z-index: 10;

  .dark-mode & {
    background-color: rgba(30, 41, 59, 0.8);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BrandingSide = styled.div`
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-900));
  color: white;
  padding: var(--space-10);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
    z-index: 1;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const BrandingTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: var(--space-6);
  position: relative;
  z-index: 2;
  
  background: linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0.8));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BrandingSubtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.9;
  position: relative;
  z-index: 2;
`;

const BlobShape = styled.div`
  position: absolute;
  width: 350px;
  height: 350px;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  animation: ${float} 8s ease-in-out infinite;
  z-index: 1;

  &:nth-child(1) {
    top: -100px;
    right: -50px;
    animation-duration: 12s;
  }

  &:nth-child(2) {
    bottom: -100px;
    left: -50px;
    width: 300px;
    height: 300px;
    animation-duration: 10s;
    animation-delay: 2s;
    opacity: 0.7;
  }
`;

const FormSide = styled.div`
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  position: relative;
  z-index: 10;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-success-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Title = styled.h2`
  margin: 0 0 var(--space-2) 0;
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`;

const Subtitle = styled.p`
  margin: 0 0 var(--space-6) 0;
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
`;

const FormRow = styled.div`
  display: flex;
  gap: var(--space-4);
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--space-4);
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: color 0.2s ease;
`;

const Input = styled.input`
  padding: var(--space-4) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  font-size: 1.05rem;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  
  .dark-mode & {
    background-color: rgba(30, 41, 59, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px var(--color-focus), 0 4px 12px rgba(0,0,0,0.05);
    transform: translateY(-2px);
  }
`;

const FieldError = styled.div`
  color: var(--color-error-600);
  font-size: 0.8rem;
  margin-top: var(--space-1);
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary-500);
  margin-top: 2px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  
  a {
    color: var(--color-primary-600);
    font-weight: 500;
    text-decoration: none;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 0;
      height: 1px;
      background-color: var(--color-primary-600);
      transition: width 0.3s ease;
    }
    
    &:hover::after {
      width: 100%;
    }
  }
`;

const SignUpButton = styled(Button)`
  margin-top: var(--space-4);
  padding: var(--space-4) var(--space-4);
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: var(--border-radius-lg);
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 150%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }
`;

const SignInPrompt = styled.div`
  text-align: center;
  margin-top: var(--space-8);
  color: var(--color-text-secondary);
  font-size: 1rem;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.6s;
  animation-fill-mode: both;
`;

const SignInLink = styled(Link)`
  color: var(--color-primary-600);
  font-weight: 600;
  text-decoration: none;
  margin-left: var(--space-1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-primary-600);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error-600);
  background-color: var(--color-error-100);
  border-left: 4px solid var(--color-error-500);
  border-radius: var(--border-radius-md);
  padding: var(--space-4);
  font-size: 0.95rem;
  margin-bottom: var(--space-4);
  animation: ${fadeIn} 0.5s ease-out;
`;

// Background floating shapes
const Shape = styled.div`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--color-primary-300), var(--color-success-300));
  opacity: 0.1;
  animation: ${float} infinite ease-in-out;
  z-index: 1;

  .dark-mode & {
    opacity: 0.2;
  }

  &:nth-child(1) {
    width: 200px;
    height: 200px;
    top: 10%;
    left: 15%;
    animation-duration: 12s;
  }
  &:nth-child(2) {
    width: 100px;
    height: 100px;
    top: 30%;
    right: 20%;
    animation-duration: 8s;
    animation-delay: 2s;
  }
  &:nth-child(3) {
    width: 150px;
    height: 150px;
    bottom: 15%;
    left: 15%;
    animation-duration: 10s;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin-top: var(--space-6);
  margin-bottom: var(--space-4);
  color: var(--color-text-secondary);
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--color-border);
  }
  
  &::before {
    margin-right: var(--space-4);
  }
  
  &::after {
    margin-left: var(--space-4);
  }
`;

const GuestButton = styled.button`
  width: 100%;
  padding: var(--space-3);
  background: transparent;
  border: 1px dashed var(--color-primary-300);
  color: var(--color-text-secondary);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &:hover {
    background-color: var(--color-primary-50);
    color: var(--color-primary-600);
    border-color: var(--color-primary-400);
  }
`;

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useApp();
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);
    if (!validateForm()) return;
    setLoading(true);
    
    try {
      setTimeout(() => {
        const userData = { id: 'user-' + Math.random(), name: `${formData.firstName} ${formData.lastName}`, email: formData.email };
        setUser(userData);
        localStorage.setItem('authToken', 'mock-token-' + Math.random());
        navigate('/dashboard');
        setLoading(false);
      }, 1500);
    } catch (err) {
      setGeneralError('Error creating account. Please try again.');
      setLoading(false);
    }
  };
  
  const handleContinueAsGuest = () => {
    // Create a generic guest user
    const guestUser = { 
      id: 'guest-' + Math.random(), 
      name: 'Guest User', 
      email: 'guest@example.com',
      isGuest: true
    };
    
    // Set user in context
    setUser(guestUser);
    
    // Store a temporary token
    localStorage.setItem('guestToken', 'guest-session-' + Math.random());
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  return (
    <PageContainer>
      <Shape />
      <Shape />
      <Shape />

      <SignUpWrapper>
        <BrandingSide>
          <BlobShape />
          <BlobShape />
          <BrandingTitle>Start Your Productivity Journey</BrandingTitle>
          <BrandingSubtitle>
            Join a community of achievers. Organize your life, build better habits, and unlock your full potential with TaskFlow.
          </BrandingSubtitle>
        </BrandingSide>
        
        <FormSide>
          <Logo to="/">
            <LogoIcon>📋</LogoIcon>
            <LogoText>TaskFlow</LogoText>
          </Logo>
          
          <Title>Create Your Account</Title>
          <Subtitle>It only takes a minute to begin your productivity journey.</Subtitle>
          
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
                  autoComplete="given-name"
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
                  autoComplete="family-name"
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
                autoComplete="email"
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
                autoComplete="new-password"
              />
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
                autoComplete="new-password"
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
            
            <SignUpButton type="submit" variant="primary" fullWidth loading={loading}>
              Create Free Account
            </SignUpButton>
          </Form>
          
          <Divider>or</Divider>
          
          <GuestButton type="button" onClick={handleContinueAsGuest}>
            Continue as Guest
          </GuestButton>
          
          <SignInPrompt>
            Already have an account? <SignInLink to="/login">Log in</SignInLink>
          </SignInPrompt>
        </FormSide>
      </SignUpWrapper>
    </PageContainer>
  );
};

export default SignUpPage;