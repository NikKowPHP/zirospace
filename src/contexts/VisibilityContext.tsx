// --- NEW FILE START ---
// File: src/contexts/VisibilityContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

interface VisibilityContextType {
  isOurProcessVisible: boolean;
  setIsOurProcessVisible: (isVisible: boolean) => void;
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

export const VisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [isOurProcessVisible, setIsOurProcessVisible] = useState(false);

  return (
    <VisibilityContext.Provider value={{ isOurProcessVisible, setIsOurProcessVisible }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = (): VisibilityContextType => {
  const context = useContext(VisibilityContext);
  if (context === undefined) {
    throw new Error('useVisibility must be used within a VisibilityProvider');
  }
  return context;
};
// --- NEW FILE END ---