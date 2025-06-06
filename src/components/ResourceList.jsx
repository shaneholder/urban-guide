import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { fetchAzureResources } from '../services/azureApi';
import { loginRequest } from '../config/msal';
import styles from './ResourceList.module.css';
import ResourceGroups from './ResourceGroups';
import { AzurePortalLayout } from './layout/AzurePortalLayout';

const ResourceList = () => {
  const { instance, accounts } = useMsal();
  const [subscriptions, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    const getResources = async () => {
      try {
        const authResult = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0]
        });
        const data = await fetchAzureResources(authResult);
        setResources(data);
      } catch (error) {
        if (error.response && error.response.status === 401 && error.response.data && error.response.data.reauth) {
          window.location.reload(); // Or redirect to login page
          return;
        }
        console.error('Error fetching resources:', error);
        setError('Error fetching resources');
      } finally {
        setLoading(false);
      }
    };

    getResources();
  }, [instance, accounts]);

  const handleSubscriptionClick = (subscription) => {
    setSelectedSubscription(subscription);
  };

  return (
    <AzurePortalLayout>
      
    </AzurePortalLayout>
  );
};

export default ResourceList;
