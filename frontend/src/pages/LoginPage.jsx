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

const LoginWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
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
  padding: var(--space-10);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 10;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
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
  margin: 0 0 var(--space-8) 0;
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.3s;
  animation-fill-mode: both;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
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

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: var(--space-2);
`;

const ForgotPasswordLink = styled(Link)`
  color: var(--color-primary-600);
  font-size: 0.875rem;
  text-decoration: none;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: var(--color-primary-600);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const LoginButton = styled(Button)`
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

const SignUpPrompt = styled.div`
  text-align: center;
  margin-top: var(--space-8);
  color: var(--color-text-secondary);
  font-size: 1rem;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.6s;
  animation-fill-mode: both;
`;

const SignUpLink = styled(Link)`
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

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useApp();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      setTimeout(() => {
        const userData = { id: 'user-123', name: 'Demo User', email: formData.email };
        setUser(userData);
        localStorage.setItem('authToken', 'mock-token-12345');
        navigate('/dashboard');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <Shape />
      <Shape />
      <Shape />
      
      <LoginWrapper>
        <BrandingSide>
          <BlobShape />
          <BlobShape />
          <BrandingTitle>Welcome Back!</BrandingTitle>
          <BrandingSubtitle>
            Log in to continue your journey of productivity and mindfulness. Your tasks and habits are waiting for you.
          </BrandingSubtitle>
        </BrandingSide>
        
        <FormSide>
          <Logo to="/">
            <LogoIcon>📋</LogoIcon>
            <LogoText>TaskFlow</LogoText>
          </Logo>
          
          <Title>Log In</Title>
          <Subtitle>Enter your credentials to access your account.</Subtitle>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="you@example.com" 
                required 
                autoComplete="email"
              />
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
                required 
                autoComplete="current-password"
              />
              <ForgotPassword>
                <ForgotPasswordLink to="/forgot-password">Forgot password?</ForgotPasswordLink>
              </ForgotPassword>
            </FormGroup>
            
            <LoginButton type="submit" variant="primary" fullWidth loading={loading}>
              Log In
            </LoginButton>
          </Form>
          
          <SignUpPrompt>
            Don't have an account? <SignUpLink to="/signup">Sign up for free</SignUpLink>
          </SignUpPrompt>
        </FormSide>
      </LoginWrapper>
    </PageContainer>
  );
};

export default LoginPage;