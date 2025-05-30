import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { fetchAzureResources } from '../../services/azureApi';
import { loginRequest } from '../../config/msal';
import { useSubscription } from '../../context/SubscriptionContext';
import styles from './AzureNavigation.module.css';

export const SubscriptionDropdown = () => {
  const { instance, accounts } = useMsal();
  const { selectedSubscription, setSelectedSubscription } = useSubscription();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredSubscriptions = subscriptions
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .filter(sub => 
      sub.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
          <input
            type="search"
            placeholder="Search subscriptions..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className={styles.dropdownList}>
            {filteredSubscriptions.map(sub => (
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
        </div>
      )}
    </div>
  );
};
