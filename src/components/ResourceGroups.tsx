import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../config/msal';
import styles from './ResourceGroups.module.css';
import AccessGroupCreate from './AccessGroupCreate';
import { useAuth } from '../hooks/useAuth';
import { fetchAzureResourceGroups } from '../services/azureApi';
import { AuthError } from '@azure/msal-browser';

interface ResourceGroup {
  id: string;
  name: string;
  location: string;
  type: string;
}

const ResourceGroups: React.FC<{ subscriptionId: string }> = ({ subscriptionId }) => {
  const { instance, accounts } = useMsal();
  const { handleAuthError } = useAuth();
  const [resourceGroups, setResourceGroups] = useState<ResourceGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showAccessCreate, setShowAccessCreate] = useState(false);

  useEffect(() => {
    const fetchResourceGroups = async () => {
      try {
        const token = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0]
        });
        const authResult = await instance.acquireTokenSilent({
                  ...loginRequest,
                  account: accounts[0]
                });
        const data = await fetchAzureResourceGroups(authResult, subscriptionId)
        
        setResourceGroups(data);
      } catch (error) {
        if (error instanceof AuthError) {
          await handleAuthError(error);
        } else {
          console.error('Error fetching resource groups:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResourceGroups();
  }, [subscriptionId, instance, accounts, handleAuthError]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedGroups(newSelected);
  };

  const toggleAll = () => {
    if (selectedGroups.size === resourceGroups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(resourceGroups.map(rg => rg.id)));
    }
  };

  const handleCreateAccess = () => {
    if (selectedGroups.size === 0) return;
    setShowAccessCreate(true);
  };

  if (showAccessCreate) {
    return (
      <AccessGroupCreate
        selectedGroups={Array.from(selectedGroups)}
        onCancel={() => setShowAccessCreate(false)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Resource Groups</h2>
        <div className={styles.actions}>
          <button 
            className={styles.button}
            onClick={handleCreateAccess}
            disabled={selectedGroups.size === 0}
          >
            Create Access Group
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.gridHeader}>
          <div className={styles.checkbox}>
            <input 
              type="checkbox"
              checked={selectedGroups.size === resourceGroups.length}
              onChange={toggleAll}
            />
          </div>
          <div>Name</div>
          <div>Location</div>
          <div>Type</div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading resource groups...</div>
        ) : (
          resourceGroups.map(group => (
            <div key={group.id} className={styles.gridRow}>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={selectedGroups.has(group.id)}
                  onChange={() => toggleSelection(group.id)}
                />
              </div>
              <div>{group.name}</div>
              <div>{group.location}</div>
              <div>{group.type}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResourceGroups;
