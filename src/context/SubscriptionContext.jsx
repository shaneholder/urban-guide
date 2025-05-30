import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext(undefined);

export const SubscriptionProvider = ({ children }) => {
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedNav, setSelectedNav] = useState(null);

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
