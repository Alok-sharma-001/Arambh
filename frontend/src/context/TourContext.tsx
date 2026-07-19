import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export interface TourStep {
  target: string; // CSS selector of element to highlight
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  steps: TourStep[];
  currentPageKey: string | null;
  startTour: () => void;
  startTourForCurrentPage: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  highlightRect: DOMRect | null;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const PAGE_TOURS: Record<string, TourStep[]> = {
  'world-map': [
    {
      target: '#xp-badge',
      title: 'Your Power Level',
      content: 'This is your XP tracker, warrior! Every lesson, boss battle, and challenge earns you experience points. Level up to unlock new regions and earn bragging rights!',
      placement: 'bottom',
    },
    {
      target: '#streak-counter',
      title: 'Daily Streak 🔥',
      content: 'Keep your fire burning! Solve at least one Python exercise daily to maintain your streak. The longer your streak, the more bonus XP you earn!',
      placement: 'bottom',
    },
    {
      target: '#world-map-grid',
      title: 'The Python Kingdom',
      content: 'Welcome to the World Map! Each card represents a region of the Python Kingdom — Variables Forest, Data Types Valley, Loops Desert, and more. Click any unlocked region to begin your adventure!',
      placement: 'top',
    },
    {
      target: '#navigation-bar',
      title: 'Navigate Your Journey',
      content: 'Use the navigation bar to explore different areas: Library for Python docs, Vault for saved code, Artifacts for boss rewards, Training Ground for practice, and your Dashboard for stats.',
      placement: 'top',
    },
    {
      target: '#region-detail-panel',
      title: 'Ready to Begin?',
      content: 'Click any region card to see its lessons and start learning Python visually. Your Squire will always be here to guide you — just click the ? button anytime!',
      placement: 'left',
    },
  ],
  'region': [
    {
      target: '#region-progress-bar',
      title: 'Region Progress',
      content: "This shows how far you've conquered this region! Complete all lessons to unlock the boss gate at the bottom.",
      placement: 'bottom',
    },
    {
      target: '#region-lesson-nodes',
      title: 'Lesson Waypoints',
      content: "Each glowing node is a lesson. Green means completed, purple means you're here now, and gray means locked. Click an unlocked node to start learning!",
      placement: 'top',
    },
    {
      target: '#region-boss-gate',
      title: 'The Boss Gate ⚔️',
      content: 'Defeat all lessons to unlock the boss battle! Beat the guardian to earn a rare artifact and unlock the next region.',
      placement: 'top',
    },
    {
      target: '#region-back-button',
      title: 'Return to the Map',
      content: 'Click here to go back to the World Map anytime. Your progress is saved automatically!',
      placement: 'bottom',
    },
  ],
  'lesson': [
    {
      target: '#lesson-code-editor',
      title: 'The Code Scroll 📜',
      content: "This is the Python code for this lesson. Watch each line carefully — you'll step through it one line at a time like a real debugger!",
      placement: 'bottom',
    },
    {
      target: '#lesson-execution-panel',
      title: 'Line-by-Line Execution',
      content: "Each time you click 'Run Line', the Squire explains exactly what Python does with that line. Read the action and the 'why' to build your mental model!",
      placement: 'bottom',
    },
    {
      target: '#lesson-memory-viewer',
      title: 'Live Memory Viewer 🧠',
      content: "This is Python's brain! Watch variables appear, change, and update in real-time as you step through the code. This is how Python actually remembers things.",
      placement: 'top',
    },
    {
      target: '#lesson-output-console',
      title: 'Output Console',
      content: "This is what Python prints to the screen. Compare it with what you expected — that's the key to debugging!",
      placement: 'top',
    },
    {
      target: '#lesson-run-button',
      title: 'Step Through the Code',
      content: "Click 'Run Line' to execute the next line. When you've stepped through all lines, click 'Complete' to earn your XP and unlock the next lesson!",
      placement: 'top',
    },
  ],
  'library': [
    {
      target: '#library-search',
      title: 'Search the Archives',
      content: 'Need to look up a Python concept? Type here to search through all available topics and code examples.',
      placement: 'bottom',
    },
    {
      target: '#library-topics',
      title: 'Browse by Topic',
      content: 'Browse organized topics like Variables, Loops, Functions, and more. Each topic contains reference material and code snippets.',
      placement: 'bottom',
    },
    {
      target: '#library-content',
      title: 'Reference & Examples',
      content: 'Read explanations and study code examples. Bookmark anything you want to revisit later in the Memory Vault!',
      placement: 'top',
    },
  ],
  'training': [
    {
      target: '#training-question',
      title: 'The Challenge',
      content: 'Read the question carefully. Each challenge tests a concept you learned in the lessons. Think before you answer!',
      placement: 'bottom',
    },
    {
      target: '#training-options',
      title: 'Choose Your Answer',
      content: 'Select the option you think is correct. Some questions have code snippets — trace through them mentally before choosing.',
      placement: 'bottom',
    },
    {
      target: '#training-submit',
      title: 'Submit & Learn',
      content: "Hit submit to check your answer. Whether you're right or wrong, you'll get an explanation to deepen your understanding!",
      placement: 'top',
    },
  ],
  'vault': [
    {
      target: '#vault-collection',
      title: 'Your Memory Vault',
      content: "This is your personal collection of saved code snippets and concepts. Think of it as your spellbook — everything you've learned lives here!",
      placement: 'bottom',
    },
    {
      target: '#vault-review',
      title: 'Review & Practice',
      content: 'Click any saved item to review it. Spaced repetition is the secret to mastering Python — revisit old concepts to keep them fresh!',
      placement: 'top',
    },
  ],
  'artifacts': [
    {
      target: '#artifacts-collection',
      title: 'Your Trophy Room 🏆',
      content: 'Every region boss you defeat drops a legendary artifact. Collect all 10 to unlock the final Boss Gate Saga!',
      placement: 'bottom',
    },
    {
      target: '#artifacts-detail',
      title: 'Artifact Powers',
      content: 'Each artifact represents mastery of a Python domain. Hover over any artifact to see what you conquered to earn it!',
      placement: 'top',
    },
  ],
  'dashboard': [
    {
      target: '#dashboard-overview',
      title: 'Your Adventure Stats',
      content: "Here's your character overview — XP earned, level, class, and overall progress through the Python Kingdom. Keep pushing forward!",
      placement: 'bottom',
    },
    {
      target: '#dashboard-goals',
      title: 'Daily Quests',
      content: 'Complete daily goals to earn bonus XP and keep your streak alive. Small daily wins build massive Python knowledge over time!',
      placement: 'bottom',
    },
    {
      target: '#dashboard-activity',
      title: 'Recent Activity',
      content: "Track your latest completed lessons, challenges, and achievements. See how far you've come on your journey!",
      placement: 'top',
    },
  ],
  'leaderboard': [
    {
      target: '#leaderboard-rankings',
      title: 'Global Rankings ⚡',
      content: 'See how you stack up against other warriors in the Python Kingdom! Rankings are based on XP earned from lessons, bosses, and challenges.',
      placement: 'bottom',
    },
    {
      target: '#leaderboard-filters',
      title: 'Filter & Compete',
      content: 'Filter by time period or category to find your niche. Can you reach the top of the weekly leaderboard?',
      placement: 'bottom',
    },
  ],
};

export const getPageKey = (pathname: string): string | null => {
  if (pathname === '/world-map') return 'world-map';
  if (pathname.startsWith('/region/')) return 'region';
  if (pathname.startsWith('/lesson/')) return 'lesson';
  if (pathname === '/library') return 'library';
  if (pathname.startsWith('/training/') || pathname.startsWith('/challenge/')) return 'training';
  if (pathname === '/vault') return 'vault';
  if (pathname === '/artifacts') return 'artifacts';
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname === '/leaderboard') return 'leaderboard';
  return null;
};

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [currentPageKey, setCurrentPageKey] = useState<string | null>(null);

  const location = useLocation();

  const activePageKey = getPageKey(location.pathname);
  const activeSteps = activePageKey ? PAGE_TOURS[activePageKey] || [] : [];

  // Auto-start tour on first visit to a page
  useEffect(() => {
    setCurrentPageKey(activePageKey);

    if (!activePageKey || activeSteps.length === 0) {
      setIsActive(false);
      return;
    }

    const storageKey = `arambh_tour_${activePageKey}_completed`;
    const isCompleted = localStorage.getItem(storageKey);

    // If legacy key exists for world-map, mark arambh_tour_world-map_completed
    if (activePageKey === 'world-map' && localStorage.getItem('arambh_tour_completed') && !isCompleted) {
      localStorage.setItem(storageKey, 'true');
      return;
    }

    if (!isCompleted) {
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStepIndex(0);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsActive(false);
    }
  }, [location.pathname, activePageKey]);

  const currentStep = isActive && currentStepIndex < activeSteps.length ? activeSteps[currentStepIndex] : null;

  // Track the bounding rectangle of the target element dynamically
  useEffect(() => {
    if (!currentStep) {
      setHighlightRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(currentStep.target);
      if (el) {
        setHighlightRect(el.getBoundingClientRect());
      } else {
        setHighlightRect(null);
      }
    };

    updateRect();

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    const pollInterval = setInterval(updateRect, 300);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      clearInterval(pollInterval);
    };
  }, [currentStep, location.pathname]);

  const completeTour = useCallback(() => {
    setIsActive(false);
    setHighlightRect(null);
    if (activePageKey) {
      localStorage.setItem(`arambh_tour_${activePageKey}_completed`, 'true');
    }
  }, [activePageKey]);

  const startTourForCurrentPage = useCallback(() => {
    if (!activePageKey || activeSteps.length === 0) return;
    localStorage.removeItem(`arambh_tour_${activePageKey}_completed`);
    setIsActive(true);
    setCurrentStepIndex(0);
  }, [activePageKey, activeSteps]);

  const startTour = useCallback(() => {
    startTourForCurrentPage();
  }, [startTourForCurrentPage]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStepIndex, activeSteps.length, completeTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    completeTour();
  }, [completeTour]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep,
        steps: activeSteps,
        currentPageKey: activePageKey,
        startTour,
        startTourForCurrentPage,
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
