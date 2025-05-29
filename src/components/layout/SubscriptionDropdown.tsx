import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { fetchAzureResources } from '../../services/azureApi';
import { loginRequest } from '../../config/msal';
import { useSubscription } from '../../context/SubscriptionContext';
import styles from './AzureNavigation.module.css';

interface Subscription {
  subscriptionId: string;
  displayName: string;
}

export const SubscriptionDropdown: React.FC = () => {
  const { instance, accounts } = useMsal();
  const { selectedSubscription, setSelectedSubscription } = useSubscription();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        const authResult = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0]
        });
        const data = await fetchAzureResources(authResult);
        setSubscriptions(data);
        if (data.length > 0) setSelectedSubscription(data[0]);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    getSubscriptions();
  }, [instance, accounts, setSelectedSubscription]);

  return (
    <div className={styles.subscriptionSection}>
      <button 
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedSubscription?.displayName || 'Select subscription'}
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {subscriptions.map(sub => (
            <div
              key={sub.subscriptionId}
              className={styles.dropdownItem}
              onClick={() => {
                setSelectedSubscription(sub);
                setIsOpen(false);
              }}
            >
              {sub.displayName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
