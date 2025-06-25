import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common';

// Keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Main container
const HomeContainer = styled.div`
  background-color: var(--color-background);
  color: var(--color-text-primary);
  overflow-x: hidden;
`;

// Header
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: var(--space-4) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.3s ease;

  .dark-mode & {
    background: rgba(17, 24, 39, 0.8);
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-500);
`;

const NavActions = styled.div`
  display: flex;
  gap: var(--space-3);
`;

// Hero Section
const HeroSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 90vh;
  padding: var(--space-10) var(--space-5);
  background: linear-gradient(135deg, var(--color-background), var(--color-surface));
`;

const HeroContent = styled.div`
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
`;

const HeroTitle = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  margin: 0 0 var(--space-4) 0;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-success-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 650px;
  color: var(--color-text-secondary);
  margin: 0 auto var(--space-8) auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const GetStartedButton = styled.button`
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  border: none;
  padding: var(--space-4) var(--space-8);
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(59, 130, 246, 0.4);
  }
`;

// Animated background shapes
const AnimatedShape = styled.div`
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
    top: 20%;
    right: 20%;
    animation-duration: 8s;
    animation-delay: 2s;
  }
  &:nth-child(3) {
    width: 150px;
    height: 150px;
    bottom: 15%;
    left: 25%;
    animation-duration: 10s;
  }
  &:nth-child(4) {
    width: 50px;
    height: 50px;
    bottom: 10%;
    right: 10%;
    animation-duration: 6s;
    animation-delay: 1s;
  }
`;

// Generic Section
const Section = styled.section`
  padding: var(--space-10) var(--space-6);
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: var(--space-8);
  color: var(--color-text-primary);
`;

// Features Section
const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--space-6);
  text-align: left;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent 40%);
    transform: scale(0);
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary-300);
  }

  &:hover:before {
    transform: scale(1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-success-500));
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-md);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-3);
`;

const FeatureDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

// Showcase Section
const ShowcaseSection = styled(Section)`
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  flex-wrap: wrap;
  text-align: left;

  &:nth-of-type(odd) {
    flex-direction: row-reverse;
  }
`;

const ShowcaseContent = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 500px;
`;

const ShowcaseImage = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  height: 350px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);
  transition: transform 0.5s ease;

  ${ShowcaseSection}:nth-of-type(odd) & {
    transform: perspective(1000px) rotateY(10deg) rotateX(5deg);
  }

  &:hover {
    transform: perspective(1000px) rotateY(0) rotateX(0);
  }
`;

// Mock UI elements for showcase
const MockHeader = styled.div`
  height: 30px;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  padding: 0 var(--space-3);
  gap: var(--space-2);
`;

const MockDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const MockContent = styled.div`
  flex: 1;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-sm);
`;

// CTA Section
const CTASection = styled(Section)`
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
  color: white;
  border-radius: 20px;
  margin: var(--space-10) var(--space-6);
  padding: var(--space-8);
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-4);
`;

const CTADescription = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto var(--space-6) auto;
  opacity: 0.9;
`;

// Footer
const Footer = styled.footer`
  padding: var(--space-6);
  text-align: center;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
`;

const HomePage = () => {
  const navigate = useNavigate();
  const { setActiveRoute } = useApp();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <HomeContainer>
      <Header>
        <Logo>TaskFlow</Logo>
        <NavActions>
          <Button variant="secondary" onClick={() => navigate('/login')}>Log In</Button>
          <Button variant="primary" onClick={() => navigate('/signup')}>Sign Up</Button>
        </NavActions>
      </Header>

      <HeroSection>
        <AnimatedShape />
        <AnimatedShape />
        <AnimatedShape />
        <AnimatedShape />
        <HeroContent>
          <HeroTitle>Unleash Your Productivity</HeroTitle>
          <HeroSubtitle>
            TaskFlow is your all-in-one solution to organize tasks, build lasting habits, and achieve your goals with clarity and focus.
          </HeroSubtitle>
          <GetStartedButton onClick={handleGetStarted}>
            Get Started for Free
          </GetStartedButton>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionTitle>Everything You Need to Succeed</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>📝</FeatureIcon>
            <FeatureTitle>Intuitive Task Management</FeatureTitle>
            <FeatureDescription>Create, categorize, and prioritize tasks effortlessly. Stay on top of your deadlines with smart reminders.</FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Powerful Habit Tracker</FeatureTitle>
            <FeatureDescription>Build positive habits with our visual tracker. Monitor your streaks and stay motivated on your journey.</FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Insightful Analytics</FeatureTitle>
            <FeatureDescription>Get a clear overview of your progress. Understand your productivity patterns and make data-driven improvements.</FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <ShowcaseSection>
        <ShowcaseContent>
          <SectionTitle style={{textAlign: 'left', fontSize: '2.5rem'}}>Organize Your Life</SectionTitle>
          <FeatureDescription>Stop juggling multiple apps and sticky notes. TaskFlow brings your tasks and habits together in one beautiful, intuitive interface designed to boost your productivity.</FeatureDescription>
        </ShowcaseContent>
        <ShowcaseImage>
          <MockHeader>
            <MockDot color="#ef4444" />
            <MockDot color="#f59e0b" />
            <MockDot color="#10b981" />
          </MockHeader>
          <MockContent />
        </ShowcaseImage>
      </ShowcaseSection>
      
      <ShowcaseSection>
        <ShowcaseContent>
          <SectionTitle style={{textAlign: 'left', fontSize: '2.5rem'}}>Build Better Habits</SectionTitle>
          <FeatureDescription>Building new habits is hard, but our intuitive tracking system makes it easier by showing your progress visually and helping you maintain streaks.</FeatureDescription>
        </ShowcaseContent>
        <ShowcaseImage>
          <MockHeader>
            <MockDot color="#ef4444" />
            <MockDot color="#f59e0b" />
            <MockDot color="#10b981" />
          </MockHeader>
          <MockContent />
        </ShowcaseImage>
      </ShowcaseSection>

      <CTASection>
        <CTATitle>Ready to Get Organized?</CTATitle>
        <CTADescription>
          Start managing your tasks and building better habits today. Your more productive self awaits!
        </CTADescription>
        <GetStartedButton onClick={handleGetStarted}>
          Start Now
        </GetStartedButton>
      </CTASection>

      <Footer>
        <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
      </Footer>
    </HomeContainer>
  );
};

export default HomePage;