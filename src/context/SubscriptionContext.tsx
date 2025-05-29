import React, { createContext, useContext, useState } from 'react';

interface Subscription {
  subscriptionId: string;
  displayName: string;
}

interface SubscriptionContextType {
  selectedSubscription: Subscription | null;
  setSelectedSubscription: (sub: Subscription | null) => void;
  selectedNav: string | null;
  setSelectedNav: (nav: string | null) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [selectedNav, setSelectedNav] = useState<string | null>(null);

  return (
    <SubscriptionContext.Provider value={{
      selectedSubscription,
      setSelectedSubscription,
      selectedNav,
      setSelectedNav
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
};
