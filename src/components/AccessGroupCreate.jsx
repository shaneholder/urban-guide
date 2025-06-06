import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../config/msal';
import { fetchAzureRoles } from '../services/rolesService';
import styles from './AccessGroupCreate.module.css';

const AccessGroupCreate = ({ selectedGroups, onCancel, selectedSubscription }) => {
  const { instance, accounts } = useMsal();
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const token = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0]
        });
        const rolesData = await fetchAzureRoles(token);
        setRoles(rolesData);
      } catch (error) {
        if (error.response && error.response.status === 401 && error.response.data && error.response.data.reauth) {
          window.location.reload(); // Or redirect to login page
          return;
        }
        console.error('Error loading roles:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, [instance, accounts]);

  const filteredRoles = roles
    .sort((a, b) => a.roleName.localeCompare(b.roleName))
    .filter(role =>
      role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Extract prefix from selectedSubscription
  let subscriptionPrefix = "";
  if (selectedSubscription && typeof selectedSubscription === 'string') {
    subscriptionPrefix = selectedSubscription.split('_')[0];
  } else if (selectedSubscription && selectedSubscription.subscriptionId) {
    subscriptionPrefix = selectedSubscription.subscriptionId.split('_')[0];
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Create Access Group</h2>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
          <button className={styles.createButton}>Create</button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3>Selected Resource Groups</h3>
          <ul className={styles.groupList}>
            {selectedGroups.map(group => (
              <li key={group}>{group}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3>Select Role</h3>
          <input
            type="search"
            placeholder="Search roles..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {loading ? (
            <div className={styles.loading}>Loading roles...</div>
          ) : (
            <div className={styles.rolesList}>
              {filteredRoles.map(role => (
                <div 
                  key={role.id} 
                  className={`${styles.roleItem} ${selectedRole === role.id ? styles.selected : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className={styles.roleName}>{role.roleName}</div>
                  <div className={styles.roleDescription}>{role.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h3>Resulting Group ID</h3>
          <input
            type="text"
            value={subscriptionPrefix && groupName ? `${subscriptionPrefix}_${groupName}` : ""}
            readOnly
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
};

export default AccessGroupCreate;
