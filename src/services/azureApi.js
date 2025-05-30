export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

const handleApiResponse = async (response) => {
  if (response.status === 401) {
    const error = await response.json();
    if (error.code === 'TOKEN_EXPIRED') {
      throw new AuthError('TOKEN_EXPIRED');
    }
  }
  return response.json();
};

export const fetchAzureResources = async (authResult) => {
  const response = await fetch('/api/resources', {
    headers: {
      'Authorization': `Bearer ${authResult.accessToken}`
    }
  });
  return handleApiResponse(response);
};

export const fetchAzureResourceGroups = async (authResult, subscriptionId) => {
  const response = await fetch(`/api/subscriptions/${subscriptionId}/resourceGroups`, {
    headers: {
      'Authorization': `Bearer ${authResult.accessToken}`
    }
  });

  return handleApiResponse(response);
};

/**
 * @typedef {Object} AzureRole
 * @property {string} id
 * @property {string} roleName
 * @property {string} description
 * @property {string} type
 */

export const fetchAzureRoles = async (authResult) => {
  const response = await fetch('/api/roles', {
    headers: {
      'Authorization': `Bearer ${authResult.accessToken}`
    }
  });
  return response.json();
};
