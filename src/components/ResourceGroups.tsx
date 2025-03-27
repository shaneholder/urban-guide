import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import styles from './ResourceList.module.css';

interface ResourceGroup {
  id: string;
  name: string;
  location: string;
}

interface ResourceGroupsProps {
  subscriptionId: string;
}

const ResourceGroups = ({ subscriptionId }: ResourceGroupsProps) => {
  const { instance, accounts } = useMsal();
  const [resourceGroups, setResourceGroups] = useState<ResourceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResourceGroups = async () => {
      try {
        const authResult = await instance.acquireTokenSilent({
          scopes: ['https://management.azure.com/.default'],
          account: accounts[0]
        });

        const response = await fetch(
          `/api/subscriptions/${subscriptionId}/resourceGroups`,
          {
            headers: {
              Authorization: `Bearer ${authResult.accessToken}`
            }
          }
        );

        const data = await response.json();
        setResourceGroups(data.value);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch resource groups');
        setLoading(false);
      }
    };

    fetchResourceGroups();
  }, [subscriptionId, instance, accounts]);

  return (
    <div className={styles.resourceGroups}>
      <h3>Resource Groups</h3>
      {loading && <p>Loading resource groups...</p>}
      {error && <p>Error: {error}</p>}
      <ul className={styles.list}>
        {resourceGroups.map(group => (
          <li key={group.id} className={styles.listItem}>
            {group.name} - {group.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceGroups;
