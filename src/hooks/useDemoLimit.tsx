
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface DemoLimitContextType {
  demoSearchCount: number;
  incrementDemoCount: () => void;
  resetDemoCount: () => void;
  isDemoLimitReached: boolean;
  remainingDemoSearches: number;
}

const DemoLimitContext = createContext<DemoLimitContextType | undefined>(undefined);

export const useDemoLimit = () => {
  const context = useContext(DemoLimitContext);
  if (context === undefined) {
    throw new Error('useDemoLimit must be used within a DemoLimitProvider');
  }
  return context;
};

interface DemoLimitProviderProps {
  children: ReactNode;
}

const DEMO_SEARCH_LIMIT = 5;
const DEMO_COUNT_KEY = 'demoSearchCount';

export const DemoLimitProvider = ({ children }: DemoLimitProviderProps) => {
  const [demoSearchCount, setDemoSearchCount] = useState(0);
  const { user } = useAuth();

  // Load demo count from sessionStorage on mount
  useEffect(() => {
    const savedCount = sessionStorage.getItem(DEMO_COUNT_KEY);
    if (savedCount) {
      setDemoSearchCount(parseInt(savedCount, 10));
    }
  }, []);

  // Save demo count to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(DEMO_COUNT_KEY, demoSearchCount.toString());
  }, [demoSearchCount]);

  // Reset demo count when user authenticates
  useEffect(() => {
    if (user) {
      resetDemoCount();
    }
  }, [user]);

  const incrementDemoCount = () => {
    if (!user && demoSearchCount < DEMO_SEARCH_LIMIT) {
      setDemoSearchCount(prev => prev + 1);
    }
  };

  const resetDemoCount = () => {
    setDemoSearchCount(0);
    sessionStorage.removeItem(DEMO_COUNT_KEY);
  };

  const isDemoLimitReached = !user && demoSearchCount >= DEMO_SEARCH_LIMIT;
  const remainingDemoSearches = Math.max(0, DEMO_SEARCH_LIMIT - demoSearchCount);

  const value = {
    demoSearchCount,
    incrementDemoCount,
    resetDemoCount,
    isDemoLimitReached,
    remainingDemoSearches,
  };

  return <DemoLimitContext.Provider value={value}>{children}</DemoLimitContext.Provider>;
};
