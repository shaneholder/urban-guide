import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { fetchAzureResources } from '../services/azureApi';
import { loginRequest } from '../config/msal';
import styles from './ResourceList.module.css';

interface Resource {
  id: string;
  displayName: string;
  type: string;
}

const ResourceList = () => {
  const { instance, accounts } = useMsal();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.error('Error fetching resources:', error);
        setError('Error fetching resources');
      } finally {
        setLoading(false);
      }
    };

    getResources();
  }, [instance, accounts]);

  return (
    <div className={styles.container}>
      <h2>Your Azure Resources</h2>
      {loading && <p>Loading resources...</p>}
      {error && <p>Error: {error}</p>}
      <ul className={styles.list}>
        {resources.map(resource => (
          <li key={resource.id} className={styles.listItem}>
            {resource.displayName} - {resource.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceList;
