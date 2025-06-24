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

const LoginCard = styled.div`
  background-color: var(--color-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 420px;
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

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: var(--space-1);
`;

const ForgotPasswordLink = styled(Link)`
  color: var(--color-primary-600);
  font-size: 0.875rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled(Button)`
  margin-top: var(--space-2);
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: var(--space-4) 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  
  &::before,
  &::after {
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

const SignUpPrompt = styled.div`
  text-align: center;
  margin-top: var(--space-6);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const SignUpLink = styled(Link)`
  color: var(--color-primary-600);
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
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

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useApp();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Here you would typically call your authentication API
      // For demo purposes, let's simulate a successful login
      setTimeout(() => {
        // Mock user data
        const userData = {
          id: 'user-123',
          name: 'Demo User',
          email: formData.email
        };
        
        // Store user data in context
        setUser(userData);
        
        // Store a token in localStorage (in a real app)
        localStorage.setItem('authToken', 'mock-token-12345');
        
        // Redirect to dashboard
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
      <LoginCard>
        <Logo>
          <LogoIcon>📋</LogoIcon>
          <LogoText>TaskFlow</LogoText>
        </Logo>
        
        <Title>Log in to your account</Title>
        
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
            />
            <ForgotPassword>
              <ForgotPasswordLink to="/forgot-password">Forgot password?</ForgotPasswordLink>
            </ForgotPassword>
          </FormGroup>
          
          <LoginButton 
            type="submit" 
            variant="primary" 
            fullWidth
            loading={loading}
          >
            Log In
          </LoginButton>
        </Form>
        
        <Divider>or</Divider>
        
        <Button 
          variant="outline" 
          fullWidth
          onClick={() => navigate('/dashboard')}
        >
          Continue as Guest
        </Button>
        
        <SignUpPrompt>
          Don't have an account? <SignUpLink to="/signup">Sign up</SignUpLink>
        </SignUpPrompt>
      </LoginCard>
    </PageContainer>
  );
};

export default LoginPage;