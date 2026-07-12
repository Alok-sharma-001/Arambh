import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface TourStep {
  target: string; // CSS selector of element to highlight
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  route: string; // Route where this step must take place
}

interface TourContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  steps: TourStep[];
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  highlightRect: DOMRect | null;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const TOUR_STEPS: TourStep[] = [
  {
    target: '#xp-badge',
    title: 'XP & Progression Tracker',
    content: 'Welcome to Arambh! Here is your daily XP tracker. Completing coding challenges and quiz quests earns you XP to level up your character.',
    placement: 'bottom',
    route: '/world-map',
  },
  {
    target: '#streak-counter',
    title: 'Maintain Your Streak',
    content: 'This is your daily coding streak! Solve at least one Python exercise every day to keep your learning streak burning bright.',
    placement: 'bottom',
    route: '/world-map',
  },
  {
    target: '#world-map-grid',
    title: 'The Python World Map',
    content: 'Your journey starts here. Explore different thematic Python chapters (like Variables, Loops, and Functions). Click any unlocked card to view lessons and start coding!',
    placement: 'top',
    route: '/world-map',
  },
  {
    target: '#navigation-bar',
    title: 'Library & Memory Vault',
    content: 'Use the bottom navigation bar to switch between the World Map, Python Library (documentation reference), Memory Vault (saved code snippets), and the Leaderboard.',
    placement: 'top',
    route: '/world-map',
  },
];

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Start tour automatically on mount for first-time visits once logged in (location is /map)
  useEffect(() => {
    const isCompleted = localStorage.getItem('arambh_tour_completed');
    // Only trigger if we are logged in and on the map page
    if (!isCompleted && location.pathname === '/world-map') {
      // Small timeout to allow map components to mount properly
      const startTimer = setTimeout(() => {
        setIsActive(true);
        setCurrentStepIndex(0);
      }, 1500);
      return () => clearTimeout(startTimer);
    }
  }, [location.pathname]);

  const currentStep = isActive && currentStepIndex < TOUR_STEPS.length ? TOUR_STEPS[currentStepIndex] : null;

  // Track the bounding rectangle of the target element dynamically
  useEffect(() => {
    if (!currentStep) {
      setHighlightRect(null);
      return;
    }

    // Ensure we are on the correct route first
    if (location.pathname !== currentStep.route) {
      navigate(currentStep.route);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(currentStep.target);
      if (el) {
        setHighlightRect(el.getBoundingClientRect());
      } else {
        // Element not found yet, retry or default to center
        setHighlightRect(null);
      }
    };

    updateRect();
    
    // Listen for resize/scroll events to keep highlight box perfectly aligned
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    
    // Polling selector in case the element loads with latency
    const pollInterval = setInterval(updateRect, 300);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      clearInterval(pollInterval);
    };
  }, [currentStep, location.pathname, navigate]);

  const startTour = () => {
    localStorage.removeItem('arambh_tour_completed');
    setIsActive(true);
    setCurrentStepIndex(0);
    if (location.pathname !== '/world-map') {
      navigate('/world-map');
    }
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const skipTour = () => {
    completeTour();
  };

  const completeTour = () => {
    setIsActive(false);
    setHighlightRect(null);
    localStorage.setItem('arambh_tour_completed', 'true');
  };

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        steps: TOUR_STEPS,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        highlightRect,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
