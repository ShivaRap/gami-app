import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BottomNavContextType {
  isVisible: boolean;
  show: () => void;
  hide: () => void;
}

const BottomNavContext = createContext<BottomNavContextType | undefined>(undefined);

export function BottomNavProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  return (
    <BottomNavContext.Provider value={{ isVisible, show, hide }}>
      {children}
    </BottomNavContext.Provider>
  );
}

export function useBottomNav() {
  const context = useContext(BottomNavContext);
  if (context === undefined) {
    throw new Error('useBottomNav must be used within a BottomNavProvider');
  }
  return context;
}


