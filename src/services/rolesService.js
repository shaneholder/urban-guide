
/**
 * @typedef {Object} AzureRole
 * @property {string} id
 * @property {string} roleName
 * @property {string} description
 * @property {string} type
 */

export const fetchAzureRoles = async (authToken) => {
  const response = await fetch('/api/roles', {
    headers: {
      'Authorization': `Bearer ${authToken.accessToken}`
    }
  });
  return response.json();
};
