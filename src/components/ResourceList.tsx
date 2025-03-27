import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { fetchAzureResources } from '../services/azureApi';
import { loginRequest } from '../config/msal';

interface Resource {
  id: string;
  displayName: string;
  type: string;
}

const ResourceList = () => {
  const { instance, accounts } = useMsal();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    getResources();
  }, [instance, accounts]);

  if (loading) return <div>Loading resources...</div>;

  return (
    <div>
      <h2>Your Azure Resources</h2>
      <ul>
        {resources.map(resource => (
          <li key={resource.id}>{resource.displayName} - {resource.type}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceList;
