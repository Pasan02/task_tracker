import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-background), var(--color-surface));
  color: var(--color-text-primary);
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px var(--space-5) 80px;
  animation: ${fadeIn} 1s ease;

  @media (max-width: 768px) {
    padding: 80px var(--space-4) 60px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin: 0 0 var(--space-4) 0;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-success));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  max-width: 700px;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-8) 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const GetStartedButton = styled.button`
  background: var(--color-primary-500);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-6);
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const FeaturesSection = styled.section`
  padding: 100px var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-surface);

  @media (max-width: 768px) {
    padding: 60px var(--space-4);
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-8);
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
  max-width: 1200px;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: var(--color-card);
  border-radius: 16px;
  padding: var(--space-6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: ${props => props.$delay || '0s'};
  opacity: 0;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-4);
  animation: ${floatAnimation} 3s ease-in-out infinite;
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

const IllustrationSection = styled.section`
  padding: 100px var(--space-5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-8);

  @media (max-width: 768px) {
    padding: 60px var(--space-4);
    flex-direction: column;
  }
`;

const IllustrationContent = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  animation: ${fadeIn} 1s ease;
`;

const IllustrationTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-4);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const IllustrationDescription = styled.p`
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-5);
`;

const IllustrationImage = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 600px;
  height: 400px;
  background-color: var(--color-primary-100);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
`;

const CTASection = styled.section`
  padding: 100px var(--space-5);
  text-align: center;
  background: linear-gradient(45deg, var(--color-primary-700), var(--color-primary-500));
  color: white;

  @media (max-width: 768px) {
    padding: 60px var(--space-4);
  }
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--space-4);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto var(--space-6) auto;
  opacity: 0.9;
`;

const HomePage = () => {
  const navigate = useNavigate();
  const { setActiveRoute } = useApp();

  const handleGetStarted = () => {
    setActiveRoute('/dashboard');
    navigate('/dashboard');
  };

  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>TaskFlow</HeroTitle>
        <HeroSubtitle>
          Your personal productivity companion for managing tasks and building consistent habits
        </HeroSubtitle>
        <AuthButtons>
          <GetStartedButton onClick={() => navigate('/signup')}>
            Sign Up
          </GetStartedButton>
          <Button 
            variant="outline" 
            onClick={() => navigate('/login')}
            style={{ minWidth: '120px' }}
          >
            Log In
          </Button>
        </AuthButtons>
      </Hero>

      <FeaturesSection>
        <SectionTitle>Features</SectionTitle>
        <FeatureGrid>
          <FeatureCard $delay="0.1s">
            <FeatureIcon>📝</FeatureIcon>
            <FeatureTitle>Task Management</FeatureTitle>
            <FeatureDescription>
              Create, organize, and track your tasks with due dates, priorities, and custom categories. Keep your projects on schedule with visual status tracking.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard $delay="0.3s">
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Habit Tracker</FeatureTitle>
            <FeatureDescription>
              Build consistent habits by tracking daily and weekly goals. Visualize your streaks and celebrate your progress with intuitive calendar views.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard $delay="0.5s">
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Smart Dashboard</FeatureTitle>
            <FeatureDescription>
              Get a comprehensive overview of your tasks and habits. Visualize upcoming deadlines, overdue items, and track your productivity trends.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard $delay="0.7s">
            <FeatureIcon>🌙</FeatureIcon>
            <FeatureTitle>Dark Mode</FeatureTitle>
            <FeatureDescription>
              Reduce eye strain with our elegant dark mode. Seamlessly switch between light and dark themes based on your preference.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard $delay="0.9s">
            <FeatureIcon>📈</FeatureIcon>
            <FeatureTitle>Progress Stats</FeatureTitle>
            <FeatureDescription>
              Track your habit streaks and task completion rates. Analyze your productivity patterns and identify areas for improvement.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard $delay="1.1s">
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>Recurring Tasks</FeatureTitle>
            <FeatureDescription>
              Set up recurring tasks to automatically manage repeating to-dos without manual re-creation. Perfect for routine activities.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>

      <IllustrationSection>
        <IllustrationContent>
          <IllustrationTitle>Organize Your Life</IllustrationTitle>
          <IllustrationDescription>
            Stop juggling multiple apps and sticky notes. TaskFlow brings your tasks and habits together in one beautiful, intuitive interface designed to boost your productivity.
          </IllustrationDescription>
        </IllustrationContent>
        <IllustrationImage>
          📋✅
        </IllustrationImage>
      </IllustrationSection>

      <IllustrationSection style={{ flexDirection: 'row-reverse', backgroundColor: 'var(--color-surface)' }}>
        <IllustrationContent>
          <IllustrationTitle>Build Better Habits</IllustrationTitle>
          <IllustrationDescription>
            Building new habits is hard, but our intuitive tracking system makes it easier by showing your progress visually and helping you maintain streaks.
          </IllustrationDescription>
        </IllustrationContent>
        <IllustrationImage style={{ backgroundColor: 'var(--color-success-100)' }}>
          📅🔄
        </IllustrationImage>
      </IllustrationSection>

      <CTASection>
        <CTATitle>Ready to Get Organized?</CTATitle>
        <CTADescription>
          Start managing your tasks and building better habits today. Your more productive self awaits!
        </CTADescription>
        <GetStartedButton onClick={handleGetStarted}>
          Start Now
        </GetStartedButton>
      </CTASection>
    </HomeContainer>
  );
};

export default HomePage;